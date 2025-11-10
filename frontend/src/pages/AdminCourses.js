import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Card,
  CardMedia,
  Chip,
  Grid,
  Alert,
  CircularProgress,
  FormControlLabel,
  Switch,
  InputAdornment,
  alpha,
  Stack,
  Tooltip,
  Avatar,
  Badge,
  Divider
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  CloudUpload as CloudUploadIcon,
  Image as ImageIcon,
  School as SchoolIcon,
  AccessTime as AccessTimeIcon,
  PlayArrow as PlayIcon,
  TrendingUp as TrendingIcon,
  Star as StarIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const CourseCard = ({ course, onEdit, onDelete, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const API_BASE_URL = 'http://localhost:3001/api';

  const getDifficultyColor = (level) => {
    const colors = {
      beginner: { bg: '#E8F5E9', color: '#2E7D32', border: '#A5D6A7' },
      intermediate: { bg: '#FFF3E0', color: '#E65100', border: '#FFB74D' },
      advanced: { bg: '#FFEBEE', color: '#C62828', border: '#EF9A9A' }
    };
    return colors[level] || colors.beginner;
  };

  const difficultyColors = getDifficultyColor(course.difficulty_level);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card
        elevation={0}
        sx={{
          height: '100%',
          borderRadius: 4,
          overflow: 'hidden',
          border: '2px solid',
          borderColor: isHovered ? alpha(difficultyColors.color, 0.3) : 'rgba(0,0,0,0.08)',
          transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: `0 20px 40px ${alpha(difficultyColors.color, 0.15)}`
          }
        }}
      >
        {/* Image Section */}
        <Box sx={{ position: 'relative', overflow: 'hidden', height: 200 }}>
          {course.image_url ? (
            <CardMedia
              component="img"
              height="200"
              image={`${API_BASE_URL.replace('/api', '')}${course.image_url}`}
              alt={course.title}
              sx={{
                transition: 'transform 0.4s',
                transform: isHovered ? 'scale(1.1)' : 'scale(1)'
              }}
            />
          ) : (
            <Box
              sx={{
                height: 200,
                background: `linear-gradient(135deg, ${difficultyColors.bg} 0%, ${alpha(difficultyColors.color, 0.1)} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ImageIcon sx={{ fontSize: 64, color: difficultyColors.color, opacity: 0.3 }} />
            </Box>
          )}
          
          {/* Overlay Badges */}
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              display: 'flex',
              gap: 1
            }}
          >
            <Chip
              label={course.is_free ? 'GRÁTIS' : `R$ ${Number(course.price || 0).toFixed(2)}`}
              size="small"
              sx={{
                background: course.is_free 
                  ? 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)'
                  : 'linear-gradient(135deg, #F57C00 0%, #FFA726 100%)',
                color: course.is_free ? '#2E7D32' : 'white',
                fontWeight: 700,
                border: `1px solid ${course.is_free ? '#A5D6A7' : 'rgba(255,255,255,0.3)'}`,
                backdropFilter: 'blur(10px)'
              }}
            />
          </Box>

          <Box
            sx={{
              position: 'absolute',
              top: 12,
              left: 12
            }}
          >
            <Chip
              label={course.difficulty_level === 'beginner' ? 'Iniciante' : course.difficulty_level === 'intermediate' ? 'Intermediário' : 'Avançado'}
              size="small"
              sx={{
                background: difficultyColors.bg,
                color: difficultyColors.color,
                fontWeight: 700,
                border: `1px solid ${difficultyColors.border}`,
                backdropFilter: 'blur(10px)'
              }}
            />
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              mb: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              minHeight: 56
            }}
          >
            {course.title}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              minHeight: 40
            }}
          >
            {course.description}
          </Typography>

          {/* Meta Info */}
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                {course.duration_minutes || 0} min
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <SchoolIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                {course.trail_title || 'Sem trilha'}
              </Typography>
            </Box>
          </Stack>

          {course.instructor && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Avatar
                sx={{
                  width: 24,
                  height: 24,
                  bgcolor: difficultyColors.color,
                  fontSize: '0.75rem'
                }}
              >
                {course.instructor.charAt(0)}
              </Avatar>
              <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                {course.instructor}
              </Typography>
            </Box>
          )}

          {/* Actions */}
          <Stack direction="row" spacing={1}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => onEdit(course)}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                borderColor: difficultyColors.border,
                color: difficultyColors.color,
                '&:hover': {
                  borderColor: difficultyColors.color,
                  background: alpha(difficultyColors.color, 0.08)
                }
              }}
            >
              Editar
            </Button>
            <IconButton
              color="error"
              onClick={() => onDelete(course.id)}
              sx={{
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'rgba(211, 47, 47, 0.2)',
                '&:hover': {
                  borderColor: 'error.main',
                  background: alpha('#d32f2f', 0.08)
                }
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Stack>
        </Box>
      </Card>
    </motion.div>
  );
};

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [trails, setTrails] = useState([]);
  const [open, setOpen] = useState(false);
  const [editCourse, setEditCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  
  const [form, setForm] = useState({
    title: '',
    description: '',
    trail_id: '',
    instructor: '',
    duration_minutes: 60,
    difficulty_level: 'beginner',
    learning_objectives: '',
    is_free: true,
    price: 0
  });

  const API_BASE_URL = 'http://localhost:3001/api';

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/courses`);
      setCourses(res.data.courses || []);
    } catch (err) {
      setError('Erro ao carregar cursos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrails = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/trails`);
      setTrails(res.data.trails || []);
    } catch (err) {
      console.error('Erro ao carregar trilhas:', err);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchTrails();
  }, []);

  const handleOpen = (course = null) => {
    if (course) {
      setEditCourse(course);
      setForm({
        title: course.title || '',
        description: course.description || '',
        trail_id: course.trail_id || '',
        instructor: course.instructor || '',
        duration_minutes: course.duration_minutes || 60,
        difficulty_level: course.difficulty_level || 'beginner',
        learning_objectives: course.learning_objectives || '',
        is_free: course.is_free !== undefined ? Boolean(course.is_free) : true,
        price: course.price || 0
      });
      setImagePreview(course.image_url ? `${API_BASE_URL.replace('/api', '')}${course.image_url}` : null);
    } else {
      setEditCourse(null);
      setForm({
        title: '',
        description: '',
        trail_id: '',
        instructor: 'Green Mind Team',
        duration_minutes: 60,
        difficulty_level: 'beginner',
        learning_objectives: '',
        is_free: true,
        price: 0
      });
      setImagePreview(null);
    }
    setImageFile(null);
    setError(null);
    setSuccess(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditCourse(null);
    setImagePreview(null);
    setImageFile(null);
    setError(null);
    setSuccess(null);
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: name === 'is_free' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('A imagem deve ter no máximo 5MB');
        return;
      }
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!form.title || !form.description || !form.trail_id) {
        setError('Título, descrição e trilha são obrigatórios');
        return;
      }

      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      Object.keys(form).forEach(key => {
        formData.append(key, form[key]);
      });

      if (imageFile) {
        formData.append('image', imageFile);
      }

      if (editCourse) {
        await axios.put(
          `${API_BASE_URL}/admin/courses/${editCourse.id}`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        setSuccess('Curso atualizado com sucesso!');
      } else {
        await axios.post(
          `${API_BASE_URL}/admin/courses`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        setSuccess('Curso criado com sucesso!');
      }

      await fetchCourses();
      setTimeout(() => handleClose(), 1500);
    } catch (error) {
      console.error('Erro ao salvar curso:', error);
      setError(error.response?.data?.message || 'Erro ao salvar curso');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este curso? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/admin/courses/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setSuccess('Curso excluído com sucesso!');
      await fetchCourses();
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Erro ao deletar curso:', error);
      setError(error.response?.data?.message || 'Erro ao deletar curso');
      setTimeout(() => setError(null), 3000);
    }
  };

  return (
    <Box sx={{ 
      p: { xs: 2, md: 4 },
      background: 'linear-gradient(135deg, #F5F7FA 0%, #E8EEF2 100%)',
      minHeight: '100vh'
    }}>
      {/* Header Premium */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ mb: 5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #00897B 0%, #4DB6AC 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 24px rgba(0, 137, 123, 0.4)'
                  }}
                >
                  <SchoolIcon sx={{ color: 'white', fontSize: 28 }} />
                </Box>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #00897B 0%, #4DB6AC 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  Gerenciar Cursos
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                Crie e gerencie o conteúdo educacional da plataforma
              </Typography>
            </Box>
            
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpen()}
              size="large"
              sx={{
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 700,
                px: 4,
                py: 1.5,
                background: 'linear-gradient(135deg, #2E7D32 0%, #66BB6A 100%)',
                boxShadow: '0 8px 24px rgba(46, 125, 50, 0.4)',
                '&:hover': {
                  boxShadow: '0 12px 32px rgba(46, 125, 50, 0.5)',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s'
              }}
            >
              Novo Curso
            </Button>
          </Box>

          {/* Stats Bar */}
          <Paper
            elevation={0}
            sx={{
              mt: 3,
              p: 2.5,
              borderRadius: 3,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.3)',
              display: 'flex',
              gap: 3,
              flexWrap: 'wrap',
              alignItems: 'center'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Badge badgeContent={courses.length} color="primary" max={999}>
                <SchoolIcon sx={{ color: '#00897B', fontSize: 24 }} />
              </Badge>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                Total de Cursos
              </Typography>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendingIcon sx={{ color: '#2E7D32', fontSize: 24 }} />
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                {courses.filter(c => c.is_free).length} Gratuitos
              </Typography>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <StarIcon sx={{ color: '#F57C00', fontSize: 24 }} />
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                {courses.filter(c => !c.is_free).length} Premium
              </Typography>
            </Box>
          </Paper>
        </Box>
      </motion.div>

      {/* Alertas */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setSuccess(null)}>
              {success}
            </Alert>
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid de Cursos */}
      {loading && !open ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={64} thickness={4} />
        </Box>
      ) : courses.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Paper 
            elevation={0}
            sx={{ 
              p: 8, 
              textAlign: 'center',
              borderRadius: 4,
              border: '2px dashed rgba(0,0,0,0.1)'
            }}
          >
            <SchoolIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom fontWeight={700}>
              Nenhum curso cadastrado
            </Typography>
            <Typography color="text.secondary" paragraph>
              Comece criando o primeiro curso da plataforma
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpen()}
              sx={{
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 700,
                px: 4,
                background: 'linear-gradient(135deg, #2E7D32 0%, #66BB6A 100%)'
              }}
            >
              Criar Primeiro Curso
            </Button>
          </Paper>
        </motion.div>
      ) : (
        <Grid container spacing={3}>
          {courses.map((course, index) => (
            <Grid item xs={12} sm={6} lg={4} key={course.id}>
              <CourseCard
                course={course}
                onEdit={handleOpen}
                onDelete={handleDelete}
                index={index}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Dialog de Criação/Edição */}
      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: '0 24px 48px rgba(0,0,0,0.2)'
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            background: 'linear-gradient(135deg, #2E7D32 0%, #66BB6A 100%)',
            color: 'white',
            py: 3
          }}
        >
          <Typography variant="h5" fontWeight={800}>
            {editCourse ? 'Editar Curso' : 'Novo Curso'}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
            {editCourse ? 'Atualize as informações do curso' : 'Preencha os detalhes do novo curso'}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ mt: 3 }}>
          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>{success}</Alert>}

          <Grid container spacing={3}>
            {/* Upload de Imagem */}
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="subtitle2" gutterBottom fontWeight={700}>
                  Imagem do Curso
                </Typography>
                {imagePreview ? (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    <Card sx={{ maxWidth: 400, mx: 'auto', mb: 2, borderRadius: 3, overflow: 'hidden' }}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={imagePreview}
                        alt="Preview"
                      />
                    </Card>
                  </motion.div>
                ) : (
                  <Box
                    sx={{
                      maxWidth: 400,
                      height: 200,
                      mx: 'auto',
                      mb: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'grey.50',
                      border: '3px dashed',
                      borderColor: 'grey.300',
                      borderRadius: 3,
                      transition: 'all 0.3s',
                      '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: alpha('#2E7D32', 0.05)
                      }
                    }}
                  >
                    <Box sx={{ textAlign: 'center' }}>
                      <ImageIcon sx={{ fontSize: 60, color: 'grey.400', mb: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        Nenhuma imagem selecionada
                      </Typography>
                    </Box>
                  </Box>
                )}
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600
                  }}
                >
                  Escolher Imagem
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Button>
                <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
                  Formatos: JPG, PNG, GIF, WEBP (máx. 5MB)
                </Typography>
              </Box>
            </Grid>

            {/* Campos do Formulário */}
            <Grid item xs={12}>
              <TextField
                label="Título do Curso"
                name="title"
                value={form.title}
                onChange={handleChange}
                fullWidth
                required
                placeholder="Ex: Introdução à Sustentabilidade"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Descrição"
                name="description"
                value={form.description}
                onChange={handleChange}
                fullWidth
                required
                multiline
                rows={3}
                placeholder="Descreva o que os alunos aprenderão neste curso..."
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Trilha</InputLabel>
                <Select
                  name="trail_id"
                  value={form.trail_id}
                  label="Trilha"
                  onChange={handleChange}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="">
                    <em>Selecione uma trilha</em>
                  </MenuItem>
                  {trails.map(trail => (
                    <MenuItem key={trail.id} value={trail.id}>
                      {trail.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Autor/Instrutor"
                name="instructor"
                value={form.instructor}
                onChange={handleChange}
                fullWidth
                placeholder="Nome do instrutor"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Duração Total"
                name="duration_minutes"
                type="number"
                value={form.duration_minutes}
                onChange={handleChange}
                fullWidth
                InputProps={{
                  endAdornment: <InputAdornment position="end">minutos</InputAdornment>,
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Nível de Dificuldade</InputLabel>
                <Select
                  name="difficulty_level"
                  value={form.difficulty_level}
                  label="Nível de Dificuldade"
                  onChange={handleChange}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="beginner">Iniciante</MenuItem>
                  <MenuItem value="intermediate">Intermediário</MenuItem>
                  <MenuItem value="advanced">Avançado</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Objetivos de Aprendizado"
                name="learning_objectives"
                value={form.learning_objectives}
                onChange={handleChange}
                fullWidth
                multiline
                rows={4}
                placeholder="Digite cada objetivo em uma linha separada..."
                helperText="Separe cada objetivo com uma quebra de linha (Enter)"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={form.is_free}
                    onChange={handleChange}
                    name="is_free"
                    color="success"
                  />
                }
                label={<Typography fontWeight={600}>Curso Gratuito</Typography>}
              />
            </Grid>

            {!form.is_free && (
              <Grid item xs={12} md={6}>
                <TextField
                  label="Preço"
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  fullWidth
                  InputProps={{
                    startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 3, gap: 1 }}>
          <Button 
            onClick={handleClose} 
            disabled={loading}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={loading || !form.trail_id || !form.title || !form.description}
            startIcon={loading ? <CircularProgress size={20} /> : null}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 700,
              px: 4,
              background: 'linear-gradient(135deg, #2E7D32 0%, #66BB6A 100%)',
              '&:hover': {
                boxShadow: '0 8px 20px rgba(46, 125, 50, 0.4)'
              }
            }}
          >
            {loading ? 'Salvando...' : 'Salvar Curso'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminCourses;
