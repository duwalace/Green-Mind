import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer,
  IconButton,
  CircularProgress,
  Chip,
  useTheme,
  useMediaQuery,
  Divider,
  Paper,
  LinearProgress
} from '@mui/material';
import {
  PlayCircleOutline as PlayIcon,
  CheckCircle as CheckCircleIcon,
  Menu as MenuIcon,
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
  VideoLibrary as VideoLibraryIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import axios from 'axios';
import Footer from '../components/Footer';

const Aulas = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [currentLessonContents, setCurrentLessonContents] = useState([]);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [loading, setLoading] = useState(true);
  const [loadingContents, setLoadingContents] = useState(false);
  const [error, setError] = useState(null);

  // Calcular aula atual e progresso
  const currentLesson = lessons[currentLessonIndex];
  const progress = lessons.length > 0 ? (completedLessons.length / lessons.length) * 100 : 0;

  useEffect(() => {
    const fetchCourseAndLessons = async () => {
      try {
        // Buscar informações do curso
        const courseResponse = await axios.get(`http://localhost:3001/api/courses/${courseId}`);
        setCourse(courseResponse.data.course);

        // Buscar aulas do curso
        const lessonsResponse = await axios.get(`http://localhost:3001/api/courses/${courseId}/lessons`);
        setLessons(lessonsResponse.data.lessons || []);
      } catch (err) {
        console.error('Erro ao carregar curso e aulas:', err);
        setError('Erro ao carregar o conteúdo do curso');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndLessons();
  }, [courseId]);

  useEffect(() => {
    const fetchLessonContents = async () => {
      if (currentLesson) {
        try {
          setLoadingContents(true);
          const response = await axios.get(`http://localhost:3001/api/lessons/${currentLesson.id}/contents`);
          setCurrentLessonContents(response.data.contents || []);
        } catch (err) {
          console.error('Erro ao carregar conteúdos da aula:', err);
        } finally {
          setLoadingContents(false);
        }
      }
    };

    fetchLessonContents();
  }, [currentLesson]);

  const handleLessonSelect = (index) => {
    setCurrentLessonIndex(index);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleComplete = () => {
    if (currentLesson && !completedLessons.includes(currentLesson.id)) {
      setCompletedLessons([...completedLessons, currentLesson.id]);
    }
  };

  const handlePrev = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentLessonIndex < lessons.length - 1) {
      // Marcar aula atual como completa ao avançar
      if (currentLesson && !completedLessons.includes(currentLesson.id)) {
        setCompletedLessons([...completedLessons, currentLesson.id]);
      }
      setCurrentLessonIndex(currentLessonIndex + 1);
    }
  };

  const SidebarContent = () => (
    <Box sx={{ width: { xs: '100%', md: 320 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 3, borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, flex: 1 }}>
            {course?.title}
          </Typography>
          {isMobile && (
            <IconButton onClick={() => setSidebarOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          )}
        </Box>
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Progresso do curso
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {Math.round(progress)}%
            </Typography>
          </Box>
          <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
        </Box>
        <Typography variant="body2" color="text.secondary">
          {completedLessons.length} de {lessons.length} aulas concluídas
        </Typography>
      </Box>

      <List sx={{ flex: 1, overflow: 'auto', py: 2 }}>
        {lessons.map((lesson, index) => {
          const isCompleted = completedLessons.includes(lesson.id);
          const isCurrent = index === currentLessonIndex;

          return (
            <ListItem key={lesson.id} disablePadding sx={{ px: 2, mb: 1 }}>
              <ListItemButton
                selected={isCurrent}
                onClick={() => handleLessonSelect(index)}
                sx={{
                  borderRadius: 2,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                  },
                }}
              >
                <ListItemIcon>
                  {isCompleted ? (
                    <CheckCircleIcon color={isCurrent ? 'inherit' : 'success'} />
                  ) : (
                    <PlayIcon color={isCurrent ? 'inherit' : 'action'} />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={lesson.title}
                  secondary={
                    <Typography variant="caption" color={isCurrent ? 'inherit' : 'text.secondary'}>
                      Aula {index + 1} {lesson.duration_minutes && `• ${lesson.duration_minutes} min`}
                    </Typography>
                  }
                  primaryTypographyProps={{
                    variant: 'body2',
                    fontWeight: isCurrent ? 600 : 400,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !course) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography color="error" align="center">{error || 'Curso não encontrado'}</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button variant="contained" onClick={() => navigate('/courses')}>
            Voltar para Cursos
          </Button>
        </Box>
      </Container>
    );
  }

  if (lessons.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <VideoLibraryIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Nenhuma aula disponível
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Este curso ainda não possui aulas cadastradas.
          </Typography>
          <Button variant="contained" onClick={() => navigate('/courses')}>
            Voltar para Cursos
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <>
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        {/* Sidebar Desktop */}
        {!isMobile && (
          <Box
            sx={{
              width: 320,
              borderRight: `1px solid ${theme.palette.divider}`,
              bgcolor: 'background.paper',
              position: 'fixed',
              height: '100vh',
              overflow: 'hidden',
            }}
          >
            <SidebarContent />
          </Box>
        )}

        {/* Drawer Mobile */}
        <Drawer
          anchor="left"
          open={sidebarOpen && isMobile}
          onClose={() => setSidebarOpen(false)}
          sx={{
            display: { xs: 'block', md: 'none' },
          }}
        >
          <SidebarContent />
        </Drawer>

        {/* Main Content */}
        <Box
          sx={{
            flex: 1,
            ml: { xs: 0, md: '320px' },
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              borderBottom: `1px solid ${theme.palette.divider}`,
              bgcolor: 'background.paper',
              px: 3,
              py: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {isMobile && (
                  <IconButton onClick={() => setSidebarOpen(true)}>
                    <MenuIcon />
                  </IconButton>
                )}
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {currentLesson?.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Aula {currentLessonIndex + 1} de {lessons.length}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<NavigateBeforeIcon />}
                  onClick={handlePrev}
                  disabled={currentLessonIndex === 0}
                  size={isMobile ? 'small' : 'medium'}
                >
                  {!isMobile && 'Anterior'}
                </Button>
                <Button
                  variant="contained"
                  onClick={handleComplete}
                  disabled={completedLessons.includes(currentLesson?.id)}
                  size={isMobile ? 'small' : 'medium'}
                >
                  {completedLessons.includes(currentLesson?.id) ? 'Concluída' : 'Marcar como Concluída'}
                </Button>
                <Button
                  variant="outlined"
                  endIcon={<NavigateNextIcon />}
                  onClick={handleNext}
                  disabled={currentLessonIndex === lessons.length - 1}
                  size={isMobile ? 'small' : 'medium'}
                >
                  {!isMobile && 'Próxima'}
                </Button>
              </Box>
            </Box>
          </Box>

          {/* Lesson Content */}
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            <Container maxWidth="lg" sx={{ py: 4 }}>
              {loadingContents ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                  <CircularProgress />
                </Box>
              ) : currentLessonContents.length > 0 ? (
                <>
                  {/* Renderizar múltiplos conteúdos */}
                  {currentLessonContents.map((content, index) => (
                    <Card key={content.id} sx={{ mb: 4 }}>
                      <CardContent sx={{ p: 4 }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                          {content.title}
                        </Typography>

                        {/* Conteúdo tipo Vídeo */}
                        {content.content_type === 'video' && content.video_url && (
                          <Box
                            sx={{
                              position: 'relative',
                              paddingTop: '56.25%',
                              bgcolor: 'black',
                              borderRadius: 2,
                              overflow: 'hidden',
                              mb: 2
                            }}
                          >
                            <iframe
                              src={content.video_url}
                              title={content.title}
                              style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                border: 'none',
                              }}
                              allowFullScreen
                            />
                          </Box>
                        )}

                        {/* Conteúdo tipo Texto */}
                        {content.content_type === 'text' && content.text_content && (
                          <Box
                            sx={{
                              bgcolor: 'grey.50',
                              p: 3,
                              borderRadius: 2,
                              border: '1px solid',
                              borderColor: 'grey.200'
                            }}
                          >
                            <Typography
                              variant="body1"
                              sx={{
                                whiteSpace: 'pre-wrap',
                                lineHeight: 1.8,
                              }}
                            >
                              {content.text_content}
                            </Typography>
                          </Box>
                        )}

                        {/* Conteúdo tipo Exercício */}
                        {content.content_type === 'exercise' && (
                          <Box
                            sx={{
                              bgcolor: 'success.50',
                              p: 3,
                              borderRadius: 2,
                              border: '2px solid',
                              borderColor: 'success.main'
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                              <CheckCircleIcon color="success" />
                              <Typography variant="h6" fontWeight={600}>
                                Exercício Prático
                              </Typography>
                            </Box>
                            
                            {content.exercise_question && (
                              <>
                                <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
                                  {content.exercise_question}
                                </Typography>
                                
                                <Chip
                                  label={content.exercise_type === 'multiple_choice' ? 'Múltipla Escolha' :
                                        content.exercise_type === 'file_upload' ? 'Upload de Arquivo' :
                                        'Resposta em Texto'}
                                  size="small"
                                  color="success"
                                  sx={{ mt: 2 }}
                                />
                              </>
                            )}
                          </Box>
                        )}

                        {content.video_duration && content.content_type === 'video' && (
                          <Chip
                            label={`Duração: ${content.video_duration} minutos`}
                            size="small"
                            variant="outlined"
                            sx={{ mt: 2 }}
                          />
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </>
              ) : (
                /* Conteúdo Legado (se não houver conteúdos múltiplos) */
                <>
                  {currentLesson?.video_url && (
                    <Card sx={{ mb: 4 }}>
                      <Box
                        sx={{
                          position: 'relative',
                          paddingTop: '56.25%',
                          bgcolor: 'black',
                        }}
                      >
                        <iframe
                          src={currentLesson.video_url}
                          title={currentLesson.title}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            border: 'none',
                          }}
                          allowFullScreen
                        />
                      </Box>
                    </Card>
                  )}

                  <Card>
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                        {currentLesson?.title}
                      </Typography>

                      {currentLesson?.description && (
                        <Typography variant="body1" color="text.secondary" paragraph>
                          {currentLesson.description}
                        </Typography>
                      )}

                      <Divider sx={{ my: 3 }} />

                      {currentLesson?.content && (
                        <Box>
                          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                            Conteúdo da Aula
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              whiteSpace: 'pre-wrap',
                              lineHeight: 1.8,
                            }}
                          >
                            {currentLesson.content}
                          </Typography>
                        </Box>
                      )}

                      {currentLesson?.duration_minutes && (
                        <Box sx={{ mt: 3 }}>
                          <Chip
                            label={`Duração: ${currentLesson.duration_minutes} minutos`}
                            color="primary"
                            variant="outlined"
                          />
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </>
              )}
            </Container>
          </Box>
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default Aulas;

