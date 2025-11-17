# 💾 Banco de Dados - Green Mind

Pasta contendo o script SQL completo para criação do banco de dados.

## 📝 Arquivo

### `db.sql`
Script SQL unificado e completo para criação do banco de dados Green Mind.

**Conteúdo:**
- ✅ Estrutura completa de todas as tabelas
- ✅ Sistema de cursos e aulas
- ✅ Sistema de quiz interativo (estilo Kahoot)
- ✅ Suporte a visitantes (guests) nos quizzes
- ✅ Sistema de progresso e certificados
- ✅ Dados iniciais (4 trilhas, 5 cursos, 3 quizzes)
- ✅ Usuário administrador padrão

## 🚀 Como Usar

### Opção 1: Via phpMyAdmin (Recomendado para WAMP/XAMPP)

1. Abra o phpMyAdmin (`http://localhost/phpmyadmin`)
2. Clique em "Importar" no menu superior
3. Escolha o arquivo `db.sql`
4. Clique em "Executar"

### Opção 2: Via Linha de Comando MySQL

```bash
# No terminal/prompt:
mysql -u root -p < database/db.sql
```

### Opção 3: Via MySQL Workbench

1. Abra o MySQL Workbench
2. Conecte ao servidor local
3. File → Run SQL Script
4. Selecione `db.sql`
5. Execute

## 🔐 Credenciais Padrão

Após executar o script, será criado um usuário administrador:

- **Email:** `adm@gmail.com`
- **Senha:** `123456`

⚠️ **IMPORTANTE:** Altere a senha após o primeiro login!

## 📊 Estrutura do Banco

### Tabelas Principais

#### Sistema de Usuários
- `users` - Usuários do sistema

#### Sistema de Trilhas e Cursos
- `trails` - Trilhas de aprendizado
- `courses` - Cursos
- `lessons` - Aulas
- `lesson_contents` - Conteúdos das aulas (vídeos, textos, exercícios)
- `levels` - Níveis das trilhas
- `questions` - Perguntas das trilhas
- `options` - Opções de resposta

#### Sistema de Progresso
- `user_progress` - Progresso nas trilhas
- `user_course_progress` - Progresso nos cursos
- `user_lesson_progress` - Progresso nas aulas
- `user_content_progress` - Progresso nos conteúdos
- `certificates` - Certificados emitidos

#### Sistema de Quiz Interativo
- `quizzes` - Quizzes disponíveis
- `quiz_questions` - Perguntas dos quizzes
- `quiz_attempts` - Tentativas de quizzes (suporta usuários e guests)
- `quiz_user_answers` - Respostas dos usuários
- `quiz_leaderboard` - Ranking/leaderboard

#### Outros
- `comments` - Comentários em cursos e aulas

## 📦 Dados Iniciais Incluídos

### Trilhas (4)
1. Água
2. Energia
3. Clima
4. Reciclagem

### Cursos (5)
1. Introdução à Sustentabilidade
2. Gestão de Resíduos
3. Energia Solar
4. Energia Eólica
5. Conservação de Espécies

### Quizzes (3)
1. Quiz de Sustentabilidade Básica (5 perguntas)
2. Energia Sustentável (3 perguntas)
3. Gestão de Resíduos e Reciclagem (3 perguntas)

## 🔄 Atualização do Banco

Para recriar o banco (⚠️ apaga todos os dados):

```sql
DROP DATABASE IF EXISTS green_mind;
-- Depois execute o db.sql novamente
```

## 📝 Backup

Recomenda-se fazer backup regular do banco:

```bash
# Criar backup
mysqldump -u root -p green_mind > backup_$(date +%Y%m%d).sql

# Restaurar backup
mysql -u root -p green_mind < backup_20250117.sql
```

## 🛠️ Troubleshooting

### Erro: "Table already exists"
**Solução:** O script usa `IF NOT EXISTS`, então pode executar múltiplas vezes sem problema.

### Erro: "Access denied"
**Solução:** Certifique-se de que o usuário MySQL tem permissões adequadas.

### Erro: "Database doesn't exist"
**Solução:** O script cria o banco automaticamente, mas certifique-se de ter permissão para criar databases.

---

**Green Mind Educational Platform**  
💾 Database Schema - Sistema Completo de Educação Sustentável

