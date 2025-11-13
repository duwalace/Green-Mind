# 💡 Exemplos de Uso - Sistema Multiplayer

## 📚 Índice

1. [Criar Sala Programaticamente](#1-criar-sala-programaticamente)
2. [Entrar na Sala](#2-entrar-na-sala)
3. [Submeter Resposta](#3-submeter-resposta)
4. [Controlar Jogo (Host)](#4-controlar-jogo-host)
5. [Listeners de Eventos](#5-listeners-de-eventos)
6. [Exemplos Completos](#6-exemplos-completos)

---

## 1. Criar Sala Programaticamente

### Frontend (React Component)

```javascript
import socketService from '../services/socket';

// Dentro de um componente
const handleCreateRoom = async () => {
  try {
    // Conectar ao Socket.io
    socketService.connect();

    // Dados do host
    const hostData = {
      userId: user.id,
      name: user.name,
      avatar: user.avatar
    };

    // Criar sala
    const result = await socketService.createRoom(quizId, hostData);
    
    console.log('Sala criada:', result.roomCode);
    // result = { roomCode: 'ABC123', room: {...} }
    
    // Navegar para o lobby
    navigate(`/multiplayer/lobby/${result.roomCode}`);
  } catch (error) {
    console.error('Erro:', error.message);
  }
};
```

### Backend (Direct Socket.io)

```javascript
// Client-side
socket.emit('create_room', {
  quizId: 1,
  hostData: {
    userId: 123,
    name: 'João Silva',
    avatar: 'avatar_url'
  }
});

socket.on('room_created', (data) => {
  console.log('Código da sala:', data.roomCode);
  console.log('Dados da sala:', data.room);
});
```

---

## 2. Entrar na Sala

### Simples

```javascript
import socketService from '../services/socket';

const joinRoom = async () => {
  try {
    socketService.connect();

    const result = await socketService.joinRoom('ABC123', {
      name: 'Maria Silva',
      avatar: '2'
    });

    console.log('ID do jogador:', result.playerId);
    console.log('Sala:', result.room);
  } catch (error) {
    console.error('Erro ao entrar:', error.message);
    // Possíveis erros:
    // - "Sala não encontrada"
    // - "Nome já em uso nesta sala"
    // - "Jogo já iniciado"
  }
};
```

### Com Validação

```javascript
const joinRoomWithValidation = async (roomCode, playerName) => {
  // Validações
  if (!roomCode || roomCode.length !== 6) {
    throw new Error('Código inválido');
  }

  if (!playerName || playerName.length < 2) {
    throw new Error('Nome muito curto');
  }

  if (playerName.length > 20) {
    throw new Error('Nome muito longo');
  }

  // Verificar se sala existe (REST API)
  const response = await api.get(`/multiplayer/room/${roomCode}`);
  
  if (!response.data.room) {
    throw new Error('Sala não encontrada');
  }

  if (response.data.room.status !== 'waiting') {
    throw new Error('Jogo já iniciado');
  }

  // Entrar
  socketService.connect();
  return await socketService.joinRoom(roomCode, {
    name: playerName,
    avatar: '1'
  });
};
```

---

## 3. Submeter Resposta

### Durante o Jogo

```javascript
// Jogador clica na opção
const handleAnswerClick = (answerIndex) => {
  if (isAnswered) return; // Já respondeu

  setIsAnswered(true);
  setSelectedAnswer(answerIndex);

  // Submeter resposta
  socketService.submitAnswer(
    roomCode,      // 'ABC123'
    questionIndex, // 0, 1, 2...
    answerIndex    // 0, 1, 2, 3
  );
};

// Receber resultado
socketService.onAnswerResult((data) => {
  console.log('Correto?', data.isCorrect);
  console.log('Pontos ganhos:', data.points);
  console.log('Pontuação total:', data.totalScore);
  console.log('Resposta correta:', data.correctAnswer);
  
  // Atualizar UI
  setScore(data.totalScore);
  
  if (data.isCorrect) {
    showSuccessAnimation();
  } else {
    showErrorAnimation();
  }
});
```

### Com Timer

```javascript
const [timeLeft, setTimeLeft] = useState(30);
const [questionStartTime, setQuestionStartTime] = useState(Date.now());

useEffect(() => {
  if (!isAnswered && timeLeft > 0) {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeout(); // Auto-submeter
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }
}, [isAnswered, timeLeft]);

const handleTimeout = () => {
  // Submeter resposta vazia (timeout)
  socketService.submitAnswer(roomCode, questionIndex, -1);
};
```

---

## 4. Controlar Jogo (Host)

### Iniciar Jogo

```javascript
// Host no lobby
const handleStartGame = () => {
  if (players.length === 0) {
    alert('Aguarde jogadores entrarem');
    return;
  }

  socketService.startGame(roomCode);
};

// Listener
socketService.onGameStarted((data) => {
  console.log('Jogo iniciado!');
  console.log('Primeira questão:', data.question);
  console.log('Total de questões:', data.totalQuestions);
  
  // Navegar para tela de jogo
  navigate(`/multiplayer/play/${roomCode}`);
});
```

### Mostrar Leaderboard

```javascript
// Host após questão respondida
const handleShowLeaderboard = () => {
  socketService.showLeaderboard(roomCode);
};

// Todos os jogadores recebem
socketService.onLeaderboardUpdate((data) => {
  console.log('Classificação:', data.leaderboard);
  /*
  [
    { playerId: '...', name: 'Pedro', score: 1450, correctAnswers: 3 },
    { playerId: '...', name: 'Maria', score: 1200, correctAnswers: 2 },
    { playerId: '...', name: 'João', score: 1100, correctAnswers: 2 }
  ]
  */
  
  setLeaderboard(data.leaderboard);
  setShowLeaderboard(true);
});
```

### Próxima Questão

```javascript
// Host clica "Próxima Questão"
const handleNextQuestion = () => {
  socketService.nextQuestion(roomCode);
};

// Todos recebem
socketService.onNextQuestion((data) => {
  if (!data.finished) {
    console.log('Questão', data.questionIndex + 1);
    console.log('Pergunta:', data.question);
    
    // Resetar estado
    setCurrentQuestion(data.question);
    setIsAnswered(false);
    setSelectedAnswer(null);
    setTimeLeft(data.question.time_limit_seconds);
  }
});

// Jogo finalizado
socketService.onGameFinished((data) => {
  console.log('Jogo finalizado!');
  console.log('Vencedor:', data.leaderboard[0]);
  
  setGameFinished(true);
  setLeaderboard(data.leaderboard);
});
```

---

## 5. Listeners de Eventos

### Setup Completo de Listeners

```javascript
useEffect(() => {
  // Conectar
  socketService.connect();

  // Setup listeners
  setupListeners();

  // Cleanup ao desmontar
  return () => {
    socketService.removeAllListeners();
    socketService.disconnect();
  };
}, []);

const setupListeners = () => {
  // Jogador entrou
  socketService.onPlayerJoined((data) => {
    console.log('Novo jogador:', data.player.name);
    setPlayers(data.room.players);
    showNotification(`${data.player.name} entrou!`);
  });

  // Jogador saiu
  socketService.onPlayerLeft((data) => {
    console.log('Jogador saiu:', data.playerId);
    setPlayers(data.room.players);
  });

  // Sala fechada
  socketService.onRoomClosed((data) => {
    console.log('Sala fechada:', data.message);
    alert(data.message);
    navigate('/multiplayer/join');
  });

  // Erro
  socketService.getSocket().on('error', (error) => {
    console.error('Erro:', error.message);
    setError(error.message);
  });
};
```

### Listener Específico do Host

```javascript
// Apenas o host recebe
socketService.onPlayerAnswered((data) => {
  console.log(`${data.playerName} respondeu!`);
  
  // Adicionar à lista de quem já respondeu
  setPlayersAnswered(prev => [...prev, data.playerName]);
  
  // Mostrar indicador visual
  updatePlayerStatus(data.playerId, 'answered');
});
```

---

## 6. Exemplos Completos

### Exemplo 1: Hook Customizado para Multiplayer

```javascript
// hooks/useMultiplayer.js
import { useState, useEffect } from 'react';
import socketService from '../services/socket';

export const useMultiplayer = (roomCode, isHost) => {
  const [connected, setConnected] = useState(false);
  const [players, setPlayers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    socketService.connect();

    const socket = socketService.getSocket();

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    socketService.onPlayerJoined((data) => {
      setPlayers(data.room.players);
    });

    socketService.onPlayerLeft((data) => {
      setPlayers(data.room.players);
    });

    socketService.onGameStarted((data) => {
      setCurrentQuestion(data.question);
    });

    socketService.onNextQuestion((data) => {
      setCurrentQuestion(data.question);
    });

    socketService.onLeaderboardUpdate((data) => {
      setLeaderboard(data.leaderboard);
    });

    socketService.onRoomClosed((data) => {
      setError(data.message);
    });

    return () => {
      socketService.removeAllListeners();
    };
  }, [roomCode]);

  const startGame = () => socketService.startGame(roomCode);
  const nextQuestion = () => socketService.nextQuestion(roomCode);
  const submitAnswer = (questionIndex, answer) => 
    socketService.submitAnswer(roomCode, questionIndex, answer);
  const showLeaderboard = () => socketService.showLeaderboard(roomCode);

  return {
    connected,
    players,
    currentQuestion,
    leaderboard,
    error,
    startGame,
    nextQuestion,
    submitAnswer,
    showLeaderboard
  };
};

// Uso no componente
function MultiplayerGame({ roomCode }) {
  const {
    connected,
    players,
    currentQuestion,
    startGame,
    submitAnswer
  } = useMultiplayer(roomCode, true);

  if (!connected) return <div>Conectando...</div>;

  return (
    <div>
      <h1>Jogadores: {players.length}</h1>
      {currentQuestion ? (
        <Question 
          question={currentQuestion} 
          onAnswer={submitAnswer}
        />
      ) : (
        <button onClick={startGame}>Iniciar</button>
      )}
    </div>
  );
}
```

### Exemplo 2: Componente de Leaderboard Reutilizável

```javascript
// components/MultiplayerLeaderboard.js
import React from 'react';
import { Box, Card, Typography, Avatar, Chip } from '@mui/material';
import { EmojiEvents as TrophyIcon } from '@mui/icons-material';

function MultiplayerLeaderboard({ leaderboard }) {
  const getMedalColor = (index) => {
    if (index === 0) return '#FFD700'; // Ouro
    if (index === 1) return '#C0C0C0'; // Prata
    if (index === 2) return '#CD7F32'; // Bronze
    return '#667eea';
  };

  const getAvatarEmoji = (avatarId) => {
    const avatars = {
      '1': '😀', '2': '😎', '3': '🤓', '4': '😊',
      '5': '🥳', '6': '🤠', '7': '🦊', '8': '🐼'
    };
    return avatars[avatarId] || '😀';
  };

  return (
    <Box>
      {leaderboard.map((player, index) => (
        <Card
          key={player.playerId}
          sx={{
            mb: 2,
            p: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            border: index === 0 ? '3px solid #FFD700' : 'none'
          }}
        >
          {/* Posição */}
          <Avatar
            sx={{
              width: 56,
              height: 56,
              bgcolor: getMedalColor(index),
              fontWeight: 800,
              fontSize: '1.5rem'
            }}
          >
            {index + 1}
          </Avatar>

          {/* Avatar do jogador */}
          <Avatar sx={{ width: 48, height: 48, fontSize: '2rem' }}>
            {getAvatarEmoji(player.avatar)}
          </Avatar>

          {/* Nome */}
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {player.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {player.correctAnswers} acertos
            </Typography>
          </Box>

          {/* Pontos */}
          <Chip
            icon={<TrophyIcon />}
            label={`${player.score} pts`}
            sx={{
              fontSize: '1.1rem',
              fontWeight: 700,
              bgcolor: getMedalColor(index),
              color: '#fff',
              py: 3,
              px: 2
            }}
          />
        </Card>
      ))}
    </Box>
  );
}

export default MultiplayerLeaderboard;

// Uso
<MultiplayerLeaderboard leaderboard={leaderboard} />
```

### Exemplo 3: Sistema de Notificações

```javascript
// utils/notifications.js
export const showPlayerJoinedNotification = (playerName) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Novo Jogador!', {
      body: `${playerName} entrou na sala`,
      icon: '/logo192.png',
      badge: '/logo192.png',
      tag: 'player-joined',
      requireInteraction: false
    });
  }
};

export const showGameStartedNotification = () => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Jogo Iniciando!', {
      body: 'Prepare-se! O jogo vai começar.',
      icon: '/logo192.png',
      badge: '/logo192.png',
      tag: 'game-started',
      requireInteraction: true,
      vibrate: [200, 100, 200]
    });
  }
};

// Uso no componente
useEffect(() => {
  // Pedir permissão
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}, []);

socketService.onPlayerJoined((data) => {
  showPlayerJoinedNotification(data.player.name);
});

socketService.onGameStarted(() => {
  showGameStartedNotification();
});
```

### Exemplo 4: Indicador de Status de Conexão

```javascript
// components/ConnectionStatus.js
import React, { useState, useEffect } from 'react';
import { Chip } from '@mui/material';
import { Circle as CircleIcon } from '@mui/icons-material';
import socketService from '../services/socket';

function ConnectionStatus() {
  const [status, setStatus] = useState('connecting');

  useEffect(() => {
    const socket = socketService.getSocket();

    socket.on('connect', () => setStatus('connected'));
    socket.on('disconnect', () => setStatus('disconnected'));
    socket.on('connect_error', () => setStatus('error'));

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
    };
  }, []);

  const getStatusConfig = () => {
    switch (status) {
      case 'connected':
        return { color: 'success', label: 'Conectado', iconColor: '#4caf50' };
      case 'disconnected':
        return { color: 'error', label: 'Desconectado', iconColor: '#f44336' };
      case 'error':
        return { color: 'warning', label: 'Erro', iconColor: '#ff9800' };
      default:
        return { color: 'default', label: 'Conectando...', iconColor: '#9e9e9e' };
    }
  };

  const config = getStatusConfig();

  return (
    <Chip
      icon={<CircleIcon sx={{ color: config.iconColor }} />}
      label={config.label}
      color={config.color}
      size="small"
      sx={{ fontWeight: 600 }}
    />
  );
}

export default ConnectionStatus;
```

---

## 🎯 Dicas Avançadas

### 1. Debugging Socket.io

```javascript
// Ativar logs detalhados
const socket = io(SOCKET_URL, {
  transports: ['websocket', 'polling'],
  reconnection: true,
  debug: true // Ativar logs
});

// Monitorar todos os eventos
socket.onAny((event, ...args) => {
  console.log(`[Socket] ${event}:`, args);
});
```

### 2. Persistir Estado entre Reconexões

```javascript
useEffect(() => {
  const socket = socketService.getSocket();

  socket.on('disconnect', () => {
    // Salvar estado local
    localStorage.setItem('multiplayerState', JSON.stringify({
      roomCode,
      playerId,
      isHost
    }));
  });

  socket.on('connect', () => {
    // Restaurar estado
    const savedState = localStorage.getItem('multiplayerState');
    if (savedState) {
      const state = JSON.parse(savedState);
      // Reentrar na sala
      socketService.joinRoom(state.roomCode, state.playerId);
    }
  });
}, []);
```

### 3. Heartbeat para Manter Conexão

```javascript
useEffect(() => {
  const interval = setInterval(() => {
    const socket = socketService.getSocket();
    if (socket.connected) {
      socket.emit('ping');
    }
  }, 30000); // A cada 30 segundos

  return () => clearInterval(interval);
}, []);
```

---

**Fim dos Exemplos! 🎉**

Para mais informações, consulte:
- `MULTIPLAYER_README.md` - Documentação completa
- `QUICK_START_MULTIPLAYER.md` - Guia rápido
- `IMPLEMENTACAO_COMPLETA.md` - Checklist e resumo

