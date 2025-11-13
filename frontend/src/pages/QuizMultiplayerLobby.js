import React, { useState, useEffect } from 'react';
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
  Tooltip
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  ExitToApp as ExitIcon,
  ContentCopy as CopyIcon,
  People as PeopleIcon,
  Timer as TimerIcon,
  EmojiEvents as TrophyIcon
} from '@mui/icons-material';
import socketService from '../services/socket';

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

  useEffect(() => {
    // Obter dados do estado da navegação
    if (location.state) {
      setIsHost(location.state.isHost || false);
    }

    // Configurar listeners do Socket.io
    setupSocketListeners();

    return () => {
      // Limpar listeners ao desmontar
      socketService.off('player_joined');
      socketService.off('player_left');
      socketService.off('game_started');
      socketService.off('room_closed');
    };
  }, []);

  const setupSocketListeners = () => {
    // Jogador entrou
    socketService.onPlayerJoined((data) => {
      console.log('Jogador entrou:', data);
      if (data.room) {
        setRoom(data.room);
        setPlayers(data.room.players || []);
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

    // Jogo iniciado
    socketService.onGameStarted((data) => {
      console.log('Jogo iniciado:', data);
      setGameStarting(true);
      
      // Navegar para tela de jogo
      setTimeout(() => {
        navigate(`/multiplayer/play/${roomCode}`, {
          state: {
            isHost: isHost,
            question: data.question,
            questionIndex: data.questionIndex,
            totalQuestions: data.totalQuestions
          }
        });
      }, 1000);
    });

    // Sala fechada
    socketService.onRoomClosed((data) => {
      console.log('Sala fechada:', data);
      setError(data.message || 'A sala foi encerrada pelo host');
      
      setTimeout(() => {
        navigate('/multiplayer/join');
      }, 3000);
    });
  };

  const handleStartGame = () => {
    if (players.length === 0) {
      setError('Aguarde pelo menos um jogador entrar na sala');
      return;
    }

    socketService.startGame(roomCode);
    setGameStarting(true);
  };

  const handleLeaveRoom = () => {
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

