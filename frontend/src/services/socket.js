import { io } from 'socket.io-client';

// Usar variável de ambiente ou fallback para localhost
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001';

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
    console.log('🔌 Socket Service inicializado com URL:', SOCKET_URL);
  }

  connect() {
    if (this.socket && this.connected) {
      return this.socket;
    }

    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    this.socket.on('connect', () => {
      console.log('Socket conectado:', this.socket.id);
      this.connected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Socket desconectado');
      this.connected = false;
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  getSocket() {
    if (!this.socket) {
      return this.connect();
    }
    return this.socket;
  }

  isConnected() {
    return this.connected && this.socket !== null;
  }

  // HOST: Criar sala
  createRoom(quizId, hostData) {
    return new Promise((resolve, reject) => {
      const socket = this.getSocket();
      
      socket.emit('create_room', { quizId, hostData });

      socket.once('room_created', (data) => {
        resolve(data);
      });

      socket.once('error', (error) => {
        reject(error);
      });

      // Timeout após 10 segundos
      setTimeout(() => {
        reject({ message: 'Timeout ao criar sala' });
      }, 10000);
    });
  }

  // JOGADOR: Entrar na sala
  joinRoom(roomCode, playerData) {
    return new Promise((resolve, reject) => {
      const socket = this.getSocket();
      
      socket.emit('join_room', { roomCode, playerData });

      socket.once('room_joined', (data) => {
        resolve(data);
      });

      socket.once('join_error', (error) => {
        reject(error);
      });

      socket.once('error', (error) => {
        reject(error);
      });

      // Timeout após 10 segundos
      setTimeout(() => {
        reject({ message: 'Timeout ao entrar na sala' });
      }, 10000);
    });
  }

  // HOST: Iniciar jogo
  startGame(roomCode) {
    const socket = this.getSocket();
    socket.emit('start_game', { roomCode });
  }

  // JOGADOR: Submeter resposta
  submitAnswer(roomCode, questionIndex, answer) {
    const socket = this.getSocket();
    socket.emit('submit_answer', { roomCode, questionIndex, answer });
  }

  // HOST: Próxima questão
  nextQuestion(roomCode) {
    const socket = this.getSocket();
    socket.emit('next_question', { roomCode });
  }

  // HOST: Mostrar leaderboard
  showLeaderboard(roomCode) {
    const socket = this.getSocket();
    socket.emit('show_leaderboard', { roomCode });
  }

  // Sair da sala
  leaveRoom() {
    const socket = this.getSocket();
    socket.emit('leave_room');
  }

  // Listeners de eventos
  onPlayerJoined(callback) {
    const socket = this.getSocket();
    socket.on('player_joined', callback);
  }

  onPlayerLeft(callback) {
    const socket = this.getSocket();
    socket.on('player_left', callback);
  }

  onGameStarted(callback) {
    const socket = this.getSocket();
    socket.on('game_started', callback);
  }

  onNextQuestion(callback) {
    const socket = this.getSocket();
    socket.on('next_question_started', callback);
  }

  onAnswerResult(callback) {
    const socket = this.getSocket();
    socket.on('answer_result', callback);
  }

  onPlayerAnswered(callback) {
    const socket = this.getSocket();
    socket.on('player_answered', callback);
  }

  onLeaderboardUpdate(callback) {
    const socket = this.getSocket();
    socket.on('leaderboard_update', callback);
  }

  onGameFinished(callback) {
    const socket = this.getSocket();
    socket.on('game_finished', callback);
  }

  onRoomClosed(callback) {
    const socket = this.getSocket();
    socket.on('room_closed', callback);
  }

  // Remover listeners
  off(event) {
    const socket = this.getSocket();
    socket.off(event);
  }

  removeAllListeners() {
    const socket = this.getSocket();
    socket.removeAllListeners();
  }
}

export default new SocketService();

