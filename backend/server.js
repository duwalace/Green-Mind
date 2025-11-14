const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('./config/database');
const multer = require('multer');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const roomManager = require('./roomManager');
const os = require('os');

// Carregar variáveis de ambiente se existir .env
try {
  require('dotenv').config();
} catch (err) {
  console.log('dotenv não instalado ou .env não encontrado, usando valores padrão');
}

const app = express();

// Função para obter IP local da LAN
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Pular endereços internos e não-IPv4
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const localIP = getLocalIP();
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';
const JWT_SECRET = process.env.JWT_SECRET || 'seu_jwt_secret';

// Configurar origens permitidas para CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : [
      'http://localhost:3000',
      `http://${localIP}:3000`,
      'http://192.168.0.0/16' // Permitir toda a rede local 192.168.x.x
    ];

// CORS configurado para aceitar conexões da LAN
const corsOptions = {
  origin: function (origin, callback) {
    // Permitir requisições sem origin (como apps mobile ou Postman)
    if (!origin) return callback(null, true);
    
    // Permitir localhost
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    
    // Permitir IPs da rede local (192.168.x.x ou 10.x.x.x)
    if (origin.match(/http:\/\/(192\.168\.|10\.)/)) {
      return callback(null, true);
    }
    
    // Verificar lista de origens permitidas
    if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    callback(null, true); // Em desenvolvimento, permitir tudo
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

const server = http.createServer(app);
const io = new Server(server, {
  cors: corsOptions
});

app.use(cors(corsOptions));
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

// ========== ROTAS DE QUIZ ==========

// Listar todos os quizzes (público - apenas published)
app.get('/api/quizzes', async (req, res) => {
  try {
    const [quizzes] = await pool.execute(`
      SELECT q.*, 
             c.title as course_title,
             t.title as trail_title,
             u.name as created_by_name,
             (SELECT COUNT(*) FROM quiz_questions WHERE quiz_id = q.id) as total_questions
      FROM quizzes q
      LEFT JOIN courses c ON q.course_id = c.id
      LEFT JOIN trails t ON q.trail_id = t.id
      LEFT JOIN users u ON q.created_by = u.id
      WHERE q.status = 'published'
      ORDER BY q.created_at DESC
    `);
    res.json({ quizzes });
  } catch (error) {
    console.error('Erro ao listar quizzes:', error);
    res.status(500).json({ message: 'Erro ao listar quizzes' });
  }
});

// Obter quiz específico com perguntas (público)
app.get('/api/quizzes/:quizId', async (req, res) => {
  try {
    const { quizId } = req.params;
    
    const [quizzes] = await pool.execute(`
      SELECT q.*, 
             c.title as course_title,
             t.title as trail_title,
             u.name as created_by_name,
             (SELECT COUNT(*) FROM quiz_questions WHERE quiz_id = q.id) as total_questions
      FROM quizzes q
      LEFT JOIN courses c ON q.course_id = c.id
      LEFT JOIN trails t ON q.trail_id = t.id
      LEFT JOIN users u ON q.created_by = u.id
      WHERE q.id = ? AND q.status = 'published'
    `, [quizId]);

    if (quizzes.length === 0) {
      return res.status(404).json({ message: 'Quiz não encontrado' });
    }

    // Buscar perguntas (sem mostrar a resposta correta)
    const [questions] = await pool.execute(`
      SELECT id, quiz_id, question_text, question_type, image_url, 
             time_limit_seconds, points, sequence_order, options
      FROM quiz_questions
      WHERE quiz_id = ?
      ORDER BY sequence_order ASC
    `, [quizId]);

    // Parse JSON options
    const parsedQuestions = questions.map(q => ({
      ...q,
      options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options
    }));

    res.json({ 
      quiz: quizzes[0],
      questions: parsedQuestions
    });
  } catch (error) {
    console.error('Erro ao buscar quiz:', error);
    res.status(500).json({ message: 'Erro ao buscar quiz' });
  }
});

// Middleware opcional de autenticação (tenta autenticar, mas não falha se não houver token)
const optionalAuthenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = null;
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      req.user = null;
    } else {
      req.user = user;
    }
    next();
  });
};

// Iniciar tentativa de quiz (público - login opcional)
app.post('/api/quizzes/:quizId/start', optionalAuthenticateToken, async (req, res) => {
  try {
    const { quizId } = req.params;
    const { guestName } = req.body; // Nome do visitante não logado
    const userId = req.user ? req.user.id : null;

    // Verificar se o quiz existe
    const [quizzes] = await pool.execute(
      'SELECT id FROM quizzes WHERE id = ? AND status = "published"',
      [quizId]
    );

    if (quizzes.length === 0) {
      return res.status(404).json({ message: 'Quiz não encontrado' });
    }

    // Contar perguntas do quiz
    const [questions] = await pool.execute(
      'SELECT COUNT(*) as count FROM quiz_questions WHERE quiz_id = ?',
      [quizId]
    );

    // Criar tentativa (com ou sem usuário)
    const [result] = await pool.execute(`
      INSERT INTO quiz_attempts (quiz_id, user_id, guest_name, total_questions, started_at)
      VALUES (?, ?, ?, ?, NOW())
    `, [quizId, userId, guestName || null, questions[0].count]);

    res.status(201).json({
      message: 'Tentativa iniciada',
      attemptId: result.insertId,
      isGuest: !userId
    });
  } catch (error) {
    console.error('Erro ao iniciar quiz:', error);
    res.status(500).json({ message: 'Erro ao iniciar quiz' });
  }
});

// Submeter resposta de uma pergunta (público)
app.post('/api/quiz-attempts/:attemptId/answer', async (req, res) => {
  try {
    const { attemptId } = req.params;
    const { questionId, userAnswer, timeTaken } = req.body;

    // Verificar se a tentativa existe
    const [attempts] = await pool.execute(
      'SELECT * FROM quiz_attempts WHERE id = ?',
      [attemptId]
    );

    if (attempts.length === 0) {
      return res.status(404).json({ message: 'Tentativa não encontrada' });
    }

    // Buscar pergunta e resposta correta
    const [questions] = await pool.execute(
      'SELECT * FROM quiz_questions WHERE id = ?',
      [questionId]
    );

    if (questions.length === 0) {
      return res.status(404).json({ message: 'Pergunta não encontrada' });
    }

    const question = questions[0];
    const isCorrect = userAnswer.toString() === question.correct_answer.toString();
    const pointsEarned = isCorrect ? question.points : 0;

    // Salvar resposta
    await pool.execute(`
      INSERT INTO quiz_user_answers (attempt_id, question_id, user_answer, is_correct, time_taken_seconds, points_earned)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [attemptId, questionId, userAnswer, isCorrect, timeTaken, pointsEarned]);

    res.json({
      isCorrect,
      pointsEarned,
      correctAnswer: question.correct_answer,
      explanation: question.explanation
    });
  } catch (error) {
    console.error('Erro ao submeter resposta:', error);
    res.status(500).json({ message: 'Erro ao submeter resposta' });
  }
});

// Finalizar quiz e calcular pontuação (público)
app.post('/api/quiz-attempts/:attemptId/finish', async (req, res) => {
  try {
    const { attemptId } = req.params;
    const { totalTimeTaken } = req.body;

    // Verificar se a tentativa existe
    const [attempts] = await pool.execute(
      'SELECT qa.*, q.passing_score FROM quiz_attempts qa JOIN quizzes q ON qa.quiz_id = q.id WHERE qa.id = ?',
      [attemptId]
    );

    if (attempts.length === 0) {
      return res.status(404).json({ message: 'Tentativa não encontrada' });
    }

    const attempt = attempts[0];

    // Calcular estatísticas
    const [stats] = await pool.execute(`
      SELECT 
        COUNT(*) as total_answered,
        SUM(CASE WHEN is_correct = TRUE THEN 1 ELSE 0 END) as correct_answers,
        SUM(points_earned) as total_points
      FROM quiz_user_answers
      WHERE attempt_id = ?
    `, [attemptId]);

    const correctAnswers = stats[0].correct_answers || 0;
    const totalPoints = stats[0].total_points || 0;
    const totalQuestions = attempt.total_questions;
    const score = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
    const passed = score >= attempt.passing_score;

    // Atualizar tentativa
    await pool.execute(`
      UPDATE quiz_attempts 
      SET score = ?, 
          correct_answers = ?,
          time_taken_seconds = ?,
          passed = ?,
          completed_at = NOW()
      WHERE id = ?
    `, [score, correctAnswers, totalTimeTaken, passed, attemptId]);

    // Atualizar leaderboard apenas se for usuário autenticado
    if (attempt.user_id) {
      await pool.execute(`
        INSERT INTO quiz_leaderboard (quiz_id, user_id, best_score, best_time_seconds, total_attempts, last_attempt_at)
        VALUES (?, ?, ?, ?, 1, NOW())
        ON DUPLICATE KEY UPDATE
          best_score = IF(? > best_score, ?, best_score),
          best_time_seconds = IF(? > best_score OR (? = best_score AND ? < best_time_seconds), ?, best_time_seconds),
          total_attempts = total_attempts + 1,
          last_attempt_at = NOW()
      `, [
        attempt.quiz_id, 
        attempt.user_id, 
        score, 
        totalTimeTaken,
        score, score,
        score, score, totalTimeTaken, totalTimeTaken
      ]);
    }

    res.json({
      score,
      correctAnswers,
      totalQuestions,
      totalPoints,
      passed,
      timeTaken: totalTimeTaken,
      isGuest: !attempt.user_id
    });
  } catch (error) {
    console.error('Erro ao finalizar quiz:', error);
    res.status(500).json({ message: 'Erro ao finalizar quiz' });
  }
});

// Obter leaderboard de um quiz
app.get('/api/quizzes/:quizId/leaderboard', async (req, res) => {
  try {
    const { quizId } = req.params;
    const limit = parseInt(req.query.limit) || 10;

    const [leaderboard] = await pool.execute(`
      SELECT 
        l.best_score,
        l.best_time_seconds,
        l.total_attempts,
        l.last_attempt_at,
        u.name as user_name,
        u.avatar as user_avatar
      FROM quiz_leaderboard l
      JOIN users u ON l.user_id = u.id
      WHERE l.quiz_id = ?
      ORDER BY l.best_score DESC, l.best_time_seconds ASC
      LIMIT ?
    `, [quizId, limit]);

    res.json({ leaderboard });
  } catch (error) {
    console.error('Erro ao buscar leaderboard:', error);
    res.status(500).json({ message: 'Erro ao buscar leaderboard' });
  }
});

// Histórico de tentativas do usuário
app.get('/api/users/quiz-history', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const [history] = await pool.execute(`
      SELECT 
        qa.*,
        q.title as quiz_title,
        q.image_url as quiz_image
      FROM quiz_attempts qa
      JOIN quizzes q ON qa.quiz_id = q.id
      WHERE qa.user_id = ? AND qa.completed_at IS NOT NULL
      ORDER BY qa.completed_at DESC
    `, [userId]);

    res.json({ history });
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    res.status(500).json({ message: 'Erro ao buscar histórico' });
  }
});

// ========== ROTAS DE CRIAÇÃO DE QUIZ POR USUÁRIOS ==========

// Listar quizzes do usuário logado
app.get('/api/my-quizzes', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const [quizzes] = await pool.execute(`
      SELECT q.*, 
             c.title as course_title,
             t.title as trail_title,
             u.name as created_by_name,
             (SELECT COUNT(*) FROM quiz_questions WHERE quiz_id = q.id) as total_questions,
             (SELECT COUNT(*) FROM quiz_attempts WHERE quiz_id = q.id) as total_attempts
      FROM quizzes q
      LEFT JOIN courses c ON q.course_id = c.id
      LEFT JOIN trails t ON q.trail_id = t.id
      LEFT JOIN users u ON q.created_by = u.id
      WHERE q.created_by = ?
      ORDER BY q.created_at DESC
    `, [userId]);

    res.json({ quizzes });
  } catch (error) {
    console.error('Erro ao listar meus quizzes:', error);
    res.status(500).json({ message: 'Erro ao listar quizzes' });
  }
});

// Criar novo quiz (qualquer usuário autenticado)
app.post('/api/my-quizzes', authenticateToken, async (req, res) => {
  try {
    const {
      title,
      description,
      course_id,
      trail_id,
      image_url,
      difficulty_level,
      time_limit_seconds,
      points_per_question,
      passing_score,
      status
    } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Título é obrigatório' });
    }

    const [result] = await pool.execute(`
      INSERT INTO quizzes (
        title, description, course_id, trail_id, image_url,
        difficulty_level, time_limit_seconds, points_per_question,
        passing_score, status, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      title,
      description || null,
      course_id || null,
      trail_id || null,
      image_url || null,
      difficulty_level || 'beginner',
      time_limit_seconds || 300,
      points_per_question || 100,
      passing_score || 70.00,
      status || 'draft',
      req.user.id
    ]);

    res.status(201).json({
      message: 'Quiz criado com sucesso',
      quizId: result.insertId
    });
  } catch (error) {
    console.error('Erro ao criar quiz:', error);
    res.status(500).json({ message: 'Erro ao criar quiz' });
  }
});

// Obter quiz específico do usuário (para edição)
app.get('/api/my-quizzes/:quizId', authenticateToken, async (req, res) => {
  try {
    const { quizId } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.is_admin;

    // Buscar quiz (apenas se for do usuário ou se usuário for admin)
    const [quizzes] = await pool.execute(`
      SELECT q.*, 
             c.title as course_title,
             t.title as trail_title,
             u.name as created_by_name
      FROM quizzes q
      LEFT JOIN courses c ON q.course_id = c.id
      LEFT JOIN trails t ON q.trail_id = t.id
      LEFT JOIN users u ON q.created_by = u.id
      WHERE q.id = ? AND (q.created_by = ? OR ? = TRUE)
    `, [quizId, userId, isAdmin]);

    if (quizzes.length === 0) {
      return res.status(404).json({ message: 'Quiz não encontrado ou você não tem permissão' });
    }

    // Buscar perguntas (com resposta correta para edição)
    const [questions] = await pool.execute(`
      SELECT * FROM quiz_questions
      WHERE quiz_id = ?
      ORDER BY sequence_order ASC
    `, [quizId]);

    // Parse JSON options
    const parsedQuestions = questions.map(q => ({
      ...q,
      options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options
    }));

    res.json({ 
      quiz: quizzes[0],
      questions: parsedQuestions
    });
  } catch (error) {
    console.error('Erro ao buscar quiz:', error);
    res.status(500).json({ message: 'Erro ao buscar quiz' });
  }
});

// Atualizar quiz (apenas criador ou admin)
app.put('/api/my-quizzes/:quizId', authenticateToken, async (req, res) => {
  try {
    const { quizId } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.is_admin;

    // Verificar se o quiz pertence ao usuário ou se é admin
    const [quizzes] = await pool.execute(
      'SELECT * FROM quizzes WHERE id = ? AND (created_by = ? OR ? = TRUE)',
      [quizId, userId, isAdmin]
    );

    if (quizzes.length === 0) {
      return res.status(403).json({ message: 'Você não tem permissão para editar este quiz' });
    }

    const {
      title,
      description,
      course_id,
      trail_id,
      image_url,
      difficulty_level,
      time_limit_seconds,
      points_per_question,
      passing_score,
      status
    } = req.body;

    await pool.execute(`
      UPDATE quizzes SET
        title = ?,
        description = ?,
        course_id = ?,
        trail_id = ?,
        image_url = ?,
        difficulty_level = ?,
        time_limit_seconds = ?,
        points_per_question = ?,
        passing_score = ?,
        status = ?
      WHERE id = ?
    `, [
      title,
      description,
      course_id,
      trail_id,
      image_url,
      difficulty_level,
      time_limit_seconds,
      points_per_question,
      passing_score,
      status,
      quizId
    ]);

    res.json({ message: 'Quiz atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar quiz:', error);
    res.status(500).json({ message: 'Erro ao atualizar quiz' });
  }
});

// Deletar quiz (apenas criador ou admin)
app.delete('/api/my-quizzes/:quizId', authenticateToken, async (req, res) => {
  try {
    const { quizId } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.is_admin;

    // Verificar se o quiz pertence ao usuário ou se é admin
    const [quizzes] = await pool.execute(
      'SELECT * FROM quizzes WHERE id = ? AND (created_by = ? OR ? = TRUE)',
      [quizId, userId, isAdmin]
    );

    if (quizzes.length === 0) {
      return res.status(403).json({ message: 'Você não tem permissão para deletar este quiz' });
    }

    await pool.execute('DELETE FROM quizzes WHERE id = ?', [quizId]);
    res.json({ message: 'Quiz deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar quiz:', error);
    res.status(500).json({ message: 'Erro ao deletar quiz' });
  }
});

// Criar pergunta para quiz (apenas criador ou admin)
app.post('/api/my-quizzes/:quizId/questions', authenticateToken, async (req, res) => {
  try {
    const { quizId } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.is_admin;

    // Verificar se o quiz pertence ao usuário ou se é admin
    const [quizzes] = await pool.execute(
      'SELECT * FROM quizzes WHERE id = ? AND (created_by = ? OR ? = TRUE)',
      [quizId, userId, isAdmin]
    );

    if (quizzes.length === 0) {
      return res.status(403).json({ message: 'Você não tem permissão para adicionar perguntas a este quiz' });
    }

    const {
      question_text,
      question_type,
      image_url,
      time_limit_seconds,
      points,
      sequence_order,
      options,
      correct_answer,
      explanation
    } = req.body;

    if (!question_text || !correct_answer) {
      return res.status(400).json({ message: 'Pergunta e resposta correta são obrigatórios' });
    }

    const [result] = await pool.execute(`
      INSERT INTO quiz_questions (
        quiz_id, question_text, question_type, image_url,
        time_limit_seconds, points, sequence_order,
        options, correct_answer, explanation
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      quizId,
      question_text,
      question_type || 'multiple_choice',
      image_url || null,
      time_limit_seconds || 30,
      points || 100,
      sequence_order || 0,
      options ? JSON.stringify(options) : null,
      correct_answer,
      explanation || null
    ]);

    res.status(201).json({
      message: 'Pergunta criada com sucesso',
      questionId: result.insertId
    });
  } catch (error) {
    console.error('Erro ao criar pergunta:', error);
    res.status(500).json({ message: 'Erro ao criar pergunta' });
  }
});

// Atualizar pergunta (apenas criador ou admin)
app.put('/api/my-quizzes/:quizId/questions/:questionId', authenticateToken, async (req, res) => {
  try {
    const { quizId, questionId } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.is_admin;

    // Verificar se o quiz pertence ao usuário ou se é admin
    const [quizzes] = await pool.execute(
      'SELECT * FROM quizzes WHERE id = ? AND (created_by = ? OR ? = TRUE)',
      [quizId, userId, isAdmin]
    );

    if (quizzes.length === 0) {
      return res.status(403).json({ message: 'Você não tem permissão para editar perguntas deste quiz' });
    }

    const {
      question_text,
      question_type,
      image_url,
      time_limit_seconds,
      points,
      sequence_order,
      options,
      correct_answer,
      explanation
    } = req.body;

    await pool.execute(`
      UPDATE quiz_questions SET
        question_text = ?,
        question_type = ?,
        image_url = ?,
        time_limit_seconds = ?,
        points = ?,
        sequence_order = ?,
        options = ?,
        correct_answer = ?,
        explanation = ?
      WHERE id = ? AND quiz_id = ?
    `, [
      question_text,
      question_type,
      image_url,
      time_limit_seconds,
      points,
      sequence_order,
      options ? JSON.stringify(options) : null,
      correct_answer,
      explanation,
      questionId,
      quizId
    ]);

    res.json({ message: 'Pergunta atualizada com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar pergunta:', error);
    res.status(500).json({ message: 'Erro ao atualizar pergunta' });
  }
});

// Deletar pergunta (apenas criador ou admin)
app.delete('/api/my-quizzes/:quizId/questions/:questionId', authenticateToken, async (req, res) => {
  try {
    const { quizId, questionId } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.is_admin;

    // Verificar se o quiz pertence ao usuário ou se é admin
    const [quizzes] = await pool.execute(
      'SELECT * FROM quizzes WHERE id = ? AND (created_by = ? OR ? = TRUE)',
      [quizId, userId, isAdmin]
    );

    if (quizzes.length === 0) {
      return res.status(403).json({ message: 'Você não tem permissão para deletar perguntas deste quiz' });
    }

    await pool.execute('DELETE FROM quiz_questions WHERE id = ? AND quiz_id = ?', [questionId, quizId]);
    res.json({ message: 'Pergunta deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar pergunta:', error);
    res.status(500).json({ message: 'Erro ao deletar pergunta' });
  }
});

// ========== ROTAS ADMIN DE QUIZ ==========

// Listar TODOS os quizzes (admin)
app.get('/api/admin/quizzes', authenticateToken, isAdmin, async (req, res) => {
  try {
    const [quizzes] = await pool.execute(`
      SELECT q.*, 
             c.title as course_title,
             t.title as trail_title,
             u.name as created_by_name,
             (SELECT COUNT(*) FROM quiz_questions WHERE quiz_id = q.id) as total_questions,
             (SELECT COUNT(*) FROM quiz_attempts WHERE quiz_id = q.id) as total_attempts
      FROM quizzes q
      LEFT JOIN courses c ON q.course_id = c.id
      LEFT JOIN trails t ON q.trail_id = t.id
      LEFT JOIN users u ON q.created_by = u.id
      ORDER BY q.created_at DESC
    `);
    res.json({ quizzes });
  } catch (error) {
    console.error('Erro ao listar quizzes (admin):', error);
    res.status(500).json({ message: 'Erro ao listar quizzes' });
  }
});

// Criar novo quiz (admin)
app.post('/api/admin/quizzes', authenticateToken, isAdmin, async (req, res) => {
  try {
    const {
      title,
      description,
      course_id,
      trail_id,
      image_url,
      difficulty_level,
      time_limit_seconds,
      points_per_question,
      passing_score,
      status
    } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Título é obrigatório' });
    }

    const [result] = await pool.execute(`
      INSERT INTO quizzes (
        title, description, course_id, trail_id, image_url,
        difficulty_level, time_limit_seconds, points_per_question,
        passing_score, status, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      title,
      description || null,
      course_id || null,
      trail_id || null,
      image_url || null,
      difficulty_level || 'beginner',
      time_limit_seconds || 300,
      points_per_question || 100,
      passing_score || 70.00,
      status || 'draft',
      req.user.id
    ]);

    res.status(201).json({
      message: 'Quiz criado com sucesso',
      quizId: result.insertId
    });
  } catch (error) {
    console.error('Erro ao criar quiz:', error);
    res.status(500).json({ message: 'Erro ao criar quiz' });
  }
});

// Atualizar quiz (admin)
app.put('/api/admin/quizzes/:quizId', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { quizId } = req.params;
    const {
      title,
      description,
      course_id,
      trail_id,
      image_url,
      difficulty_level,
      time_limit_seconds,
      points_per_question,
      passing_score,
      status
    } = req.body;

    await pool.execute(`
      UPDATE quizzes SET
        title = ?,
        description = ?,
        course_id = ?,
        trail_id = ?,
        image_url = ?,
        difficulty_level = ?,
        time_limit_seconds = ?,
        points_per_question = ?,
        passing_score = ?,
        status = ?
      WHERE id = ?
    `, [
      title,
      description,
      course_id,
      trail_id,
      image_url,
      difficulty_level,
      time_limit_seconds,
      points_per_question,
      passing_score,
      status,
      quizId
    ]);

    res.json({ message: 'Quiz atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar quiz:', error);
    res.status(500).json({ message: 'Erro ao atualizar quiz' });
  }
});

// Deletar quiz (admin)
app.delete('/api/admin/quizzes/:quizId', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { quizId } = req.params;
    await pool.execute('DELETE FROM quizzes WHERE id = ?', [quizId]);
    res.json({ message: 'Quiz deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar quiz:', error);
    res.status(500).json({ message: 'Erro ao deletar quiz' });
  }
});

// Criar pergunta para quiz (admin)
app.post('/api/admin/quizzes/:quizId/questions', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { quizId } = req.params;
    const {
      question_text,
      question_type,
      image_url,
      time_limit_seconds,
      points,
      sequence_order,
      options,
      correct_answer,
      explanation
    } = req.body;

    if (!question_text || !correct_answer) {
      return res.status(400).json({ message: 'Pergunta e resposta correta são obrigatórios' });
    }

    const [result] = await pool.execute(`
      INSERT INTO quiz_questions (
        quiz_id, question_text, question_type, image_url,
        time_limit_seconds, points, sequence_order,
        options, correct_answer, explanation
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      quizId,
      question_text,
      question_type || 'multiple_choice',
      image_url || null,
      time_limit_seconds || 30,
      points || 100,
      sequence_order || 0,
      options ? JSON.stringify(options) : null,
      correct_answer,
      explanation || null
    ]);

    res.status(201).json({
      message: 'Pergunta criada com sucesso',
      questionId: result.insertId
    });
  } catch (error) {
    console.error('Erro ao criar pergunta:', error);
    res.status(500).json({ message: 'Erro ao criar pergunta' });
  }
});

// Atualizar pergunta (admin)
app.put('/api/admin/quiz-questions/:questionId', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { questionId } = req.params;
    const {
      question_text,
      question_type,
      image_url,
      time_limit_seconds,
      points,
      sequence_order,
      options,
      correct_answer,
      explanation
    } = req.body;

    await pool.execute(`
      UPDATE quiz_questions SET
        question_text = ?,
        question_type = ?,
        image_url = ?,
        time_limit_seconds = ?,
        points = ?,
        sequence_order = ?,
        options = ?,
        correct_answer = ?,
        explanation = ?
      WHERE id = ?
    `, [
      question_text,
      question_type,
      image_url,
      time_limit_seconds,
      points,
      sequence_order,
      options ? JSON.stringify(options) : null,
      correct_answer,
      explanation,
      questionId
    ]);

    res.json({ message: 'Pergunta atualizada com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar pergunta:', error);
    res.status(500).json({ message: 'Erro ao atualizar pergunta' });
  }
});

// Deletar pergunta (admin)
app.delete('/api/admin/quiz-questions/:questionId', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { questionId } = req.params;
    await pool.execute('DELETE FROM quiz_questions WHERE id = ?', [questionId]);
    res.json({ message: 'Pergunta deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar pergunta:', error);
    res.status(500).json({ message: 'Erro ao deletar pergunta' });
  }
});

// Obter perguntas de um quiz com respostas (admin)
app.get('/api/admin/quizzes/:quizId/questions', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { quizId } = req.params;

    const [questions] = await pool.execute(`
      SELECT * FROM quiz_questions
      WHERE quiz_id = ?
      ORDER BY sequence_order ASC
    `, [quizId]);

    // Parse JSON options
    const parsedQuestions = questions.map(q => ({
      ...q,
      options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options
    }));

    res.json({ questions: parsedQuestions });
  } catch (error) {
    console.error('Erro ao buscar perguntas:', error);
    res.status(500).json({ message: 'Erro ao buscar perguntas' });
  }
});

// Estatísticas de um quiz (admin)
app.get('/api/admin/quizzes/:quizId/statistics', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { quizId } = req.params;

    const [stats] = await pool.execute(`
      SELECT 
        COUNT(*) as total_attempts,
        AVG(score) as average_score,
        MAX(score) as highest_score,
        MIN(score) as lowest_score,
        SUM(CASE WHEN passed = TRUE THEN 1 ELSE 0 END) as total_passed,
        AVG(time_taken_seconds) as average_time
      FROM quiz_attempts
      WHERE quiz_id = ? AND completed_at IS NOT NULL
    `, [quizId]);

    res.json({ statistics: stats[0] });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ message: 'Erro ao buscar estatísticas' });
  }
});

// ========== ROTAS DE SALAS MULTIPLAYER ==========

// Criar sala multiplayer (apenas usuários autenticados)
app.post('/api/multiplayer/create-room', authenticateToken, async (req, res) => {
  try {
    const { quizId } = req.body;

    if (!quizId) {
      return res.status(400).json({ message: 'Quiz ID é obrigatório' });
    }

    // Buscar dados do quiz
    const [quizzes] = await pool.execute(`
      SELECT q.*, u.name as created_by_name
      FROM quizzes q
      LEFT JOIN users u ON q.created_by = u.id
      WHERE q.id = ? AND q.status = 'published'
    `, [quizId]);

    if (quizzes.length === 0) {
      return res.status(404).json({ message: 'Quiz não encontrado' });
    }

    // Buscar perguntas do quiz
    const [questions] = await pool.execute(`
      SELECT id, quiz_id, question_text, question_type, image_url, 
             time_limit_seconds, points, sequence_order, options, correct_answer
      FROM quiz_questions
      WHERE quiz_id = ?
      ORDER BY sequence_order ASC
    `, [quizId]);

    // Parse JSON options
    const parsedQuestions = questions.map(q => ({
      ...q,
      options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options
    }));

    const quizData = {
      ...quizzes[0],
      questions: parsedQuestions
    };

    // Buscar dados do usuário
    const [users] = await pool.execute(
      'SELECT id, name, avatar FROM users WHERE id = ?',
      [req.user.id]
    );

    const hostData = {
      userId: req.user.id,
      name: users[0].name,
      avatar: users[0].avatar
    };

    res.json({
      message: 'Conecte-se via Socket.io para criar a sala',
      quizId,
      hostData
    });
  } catch (error) {
    console.error('Erro ao preparar sala:', error);
    res.status(500).json({ message: 'Erro ao preparar sala' });
  }
});

// Verificar se sala existe
app.get('/api/multiplayer/room/:roomCode', (req, res) => {
  try {
    const { roomCode } = req.params;
    const exists = roomManager.roomExists(roomCode);

    if (!exists) {
      return res.status(404).json({ message: 'Sala não encontrada' });
    }

    const room = roomManager.getRoom(roomCode);
    const publicData = roomManager.getRoomPublicData(room);

    res.json({ room: publicData });
  } catch (error) {
    console.error('Erro ao verificar sala:', error);
    res.status(500).json({ message: 'Erro ao verificar sala' });
  }
});

// Estatísticas de salas
app.get('/api/multiplayer/stats', (req, res) => {
  try {
    const stats = roomManager.getStats();
    res.json(stats);
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ message: 'Erro ao buscar estatísticas' });
  }
});

// ========== SOCKET.IO - EVENTOS MULTIPLAYER ==========

// Middleware para verificar IP da mesma LAN
const checkSameLAN = (socket, next) => {
  const clientIP = socket.handshake.address;
  console.log('Cliente conectando de:', clientIP);
  
  // Aceitar localhost e IPs privados
  const privateIPRegex = /^(127\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|192\.168\.)/;
  
  if (privateIPRegex.test(clientIP) || clientIP === '::1' || clientIP === '::ffff:127.0.0.1') {
    return next();
  }
  
  // Para produção, você pode adicionar lógica mais restritiva aqui
  return next();
};

io.use(checkSameLAN);

io.on('connection', (socket) => {
  console.log(`Socket conectado: ${socket.id}`);

  // HOST: Criar sala
  socket.on('create_room', async (data) => {
    try {
      const { quizId, hostData } = data;

      // Buscar dados do quiz com perguntas
      const [quizzes] = await pool.execute(`
        SELECT q.*, u.name as created_by_name
        FROM quizzes q
        LEFT JOIN users u ON q.created_by = u.id
        WHERE q.id = ? AND q.status = 'published'
      `, [quizId]);

      if (quizzes.length === 0) {
        socket.emit('error', { message: 'Quiz não encontrado' });
        return;
      }

      // Buscar perguntas
      const [questions] = await pool.execute(`
        SELECT id, quiz_id, question_text, question_type, image_url, 
               time_limit_seconds, points, sequence_order, options, correct_answer
        FROM quiz_questions
        WHERE quiz_id = ?
        ORDER BY sequence_order ASC
      `, [quizId]);

      const parsedQuestions = questions.map(q => ({
        ...q,
        options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options
      }));

      const quizData = {
        ...quizzes[0],
        questions: parsedQuestions
      };

      const room = roomManager.createRoom(socket.id, hostData, quizId, quizData);
      
      // Entrar na sala do Socket.io
      socket.join(room.code);
      
      socket.emit('room_created', {
        roomCode: room.code,
        room: roomManager.getRoomPublicData(room)
      });

      console.log(`Sala ${room.code} criada por ${hostData.name}`);
    } catch (error) {
      console.error('Erro ao criar sala:', error);
      socket.emit('error', { message: 'Erro ao criar sala' });
    }
  });

  // JOGADOR: Entrar na sala
  socket.on('join_room', (data) => {
    try {
      const { roomCode, playerData } = data;

      const result = roomManager.joinRoom(roomCode, socket.id, playerData);

      if (!result.success) {
        socket.emit('join_error', { message: result.error });
        return;
      }

      // Entrar na sala do Socket.io
      socket.join(roomCode);

      // Confirmar para o jogador
      socket.emit('room_joined', {
        playerId: result.playerId,
        room: result.room
      });

      // Notificar todos na sala
      io.to(roomCode).emit('player_joined', {
        player: {
          id: result.playerId,
          name: playerData.name,
          avatar: playerData.avatar
        },
        room: result.room
      });

      console.log(`${playerData.name} entrou na sala ${roomCode}`);
    } catch (error) {
      console.error('Erro ao entrar na sala:', error);
      socket.emit('error', { message: 'Erro ao entrar na sala' });
    }
  });

  // HOST: Iniciar jogo
  socket.on('start_game', (data) => {
    try {
      const { roomCode } = data;
      const playerData = roomManager.getPlayerData(socket.id);

      if (!playerData || !playerData.isHost) {
        socket.emit('error', { message: 'Apenas o host pode iniciar o jogo' });
        return;
      }

      const result = roomManager.startGame(roomCode);

      if (!result.success) {
        socket.emit('error', { message: result.error });
        return;
      }

      const room = roomManager.getRoom(roomCode);
      
      // Enviar primeira questão (sem resposta correta)
      const question = {
        ...room.quizData.questions[0],
        correct_answer: undefined // Não enviar resposta correta
      };

      io.to(roomCode).emit('game_started', {
        questionIndex: 0,
        question: question,
        totalQuestions: room.quizData.questions.length
      });

      console.log(`Jogo iniciado na sala ${roomCode}`);
    } catch (error) {
      console.error('Erro ao iniciar jogo:', error);
      socket.emit('error', { message: 'Erro ao iniciar jogo' });
    }
  });

  // JOGADOR: Submeter resposta
  socket.on('submit_answer', (data) => {
    try {
      const { roomCode, questionIndex, answer } = data;
      const playerData = roomManager.getPlayerData(socket.id);

      if (!playerData) {
        socket.emit('error', { message: 'Jogador não encontrado' });
        return;
      }

      const result = roomManager.submitAnswer(
        roomCode,
        playerData.playerId,
        questionIndex,
        answer
      );

      if (!result.success) {
        socket.emit('error', { message: result.error });
        return;
      }

      // Enviar resultado para o jogador
      socket.emit('answer_result', {
        isCorrect: result.isCorrect,
        points: result.points,
        totalScore: result.totalScore,
        correctAnswer: result.correctAnswer
      });

      // Notificar host sobre a resposta (sem revelar se está correta)
      const room = roomManager.getRoom(roomCode);
      const player = Array.from(room.players.values()).find(p => p.id === playerData.playerId);
      
      io.to(room.host.socketId).emit('player_answered', {
        playerId: playerData.playerId,
        playerName: player?.name
      });

      console.log(`Resposta submetida na sala ${roomCode}`);
    } catch (error) {
      console.error('Erro ao submeter resposta:', error);
      socket.emit('error', { message: 'Erro ao submeter resposta' });
    }
  });

  // HOST: Próxima questão
  socket.on('next_question', (data) => {
    try {
      const { roomCode } = data;
      const playerData = roomManager.getPlayerData(socket.id);

      if (!playerData || !playerData.isHost) {
        socket.emit('error', { message: 'Apenas o host pode avançar questões' });
        return;
      }

      const result = roomManager.nextQuestion(roomCode);

      if (!result.success) {
        socket.emit('error', { message: result.error });
        return;
      }

      const room = roomManager.getRoom(roomCode);

      if (result.finished) {
        // Jogo finalizado, enviar leaderboard
        const leaderboard = roomManager.getLeaderboard(roomCode);
        
        io.to(roomCode).emit('game_finished', {
          leaderboard: leaderboard
        });

        console.log(`Jogo finalizado na sala ${roomCode}`);
      } else {
        // Enviar próxima questão
        const question = {
          ...room.quizData.questions[result.questionIndex],
          correct_answer: undefined
        };

        io.to(roomCode).emit('next_question_started', {
          questionIndex: result.questionIndex,
          question: question,
          totalQuestions: room.quizData.questions.length
        });

        console.log(`Questão ${result.questionIndex} na sala ${roomCode}`);
      }
    } catch (error) {
      console.error('Erro ao avançar questão:', error);
      socket.emit('error', { message: 'Erro ao avançar questão' });
    }
  });

  // HOST: Mostrar leaderboard
  socket.on('show_leaderboard', (data) => {
    try {
      const { roomCode } = data;
      const leaderboard = roomManager.getLeaderboard(roomCode);
      
      io.to(roomCode).emit('leaderboard_update', {
        leaderboard: leaderboard
      });

      console.log(`Leaderboard atualizado na sala ${roomCode}`);
    } catch (error) {
      console.error('Erro ao mostrar leaderboard:', error);
      socket.emit('error', { message: 'Erro ao mostrar leaderboard' });
    }
  });

  // Sair da sala
  socket.on('leave_room', () => {
    handleDisconnect(socket);
  });

  // Desconexão
  socket.on('disconnect', () => {
    handleDisconnect(socket);
    console.log(`Socket desconectado: ${socket.id}`);
  });

  function handleDisconnect(socket) {
    const result = roomManager.leaveRoom(socket.id);
    
    if (result) {
      if (result.hostLeft) {
        // Host saiu, notificar todos e fechar sala
        io.to(result.roomCode).emit('room_closed', {
          message: 'O host encerrou a sala'
        });
        
        // Remover todos da sala
        io.in(result.roomCode).socketsLeave(result.roomCode);
      } else if (result.playerId) {
        // Jogador saiu, notificar sala
        const room = roomManager.getRoom(result.roomCode);
        if (room) {
          io.to(result.roomCode).emit('player_left', {
            playerId: result.playerId,
            room: roomManager.getRoomPublicData(room)
          });
        }
      }
    }
  }
});

server.listen(PORT, HOST, () => {
  console.log('\n🚀 Servidor Green Mind iniciado com sucesso!\n');
  console.log(`📍 Servidor rodando em:`);
  console.log(`   - Local:   http://localhost:${PORT}`);
  console.log(`   - Rede LAN: http://${localIP}:${PORT}`);
  console.log(`\n🔌 Socket.io habilitado para multiplayer`);
  console.log(`\n💡 Para acessar de outros dispositivos na LAN:`);
  console.log(`   1. Configure o frontend para usar: http://${localIP}:${PORT}`);
  console.log(`   2. Certifique-se de que o firewall permite conexões na porta ${PORT}`);
  console.log(`   3. Outros dispositivos devem estar na mesma rede WiFi/Ethernet\n`);
});