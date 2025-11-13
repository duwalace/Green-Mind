// Gerenciador de salas multiplayer para quiz
class RoomManager {
  constructor() {
    this.rooms = new Map(); // roomCode -> roomData
    this.players = new Map(); // socketId -> playerData
  }

  // Gerar código único de sala
  generateRoomCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code;
    do {
      code = '';
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    } while (this.rooms.has(code));
    return code;
  }

  // Criar nova sala
  createRoom(hostSocketId, hostData, quizId, quizData) {
    const roomCode = this.generateRoomCode();
    const room = {
      code: roomCode,
      quizId: quizId,
      quizData: quizData,
      host: {
        socketId: hostSocketId,
        userId: hostData.userId,
        name: hostData.name,
        avatar: hostData.avatar
      },
      players: new Map(), // playerId -> playerData
      status: 'waiting', // waiting, playing, finished
      currentQuestionIndex: -1,
      currentQuestionStartTime: null,
      scores: new Map(), // playerId -> score
      answers: new Map(), // playerId -> {questionIndex, answer, timeTaken, isCorrect, points}
      createdAt: Date.now()
    };

    this.rooms.set(roomCode, room);
    
    // Registrar host como player também
    this.players.set(hostSocketId, {
      socketId: hostSocketId,
      roomCode: roomCode,
      isHost: true
    });

    console.log(`Sala criada: ${roomCode} por ${hostData.name}`);
    return room;
  }

  // Jogador entrar na sala
  joinRoom(roomCode, playerSocketId, playerData) {
    const room = this.rooms.get(roomCode);
    
    if (!room) {
      return { success: false, error: 'Sala não encontrada' };
    }

    if (room.status !== 'waiting') {
      return { success: false, error: 'Jogo já iniciado' };
    }

    // Verificar se o nome já existe
    for (const [id, player] of room.players) {
      if (player.name.toLowerCase() === playerData.name.toLowerCase()) {
        return { success: false, error: 'Nome já em uso nesta sala' };
      }
    }

    const playerId = `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const player = {
      id: playerId,
      socketId: playerSocketId,
      name: playerData.name,
      avatar: playerData.avatar || null,
      joinedAt: Date.now(),
      isReady: false
    };

    room.players.set(playerId, player);
    room.scores.set(playerId, 0);

    this.players.set(playerSocketId, {
      socketId: playerSocketId,
      playerId: playerId,
      roomCode: roomCode,
      isHost: false
    });

    console.log(`Jogador ${playerData.name} entrou na sala ${roomCode}`);
    return { success: true, playerId: playerId, room: this.getRoomPublicData(room) };
  }

  // Jogador sair da sala
  leaveRoom(socketId) {
    const playerData = this.players.get(socketId);
    
    if (!playerData) {
      return null;
    }

    const room = this.rooms.get(playerData.roomCode);
    
    if (!room) {
      this.players.delete(socketId);
      return null;
    }

    // Se for o host, encerrar a sala
    if (playerData.isHost) {
      console.log(`Host saiu, encerrando sala ${playerData.roomCode}`);
      this.closeRoom(playerData.roomCode);
      return { roomCode: playerData.roomCode, hostLeft: true };
    }

    // Remover jogador
    if (playerData.playerId) {
      room.players.delete(playerData.playerId);
      room.scores.delete(playerData.playerId);
      console.log(`Jogador saiu da sala ${playerData.roomCode}`);
    }

    this.players.delete(socketId);

    return { 
      roomCode: playerData.roomCode, 
      playerId: playerData.playerId,
      hostLeft: false 
    };
  }

  // Fechar sala
  closeRoom(roomCode) {
    const room = this.rooms.get(roomCode);
    
    if (!room) {
      return;
    }

    // Remover todos os jogadores
    this.players.delete(room.host.socketId);
    
    for (const [playerId, player] of room.players) {
      this.players.delete(player.socketId);
    }

    this.rooms.delete(roomCode);
    console.log(`Sala ${roomCode} fechada`);
  }

  // Iniciar jogo
  startGame(roomCode) {
    const room = this.rooms.get(roomCode);
    
    if (!room) {
      return { success: false, error: 'Sala não encontrada' };
    }

    if (room.status !== 'waiting') {
      return { success: false, error: 'Jogo já iniciado' };
    }

    if (room.players.size === 0) {
      return { success: false, error: 'Nenhum jogador na sala' };
    }

    room.status = 'playing';
    room.currentQuestionIndex = 0;
    room.currentQuestionStartTime = Date.now();

    console.log(`Jogo iniciado na sala ${roomCode}`);
    return { success: true };
  }

  // Próxima questão
  nextQuestion(roomCode) {
    const room = this.rooms.get(roomCode);
    
    if (!room) {
      return { success: false, error: 'Sala não encontrada' };
    }

    room.currentQuestionIndex++;
    room.currentQuestionStartTime = Date.now();

    if (room.currentQuestionIndex >= room.quizData.questions.length) {
      room.status = 'finished';
      return { success: true, finished: true };
    }

    return { success: true, finished: false, questionIndex: room.currentQuestionIndex };
  }

  // Submeter resposta
  submitAnswer(roomCode, playerId, questionIndex, answer) {
    const room = this.rooms.get(roomCode);
    
    if (!room) {
      return { success: false, error: 'Sala não encontrada' };
    }

    if (room.status !== 'playing') {
      return { success: false, error: 'Jogo não está em andamento' };
    }

    if (questionIndex !== room.currentQuestionIndex) {
      return { success: false, error: 'Questão inválida' };
    }

    const question = room.quizData.questions[questionIndex];
    const timeTaken = Math.floor((Date.now() - room.currentQuestionStartTime) / 1000);
    const isCorrect = answer.toString() === question.correct_answer.toString();
    
    // Calcular pontos (mais rápido = mais pontos)
    let points = 0;
    if (isCorrect) {
      const basePoints = question.points || 1000;
      const timeLimit = question.time_limit_seconds || 30;
      const timeBonus = Math.max(0, 1 - (timeTaken / timeLimit)) * 0.5; // Até 50% de bônus
      points = Math.round(basePoints * (1 + timeBonus));
    }

    // Atualizar score
    const currentScore = room.scores.get(playerId) || 0;
    room.scores.set(playerId, currentScore + points);

    // Salvar resposta
    const answerKey = `${playerId}_${questionIndex}`;
    room.answers.set(answerKey, {
      playerId,
      questionIndex,
      answer,
      timeTaken,
      isCorrect,
      points
    });

    const player = room.players.get(playerId);
    console.log(`${player?.name || playerId} respondeu questão ${questionIndex}: ${isCorrect ? 'CORRETA' : 'ERRADA'} (+${points} pts)`);

    return { 
      success: true, 
      isCorrect, 
      points,
      totalScore: room.scores.get(playerId),
      correctAnswer: question.correct_answer
    };
  }

  // Obter leaderboard da sala
  getLeaderboard(roomCode) {
    const room = this.rooms.get(roomCode);
    
    if (!room) {
      return [];
    }

    const leaderboard = [];
    
    for (const [playerId, player] of room.players) {
      const score = room.scores.get(playerId) || 0;
      const correctAnswers = Array.from(room.answers.values())
        .filter(a => a.playerId === playerId && a.isCorrect)
        .length;
      
      leaderboard.push({
        playerId,
        name: player.name,
        avatar: player.avatar,
        score,
        correctAnswers
      });
    }

    // Ordenar por pontuação (maior primeiro)
    leaderboard.sort((a, b) => b.score - a.score);

    return leaderboard;
  }

  // Obter dados públicos da sala (sem respostas corretas)
  getRoomPublicData(room) {
    return {
      code: room.code,
      quizId: room.quizId,
      quizTitle: room.quizData.title,
      quizImage: room.quizData.image_url,
      host: {
        name: room.host.name,
        avatar: room.host.avatar
      },
      playerCount: room.players.size,
      players: Array.from(room.players.values()).map(p => ({
        id: p.id,
        name: p.name,
        avatar: p.avatar,
        isReady: p.isReady
      })),
      status: room.status,
      currentQuestionIndex: room.currentQuestionIndex,
      totalQuestions: room.quizData.questions.length
    };
  }

  // Obter sala
  getRoom(roomCode) {
    return this.rooms.get(roomCode);
  }

  // Obter dados do player
  getPlayerData(socketId) {
    return this.players.get(socketId);
  }

  // Verificar se sala existe
  roomExists(roomCode) {
    return this.rooms.has(roomCode);
  }

  // Estatísticas
  getStats() {
    return {
      totalRooms: this.rooms.size,
      totalPlayers: this.players.size,
      activeRooms: Array.from(this.rooms.values()).filter(r => r.status === 'playing').length
    };
  }
}

module.exports = new RoomManager();

