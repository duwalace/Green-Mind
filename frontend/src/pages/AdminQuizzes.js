import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Alert,
  Divider,
  CircularProgress,
  InputAdornment,
  alpha,
  Stack,
  Badge,
  Tooltip,
  Card,
  CardContent,
  CardMedia
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Quiz as QuizIcon,
  QuestionAnswer as QuestionIcon,
  Close as CloseIcon,
  School as SchoolIcon,
  Assessment as StatsIcon,
  AccessTime as TimeIcon,
  EmojiEvents as TrophyIcon,
  PlayArrow as PlayIcon,
  Image as ImageIcon,
  CloudUpload as CloudUploadIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const QuizCard = ({ quiz, onEdit, onDelete, onManageQuestions, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getDifficultyColor = (level) => {
    const colors = {
      beginner: { bg: '#E8F5E9', color: '#2E7D32', border: '#A5D6A7', gradient: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)' },
      intermediate: { bg: '#FFF3E0', color: '#E65100', border: '#FFB74D', gradient: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)' },
      advanced: { bg: '#FFEBEE', color: '#C62828', border: '#EF9A9A', gradient: 'linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%)' }
    };
    return colors[level] || colors.beginner;
  };

  const getStatusColor = (status) => {
    const colors = {
      published: { bg: '#E8F5E9', color: '#2E7D32', icon: <CheckIcon />, text: 'Publicado' },
      draft: { bg: '#FFF3E0', color: '#E65100', icon: <TimeIcon />, text: 'Rascunho' },
      archived: { bg: '#F5F5F5', color: '#616161', icon: <TimeIcon />, text: 'Arquivado' }
    };
    return colors[status] || colors.draft;
  };

  const difficultyColors = getDifficultyColor(quiz.difficulty_level);
  const statusColors = getStatusColor(quiz.status);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
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
          borderColor: isHovered ? alpha(difficultyColors.color, 0.4) : 'rgba(0,0,0,0.08)',
          transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
          position: 'relative',
          '&:hover': {
            transform: 'translateY(-12px) scale(1.02)',
            boxShadow: `0 24px 48px ${alpha(difficultyColors.color, 0.2)}`
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: difficultyColors.gradient,
            transform: isHovered ? 'scaleY(1)' : 'scaleY(0)',
            transformOrigin: 'top',
            transition: 'transform 0.3s'
          }
        }}
      >
        {/* Image/Banner Section */}
        <Box sx={{ position: 'relative', height: 200, overflow: 'hidden' }}>
          {quiz.image_url ? (
            <CardMedia
              component="img"
              height="200"
              image={quiz.image_url}
              alt={quiz.title}
              sx={{
                transition: 'transform 0.6s',
                transform: isHovered ? 'scale(1.15)' : 'scale(1)'
              }}
            />
          ) : (
            <Box
              sx={{
                height: 200,
                background: `linear-gradient(135deg, ${difficultyColors.bg} 0%, ${alpha(difficultyColors.color, 0.2)} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <QuizIcon sx={{ fontSize: 80, color: difficultyColors.color, opacity: 0.2 }} />
              <Box
                sx={{
                  position: 'absolute',
                  width: 200,
                  height: 200,
                  borderRadius: '50%',
                  background: alpha(difficultyColors.color, 0.1),
                  top: -50,
                  right: -50
                }}
              />
            </Box>
          )}

          {/* Overlay Badges */}
          <Stack
            direction="row"
            spacing={1}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16
            }}
          >
            <Chip
              label={statusColors.text}
              icon={statusColors.icon}
              size="small"
              sx={{
                background: statusColors.bg,
                color: statusColors.color,
                fontWeight: 700,
                border: `1px solid ${statusColors.color}`,
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            />
          </Stack>

          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
              p: 2
            }}
          >
            <Chip
              icon={<TrophyIcon />}
              label={quiz.difficulty_level === 'beginner' ? 'Iniciante' : quiz.difficulty_level === 'intermediate' ? 'Intermediário' : 'Avançado'}
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
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              mb: 1.5,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              minHeight: 56
            }}
          >
            {quiz.title}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2.5,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              minHeight: 40
            }}
          >
            {quiz.description || 'Sem descrição'}
          </Typography>

          {/* Meta Info */}
          <Stack direction="row" spacing={2} sx={{ mb: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7 }}>
              <QuestionIcon sx={{ fontSize: 18, color: '#667eea' }} />
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#667eea' }}>
                {quiz.total_questions || 0}
              </Typography>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7 }}>
              <TimeIcon sx={{ fontSize: 18, color: '#06b6d4' }} />
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#06b6d4' }}>
                {Math.ceil((quiz.time_limit_seconds || 0) / 60)}min
              </Typography>
            </Box>
            {quiz.course_title && (
              <>
                <Divider orientation="vertical" flexItem />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7 }}>
                  <SchoolIcon sx={{ fontSize: 18, color: '#f093fb' }} />
                  <Typography variant="caption" sx={{ fontWeight: 600, color: '#f093fb' }} noWrap>
                    {quiz.course_title}
                  </Typography>
                </Box>
              </>
            )}
          </Stack>

          {/* Actions */}
          <Stack direction="row" spacing={1}>
            <Tooltip title="Gerenciar Perguntas">
              <Button
                fullWidth
                variant="outlined"
                startIcon={<QuestionIcon />}
                onClick={() => onManageQuestions(quiz)}
                sx={{
                  borderRadius: 2.5,
                  textTransform: 'none',
                  fontWeight: 700,
                  py: 1,
                  borderColor: '#667eea',
                  color: '#667eea',
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                    borderColor: '#667eea',
                    background: alpha('#667eea', 0.08)
                  }
                }}
              >
                Perguntas
              </Button>
            </Tooltip>
            <Tooltip title="Editar">
              <IconButton
                onClick={() => onEdit(quiz)}
                sx={{
                  borderRadius: 2.5,
                  border: '2px solid',
                  borderColor: 'rgba(255, 152, 0, 0.2)',
                  color: '#F57C00',
                  px: 1.5,
                  '&:hover': {
                    borderColor: '#F57C00',
                    background: alpha('#F57C00', 0.08)
                  }
                }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Excluir">
              <IconButton
                onClick={() => onDelete(quiz.id)}
                sx={{
                  borderRadius: 2.5,
                  border: '2px solid',
                  borderColor: 'rgba(211, 47, 47, 0.2)',
                  color: '#D32F2F',
                  px: 1.5,
                  '&:hover': {
                    borderColor: '#D32F2F',
                    background: alpha('#D32F2F', 0.08)
                  }
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </CardContent>
      </Card>
    </motion.div>
  );
};

function AdminQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [trails, setTrails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [openDialog, setOpenDialog] = useState(false);
  const [openQuestionsDialog, setOpenQuestionsDialog] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    course_id: '',
    trail_id: '',
    difficulty_level: 'beginner',
    time_limit_seconds: 600,
    points_per_question: 100,
    passing_score: 70,
    status: 'draft'
  });

  const [questionFormData, setQuestionFormData] = useState({
    question_text: '',
    question_type: 'multiple_choice',
    time_limit_seconds: 30,
    points: 100,
    sequence_order: 0,
    options: ['', '', '', ''],
    correct_answer: '0',
    explanation: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [quizzesRes, coursesRes, trailsRes] = await Promise.all([
        api.get('/admin/quizzes'),
        api.get('/courses'),
        api.get('/trails')
      ]);
      setQuizzes(quizzesRes.data.quizzes);
      setCourses(coursesRes.data.courses);
      setTrails(trailsRes.data.trails);
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
      setError('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (quiz = null) => {
    if (quiz) {
      setEditingQuiz(quiz);
      setFormData({
        title: quiz.title,
        description: quiz.description || '',
        course_id: quiz.course_id || '',
        trail_id: quiz.trail_id || '',
        difficulty_level: quiz.difficulty_level,
        time_limit_seconds: quiz.time_limit_seconds,
        points_per_question: quiz.points_per_question,
        passing_score: quiz.passing_score,
        status: quiz.status
      });
    } else {
      setEditingQuiz(null);
      setFormData({
        title: '',
        description: '',
        course_id: '',
        trail_id: '',
        difficulty_level: 'beginner',
        time_limit_seconds: 600,
        points_per_question: 100,
        passing_score: 70,
        status: 'draft'
      });
    }
    setError(null);
    setSuccess(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingQuiz(null);
  };

  const handleSaveQuiz = async () => {
    try {
      setLoading(true);
      if (editingQuiz) {
        await api.put(`/admin/quizzes/${editingQuiz.id}`, formData);
        setSuccess('Quiz atualizado com sucesso!');
      } else {
        await api.post('/admin/quizzes', formData);
        setSuccess('Quiz criado com sucesso!');
      }
      handleCloseDialog();
      await fetchData();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Erro ao salvar quiz:', err);
      setError(err.response?.data?.message || 'Erro ao salvar quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (window.confirm('Tem certeza que deseja deletar este quiz?')) {
      try {
        await api.delete(`/admin/quizzes/${quizId}`);
        setSuccess('Quiz deletado com sucesso!');
        await fetchData();
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        console.error('Erro ao deletar quiz:', err);
        setError('Erro ao deletar quiz');
        setTimeout(() => setError(null), 3000);
      }
    }
  };

  const handleOpenQuestions = async (quiz) => {
    setSelectedQuiz(quiz);
    try {
      const response = await api.get(`/admin/quizzes/${quiz.id}/questions`);
      setQuestions(response.data.questions);
      setOpenQuestionsDialog(true);
    } catch (err) {
      console.error('Erro ao buscar perguntas:', err);
      setError('Erro ao carregar perguntas');
    }
  };

  const handleSaveQuestion = async () => {
    try {
      const dataToSend = {
        ...questionFormData,
        options: questionFormData.question_type === 'true_false' 
          ? ['Verdadeiro', 'Falso'] 
          : questionFormData.options.filter(opt => opt.trim() !== '')
      };

      await api.post(`/admin/quizzes/${selectedQuiz.id}/questions`, dataToSend);
      setSuccess('Pergunta adicionada com sucesso!');
      
      const response = await api.get(`/admin/quizzes/${selectedQuiz.id}/questions`);
      setQuestions(response.data.questions);
      
      setQuestionFormData({
        question_text: '',
        question_type: 'multiple_choice',
        time_limit_seconds: 30,
        points: 100,
        sequence_order: questions.length,
        options: ['', '', '', ''],
        correct_answer: '0',
        explanation: ''
      });
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Erro ao salvar pergunta:', err);
      setError('Erro ao salvar pergunta');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (window.confirm('Tem certeza que deseja deletar esta pergunta?')) {
      try {
        await api.delete(`/admin/quiz-questions/${questionId}`);
        setSuccess('Pergunta deletada com sucesso!');
        
        const response = await api.get(`/admin/quizzes/${selectedQuiz.id}/questions`);
        setQuestions(response.data.questions);
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        console.error('Erro ao deletar pergunta:', err);
        setError('Erro ao deletar pergunta');
        setTimeout(() => setError(null), 3000);
      }
    }
  };

  return (
    <Box sx={{ 
      width: '100%',
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
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)'
                  }}
                >
                  <QuizIcon sx={{ color: 'white', fontSize: 28 }} />
                </Box>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  Gerenciar Quizzes
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                Crie quizzes interativos e desafie seus alunos
              </Typography>
            </Box>
            
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
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
              Novo Quiz
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
              <Badge badgeContent={quizzes.length} color="primary" max={999}>
                <QuizIcon sx={{ color: '#667eea', fontSize: 24 }} />
              </Badge>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                Total de Quizzes
              </Typography>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckIcon sx={{ color: '#2E7D32', fontSize: 24 }} />
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                {quizzes.filter(q => q.status === 'published').length} Publicados
              </Typography>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TimeIcon sx={{ color: '#F57C00', fontSize: 24 }} />
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                {quizzes.filter(q => q.status === 'draft').length} Rascunhos
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

      {/* Grid de Quizzes */}
      {loading && !openDialog ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={64} thickness={4} />
        </Box>
      ) : quizzes.length === 0 ? (
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
            <QuizIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom fontWeight={700}>
              Nenhum quiz cadastrado
            </Typography>
            <Typography color="text.secondary" paragraph>
              Comece criando o primeiro quiz da plataforma
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 700,
                px: 4,
                background: 'linear-gradient(135deg, #2E7D32 0%, #66BB6A 100%)'
              }}
            >
              Criar Primeiro Quiz
            </Button>
          </Paper>
        </motion.div>
      ) : (
        <Grid container spacing={3}>
          {quizzes.map((quiz, index) => (
            <Grid item xs={12} sm={6} lg={4} key={quiz.id}>
              <QuizCard
                quiz={quiz}
                onEdit={handleOpenDialog}
                onDelete={handleDeleteQuiz}
                onManageQuestions={handleOpenQuestions}
                index={index}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Dialog de Criar/Editar Quiz */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
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
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            py: 3
          }}
        >
          <Typography variant="h5" fontWeight={800}>
            {editingQuiz ? 'Editar Quiz' : 'Novo Quiz'}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
            {editingQuiz ? 'Atualize as informações do quiz' : 'Crie um novo desafio para seus alunos'}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Título do Quiz"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="Ex: Quiz de Sustentabilidade Básica"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descrição"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descreva o objetivo deste quiz..."
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Curso (Opcional)</InputLabel>
                <Select
                  value={formData.course_id}
                  onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
                  label="Curso (Opcional)"
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="">Nenhum</MenuItem>
                  {courses.map((course) => (
                    <MenuItem key={course.id} value={course.id}>
                      {course.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Trilha (Opcional)</InputLabel>
                <Select
                  value={formData.trail_id}
                  onChange={(e) => setFormData({ ...formData, trail_id: e.target.value })}
                  label="Trilha (Opcional)"
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="">Nenhuma</MenuItem>
                  {trails.map((trail) => (
                    <MenuItem key={trail.id} value={trail.id}>
                      {trail.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Dificuldade</InputLabel>
                <Select
                  value={formData.difficulty_level}
                  onChange={(e) => setFormData({ ...formData, difficulty_level: e.target.value })}
                  label="Dificuldade"
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="beginner">Iniciante</MenuItem>
                  <MenuItem value="intermediate">Intermediário</MenuItem>
                  <MenuItem value="advanced">Avançado</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Tempo Limite"
                value={formData.time_limit_seconds}
                onChange={(e) => setFormData({ ...formData, time_limit_seconds: parseInt(e.target.value) })}
                InputProps={{
                  endAdornment: <InputAdornment position="end">seg</InputAdornment>,
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Nota de Aprovação"
                value={formData.passing_score}
                onChange={(e) => setFormData({ ...formData, passing_score: parseFloat(e.target.value) })}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Pontos por Questão"
                value={formData.points_per_question}
                onChange={(e) => setFormData({ ...formData, points_per_question: parseInt(e.target.value) })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  label="Status"
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="draft">Rascunho</MenuItem>
                  <MenuItem value="published">Publicado</MenuItem>
                  <MenuItem value="archived">Arquivado</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 3, gap: 1 }}>
          <Button 
            onClick={handleCloseDialog}
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
            variant="contained"
            onClick={handleSaveQuiz}
            disabled={loading || !formData.title}
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
            {loading ? 'Salvando...' : (editingQuiz ? 'Atualizar' : 'Criar')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de Perguntas */}
      <Dialog 
        open={openQuestionsDialog} 
        onClose={() => setOpenQuestionsDialog(false)} 
        maxWidth="lg" 
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
            background: 'linear-gradient(135deg, #0277BD 0%, #29B6F6 100%)',
            color: '#fff',
            py: 3
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                Gerenciar Perguntas
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                {selectedQuiz?.title}
              </Typography>
            </Box>
            <IconButton onClick={() => setOpenQuestionsDialog(false)} sx={{ color: '#fff' }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 3 }}>
          {/* Formulário para adicionar pergunta */}
          <Paper sx={{ p: 3, mb: 3, background: '#F5F5F5', borderRadius: 3, border: '2px solid #E0E0E0' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
              <AddIcon /> Nova Pergunta
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Texto da Pergunta"
                  multiline
                  rows={2}
                  value={questionFormData.question_text}
                  onChange={(e) => setQuestionFormData({ ...questionFormData, question_text: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'white' } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Tipo</InputLabel>
                  <Select
                    value={questionFormData.question_type}
                    onChange={(e) => setQuestionFormData({ ...questionFormData, question_type: e.target.value })}
                    label="Tipo"
                    sx={{ borderRadius: 2, bgcolor: 'white' }}
                  >
                    <MenuItem value="multiple_choice">Múltipla Escolha</MenuItem>
                    <MenuItem value="true_false">Verdadeiro/Falso</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Tempo (segundos)"
                  value={questionFormData.time_limit_seconds}
                  onChange={(e) => setQuestionFormData({ ...questionFormData, time_limit_seconds: parseInt(e.target.value) })}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'white' } }}
                />
              </Grid>
              
              {questionFormData.question_type === 'multiple_choice' && (
                <>
                  {[0, 1, 2, 3].map((index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <TextField
                        fullWidth
                        label={`Opção ${index + 1}`}
                        value={questionFormData.options[index]}
                        onChange={(e) => {
                          const newOptions = [...questionFormData.options];
                          newOptions[index] = e.target.value;
                          setQuestionFormData({ ...questionFormData, options: newOptions });
                        }}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'white' } }}
                      />
                    </Grid>
                  ))}
                </>
              )}
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Resposta Correta</InputLabel>
                  <Select
                    value={questionFormData.correct_answer}
                    onChange={(e) => setQuestionFormData({ ...questionFormData, correct_answer: e.target.value })}
                    label="Resposta Correta"
                    sx={{ borderRadius: 2, bgcolor: 'white' }}
                  >
                    {questionFormData.question_type === 'true_false' ? (
                      <>
                        <MenuItem value="0">Verdadeiro</MenuItem>
                        <MenuItem value="1">Falso</MenuItem>
                      </>
                    ) : (
                      <>
                        <MenuItem value="0">Opção 1</MenuItem>
                        <MenuItem value="1">Opção 2</MenuItem>
                        <MenuItem value="2">Opção 3</MenuItem>
                        <MenuItem value="3">Opção 4</MenuItem>
                      </>
                    )}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Pontos"
                  value={questionFormData.points}
                  onChange={(e) => setQuestionFormData({ ...questionFormData, points: parseInt(e.target.value) })}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'white' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Explicação (opcional)"
                  multiline
                  rows={2}
                  value={questionFormData.explanation}
                  onChange={(e) => setQuestionFormData({ ...questionFormData, explanation: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'white' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleSaveQuestion}
                  startIcon={<AddIcon />}
                  sx={{
                    background: 'linear-gradient(135deg, #2E7D32 0%, #66BB6A 100%)',
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 700
                  }}
                >
                  Adicionar Pergunta
                </Button>
              </Grid>
            </Grid>
          </Paper>

          <Divider sx={{ my: 3 }} />

          {/* Lista de perguntas */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
            Perguntas ({questions.length})
          </Typography>
          {questions.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
              <QuestionIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                Nenhuma pergunta adicionada ainda
              </Typography>
            </Paper>
          ) : (
            questions.map((question, index) => (
              <Paper
                key={question.id}
                sx={{
                  p: 3,
                  mb: 2,
                  borderRadius: 3,
                  border: '2px solid #E0E0E0',
                  transition: 'all 0.3s',
                  '&:hover': {
                    border: '2px solid #667eea',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)'
                  }
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 700, mb: 1 }}>
                      {index + 1}. {question.question_text}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                      {question.options?.map((option, optIndex) => (
                        <Chip
                          key={optIndex}
                          label={option}
                          size="small"
                          sx={{
                            background: optIndex === parseInt(question.correct_answer)
                              ? 'linear-gradient(135deg, #2E7D32 0%, #66BB6A 100%)'
                              : '#E0E0E0',
                            color: optIndex === parseInt(question.correct_answer) ? '#fff' : '#212121',
                            fontWeight: optIndex === parseInt(question.correct_answer) ? 700 : 400,
                          }}
                        />
                      ))}
                    </Box>
                    <Typography variant="caption" sx={{ color: '#757575' }}>
                      {question.points} pontos • {question.time_limit_seconds}s
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteQuestion(question.id)}
                    sx={{
                      color: '#D32F2F',
                      border: '1px solid rgba(211, 47, 47, 0.2)',
                      borderRadius: 2,
                      '&:hover': {
                        borderColor: '#D32F2F',
                        background: alpha('#D32F2F', 0.08)
                      }
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Paper>
            ))
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default AdminQuizzes;
