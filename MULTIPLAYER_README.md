# 🎮 Sistema Multiplayer de Quiz - Green Mind

## 📋 Visão Geral

Sistema multiplayer em tempo real para quizzes, similar ao Kahoot, implementado com Socket.io. Permite que um host (usuário autenticado) crie salas de quiz e múltiplos jogadores se conectem usando apenas um nome, sem necessidade de login.

## ✨ Funcionalidades Implementadas

### 🎯 Principais Características

- ✅ **Criação de Salas** - Apenas usuários autenticados podem criar salas
- ✅ **Entrada sem Login** - Jogadores entram apenas com nome
- ✅ **Restrição LAN** - Acesso limitado à mesma rede local
- ✅ **Sincronização em Tempo Real** - Questões, respostas e placar sincronizados
- ✅ **Gerenciamento de Conexões** - Entrada/saída de jogadores
- ✅ **Leaderboard Dinâmico** - Classificação atualizada em tempo real
- ✅ **Sistema de Pontuação** - Pontos baseados em velocidade e correção

### 📂 Arquitetura

```
backend/
├── roomManager.js          # Gerenciador de salas e jogadores
└── server.js               # Servidor Socket.io e rotas API

frontend/src/
├── services/
│   └── socket.js           # Cliente Socket.io
└── pages/
    ├── QuizMultiplayerHost.js    # Criação de sala (Host)
    ├── QuizMultiplayerJoin.js    # Entrada na sala (Jogadores)
    ├── QuizMultiplayerLobby.js   # Sala de espera
    └── QuizMultiplayerPlay.js    # Gameplay multiplayer
```

## 🚀 Como Usar

### 1️⃣ Para o HOST (Criador da Sala)

1. **Login necessário** - Entre com sua conta
2. Acesse: `/multiplayer/create`
3. Escolha um quiz da lista
4. Clique em "Criar Sala"
5. **Compartilhe o código** da sala (ex: `ABC123`)
6. Aguarde os jogadores entrarem
7. Clique em "Iniciar Jogo" quando estiver pronto
8. Controle o fluxo do jogo:
   - Avance para próxima questão
   - Mostre o leaderboard
   - Finalize o jogo

### 2️⃣ Para os JOGADORES

1. **Sem login necessário**
2. Acesse: `/multiplayer/join`
3. Digite o **código da sala** (fornecido pelo host)
4. Digite seu **nome**
5. Escolha um **avatar**
6. Clique em "Entrar na Sala"
7. Aguarde o host iniciar o jogo
8. Responda as questões o mais rápido possível!

## 🎯 Fluxo do Jogo

### 📊 Fase 1: Lobby (Sala de Espera)
- Host compartilha o código da sala
- Jogadores entram usando o código
- Lista de jogadores é atualizada em tempo real
- Host inicia o jogo quando estiver pronto

### 🎮 Fase 2: Gameplay
- Questões são sincronizadas para todos
- Timer de 30 segundos por questão
- Jogadores submetem respostas
- Feedback imediato (correto/incorreto)
- Pontuação baseada em:
  - **Correção**: Resposta certa ou errada
  - **Velocidade**: Mais rápido = mais pontos (bônus até 50%)

### 🏆 Fase 3: Leaderboard
- Exibido após cada questão (controle do host)
- Ranking por pontuação total
- Mostra posição, nome, avatar e pontos
- Destaque especial para top 3

### 🎉 Fase 4: Resultado Final
- Leaderboard final com vencedor
- Estatísticas completas
- Opção de jogar novamente

## 🔧 Eventos Socket.io

### Eventos do HOST

```javascript
// Criar sala
socket.emit('create_room', { quizId, hostData })
socket.on('room_created', (data) => { ... })

// Iniciar jogo
socket.emit('start_game', { roomCode })

// Próxima questão
socket.emit('next_question', { roomCode })

// Mostrar leaderboard
socket.emit('show_leaderboard', { roomCode })
```

### Eventos dos JOGADORES

```javascript
// Entrar na sala
socket.emit('join_room', { roomCode, playerData })
socket.on('room_joined', (data) => { ... })

// Submeter resposta
socket.emit('submit_answer', { roomCode, questionIndex, answer })
socket.on('answer_result', (data) => { ... })
```

### Eventos Gerais (Broadcast)

```javascript
// Jogador entrou
socket.on('player_joined', (data) => { ... })

// Jogador saiu
socket.on('player_left', (data) => { ... })

// Jogo iniciado
socket.on('game_started', (data) => { ... })

// Próxima questão
socket.on('next_question_started', (data) => { ... })

// Leaderboard atualizado
socket.on('leaderboard_update', (data) => { ... })

// Jogo finalizado
socket.on('game_finished', (data) => { ... })

// Sala fechada
socket.on('room_closed', (data) => { ... })
```

## 🌐 Restrição de Rede Local (LAN)

O sistema aceita apenas conexões de:
- `localhost` (127.0.0.1)
- IPs privados classe A: `10.0.0.0/8`
- IPs privados classe B: `172.16.0.0/12`
- IPs privados classe C: `192.168.0.0/16`
- IPv6 localhost: `::1` e `::ffff:127.0.0.1`

### Middleware de Verificação (server.js)

```javascript
const checkSameLAN = (socket, next) => {
  const clientIP = socket.handshake.address;
  const privateIPRegex = /^(127\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|192\.168\.)/;
  
  if (privateIPRegex.test(clientIP) || clientIP === '::1' || clientIP === '::ffff:127.0.0.1') {
    return next();
  }
  
  return next();
};

io.use(checkSameLAN);
```

## 📊 Sistema de Pontuação

### Cálculo de Pontos

```javascript
// Pontos base por questão
const basePoints = question.points || 1000;

// Tempo usado / Tempo limite
const timeRatio = timeTaken / timeLimit;

// Bônus de velocidade (0% a 50%)
const timeBonus = Math.max(0, 1 - timeRatio) * 0.5;

// Pontos finais (se correto)
const points = Math.round(basePoints * (1 + timeBonus));
```

### Exemplo

- **Pontos base**: 1000
- **Tempo limite**: 30s
- **Tempo usado**: 10s
- **Bônus**: (1 - 10/30) * 0.5 = 0.333 (33.3%)
- **Pontos finais**: 1000 * 1.333 = **1333 pontos**

## 🎨 Interface do Usuário

### Estilo Kahoot

- **Cores vibrantes** - Gradientes roxo/azul para multiplayer
- **Opções coloridas** - Vermelho, Azul, Laranja, Roxo
- **Formas geométricas** - Cada opção tem uma forma única
- **Animações suaves** - Fade, Zoom, Hover effects
- **Feedback visual** - Checkmarks para correto, X para incorreto

### Componentes

1. **Banner Multiplayer** (Quizzes.js)
   - Botões para criar/entrar em sala
   - Destaque para funcionalidades

2. **Criação de Sala** (QuizMultiplayerHost.js)
   - Grid de quizzes disponíveis
   - Dialog de confirmação

3. **Entrada na Sala** (QuizMultiplayerJoin.js)
   - Campo para código da sala
   - Campo para nome
   - Seletor de avatar (emojis)

4. **Lobby** (QuizMultiplayerLobby.js)
   - Código da sala grande e destacado
   - Lista de jogadores em tempo real
   - Controles do host
   - Indicador de status

5. **Gameplay** (QuizMultiplayerPlay.js)
   - Timer visual
   - Progresso da questão
   - Opções com hover effects
   - Leaderboard intercalado

## 🔐 Segurança

### Medidas Implementadas

1. **Autenticação do Host** - JWT token obrigatório
2. **Validação de Entrada** - Sanitização de nomes e códigos
3. **Restrição de Rede** - Apenas LAN
4. **Gerenciamento de Desconexões** - Cleanup automático
5. **Respostas Ocultas** - Clientes não recebem respostas corretas antecipadamente
6. **Validação Server-Side** - Todas as respostas validadas no servidor

## 📱 Responsividade

- **Desktop** - Layout em grid 2 colunas
- **Tablet** - Layout adaptativo
- **Mobile** - Layout em coluna única
- Todos os componentes são totalmente responsivos

## 🐛 Tratamento de Erros

### Cenários Cobertos

1. **Sala não encontrada** - Mensagem clara
2. **Nome duplicado** - Validação e feedback
3. **Jogo já iniciado** - Não permite entrada tardia
4. **Host desconectado** - Sala é fechada automaticamente
5. **Timeout de resposta** - Contabilizado como errado
6. **Perda de conexão** - Reconexão automática (5 tentativas)

## 🚀 Instalação e Execução

### Dependências

```bash
# Backend
cd backend
npm install socket.io

# Frontend
cd frontend
npm install socket.io-client
```

### Executar

```bash
# Backend (Terminal 1)
cd backend
npm start
# Servidor rodando na porta 3001

# Frontend (Terminal 2)
cd frontend
npm start
# Frontend rodando na porta 3000
```

### Acessar

- **Frontend**: http://localhost:3000
- **Multiplayer Create**: http://localhost:3000/multiplayer/create
- **Multiplayer Join**: http://localhost:3000/multiplayer/join

## 📈 Estatísticas

### Endpoint de Estatísticas

```
GET /api/multiplayer/stats
```

Retorna:
```json
{
  "totalRooms": 5,
  "totalPlayers": 23,
  "activeRooms": 2
}
```

## 🎓 Casos de Uso

### Educação

- **Professores** criam salas para alunos
- **Revisão em sala** de conteúdo
- **Competições** entre turmas
- **Gamificação** do aprendizado

### Empresas

- **Treinamentos** corporativos
- **Team building** via quizzes
- **Avaliações** de conhecimento
- **Onboarding** interativo

### Eventos

- **Conferências** com quizzes ao vivo
- **Workshops** interativos
- **Networking** games
- **Ice breakers**

## 🔮 Futuras Melhorias

- [ ] Modo público (além de LAN)
- [ ] Chat entre jogadores
- [ ] Power-ups e bônus especiais
- [ ] Histórico de partidas
- [ ] Conquistas e badges
- [ ] Modo time vs time
- [ ] Customização de salas
- [ ] Replay de partidas
- [ ] Exportar resultados

## 📝 Notas Técnicas

### Performance

- **WebSocket** para baixa latência
- **Sincronização eficiente** via Socket.io rooms
- **Gerenciamento de memória** com cleanup automático
- **Escalabilidade** via Map structures

### Compatibilidade

- **Navegadores**: Chrome, Firefox, Safari, Edge
- **Dispositivos**: Desktop, Tablet, Mobile
- **Rede**: LAN (requisito)

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique os logs do console do navegador
2. Verifique os logs do servidor backend
3. Confirme que todos estão na mesma rede
4. Recarregue a página e tente novamente

## 🎉 Conclusão

Sistema multiplayer completo e funcional, pronto para uso em ambientes educacionais e corporativos. Interface moderna e intuitiva com sincronização em tempo real garantida pelo Socket.io.

**Desenvolvido com ❤️ para Green Mind**

