import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
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
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  alpha,
  useTheme
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Quiz as QuizIcon,
  QuestionAnswer as QuestionIcon,
  Visibility as ViewIcon,
  PlayArrow as PlayIcon,
  CloudUpload as UploadIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

function MyQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty_level: 'beginner',
    time_limit_seconds: 300,
    points_per_question: 100,
    passing_score: 70,
    status: 'draft',
    image_url: ''
  });
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    fetchMyQuizzes();
  }, []);

  const fetchMyQuizzes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/my-quizzes');
      setQuizzes(response.data.quizzes);
    } catch (err) {
      console.error('Erro ao buscar meus quizzes:', err);
      setError('Erro ao carregar seus quizzes.');
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
        difficulty_level: quiz.difficulty_level || 'beginner',
        time_limit_seconds: quiz.time_limit_seconds || 300,
        points_per_question: quiz.points_per_question || 100,
        passing_score: quiz.passing_score || 70,
        status: quiz.status || 'draft',
        image_url: quiz.image_url || ''
      });
    } else {
      setEditingQuiz(null);
      setFormData({
        title: '',
        description: '',
        difficulty_level: 'beginner',
        time_limit_seconds: 300,
        points_per_question: 100,
        passing_score: 70,
        status: 'draft',
        image_url: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingQuiz(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingQuiz) {
        await api.put(`/my-quizzes/${editingQuiz.id}`, formData);
        setSuccess('Quiz atualizado com sucesso!');
      } else {
        await api.post('/my-quizzes', formData);
        setSuccess('Quiz criado com sucesso!');
      }
      handleCloseDialog();
      fetchMyQuizzes();
    } catch (err) {
      console.error('Erro ao salvar quiz:', err);
      setError(err.response?.data?.message || 'Erro ao salvar quiz.');
    }
  };

  const handleDelete = async (quizId) => {
    if (!window.confirm('Tem certeza que deseja deletar este quiz?')) return;

    try {
      await api.delete(`/my-quizzes/${quizId}`);
      setSuccess('Quiz deletado com sucesso!');
      fetchMyQuizzes();
    } catch (err) {
      console.error('Erro ao deletar quiz:', err);
      setError('Erro ao deletar quiz.');
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return { bg: '#E8F5E9', color: '#2E7D32', text: 'Publicado' };
      case 'draft': return { bg: '#FFF3E0', color: '#F57C00', text: 'Rascunho' };
      case 'archived': return { bg: '#F5F5F5', color: '#757575', text: 'Arquivado' };
      default: return { bg: '#F5F5F5', color: '#757575', text: 'Indefinido' };
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} sx={{ color: theme.palette.primary.main }} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, color: '#2C3E50', mb: 1 }}>
          Meus Quizzes
        </Typography>
        <Typography variant="body1" sx={{ color: '#7F8C8D', mb: 3 }}>
          Crie e gerencie seus próprios quizzes. Após criar, adicione perguntas e publique!
        </Typography>

        {/* Alerts */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
                {error}
              </Alert>
            </motion.div>
          )}
          {success && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <Alert severity="success" onClose={() => setSuccess(null)} sx={{ mb: 2 }}>
                {success}
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            px: 3,
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            '&:hover': {
              background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)'
            }
          }}
        >
          Criar Novo Quiz
        </Button>
      </Box>

      {/* Quizzes Grid */}
      {quizzes.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: 'center',
            borderRadius: 3,
            border: '2px dashed #e0e0e0',
            background: alpha('#f5f5f5', 0.3)
          }}
        >
          <QuizIcon sx={{ fontSize: 80, color: '#bdbdbd', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#757575', mb: 1 }}>
            Você ainda não criou nenhum quiz
          </Typography>
          <Typography variant="body2" sx={{ color: '#9e9e9e', mb: 3 }}>
            Clique no botão acima para criar seu primeiro quiz!
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {quizzes.map((quiz, index) => {
            const difficultyColors = getDifficultyColor(quiz.difficulty_level);
            const statusColors = getStatusColor(quiz.status);

            return (
              <Grid item xs={12} sm={6} md={4} key={quiz.id}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card
                    elevation={0}
                    sx={{
                      height: '100%',
                      borderRadius: 3,
                      border: '2px solid',
                      borderColor: 'rgba(0,0,0,0.08)',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: `0 12px 24px ${alpha(difficultyColors.color, 0.15)}`
                      }
                    }}
                  >
                    <Box
                      sx={{
                        height: 140,
                        background: quiz.image_url 
                          ? `url(${quiz.image_url}) center/cover` 
                          : `linear-gradient(135deg, ${difficultyColors.bg} 0%, ${alpha(difficultyColors.color, 0.2)} 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative'
                      }}
                    >
                      {!quiz.image_url && (
                        <QuizIcon sx={{ fontSize: 60, color: difficultyColors.color, opacity: 0.3 }} />
                      )}
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
                          label={statusColors.text}
                          size="small"
                          sx={{
                            background: statusColors.bg,
                            color: statusColors.color,
                            fontWeight: 600
                          }}
                        />
                      </Box>
                    </Box>

                    <CardContent>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: '#2C3E50',
                          mb: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {quiz.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#7F8C8D',
                          mb: 2,
                          height: 40,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}
                      >
                        {quiz.description || 'Sem descrição'}
                      </Typography>

                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                        <Chip
                          label={difficultyColors.text}
                          size="small"
                          sx={{
                            background: difficultyColors.bg,
                            color: difficultyColors.color,
                            fontSize: '0.75rem'
                          }}
                        />
                        <Chip
                          icon={<QuestionIcon />}
                          label={`${quiz.total_questions || 0} perguntas`}
                          size="small"
                          sx={{ fontSize: '0.75rem' }}
                        />
                        <Chip
                          icon={<PlayIcon />}
                          label={`${quiz.total_attempts || 0} tentativas`}
                          size="small"
                          sx={{ fontSize: '0.75rem' }}
                        />
                      </Box>
                    </CardContent>

                    <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
                      <Button
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => handleOpenDialog(quiz)}
                        sx={{ flex: 1 }}
                      >
                        Editar
                      </Button>
                      <Button
                        size="small"
                        startIcon={<QuestionIcon />}
                        onClick={() => navigate(`/dashboard/quizzes?quiz=${quiz.id}`)}
                        sx={{ flex: 1 }}
                      >
                        Perguntas
                      </Button>
                      {quiz.status === 'published' && (
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/quiz-play/${quiz.id}`)}
                          sx={{ color: theme.palette.success.main }}
                        >
                          <ViewIcon />
                        </IconButton>
                      )}
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(quiz.id)}
                        sx={{ color: theme.palette.error.main }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </CardActions>
                  </Card>
                </motion.div>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Dialog for Create/Edit */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingQuiz ? 'Editar Quiz' : 'Criar Novo Quiz'}
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Título *"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Descrição"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              fullWidth
              multiline
              rows={3}
            />
            <FormControl fullWidth>
              <InputLabel>Dificuldade</InputLabel>
              <Select
                value={formData.difficulty_level}
                onChange={(e) => setFormData({ ...formData, difficulty_level: e.target.value })}
                label="Dificuldade"
              >
                <MenuItem value="beginner">Iniciante</MenuItem>
                <MenuItem value="intermediate">Intermediário</MenuItem>
                <MenuItem value="advanced">Avançado</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Tempo Limite (segundos)"
              type="number"
              value={formData.time_limit_seconds}
              onChange={(e) => setFormData({ ...formData, time_limit_seconds: parseInt(e.target.value) })}
              fullWidth
            />
            <TextField
              label="Pontos por Pergunta"
              type="number"
              value={formData.points_per_question}
              onChange={(e) => setFormData({ ...formData, points_per_question: parseInt(e.target.value) })}
              fullWidth
            />
            <TextField
              label="Nota Mínima para Passar (%)"
              type="number"
              value={formData.passing_score}
              onChange={(e) => setFormData({ ...formData, passing_score: parseInt(e.target.value) })}
              fullWidth
              inputProps={{ min: 0, max: 100 }}
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                label="Status"
              >
                <MenuItem value="draft">Rascunho</MenuItem>
                <MenuItem value="published">Publicado</MenuItem>
                <MenuItem value="archived">Arquivado</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="URL da Imagem"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              fullWidth
              placeholder="https://exemplo.com/imagem.jpg"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={!formData.title}>
            {editingQuiz ? 'Atualizar' : 'Criar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default MyQuizzes;

