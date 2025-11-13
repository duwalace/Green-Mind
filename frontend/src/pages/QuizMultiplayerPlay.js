import React, { useState, useEffect } from 'react';
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
  Chip
} from '@mui/material';
import {
  CheckCircle as CorrectIcon,
  Cancel as WrongIcon,
  Timer as TimerIcon,
  EmojiEvents as TrophyIcon,
  People as PeopleIcon
} from '@mui/icons-material';
import socketService from '../services/socket';

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

  useEffect(() => {
    // Obter dados do estado da navegação
    if (location.state) {
      setIsHost(location.state.isHost || false);
      setCurrentQuestion(location.state.question);
      setQuestionIndex(location.state.questionIndex || 0);
      setTotalQuestions(location.state.totalQuestions || 0);
      
      if (location.state.question) {
        setTimeLeft(location.state.question.time_limit_seconds || 30);
      }
    }

    // Configurar listeners
    setupSocketListeners();

    return () => {
      socketService.off('next_question_started');
      socketService.off('answer_result');
      socketService.off('leaderboard_update');
      socketService.off('game_finished');
      socketService.off('player_answered');
      socketService.off('room_closed');
    };
  }, []);

  useEffect(() => {
    // Timer
    if (currentQuestion && !isAnswered && !showLeaderboard && timeLeft > 0) {
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
  }, [currentQuestion, isAnswered, showLeaderboard, timeLeft]);

  const setupSocketListeners = () => {
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
    });

    // Resultado da resposta (para jogadores)
    socketService.onAnswerResult((data) => {
      console.log('Resultado da resposta:', data);
      setAnswerResult(data);
      setMyScore(data.totalScore);
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
    });

    // Jogador respondeu (apenas para host)
    socketService.onPlayerAnswered((data) => {
      console.log('Jogador respondeu:', data);
      setPlayersAnswered(prev => [...prev, data.playerName]);
    });

    // Sala fechada
    socketService.onRoomClosed((data) => {
      console.log('Sala fechada:', data);
      navigate('/multiplayer/join');
    });
  };

  const handleTimeout = () => {
    if (!isAnswered) {
      handleAnswerClick(-1); // -1 indica timeout
    }
  };

  const handleAnswerClick = (answerIndex) => {
    if (isAnswered) return;

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
    if (!isHost) return;

    socketService.showLeaderboard(roomCode);
  };

  const handleFinish = () => {
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

  if (!currentQuestion && !showLeaderboard) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography variant="h6">Carregando...</Typography>
      </Box>
    );
  }

  // Tela de Leaderboard
  if (showLeaderboard) {
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
                  '&:hover': {
                    background: 'linear-gradient(90deg, #5568d3 0%, #653a8b 100%)'
                  }
                }}
              >
                Próxima Questão
              </Button>
            )}

            {gameFinished && (
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
                  '&:hover': {
                    background: 'linear-gradient(90deg, #45a049 0%, #3d8b40 100%)'
                  }
                }}
              >
                Finalizar
              </Button>
            )}

            {!isHost && !gameFinished && (
              <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                Aguarde o host avançar para a próxima questão...
              </Typography>
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
          {isHost && playersAnswered.length > 0 && (
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <PeopleIcon sx={{ color: '#667eea' }} />
              <Typography variant="body2" color="text.secondary">
                Responderam: {playersAnswered.join(', ')}
              </Typography>
            </Box>
          )}
        </Paper>

        {/* Pergunta */}
        <Zoom in={true} key={questionIndex}>
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
              justifyContent: 'center'
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
            const isCorrect = answerResult?.correctAnswer?.toString() === index.toString();
            
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
                        : color.main,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover':
                      isAnswered
                        ? {}
                        : {
                            transform: 'translateY(-8px) scale(1.02)',
                            boxShadow: `0 20px 40px ${alpha(color.main, 0.3)}`,
                            borderColor: color.hover
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
                '&:hover': {
                  background: 'linear-gradient(90deg, #5568d3 0%, #653a8b 100%)'
                }
              }}
            >
              Mostrar Classificação
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default QuizMultiplayerPlay;

