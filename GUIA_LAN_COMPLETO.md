# 🌿 Green Mind - Guia Completo para LAN e Quizzes

Guia único e completo para configurar e usar o Green Mind em rede local (LAN) com suporte a quizzes multiplayer e criação colaborativa.

---

## 📋 Índice

1. [Início Rápido (3 Passos)](#-início-rápido-3-passos)
2. [Configuração Detalhada](#-configuração-detalhada)
3. [Sistema de Quizzes](#-sistema-de-quizzes)
4. [Quiz Multiplayer](#-quiz-multiplayer)
5. [Solução de Problemas](#-solução-de-problemas)
6. [Informações Importantes](#-informações-importantes)

---

## ⚡ Início Rápido (3 Passos)

### 1️⃣ Executar Script de Configuração

**No computador servidor (que vai hospedar o site):**

```bash
# Duplo clique no arquivo ou execute no terminal:
start-lan.bat
```

**O que o script faz:**
- ✅ Detecta automaticamente o IP da sua máquina
- ✅ Configura backend e frontend para LAN
- ✅ Instala dependências (se necessário)
- ✅ Inicia os servidores automaticamente

**📝 ANOTE O IP MOSTRADO!** Exemplo: `192.168.1.100`

### 2️⃣ Configurar Firewall

**Execute como Administrador:**

```bash
# Clique com botão direito → "Executar como administrador"
configure-firewall.bat
```

Isso permite conexões nas portas 3000 (frontend) e 3001 (backend).

### 3️⃣ Acessar de Outros Dispositivos

**No servidor:**
```
http://localhost:3000
```

**Nos outros dispositivos (celular, tablet, outro PC):**
```
http://192.168.1.100:3000  (use o IP do servidor)
```

> ⚠️ **IMPORTANTE:** 
> - O arquivo `.bat` só precisa ser executado **no servidor**
> - **Clientes não precisam executar nada** - apenas acessar pelo navegador
> - Todos os dispositivos devem estar na **mesma rede WiFi/Ethernet**

---

## 🔧 Configuração Detalhada

### Pré-requisitos

Antes de começar, certifique-se de ter:

1. **Node.js** instalado (versão 14 ou superior)
   - Download: https://nodejs.org/
2. **MySQL** instalado e rodando
   - WAMP, XAMPP, ou MySQL standalone
3. Todos os dispositivos conectados à **mesma rede WiFi/Ethernet**
4. **Firewall do Windows** configurado

### Configuração Manual (Se os scripts não funcionarem)

#### Passo 1: Descobrir seu IP Local

**No Windows:**
```bash
ipconfig
```

Procure por "IPv4 Address" na seção da sua placa de rede WiFi/Ethernet.
Exemplo: `192.168.1.100`

#### Passo 2: Configurar o Backend

1. Crie o arquivo `backend/.env`:

```env
# Configuração do Servidor
PORT=3001
HOST=0.0.0.0

# JWT Secret
JWT_SECRET=seu_jwt_secret

# Ambiente
NODE_ENV=development

# URLs permitidas para CORS
ALLOWED_ORIGINS=*

# Banco de Dados
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=green_mind
```

2. Instale as dependências:

```bash
cd backend
npm install
```

#### Passo 3: Configurar o Frontend

1. Crie o arquivo `frontend/.env` (substitua `SEU_IP` pelo IP real):

```env
REACT_APP_API_URL=http://SEU_IP:3001/api
REACT_APP_SOCKET_URL=http://SEU_IP:3001
```

Exemplo:
```env
REACT_APP_API_URL=http://192.168.1.100:3001/api
REACT_APP_SOCKET_URL=http://192.168.1.100:3001
```

2. Instale as dependências:

```bash
cd frontend
npm install
```

#### Passo 4: Iniciar os Servidores

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

---

## 🎮 Sistema de Quizzes

### 🆕 Novidades do Sistema 2.0

O sistema de quizzes foi completamente reformulado:

**Antes:**
- ❌ Apenas administradores podiam criar quizzes
- ❌ Login obrigatório para visualizar e fazer quizzes
- ❌ Visitantes não podiam participar

**Agora:**
- ✅ **Qualquer usuário logado** pode criar quizzes
- ✅ **Visitantes não logados** podem visualizar e fazer quizzes
- ✅ Quizzes criados por usuários são **públicos** e podem ser jogados por todos
- ✅ Sistema aberto e colaborativo

### Migração do Banco de Dados

**⚠️ IMPORTANTE: Execute este script SQL antes de usar!**

```bash
mysql -u root -p green_mind < db-quiz-guest-support.sql
```

**O que isso faz:**
- Adiciona suporte a visitantes não logados
- Permite que `user_id` seja NULL
- Adiciona campo `guest_name` para visitantes

### Como Criar um Quiz

1. **Faça login** no sistema
2. Clique no seu **avatar** → **"Meus Quizzes"**
3. Clique em **"Criar Novo Quiz"**
4. Preencha as informações:
   - Título (obrigatório)
   - Descrição
   - Dificuldade (Iniciante/Intermediário/Avançado)
   - Tempo limite (segundos)
   - Pontos por pergunta
   - Nota mínima para passar (%)
   - Status (Rascunho/Publicado/Arquivado)
5. Clique em **"Criar"**
6. **Adicione perguntas** ao quiz
7. **Publique** o quiz (status: "Publicado")
8. Agora **qualquer pessoa** pode jogar seu quiz!

### Como Jogar um Quiz

#### Como Visitante (Sem Login):

1. Acesse: `http://SEU_IP:3000/quizzes`
2. Escolha um quiz
3. Clique em "Jogar Quiz"
4. Responda as perguntas
5. Veja seu resultado!

**Limitações:**
- ❌ Não aparece no leaderboard
- ❌ Não salva histórico
- ❌ Não pode criar quizzes

#### Como Usuário Logado:

1. Faça login no sistema
2. Vá em "Quizzes"
3. Escolha um quiz
4. Clique em "Jogar Quiz"
5. Responda as perguntas
6. Veja seu resultado e posição no ranking!

**Vantagens:**
- ✅ Aparece no leaderboard
- ✅ Salva histórico de tentativas
- ✅ Pode criar quizzes ilimitados
- ✅ Gerencia seus próprios quizzes

---

## 🎯 Quiz Multiplayer

### Como Jogar Quiz Multiplayer na LAN

#### No Computador Host (Servidor):

1. Acesse `http://localhost:3000`
2. Faça login
3. Vá em **"Quizzes"** → Escolha um quiz
4. Clique em **"Modo Multiplayer"**
5. Clique em **"Criar Sala"**
6. **📢 COMPARTILHE O CÓDIGO DA SALA** (ex: `ABC123`)

#### Nos Outros Dispositivos (Jogadores):

1. Acesse `http://SEU_IP:3000` (use o IP do servidor)
2. Faça login ou registre-se
3. Vá em **"Quizzes"** → **"Entrar em Sala Multiplayer"**
4. Digite o código da sala: `ABC123`
5. Clique em **"Entrar"**
6. Aguarde o host iniciar o jogo
7. **🎉 Jogue e divirta-se!**

### Fluxo do Jogo Multiplayer

1. **Host cria sala** → Código gerado (ex: `ABC123`)
2. **Jogadores entram** → Digitem o código
3. **Host inicia** → Todos veem a primeira pergunta
4. **Jogadores respondem** → Em tempo real
5. **Resultado** → Aparece após cada pergunta
6. **Leaderboard** → Atualizado em tempo real
7. **Próxima pergunta** → Host avança
8. **Final** → Ranking final exibido

---

## 🛠️ Solução de Problemas

### ❌ Não consigo acessar de outro dispositivo

**Soluções:**

1. **Verifique o Firewall:**
   ```bash
   # Execute como Administrador:
   configure-firewall.bat
   ```

2. **Verifique se os dispositivos estão na mesma rede:**
   - Todos devem estar conectados ao mesmo WiFi
   - Ou conectados via cabo Ethernet no mesmo switch/roteador

3. **Desative temporariamente o Firewall para teste:**
   - Painel de Controle → Sistema e Segurança → Firewall do Windows
   - Desativar Firewall do Windows (apenas para teste!)

4. **Verifique se os servidores estão rodando:**
   - Backend deve mostrar: `Servidor rodando em: http://192.168.1.100:3001`
   - Frontend deve mostrar: `webpack compiled successfully`

### ❌ Socket.io não conecta

**Verifique:**

1. O arquivo `frontend/.env` está configurado corretamente?
   ```env
   REACT_APP_SOCKET_URL=http://SEU_IP:3001
   ```

2. O console do navegador mostra erros?
   - Pressione F12 → Aba "Console"
   - Procure por erros de conexão

3. Reinicie o frontend após alterar o `.env`:
   ```bash
   # Pare o servidor (Ctrl+C) e inicie novamente
   npm start
   ```

4. Limpe o cache do navegador:
   - Ctrl+Shift+Delete → Limpar cache

### ❌ Erro: "guest_name column not found"

**Solução:**

Execute a migração SQL novamente:
```bash
mysql -u root -p green_mind < db-quiz-guest-support.sql
```

### ❌ Erro: "Cors policy error"

**Solução:**

O backend já está configurado para aceitar todas as origens da LAN. Se ainda houver problemas:

1. Verifique o arquivo `backend/.env`:
   ```env
   ALLOWED_ORIGINS=*
   ```

2. Reinicie o backend

### ❌ Quiz não aparece na lista

**Verifique:**

1. O quiz está publicado? (status: "published")
2. Há perguntas cadastradas no quiz?
3. Faça login como administrador e verifique em "Admin" → "Quizzes"

### ❌ Erros ao iniciar

**Verifique:**

1. Certifique-se que o MySQL está rodando
2. Verifique as credenciais do banco em `backend/.env`
3. Execute: `npm install` (em backend e frontend)

---

## 📝 Informações Importantes

### ⚠️ Sobre o Uso em LAN

**Esta configuração é ideal para:**
- ✅ Redes domésticas
- ✅ Redes escolares/corporativas privadas
- ✅ Eventos locais
- ✅ Aulas e apresentações

**NÃO é recomendado para:**
- ❌ Exposição direta à Internet
- ❌ Redes públicas não confiáveis
- ❌ Produção sem medidas de segurança adequadas

### 💡 Dicas para Professores/Instrutores

1. **Prepare os quizzes antecipadamente** no painel administrativo
2. **Teste a conexão** antes da aula com alguns alunos
3. **Anote o IP do servidor** em um local visível
4. **Mantenha o servidor (computador host) ligado** durante toda a sessão
5. **Use um projetor** para mostrar o código da sala aos alunos

### 💡 Dicas para Eventos/Competições

1. **Configure um roteador dedicado** para evitar problemas com firewall corporativo
2. **Use um computador potente** como servidor para suportar muitos jogadores
3. **Crie salas separadas** para diferentes grupos
4. **Monitore o leaderboard** em uma tela grande

### 🔒 Segurança

**Para Produção:**

Se você deseja disponibilizar o sistema na Internet:

1. **Use HTTPS** com certificado válido
2. **Configure autenticação forte** e rate limiting
3. **Use variáveis de ambiente** seguras
4. **Mantenha o JWT_SECRET complexo** e secreto
5. **Atualize as dependências** regularmente
6. **Use um servidor dedicado** (VPS, Cloud)
7. **Configure firewall** adequadamente
8. **Faça backups regulares** do banco de dados

### 📊 Permissões do Sistema

**Visitante (Não Logado):**
- ✅ Ver lista de quizzes
- ✅ Jogar quizzes
- ✅ Ver resultados
- ❌ Aparecer no leaderboard
- ❌ Criar quizzes
- ❌ Salvar histórico

**Usuário Comum (Logado):**
- ✅ Ver lista de quizzes
- ✅ Jogar quizzes
- ✅ Ver resultados
- ✅ Aparecer no leaderboard
- ✅ Criar quizzes ilimitados
- ✅ Editar seus próprios quizzes
- ✅ Deletar seus próprios quizzes
- ✅ Salvar histórico
- ❌ Editar quizzes de outros

**Administrador:**
- ✅ TUDO que usuário comum pode
- ✅ Editar qualquer quiz
- ✅ Deletar qualquer quiz
- ✅ Ver estatísticas completas
- ✅ Gerenciar usuários

### 📂 Estrutura de Arquivos

```
Green-Mind/
├── start-lan.bat              → Script principal para iniciar em LAN
├── start-lan.ps1              → Script PowerShell (alternativa)
├── configure-firewall.bat     → Configura firewall do Windows
├── test-connection.bat        → Testa conexão entre dispositivos
├── GUIA_LAN_COMPLETO.md       → Este arquivo (guia completo)
│
├── backend/
│   ├── .env                   → Configurações do servidor (criado automaticamente)
│   └── server.js              → Servidor Node.js
│
├── frontend/
│   ├── .env                   → Configurações do frontend (criado automaticamente)
│   └── src/                   → Código React
│
└── db-quiz-guest-support.sql  → Script de migração do banco
```

### 🎯 Checklist de Configuração

**Antes de começar:**
- [ ] Node.js instalado
- [ ] MySQL instalado e rodando
- [ ] Todos os dispositivos na mesma rede
- [ ] Firewall configurado

**Configuração inicial:**
- [ ] Script `start-lan.bat` executado
- [ ] Script `configure-firewall.bat` executado (como admin)
- [ ] Migração SQL executada (`db-quiz-guest-support.sql`)
- [ ] IP do servidor anotado

**Teste básico:**
- [ ] Servidor acessa `http://localhost:3000`
- [ ] Outro dispositivo acessa `http://IP:3000`
- [ ] Consegue fazer login
- [ ] Consegue ver lista de quizzes

**Teste de quizzes:**
- [ ] Visitante consegue ver quizzes (sem login)
- [ ] Visitante consegue jogar quiz
- [ ] Usuário consegue criar quiz
- [ ] Usuário consegue editar próprio quiz
- [ ] Multiplayer funciona

---

## 📞 Suporte

Se você encontrar problemas não cobertos por este guia:

1. **Verifique os logs:**
   - Backend: Terminal onde rodou `npm start`
   - Frontend: Console do navegador (F12)

2. **Teste a conexão:**
   ```bash
   # Execute no servidor:
   test-connection.bat
   ```

3. **Consulte a documentação:**
   - Este arquivo (GUIA_LAN_COMPLETO.md)
   - README.md (documentação geral)

---

## 🎉 Conclusão

Agora você tem tudo que precisa para:

✅ Configurar o Green Mind em rede local  
✅ Permitir acesso de múltiplos dispositivos  
✅ Criar e jogar quizzes  
✅ Usar o modo multiplayer  
✅ Permitir visitantes sem login  

**Pronto para começar! 🚀**

---

**Desenvolvido para Green Mind Educational Platform**  
**Versão:** 2.0.0  
**Última atualização:** Novembro 2024

🌿 Educação + Sustentabilidade + Colaboração 🌿

