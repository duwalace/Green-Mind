-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS green_mind;
USE green_mind;

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  avatar TEXT,
  bio TEXT,
  location VARCHAR(100),
  occupation VARCHAR(100),
  level INT DEFAULT 1,
  xp INT DEFAULT 0,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de Trilhas (Trails)
CREATE TABLE IF NOT EXISTS trails (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(255),
    difficulty_level ENUM('beginner', 'intermediate', 'advanced') NOT NULL,
    duration_hours INT NOT NULL,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de Cursos (Courses)
CREATE TABLE IF NOT EXISTS courses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    trail_id INT,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(255),
    video_url VARCHAR(255),
    duration_minutes INT NOT NULL,
    difficulty_level ENUM('beginner', 'intermediate', 'advanced') NOT NULL,
    instructor VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) DEFAULT 0.00,
    is_free BOOLEAN DEFAULT true,
    sequence_order INT DEFAULT 0,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    prerequisites TEXT,
    learning_objectives TEXT,
    target_audience VARCHAR(255),
    content_type ENUM('video', 'article', 'quiz', 'mixed') DEFAULT 'mixed',
    total_lessons INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (trail_id) REFERENCES trails(id) ON DELETE SET NULL
);

-- Tabela de Aulas (Lessons)
CREATE TABLE IF NOT EXISTS lessons (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT,
    video_url VARCHAR(255),
    duration_minutes INT NOT NULL,
    sequence_order INT DEFAULT 0,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Tabela de níveis
CREATE TABLE IF NOT EXISTS levels (
  id INT AUTO_INCREMENT PRIMARY KEY,
  trail_id INT NOT NULL,
  level_number INT NOT NULL,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (trail_id) REFERENCES trails(id)
);

-- Tabela de perguntas
CREATE TABLE IF NOT EXISTS questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  level_id INT NOT NULL,
  question TEXT NOT NULL,
  correct_answer INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (level_id) REFERENCES levels(id)
);

-- Tabela de opções de resposta
CREATE TABLE IF NOT EXISTS options (
  id INT AUTO_INCREMENT PRIMARY KEY,
  question_id INT NOT NULL,
  option_text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (question_id) REFERENCES questions(id)
);

-- Tabela de progresso do usuário
CREATE TABLE IF NOT EXISTS user_progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  trail_id INT NOT NULL,
  level_id INT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  score INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (trail_id) REFERENCES trails(id),
  FOREIGN KEY (level_id) REFERENCES levels(id)
);

-- Tabela de Progresso do Usuário nos Cursos
CREATE TABLE IF NOT EXISTS user_course_progress (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    course_id INT NOT NULL,
    progress_percentage INT DEFAULT 0,
    is_completed BOOLEAN DEFAULT FALSE,
    last_accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Tabela de Progresso do Usuário nas Aulas
CREATE TABLE IF NOT EXISTS user_lesson_progress (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    lesson_id INT NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    watched_duration INT DEFAULT 0,
    last_accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
);

-- Tabela de Certificados
CREATE TABLE certificates (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    course_id INT NOT NULL,
    certificate_url VARCHAR(255),
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- Tabela de Comentários
CREATE TABLE comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    course_id INT NOT NULL,
    lesson_id INT,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (lesson_id) REFERENCES lessons(id)
);

-- Inserir trilhas iniciais
INSERT INTO trails (title, description, image_url, difficulty_level, duration_hours, status) VALUES
('Água', 'Aprenda sobre conservação de água, ciclo hidrológico e práticas sustentáveis.', '/images/trails/water.jpg', 'beginner', 20, 'published'),
('Energia', 'Descubra sobre fontes de energia renovável, eficiência energética e consumo consciente.', '/images/trails/energy.jpg', 'intermediate', 25, 'published'),
('Clima', 'Entenda sobre mudanças climáticas, efeito estufa e ações para mitigação.', '/images/trails/climate.jpg', 'intermediate', 30, 'published'),
('Reciclagem', 'Aprenda sobre separação de resíduos, compostagem e redução de lixo.', '/images/trails/recycling.jpg', 'beginner', 15, 'published');

-- Inserir usuário administrador padrão
DELETE FROM users WHERE email = 'adm@gmail.com';
INSERT INTO users (name, email, password, is_admin) VALUES ('Administrador', 'adm@gmail.com', '123456', TRUE);

-- Adicionar índices
ALTER TABLE user_progress ADD INDEX idx_user_trail (user_id, trail_id);
ALTER TABLE questions ADD INDEX idx_level (level_id);
ALTER TABLE courses ADD INDEX idx_trail_sequence (trail_id, sequence_order);
ALTER TABLE lessons ADD INDEX idx_course_sequence (course_id, sequence_order);

-- Inserir alguns cursos de exemplo
INSERT INTO courses (trail_id, title, description, image_url, video_url, duration_minutes, difficulty_level, instructor, price, is_free, sequence_order, status, learning_objectives, target_audience) VALUES
(1, 'Introdução à Sustentabilidade', 'Conceitos básicos de sustentabilidade e desenvolvimento sustentável', '/images/courses/intro-sustainability.jpg', 'https://example.com/video1', 60, 'beginner', 'Dr. Maria Silva', 0.00, true, 1, 'published', 'Compreender os princípios básicos da sustentabilidade', 'Iniciantes em sustentabilidade'),
(1, 'Gestão de Resíduos', 'Aprenda técnicas eficientes de gestão e reciclagem de resíduos', '/images/courses/waste-management.jpg', 'https://example.com/video2', 90, 'intermediate', 'Prof. João Santos', 49.90, false, 2, 'published', 'Aprender técnicas de gestão e reciclagem', 'Profissionais de gestão ambiental'),
(2, 'Energia Solar', 'Fundamentos e aplicações práticas da energia solar', '/images/courses/solar-energy.jpg', 'https://example.com/video3', 120, 'intermediate', 'Eng. Carlos Oliveira', 79.90, false, 1, 'published', 'Entender os fundamentos da energia solar', 'Engenheiros e técnicos'),
(2, 'Energia Eólica', 'Como a energia eólica está transformando o setor energético', '/images/courses/wind-energy.jpg', 'https://example.com/video4', 90, 'advanced', 'Dra. Ana Costa', 99.90, false, 2, 'published', 'Compreender a energia eólica e suas aplicações', 'Profissionais do setor energético'),
(3, 'Conservação de Espécies', 'Estratégias para preservação de espécies ameaçadas', '/images/courses/species-conservation.jpg', 'https://example.com/video5', 150, 'advanced', 'Dr. Pedro Mendes', 129.90, false, 1, 'published', 'Aprender estratégias de conservação', 'Biólogos e conservacionistas');
