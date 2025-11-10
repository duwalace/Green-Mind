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
  Button,
  Chip,
  CircularProgress,
  TextField,
  MenuItem,
  InputAdornment,
  useTheme,
  useMediaQuery,
  Drawer,
  IconButton,
  Divider
} from '@mui/material';
import {
  AccessTime as AccessTimeIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import axios from 'axios';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';

const AllCourses = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const API_BASE_URL = 'http://localhost:3001';

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/courses');
        setCourses(response.data.courses);
      } catch (err) {
        setError('Erro ao carregar os cursos');
        console.error('Erro:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const getDifficultyColor = (level) => {
    switch (level) {
      case 'beginner': return '#4CAF50';
      case 'intermediate': return '#FF9800';
      case 'advanced': return '#F44336';
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

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'all' || course.difficulty_level === difficultyFilter;
    const matchesPrice = priceFilter === 'all' || 
                        (priceFilter === 'free' && course.is_free) ||
                        (priceFilter === 'paid' && !course.is_free);

    return matchesSearch && matchesDifficulty && matchesPrice;
  });

  const FilterDrawer = () => (
    <Drawer
      anchor="right"
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
    >
      <Box sx={{ width: 280, p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Filtros</Typography>
          <IconButton onClick={() => setDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>Dificuldade</Typography>
        <TextField
          select
          fullWidth
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value)}
          sx={{ mb: 3 }}
        >
          <MenuItem value="all">Todas</MenuItem>
          <MenuItem value="beginner">Iniciante</MenuItem>
          <MenuItem value="intermediate">Intermediário</MenuItem>
          <MenuItem value="advanced">Avançado</MenuItem>
        </TextField>

        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>Preço</Typography>
        <TextField
          select
          fullWidth
          value={priceFilter}
          onChange={(e) => setPriceFilter(e.target.value)}
        >
          <MenuItem value="all">Todos</MenuItem>
          <MenuItem value="free">Gratuitos</MenuItem>
          <MenuItem value="paid">Pagos</MenuItem>
        </TextField>
      </Box>
    </Drawer>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
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
    <>
      <Box>
        {/* Hero Section */}
        <Box sx={{
          background: 'linear-gradient(45deg, #1a237e 30%, #0d47a1 90%)',
          color: '#fff',
          py: { xs: 8, md: 12 },
          mb: 6
        }}>
          <Container maxWidth="lg">
            <Typography variant="h2" component="h1" sx={{ 
              fontWeight: 800,
              mb: 2,
              fontSize: { xs: '2.5rem', md: '3.5rem' }
            }}>
              Explore Nossos Cursos
            </Typography>
            
            <Typography variant="h6" sx={{ 
              maxWidth: '800px',
              mb: 4,
              opacity: 0.9
            }}>
              Descubra uma ampla variedade de cursos sobre sustentabilidade, meio ambiente e desenvolvimento sustentável.
            </Typography>

            <Box sx={{ 
              display: 'flex', 
              gap: 2,
              flexDirection: { xs: 'column', sm: 'row' }
            }}>
              <TextField
                fullWidth
                placeholder="Buscar cursos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'rgba(255,255,255,0.7)' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: 2,
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': {
                      borderColor: 'rgba(255,255,255,0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255,255,255,0.3)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'rgba(255,255,255,0.5)',
                    },
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: 'rgba(255,255,255,0.7)',
                  },
                }}
              />

              {isMobile ? (
                <Button
                  variant="contained"
                  startIcon={<FilterListIcon />}
                  onClick={() => setDrawerOpen(true)}
                  sx={{
                    background: 'rgba(255,255,255,0.1)',
                    color: '#fff',
                    '&:hover': {
                      background: 'rgba(255,255,255,0.2)',
                    },
                  }}
                >
                  Filtros
                </Button>
              ) : (
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    select
                    value={difficultyFilter}
                    onChange={(e) => setDifficultyFilter(e.target.value)}
                    sx={{
                      minWidth: 150,
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: 2,
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': {
                          borderColor: 'rgba(255,255,255,0.2)',
                        },
                      },
                    }}
                  >
                    <MenuItem value="all">Todas Dificuldades</MenuItem>
                    <MenuItem value="beginner">Iniciante</MenuItem>
                    <MenuItem value="intermediate">Intermediário</MenuItem>
                    <MenuItem value="advanced">Avançado</MenuItem>
                  </TextField>

                  <TextField
                    select
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(e.target.value)}
                    sx={{
                      minWidth: 150,
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: 2,
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': {
                          borderColor: 'rgba(255,255,255,0.2)',
                        },
                      },
                    }}
                  >
                    <MenuItem value="all">Todos Preços</MenuItem>
                    <MenuItem value="free">Gratuitos</MenuItem>
                    <MenuItem value="paid">Pagos</MenuItem>
                  </TextField>
                </Box>
              )}
            </Box>
          </Container>
        </Box>

        {/* Courses Grid */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
            {filteredCourses.length} Cursos Encontrados
          </Typography>

          <Grid container spacing={4}>
            {filteredCourses.map((course) => (
              <Grid item xs={12} sm={6} md={4} key={course.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card 
                    sx={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 24px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={course.image_url ? `${API_BASE_URL}${course.image_url}` : '/images/courses/default.jpg'}
                      alt={course.title}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="h6" component="h2" sx={{ mb: 1, fontWeight: 700 }}>
                        {course.title}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                        {course.description}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <PersonIcon sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {course.instructor}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <AccessTimeIcon sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {course.duration_minutes} minutos
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Chip
                          label={getDifficultyLabel(course.difficulty_level)}
                          size="small"
                          sx={{ 
                            background: getDifficultyColor(course.difficulty_level),
                            color: '#fff'
                          }}
                        />
                      </Box>

                      <Box sx={{ mt: 'auto', pt: 2 }}>
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={() => navigate(`/courses/${course.id}`)}
                          sx={{
                            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                            color: '#fff',
                            fontWeight: 600,
                            py: 1.5
                          }}
                        >
                          {course.is_free ? 'Começar Agora' : `R$ ${Number(course.price || 0).toFixed(2)}`}
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>

        <FilterDrawer />
      </Box>
      <Footer />
    </>
  );
};

export default AllCourses;