// Gerenciador de salas multiplayer para quiz
class RoomManager {
  constructor() {
    this.rooms = new Map(); // roomCode -> roomData
    this.players = new Map(); // socketId -> playerData
    this.disconnectionTimers = new Map(); // playerId -> timer de remoção
    this.GRACE_PERIOD = 30000; // 30 segundos para reconexão
    this.onGracePeriodExpired = null; // 🆕 Callback para quando grace period expirar
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
    const hostPlayerId = `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const room = {
      code: roomCode,
      quizId: quizId,
      quizData: quizData,
      host: {
        socketId: hostSocketId,
        userId: hostData.userId,
        name: hostData.name,
        avatar: hostData.avatar,
        playerId: hostPlayerId,
        status: 'online' // 🆕 Adicionar status inicial
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
    
    // 🔧 CORRIGIDO: Adicionar host aos players para que possa responder questões
    const hostPlayer = {
      id: hostPlayerId,
      socketId: hostSocketId,
      name: hostData.name,
      avatar: hostData.avatar,
      joinedAt: Date.now(),
      isReady: true, // Host sempre pronto
      isHost: true,
      status: 'online' // 🆕 Adicionar status inicial
    };
    
    room.players.set(hostPlayerId, hostPlayer);
    room.scores.set(hostPlayerId, 0);
    
    // Registrar host como player no mapeamento socket->player
    this.players.set(hostSocketId, {
      socketId: hostSocketId,
      playerId: hostPlayerId, // 🔧 CORRIGIDO: Incluir playerId
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
      isReady: false,
      status: 'online' // 🆕 Adicionar status inicial
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

  // Jogador sair da sala (com grace period para reconexão)
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

    // Se for o host, marcar como disconnected e iniciar timer
    if (playerData.isHost) {
      console.log(`🔌 Host desconectou da sala ${playerData.roomCode} - iniciando grace period de ${this.GRACE_PERIOD/1000}s`);
      
      // Marcar host como disconnected
      room.host.status = 'disconnected';
      room.host.disconnectedAt = Date.now();
      
      // Limpar mapeamento do socket antigo
      this.players.delete(socketId);
      
      // Iniciar timer de remoção
      const timerId = setTimeout(() => {
        console.log(`⏰ Grace period expirado para host da sala ${playerData.roomCode} - encerrando sala`);
        this.closeRoom(playerData.roomCode);
        
        // 🆕 Executar callback para notificar via Socket.io
        if (this.onGracePeriodExpired) {
          this.onGracePeriodExpired({
            type: 'host',
            roomCode: playerData.roomCode,
            playerId: playerData.playerId
          });
        }
      }, this.GRACE_PERIOD);
      
      this.disconnectionTimers.set(`host_${playerData.roomCode}`, timerId);
      
      return { 
        roomCode: playerData.roomCode, 
        hostLeft: false,
        hostDisconnected: true,
        gracePeriod: this.GRACE_PERIOD 
      };
    }

    // Jogador normal - marcar como disconnected
    if (playerData.playerId) {
      const player = room.players.get(playerData.playerId);
      
      if (player) {
        console.log(`🔌 Jogador ${player.name} desconectou da sala ${playerData.roomCode} - iniciando grace period de ${this.GRACE_PERIOD/1000}s`);
        
        player.status = 'disconnected';
        player.disconnectedAt = Date.now();
        
        // Limpar mapeamento do socket antigo
        this.players.delete(socketId);
        
        // Iniciar timer de remoção
        const timerId = setTimeout(() => {
          console.log(`⏰ Grace period expirado para jogador ${player.name} - removendo da sala ${playerData.roomCode}`);
          room.players.delete(playerData.playerId);
          room.scores.delete(playerData.playerId);
          this.disconnectionTimers.delete(playerData.playerId);
          
          // 🆕 Executar callback para notificar via Socket.io
          if (this.onGracePeriodExpired) {
            this.onGracePeriodExpired({
              type: 'player',
              roomCode: playerData.roomCode,
              playerId: playerData.playerId,
              playerName: player.name
            });
          }
        }, this.GRACE_PERIOD);
        
        this.disconnectionTimers.set(playerData.playerId, timerId);
      }
    }

    return { 
      roomCode: playerData.roomCode, 
      playerId: playerData.playerId,
      hostLeft: false,
      playerDisconnected: true,
      gracePeriod: this.GRACE_PERIOD
    };
  }

  // Fechar sala
  closeRoom(roomCode) {
    const room = this.rooms.get(roomCode);
    
    if (!room) {
      return;
    }

    // 🆕 Limpar timer de desconexão do host (se existir)
    const hostTimerKey = `host_${roomCode}`;
    if (this.disconnectionTimers.has(hostTimerKey)) {
      clearTimeout(this.disconnectionTimers.get(hostTimerKey));
      this.disconnectionTimers.delete(hostTimerKey);
    }

    // Remover todos os jogadores e seus timers
    this.players.delete(room.host.socketId);
    
    for (const [playerId, player] of room.players) {
      this.players.delete(player.socketId);
      
      // 🆕 Limpar timer de desconexão do jogador (se existir)
      if (this.disconnectionTimers.has(playerId)) {
        clearTimeout(this.disconnectionTimers.get(playerId));
        this.disconnectionTimers.delete(playerId);
      }
    }

    this.rooms.delete(roomCode);
    console.log(`🚪 Sala ${roomCode} fechada e todos os timers limpos`);
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

    // Verificar se o jogador já respondeu esta questão
    const answerKey = `${playerId}_${questionIndex}`;
    if (room.answers.has(answerKey)) {
      return { success: false, error: 'Você já respondeu esta questão' };
    }

    const question = room.quizData.questions[questionIndex];
    const timeTaken = Math.floor((Date.now() - room.currentQuestionStartTime) / 1000);
    
    // Debug: Log dos valores para identificar problema de comparação
    console.log(`🔍 [DEBUG] Comparação de resposta:`);
    console.log(`   - Resposta do jogador: ${answer} (tipo: ${typeof answer})`);
    console.log(`   - Resposta correta: ${question.correct_answer} (tipo: ${typeof question.correct_answer})`);
    console.log(`   - Resposta do jogador (string): "${answer.toString()}"`);
    console.log(`   - Resposta correta (string): "${question.correct_answer.toString()}"`);
    
    // Normalizar para número inteiro para comparação
    const userAnswerInt = parseInt(answer, 10);
    const correctAnswerInt = parseInt(question.correct_answer, 10);
    const isCorrect = userAnswerInt === correctAnswerInt;
    
    console.log(`   - Resultado: ${isCorrect ? '✅ CORRETO' : '❌ ERRADO'}`);
    
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
    room.answers.set(answerKey, {
      playerId,
      questionIndex,
      answer,
      timeTaken,
      isCorrect,
      points
    });

    const player = room.players.get(playerId);
    console.log(`${player?.name || playerId} respondeu questão ${questionIndex}: ${isCorrect ? '✅ CORRETA' : '❌ ERRADA'} (+${points} pts)`);

    // 🔧 NOVO: Verificar se todos os jogadores responderam
    const totalPlayers = room.players.size;
    const answersForCurrentQuestion = Array.from(room.answers.keys())
      .filter(key => key.endsWith(`_${questionIndex}`))
      .length;
    
    const allAnswered = answersForCurrentQuestion === totalPlayers;
    
    console.log(`📊 [PROGRESSO] ${answersForCurrentQuestion}/${totalPlayers} jogadores responderam`);
    if (allAnswered) {
      console.log(`✅ [TODOS RESPONDERAM] Todos os jogadores responderam a questão ${questionIndex}!`);
    }

    return { 
      success: true, 
      isCorrect, 
      points,
      totalScore: room.scores.get(playerId),
      correctAnswer: correctAnswerInt, // Retornar como int
      allAnswered: allAnswered, // 🔧 NOVO: Indicar se todos responderam
      playersAnswered: answersForCurrentQuestion,
      totalPlayers: totalPlayers
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

  // Reconectar jogador (após F5/refresh ou desconexão temporária)
  reconnectPlayer(roomCode, playerId, newSocketId, playerName) {
    const room = this.rooms.get(roomCode);
    
    if (!room) {
      return { success: false, error: 'Sala não encontrada' };
    }

    // 🔧 CORRIGIDO: Verificar se é o host comparando playerId
    const isHostReconnect = (room.host.playerId === playerId);
    
    if (isHostReconnect) {
      // Host reconectando
      console.log(`🎯 Host ${playerName} tentando reconectar à sala ${roomCode}`);
      
      // Verificar se o nome bate com o host
      if (room.host.name.toLowerCase() !== playerName.toLowerCase()) {
        return { success: false, error: 'Você não é o host desta sala' };
      }

      // 🆕 CANCELAR timer de desconexão do host
      const hostTimerKey = `host_${roomCode}`;
      if (this.disconnectionTimers.has(hostTimerKey)) {
        clearTimeout(this.disconnectionTimers.get(hostTimerKey));
        this.disconnectionTimers.delete(hostTimerKey);
        console.log(`✅ Timer de desconexão do host cancelado`);
      }

      // Atualizar socketId do host
      room.host.socketId = newSocketId;
      room.host.status = 'online'; // 🆕 Marcar como online
      delete room.host.disconnectedAt; // 🆕 Remover timestamp de desconexão
      
      // 🔧 CORRIGIDO: Atualizar socketId do host no players também
      const hostPlayer = room.players.get(room.host.playerId);
      if (hostPlayer) {
        hostPlayer.socketId = newSocketId;
        hostPlayer.status = 'online'; // 🆕 Marcar como online
        delete hostPlayer.disconnectedAt;
      }

      // Atualizar mapeamento de players
      this.players.set(newSocketId, {
        socketId: newSocketId,
        playerId: room.host.playerId,
        roomCode: roomCode,
        isHost: true
      });

      console.log(`✅ Host ${playerName} reconectado na sala ${roomCode}`);

      return {
        success: true,
        playerId: room.host.playerId,
        isHost: true,
        room: this.getRoomPublicData(room),
        currentState: {
          questionIndex: room.currentQuestionIndex,
          question: room.currentQuestionIndex >= 0 ? room.quizData.questions[room.currentQuestionIndex] : null,
          totalQuestions: room.quizData.questions.length,
          score: room.scores.get(room.host.playerId) || 0, // 🔧 Host também pode ter score
          status: room.status
        }
      };
    }

    // Jogador normal reconectando
    const player = room.players.get(playerId);
    
    if (!player) {
      return { success: false, error: 'Jogador não encontrado nesta sala' };
    }

    // Verificar se o nome bate (segurança adicional)
    if (player.name.toLowerCase() !== playerName.toLowerCase()) {
      return { success: false, error: 'Dados de reconexão inválidos' };
    }

    // 🆕 CANCELAR timer de desconexão do jogador
    if (this.disconnectionTimers.has(playerId)) {
      clearTimeout(this.disconnectionTimers.get(playerId));
      this.disconnectionTimers.delete(playerId);
      console.log(`✅ Timer de desconexão do jogador ${playerName} cancelado`);
    }

    // Remover mapeamento antigo do socketId (se ainda existir)
    const oldPlayerData = Array.from(this.players.entries())
      .find(([_, data]) => data.playerId === playerId);
    
    if (oldPlayerData) {
      this.players.delete(oldPlayerData[0]);
    }

    // Atualizar socketId do jogador na sala
    player.socketId = newSocketId;
    player.status = 'online'; // 🆕 Marcar como online
    delete player.disconnectedAt; // 🆕 Remover timestamp de desconexão

    // Atualizar mapeamento de players
    this.players.set(newSocketId, {
      socketId: newSocketId,
      playerId: playerId,
      roomCode: roomCode,
      isHost: false
    });

    console.log(`✅ Jogador ${playerName} reconectado na sala ${roomCode} (novo socket: ${newSocketId})`);

    // Retornar estado completo
    return {
      success: true,
      playerId: playerId,
      isHost: false,
      room: this.getRoomPublicData(room),
      currentState: {
        questionIndex: room.currentQuestionIndex,
        question: room.currentQuestionIndex >= 0 ? room.quizData.questions[room.currentQuestionIndex] : null,
        totalQuestions: room.quizData.questions.length,
        score: room.scores.get(playerId) || 0,
        status: room.status
      }
    };
  }

  // Verificar se sala existe
  roomExists(roomCode) {
    return this.rooms.has(roomCode);
  }

  // Verificar se player existe em uma sala
  playerExistsInRoom(roomCode, playerId) {
    const room = this.rooms.get(roomCode);
    return room ? room.players.has(playerId) : false;
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

