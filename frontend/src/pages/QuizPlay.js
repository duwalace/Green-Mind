import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  useTheme,
  CircularProgress
} from '@mui/material';
import {
  CheckCircle as CorrectIcon,
  Cancel as WrongIcon,
  Timer as TimerIcon,
  EmojiEvents as TrophyIcon
} from '@mui/icons-material';
import api from '../services/api';

function QuizPlay() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [attemptId, setAttemptId] = useState(null);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isAnswered, setIsAnswered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [quizStartTime, setQuizStartTime] = useState(null);
  const [questionStartTime, setQuestionStartTime] = useState(null);

  useEffect(() => {
    loadQuiz();
  }, [quizId]);

  useEffect(() => {
    if (questions.length > 0 && !isAnswered && !showResult) {
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
  }, [currentQuestionIndex, isAnswered, showResult, questions]);

  const loadQuiz = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/quizzes/${quizId}`);
      setQuiz(response.data.quiz);
      setQuestions(response.data.questions);
      
      // Iniciar tentativa
      const attemptResponse = await api.post(`/quizzes/${quizId}/start`);
      setAttemptId(attemptResponse.data.attemptId);
      setQuizStartTime(Date.now());
      setQuestionStartTime(Date.now());
      
      if (response.data.questions.length > 0) {
        setTimeLeft(response.data.questions[0].time_limit_seconds);
      }
    } catch (error) {
      console.error('Erro ao carregar quiz:', error);
      alert('Erro ao carregar quiz. Faça login e tente novamente.');
      navigate('/quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleTimeout = async () => {
    if (isAnswered) return;
    
    setIsAnswered(true);
    const timeTaken = Math.floor((Date.now() - questionStartTime) / 1000);
    
    // Submeter resposta vazia (timeout)
    try {
      await api.post(`/quiz-attempts/${attemptId}/answer`, {
        questionId: currentQuestion.id,
        userAnswer: '-1', // Indica timeout
        timeTaken
      });
    } catch (error) {
      console.error('Erro ao registrar timeout:', error);
    }
    
    setTimeout(() => {
      nextQuestion();
    }, 2000);
  };

  const handleAnswerClick = async (answerIndex) => {
    if (isAnswered) return;

    setSelectedAnswer(answerIndex);
    setIsAnswered(true);
    
    const timeTaken = Math.floor((Date.now() - questionStartTime) / 1000);

    try {
      const response = await api.post(`/quiz-attempts/${attemptId}/answer`, {
        questionId: currentQuestion.id,
        userAnswer: answerIndex.toString(),
        timeTaken
      });

      if (response.data.isCorrect) {
        setScore(score + response.data.pointsEarned);
        setCorrectCount(correctCount + 1);
      }

      // Aguardar 3 segundos antes de ir para próxima pergunta
      setTimeout(() => {
        nextQuestion();
      }, 3000);
    } catch (error) {
      console.error('Erro ao submeter resposta:', error);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setQuestionStartTime(Date.now());
      setTimeLeft(questions[currentQuestionIndex + 1].time_limit_seconds);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    const totalTime = Math.floor((Date.now() - quizStartTime) / 1000);
    
    try {
      const response = await api.post(`/quiz-attempts/${attemptId}/finish`, {
        totalTimeTaken: totalTime
      });
      
      // Navegar para página de resultados
      navigate(`/quiz-results/${attemptId}`, {
        state: {
          score: response.data.score,
          correctAnswers: response.data.correctAnswers,
          totalQuestions: response.data.totalQuestions,
          totalPoints: response.data.totalPoints,
          passed: response.data.passed,
          timeTaken: totalTime,
          quizTitle: quiz.title
        }
      });
    } catch (error) {
      console.error('Erro ao finalizar quiz:', error);
    }
  };

  if (loading || !quiz || questions.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress size={60} sx={{ color: theme.palette.primary.main }} />
      </Box>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const timeProgress = (timeLeft / currentQuestion.time_limit_seconds) * 100;

  // Cores para as opções (estilo Kahoot)
  const optionColors = [
    { main: '#E74C3C', light: '#FFEBEE', hover: '#C0392B' }, // Vermelho
    { main: '#3498DB', light: '#E3F2FD', hover: '#2980B9' }, // Azul
    { main: '#F39C12', light: '#FFF3E0', hover: '#E67E22' }, // Laranja
    { main: '#9B59B6', light: '#F3E5F5', hover: '#8E44AD' }, // Roxo
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 4,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorações de fundo */}
      <Box
        sx={{
          position: 'absolute',
          top: '-10%',
          right: '-10%',
          width: '40%',
          height: '40%',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.05)',
          filter: 'blur(80px)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-10%',
          left: '-10%',
          width: '40%',
          height: '40%',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.05)',
          filter: 'blur(80px)',
        }}
      />

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header com progresso */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: '20px',
            p: 3,
            mb: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#212121' }}>
              {quiz.title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrophyIcon sx={{ color: '#F57C00' }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#F57C00' }}>
                {score} pts
              </Typography>
            </Box>
          </Box>

          {/* Barra de progresso do quiz */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ color: '#757575', fontWeight: 600 }}>
                Pergunta {currentQuestionIndex + 1} de {questions.length}
              </Typography>
              <Typography variant="body2" sx={{ color: '#757575', fontWeight: 600 }}>
                {correctCount} corretas
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 10,
                borderRadius: 5,
                bgcolor: alpha('#2E7D32', 0.1),
                '& .MuiLinearProgress-bar': {
                  borderRadius: 5,
                  background: 'linear-gradient(90deg, #2E7D32 0%, #66BB6A 100%)',
                },
              }}
            />
          </Box>

          {/* Timer */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TimerIcon
              sx={{
                color: timeLeft <= 5 ? '#D32F2F' : '#2E7D32',
                animation: timeLeft <= 5 ? 'pulse 1s infinite' : 'none',
                '@keyframes pulse': {
                  '0%, 100%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.2)' },
                },
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
                      : 'linear-gradient(90deg, #2E7D32 0%, #66BB6A 100%)',
                },
              }}
            />
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                color: timeLeft <= 5 ? '#D32F2F' : '#2E7D32',
                minWidth: '40px',
                textAlign: 'right',
              }}
            >
              {timeLeft}s
            </Typography>
          </Box>
        </Paper>

        {/* Pergunta */}
        <Zoom in={true} key={currentQuestionIndex}>
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
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: '#212121',
                lineHeight: 1.4,
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
            gap: 3,
          }}
        >
          {currentQuestion.options?.map((option, index) => {
            const color = optionColors[index % 4];
            const isSelected = selectedAnswer === index;
            
            return (
              <Fade in={true} key={index} timeout={300 + index * 100}>
                <Paper
                  onClick={() => handleAnswerClick(index)}
                  elevation={0}
                  sx={{
                    borderRadius: '20px',
                    p: 3,
                    cursor: isAnswered ? 'default' : 'pointer',
                    background: isAnswered && isSelected
                      ? 'rgba(255, 255, 255, 0.95)'
                      : 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '3px solid',
                    borderColor: isAnswered && isSelected
                      ? isSelected === index
                        ? '#2E7D32'
                        : '#D32F2F'
                      : color.main,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': isAnswered
                      ? {}
                      : {
                          transform: 'translateY(-8px) scale(1.02)',
                          boxShadow: `0 20px 40px ${alpha(color.main, 0.3)}`,
                          borderColor: color.hover,
                        },
                    '&:active': isAnswered
                      ? {}
                      : {
                          transform: 'translateY(-4px) scale(1.01)',
                        },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: `linear-gradient(135deg, ${alpha(color.main, 0.1)} 0%, ${alpha(
                        color.main,
                        0.05
                      )} 100%)`,
                      opacity: isAnswered ? 0 : 1,
                      transition: 'opacity 0.3s',
                    },
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
                        background: color.main,
                        mb: 2,
                        mx: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {isAnswered && isSelected && (
                        <Box
                          sx={{
                            transform: index === 3 ? 'rotate(-45deg)' : 'none',
                          }}
                        >
                          {isSelected === index ? (
                            <CorrectIcon sx={{ color: '#fff', fontSize: 28 }} />
                          ) : (
                            <WrongIcon sx={{ color: '#fff', fontSize: 28 }} />
                          )}
                        </Box>
                      )}
                    </Box>

                    {/* Texto da opção */}
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: '#212121',
                        wordBreak: 'break-word',
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
      </Container>
    </Box>
  );
}

export default QuizPlay;

