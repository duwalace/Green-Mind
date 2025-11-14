# 🌿 Green Mind - Plataforma Educacional

Plataforma educacional focada em sustentabilidade com sistema de **quizzes multiplayer** para jogar em rede local (LAN).

## 🎯 Funcionalidades Principais

- 📚 Sistema de cursos e trilhas de aprendizado
- 🎮 **Quiz Multiplayer em Tempo Real** via Socket.io
- 👥 Múltiplos jogadores na mesma rede LAN
- 📊 Leaderboard e pontuação em tempo real
- 👨‍🏫 Painel administrativo completo
- 🎨 Interface moderna e responsiva

## 🚀 Iniciar em Rede LAN (Recomendado)

### Método Rápido (Windows):

```bash
# Duplo clique ou execute no terminal:
start-lan.bat
```

Este script irá:
- ✅ Detectar automaticamente o IP da sua máquina
- ✅ Configurar backend e frontend
- ✅ Instalar dependências
- ✅ Iniciar os servidores

### Acessar de Outros Dispositivos:

```
http://SEU_IP:3000
```

Exemplo: `http://192.168.1.100:3000`

### Configurar Firewall (se necessário):

```bash
# Executar como Administrador:
configure-firewall.bat
```

## 📖 Documentação

- **[GUIA_LAN_COMPLETO.md](GUIA_LAN_COMPLETO.md)** - Guia completo e único para LAN e Quizzes

## 🎮 Como Jogar Quiz Multiplayer

### 1. No Servidor (Host):
```
1. Acesse http://localhost:3000
2. Login → Quizzes → Escolha um quiz
3. Clique em "Modo Multiplayer"
4. Clique em "Criar Sala"
5. Compartilhe o código da sala (ex: ABC123)
```

### 2. Nos Outros Dispositivos (Jogadores):
```
1. Acesse http://SEU_IP:3000
2. Login ou Registre-se
3. Quizzes → "Entrar em Sala Multiplayer"
4. Digite o código da sala
5. Aguarde o host iniciar o jogo
```

## 🛠️ Instalação Manual

### Pré-requisitos:

- Node.js 14+
- MySQL (WAMP, XAMPP, ou standalone)
- Git (opcional)

### Backend:

```bash
cd backend
npm install

# Criar .env (use config.env.example como base)
# Configure o banco de dados

npm start
```

### Frontend:

```bash
cd frontend
npm install

# Criar .env (use config.env.example como base)
# Configure as URLs da API

npm start
```

## 🔧 Configuração

### Backend (.env):
```env
PORT=3001
HOST=0.0.0.0
JWT_SECRET=seu_jwt_secret
ALLOWED_ORIGINS=*
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=green_mind
```

### Frontend (.env):
```env
REACT_APP_API_URL=http://SEU_IP:3001/api
REACT_APP_SOCKET_URL=http://SEU_IP:3001
```

## 🧪 Testar Conexão

```bash
# Verificar se tudo está configurado corretamente:
test-connection.bat
```

## 📦 Tecnologias Utilizadas

### Backend:
- Node.js + Express
- Socket.io (WebSocket)
- MySQL
- JWT Authentication
- Multer (upload de arquivos)

### Frontend:
- React 18
- Material-UI (MUI)
- Socket.io Client
- Axios
- React Router DOM
- Framer Motion

## 🌐 Estrutura do Projeto

```
Green-Mind/
├── backend/                  # API e WebSocket
│   ├── server.js            # Servidor principal
│   ├── roomManager.js       # Gerenciador de salas multiplayer
│   ├── config/              # Configurações do banco
│   └── uploads/             # Arquivos enviados
│
├── frontend/                # Interface React
│   ├── src/
│   │   ├── components/      # Componentes reutilizáveis
│   │   ├── pages/           # Páginas da aplicação
│   │   ├── services/        # API e Socket.io
│   │   └── contexts/        # Contextos React
│   └── public/              # Recursos estáticos
│
├── start-lan.bat            # Script de inicialização LAN (Windows)
├── start-lan.ps1            # Script PowerShell (alternativa)
├── configure-firewall.bat   # Configurar firewall
├── test-connection.bat      # Testar conexão
│
└── GUIA_LAN_COMPLETO.md    # Guia completo para LAN e Quizzes
```

## 🎓 Casos de Uso

### Para Professores:
- Criar quizzes interativos
- Jogar com toda a turma em tempo real
- Acompanhar progresso dos alunos
- Sistema de pontuação e ranking

### Para Eventos:
- Competições educacionais
- Dinâmicas em grupo
- Quiz shows ao vivo
- Gamificação de conteúdo

### Para Treinamentos:
- Avaliar conhecimento da equipe
- Sessões interativas
- Feedback instantâneo
- Engajamento em tempo real

## 🔒 Segurança

⚠️ **Importante:** A configuração atual é ideal para uso em **rede local privada**.

Para uso em produção/Internet:
- Configure HTTPS com certificado SSL
- Use JWT_SECRET complexo
- Implemente rate limiting
- Configure CORS adequadamente
- Mantenha dependências atualizadas

## 🐛 Solução de Problemas

### Não consigo acessar de outro dispositivo:
1. Execute `configure-firewall.bat` como administrador
2. Verifique se todos estão na mesma rede WiFi
3. Teste com `test-connection.bat`

### Socket.io não conecta:
1. Verifique o arquivo `frontend/.env`
2. Reinicie o frontend após alterar `.env`
3. Limpe cache do navegador (Ctrl+Shift+Del)

### Quiz não aparece:
1. O quiz deve estar publicado (status: published)
2. O quiz deve ter perguntas cadastradas
3. Verifique no painel Admin → Quizzes

### Mais problemas?
Consulte: **[GUIA_LAN_COMPLETO.md](GUIA_LAN_COMPLETO.md)** - Seção "Solução de Problemas"

## 📱 Requisitos de Rede

- Todos os dispositivos na **mesma rede WiFi/Ethernet**
- Firewall configurado para portas 3000 e 3001
- Conexão estável (recomenda-se Ethernet para o servidor)

## 🚀 Performance

- Suporta **50+ jogadores simultâneos** (testado)
- Latência: < 50ms em rede local
- WebSocket com fallback para polling
- Otimizado para redes domésticas e corporativas

## 📝 Licença

Este projeto é de uso educacional.

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:
1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📞 Suporte

- **Documentação completa:** [GUIA_LAN_COMPLETO.md](GUIA_LAN_COMPLETO.md)
  - Configuração LAN passo a passo
  - Sistema de Quizzes
  - Quiz Multiplayer
  - Solução de problemas
  - Dicas e boas práticas

---

**Desenvolvido para Green Mind Educational Platform**  
Versão: 1.0.0 | Novembro 2024

🌿 **Educação + Sustentabilidade + Tecnologia** 🌿
