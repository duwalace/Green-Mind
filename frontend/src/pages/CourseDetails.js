import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Chip,
  Grid,
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  AccessTime as AccessTimeIcon,
  School as SchoolIcon,
  CheckCircle as CheckCircleIcon,
  PlayArrow as PlayArrowIcon,
  EmojiEvents as TrophyIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import axios from 'axios';
import api from '../services/api';
import Footer from '../components/Footer';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const [courseResponse, lessonsResponse] = await Promise.all([
          // 🔧 CORRIGIDO: Usar api service
          api.get(`/courses/${id}`),
          api.get(`/courses/${id}/lessons`)
        ]);
        
        setCourse(courseResponse.data.course);
        setLessons(lessonsResponse.data.lessons || []);
      } catch (err) {
        console.error('Erro ao carregar dados do curso:', err);
        setError('Erro ao carregar o curso');
      } finally {
        setLoading(false);
      }
    };
    fetchCourseData();
  }, [id]);

  const getDifficultyLabel = (level) => {
    const labels = {
      beginner: 'Iniciante',
      intermediate: 'Intermediário',
      advanced: 'Avançado'
    };
    return labels[level] || level;
  };

  const getDifficultyColor = (level) => {
    const colors = {
      beginner: '#4CAF50',
      intermediate: '#FF9800',
      advanced: '#F44336'
    };
    return colors[level] || '#757575';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error || !course) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="error" gutterBottom>
            {error || 'Curso não encontrado'}
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/courses')}
            sx={{ mt: 2 }}
          >
            Voltar para Cursos
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 50%, #01579b 100%)',
          color: 'white',
          py: { xs: 6, md: 10 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 50%, rgba(33, 203, 243, 0.1) 0%, transparent 50%)',
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/courses')}
            sx={{
              color: 'white',
              mb: 3,
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            Voltar
          </Button>

          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              <Chip
                label={getDifficultyLabel(course.difficulty_level)}
                size="small"
                sx={{
                  bgcolor: getDifficultyColor(course.difficulty_level),
                  color: 'white',
                  fontWeight: 600,
                  mb: 2
                }}
              />
              
              <Typography
                variant={isMobile ? 'h4' : 'h3'}
                sx={{
                  fontWeight: 800,
                  mb: 2,
                  lineHeight: 1.2
                }}
              >
                {course.title}
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  opacity: 0.95,
                  mb: 4,
                  lineHeight: 1.6,
                  fontWeight: 400
                }}
              >
                {course.description}
              </Typography>

              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTimeIcon />
                  <Typography variant="body1">
                    {course.duration_minutes} minutos
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PlayArrowIcon />
                  <Typography variant="body1">
                    {lessons.length} aulas
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrophyIcon />
                  <Typography variant="body1">
                    Certificado incluso
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card
                elevation={8}
                sx={{
                  p: 3,
                  bgcolor: 'rgba(255,255,255,0.98)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  {course.is_free ? (
                    <>
                      <Typography
                        variant="h3"
                        sx={{
                          fontWeight: 800,
                          color: '#4CAF50',
                          mb: 1
                        }}
                      >
                        GRATUITO
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Acesso completo sem custo
                      </Typography>
                    </>
                  ) : (
                    <>
                      <Typography variant="h3" sx={{ fontWeight: 800, color: '#1976D2' }}>
                        R$ {Number(course.price || 0).toFixed(2)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Pagamento único
                      </Typography>
                    </>
                  )}
                </Box>

                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  startIcon={<PlayArrowIcon />}
                  onClick={() => navigate(`/courses/${course.id}/start`)}
                  sx={{
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    color: 'white',
                    fontWeight: 700,
                    py: 1.8,
                    fontSize: '1.1rem',
                    boxShadow: '0 4px 20px rgba(33, 150, 243, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1976D2 30%, #2196F3 90%)',
                      boxShadow: '0 6px 25px rgba(33, 150, 243, 0.5)',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Começar Agora
                </Button>

                <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid #e0e0e0' }}>
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 1 }}>
                    Este curso inclui:
                  </Typography>
                  {[
                    'Acesso vitalício',
                    'Certificado de conclusão',
                    'Suporte online',
                    'Aprenda no seu ritmo'
                  ].map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        py: 0.8
                      }}
                    >
                      <CheckCircleIcon sx={{ color: '#4CAF50', fontSize: 20 }} />
                      <Typography variant="body2">{item}</Typography>
                    </Box>
                  ))}
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Content Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Grid container spacing={6}>
          {/* What You'll Learn */}
          {course.learning_objectives && (
            <Grid item xs={12} md={8}>
              <Card elevation={2} sx={{ p: 4, height: '100%' }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    mb: 3,
                    color: '#1a237e',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <SchoolIcon sx={{ fontSize: 32 }} />
                  O que você vai aprender
                </Typography>

                <Grid container spacing={2}>
                  {course.learning_objectives.split('\n').filter(item => item.trim()).map((item, idx) => (
                    <Grid item xs={12} sm={6} key={idx}>
                      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                        <CheckCircleIcon sx={{ color: '#4CAF50', mt: 0.5, fontSize: 20 }} />
                        <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                          {item}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Card>
            </Grid>
          )}

          {/* Course Info */}
          <Grid item xs={12} md={4}>
            <Card elevation={2} sx={{ p: 4, bgcolor: '#f5f5f5' }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: '#1a237e' }}>
                Informações do Curso
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Nível de Dificuldade
                  </Typography>
                  <Chip
                    label={getDifficultyLabel(course.difficulty_level)}
                    sx={{
                      bgcolor: getDifficultyColor(course.difficulty_level),
                      color: 'white',
                      fontWeight: 600
                    }}
                  />
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Duração Total
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {course.duration_minutes} minutos
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Total de Aulas
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {lessons.length} aulas
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Investimento
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: course.is_free ? '#4CAF50' : '#1976D2' }}>
                    {course.is_free ? 'Gratuito' : `R$ ${Number(course.price || 0).toFixed(2)}`}
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>

          {/* Lessons Preview */}
          {lessons.length > 0 && (
            <Grid item xs={12}>
              <Card elevation={2} sx={{ p: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: '#1a237e' }}>
                  Conteúdo do Curso
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {lessons.slice(0, 5).map((lesson, index) => (
                    <Paper
                      key={lesson.id}
                      elevation={1}
                      sx={{
                        p: 2.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: '#f5f5f5',
                          transform: 'translateX(8px)'
                        }
                      }}
                    >
                      <Box
                        sx={{
                          minWidth: 40,
                          height: 40,
                          borderRadius: '50%',
                          bgcolor: '#e3f2fd',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          color: '#1976D2'
                        }}
                      >
                        {index + 1}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {lesson.title}
                        </Typography>
                        {lesson.description && (
                          <Typography variant="body2" color="text.secondary">
                            {lesson.description.substring(0, 80)}
                            {lesson.description.length > 80 ? '...' : ''}
                          </Typography>
                        )}
                      </Box>
                      {lesson.duration_minutes && (
                        <Chip
                          icon={<AccessTimeIcon />}
                          label={`${lesson.duration_minutes} min`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Paper>
                  ))}
                  
                  {lessons.length > 5 && (
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
                      + {lessons.length - 5} aulas adicionais
                    </Typography>
                  )}
                </Box>
              </Card>
            </Grid>
          )}
        </Grid>
      </Container>

      <Footer />
    </>
  );
};

export default CourseDetails; 