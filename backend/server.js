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
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
// Servir arquivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

// Configuração do multer para avatares
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `avatar_${req.user.id}${ext}`);
  }
});
const uploadAvatar = multer({ storage: avatarStorage });

// Configuração do multer para vídeos de aulas
const lessonVideoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/videos/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `lesson-${uniqueSuffix}${ext}`);
  }
});
const uploadLessonVideo = multer({ 
  storage: lessonVideoStorage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /mp4|avi|mov|wmv|flv|webm|mkv/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype) || file.mimetype.startsWith('video/');
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Apenas vídeos são permitidos (mp4, avi, mov, wmv, flv, webm, mkv)'));
  }
});

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

// Rota para remover privilégios de admin (apenas admin)
app.put('/api/admin/users/:userId/remove-admin', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Prevenir que o usuário remova seus próprios privilégios
    if (parseInt(userId) === req.user.id) {
      return res.status(400).json({ message: 'Você não pode remover seus próprios privilégios de administrador' });
    }
    
    await pool.execute(
      'UPDATE users SET is_admin = FALSE WHERE id = ?',
      [userId]
    );

    res.json({ message: 'Privilégios de administrador removidos com sucesso' });
  } catch (error) {
    console.error('Erro ao remover privilégios:', error);
    res.status(500).json({ message: 'Erro ao remover privilégios' });
  }
});

// Rota para deletar usuário (apenas admin)
app.delete('/api/admin/users/:userId', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Prevenir que o usuário delete a si mesmo
    if (parseInt(userId) === req.user.id) {
      return res.status(400).json({ message: 'Você não pode deletar sua própria conta' });
    }
    
    await pool.execute('DELETE FROM users WHERE id = ?', [userId]);

    res.json({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(500).json({ message: 'Erro ao deletar usuário' });
  }
});

// ========== ROTAS DE RELATÓRIOS ==========

// Estatísticas gerais do dashboard
app.get('/api/admin/statistics', authenticateToken, isAdmin, async (req, res) => {
  try {
    // Total de usuários
    const [usersCount] = await pool.execute('SELECT COUNT(*) as count FROM users');
    
    // Total de cursos
    const [coursesCount] = await pool.execute('SELECT COUNT(*) as count FROM courses');
    
    // Total de trilhas
    const [trailsCount] = await pool.execute('SELECT COUNT(*) as count FROM trails');
    
    // Total de aulas
    const [lessonsCount] = await pool.execute('SELECT COUNT(*) as count FROM lessons');
    
    // Usuários ativos (com progresso nos últimos 30 dias)
    const [activeUsers] = await pool.execute(`
      SELECT COUNT(DISTINCT user_id) as count 
      FROM user_course_progress 
      WHERE last_accessed_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    `);
    
    // Taxa de conclusão
    const [completionRate] = await pool.execute(`
      SELECT 
        ROUND((COUNT(CASE WHEN is_completed = TRUE THEN 1 END) * 100.0 / COUNT(*)), 2) as rate
      FROM user_course_progress
    `);

    res.json({
      totalUsers: usersCount[0].count,
      totalCourses: coursesCount[0].count,
      totalTrails: trailsCount[0].count,
      totalLessons: lessonsCount[0].count,
      activeUsers: activeUsers[0].count,
      completionRate: completionRate[0].rate || 0
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ message: 'Erro ao buscar estatísticas' });
  }
});

// Atividades recentes
app.get('/api/admin/recent-activities', authenticateToken, isAdmin, async (req, res) => {
  try {
    const [activities] = await pool.execute(`
      SELECT 
        u.name as user_name,
        u.avatar as user_avatar,
        c.title as course_title,
        ucp.last_accessed_at,
        ucp.is_completed,
        ucp.progress_percentage
      FROM user_course_progress ucp
      JOIN users u ON ucp.user_id = u.id
      JOIN courses c ON ucp.course_id = c.id
      ORDER BY ucp.last_accessed_at DESC
      LIMIT 10
    `);

    res.json({ activities });
  } catch (error) {
    console.error('Erro ao buscar atividades recentes:', error);
    res.status(500).json({ message: 'Erro ao buscar atividades recentes' });
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

// Criar nova trilha (apenas admin)
app.post('/api/trails', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { title, description, difficulty_level, duration_hours, image_url, status } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ message: 'Título e descrição são obrigatórios' });
    }

    const [result] = await pool.execute(
      `INSERT INTO trails (title, description, difficulty_level, duration_hours, image_url, status) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        title,
        description,
        difficulty_level || 'beginner',
        duration_hours || 10,
        image_url || null,
        status || 'published'
      ]
    );

    res.status(201).json({
      message: 'Trilha criada com sucesso',
      trailId: result.insertId
    });
  } catch (error) {
    console.error('Erro ao criar trilha:', error);
    res.status(500).json({ message: 'Erro ao criar trilha' });
  }
});

// Atualizar trilha (apenas admin)
app.put('/api/trails/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, difficulty_level, duration_hours, image_url, status } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ message: 'Título e descrição são obrigatórios' });
    }

    await pool.execute(
      `UPDATE trails SET 
        title = ?,
        description = ?,
        difficulty_level = ?,
        duration_hours = ?,
        image_url = ?,
        status = ?,
        updated_at = NOW()
      WHERE id = ?`,
      [
        title,
        description,
        difficulty_level || 'beginner',
        duration_hours || 10,
        image_url || null,
        status || 'published',
        id
      ]
    );

    res.json({ message: 'Trilha atualizada com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar trilha:', error);
    res.status(500).json({ message: 'Erro ao atualizar trilha' });
  }
});

// Deletar trilha (apenas admin)
app.delete('/api/trails/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM trails WHERE id = ?', [id]);
    res.json({ message: 'Trilha deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar trilha:', error);
    res.status(500).json({ message: 'Erro ao deletar trilha' });
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

// Rota para obter as aulas de um curso específico (PÚBLICA - apenas publicadas)
app.get('/api/courses/:courseId/lessons', async (req, res) => {
  try {
    const { courseId } = req.params;

    // Buscar aulas publicadas do curso
    const [lessons] = await pool.execute(
      `SELECT id, course_id, title, description, content, video_url, 
              duration_minutes, sequence_order 
       FROM lessons 
       WHERE course_id = ? AND status = 'published'
       ORDER BY sequence_order ASC`,
      [courseId]
    );

    res.json({ lessons });
  } catch (error) {
    console.error('Erro ao buscar aulas do curso:', error);
    res.status(500).json({ message: 'Erro ao buscar aulas do curso' });
  }
});

// Rota ADMIN para obter TODAS as aulas de um curso (draft, published, archived)
app.get('/api/admin/courses/:courseId/lessons', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { courseId } = req.params;

    // Buscar TODAS as aulas do curso (sem filtro de status)
    const [lessons] = await pool.execute(
      `SELECT id, course_id, title, description, content, video_url, 
              duration_minutes, sequence_order, status, created_at, updated_at
       FROM lessons 
       WHERE course_id = ?
       ORDER BY sequence_order ASC`,
      [courseId]
    );

    console.log(`Admin buscando aulas do curso ${courseId}: encontradas ${lessons.length} aulas`);

    res.json({ lessons });
  } catch (error) {
    console.error('Erro ao buscar aulas do curso (admin):', error);
    res.status(500).json({ message: 'Erro ao buscar aulas do curso' });
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

// Configuração do multer para upload de imagens de cursos
const courseStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/courses/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `course_${Date.now()}${ext}`);
  }
});
const uploadCourse = multer({ 
  storage: courseStorage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Erro: Apenas imagens são permitidas!');
    }
  }
});

// Criar novo curso
app.post('/api/admin/courses', authenticateToken, isAdmin, uploadCourse.single('image'), async (req, res) => {
  try {
    const { 
      title, 
      description, 
      trail_id, 
      instructor, 
      duration_minutes, 
      difficulty_level,
      learning_objectives,
      is_free,
      price
    } = req.body;
    
    if (!title || !description || !trail_id) {
      return res.status(400).json({ message: 'Título, descrição e trilha são obrigatórios' });
    }

    const image_url = req.file ? `/uploads/courses/${req.file.filename}` : null;

    const [result] = await pool.execute(
      `INSERT INTO courses (
        title, description, trail_id, image_url, instructor, 
        duration_minutes, difficulty_level, learning_objectives,
        is_free, price, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', NOW())`,
      [
        title, 
        description, 
        trail_id,
        image_url,
        instructor || 'Green Mind Team',
        duration_minutes || 60,
        difficulty_level || 'beginner',
        learning_objectives,
        is_free !== undefined ? is_free : true,
        price || 0.00
      ]
    );

    res.status(201).json({ 
      message: 'Curso criado com sucesso',
      courseId: result.insertId 
    });
  } catch (error) {
    console.error('Erro ao criar curso:', error);
    res.status(500).json({ message: 'Erro ao criar curso' });
  }
});

// Editar curso existente
app.put('/api/admin/courses/:id', authenticateToken, isAdmin, uploadCourse.single('image'), async (req, res) => {
  try {
    const { 
      title, 
      description, 
      trail_id, 
      instructor, 
      duration_minutes, 
      difficulty_level,
      learning_objectives,
      is_free,
      price
    } = req.body;
    const { id } = req.params;
    
    if (!title || !description || !trail_id) {
      return res.status(400).json({ message: 'Título, descrição e trilha são obrigatórios' });
    }

    let updateQuery = `UPDATE courses SET 
      title = ?, 
      description = ?, 
      trail_id = ?,
      instructor = ?,
      duration_minutes = ?,
      difficulty_level = ?,
      learning_objectives = ?,
      is_free = ?,
      price = ?`;
    
    const params = [
      title, 
      description, 
      trail_id,
      instructor,
      duration_minutes,
      difficulty_level,
      learning_objectives,
      is_free,
      price
    ];

    if (req.file) {
      updateQuery += `, image_url = ?`;
      params.push(`/uploads/courses/${req.file.filename}`);
    }

    updateQuery += ` WHERE id = ?`;
    params.push(id);

    await pool.execute(updateQuery, params);

    res.json({ message: 'Curso atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar curso:', error);
    res.status(500).json({ message: 'Erro ao atualizar curso' });
  }
});

// Deletar curso
app.delete('/api/admin/courses/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM courses WHERE id = ?', [id]);
    res.json({ message: 'Curso deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar curso:', error);
    res.status(500).json({ message: 'Erro ao deletar curso' });
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

    console.log('Dados recebidos para criar aula:', req.body);

    // Validação básica - apenas campos essenciais
    if (!course_id || !title || !description) {
      return res.status(400).json({ message: 'Curso ID, título e descrição são obrigatórios' });
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
        content || description, // Se content não for fornecido, usa description
        video_url || null,
        duration_minutes || 30, // Valor padrão
        sequence_order || 1, // Valor padrão
        status || 'draft'
      ]
    );

    console.log('Aula criada com ID:', result.insertId);

    // Buscar a aula criada
    const [newLesson] = await pool.execute(
      'SELECT * FROM lessons WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({ 
      message: 'Aula criada com sucesso',
      lesson: newLesson[0] 
    });
  } catch (error) {
    console.error('Erro ao criar aula:', error);
    res.status(500).json({ 
      message: 'Erro ao criar aula',
      error: error.message 
    });
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

    console.log('Atualizando aula ID:', lessonId, 'com dados:', req.body);

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
        content || description, // Se content não for fornecido, usa description
        video_url || null,
        duration_minutes || 30,
        sequence_order || 1,
        status || 'draft',
        lessonId
      ]
    );

    console.log('Aula atualizada com sucesso');

    // Buscar a aula atualizada
    const [updatedLesson] = await pool.execute(
      'SELECT * FROM lessons WHERE id = ?',
      [lessonId]
    );

    res.json({ 
      message: 'Aula atualizada com sucesso',
      lesson: updatedLesson[0] 
    });
  } catch (error) {
    console.error('Erro ao atualizar aula:', error);
    res.status(500).json({ 
      message: 'Erro ao atualizar aula',
      error: error.message 
    });
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

    // Excluir aula (conteúdos serão deletados automaticamente via CASCADE)
    await pool.execute('DELETE FROM lessons WHERE id = ?', [lessonId]);

    res.json({ message: 'Aula excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir aula:', error);
    res.status(500).json({ message: 'Erro ao excluir aula' });
  }
});

// ========== ROTAS DE CONTEÚDOS DE AULAS ==========

// Listar conteúdos de uma aula
app.get('/api/lessons/:lessonId/contents', async (req, res) => {
  try {
    const { lessonId } = req.params;

    const [contents] = await pool.execute(
      `SELECT * FROM lesson_contents 
       WHERE lesson_id = ? 
       ORDER BY content_order ASC`,
      [lessonId]
    );

    // Converter exercise_options de JSON string para array
    const parsedContents = contents.map(content => {
      if (content.exercise_options) {
        try {
          // Se já é um array, manter como está
          if (Array.isArray(content.exercise_options)) {
            console.log('exercise_options já é array:', content.exercise_options);
          } else if (typeof content.exercise_options === 'string') {
            // Se é string, fazer parse
            console.log('Fazendo parse de exercise_options:', content.exercise_options);
            content.exercise_options = JSON.parse(content.exercise_options);
          }
        } catch (e) {
          console.error('Erro ao fazer parse de exercise_options:', e);
          content.exercise_options = [];
        }
      }
      console.log('Content retornado:', {
        id: content.id,
        title: content.title,
        type: content.content_type,
        exercise_type: content.exercise_type,
        options: content.exercise_options
      });
      return content;
    });

    res.json({ contents: parsedContents });
  } catch (error) {
    console.error('Erro ao buscar conteúdos:', error);
    res.status(500).json({ message: 'Erro ao buscar conteúdos' });
  }
});

// Criar conteúdo para uma aula (apenas admin)
app.post('/api/admin/lessons/:lessonId/contents', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { lessonId } = req.params;
    const {
      content_type,
      title,
      content_order,
      video_url,
      video_duration,
      text_content,
      exercise_type,
      exercise_question,
      exercise_options,
      exercise_correct_answer
    } = req.body;

    if (!content_type || !title) {
      return res.status(400).json({ message: 'Tipo de conteúdo e título são obrigatórios' });
    }

    // Verificar se a aula existe
    const [lessons] = await pool.execute(
      'SELECT id FROM lessons WHERE id = ?',
      [lessonId]
    );

    if (lessons.length === 0) {
      return res.status(404).json({ message: 'Aula não encontrada' });
    }

    // Inserir conteúdo
    const [result] = await pool.execute(
      `INSERT INTO lesson_contents (
        lesson_id, content_type, title, content_order,
        video_url, video_duration, text_content,
        exercise_type, exercise_question, exercise_options, exercise_correct_answer
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        lessonId,
        content_type,
        title,
        content_order || 0,
        video_url || null,
        video_duration || null,
        text_content || null,
        exercise_type || null,
        exercise_question || null,
        exercise_options ? JSON.stringify(exercise_options) : null,
        exercise_correct_answer || null
      ]
    );

    res.status(201).json({ 
      message: 'Conteúdo criado com sucesso',
      contentId: result.insertId 
    });
  } catch (error) {
    console.error('Erro ao criar conteúdo:', error);
    res.status(500).json({ message: 'Erro ao criar conteúdo' });
  }
});

// Atualizar conteúdo de aula (apenas admin)
app.put('/api/admin/lesson-contents/:contentId', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { contentId } = req.params;
    const {
      title,
      content_order,
      video_url,
      video_duration,
      text_content,
      exercise_type,
      exercise_question,
      exercise_options,
      exercise_correct_answer
    } = req.body;

    await pool.execute(
      `UPDATE lesson_contents SET
        title = ?,
        content_order = ?,
        video_url = ?,
        video_duration = ?,
        text_content = ?,
        exercise_type = ?,
        exercise_question = ?,
        exercise_options = ?,
        exercise_correct_answer = ?
      WHERE id = ?`,
      [
        title,
        content_order,
        video_url || null,
        video_duration || null,
        text_content || null,
        exercise_type || null,
        exercise_question || null,
        exercise_options ? JSON.stringify(exercise_options) : null,
        exercise_correct_answer || null,
        contentId
      ]
    );

    res.json({ message: 'Conteúdo atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar conteúdo:', error);
    res.status(500).json({ message: 'Erro ao atualizar conteúdo' });
  }
});

// Deletar conteúdo de aula (apenas admin)
app.delete('/api/admin/lesson-contents/:contentId', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { contentId } = req.params;

    await pool.execute('DELETE FROM lesson_contents WHERE id = ?', [contentId]);

    res.json({ message: 'Conteúdo deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar conteúdo:', error);
    res.status(500).json({ message: 'Erro ao deletar conteúdo' });
  }
});

// Contar aulas por curso
app.get('/api/courses/:courseId/lessons/count', async (req, res) => {
  try {
    const { courseId } = req.params;

    const [result] = await pool.execute(
      'SELECT COUNT(*) as count FROM lessons WHERE course_id = ?',
      [courseId]
    );

    res.json({ count: result[0].count });
  } catch (error) {
    console.error('Erro ao contar aulas:', error);
    res.status(500).json({ message: 'Erro ao contar aulas' });
  }
});

// Rota para upload de avatar
app.put('/api/users/avatar', authenticateToken, uploadAvatar.single('avatar'), async (req, res) => {
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

// ========== ROTAS DE UPLOAD DE ARQUIVOS ==========

// Upload de imagem de curso (apenas admin)
app.post('/api/admin/upload/course-image', authenticateToken, isAdmin, (req, res) => {
  uploadCourse.single('image')(req, res, (err) => {
    if (err) {
      console.error('Erro no upload de imagem:', err);
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ message: 'Imagem muito grande. Tamanho máximo: 5MB' });
      }
      return res.status(400).json({ message: err.message || 'Erro ao fazer upload da imagem' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Nenhuma imagem enviada' });
    }

    const imageUrl = `http://localhost:3001/uploads/courses/${req.file.filename}`;
    
    console.log('Imagem enviada com sucesso:', {
      fileName: req.file.filename,
      size: req.file.size,
      url: imageUrl
    });

    res.json({ 
      message: 'Imagem enviada com sucesso',
      imageUrl: imageUrl,
      fileName: req.file.filename
    });
  });
});

// Upload de vídeo de aula (apenas admin)
app.post('/api/admin/upload/lesson-video', authenticateToken, isAdmin, (req, res) => {
  uploadLessonVideo.single('video')(req, res, (err) => {
    if (err) {
      console.error('Erro no upload de vídeo:', err);
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ message: 'Arquivo muito grande. Tamanho máximo: 500MB' });
      }
      return res.status(400).json({ message: err.message || 'Erro ao fazer upload do vídeo' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Nenhum vídeo enviado' });
    }

    const videoUrl = `http://localhost:3001/uploads/videos/${req.file.filename}`;
    
    console.log('Vídeo enviado com sucesso:', {
      fileName: req.file.filename,
      size: req.file.size,
      url: videoUrl
    });

    res.json({ 
      message: 'Vídeo enviado com sucesso',
      videoUrl: videoUrl,
      fileName: req.file.filename,
      fileSize: req.file.size
    });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});