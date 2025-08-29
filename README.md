<Route path="/dashboard">
  <Route index element={<PrivateRoute><Dashboard /></PrivateRoute>} />
  <Route path="*" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
</Route># 🌱 Green Mind - Plataforma Gamificada de Educação Ambiental

**Green Mind** é uma plataforma interativa de educação ambiental, com abordagem gamificada inspirada no Duolingo. Através de trilhas temáticas, os usuários podem aprender de forma leve e envolvente sobre assuntos como **Água**, **Energia**, **Clima** e **Reciclagem**.

---

## 🚀 Funcionalidades

- Autenticação de usuários (login e registro)
- Trilhas de aprendizado com níveis progressivos
- Quiz interativo com perguntas de múltipla escolha
- Sistema de progresso e conquistas
- Feedback instantâneo para respostas
- Interface moderna, acessível e responsiva
- Gamificação para maior engajamento do usuário

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- [React](https://reactjs.org/)
- [Material-UI](https://mui.com/)
- [React Router](https://reactrouter.com/)
- [Axios](https://axios-http.com/)
- [Framer Motion](https://www.framer.com/motion/)

### Backend
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [MySQL](https://www.mysql.com/)
- [JWT](https://jwt.io/) (JSON Web Token) para autenticação
- [Bcrypt](https://github.com/kelektiv/node.bcrypt.js) para hash de senhas

---

## 📦 Pré-requisitos

- Node.js (v14 ou superior)
- MySQL (v8 ou superior)
- XAMPP (ou similar) para ambiente de desenvolvimento local

---

## ⚙️ Instalação e Execução

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/green-mind.git
cd green-mind
2. Configure o banco de dados
Inicie o XAMPP e ative o serviço MySQL

Acesse o phpMyAdmin e importe o arquivo db.sql contido no projeto

3. Instale as dependências do backend
bash
Copiar
Editar
cd backend
npm install
4. Instale as dependências do frontend
bash
Copiar
Editar
cd ../frontend
npm install
5. Configure as variáveis de ambiente
Ajuste as credenciais de acesso ao banco em backend/config/database.js

Defina uma chave JWT no backend/server.js para a autenticação

▶️ Como Executar
Iniciar o backend:
bash
Copiar
Editar
cd backend
npm run dev
Iniciar o frontend (em outro terminal):
bash
Copiar
Editar
cd frontend
npm start
A aplicação estará disponível em: http://localhost:3000

📁 Estrutura de Diretórios
pgsql
Copiar
Editar
green-mind/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── contexts/
│   │   ├── services/
│   │   └── styles/
│   └── package.json
├── backend/
│   ├── config/
│   ├── routes/
│   └── server.js
└── db.sql
🤝 Contribuindo
Contribuições são bem-vindas! Para colaborar:

Faça um fork deste repositório

Crie uma nova branch com sua feature:

bash
Copiar
Editar
git checkout -b feature/nova-feature
Commit suas alterações:

bash
Copiar
Editar
git commit -m "Adiciona nova feature"
Envie para o seu repositório:

bash
Copiar
Editar
git push origin feature/nova-feature
Abra um Pull Request