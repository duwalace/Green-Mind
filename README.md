# 🌿 Green Mind - Plataforma Educacional

Plataforma educacional focada em sustentabilidade com sistema de **quizzes multiplayer** para jogar em rede local (LAN).

---

## 📚 Documentação

**🚀 Começando agora?** → [INICIO_RAPIDO.md](INICIO_RAPIDO.md) (2 minutos)  
**📖 Guia completo?** → [GUIA_LAN_COMPLETO.md](GUIA_LAN_COMPLETO.md)  
**📑 Ver todos os documentos?** → [DOCUMENTACAO.md](DOCUMENTACAO.md) (índice completo)

---

## 🎯 Funcionalidades Principais

- 📚 Sistema de cursos e trilhas de aprendizado
- 🎮 **Quiz Multiplayer em Tempo Real** via Socket.io
- 👥 Múltiplos jogadores na mesma rede LAN
- 📊 Leaderboard e pontuação em tempo real
- 👨‍🏫 Painel administrativo completo
- 🎨 Interface moderna e responsiva
- 🚫 **Filtro de Profanidade** para conteúdo apropriado (PT-BR)

## 🚀 Iniciar em Rede LAN (Recomendado)

### ⚡ Método Rápido (Windows):

**1. Primeiro, teste sua configuração:**
```bash
test-lan.bat
```

**2. Inicie em modo LAN:**
```bash
start-lan.bat
```

**3. Configure o Firewall (como Administrador):**
```bash
configure-firewall.bat
```

### 📋 O que os scripts fazem:

#### `test-lan.bat` 🆕
- ✅ Verifica MySQL rodando
- ✅ Verifica Node.js instalado
- ✅ Testa configuração de rede
- ✅ Valida firewall
- ✅ Gera relatório completo

#### `start-lan.bat` ✨
- ✅ Detecta automaticamente o IP da sua máquina
- ✅ Faz backup das configurações atuais 🆕
- ✅ Verifica se MySQL está rodando 🆕
- ✅ Configura backend e frontend
- ✅ Instala dependências
- ✅ Inicia os servidores

#### `start-lan-manual.bat`
- ✅ Mostra todos os IPs disponíveis
- ✅ Permite escolher manualmente
- ✅ Ideal para múltiplos adaptadores de rede

#### `stop-lan.bat` 🆕
- ✅ Reverte configurações para localhost
- ✅ Restaura backups automaticamente
- ✅ Volta ao modo de desenvolvimento local

### Acessar de Outros Dispositivos:

```
http://SEU_IP:3000
```

Exemplo: `http://192.168.1.100:3000`

> **💡 Dica:** Se você reiniciar o computador ou trocar de rede, o IP pode mudar.  
> Execute `test-lan.bat` para ver o IP atual.

## 📖 Documentação

- **[GUIA_LAN_COMPLETO.md](GUIA_LAN_COMPLETO.md)** - Guia completo e único para LAN e Quizzes
- **[FILTRO_PROFANIDADE.md](FILTRO_PROFANIDADE.md)** - Sistema de filtro de conteúdo inapropriado

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
│   ├── utils/               # Utilitários (filtro de profanidade)
│   ├── .env                 # Configurações do backend
│   ├── .env.backup         # Backup automático 🆕
│   └── uploads/             # Arquivos enviados
│
├── frontend/                # Interface React
│   ├── src/
│   │   ├── components/      # Componentes reutilizáveis
│   │   ├── pages/           # Páginas da aplicação
│   │   ├── services/        # API e Socket.io
│   │   └── contexts/        # Contextos React
│   ├── public/              # Recursos estáticos
│   ├── .env                 # Configurações do frontend
│   └── .env.backup         # Backup automático 🆕
│
├── 🆕 Scripts Windows (melhorados):
├── test-lan.bat            # 🆕 Testar e diagnosticar configuração
├── start-lan.bat           # ✨ Iniciar LAN (automático, melhorado)
├── start-lan-manual.bat    # Iniciar LAN (escolha manual de IP)
├── stop-lan.bat            # 🆕 Voltar ao modo localhost
├── configure-firewall.bat  # Configurar firewall do Windows
│
└── 📖 Documentação:
    ├── GUIA_LAN_COMPLETO.md # 🆕 Guia profissional completo
    ├── FILTRO_PROFANIDADE.md # Sistema de moderação
    └── README.md            # Este arquivo
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

## 🚫 Filtro de Profanidade

Sistema de moderação automática de conteúdo com suporte para **Português (PT-BR)**.

### Onde está ativo:
- ✅ Títulos e descrições de quizzes
- ✅ Perguntas e explicações
- ✅ Nicknames temporários no multiplayer

### Recursos:
- 🇧🇷 Lista robusta de palavras ofensivas em PT-BR
- 🔍 Detecta variações e leet speak
- 📝 Logs automáticos de tentativas
- ⚡ Zero impacto na performance

📖 **Documentação:** [FILTRO_PROFANIDADE.md](FILTRO_PROFANIDADE.md)

## 🔒 Segurança

⚠️ **Importante:** A configuração atual é ideal para uso em **rede local privada**.

Para uso em produção/Internet:
- Configure HTTPS com certificado SSL
- Use JWT_SECRET complexo
- Implemente rate limiting
- Configure CORS adequadamente
- Mantenha dependências atualizadas

## 🐛 Solução de Problemas

### 🆕 Primeiro Passo - Use o Diagnóstico Automático:
```bash
test-lan.bat
```
Este script verifica automaticamente:
- ✅ MySQL rodando
- ✅ Node.js instalado
- ✅ Arquivos .env configurados
- ✅ Firewall liberado
- ✅ Conectividade de rede

### Não consigo acessar de outro dispositivo:
1. Execute `test-lan.bat` para diagnóstico
2. Execute `configure-firewall.bat` como administrador
3. Verifique se todos estão na mesma rede WiFi
4. Confirme o IP com `ipconfig` no terminal

### MySQL não está rodando:
1. Abra WAMP ou XAMPP
2. Clique em "Iniciar MySQL"
3. Aguarde o ícone ficar verde
4. Execute `start-lan.bat` novamente

### Socket.io não conecta:
1. Verifique o arquivo `frontend/.env`
2. Reinicie o frontend após alterar `.env`
3. Limpe cache do navegador (Ctrl+Shift+Del)
4. Verifique se o backend está rodando na porta 3001

### Quero voltar ao localhost:
```bash
stop-lan.bat
```
Escolha restaurar backup ou criar configuração localhost padrão.

### IP mudou após reiniciar:
```bash
# Execute novamente:
start-lan.bat
# Anote o novo IP e compartilhe com os usuários
```

### Quiz não aparece:
1. O quiz deve estar publicado (status: published)
2. O quiz deve ter perguntas cadastradas
3. Verifique no painel Admin → Quizzes

### 📖 Documentação Completa:
**[GUIA_LAN_COMPLETO.md](GUIA_LAN_COMPLETO.md)** - Troubleshooting detalhado, FAQ e dicas avançadas

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

## 🎉 Novidades da Versão 2.0

### ✨ Sistema LAN Profissional
- 🆕 **Script de teste e diagnóstico** (`test-lan.bat`)
- 🆕 **Reversão para localhost** (`stop-lan.bat`)
- 🆕 **Backup automático** de configurações
- 🆕 **Validação de MySQL** antes de iniciar
- 🆕 **Detecção melhorada de IP** com múltiplos adaptadores
- 🆕 **FAQ e troubleshooting expandido**
- 🆕 **Guia profissional completo** atualizado

### 🔧 Melhorias Técnicas
- Validação automática de requisitos
- Mensagens de erro mais claras
- Sistema de backup/restore
- Diagnóstico automático de problemas
- Documentação profissional

---

**Desenvolvido para Green Mind Educational Platform**  
**Versão: 2.0.0 - Profissional** | Novembro 2025

🌿 **Educação + Sustentabilidade + Tecnologia** 🌿

---

### 📚 Links Rápidos
- 📖 **[GUIA_LAN_COMPLETO.md](GUIA_LAN_COMPLETO.md)** - Guia completo e profissional
- 🚫 **[FILTRO_PROFANIDADE.md](FILTRO_PROFANIDADE.md)** - Sistema de moderação
- 🐛 **Problemas?** Execute `test-lan.bat` primeiro!
