import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Avatar,
  Divider,
  Chip,
  Grid,
  alpha,
  useTheme
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Timer as TimerIcon,
  Refresh as RefreshIcon,
  Home as HomeIcon,
  Star as StarIcon,
  TrendingUp as TrendingIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import api from '../services/api';

const MotionBox = motion(Box);
const MotionPaper = motion(Paper);

function QuizResults() {
  const { attemptId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();

  const [leaderboard, setLeaderboard] = useState([]);
  const [quizId, setQuizId] = useState(null);

  const resultData = location.state || {};
  const {
    score = 0,
    correctAnswers = 0,
    totalQuestions = 0,
    totalPoints = 0,
    passed = false,
    timeTaken = 0,
    quizTitle = 'Quiz'
  } = resultData;

  useEffect(() => {
    if (attemptId) {
      fetchAttemptData();
    }
  }, [attemptId]);

  const fetchAttemptData = async () => {
    try {
      const response = await api.get(`/quiz-attempts/${attemptId}`);
      if (response.data.attempt) {
        const attempt = response.data.attempt;
        setQuizId(attempt.quiz_id);
        
        // Buscar leaderboard
        const leaderboardResponse = await api.get(`/quizzes/${attempt.quiz_id}/leaderboard?limit=10`);
        setLeaderboard(leaderboardResponse.data.leaderboard);
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRetry = () => {
    if (quizId) {
      navigate(`/quiz-play/${quizId}`);
    } else {
      navigate('/quizzes');
    }
  };

  const handleGoHome = () => {
    navigate('/quizzes');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: passed
          ? 'linear-gradient(135deg, #2E7D32 0%, #66BB6A 100%)'
          : 'linear-gradient(135deg, #D32F2F 0%, #F44336 100%)',
        py: 6,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Confetes animados (se passou) */}
      {passed && (
        <>
          {[...Array(30)].map((_, i) => (
            <MotionBox
              key={i}
              initial={{ y: -100, x: Math.random() * window.innerWidth, rotate: 0, opacity: 1 }}
              animate={{
                y: window.innerHeight + 100,
                rotate: Math.random() * 720,
                opacity: 0,
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                delay: Math.random() * 2,
                repeat: Infinity,
              }}
              sx={{
                position: 'absolute',
                width: '10px',
                height: '10px',
                background: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#F7DC6F'][
                  Math.floor(Math.random() * 5)
                ],
                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
              }}
            />
          ))}
        </>
      )}

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Card principal de resultado */}
        <MotionPaper
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          elevation={0}
          sx={{
            borderRadius: '32px',
            p: 5,
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            mb: 4,
          }}
        >
          {/* Ícone de troféu */}
          <MotionBox
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, duration: 0.6, type: 'spring', bounce: 0.5 }}
          >
            <Box
              sx={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                background: passed
                  ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
                  : 'linear-gradient(135deg, #9E9E9E 0%, #757575 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
                boxShadow: passed
                  ? '0 12px 32px rgba(255, 215, 0, 0.4)'
                  : '0 12px 32px rgba(0, 0, 0, 0.2)',
              }}
            >
              <TrophyIcon sx={{ fontSize: 64, color: '#fff' }} />
            </Box>
          </MotionBox>

          {/* Título */}
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: '#212121',
              mb: 1,
            }}
          >
            {passed ? 'Parabéns! 🎉' : 'Quase lá! 💪'}
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: '#757575',
              mb: 4,
            }}
          >
            {quizTitle}
          </Typography>

          {/* Pontuação principal */}
          <Box
            sx={{
              display: 'inline-block',
              px: 6,
              py: 3,
              borderRadius: '20px',
              background: passed
                ? 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)'
                : 'linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%)',
              border: '2px solid',
              borderColor: passed ? '#2E7D32' : '#D32F2F',
              mb: 4,
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                color: passed ? '#2E7D32' : '#D32F2F',
                fontSize: '4rem',
              }}
            >
              {Math.round(score)}%
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: passed ? '#1B5E20' : '#C62828',
                fontWeight: 600,
              }}
            >
              {passed ? 'Aprovado!' : 'Não aprovado'}
            </Typography>
          </Box>

          {/* Estatísticas */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  p: 3,
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, rgba(46, 125, 50, 0.05) 0%, rgba(102, 187, 106, 0.1) 100%)',
                  border: '2px solid',
                  borderColor: alpha(theme.palette.primary.main, 0.2),
                }}
              >
                <CheckIcon sx={{ fontSize: 40, color: '#2E7D32', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#2E7D32', mb: 0.5 }}>
                  {correctAnswers}
                </Typography>
                <Typography variant="body2" sx={{ color: '#757575', fontWeight: 600 }}>
                  Corretas
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  p: 3,
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, rgba(211, 47, 47, 0.05) 0%, rgba(244, 67, 54, 0.1) 100%)',
                  border: '2px solid',
                  borderColor: alpha('#D32F2F', 0.2),
                }}
              >
                <CancelIcon sx={{ fontSize: 40, color: '#D32F2F', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#D32F2F', mb: 0.5 }}>
                  {totalQuestions - correctAnswers}
                </Typography>
                <Typography variant="body2" sx={{ color: '#757575', fontWeight: 600 }}>
                  Erradas
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  p: 3,
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, rgba(2, 119, 189, 0.05) 0%, rgba(41, 182, 246, 0.1) 100%)',
                  border: '2px solid',
                  borderColor: alpha(theme.palette.info.main, 0.2),
                }}
              >
                <TimerIcon sx={{ fontSize: 40, color: '#0277BD', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#0277BD', mb: 0.5 }}>
                  {formatTime(timeTaken)}
                </Typography>
                <Typography variant="body2" sx={{ color: '#757575', fontWeight: 600 }}>
                  Tempo Total
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Pontos totais */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              mb: 4,
              p: 2,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(245, 124, 0, 0.05) 0%, rgba(255, 167, 38, 0.1) 100%)',
            }}
          >
            <StarIcon sx={{ color: '#F57C00', fontSize: 28 }} />
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#F57C00' }}>
              {totalPoints} pontos conquistados
            </Typography>
          </Box>

          {/* Botões de ação */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<RefreshIcon />}
              onClick={handleRetry}
              sx={{
                background: 'linear-gradient(135deg, #2E7D32 0%, #66BB6A 100%)',
                color: '#fff',
                px: 4,
                py: 1.5,
                fontSize: '16px',
                fontWeight: 700,
                borderRadius: '12px',
                boxShadow: '0 8px 20px rgba(46, 125, 50, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 28px rgba(46, 125, 50, 0.4)',
                },
              }}
            >
              Tentar Novamente
            </Button>

            <Button
              variant="outlined"
              size="large"
              startIcon={<HomeIcon />}
              onClick={handleGoHome}
              sx={{
                borderColor: '#2E7D32',
                color: '#2E7D32',
                px: 4,
                py: 1.5,
                fontSize: '16px',
                fontWeight: 700,
                borderRadius: '12px',
                borderWidth: '2px',
                '&:hover': {
                  borderWidth: '2px',
                  borderColor: '#1B5E20',
                  background: alpha('#2E7D32', 0.08),
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Voltar aos Quizzes
            </Button>
          </Box>
        </MotionPaper>

        {/* Leaderboard */}
        {leaderboard.length > 0 && (
          <MotionPaper
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            elevation={0}
            sx={{
              borderRadius: '24px',
              p: 4,
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <TrendingIcon sx={{ fontSize: 32, color: '#F57C00' }} />
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#212121' }}>
                Top 10 Ranking
              </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {leaderboard.map((entry, index) => {
              const isTop3 = index < 3;
              const medals = ['🥇', '🥈', '🥉'];

              return (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 2,
                    borderRadius: '12px',
                    mb: 2,
                    background: isTop3
                      ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 193, 7, 0.05) 100%)'
                      : 'rgba(0, 0, 0, 0.02)',
                    border: '2px solid',
                    borderColor: isTop3 ? '#FFD700' : 'transparent',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateX(8px)',
                      background: isTop3
                        ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 193, 7, 0.1) 100%)'
                        : 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  {/* Posição */}
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '12px',
                      background: isTop3
                        ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
                        : 'linear-gradient(135deg, #E0E0E0 0%, #BDBDBD 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#fff' }}>
                      {isTop3 ? medals[index] : index + 1}
                    </Typography>
                  </Box>

                  {/* Avatar e nome */}
                  <Avatar
                    src={entry.user_avatar}
                    alt={entry.user_name}
                    sx={{ width: 48, height: 48 }}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 700, color: '#212121' }}>
                      {entry.user_name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#757575' }}>
                      {entry.total_attempts} tentativa(s)
                    </Typography>
                  </Box>

                  {/* Pontuação e tempo */}
                  <Box sx={{ textAlign: 'right' }}>
                    <Chip
                      label={`${Math.round(entry.best_score)}%`}
                      sx={{
                        background: 'linear-gradient(135deg, #2E7D32 0%, #66BB6A 100%)',
                        color: '#fff',
                        fontWeight: 700,
                        mb: 0.5,
                      }}
                    />
                    <Typography variant="caption" sx={{ color: '#757575', display: 'block' }}>
                      {formatTime(entry.best_time_seconds)}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </MotionPaper>
        )}
      </Container>
    </Box>
  );
}

export default QuizResults;

