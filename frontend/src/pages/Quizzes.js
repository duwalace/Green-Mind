import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Button,
  CircularProgress,
  Alert,
  alpha,
  useTheme
} from '@mui/material';
import {
  Quiz as QuizIcon,
  EmojiEvents as TrophyIcon,
  AccessTime as TimeIcon,
  School as SchoolIcon,
  PlayArrow as PlayIcon,
  Group as GroupIcon,
  Login as LoginIcon
} from '@mui/icons-material';
import api from '../services/api';

function Quizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/quizzes');
      setQuizzes(response.data.quizzes);
    } catch (err) {
      console.error('Erro ao buscar quizzes:', err);
      setError('Erro ao carregar quizzes. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (level) => {
    switch (level) {
      case 'beginner': return { bg: '#E8F5E9', color: '#2E7D32', text: 'Iniciante' };
      case 'intermediate': return { bg: '#FFF3E0', color: '#F57C00', text: 'Intermediário' };
      case 'advanced': return { bg: '#FFEBEE', color: '#D32F2F', text: 'Avançado' };
      default: return { bg: '#F5F5F5', color: '#757575', text: 'Indefinido' };
    }
  };

  const handleStartQuiz = (quizId) => {
    navigate(`/quiz-play/${quizId}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} sx={{ color: theme.palette.primary.main }} />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      mt: 8,
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #FAFAFA 0%, #F5F5F5 100%)',
      py: 6
    }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #2E7D32 0%, #66BB6A 100%)',
            borderRadius: '24px',
            padding: '48px 40px',
            mb: 6,
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 12px 32px rgba(46, 125, 50, 0.3)',
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <QuizIcon sx={{ fontSize: 36, color: '#fff' }} />
              </Box>
              <Box>
                <Typography variant="h3" sx={{ color: '#fff', fontWeight: 700, mb: 1 }}>
                  Quizzes Interativos
                </Typography>
                <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                  Teste seus conhecimentos e desafie seus limites!
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Decoração */}
          <Box
            sx={{
              position: 'absolute',
              top: -50,
              right: -50,
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: -30,
              right: 100,
              width: 150,
              height: 150,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
            }}
          />
        </Box>

        {/* Info Banner - Não precisa de login */}
        <Alert 
          severity="info" 
          icon={<LoginIcon />}
          sx={{ 
            mb: 4, 
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
            border: '2px solid #2196F3',
            '& .MuiAlert-icon': {
              color: '#1976D2'
            }
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: 600, color: '#1565C0' }}>
            ✨ Você pode jogar quizzes sem fazer login! Mas se quiser salvar seu progresso e aparecer no ranking, faça login ou cadastre-se.
          </Typography>
        </Alert>

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mb: 4, borderRadius: '12px' }}>
            {error}
          </Alert>
        )}

        {/* Banner Multiplayer */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '20px',
            p: 4,
            mb: 4,
            boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <GroupIcon sx={{ fontSize: 48, color: '#fff' }} />
                <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700 }}>
                  🎮 Modo Multiplayer
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.95)', mb: 2, fontSize: '1.1rem' }}>
                Jogue com seus amigos em tempo real! Crie uma sala ou entre com um código.
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip
                  label="✨ Sincronização em Tempo Real"
                  sx={{ background: 'rgba(255, 255, 255, 0.2)', color: '#fff', fontWeight: 600 }}
                />
                <Chip
                  label="🏆 Leaderboard ao Vivo"
                  sx={{ background: 'rgba(255, 255, 255, 0.2)', color: '#fff', fontWeight: 600 }}
                />
                <Chip
                  label="🌐 Mesma Rede Local (LAN)"
                  sx={{ background: 'rgba(255, 255, 255, 0.2)', color: '#fff', fontWeight: 600 }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  startIcon={<GroupIcon />}
                  onClick={() => navigate('/multiplayer/create')}
                  sx={{
                    py: 2,
                    background: '#fff',
                    color: '#667eea',
                    fontWeight: 700,
                    fontSize: '1rem',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.9)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)'
                    }
                  }}
                >
                  Criar Sala (Host)
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  fullWidth
                  startIcon={<LoginIcon />}
                  onClick={() => navigate('/multiplayer/join')}
                  sx={{
                    py: 2,
                    borderColor: '#fff',
                    color: '#fff',
                    borderWidth: 2,
                    fontWeight: 700,
                    fontSize: '1rem',
                    '&:hover': {
                      borderColor: '#fff',
                      borderWidth: 2,
                      background: 'rgba(255, 255, 255, 0.1)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  Entrar na Sala
                </Button>
              </Box>
            </Grid>
          </Grid>

          {/* Decoração */}
          <Box
            sx={{
              position: 'absolute',
              top: -30,
              right: -30,
              width: 150,
              height: 150,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)'
            }}
          />
        </Box>

        {/* Quizzes Grid */}
        {quizzes.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <QuizIcon sx={{ fontSize: 100, color: '#BDBDBD', mb: 2 }} />
            <Typography variant="h5" sx={{ color: '#757575', mb: 1 }}>
              Nenhum quiz disponível
            </Typography>
            <Typography variant="body1" sx={{ color: '#9E9E9E' }}>
              Novos quizzes serão adicionados em breve!
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {quizzes.map((quiz) => {
              const difficulty = getDifficultyColor(quiz.difficulty_level);
              
              return (
                <Grid item xs={12} sm={6} md={4} key={quiz.id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: '16px',
                      border: '2px solid transparent',
                      background: '#fff',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 20px 40px rgba(46, 125, 50, 0.15)',
                        border: '2px solid rgba(46, 125, 50, 0.2)',
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '6px',
                        background: 'linear-gradient(90deg, #2E7D32 0%, #66BB6A 100%)',
                      }
                    }}
                  >
                    {/* Image */}
                    {quiz.image_url && (
                      <CardMedia
                        component="img"
                        height="180"
                        image={quiz.image_url}
                        alt={quiz.title}
                        sx={{ objectFit: 'cover' }}
                      />
                    )}
                    
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      {/* Badges */}
                      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                        <Chip
                          size="small"
                          label={difficulty.text}
                          sx={{
                            background: difficulty.bg,
                            color: difficulty.color,
                            fontWeight: 700,
                            fontSize: '11px',
                            border: `1px solid ${difficulty.color}`,
                            height: '24px',
                          }}
                        />
                        {quiz.course_title && (
                          <Chip
                            size="small"
                            icon={<SchoolIcon sx={{ fontSize: 14 }} />}
                            label={quiz.course_title}
                            sx={{
                              background: alpha(theme.palette.info.main, 0.1),
                              color: theme.palette.info.main,
                              fontWeight: 600,
                              fontSize: '11px',
                              height: '24px',
                            }}
                          />
                        )}
                      </Box>

                      {/* Title */}
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: '#212121',
                          mb: 1,
                          display: '-webkit-box',
                          overflow: 'hidden',
                          WebkitBoxOrient: 'vertical',
                          WebkitLineClamp: 2,
                        }}
                      >
                        {quiz.title}
                      </Typography>

                      {/* Description */}
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#757575',
                          mb: 2,
                          display: '-webkit-box',
                          overflow: 'hidden',
                          WebkitBoxOrient: 'vertical',
                          WebkitLineClamp: 2,
                        }}
                      >
                        {quiz.description}
                      </Typography>

                      {/* Stats */}
                      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <QuizIcon sx={{ fontSize: 18, color: '#757575' }} />
                          <Typography variant="body2" sx={{ color: '#757575', fontWeight: 600 }}>
                            {quiz.total_questions} perguntas
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <TimeIcon sx={{ fontSize: 18, color: '#757575' }} />
                          <Typography variant="body2" sx={{ color: '#757575', fontWeight: 600 }}>
                            {Math.ceil(quiz.time_limit_seconds / 60)} min
                          </Typography>
                        </Box>
                      </Box>

                      {/* Action Button */}
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<PlayIcon />}
                        onClick={() => handleStartQuiz(quiz.id)}
                        sx={{
                          background: 'linear-gradient(135deg, #2E7D32 0%, #66BB6A 100%)',
                          color: '#fff',
                          padding: '12px',
                          fontSize: '14px',
                          fontWeight: 700,
                          letterSpacing: '0.5px',
                          textTransform: 'uppercase',
                          borderRadius: '10px',
                          boxShadow: '0 8px 20px rgba(46, 125, 50, 0.3)',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)',
                            boxShadow: '0 12px 28px rgba(46, 125, 50, 0.4)',
                            transform: 'translateY(-2px)',
                          },
                        }}
                      >
                        Começar Quiz
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}

        {/* Footer CTA */}
        <Box
          sx={{
            mt: 8,
            p: 4,
            borderRadius: '20px',
            background: 'linear-gradient(135deg, rgba(0, 137, 123, 0.05) 0%, rgba(0, 137, 123, 0.1) 100%)',
            border: '2px solid rgba(0, 137, 123, 0.2)',
            textAlign: 'center',
          }}
        >
          <TrophyIcon sx={{ fontSize: 60, color: '#00897B', mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#212121', mb: 1 }}>
            Desafie seus amigos!
          </Typography>
          <Typography variant="body1" sx={{ color: '#757575', mb: 2 }}>
            Complete os quizzes e veja sua posição no ranking global
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Quizzes;

