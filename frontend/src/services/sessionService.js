// Serviço para gerenciar sessões de quiz multiplayer
// Permite reconexão após F5/refresh

const SESSION_KEY = 'green_mind_quiz_session';
const SESSION_EXPIRY_MS = 2 * 60 * 60 * 1000; // 2 horas
const RECONNECTION_ATTEMPTS_KEY = 'green_mind_reconnection_attempts';
const MAX_RECONNECTION_ATTEMPTS = 3; // 🆕 Máximo de 3 tentativas de reconexão

class SessionService {
  // Salvar sessão atual
  saveSession(sessionData) {
    try {
      const session = {
        ...sessionData,
        timestamp: Date.now()
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      console.log('✅ Sessão salva:', session);
    } catch (error) {
      console.error('Erro ao salvar sessão:', error);
    }
  }

  // Obter sessão salva (se válida)
  getSession() {
    try {
      const sessionStr = localStorage.getItem(SESSION_KEY);
      if (!sessionStr) {
        return null;
      }

      const session = JSON.parse(sessionStr);
      const now = Date.now();
      const age = now - session.timestamp;

      // Verificar se a sessão expirou
      if (age > SESSION_EXPIRY_MS) {
        console.log('⚠️ Sessão expirada, removendo...');
        this.clearSession();
        return null;
      }

      console.log('✅ Sessão válida encontrada:', session);
      return session;
    } catch (error) {
      console.error('Erro ao obter sessão:', error);
      this.clearSession();
      return null;
    }
  }

  // Limpar sessão
  clearSession() {
    try {
      localStorage.removeItem(SESSION_KEY);
      console.log('🗑️ Sessão removida');
    } catch (error) {
      console.error('Erro ao limpar sessão:', error);
    }
  }

  // Atualizar dados da sessão (ex: pontuação, pergunta atual)
  updateSession(updates) {
    try {
      const session = this.getSession();
      if (session) {
        const updatedSession = {
          ...session,
          ...updates,
          timestamp: Date.now() // Atualizar timestamp
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(updatedSession));
        console.log('✅ Sessão atualizada:', updates);
      }
    } catch (error) {
      console.error('Erro ao atualizar sessão:', error);
    }
  }

  // Verificar se há uma sessão válida
  hasValidSession() {
    return this.getSession() !== null;
  }

  // Obter dados específicos da sessão
  getSessionData(key) {
    const session = this.getSession();
    return session ? session[key] : null;
  }

  // 🆕 Rastrear tentativas de reconexão
  incrementReconnectionAttempt(roomCode) {
    try {
      const attemptsStr = localStorage.getItem(RECONNECTION_ATTEMPTS_KEY);
      const attempts = attemptsStr ? JSON.parse(attemptsStr) : {};
      
      if (!attempts[roomCode]) {
        attempts[roomCode] = { count: 0, timestamp: Date.now() };
      }
      
      attempts[roomCode].count++;
      attempts[roomCode].timestamp = Date.now();
      
      localStorage.setItem(RECONNECTION_ATTEMPTS_KEY, JSON.stringify(attempts));
      console.log(`📊 Tentativa de reconexão #${attempts[roomCode].count} para sala ${roomCode}`);
      
      return attempts[roomCode].count;
    } catch (error) {
      console.error('Erro ao incrementar tentativas de reconexão:', error);
      return 0;
    }
  }

  // 🆕 Verificar se excedeu o limite de tentativas
  hasExceededReconnectionLimit(roomCode) {
    try {
      const attemptsStr = localStorage.getItem(RECONNECTION_ATTEMPTS_KEY);
      if (!attemptsStr) return false;
      
      const attempts = JSON.parse(attemptsStr);
      const roomAttempts = attempts[roomCode];
      
      if (!roomAttempts) return false;
      
      // Resetar contador se passou mais de 5 minutos desde a última tentativa
      const age = Date.now() - roomAttempts.timestamp;
      if (age > 5 * 60 * 1000) {
        this.clearReconnectionAttempts(roomCode);
        return false;
      }
      
      const exceeded = roomAttempts.count >= MAX_RECONNECTION_ATTEMPTS;
      if (exceeded) {
        console.warn(`⚠️ Limite de ${MAX_RECONNECTION_ATTEMPTS} tentativas de reconexão excedido para sala ${roomCode}`);
      }
      
      return exceeded;
    } catch (error) {
      console.error('Erro ao verificar limite de reconexão:', error);
      return false;
    }
  }

  // 🆕 Limpar tentativas de reconexão para uma sala
  clearReconnectionAttempts(roomCode) {
    try {
      const attemptsStr = localStorage.getItem(RECONNECTION_ATTEMPTS_KEY);
      if (!attemptsStr) return;
      
      const attempts = JSON.parse(attemptsStr);
      delete attempts[roomCode];
      
      if (Object.keys(attempts).length === 0) {
        localStorage.removeItem(RECONNECTION_ATTEMPTS_KEY);
      } else {
        localStorage.setItem(RECONNECTION_ATTEMPTS_KEY, JSON.stringify(attempts));
      }
      
      console.log(`🗑️ Tentativas de reconexão limpas para sala ${roomCode}`);
    } catch (error) {
      console.error('Erro ao limpar tentativas de reconexão:', error);
    }
  }

  // 🆕 Limpar sessão e tentativas de reconexão
  clearAll() {
    this.clearSession();
    try {
      localStorage.removeItem(RECONNECTION_ATTEMPTS_KEY);
      console.log('🗑️ Todas as sessões e tentativas limpas');
    } catch (error) {
      console.error('Erro ao limpar tudo:', error);
    }
  }
}

export default new SessionService();

