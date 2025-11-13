import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  Group as GroupIcon,
  PlayArrow as PlayIcon,
  Timer as TimerIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import socketService from '../services/socket';

function QuizMultiplayerHost() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/quizzes');
      setQuizzes(response.data.quizzes);
    } catch (error) {
      console.error('Erro ao carregar quizzes:', error);
      setError('Erro ao carregar quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setShowCreateDialog(true);
  };

  const handleCreateRoom = async () => {
    if (!selectedQuiz) return;

    try {
      setCreating(true);
      setError('');

      // Conectar ao Socket.io
      socketService.connect();

      // Criar sala
      const hostData = {
        userId: user.id,
        name: user.name,
        avatar: user.avatar
      };

      const result = await socketService.createRoom(selectedQuiz.id, hostData);

      console.log('Sala criada:', result);

      // Navegar para o lobby
      navigate(`/multiplayer/lobby/${result.roomCode}`, {
        state: {
          isHost: true,
          roomCode: result.roomCode,
          quiz: selectedQuiz
        }
      });
    } catch (error) {
      console.error('Erro ao criar sala:', error);
      setError(error.message || 'Erro ao criar sala');
      setCreating(false);
    }
  };

  const getDifficultyColor = (level) => {
    switch (level) {
      case 'beginner':
        return 'success';
      case 'intermediate':
        return 'warning';
      case 'advanced':
        return 'error';
      default:
        return 'default';
    }
  };

  const getDifficultyLabel = (level) => {
    switch (level) {
      case 'beginner':
        return 'Iniciante';
      case 'intermediate':
        return 'Intermediário';
      case 'advanced':
        return 'Avançado';
      default:
        return level;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 6
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: '#fff',
              mb: 2,
              textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
            }}
          >
            🎮 Criar Sala Multiplayer
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(255,255,255,0.9)',
              fontWeight: 400
            }}
          >
            Escolha um quiz e convide seus amigos para jogar!
          </Typography>
        </Box>

        {/* Erro */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Lista de Quizzes */}
        <Grid container spacing={3}>
          {quizzes.map((quiz) => (
            <Grid item xs={12} sm={6} md={4} key={quiz.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.3)'
                  }
                }}
                onClick={() => handleSelectQuiz(quiz)}
              >
                {quiz.image_url && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={quiz.image_url}
                    alt={quiz.title}
                    sx={{ objectFit: 'cover' }}
                  />
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    {quiz.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2, minHeight: '40px' }}
                  >
                    {quiz.description?.substring(0, 80)}
                    {quiz.description?.length > 80 ? '...' : ''}
                  </Typography>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    <Chip
                      icon={<TrophyIcon />}
                      label={`${quiz.total_questions} questões`}
                      size="small"
                      color="primary"
                    />
                    <Chip
                      label={getDifficultyLabel(quiz.difficulty_level)}
                      size="small"
                      color={getDifficultyColor(quiz.difficulty_level)}
                    />
                  </Box>

                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<GroupIcon />}
                    sx={{
                      py: 1.5,
                      background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                      fontWeight: 700,
                      '&:hover': {
                        background: 'linear-gradient(90deg, #5568d3 0%, #653a8b 100%)'
                      }
                    }}
                  >
                    Criar Sala
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {quizzes.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
              Nenhum quiz disponível
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Aguarde enquanto novos quizzes são criados!
            </Typography>
          </Box>
        )}
      </Container>

      {/* Dialog de Confirmação */}
      <Dialog
        open={showCreateDialog}
        onClose={() => !creating && setShowCreateDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1.5rem' }}>
          Criar Sala Multiplayer
        </DialogTitle>
        <DialogContent>
          {selectedQuiz && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                {selectedQuiz.title}
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <TrophyIcon color="primary" />
                  <Typography>
                    <strong>{selectedQuiz.total_questions}</strong> questões
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <TimerIcon color="primary" />
                  <Typography>
                    Tempo limite por questão: <strong>30 segundos</strong>
                  </Typography>
                </Box>

                <Alert severity="info" sx={{ mt: 2 }}>
                  Você será o <strong>host</strong> da sala e controlará o início do jogo e 
                  a progressão das questões. Os jogadores verão um código para entrar na sala.
                </Alert>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setShowCreateDialog(false)}
            disabled={creating}
            sx={{ fontWeight: 600 }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleCreateRoom}
            variant="contained"
            disabled={creating}
            startIcon={creating ? <CircularProgress size={20} /> : <PlayIcon />}
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
              px: 4,
              '&:hover': {
                background: 'linear-gradient(90deg, #5568d3 0%, #653a8b 100%)'
              }
            }}
          >
            {creating ? 'Criando...' : 'Criar Sala'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default QuizMultiplayerHost;

