import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  CircularProgress,
  Breadcrumbs,
  Link,
  useTheme,
  useMediaQuery,
  Paper,
  Divider,
  LinearProgress,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  Avatar,
  Stack
} from '@mui/material';
import {
  AccessTime as AccessTimeIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  PlayCircle as PlayCircleIcon,
  Bookmark as BookmarkIcon,
  Share as ShareIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  EmojiEvents as EmojiEventsIcon,
  LocalLibrary as LocalLibraryIcon
} from '@mui/icons-material';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '../components/Footer';

const TrailCourses = () => {
  const { trailId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [trail, setTrail] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [progress, setProgress] = useState({});

  const API_BASE_URL = 'http://localhost:3001';

  const getTrailTheme = (title) => {
    switch (title?.toLowerCase()) {
      case 'água':
        return {
          primary: '#0288D1',
          secondary: '#03A9F4',
          gradient: 'linear-gradient(45deg, #0288D1 30%, #03A9F4 90%)',
          hoverGradient: 'linear-gradient(45deg, #0277BD 30%, #039BE5 90%)',
          light: '#E1F5FE',
          dark: '#01579B'
        };
      case 'energia':
        return {
          primary: '#FFA000',
          secondary: '#FFB300',
          gradient: 'linear-gradient(45deg, #FFA000 30%, #FFB300 90%)',
          hoverGradient: 'linear-gradient(45deg, #F57C00 30%, #FFA000 90%)',
          light: '#FFF3E0',
          dark: '#E65100'
        };
      case 'clima':
        return {
          primary: '#43A047',
          secondary: '#66BB6A',
          gradient: 'linear-gradient(45deg, #43A047 30%, #66BB6A 90%)',
          hoverGradient: 'linear-gradient(45deg, #2E7D32 30%, #43A047 90%)',
          light: '#E8F5E9',
          dark: '#1B5E20'
        };
      case 'reciclagem':
        return {
          primary: '#7CB342',
          secondary: '#9CCC65',
          gradient: 'linear-gradient(45deg, #7CB342 30%, #9CCC65 90%)',
          hoverGradient: 'linear-gradient(45deg, #558B2F 30%, #7CB342 90%)',
          light: '#F1F8E9',
          dark: '#33691E'
        };
      default:
        return {
          primary: '#1976D2',
          secondary: '#2196F3',
          gradient: 'linear-gradient(45deg, #1976D2 30%, #2196F3 90%)',
          hoverGradient: 'linear-gradient(45deg, #1565C0 30%, #1E88E5 90%)',
          light: '#E3F2FD',
          dark: '#0D47A1'
        };
    }
  };

  const trailTheme = getTrailTheme(trail?.title);

  useEffect(() => {
    const fetchTrailData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/trails/${trailId}`);
        setTrail(response.data.trail);
        setCourses(response.data.courses);
        
        // Simular progresso do usuário (substitua por dados reais da API)
        const mockProgress = {};
        response.data.courses.forEach(course => {
          mockProgress[course.id] = Math.floor(Math.random() * 100);
        });
        setProgress(mockProgress);
      } catch (err) {
        setError('Erro ao carregar os dados da trilha');
        console.error('Erro:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrailData();
  }, [trailId]);

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const getDifficultyColor = (level) => {
    switch (level) {
      case 'beginner': return '#2E7D32';
      case 'intermediate': return '#ED6C02';
      case 'advanced': return '#9C27B0';
      default: return '#757575';
    }
  };

  const getDifficultyLabel = (level) => {
    switch (level) {
      case 'beginner': return 'Iniciante';
      case 'intermediate': return 'Intermediário';
      case 'advanced': return 'Avançado';
      default: return level;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography color="error" align="center">{error}</Typography>
      </Container>
    );
  }

  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{
        background: trail?.image_url
          ? `${trailTheme.gradient}, linear-gradient(rgba(0,0,0,0.60), rgba(0,0,0,0.70)), url(${trail.image_url})`
          : trailTheme.gradient,
        backgroundBlendMode: trail?.image_url ? 'overlay, darken' : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#fff',
        py: { xs: 8, md: 12 },
        mb: 6,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: `0 4px 20px ${trailTheme.primary}20`
      }}>
        <Container maxWidth="lg">
          <Breadcrumbs sx={{ mb: 3, color: '#fff' }}>
            <Link href="/" color="inherit" underline="hover">Início</Link>
            <Link href="/trails" color="inherit" underline="hover">Trilhas</Link>
            <Typography color="inherit">{trail?.title}</Typography>
          </Breadcrumbs>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h2" component="h1" sx={{ 
              fontWeight: 800,
              mb: 2,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}>
              {trail?.title}
            </Typography>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Typography variant="h6" sx={{ 
              maxWidth: '800px',
              mb: 4,
              opacity: 0.9,
              lineHeight: 1.6
            }}>
              {trail?.description}
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Chip
                icon={<AccessTimeIcon />}
                label={`${trail?.duration_hours} horas`}
                sx={{ 
                  background: 'rgba(255, 255, 255, 0.15)', 
                  color: '#fff',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.2)',
                  }
                }}
              />
              <Chip
                icon={<SchoolIcon />}
                label={getDifficultyLabel(trail?.difficulty_level)}
                sx={{ 
                  background: 'rgba(255, 255, 255, 0.15)',
                  color: '#fff',
                  borderColor: getDifficultyColor(trail?.difficulty_level),
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.2)',
                  }
                }}
              />
              <Chip
                icon={<LocalLibraryIcon />}
                label={`${courses.length} cursos`}
                sx={{ 
                  background: 'rgba(255, 255, 255, 0.15)', 
                  color: '#fff',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.2)',
                  }
                }}
              />
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Trail Overview */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Paper elevation={0} sx={{ 
          p: 4, 
          borderRadius: 2, 
          bgcolor: 'background.paper',
          boxShadow: `0 4px 20px ${trailTheme.primary}10`,
          border: `1px solid ${trailTheme.primary}10`
        }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
                O que você vai aprender
              </Typography>
              <Stack spacing={2}>
                {courses.map((course, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                    <CheckCircleIcon sx={{ color: '#2E7D32', mr: 2 }} />
                    <Typography>{course.title}</Typography>
                  </Box>
                ))}
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
                Benefícios da Trilha
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <EmojiEventsIcon sx={{ color: '#ED6C02', mr: 2 }} />
                  <Typography>Certificado de conclusão</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocalLibraryIcon sx={{ color: '#1976D2', mr: 2 }} />
                  <Typography>Acesso vitalício ao conteúdo</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PersonIcon sx={{ color: '#9C27B0', mr: 2 }} />
                  <Typography>Suporte de instrutores especializados</Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      {/* Courses Grid */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Cursos Disponíveis
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Filtrar por dificuldade">
              <IconButton>
                <SchoolIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Ordenar por">
              <IconButton>
                <InfoIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Grid container spacing={4}>
          {courses.map((course, index) => (
            <Grid item xs={12} sm={6} md={4} key={course.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                    borderRadius: 2,
                    background: `${trailTheme.light}10`,
                    border: `1px solid ${trailTheme.primary}15`,
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: `0 12px 24px ${trailTheme.primary}15`,
                      border: `1px solid ${trailTheme.primary}30`,
                      background: `${trailTheme.light}15`
                    }
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={course.image_url ? `${API_BASE_URL}${course.image_url}` : '/images/courses/default.jpg'}
                      alt={course.title}
                      sx={{ objectFit: 'cover' }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        p: 1,
                        display: 'flex',
                        gap: 1
                      }}
                    >
                      <Tooltip title="Salvar para depois">
                        <IconButton size="small" sx={{ 
                          bgcolor: 'rgba(255,255,255,0.95)',
                          '&:hover': {
                            bgcolor: '#fff',
                            transform: 'scale(1.1)'
                          },
                          transition: 'all 0.2s ease'
                        }}>
                          <BookmarkIcon sx={{ color: '#1976D2' }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Compartilhar">
                        <IconButton size="small" sx={{ 
                          bgcolor: 'rgba(255,255,255,0.95)',
                          '&:hover': {
                            bgcolor: '#fff',
                            transform: 'scale(1.1)'
                          },
                          transition: 'all 0.2s ease'
                        }}>
                          <ShareIcon sx={{ color: '#1976D2' }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>

                  <CardContent sx={{ 
                    flexGrow: 1, 
                    display: 'flex', 
                    flexDirection: 'column',
                    background: `${trailTheme.light}05`,
                    borderTop: `1px solid ${trailTheme.primary}10`
                  }}>
                    <Typography variant="h6" component="h2" sx={{ 
                      mb: 1, 
                      fontWeight: 700,
                      color: trailTheme.primary
                    }}>
                      {course.title}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                      {course.description}
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <PersonIcon sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {course.instructor}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <AccessTimeIcon sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {course.duration_minutes} minutos
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Chip
                          label={getDifficultyLabel(course.difficulty_level)}
                          size="small"
                          sx={{ 
                            background: getDifficultyColor(course.difficulty_level),
                            color: '#fff'
                          }}
                        />
                      </Box>
                    </Box>

                    {progress[course.id] > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Progresso: {progress[course.id]}%
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={progress[course.id]} 
                          sx={{ 
                            height: 6, 
                            borderRadius: 3,
                            bgcolor: 'rgba(0,0,0,0.05)',
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 3,
                              background: 'linear-gradient(45deg, #1976D2 30%, #2196F3 90%)'
                            }
                          }}
                        />
                      </Box>
                    )}

                    <Box sx={{ mt: 'auto', pt: 2 }}>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => handleCourseClick(course)}
                        startIcon={<PlayCircleIcon />}
                        sx={{
                          background: trailTheme.gradient,
                          color: '#fff',
                          fontWeight: 600,
                          py: 1.5,
                          borderRadius: 2,
                          '&:hover': {
                            background: trailTheme.hoverGradient,
                            transform: 'translateY(-2px)',
                            boxShadow: `0 4px 12px ${trailTheme.primary}40`
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {course.is_free ? 'Grátis' : `R$ ${Number(course.price || 0).toFixed(2)}`}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Course Details Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: `0 8px 32px ${trailTheme.primary}20`
          }
        }}
      >
        {selectedCourse && (
          <>
            <DialogTitle sx={{ 
              background: trailTheme.gradient,
              color: '#fff'
            }}>
              <Typography variant="h5" component="div" sx={{ fontWeight: 700 }}>
                {selectedCourse.title}
              </Typography>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <img 
                    src={selectedCourse.image_url ? `${API_BASE_URL}${selectedCourse.image_url}` : '/images/courses/default.jpg'} 
                    alt={selectedCourse.title}
                    style={{ width: '100%', borderRadius: 8 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Sobre o Curso
                  </Typography>
                  <Typography paragraph>
                    {selectedCourse.description}
                  </Typography>
                  
                  <Typography variant="h6" sx={{ mb: 2, mt: 3 }}>
                    Objetivos de Aprendizado
                  </Typography>
                  <Typography paragraph>
                    {selectedCourse.learning_objectives}
                  </Typography>

                  <Typography variant="h6" sx={{ mb: 2, mt: 3 }}>
                    Público-Alvo
                  </Typography>
                  <Typography paragraph>
                    {selectedCourse.target_audience}
                  </Typography>

                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                      Instrutor
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar src={`https://i.pravatar.cc/150?u=${selectedCourse.instructor}`} />
                      <Typography>{selectedCourse.instructor}</Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={handleCloseDialog} color="inherit" sx={{ 
                '&:hover': {
                  background: `${trailTheme.primary}10`
                }
              }}>
                Fechar
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate(`/courses/${selectedCourse.id}`)}
                sx={{
                  background: trailTheme.gradient,
                  color: '#fff',
                  fontWeight: 600,
                  px: 4,
                  borderRadius: 2,
                  '&:hover': {
                    background: trailTheme.hoverGradient,
                    transform: 'translateY(-2px)',
                    boxShadow: `0 4px 12px ${trailTheme.primary}40`
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                {selectedCourse.is_free ? 'Começar Agora' : `Comprar por R$ ${Number(selectedCourse.price || 0).toFixed(2)}`}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      <Footer />
    </Box>
  );
};

export default TrailCourses;