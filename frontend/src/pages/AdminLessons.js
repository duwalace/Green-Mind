import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  IconButton,
  Typography,
  Chip,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Badge,
  Paper,
  Stack,
  alpha,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlayCircleOutline as VideoIcon,
  Article as TextIcon,
  Assignment as ExerciseIcon,
  VideoLibrary as LessonIcon,
  ArrowBack as ArrowBackIcon,
  School as SchoolIcon,
  CheckCircle as CheckIcon,
  AccessTime as TimeIcon,
  Category as CategoryIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const CourseCard = ({ course, onSelect, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card
        elevation={0}
        onClick={() => onSelect(course)}
        sx={{
          cursor: 'pointer',
          borderRadius: 3,
          border: '2px solid',
          borderColor: isHovered ? '#667eea' : 'rgba(0,0,0,0.08)',
          transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 16px 32px rgba(102, 126, 234, 0.2)'
          }
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <SchoolIcon sx={{ color: 'white', fontSize: 24 }} />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom noWrap>
                {course.title}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}
              >
                {course.description}
              </Typography>
            </Box>
          </Box>
          
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Chip
              size="small"
              label={course.trail_title || 'Sem trilha'}
              variant="outlined"
              sx={{ borderRadius: 1.5 }}
            />
            <Chip
              size="small"
              label={course.difficulty_level || 'beginner'}
              color="primary"
              variant="outlined"
              sx={{ borderRadius: 1.5 }}
            />
          </Stack>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const AdminLessons = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [openLessonDialog, setOpenLessonDialog] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [lessonForm, setLessonForm] = useState({
    title: '',
    description: '',
    sequence_order: 1,
    status: 'draft'
  });

  const [lessonContents, setLessonContents] = useState([]);
  const [openContentDialog, setOpenContentDialog] = useState(false);
  const [currentContentType, setCurrentContentType] = useState('');
  const [contentForm, setContentForm] = useState({
    title: '',
    content_order: 0,
    video_url: '',
    video_duration: '',
    text_content: '',
    exercise_type: 'text_answer',
    exercise_question: '',
    exercise_options: [],
    exercise_correct_answer: ''
  });

  const API_BASE_URL = 'http://localhost:3001/api';

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchLessonsForCourse(selectedCourse.id);
    }
  }, [selectedCourse]);

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/courses`);
      setCourses(res.data.courses || []);
    } catch (err) {
      console.error('Erro ao carregar cursos:', err);
      setError('Erro ao carregar cursos');
    }
  };

  const fetchLessonsForCourse = async (courseId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      // Usar rota ADMIN que retorna TODAS as aulas (draft, published, archived)
      const res = await axios.get(
        `${API_BASE_URL}/admin/courses/${courseId}/lessons`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      setLessons(res.data.lessons || []);
      console.log(`Aulas carregadas para o curso ${courseId}:`, res.data.lessons.length);
    } catch (err) {
      console.error('Erro ao carregar aulas:', err);
      setError('Erro ao carregar aulas');
    } finally {
      setLoading(false);
    }
  };

  const fetchLessonContents = async (lessonId) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/lessons/${lessonId}/contents`);
      setLessonContents(res.data.contents || []);
    } catch (err) {
      console.error('Erro ao carregar conteúdos:', err);
    }
  };

  const handleSelectCourse = (course) => {
    setSelectedCourse(course);
    setLessons([]);
  };

  const handleOpenLessonDialog = async (lesson = null) => {
    if (lesson) {
      setEditingLesson(lesson);
      setLessonForm({
        title: lesson.title,
        description: lesson.description,
        sequence_order: lesson.sequence_order,
        status: lesson.status || 'draft'
      });
      await fetchLessonContents(lesson.id);
    } else {
      setEditingLesson(null);
      setLessonForm({
        title: '',
        description: '',
        sequence_order: lessons.length + 1,
        status: 'draft'
      });
      setLessonContents([]);
    }
    setOpenLessonDialog(true);
  };

  const handleCloseLessonDialog = () => {
    setOpenLessonDialog(false);
    setEditingLesson(null);
    setLessonContents([]);
  };

  const handleSaveLesson = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (editingLesson) {
        await axios.put(
          `${API_BASE_URL}/admin/lessons/${editingLesson.id}`,
          {
            ...lessonForm,
            course_id: selectedCourse.id,
            content: lessonForm.description,
            duration_minutes: 30
          },
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );
        setSuccess('Aula atualizada com sucesso!');
      } else {
        await axios.post(
          `${API_BASE_URL}/admin/lessons`,
          {
            ...lessonForm,
            course_id: selectedCourse.id,
            content: lessonForm.description,
            duration_minutes: 30
          },
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );
        setSuccess('Aula criada com sucesso!');
      }
      
      await fetchLessonsForCourse(selectedCourse.id);
      handleCloseLessonDialog();
    } catch (err) {
      console.error('Erro ao salvar aula:', err);
      setError(err.response?.data?.message || 'Erro ao salvar aula');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm('Tem certeza que deseja excluir esta aula?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/admin/lessons/${lessonId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setSuccess('Aula excluída com sucesso!');
      await fetchLessonsForCourse(selectedCourse.id);
    } catch (err) {
      setError('Erro ao excluir aula');
    }
  };

  const handleOpenContentDialog = (contentType) => {
    setCurrentContentType(contentType);
    setContentForm({
      title: '',
      content_order: lessonContents.length,
      video_url: '',
      video_duration: '',
      text_content: '',
      exercise_type: 'text_answer',
      exercise_question: '',
      exercise_options: [],
      exercise_correct_answer: ''
    });
    setOpenContentDialog(true);
  };

  const handleSaveContent = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const contentData = {
        content_type: currentContentType,
        title: contentForm.title,
        content_order: contentForm.content_order,
        ...(currentContentType === 'video' && {
          video_url: contentForm.video_url,
          video_duration: contentForm.video_duration || null
        }),
        ...(currentContentType === 'text' && {
          text_content: contentForm.text_content
        }),
        ...(currentContentType === 'exercise' && {
          exercise_type: contentForm.exercise_type,
          exercise_question: contentForm.exercise_question,
          exercise_options: contentForm.exercise_options,
          exercise_correct_answer: contentForm.exercise_correct_answer
        })
      };

      await axios.post(
        `${API_BASE_URL}/admin/lessons/${editingLesson.id}/contents`,
        contentData,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      setSuccess('Conteúdo adicionado com sucesso!');
      await fetchLessonContents(editingLesson.id);
      setOpenContentDialog(false);
    } catch (err) {
      console.error('Erro ao salvar conteúdo:', err);
      setError('Erro ao salvar conteúdo');
    }
  };

  const handleDeleteContent = async (contentId) => {
    if (!window.confirm('Tem certeza que deseja remover este conteúdo?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/admin/lesson-contents/${contentId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setSuccess('Conteúdo removido!');
      await fetchLessonContents(editingLesson.id);
    } catch (err) {
      setError('Erro ao remover conteúdo');
    }
  };

  const getContentIcon = (type) => {
    const icons = {
      video: <VideoIcon sx={{ color: '#667eea' }} />,
      text: <TextIcon sx={{ color: '#06b6d4' }} />,
      exercise: <ExerciseIcon sx={{ color: '#2E7D32' }} />
    };
    return icons[type] || <LessonIcon />;
  };

  const getContentTypeLabel = (type) => {
    const labels = {
      video: 'Vídeo',
      text: 'Texto',
      exercise: 'Exercício'
    };
    return labels[type] || type;
  };

  if (!selectedCourse) {
    return (
      <Box sx={{ 
        p: { xs: 2, md: 4 },
        background: 'linear-gradient(135deg, #F5F7FA 0%, #E8EEF2 100%)',
        minHeight: '100vh'
      }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ mb: 5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 24px rgba(250, 112, 154, 0.4)'
                }}
              >
                <LessonIcon sx={{ color: 'white', fontSize: 28 }} />
              </Box>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Gerenciar Aulas
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
              Selecione um curso para gerenciar suas aulas
            </Typography>
          </Box>
        </motion.div>

        <Grid container spacing={3}>
          {courses.map((course, index) => (
            <Grid item xs={12} sm={6} md={4} key={course.id}>
              <CourseCard course={course} onSelect={handleSelectCourse} index={index} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      p: { xs: 2, md: 4 },
      background: 'linear-gradient(135deg, #F5F7FA 0%, #E8EEF2 100%)',
      minHeight: '100vh'
    }}>
      {/* Header com curso selecionado */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => setSelectedCourse(null)}
            sx={{ 
              mb: 3,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Voltar aos Cursos
          </Button>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h4" fontWeight={800} gutterBottom>
                {selectedCourse.title}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Badge badgeContent={lessons.length} color="primary">
                  <LessonIcon sx={{ color: '#667eea' }} />
                </Badge>
                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  {lessons.length} {lessons.length === 1 ? 'aula' : 'aulas'} cadastrada{lessons.length !== 1 ? 's' : ''}
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenLessonDialog()}
              size="large"
              sx={{
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 700,
                px: 4,
                background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                boxShadow: '0 8px 24px rgba(250, 112, 154, 0.4)',
                '&:hover': {
                  boxShadow: '0 12px 32px rgba(250, 112, 154, 0.5)'
                }
              }}
            >
              Nova Aula
            </Button>
          </Box>
        </Box>
      </motion.div>

      {/* Alertas */}
      <AnimatePresence>
        {success && (
          <motion.div 
            key="success-alert"
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }}
          >
            <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setSuccess(null)}>{success}</Alert>
          </motion.div>
        )}
        {error && (
          <motion.div 
            key="error-alert"
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }}
          >
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError(null)}>{error}</Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lista de Aulas */}
      {loading && !openLessonDialog ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={64} />
        </Box>
      ) : lessons.length === 0 ? (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <Paper elevation={0} sx={{ p: 8, textAlign: 'center', borderRadius: 4, border: '2px dashed rgba(0,0,0,0.1)' }}>
            <LessonIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom fontWeight={700}>Nenhuma aula cadastrada</Typography>
            <Typography color="text.secondary" paragraph>Comece criando a primeira aula deste curso</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenLessonDialog()}
              sx={{
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 700,
                px: 4,
                background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
              }}
            >
              Criar Primeira Aula
            </Button>
          </Paper>
        </motion.div>
      ) : (
        <Grid container spacing={3}>
          {lessons.map((lesson, index) => (
            <Grid item xs={12} key={lesson.id}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    border: '2px solid rgba(0,0,0,0.08)',
                    transition: 'all 0.3s',
                    '&:hover': {
                      border: '2px solid #667eea',
                      boxShadow: '0 8px 24px rgba(102, 126, 234, 0.15)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                          <Chip
                            label={`#${lesson.sequence_order}`}
                            size="small"
                            sx={{
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              color: 'white',
                              fontWeight: 700
                            }}
                          />
                          <Typography variant="h6" fontWeight={700}>
                            {lesson.title}
                          </Typography>
                          <Chip
                            label={lesson.status === 'published' ? 'Publicado' : 'Rascunho'}
                            size="small"
                            color={lesson.status === 'published' ? 'success' : 'default'}
                            sx={{ ml: 'auto' }}
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {lesson.description?.substring(0, 150)}...
                        </Typography>
                      </Box>
                      <Stack direction="row" spacing={1}>
                        <Tooltip title="Editar">
                          <IconButton
                            color="primary"
                            onClick={() => handleOpenLessonDialog(lesson)}
                            sx={{
                              borderRadius: 2,
                              border: '1px solid',
                              borderColor: 'rgba(102, 126, 234, 0.2)',
                              '&:hover': {
                                borderColor: '#667eea',
                                background: alpha('#667eea', 0.08)
                              }
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Excluir">
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteLesson(lesson.id)}
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
                        </Tooltip>
                      </Stack>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Dialog de Criação/Edição de Aula */}
      <Dialog
        open={openLessonDialog}
        onClose={handleCloseLessonDialog}
        maxWidth="md"
        fullWidth
        scroll="paper"
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: '0 24px 48px rgba(0,0,0,0.2)'
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            color: 'white',
            py: 3,
            fontWeight: 800,
            fontSize: '1.5rem'
          }}
        >
          {editingLesson ? 'Editar Aula' : 'Nova Aula'}
        </DialogTitle>
        <DialogContent sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Título da Aula"
                value={lessonForm.title}
                onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                fullWidth
                required
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Descrição"
                value={lessonForm.description}
                onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
                fullWidth
                multiline
                rows={3}
                required
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Ordem"
                type="number"
                value={lessonForm.sequence_order}
                onChange={(e) => setLessonForm({ ...lessonForm, sequence_order: parseInt(e.target.value) })}
                fullWidth
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={lessonForm.status}
                  label="Status"
                  onChange={(e) => setLessonForm({ ...lessonForm, status: e.target.value })}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="draft">Rascunho</MenuItem>
                  <MenuItem value="published">Publicado</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {editingLesson && (
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" fontWeight={700}>
                    Conteúdos da Aula ({lessonContents.length})
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      startIcon={<VideoIcon />}
                      onClick={() => handleOpenContentDialog('video')}
                      variant="outlined"
                      sx={{ borderRadius: 2 }}
                    >
                      Vídeo
                    </Button>
                    <Button
                      size="small"
                      startIcon={<TextIcon />}
                      onClick={() => handleOpenContentDialog('text')}
                      variant="outlined"
                      sx={{ borderRadius: 2 }}
                    >
                      Texto
                    </Button>
                    <Button
                      size="small"
                      startIcon={<ExerciseIcon />}
                      onClick={() => handleOpenContentDialog('exercise')}
                      variant="outlined"
                      sx={{ borderRadius: 2 }}
                    >
                      Exercício
                    </Button>
                  </Stack>
                </Box>

                <List>
                  {lessonContents.map((content, index) => (
                    <ListItem
                      key={content.id}
                      sx={{
                        border: '1px solid',
                        borderColor: 'grey.300',
                        borderRadius: 2,
                        mb: 1
                      }}
                    >
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {getContentIcon(content.content_type)}
                            <Typography fontWeight={600}>{content.title}</Typography>
                            <Chip
                              label={getContentTypeLabel(content.content_type)}
                              size="small"
                              variant="outlined"
                            />
                          </Box>
                        }
                        secondary={`Ordem: ${content.content_order}`}
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          color="error"
                          onClick={() => handleDeleteContent(content.id)}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                  {lessonContents.length === 0 && (
                    <Typography color="text.secondary" align="center" sx={{ py: 3 }}>
                      Nenhum conteúdo adicionado. Clique nos botões acima para adicionar.
                    </Typography>
                  )}
                </List>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 3 }}>
          <Button onClick={handleCloseLessonDialog} sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}>Cancelar</Button>
          <Button
            onClick={handleSaveLesson}
            variant="contained"
            disabled={loading || !lessonForm.title || !lessonForm.description}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 700,
              px: 4,
              background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
            }}
          >
            {loading ? 'Salvando...' : 'Salvar Aula'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de Adicionar Conteúdo */}
      <Dialog
        open={openContentDialog}
        onClose={() => setOpenContentDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 4 }
        }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          Adicionar {getContentTypeLabel(currentContentType)}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Título do Conteúdo"
                value={contentForm.title}
                onChange={(e) => setContentForm({ ...contentForm, title: e.target.value })}
                fullWidth
                required
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            {currentContentType === 'video' && (
              <>
                <Grid item xs={12}>
                  <TextField
                    label="URL do Vídeo"
                    value={contentForm.video_url}
                    onChange={(e) => setContentForm({ ...contentForm, video_url: e.target.value })}
                    fullWidth
                    placeholder="https://www.youtube.com/watch?v=..."
                    helperText="Cole o link do YouTube, Vimeo ou outro serviço"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Duração (minutos)"
                    type="number"
                    value={contentForm.video_duration}
                    onChange={(e) => setContentForm({ ...contentForm, video_duration: e.target.value })}
                    fullWidth
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
              </>
            )}

            {currentContentType === 'text' && (
              <Grid item xs={12}>
                <TextField
                  label="Conteúdo de Texto"
                  value={contentForm.text_content}
                  onChange={(e) => setContentForm({ ...contentForm, text_content: e.target.value })}
                  fullWidth
                  multiline
                  rows={8}
                  placeholder="Digite o conteúdo textual da aula..."
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
            )}

            {currentContentType === 'exercise' && (
              <>
                <Grid item xs={12}>
                  <TextField
                    label="Pergunta do Exercício"
                    value={contentForm.exercise_question}
                    onChange={(e) => setContentForm({ ...contentForm, exercise_question: e.target.value })}
                    fullWidth
                    multiline
                    rows={3}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Tipo de Exercício</InputLabel>
                    <Select
                      value={contentForm.exercise_type}
                      label="Tipo de Exercício"
                      onChange={(e) => setContentForm({ ...contentForm, exercise_type: e.target.value })}
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value="text_answer">Resposta em Texto</MenuItem>
                      <MenuItem value="multiple_choice">Múltipla Escolha</MenuItem>
                      <MenuItem value="file_upload">Upload de Arquivo</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Resposta Correta (para referência)"
                    value={contentForm.exercise_correct_answer}
                    onChange={(e) => setContentForm({ ...contentForm, exercise_correct_answer: e.target.value })}
                    fullWidth
                    multiline
                    rows={2}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenContentDialog(false)} sx={{ borderRadius: 2, textTransform: 'none' }}>Cancelar</Button>
          <Button
            onClick={handleSaveContent}
            variant="contained"
            disabled={!contentForm.title}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 700
            }}
          >
            Adicionar Conteúdo
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminLessons;
