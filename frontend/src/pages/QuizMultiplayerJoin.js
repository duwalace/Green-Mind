import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Paper,
  Alert,
  CircularProgress,
  Avatar,
  Grid
} from '@mui/material';
import {
  Person as PersonIcon,
  Login as LoginIcon,
  Gamepad as GamepadIcon
} from '@mui/icons-material';
import socketService from '../services/socket';
import api from '../services/api';

function QuizMultiplayerJoin() {
  const navigate = useNavigate();

  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('1');
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState('');

  // Avatares disponíveis (números de 1 a 12 para usar com DiceBear ou similar)
  const avatars = [
    { id: '1', emoji: '😀' },
    { id: '2', emoji: '😎' },
    { id: '3', emoji: '🤓' },
    { id: '4', emoji: '😊' },
    { id: '5', emoji: '🥳' },
    { id: '6', emoji: '🤠' },
    { id: '7', emoji: '🦊' },
    { id: '8', emoji: '🐼' },
    { id: '9', emoji: '🦁' },
    { id: '10', emoji: '🐯' },
    { id: '11', emoji: '🐸' },
    { id: '12', emoji: '🦄' }
  ];

  const handleJoinRoom = async () => {
    // Validações
    if (!roomCode.trim()) {
      setError('Digite o código da sala');
      return;
    }

    if (!playerName.trim()) {
      setError('Digite seu nome');
      return;
    }

    if (playerName.trim().length < 2) {
      setError('Nome deve ter pelo menos 2 caracteres');
      return;
    }

    if (playerName.trim().length > 20) {
      setError('Nome deve ter no máximo 20 caracteres');
      return;
    }

    try {
      setJoining(true);
      setError('');

      // Verificar se sala existe (via REST API)
      const roomCodeUpper = roomCode.toUpperCase().trim();
      
      try {
        await api.get(`/multiplayer/room/${roomCodeUpper}`);
      } catch (err) {
        setError('Sala não encontrada');
        setJoining(false);
        return;
      }

      // Conectar ao Socket.io
      socketService.connect();

      // Entrar na sala
      const playerData = {
        name: playerName.trim(),
        avatar: selectedAvatar
      };

      const result = await socketService.joinRoom(roomCodeUpper, playerData);

      console.log('Entrou na sala:', result);

      // Navegar para o lobby
      navigate(`/multiplayer/lobby/${roomCodeUpper}`, {
        state: {
          isHost: false,
          playerId: result.playerId,
          playerName: playerName.trim(),
          roomCode: roomCodeUpper
        }
      });
    } catch (error) {
      console.error('Erro ao entrar na sala:', error);
      setError(error.message || 'Erro ao entrar na sala. Verifique o código e tente novamente.');
      setJoining(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !joining) {
      handleJoinRoom();
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        py: 6,
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={24}
          sx={{
            borderRadius: '24px',
            p: 5,
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(10px)'
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <GamepadIcon
              sx={{
                fontSize: 80,
                color: '#f5576c',
                mb: 2
              }}
            />
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(90deg, #f093fb 0%, #f5576c 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1
              }}
            >
              Entrar na Sala
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
              Digite o código da sala e escolha seu nome
            </Typography>
          </Box>

          {/* Erro */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {/* Formulário */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Código da Sala"
              placeholder="Ex: ABC123"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              onKeyPress={handleKeyPress}
              disabled={joining}
              inputProps={{
                maxLength: 6,
                style: { textTransform: 'uppercase', fontSize: '1.2rem', textAlign: 'center', fontWeight: 700 }
              }}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  fontSize: '1.2rem'
                }
              }}
            />

            <TextField
              fullWidth
              label="Seu Nome"
              placeholder="Ex: João Silva"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={joining}
              inputProps={{ maxLength: 20 }}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px'
                }
              }}
            />

            {/* Seleção de Avatar */}
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>
              Escolha seu Avatar:
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {avatars.map((avatar) => (
                <Grid item xs={3} sm={2} key={avatar.id}>
                  <Box
                    onClick={() => !joining && setSelectedAvatar(avatar.id)}
                    sx={{
                      cursor: joining ? 'default' : 'pointer',
                      textAlign: 'center',
                      p: 1,
                      borderRadius: '12px',
                      border: '3px solid',
                      borderColor: selectedAvatar === avatar.id ? '#f5576c' : 'transparent',
                      background: selectedAvatar === avatar.id ? 'rgba(245, 87, 108, 0.1)' : 'transparent',
                      transition: 'all 0.2s ease',
                      '&:hover': joining ? {} : {
                        transform: 'scale(1.1)',
                        borderColor: '#f5576c'
                      }
                    }}
                  >
                    <Typography sx={{ fontSize: '2rem' }}>
                      {avatar.emoji}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Botão */}
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleJoinRoom}
            disabled={joining || !roomCode.trim() || !playerName.trim()}
            startIcon={joining ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
            sx={{
              py: 2,
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: 700,
              background: 'linear-gradient(90deg, #f093fb 0%, #f5576c 100%)',
              textTransform: 'none',
              '&:hover': {
                background: 'linear-gradient(90deg, #d97ae6 0%, #e04a5f 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 16px rgba(245, 87, 108, 0.4)'
              },
              '&:disabled': {
                background: '#ccc'
              }
            }}
          >
            {joining ? 'Entrando...' : 'Entrar na Sala'}
          </Button>

          {/* Link para criar sala */}
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Quer criar sua própria sala?{' '}
              <Button
                component="a"
                href="/multiplayer/create"
                sx={{
                  textTransform: 'none',
                  fontWeight: 700,
                  color: '#f5576c',
                  '&:hover': {
                    background: 'transparent',
                    textDecoration: 'underline'
                  }
                }}
              >
                Criar Sala (requer login)
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default QuizMultiplayerJoin;

