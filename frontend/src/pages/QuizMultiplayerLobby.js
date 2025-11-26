import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Grid,
  Avatar,
  Chip,
  Alert,
  Divider,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  CircularProgress
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  ExitToApp as ExitIcon,
  ContentCopy as CopyIcon,
  People as PeopleIcon,
  EmojiEvents as TrophyIcon
} from '@mui/icons-material';
import socketService from '../services/socket';
import sessionService from '../services/sessionService';

// 🆕 Constante para limite de tentativas (deve coincidir com sessionService)
const MAX_RECONNECTION_ATTEMPTS = 3;

function QuizMultiplayerLobby() {
  const { roomCode } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [players, setPlayers] = useState([]);
  const [isHost, setIsHost] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [gameStarting, setGameStarting] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);

  // 🆕 useRef para evitar múltiplas inicializações
  const isInitialized = useRef(false);
  const listenersSetup = useRef(false);

  // 🆕 Configurar listeners sem useCallback para evitar closures desatualizados
  const setupSocketListeners = () => {
    // Evitar configurar listeners múltiplas vezes
    if (listenersSetup.current) {
      console.log('⚠️ Listeners já configurados, pulando...');
      return;
    }
    
    console.log('🎧 Configurando listeners do Socket.io...');
    listenersSetup.current = true;

    // 🔧 DEBUG: Logar TODOS os eventos recebidos
    const socket = socketService.getSocket();
    socket.onAny((eventName, ...args) => {
      console.log(`📡 [SOCKET RECEBEU] Evento: ${eventName}`, args);
    });

    // Jogador entrou - SEMPRE usa os dados mais recentes do evento, não do closure
    socketService.onPlayerJoined((data) => {
      console.log('🔔🔔🔔 [LOBBY] ========== EVENTO PLAYER_JOINED RECEBIDO ==========');
      console.log('✅ [LOBBY] Timestamp:', new Date().toISOString());
      console.log('✅ [LOBBY] Data completo:', JSON.stringify(data, null, 2));
      console.log('✅ [LOBBY] Player que entrou:', data.player);
      console.log('✅ [LOBBY] Room code:', data.room?.code);
      console.log('✅ [LOBBY] Jogadores na sala:', data.room?.players);
      console.log('✅ [LOBBY] Quantidade de players:', data.room?.players?.length);
      
      if (data.room && data.room.players) {
        console.log('✅ [LOBBY] Validação OK - Atualizando estado com', data.room.players.length, 'players');
        console.log('✅ [LOBBY] Lista de players recebida:', data.room.players.map(p => p.name).join(', '));
        
        // 🔧 CORRIGIDO: Usar função de atualização para garantir que sempre temos o estado mais recente
        setRoom(prevRoom => {
          console.log('📊 [LOBBY] Estado anterior tinha', prevRoom?.players?.length || 0, 'players');
          console.log('📊 [LOBBY] Novo estado tem', data.room.players.length, 'players');
          console.log('📊 [LOBBY] Players anteriores:', prevRoom?.players?.map(p => p.name).join(', ') || 'nenhum');
          console.log('📊 [LOBBY] Players novos:', data.room.players.map(p => p.name).join(', '));
          return data.room;
        });
        
        setPlayers(prevPlayers => {
          console.log('📊 [LOBBY] Players anterior (array):', prevPlayers?.length || 0);
          console.log('📊 [LOBBY] Players novo (array):', data.room.players.length);
          return data.room.players;
        });
        
        console.log('✅✅✅ [LOBBY] Estado atualizado com sucesso!');
        console.log('🔔🔔🔔 [LOBBY] ========== FIM DO PROCESSAMENTO ==========');
      } else {
        console.error('❌❌❌ [LOBBY] ERRO: Evento player_joined sem room ou players válido!');
        console.error('❌ [LOBBY] data.room:', data.room);
        console.error('❌ [LOBBY] data.room.players:', data.room?.players);
      }
    });

    // Jogador saiu
    socketService.onPlayerLeft((data) => {
      console.log('Jogador saiu:', data);
      if (data.room) {
        setRoom(data.room);
        setPlayers(data.room.players || []);
      }
    });

    // Jogador reconectou
    socketService.onPlayerReconnected((data) => {
      console.log('Jogador reconectou:', data);
      if (data.room) {
        setRoom(data.room);
        setPlayers(data.room.players || []);
      }
    });

    // 🆕 NOVO: Room atualizada (resolve BUG 1)
    socketService.onRoomUpdated((data) => {
      console.log('🔔 [LOBBY] ========== EVENTO ROOM_UPDATED RECEBIDO ==========');
      console.log('✅ [LOBBY] Timestamp:', new Date().toISOString());
      console.log('✅ [LOBBY] Data completo:', JSON.stringify(data, null, 2));
      console.log('✅ [LOBBY] Room:', data.room);
      console.log('✅ [LOBBY] Players:', data.room?.players);
      console.log('✅ [LOBBY] Quantidade:', data.room?.players?.length);
      
      if (data.room && data.room.players) {
        console.log('✅ [LOBBY] Atualizando estado com room_updated');
        setRoom(prevRoom => {
          console.log('📊 [LOBBY] Anterior:', prevRoom?.players?.length || 0, 'players');
          console.log('📊 [LOBBY] Novo:', data.room.players.length, 'players');
          return data.room;
        });
        setPlayers(data.room.players);
        console.log('✅✅✅ [LOBBY] Estado atualizado via room_updated!');
      }
    });

    // Reconexão bem-sucedida (para o próprio jogador)
    socketService.getSocket().on('reconnect_success', (data) => {
      console.log('✅ Reconexão confirmada:', data);
      setRoom(data.room);
      setPlayers(data.room.players || []);
      setIsHost(data.isHost);
      
      // Atualizar sessão com dados completos após reconexão bem-sucedida
      sessionService.updateSession({
        isHost: data.isHost,
        playerId: data.playerId
      });
    });

    // Jogo iniciado
    socketService.onGameStarted((data) => {
      console.log('✅ [GAME STARTED] Evento game_started recebido:', data);
      console.log('🎮 [GAME STARTED] Data completo:', JSON.stringify(data, null, 2));
      
      setGameStarting(true);
      
      // 🔧 CORRIGIDO: Usar estado funcional para pegar o valor mais recente
      setIsHost(currentIsHost => {
        console.log('🎮 [GAME STARTED] isHost atual:', currentIsHost);
        
        // Salvar sessão apenas quando o jogo iniciar (não no lobby)
        if (currentIsHost && socketService.getSocket()) {
          setRoom(currentRoom => {
            const hostPlayerId = currentRoom?.host?.playerId || `host_${socketService.getSocket().id}`;
            
            const sessionData = {
              roomCode: roomCode,
              playerId: hostPlayerId,
              playerName: currentRoom?.host?.name || 'Host',
              isHost: true,
              avatar: currentRoom?.host?.avatar || '1'
            };
            
            console.log('💾 [GAME STARTED] Salvando sessão do host:', sessionData);
            sessionService.saveSession(sessionData);
            
            return currentRoom;
          });
        }
        
        // Navegar para tela de jogo COM O VALOR CORRETO de isHost
        console.log('🎮 [GAME STARTED] Navegando para tela de jogo em 1 segundo...');
        setTimeout(() => {
          console.log('🎮 [NAVEGANDO] roomCode:', roomCode);
          console.log('🎮 [NAVEGANDO] isHost:', currentIsHost);
          console.log('🎮 [NAVEGANDO] question:', data.question?.question_text);
          navigate(`/multiplayer/play/${roomCode}`, {
            state: {
              isHost: currentIsHost,
              question: data.question,
              questionIndex: data.questionIndex,
              totalQuestions: data.totalQuestions
            }
          });
        }, 1000);
        
        return currentIsHost; // Retornar o mesmo valor
      });
    });

    // Sala fechada
    socketService.onRoomClosed((data) => {
      console.log('Sala fechada:', data);
      setError(data.message || 'A sala foi encerrada pelo host');
      sessionService.clearSession();
      
      setTimeout(() => {
        navigate('/multiplayer/join');
      }, 3000);
    });

    // 🆕 Host desconectou temporariamente
    socketService.getSocket().on('host_disconnected', (data) => {
      console.log('⏳ Host desconectou temporariamente:', data);
      setError(`Host desconectou. Aguardando reconexão (${data.gracePeriod/1000}s)...`);
      
      // Limpar erro após grace period
      setTimeout(() => {
        setError('');
      }, data.gracePeriod);
    });

    // 🆕 Jogador desconectou temporariamente
    socketService.getSocket().on('player_disconnected', (data) => {
      console.log('⏳ Jogador desconectou temporariamente:', data);
      if (data.room) {
        setRoom(data.room);
        setPlayers(data.room.players || []);
      }
    });

    // 🆕 Jogador foi removido (não reconectou a tempo)
    socketService.getSocket().on('player_removed', (data) => {
      console.log('👋 Jogador removido:', data);
      if (data.room) {
        setRoom(data.room);
        setPlayers(data.room.players || []);
      }
    });
  }; // Fim da função setupSocketListeners

  useEffect(() => {
    console.log('🚀 useEffect executado...');
    
    // 🔧 CORREÇÃO CRÍTICA: Sempre configurar listeners (eles são idempotentes)
    setupSocketListeners();
    
    // 🆕 Evitar múltiplas inicializações do lobby
    if (isInitialized.current) {
      console.log('⚠️ Lobby já inicializado, pulando re-inicialização...');
      return;
    }
    
    isInitialized.current = true;
    console.log('🚀 Inicializando lobby pela primeira vez...');

    const initializeLobby = async () => {
      // Verificar se há sessão salva (reconexão)
      const session = sessionService.getSession();
      
      // Verificar se é uma tentativa válida de reconexão
      const isReconnectAttempt = session && 
                                  session.roomCode === roomCode && 
                                  !location.state; // Não tem state = é F5
      
      if (isReconnectAttempt) {
        console.log('🔄 Sessão encontrada - Tentando reconectar:', session);
        console.log('📍 Room code do URL:', roomCode);
        console.log('📍 Room code da sessão:', session.roomCode);
        
        // 🆕 Verificar se excedeu o limite de tentativas
        if (sessionService.hasExceededReconnectionLimit(session.roomCode)) {
          console.error('❌ Limite de tentativas de reconexão excedido');
          setError('Você excedeu o limite de tentativas de reconexão. A sessão foi encerrada.');
          sessionService.clearAll();
          
          setTimeout(() => {
            navigate('/multiplayer/join');
          }, 3000);
          return;
        }
        
        setIsReconnecting(true);
        
        try {
          // 🆕 Incrementar contador de tentativas
          sessionService.incrementReconnectionAttempt(session.roomCode);
          
          // Conectar socket primeiro
          console.log('🔌 Conectando socket...');
          socketService.connect();
          
          // Aguardar um pouco para garantir que o socket conectou
          await new Promise(resolve => setTimeout(resolve, 500));
          
          console.log('🔄 Tentando reconectar...');
          // Tentar reconectar
          const result = await socketService.reconnectToRoom(
            session.roomCode,
            session.playerId,
            session.playerName,
            session.isHost
          );
          
          console.log('✅ Resultado da reconexão:', result);
          
          // 🆕 Reconexão bem-sucedida, limpar contador de tentativas
          sessionService.clearReconnectionAttempts(session.roomCode);
          
          setIsHost(session.isHost);
          if (result.room) {
            setRoom(result.room);
            setPlayers(result.room.players || []);
          }
          console.log('✅ Reconexão bem-sucedida');

          // 🆕 CORREÇÃO BUG 1: Notificar que estamos prontos após reconexão
          setTimeout(() => {
            console.log('📤 [LOBBY RECONEXÃO] Notificando servidor que estamos prontos...');
            console.log('📤 [LOBBY RECONEXÃO] Room code:', roomCode);
            console.log('📤 [LOBBY RECONEXÃO] Socket ID:', socketService.getSocket()?.id);
            socketService.notifyLobbyReady(roomCode);
          }, 1000);
        } catch (error) {
          console.error('❌ Falha na reconexão:', error);
          console.error('❌ Tipo do erro:', typeof error);
          console.error('❌ Mensagem:', error?.message);
          
          // 🆕 Verificar se é a última tentativa
          const currentAttempts = sessionService.incrementReconnectionAttempt(session.roomCode);
          const remainingAttempts = MAX_RECONNECTION_ATTEMPTS - currentAttempts;
          
          let errorMsg = error?.message || 'Não foi possível reconectar.';
          
          if (remainingAttempts > 0) {
            errorMsg += ` Você tem ${remainingAttempts} tentativa(s) restante(s).`;
            setError(errorMsg);
            
            // Aguardar 3 segundos antes de redirecionar
            setTimeout(() => {
              navigate('/multiplayer/join');
            }, 3000);
          } else {
            errorMsg = 'Limite de tentativas de reconexão excedido. A sessão foi encerrada.';
            setError(errorMsg);
            sessionService.clearAll();
            
            setTimeout(() => {
              navigate('/multiplayer/join');
            }, 3000);
          }
        } finally {
          setIsReconnecting(false);
        }
      } else {
        console.log('ℹ️ Primeira entrada no lobby (não é reconexão)');
        console.log('📋 location.state completo:', location.state);
        console.log('🎯 location.state.isHost:', location.state?.isHost);
        console.log('🎯 Tipo de isHost:', typeof location.state?.isHost);
        
        // Primeira vez entrando, obter isHost do estado da navegação
        if (location.state) {
          const hostValue = location.state.isHost === true;
          console.log('✅ Setando isHost para:', hostValue);
          setIsHost(hostValue);
          
          // 🔧 CORRIGIDO: Se há room no state, inicializar players IMEDIATAMENTE
          if (location.state.room && location.state.room.players) {
            console.log('✅ [LOBBY] Inicializando players do location.state:', location.state.room.players);
            console.log('✅ [LOBBY] Quantidade de players:', location.state.room.players.length);
            setRoom(location.state.room);
            setPlayers(location.state.room.players);
          } else {
            console.warn('⚠️ [LOBBY] Sem room ou players no location.state');
          }

          // 🆕 CORREÇÃO BUG 1: Notificar o servidor que estamos prontos
          // Aguardar um pouco para garantir que o socket está conectado
          setTimeout(() => {
            console.log('📤 [LOBBY] Notificando servidor que estamos prontos...');
            console.log('📤 [LOBBY] Room code:', roomCode);
            console.log('📤 [LOBBY] Socket ID:', socketService.getSocket()?.id);
            console.log('📤 [LOBBY] Socket conectado?', socketService.getSocket()?.connected);
            socketService.notifyLobbyReady(roomCode);
          }, 1000);
        } else {
          console.warn('⚠️ Sem location.state');
        }
        
        // Se não há state e não há sessão válida, pode ser acesso direto pela URL
        if (!location.state && !session) {
          console.warn('⚠️ Acesso direto ao lobby sem dados de navegação');
          setError('Acesso inválido. Redirecionando...');
          setTimeout(() => {
            navigate('/multiplayer/join');
          }, 2000);
        }
      }
    };

    initializeLobby();

    return () => {
      // 🔧 CORREÇÃO: Apenas limpar listeners quando o componente for REALMENTE desmontado
      // Não limpar em re-renders normais
      console.log('🧹 Cleanup do useEffect executado');
      
      // NÃO limpar listeners aqui - eles serão limpos apenas quando o componente desmontar completamente
      // Os listeners já têm proteção contra duplicação com listenersSetup.current
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomCode, navigate]); // 🔧 CORRIGIDO: setupSocketListeners e location.state intencionalmente omitidos para evitar re-execuções
  
  // 🆕 useEffect separado para cleanup real quando componente desmontar
  useEffect(() => {
    return () => {
      console.log('🧹 [DESMONTANDO] Componente QuizMultiplayerLobby está desmontando...');
      console.log('🧹 [DESMONTANDO] Limpando TODOS os listeners do Socket.io...');
      
      socketService.off('player_joined');
      socketService.off('player_left');
      socketService.off('game_started');
      socketService.off('room_closed');
      socketService.off('player_reconnected');
      socketService.off('reconnect_success');
      socketService.off('host_disconnected');
      socketService.off('player_disconnected');
      socketService.off('player_removed');
      socketService.off('room_updated');
      
      // Resetar flags
      listenersSetup.current = false;
      isInitialized.current = false;
      
      console.log('✅ [DESMONTANDO] Listeners limpos com sucesso');
    };
  }, []); // Array vazio = só executa no mount/unmount real

  const handleStartGame = () => {
    console.log('🎮 [START GAME] Tentando iniciar jogo...');
    console.log('🎮 [START GAME] Players no estado:', players);
    console.log('🎮 [START GAME] Quantidade de players:', players.length);
    console.log('🎮 [START GAME] Room code:', roomCode);
    console.log('🎮 [START GAME] isHost:', isHost);
    
    if (players.length === 0) {
      console.error('❌ [START GAME] Nenhum jogador na sala!');
      setError('Aguarde pelo menos um jogador entrar na sala');
      return;
    }

    console.log('✅ [START GAME] Emitindo start_game para o backend...');
    socketService.startGame(roomCode);
    setGameStarting(true);
  };

  const handleLeaveRoom = () => {
    sessionService.clearSession(); // Limpar sessão ao sair voluntariamente
    socketService.leaveRoom();
    socketService.disconnect();
    
    if (isHost) {
      navigate('/multiplayer/create');
    } else {
      navigate('/multiplayer/join');
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getAvatarEmoji = (avatarId) => {
    const avatars = {
      '1': '😀', '2': '😎', '3': '🤓', '4': '😊',
      '5': '🥳', '6': '🤠', '7': '🦊', '8': '🐼',
      '9': '🦁', '10': '🐯', '11': '🐸', '12': '🦄'
    };
    return avatars[avatarId] || '😀';
  };

  // Loading de reconexão
  if (isReconnecting) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', gap: 2 }}>
        <CircularProgress size={60} />
        <Typography variant="h6">Reconectando à sala...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 4
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: '20px',
            p: 4,
            mb: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            textAlign: 'center'
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              mb: 2,
              background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            🎮 Sala de Espera
          </Typography>

          {/* Código da Sala */}
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#212121' }}>
              Código da Sala:
            </Typography>
            <Chip
              label={roomCode}
              sx={{
                fontSize: '1.5rem',
                fontWeight: 800,
                py: 3,
                px: 2,
                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                color: '#fff'
              }}
            />
            <Tooltip title={copied ? 'Copiado!' : 'Copiar código'}>
              <IconButton
                onClick={handleCopyCode}
                sx={{
                  background: copied ? '#4caf50' : '#667eea',
                  color: '#fff',
                  '&:hover': {
                    background: copied ? '#45a049' : '#5568d3'
                  }
                }}
              >
                <CopyIcon />
              </IconButton>
            </Tooltip>
          </Box>

          <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
            {isHost
              ? 'Compartilhe este código com seus amigos para que eles possam entrar!'
              : 'Aguarde o host iniciar o jogo...'}
          </Typography>

          {/* Contador de Jogadores */}
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mt: 3 }}>
            <PeopleIcon sx={{ color: '#667eea', fontSize: 32 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#212121' }}>
              {players.length} {players.length === 1 ? 'Jogador' : 'Jogadores'} na sala
            </Typography>
          </Box>
        </Paper>

        {/* Erro */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Alerta de início */}
        {gameStarting && (
          <Alert severity="success" sx={{ mb: 3 }}>
            🎮 Jogo iniciando! Prepare-se...
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Lista de Jogadores */}
          <Grid item xs={12} md={8}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: '20px',
                p: 3,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                minHeight: '400px'
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Jogadores
              </Typography>

              {players.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography variant="h6" color="text.secondary">
                    Aguardando jogadores...
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Compartilhe o código da sala para que outros jogadores possam entrar
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={2}>
                  {players.map((player, index) => (
                    <Grid item xs={12} sm={6} key={player.id}>
                      <Card
                        elevation={2}
                        sx={{
                          borderRadius: '16px',
                          transition: 'all 0.3s ease',
                          border: '2px solid transparent',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            borderColor: '#667eea',
                            boxShadow: '0 8px 16px rgba(102, 126, 234, 0.3)'
                          }
                        }}
                      >
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            {/* Avatar */}
                            <Avatar
                              sx={{
                                width: 56,
                                height: 56,
                                fontSize: '2rem',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                              }}
                            >
                              {getAvatarEmoji(player.avatar)}
                            </Avatar>

                            {/* Informações */}
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                {player.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Jogador #{index + 1}
                              </Typography>
                            </Box>

                            {/* Badge de ranking */}
                            {index === 0 && (
                              <TrophyIcon sx={{ color: '#FFD700', fontSize: 32 }} />
                            )}
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Paper>
          </Grid>

          {/* Painel de Controle */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: '20px',
                p: 3,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                {isHost ? 'Controles do Host' : 'Informações'}
              </Typography>

              {isHost ? (
                <>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    startIcon={<PlayIcon />}
                    onClick={handleStartGame}
                    disabled={gameStarting || players.length === 0}
                    sx={{
                      py: 2,
                      mb: 2,
                      fontWeight: 700,
                      background: 'linear-gradient(90deg, #4caf50 0%, #45a049 100%)',
                      fontSize: '1.1rem',
                      '&:hover': {
                        background: 'linear-gradient(90deg, #45a049 0%, #3d8b40 100%)'
                      },
                      '&:disabled': {
                        background: '#ccc'
                      }
                    }}
                  >
                    {gameStarting ? 'Iniciando...' : 'Iniciar Jogo'}
                  </Button>

                  <Divider sx={{ my: 2 }} />

                  <Alert severity="info" sx={{ mb: 2 }}>
                    Aguarde os jogadores entrarem e clique em "Iniciar Jogo" quando estiver pronto.
                  </Alert>

                  {players.length === 0 && (
                    <Alert severity="warning">
                      Aguarde pelo menos 1 jogador para iniciar
                    </Alert>
                  )}
                </>
              ) : (
                <Alert severity="info">
                  Aguarde o host iniciar o jogo. Fique atento! ⚡
                </Alert>
              )}

              <Divider sx={{ my: 3 }} />

              <Button
                fullWidth
                variant="outlined"
                color="error"
                startIcon={<ExitIcon />}
                onClick={handleLeaveRoom}
                disabled={gameStarting}
                sx={{
                  py: 1.5,
                  fontWeight: 700,
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                    background: 'rgba(244, 67, 54, 0.1)'
                  }
                }}
              >
                Sair da Sala
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default QuizMultiplayerLobby;

