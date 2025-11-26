import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  LinearProgress,
  Fade,
  Zoom,
  alpha,
  Avatar,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  CheckCircle as CorrectIcon,
  Cancel as WrongIcon,
  Timer as TimerIcon,
  EmojiEvents as TrophyIcon,
  People as PeopleIcon
} from '@mui/icons-material';
import socketService from '../services/socket';
import sessionService from '../services/sessionService';

// 🆕 Constante para limite de tentativas (deve coincidir com sessionService)
const MAX_RECONNECTION_ATTEMPTS = 3;

function QuizMultiplayerPlay() {
  const { roomCode } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [isHost, setIsHost] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [answerResult, setAnswerResult] = useState(null);
  const [myScore, setMyScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [playersAnswered, setPlayersAnswered] = useState([]);
  const [playersAnsweredCount, setPlayersAnsweredCount] = useState(0);
  const [totalPlayersCount, setTotalPlayersCount] = useState(0);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [clickFeedback, setClickFeedback] = useState(null); // Para animação de clique
  const [allPlayersAnswered, setAllPlayersAnswered] = useState(false); // Estado adicional para controlar quando todos responderam

  // 🆕 useRef para evitar múltiplas inicializações
  const isInitialized = useRef(false);
  const listenersSetup = useRef(false);

  // 🆕 Memoizar setupSocketListeners com useCallback
  const setupSocketListeners = useCallback(() => {
    // Evitar configurar listeners múltiplas vezes
    if (listenersSetup.current) {
      console.log('⚠️ Listeners já configurados no Play, pulando...');
      return;
    }
    
    console.log('🎧 Configurando listeners do Socket.io no Play...');
    listenersSetup.current = true;

    // Próxima questão
    socketService.onNextQuestion((data) => {
      console.log('Próxima questão:', data);
      setCurrentQuestion(data.question);
      setQuestionIndex(data.questionIndex);
      setTotalQuestions(data.totalQuestions);
      setTimeLeft(data.question.time_limit_seconds || 30);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setAnswerResult(null);
      setShowLeaderboard(false);
      setPlayersAnswered([]);
      setPlayersAnsweredCount(0);
      setTotalPlayersCount(0);
      setClickFeedback(null);
      setAllPlayersAnswered(false);
      
      // Atualizar sessão com nova pergunta
      sessionService.updateSession({
        currentQuestionIndex: data.questionIndex
      });
    });

    // Resultado da resposta (para jogadores)
    socketService.onAnswerResult((data) => {
      console.log('📊 Resultado da resposta recebido:', data);
      setAnswerResult(data);
      setMyScore(data.totalScore);
      
      // Atualizar pontuação na sessão
      sessionService.updateSession({
        score: data.totalScore
      });
    });

    // Atualização do leaderboard
    socketService.onLeaderboardUpdate((data) => {
      console.log('Leaderboard atualizado:', data);
      setLeaderboard(data.leaderboard);
      setShowLeaderboard(true);
    });

    // Jogo finalizado
    socketService.onGameFinished((data) => {
      console.log('Jogo finalizado:', data);
      setLeaderboard(data.leaderboard);
      setGameFinished(true);
      setShowLeaderboard(true);
      
      // Limpar sessão quando o jogo terminar
      sessionService.clearSession();
    });

    // Jogador respondeu (apenas para host)
    socketService.onPlayerAnswered((data) => {
      console.log('Jogador respondeu:', data);
      setPlayersAnswered(prev => [...prev, data.playerName]);
      
      // Atualizar contagem de jogadores que responderam
      if (data.playersAnswered !== undefined && data.totalPlayers !== undefined) {
        console.log(`📊 Progresso: ${data.playersAnswered}/${data.totalPlayers} jogadores responderam`);
        setPlayersAnsweredCount(data.playersAnswered);
        setTotalPlayersCount(data.totalPlayers);
      }
    });

    // 🔧 Todos os jogadores responderam
    socketService.getSocket().on('all_players_answered', (data) => {
      console.log('🎯 [TODOS RESPONDERAM] Evento recebido:', data);
      setAllPlayersAnswered(true);
      
      if (data.leaderboard && data.leaderboard.length > 0) {
        setLeaderboard(data.leaderboard);
      }
      
      // Mostrar leaderboard automaticamente após 2 segundos
      setTimeout(() => {
        setShowLeaderboard(true);
      }, 2000);
    });

    // Sala fechada
    socketService.onRoomClosed((data) => {
      console.log('🚪 [SALA FECHADA] Evento recebido:', data);
      sessionService.clearSession();
      navigate('/multiplayer/join');
    });

    // Reconexão bem-sucedida
    socketService.getSocket().on('reconnect_success', (data) => {
      console.log('✅ Reconexão ao jogo confirmada:', data);
      if (data.currentState) {
        setQuestionIndex(data.currentState.questionIndex);
        setMyScore(data.currentState.score);
        if (data.currentState.question) {
          setCurrentQuestion(data.currentState.question);
        }
      }
    });
  }, [navigate]); // 🆕 Dependências corretas

  useEffect(() => {
    // 🆕 Evitar múltiplas execuções
    if (isInitialized.current) {
      console.log('⚠️ useEffect do Play já executado, pulando inicialização...');
      return;
    }
    
    isInitialized.current = true;
    console.log('🚀 Inicializando jogo...');

    const initializeGame = async () => {
      // Verificar se há sessão salva (reconexão)
      const session = sessionService.getSession();
      
      if (session && session.roomCode === roomCode) {
        console.log('🔄 Sessão encontrada, tentando reconectar ao jogo...');
        
        // 🆕 Verificar se excedeu o limite de tentativas
        if (sessionService.hasExceededReconnectionLimit(session.roomCode)) {
          console.error('❌ Limite de tentativas de reconexão excedido');
          alert('Você excedeu o limite de tentativas de reconexão. A sessão foi encerrada.');
          sessionService.clearAll();
          navigate('/multiplayer/join');
          return;
        }
        
        setIsReconnecting(true);
        
        try {
          // 🆕 Incrementar contador de tentativas
          sessionService.incrementReconnectionAttempt(session.roomCode);
          
          // Tentar reconectar
          const result = await socketService.reconnectToRoom(
            session.roomCode,
            session.playerId,
            session.playerName,
            session.isHost
          );
          
          // 🆕 Reconexão bem-sucedida, limpar contador de tentativas
          sessionService.clearReconnectionAttempts(session.roomCode);
          
          setIsHost(result.isHost);
          console.log('✅ isHost setado para:', result.isHost);
          
          // Restaurar estado do jogo
          if (result.currentState) {
            setQuestionIndex(result.currentState.questionIndex);
            setMyScore(result.currentState.score);
            setTotalQuestions(result.currentState.totalQuestions);
            
            if (result.currentState.question) {
              setCurrentQuestion(result.currentState.question);
              setTimeLeft(result.currentState.question.time_limit_seconds || 30);
            }
            
            if (result.currentState.status === 'finished') {
              setGameFinished(true);
              setShowLeaderboard(true);
            }
          }
          
          console.log('✅ Reconexão ao jogo bem-sucedida');
        } catch (error) {
          console.error('❌ Falha na reconexão:', error);
          
          // 🆕 Verificar tentativas restantes
          const currentAttempts = sessionService.incrementReconnectionAttempt(session.roomCode);
          const remainingAttempts = MAX_RECONNECTION_ATTEMPTS - currentAttempts;
          
          let errorMsg = error?.message || 'Não foi possível reconectar ao jogo.';
          
          if (remainingAttempts > 0) {
            errorMsg += ` Você tem ${remainingAttempts} tentativa(s) restante(s).`;
            alert(errorMsg);
          } else {
            errorMsg = 'Limite de tentativas de reconexão excedido. A sessão foi encerrada.';
            alert(errorMsg);
            sessionService.clearAll();
          }
          
          setIsReconnecting(false);
          navigate('/multiplayer/join');
          return;
        } finally {
          setIsReconnecting(false);
        }
      } else {
        // Primeira vez no jogo, obter dados do estado da navegação
        console.log('🎮 [PLAY] Primeira entrada - location.state:', location.state);
        console.log('🎮 [PLAY] location.state.isHost:', location.state?.isHost);
        console.log('🎮 [PLAY] Tipo:', typeof location.state?.isHost);
        
        if (location.state) {
          const hostValue = location.state.isHost === true;
          console.log('🎮 [PLAY] Valor calculado de isHost:', hostValue);
          setIsHost(hostValue);
          console.log('✅ isHost setado para:', hostValue);
          setCurrentQuestion(location.state.question);
          setQuestionIndex(location.state.questionIndex || 0);
          setTotalQuestions(location.state.totalQuestions || 0);
          
          if (location.state.question) {
            setTimeLeft(location.state.question.time_limit_seconds || 30);
          }
        } else {
          console.error('❌ [PLAY] Sem location.state! Isso é um problema.');
        }
      }
    };

    initializeGame();

    // Configurar listeners
    setupSocketListeners();
    
    // Listener de erro do socket para debug
    const socket = socketService.getSocket();
    socket.on('error', (error) => {
      console.error('❌ [SOCKET ERROR]:', error);
    });
    
    socket.on('disconnect', (reason) => {
      console.warn('⚠️ [SOCKET DISCONNECT]:', reason);
      if (reason === 'io server disconnect') {
        console.error('🚨 Servidor desconectou o cliente!');
      }
    });

    return () => {
      console.log('🧹 Limpando listeners do Socket.io no Play...');
      socketService.off('next_question_started');
      socketService.off('answer_result');
      socketService.off('leaderboard_update');
      socketService.off('game_finished');
      socketService.off('player_answered');
      socketService.off('room_closed');
      socketService.off('reconnect_success');
      socketService.off('all_players_answered');
      socketService.off('host_disconnected');
      socketService.off('player_disconnected');
      socketService.off('player_removed');
      
      // Resetar flag de listeners
      listenersSetup.current = false;
    };
  }, [setupSocketListeners]); // 🆕 Dependência correta

  // 🆕 useEffect separado para o timer (mais específico)
  useEffect(() => {
    // Timer - para quando o jogador responde OU quando todos os jogadores responderam
    if (currentQuestion && !isAnswered && !showLeaderboard && !allPlayersAnswered && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentQuestion, isAnswered, showLeaderboard, allPlayersAnswered, timeLeft]);

  const handleTimeout = () => {
    if (!isAnswered) {
      handleAnswerClick(-1); // -1 indica timeout
    }
  };

  const handleAnswerClick = (answerIndex) => {
    if (isAnswered) return;

    // Feedback visual instantâneo
    setClickFeedback(answerIndex);
    setSelectedAnswer(answerIndex);
    setIsAnswered(true);

    // Submeter resposta
    socketService.submitAnswer(roomCode, questionIndex, answerIndex);
  };

  const handleNextQuestion = () => {
    if (!isHost) return;

    setShowLeaderboard(false);
    socketService.nextQuestion(roomCode);
  };

  const handleShowLeaderboard = () => {
    if (!isHost) {
      console.warn('⚠️ Tentativa de mostrar leaderboard, mas não é host');
      return;
    }

    console.log('📊 Host solicitando exibição do leaderboard');
    socketService.showLeaderboard(roomCode);
  };

  const handleFinish = () => {
    sessionService.clearSession();
    socketService.leaveRoom();
    socketService.disconnect();
    navigate('/quizzes');
  };

  const getAvatarEmoji = (avatarId) => {
    const avatars = {
      '1': '😀', '2': '😎', '3': '🤓', '4': '😊',
      '5': '🥳', '6': '🤠', '7': '🦊', '8': '🐼',
      '9': '🦁', '10': '🐯', '11': '🐸', '12': '🦄'
    };
    return avatars[avatarId] || '😀';
  };

  // Cores para as opções (estilo Kahoot)
  const optionColors = [
    { main: '#E74C3C', light: '#FFEBEE', hover: '#C0392B' },
    { main: '#3498DB', light: '#E3F2FD', hover: '#2980B9' },
    { main: '#F39C12', light: '#FFF3E0', hover: '#E67E22' },
    { main: '#9B59B6', light: '#F3E5F5', hover: '#8E44AD' },
  ];

  // Loading de reconexão
  if (isReconnecting) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', gap: 2 }}>
        <CircularProgress size={60} />
        <Typography variant="h6">Reconectando ao jogo...</Typography>
      </Box>
    );
  }

  if (!currentQuestion && !showLeaderboard) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', gap: 2 }}>
        <CircularProgress size={60} />
        <Typography variant="h6">Carregando...</Typography>
      </Box>
    );
  }

  // Tela de Leaderboard
  if (showLeaderboard) {
    // Debug logs
    console.log('📊 [LEADERBOARD RENDER]');
    console.log('   - isHost:', isHost);
    console.log('   - gameFinished:', gameFinished);
    console.log('   - leaderboard length:', leaderboard.length);
    console.log('   - Deve mostrar botão?', isHost && !gameFinished);
    
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: gameFinished
            ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          py: 4,
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Container maxWidth="md">
          <Paper
            elevation={24}
            sx={{
              borderRadius: '24px',
              p: 5,
              background: 'rgba(255, 255, 255, 0.98)',
              textAlign: 'center'
            }}
          >
            <TrophyIcon sx={{ fontSize: 80, color: '#FFD700', mb: 2 }} />
            
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                mb: 1,
                background: 'linear-gradient(90deg, #FFD700 0%, #FFA500 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              {gameFinished ? '🎉 Jogo Finalizado!' : '📊 Classificação'}
            </Typography>

            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
              {gameFinished ? 'Confira a classificação final:' : 'Classificação parcial:'}
            </Typography>

            {/* Leaderboard */}
            <Box sx={{ mb: 4 }}>
              {leaderboard.length === 0 && (
                <Paper
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    borderRadius: '16px',
                    mb: 2
                  }}
                >
                  <Typography variant="body1" color="text.secondary">
                    Carregando classificação...
                  </Typography>
                </Paper>
              )}
              
              {leaderboard.map((player, index) => (
                <Card
                  key={player.playerId}
                  elevation={index === 0 ? 8 : 2}
                  sx={{
                    mb: 2,
                    borderRadius: '16px',
                    border: index === 0 ? '3px solid #FFD700' : 'none',
                    background: index === 0
                      ? 'linear-gradient(90deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 165, 0, 0.1) 100%)'
                      : '#fff'
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {/* Posição */}
                      <Avatar
                        sx={{
                          width: 56,
                          height: 56,
                          fontWeight: 800,
                          fontSize: '1.5rem',
                          background:
                            index === 0
                              ? '#FFD700'
                              : index === 1
                              ? '#C0C0C0'
                              : index === 2
                              ? '#CD7F32'
                              : '#667eea'
                        }}
                      >
                        {index + 1}
                      </Avatar>

                      {/* Nome */}
                      <Box sx={{ flexGrow: 1, textAlign: 'left' }}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {player.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {player.correctAnswers} respostas corretas
                        </Typography>
                      </Box>

                      {/* Pontuação */}
                      <Chip
                        icon={<TrophyIcon />}
                        label={`${player.score} pts`}
                        sx={{
                          fontSize: '1.1rem',
                          fontWeight: 700,
                          py: 3,
                          px: 2,
                          background:
                            index === 0
                              ? 'linear-gradient(90deg, #FFD700 0%, #FFA500 100%)'
                              : '#667eea',
                          color: '#fff'
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>

            {/* Botões de controle */}
            {isHost && !gameFinished && (
              <Fade in={true} timeout={600}>
                <Box>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleNextQuestion}
                    sx={{
                      py: 2,
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'linear-gradient(90deg, #5568d3 0%, #653a8b 100%)',
                        transform: 'translateY(-3px)',
                        boxShadow: '0 8px 20px rgba(102, 126, 234, 0.4)'
                      },
                      '&:active': {
                        transform: 'translateY(0)'
                      }
                    }}
                  >
                    Próxima Questão
                  </Button>
                  <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 1, color: 'rgba(255, 255, 255, 0.7)' }}>
                    Você é o host - clique para continuar
                  </Typography>
                </Box>
              </Fade>
            )}

            {gameFinished && (
              <Fade in={true} timeout={600}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleFinish}
                  sx={{
                    py: 2,
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    background: 'linear-gradient(90deg, #4caf50 0%, #45a049 100%)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'linear-gradient(90deg, #45a049 0%, #3d8b40 100%)',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 8px 20px rgba(76, 175, 80, 0.4)'
                    },
                    '&:active': {
                      transform: 'translateY(0)'
                    }
                  }}
                >
                  Finalizar
                </Button>
              </Fade>
            )}

            {!isHost && !gameFinished && (
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <CircularProgress size={40} sx={{ color: '#fff', mb: 2 }} />
                <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 600 }}>
                  Aguarde o host avançar para a próxima questão...
                </Typography>
              </Box>
            )}
          </Paper>
        </Container>
      </Box>
    );
  }

  // Tela de Gameplay
  const progress = ((questionIndex + 1) / totalQuestions) * 100;
  const timeProgress = (timeLeft / (currentQuestion.time_limit_seconds || 30)) * 100;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 4
      }}
    >
      <Container maxWidth="md">
        {/* Header com progresso */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: '20px',
            p: 3,
            mb: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#212121' }}>
              Questão {questionIndex + 1} de {totalQuestions}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrophyIcon sx={{ color: '#F57C00' }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#F57C00' }}>
                {myScore} pts
              </Typography>
            </Box>
          </Box>

          {/* Barra de progresso */}
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 10,
              borderRadius: 5,
              mb: 2,
              bgcolor: alpha('#2E7D32', 0.1),
              '& .MuiLinearProgress-bar': {
                borderRadius: 5,
                background: 'linear-gradient(90deg, #2E7D32 0%, #66BB6A 100%)'
              }
            }}
          />

          {/* Timer */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TimerIcon
              sx={{
                color: timeLeft <= 5 ? '#D32F2F' : '#2E7D32',
                animation: timeLeft <= 5 ? 'pulse 1s infinite' : 'none',
                '@keyframes pulse': {
                  '0%, 100%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.2)' }
                }
              }}
            />
            <LinearProgress
              variant="determinate"
              value={timeProgress}
              sx={{
                flexGrow: 1,
                height: 8,
                borderRadius: 4,
                bgcolor: alpha('#757575', 0.1),
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  background:
                    timeLeft <= 5
                      ? 'linear-gradient(90deg, #D32F2F 0%, #F44336 100%)'
                      : 'linear-gradient(90deg, #2E7D32 0%, #66BB6A 100%)'
                }
              }}
            />
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                color: timeLeft <= 5 ? '#D32F2F' : '#2E7D32',
                minWidth: '40px',
                textAlign: 'right'
              }}
            >
              {timeLeft}s
            </Typography>
          </Box>

          {/* Host: Indicador de jogadores que responderam */}
          {isHost && (playersAnswered.length > 0 || playersAnsweredCount > 0) && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <PeopleIcon sx={{ color: '#667eea' }} />
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#667eea' }}>
                  Progresso: {playersAnsweredCount}/{totalPlayersCount} jogadores
                </Typography>
              </Box>
              {playersAnswered.length > 0 && (
                <Typography variant="caption" color="text.secondary" sx={{ ml: 4 }}>
                  Responderam: {playersAnswered.join(', ')}
                </Typography>
              )}
              {/* Barra de progresso */}
              <LinearProgress
                variant="determinate"
                value={totalPlayersCount > 0 ? (playersAnsweredCount / totalPlayersCount) * 100 : 0}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  mt: 1,
                  ml: 4,
                  bgcolor: alpha('#667eea', 0.1),
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 3,
                    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
                  }
                }}
              />
            </Box>
          )}
        </Paper>

        {/* Pergunta */}
        <Zoom in={true} key={questionIndex} timeout={600}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: '24px',
              p: 5,
              mb: 4,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              textAlign: 'center',
              minHeight: '200px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'fadeInUp 0.6s ease-out',
              '@keyframes fadeInUp': {
                from: {
                  opacity: 0,
                  transform: 'translateY(30px)'
                },
                to: {
                  opacity: 1,
                  transform: 'translateY(0)'
                }
              }
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: '#212121',
                lineHeight: 1.4
              }}
            >
              {currentQuestion.question_text}
            </Typography>
          </Paper>
        </Zoom>

        {/* Mensagem quando todos responderam */}
        {allPlayersAnswered && !showLeaderboard && (
          <Fade in={true}>
            <Paper
              elevation={8}
              sx={{
                borderRadius: '20px',
                p: 4,
                mb: 3,
                background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                textAlign: 'center',
                animation: 'pulse 1.5s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%, 100%': { 
                    transform: 'scale(1)',
                    boxShadow: '0 0 0 0 rgba(76, 175, 80, 0.7)'
                  },
                  '50%': { 
                    transform: 'scale(1.02)',
                    boxShadow: '0 0 0 20px rgba(76, 175, 80, 0)'
                  }
                }
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  color: '#fff',
                  mb: 1
                }}
              >
                🎉 Todos responderam!
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'rgba(255, 255, 255, 0.9)'
                }}
              >
                Preparando classificação...
              </Typography>
            </Paper>
          </Fade>
        )}

        {/* Opções de resposta */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 3
          }}
        >
          {currentQuestion.options?.map((option, index) => {
            const color = optionColors[index % 4];
            const isSelected = selectedAnswer === index;
            
            // Normalizar para comparação de números inteiros
            const correctAnswerInt = answerResult?.correctAnswer !== undefined 
              ? parseInt(answerResult.correctAnswer, 10) 
              : null;
            const isCorrect = correctAnswerInt === index;
            
            const isClicked = clickFeedback === index;
            
            // Debug no console
            if (isAnswered && index === 0) {
              console.log('🎨 [RENDER] Estado das opções:');
              console.log(`   - selectedAnswer: ${selectedAnswer}`);
              console.log(`   - answerResult.isCorrect: ${answerResult?.isCorrect}`);
              console.log(`   - answerResult.correctAnswer: ${answerResult?.correctAnswer} (tipo: ${typeof answerResult?.correctAnswer})`);
              console.log(`   - correctAnswerInt: ${correctAnswerInt}`);
            }
            
            return (
              <Fade in={true} key={index} timeout={300 + index * 100}>
                <Paper
                  onClick={() => handleAnswerClick(index)}
                  elevation={0}
                  sx={{
                    borderRadius: '20px',
                    p: 3,
                    cursor: isAnswered ? 'default' : 'pointer',
                    background:
                      isAnswered && isSelected
                        ? answerResult?.isCorrect
                          ? 'rgba(76, 175, 80, 0.2)'
                          : 'rgba(244, 67, 54, 0.2)'
                        : 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '3px solid',
                    borderColor:
                      isAnswered && isSelected
                        ? answerResult?.isCorrect
                          ? '#4caf50'
                          : '#f44336'
                        : isAnswered && isCorrect
                        ? '#4caf50'
                        : isClicked
                        ? color.hover
                        : color.main,
                    transform: isClicked && !isAnswered ? 'scale(0.95)' : 'scale(1)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: isClicked ? `0 0 30px ${alpha(color.main, 0.6)}` : 'none',
                    animation: isAnswered && isSelected && answerResult?.isCorrect 
                      ? 'correctPulse 0.6s ease-out'
                      : isAnswered && isSelected && !answerResult?.isCorrect
                      ? 'incorrectShake 0.6s ease-out'
                      : 'none',
                    '@keyframes correctPulse': {
                      '0%': { transform: 'scale(1)' },
                      '50%': { transform: 'scale(1.05)', boxShadow: '0 0 30px rgba(76, 175, 80, 0.8)' },
                      '100%': { transform: 'scale(1)' }
                    },
                    '@keyframes incorrectShake': {
                      '0%, 100%': { transform: 'translateX(0)' },
                      '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
                      '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' }
                    },
                    '&:hover':
                      isAnswered
                        ? {}
                        : {
                            transform: 'translateY(-8px) scale(1.02)',
                            boxShadow: `0 20px 40px ${alpha(color.main, 0.3)}`,
                            borderColor: color.hover
                          },
                    '&:active':
                      isAnswered
                        ? {}
                        : {
                            transform: 'scale(0.95)'
                          }
                  }}
                >
                  <Box sx={{ position: 'relative', zIndex: 1 }}>
                    {/* Ícone de forma geométrica */}
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: index === 0 ? '12px' : index === 1 ? '50%' : index === 2 ? '8px' : '0',
                        transform: index === 3 ? 'rotate(45deg)' : 'none',
                        background:
                          isAnswered && isSelected
                            ? answerResult?.isCorrect
                              ? '#4caf50'
                              : '#f44336'
                            : isAnswered && isCorrect
                            ? '#4caf50'
                            : color.main,
                        mb: 2,
                        mx: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {isAnswered && (isSelected || isCorrect) && (
                        <Box
                          sx={{
                            transform: index === 3 ? 'rotate(-45deg)' : 'none'
                          }}
                        >
                          {isAnswered && isSelected ? (
                            answerResult?.isCorrect ? (
                              <CorrectIcon sx={{ color: '#fff', fontSize: 28 }} />
                            ) : (
                              <WrongIcon sx={{ color: '#fff', fontSize: 28 }} />
                            )
                          ) : isCorrect ? (
                            <CorrectIcon sx={{ color: '#fff', fontSize: 28 }} />
                          ) : null}
                        </Box>
                      )}
                    </Box>

                    {/* Texto da opção */}
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: '#212121',
                        wordBreak: 'break-word'
                      }}
                    >
                      {option}
                    </Typography>
                  </Box>
                </Paper>
              </Fade>
            );
          })}
        </Box>

        {/* Controles do Host */}
        {isHost && isAnswered && (
          <Fade in={true} timeout={600}>
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleShowLeaderboard}
                sx={{
                  px: 6,
                  py: 2,
                  fontWeight: 700,
                  background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                  transition: 'all 0.3s ease',
                  animation: 'pulse 2s ease-in-out infinite',
                  '@keyframes pulse': {
                    '0%, 100%': { 
                      boxShadow: '0 0 0 0 rgba(102, 126, 234, 0.7)'
                    },
                    '50%': { 
                      boxShadow: '0 0 0 15px rgba(102, 126, 234, 0)'
                    }
                  },
                  '&:hover': {
                    background: 'linear-gradient(90deg, #5568d3 0%, #653a8b 100%)',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 8px 20px rgba(102, 126, 234, 0.4)'
                  },
                  '&:active': {
                    transform: 'translateY(0)'
                  }
                }}
              >
                Mostrar Classificação
              </Button>
            </Box>
          </Fade>
        )}
      </Container>
    </Box>
  );
}

export default QuizMultiplayerPlay;

