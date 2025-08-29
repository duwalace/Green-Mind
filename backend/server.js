const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('./config/database');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = 'seu_jwt_secret';

app.use(cors());
app.use(express.json());

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// Middleware para verificar se é admin
const isAdmin = (req, res, next) => {
  if (!req.user.is_admin) {
    return res.status(403).json({ message: 'Acesso negado. Apenas administradores podem acessar este recurso.' });
  }
  next();
};

// Configuração do multer para salvar na pasta 'uploads'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Crie essa pasta na raiz do backend se não existir
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `avatar_${req.user.id}${ext}`);
  }
});
const upload = multer({ storage });

// Rota de registro
app.post('/api/auth/register', async (req, res) => {
  try {
    console.log('Recebendo requisição de registro:', { body: { ...req.body, password: '***' } });
    const { name, email, password, avatar } = req.body;

    // Validação básica
    if (!name || !email || !password) {
      console.log('Campos obrigatórios faltando:', { name: !!name, email: !!email, password: !!password });
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    if (password.length < 6) {
      console.log('Senha muito curta:', password.length);
      return res.status(400).json({ message: 'A senha deve ter pelo menos 6 caracteres' });
    }

    // Verificar se o email já existe
    console.log('Verificando email duplicado:', email);
    const [existingUsers] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      console.log('Email já cadastrado:', email);
      return res.status(400).json({ message: 'Email já cadastrado' });
    }

    // Hash da senha
    console.log('Gerando hash da senha');
    const hashedPassword = await bcrypt.hash(password, 10);

    // Inserir novo usuário
    console.log('Inserindo novo usuário');
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password, avatar, is_admin) VALUES (?, ?, ?, ?, FALSE)',
      [name, email, hashedPassword, avatar]
    );

    console.log('Usuário inserido com sucesso, ID:', result.insertId);

    // Gerar token
    const token = jwt.sign(
      { id: result.insertId, email, is_admin: false },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: result.insertId,
        name,
        email,
        avatar,
        is_admin: false
      }
    });
  } catch (error) {
    console.error('Erro detalhado no registro:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    res.status(500).json({ message: 'Erro ao registrar usuário' });
  }
});

// Rota de login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Tentativa de login:', { email, password: '***' });

    // Validação básica
    if (!email || !password) {
      console.log('Campos faltando:', { email: !!email, password: !!password });
      return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }

    // Buscar usuário
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    console.log('Usuário encontrado:', users.length > 0 ? 'Sim' : 'Não');

    if (users.length === 0) {
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }

    const user = users[0];

    // Verificar senha
    const validPassword = await bcrypt.compare(password, user.password);
    console.log('Senha válida:', validPassword ? 'Sim' : 'Não');

    if (!validPassword) {
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }

    // Gerar token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        is_admin: Boolean(user.is_admin)
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Login bem sucedido para:', email);

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        is_admin: Boolean(user.is_admin)
      }
    });
  } catch (error) {
    console.error('Erro detalhado no login:', error);
    res.status(500).json({ message: 'Erro ao fazer login' });
  }
});

// Rota de verificação de token
app.get('/api/auth/verify', authenticateToken, async (req, res) => {
  try {
    const [users] = await pool.execute(
      'SELECT id, name, email, avatar, bio, is_admin FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.json({ user: users[0] });
  } catch (error) {
    console.error('Erro na verificação:', error);
    res.status(500).json({ message: 'Erro ao verificar token' });
  }
});

// Rota para listar todos os usuários (apenas admin)
app.get('/api/admin/users', authenticateToken, isAdmin, async (req, res) => {
  try {
    const [users] = await pool.execute(
      'SELECT id, name, email, is_admin, created_at FROM users'
    );
    res.json({ users });
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({ message: 'Erro ao listar usuários' });
  }
});

// Rota para tornar um usuário admin (apenas admin)
app.put('/api/admin/users/:userId/make-admin', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    
    await pool.execute(
      'UPDATE users SET is_admin = TRUE WHERE id = ?',
      [userId]
    );

    res.json({ message: 'Usuário promovido a administrador com sucesso' });
  } catch (error) {
    console.error('Erro ao promover usuário:', error);
    res.status(500).json({ message: 'Erro ao promover usuário' });
  }
});

// Rota para listar todas as trilhas
app.get('/api/trails', async (req, res) => {
  try {
    const [trails] = await pool.execute(
      'SELECT * FROM trails ORDER BY created_at DESC'
    );
    res.json({ trails });
  } catch (error) {
    console.error('Erro ao listar trilhas:', error);
    res.status(500).json({ message: 'Erro ao listar trilhas' });
  }
});

// Rota para obter uma trilha específica com seus cursos
app.get('/api/trails/:trailId', async (req, res) => {
  try {
    const { trailId } = req.params;
    console.log('Buscando trilha com ID:', trailId);
    
    // Testar conexão com o banco
    try {
      const [testConnection] = await pool.execute('SELECT 1');
      console.log('Conexão com o banco OK:', testConnection);
    } catch (dbError) {
      console.error('Erro na conexão com o banco:', dbError);
      throw new Error('Erro na conexão com o banco de dados');
    }
    
    // Buscar a trilha
    const [trails] = await pool.execute(
      'SELECT * FROM trails WHERE id = ?',
      [trailId]
    );

    console.log('Resultado da busca da trilha:', trails);

    if (trails.length === 0) {
      console.log('Trilha não encontrada');
      return res.status(404).json({ message: 'Trilha não encontrada' });
    }

    // Buscar os cursos da trilha
    const [courses] = await pool.execute(
      'SELECT * FROM courses WHERE trail_id = ? ORDER BY created_at',
      [trailId]
    );

    console.log('Cursos encontrados:', courses);

    // Garante que price é sempre número
    const coursesFixed = courses.map(course => ({
      ...course,
      price: course.price !== null ? parseFloat(course.price) : 0
    }));

    res.json({
      trail: trails[0],
      courses: coursesFixed
    });
  } catch (error) {
    console.error('Erro detalhado ao buscar trilha:', error);
    res.status(500).json({ 
      message: 'Erro ao buscar trilha',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Rota para listar todos os cursos
app.get('/api/courses', async (req, res) => {
  try {
    const [courses] = await pool.execute(
      `SELECT c.*, t.title as trail_title 
       FROM courses c 
       LEFT JOIN trails t ON c.trail_id = t.id 
       ORDER BY c.created_at DESC`
    );
    res.json({ courses });
  } catch (error) {
    console.error('Erro ao listar cursos:', error);
    res.status(500).json({ message: 'Erro ao listar cursos' });
  }
});

// Rota para obter um curso específico
app.get('/api/courses/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const [courses] = await pool.execute(
      `SELECT c.*, t.title as trail_title 
       FROM courses c 
       LEFT JOIN trails t ON c.trail_id = t.id 
       WHERE c.id = ?`,
      [courseId]
    );

    if (courses.length === 0) {
      return res.status(404).json({ message: 'Curso não encontrado' });
    }

    res.json({ course: courses[0] });
  } catch (error) {
    console.error('Erro ao buscar curso:', error);
    res.status(500).json({ message: 'Erro ao buscar curso' });
  }
});

// Rota para obter o progresso do usuário em um curso
app.get('/api/courses/:courseId/progress', authenticateToken, async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const [progress] = await pool.execute(
      'SELECT * FROM user_course_progress WHERE user_id = ? AND course_id = ?',
      [userId, courseId]
    );

    res.json({ progress: progress[0] || null });
  } catch (error) {
    console.error('Erro ao buscar progresso:', error);
    res.status(500).json({ message: 'Erro ao buscar progresso' });
  }
});

// Criar novo curso
app.post('/api/courses', async (req, res) => {
  try {
    const { title, description, trail_id } = req.body;
    if (!title || !description || !trail_id) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }
    await pool.execute(
      'INSERT INTO courses (title, description, trail_id, created_at) VALUES (?, ?, ?, NOW())',
      [title, description, trail_id]
    );
    res.status(201).json({ message: 'Curso criado com sucesso' });
  } catch (error) {
    console.error('Erro ao criar curso:', error);
    res.status(500).json({ message: 'Erro ao criar curso' });
  }
});

// Editar curso existente
app.put('/api/courses/:id', async (req, res) => {
  try {
    const { title, description, trail_id } = req.body;
    const { id } = req.params;
    if (!title || !description || !trail_id) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }
    await pool.execute(
      'UPDATE courses SET title = ?, description = ?, trail_id = ? WHERE id = ?',
      [title, description, trail_id, id]
    );
    res.json({ message: 'Curso atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar curso:', error);
    res.status(500).json({ message: 'Erro ao atualizar curso' });
  }
});

// Rotas de gerenciamento de aulas
// Listar todas as aulas (apenas admin)
app.get('/api/admin/lessons', authenticateToken, isAdmin, async (req, res) => {
  try {
    const [lessons] = await pool.execute(`
      SELECT l.*, c.title as course_title 
      FROM lessons l
      LEFT JOIN courses c ON l.course_id = c.id
      ORDER BY l.sequence_order ASC
    `);
    res.json({ lessons });
  } catch (error) {
    console.error('Erro ao listar aulas:', error);
    res.status(500).json({ message: 'Erro ao listar aulas' });
  }
});

// Criar nova aula (apenas admin)
app.post('/api/admin/lessons', authenticateToken, isAdmin, async (req, res) => {
  try {
    const {
      course_id,
      title,
      description,
      content,
      video_url,
      duration_minutes,
      sequence_order,
      status
    } = req.body;

    // Validação básica
    if (!course_id || !title || !description || !content || !duration_minutes || !sequence_order) {
      return res.status(400).json({ message: 'Todos os campos obrigatórios devem ser preenchidos' });
    }

    // Verificar se o curso existe
    const [courses] = await pool.execute(
      'SELECT id FROM courses WHERE id = ?',
      [course_id]
    );

    if (courses.length === 0) {
      return res.status(404).json({ message: 'Curso não encontrado' });
    }

    // Inserir nova aula
    const [result] = await pool.execute(
      `INSERT INTO lessons (
        course_id, title, description, content, video_url,
        duration_minutes, sequence_order, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        course_id,
        title,
        description,
        content,
        video_url || null,
        duration_minutes,
        sequence_order,
        status || 'draft'
      ]
    );

    // Buscar a aula criada
    const [newLesson] = await pool.execute(
      'SELECT * FROM lessons WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({ lesson: newLesson[0] });
  } catch (error) {
    console.error('Erro ao criar aula:', error);
    res.status(500).json({ message: 'Erro ao criar aula' });
  }
});

// Atualizar aula (apenas admin)
app.put('/api/admin/lessons/:lessonId', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { lessonId } = req.params;
    const {
      title,
      description,
      content,
      video_url,
      duration_minutes,
      sequence_order,
      status
    } = req.body;

    // Verificar se a aula existe
    const [lessons] = await pool.execute(
      'SELECT id FROM lessons WHERE id = ?',
      [lessonId]
    );

    if (lessons.length === 0) {
      return res.status(404).json({ message: 'Aula não encontrada' });
    }

    // Atualizar aula
    await pool.execute(
      `UPDATE lessons SET
        title = ?,
        description = ?,
        content = ?,
        video_url = ?,
        duration_minutes = ?,
        sequence_order = ?,
        status = ?
      WHERE id = ?`,
      [
        title,
        description,
        content,
        video_url || null,
        duration_minutes,
        sequence_order,
        status,
        lessonId
      ]
    );

    // Buscar a aula atualizada
    const [updatedLesson] = await pool.execute(
      'SELECT * FROM lessons WHERE id = ?',
      [lessonId]
    );

    res.json({ lesson: updatedLesson[0] });
  } catch (error) {
    console.error('Erro ao atualizar aula:', error);
    res.status(500).json({ message: 'Erro ao atualizar aula' });
  }
});

// Excluir aula (apenas admin)
app.delete('/api/admin/lessons/:lessonId', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { lessonId } = req.params;

    // Verificar se a aula existe
    const [lessons] = await pool.execute(
      'SELECT id FROM lessons WHERE id = ?',
      [lessonId]
    );

    if (lessons.length === 0) {
      return res.status(404).json({ message: 'Aula não encontrada' });
    }

    // Excluir aula
    await pool.execute('DELETE FROM lessons WHERE id = ?', [lessonId]);

    res.json({ message: 'Aula excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir aula:', error);
    res.status(500).json({ message: 'Erro ao excluir aula' });
  }
});

// Rota para upload de avatar
app.put('/api/users/avatar', authenticateToken, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Nenhum arquivo enviado' });
    }

    const avatarUrl = `/uploads/${req.file.filename}`;
    
    // Atualizar o avatar do usuário no banco de dados
    await pool.execute(
      'UPDATE users SET avatar = ? WHERE id = ?',
      [avatarUrl, req.user.id]
    );

    // Buscar usuário atualizado
    const [users] = await pool.execute(
      'SELECT id, name, email, avatar, bio, is_admin FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.json({ 
      message: 'Avatar atualizado com sucesso',
      user: users[0]
    });
  } catch (error) {
    console.error('Erro ao atualizar avatar:', error);
    res.status(500).json({ message: 'Erro ao atualizar avatar' });
  }
});

// Rota para atualizar o perfil do usuário
app.put('/api/users/profile', authenticateToken, async (req, res) => {
  try {
    console.log('Recebendo requisição de atualização de perfil:', {
      userId: req.user.id,
      body: req.body
    });

    const { name, email, bio, location, occupation } = req.body;
    const userId = req.user.id;

    // Verificar se o email já está em uso por outro usuário
    if (email) {
      console.log('Verificando email duplicado:', email);
      const [existingUsers] = await pool.execute(
        'SELECT id FROM users WHERE email = ? AND id != ?',
        [email, userId]
      );

      if (existingUsers.length > 0) {
        console.log('Email já em uso por outro usuário');
        return res.status(400).json({ message: 'Este email já está em uso por outro usuário' });
      }
    }

    // Atualizar o perfil
    console.log('Atualizando perfil com os valores:', {
      name: name || 'não alterado',
      email: email || 'não alterado',
      bio: bio || 'não alterado',
      location: location || 'não alterado',
      occupation: occupation || 'não alterado'
    });

    const [result] = await pool.execute(
      `UPDATE users 
       SET name = COALESCE(?, name),
           email = COALESCE(?, email),
           bio = COALESCE(?, bio),
           location = COALESCE(?, location),
           occupation = COALESCE(?, occupation),
           updated_at = NOW()
       WHERE id = ?`,
      [name, email, bio, location, occupation, userId]
    );

    console.log('Resultado da atualização:', result);

    if (result.affectedRows === 0) {
      console.log('Usuário não encontrado:', userId);
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Buscar o usuário atualizado
    console.log('Buscando usuário atualizado');
    const [users] = await pool.execute(
      'SELECT id, name, email, avatar, bio, location, occupation, is_admin FROM users WHERE id = ?',
      [userId]
    );

    console.log('Usuário atualizado:', users[0]);

    res.json({ 
      message: 'Perfil atualizado com sucesso',
      user: users[0]
    });
  } catch (error) {
    console.error('Erro detalhado ao atualizar perfil:', {
      error: error.message,
      stack: error.stack,
      code: error.code
    });
    res.status(500).json({ 
      message: 'Erro ao atualizar perfil',
      error: error.message,
      code: error.code
    });
  }
});

// Servir arquivos estáticos da pasta uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});