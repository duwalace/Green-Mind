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
      // 🆕 Configurações otimizadas para LAN
      reconnection: true,
      reconnectionDelay: 1000, // Tentar reconectar após 1 segundo
      reconnectionDelayMax: 5000, // Máximo de 5 segundos entre tentativas
      reconnectionAttempts: Infinity, // Tentar reconectar infinitamente
      timeout: 20000, // 20 segundos para timeout de conexão inicial
      autoConnect: true,
      forceNew: false,
      multiplex: true,
      upgrade: true,
      rememberUpgrade: true,
      // Sync com servidor
      pingTimeout: 60000, // 60 segundos
      pingInterval: 25000 // 25 segundos
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket conectado:', this.socket.id);
      this.connected = true;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('🔌 Socket desconectado. Motivo:', reason);
      this.connected = false;
      
      if (reason === 'io server disconnect') {
        // Servidor desconectou o cliente, tentar reconectar manualmente
        console.log('⚠️ Servidor desconectou - tentando reconectar...');
        this.socket.connect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Erro de conexão:', error.message);
    });

    this.socket.on('reconnect_attempt', (attemptNumber) => {
      console.log(`🔄 Tentativa de reconexão #${attemptNumber}`);
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log(`✅ Reconectado após ${attemptNumber} tentativa(s)`);
      this.connected = true;
    });

    this.socket.on('reconnect_error', (error) => {
      console.error('❌ Erro na reconexão:', error.message);
    });

    this.socket.on('reconnect_failed', () => {
      console.error('❌ Falha na reconexão após todas as tentativas');
    });

    this.socket.on('error', (error) => {
      console.error('❌ Socket error:', error);
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

  // JOGADOR: Reconectar à sala (após F5/refresh)
  reconnectToRoom(roomCode, playerId, playerName, isHost) {
    return new Promise((resolve, reject) => {
      const socket = this.getSocket();
      
      console.log('🔄 Tentando reconectar à sala:', { roomCode, playerId, playerName, isHost });
      console.log('🔌 Socket conectado?', socket.connected);
      console.log('🆔 Socket ID atual:', socket.id);
      
      // Aguardar conexão se necessário
      if (!socket.connected) {
        console.log('⏳ Aguardando conexão do socket...');
        socket.once('connect', () => {
          console.log('✅ Socket conectado, emitindo reconnect_to_room');
          socket.emit('reconnect_to_room', { roomCode, playerId, playerName, isHost });
        });
      } else {
        socket.emit('reconnect_to_room', { roomCode, playerId, playerName, isHost });
      }

      const successHandler = (data) => {
        console.log('✅ Reconexão bem-sucedida:', data);
        socket.off('reconnect_error', errorHandler);
        socket.off('error', generalErrorHandler);
        clearTimeout(timeoutId);
        resolve(data);
      };

      const errorHandler = (error) => {
        console.error('❌ Erro na reconexão:', error);
        console.error('❌ Detalhes do erro:', JSON.stringify(error));
        socket.off('reconnect_success', successHandler);
        socket.off('error', generalErrorHandler);
        clearTimeout(timeoutId);
        reject(error);
      };

      const generalErrorHandler = (error) => {
        console.error('❌ Erro geral:', error);
        console.error('❌ Detalhes do erro:', JSON.stringify(error));
        socket.off('reconnect_success', successHandler);
        socket.off('reconnect_error', errorHandler);
        clearTimeout(timeoutId);
        reject(error);
      };

      socket.once('reconnect_success', successHandler);
      socket.once('reconnect_error', errorHandler);
      socket.once('error', generalErrorHandler);

      // Timeout após 10 segundos
      const timeoutId = setTimeout(() => {
        console.error('⏱️ Timeout ao reconectar');
        socket.off('reconnect_success', successHandler);
        socket.off('reconnect_error', errorHandler);
        socket.off('error', generalErrorHandler);
        reject({ message: 'Timeout ao reconectar à sala. Verifique se o backend está rodando.' });
      }, 10000);
    });
  }

  // 🆕 NOVO: Notificar que está pronto no lobby (resolve BUG 1)
  notifyLobbyReady(roomCode) {
    const socket = this.getSocket();
    console.log(`📤 [SOCKET] Emitindo lobby_ready para sala ${roomCode}`);
    socket.emit('lobby_ready', { roomCode });
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

  onPlayerReconnected(callback) {
    const socket = this.getSocket();
    socket.on('player_reconnected', callback);
  }

  // 🆕 NOVO: Room atualizada (resolve BUG 1)
  onRoomUpdated(callback) {
    const socket = this.getSocket();
    socket.on('room_updated', callback);
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

