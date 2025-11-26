import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
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
  Divider,
  Stack,
  alpha
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as BackIcon,
  QuestionAnswer as QuestionIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

function MyQuizQuestions() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [formData, setFormData] = useState({
    question_text: '',
    question_type: 'multiple_choice',
    time_limit_seconds: 30,
    points: 100,
    sequence_order: 1,
    options: ['', '', '', ''],
    correct_answer: '',
    explanation: ''
  });

  useEffect(() => {
    fetchQuizAndQuestions();
  }, [quizId]);

  const fetchQuizAndQuestions = async () => {
    try {
      setLoading(true);
      const [quizResponse, questionsResponse] = await Promise.all([
        api.get(`/my-quizzes/${quizId}`),
        api.get(`/my-quizzes/${quizId}/questions`)
      ]);
      setQuiz(quizResponse.data.quiz);
      setQuestions(questionsResponse.data.questions || []);
    } catch (err) {
      console.error('Erro ao buscar quiz/perguntas:', err);
      if (err.response?.status === 403 || err.response?.status === 404) {
        setError('Você não tem permissão para gerenciar este quiz ou ele não existe.');
      } else {
        setError('Erro ao carregar dados do quiz.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (question = null) => {
    if (question) {
      setEditingQuestion(question);
      setFormData({
        question_text: question.question_text,
        question_type: question.question_type || 'multiple_choice',
        time_limit_seconds: question.time_limit_seconds || 30,
        points: question.points || 100,
        sequence_order: question.sequence_order || 1,
        options: question.options || ['', '', '', ''],
        correct_answer: question.correct_answer || '',
        explanation: question.explanation || ''
      });
    } else {
      setEditingQuestion(null);
      setFormData({
        question_text: '',
        question_type: 'multiple_choice',
        time_limit_seconds: 30,
        points: 100,
        sequence_order: questions.length + 1,
        options: ['', '', '', ''],
        correct_answer: '',
        explanation: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingQuestion(null);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const handleSubmit = async () => {
    try {
      if (editingQuestion) {
        await api.put(`/my-quizzes/${quizId}/questions/${editingQuestion.id}`, formData);
        setSuccess('Pergunta atualizada com sucesso!');
      } else {
        await api.post(`/my-quizzes/${quizId}/questions`, formData);
        setSuccess('Pergunta criada com sucesso!');
      }
      handleCloseDialog();
      fetchQuizAndQuestions();
    } catch (err) {
      console.error('Erro ao salvar pergunta:', err);
      setError(err.response?.data?.message || 'Erro ao salvar pergunta.');
    }
  };

  const handleDelete = async (questionId) => {
    if (!window.confirm('Tem certeza que deseja deletar esta pergunta?')) return;

    try {
      await api.delete(`/my-quizzes/${quizId}/questions/${questionId}`);
      setSuccess('Pergunta deletada com sucesso!');
      fetchQuizAndQuestions();
    } catch (err) {
      console.error('Erro ao deletar pergunta:', err);
      setError('Erro ao deletar pergunta.');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error && !quiz) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button startIcon={<BackIcon />} onClick={() => navigate('/my-quizzes')}>
          Voltar para Meus Quizzes
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate('/my-quizzes')}
          sx={{ mb: 2 }}
        >
          Voltar para Meus Quizzes
        </Button>

        <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', mb: 1 }}>
            {quiz?.title}
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mb: 2 }}>
            {quiz?.description || 'Sem descrição'}
          </Typography>
          <Stack direction="row" spacing={2}>
            <Chip 
              icon={<QuestionIcon />} 
              label={`${questions.length} perguntas`} 
              sx={{ background: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 600 }}
            />
            <Chip 
              label={quiz?.status === 'published' ? 'Publicado' : quiz?.status === 'draft' ? 'Rascunho' : 'Arquivado'} 
              sx={{ background: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 600 }}
            />
          </Stack>
        </Paper>

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
          Adicionar Pergunta
        </Button>
      </Box>

      {/* Questions List */}
      {questions.length === 0 ? (
        <Paper elevation={0} sx={{ p: 6, textAlign: 'center', borderRadius: 3, border: '2px dashed #e0e0e0' }}>
          <QuestionIcon sx={{ fontSize: 80, color: '#bdbdbd', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#757575', mb: 1 }}>
            Nenhuma pergunta adicionada
          </Typography>
          <Typography variant="body2" sx={{ color: '#9e9e9e' }}>
            Clique no botão acima para adicionar a primeira pergunta!
          </Typography>
        </Paper>
      ) : (
        <Stack spacing={2}>
          {questions.map((question, index) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card elevation={1} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'rgba(0,0,0,0.08)' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ color: '#666', mb: 1 }}>
                        Pergunta {index + 1}
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#2C3E50', mb: 2 }}>
                        {question.question_text}
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={1}>
                      <IconButton size="small" onClick={() => handleOpenDialog(question)} color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(question.id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </Box>

                  {question.options && question.options.length > 0 && (
                    <Box sx={{ pl: 2 }}>
                      <Typography variant="subtitle2" sx={{ color: '#666', mb: 1 }}>Opções:</Typography>
                      {question.options.map((option, optIndex) => (
                        <Box key={optIndex} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          {option === question.correct_answer ? (
                            <CheckIcon sx={{ fontSize: 20, color: '#2E7D32', mr: 1 }} />
                          ) : (
                            <CancelIcon sx={{ fontSize: 20, color: '#ccc', mr: 1 }} />
                          )}
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: option === question.correct_answer ? '#2E7D32' : '#666',
                              fontWeight: option === question.correct_answer ? 600 : 400
                            }}
                          >
                            {option}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  )}

                  <Divider sx={{ my: 2 }} />

                  <Stack direction="row" spacing={2}>
                    <Chip label={`${question.points || 100} pontos`} size="small" />
                    <Chip label={`${question.time_limit_seconds || 30}s`} size="small" />
                    <Chip label={`Ordem: ${question.sequence_order || index + 1}`} size="small" />
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Stack>
      )}

      {/* Dialog for Create/Edit Question */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingQuestion ? 'Editar Pergunta' : 'Nova Pergunta'}
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Texto da Pergunta *"
              value={formData.question_text}
              onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
              fullWidth
              multiline
              rows={3}
              required
            />

            <FormControl fullWidth>
              <InputLabel>Tipo de Pergunta</InputLabel>
              <Select
                value={formData.question_type}
                onChange={(e) => setFormData({ ...formData, question_type: e.target.value })}
                label="Tipo de Pergunta"
              >
                <MenuItem value="multiple_choice">Múltipla Escolha</MenuItem>
                <MenuItem value="true_false">Verdadeiro/Falso</MenuItem>
              </Select>
            </FormControl>

            <Divider><Typography variant="caption" sx={{ color: '#666' }}>Opções de Resposta</Typography></Divider>

            {formData.options.map((option, index) => (
              <TextField
                key={index}
                label={`Opção ${index + 1}`}
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                fullWidth
              />
            ))}

            <TextField
              label="Resposta Correta *"
              value={formData.correct_answer}
              onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value })}
              fullWidth
              required
              helperText="Digite exatamente como uma das opções acima"
            />

            <TextField
              label="Explicação (opcional)"
              value={formData.explanation}
              onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
              fullWidth
              multiline
              rows={2}
            />

            <Divider />

            <Stack direction="row" spacing={2}>
              <TextField
                label="Pontos"
                type="number"
                value={formData.points}
                onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
                sx={{ flex: 1 }}
              />
              <TextField
                label="Tempo Limite (segundos)"
                type="number"
                value={formData.time_limit_seconds}
                onChange={(e) => setFormData({ ...formData, time_limit_seconds: parseInt(e.target.value) })}
                sx={{ flex: 1 }}
              />
              <TextField
                label="Ordem"
                type="number"
                value={formData.sequence_order}
                onChange={(e) => setFormData({ ...formData, sequence_order: parseInt(e.target.value) })}
                sx={{ flex: 1 }}
              />
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit} 
            disabled={!formData.question_text || !formData.correct_answer}
          >
            {editingQuestion ? 'Atualizar' : 'Criar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default MyQuizQuestions;

