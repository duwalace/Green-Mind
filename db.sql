-- ====================================================
-- GREEN MIND - BANCO DE DADOS COMPLETO E ATUALIZADO
-- Sistema de Cursos com Múltiplos Conteúdos por Aula
-- ====================================================

-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS green_mind;
USE green_mind;

-- ====================================================
-- TABELA DE USUÁRIOS
-- ====================================================
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================
-- TABELA DE TRILHAS (TRAILS)
-- ====================================================
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================
-- TABELA DE CURSOS (COURSES)
-- ====================================================
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
    FOREIGN KEY (trail_id) REFERENCES trails(id) ON DELETE SET NULL,
    INDEX idx_trail_sequence (trail_id, sequence_order),
    INDEX idx_difficulty (difficulty_level),
    INDEX idx_free (is_free)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================
-- TABELA DE AULAS (LESSONS)
-- ====================================================
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
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    INDEX idx_course_sequence (course_id, sequence_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================
-- TABELA DE CONTEÚDOS DE AULAS (LESSON CONTENTS)
-- Sistema de Múltiplos Conteúdos por Aula
-- ====================================================
CREATE TABLE IF NOT EXISTS lesson_contents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lesson_id INT NOT NULL,
    content_type ENUM('video', 'text', 'exercise') NOT NULL,
    title VARCHAR(255) NOT NULL,
    content_order INT NOT NULL DEFAULT 0,
    
    -- Campos específicos para vídeo
    video_url VARCHAR(500),
    video_duration INT,
    
    -- Campos específicos para texto
    text_content LONGTEXT,
    
    -- Campos específicos para exercício
    exercise_type ENUM('multiple_choice', 'text_answer', 'file_upload', 'code') DEFAULT 'text_answer',
    exercise_question TEXT,
    exercise_options JSON,
    exercise_correct_answer TEXT,
    exercise_file_url VARCHAR(500),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
    INDEX idx_lesson_content (lesson_id, content_order),
    INDEX idx_content_type (content_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================
-- TABELA DE NÍVEIS
-- ====================================================
CREATE TABLE IF NOT EXISTS levels (
  id INT AUTO_INCREMENT PRIMARY KEY,
  trail_id INT NOT NULL,
  level_number INT NOT NULL,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (trail_id) REFERENCES trails(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================
-- TABELA DE PERGUNTAS
-- ====================================================
CREATE TABLE IF NOT EXISTS questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  level_id INT NOT NULL,
  question TEXT NOT NULL,
  correct_answer INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (level_id) REFERENCES levels(id) ON DELETE CASCADE,
  INDEX idx_level (level_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================
-- TABELA DE OPÇÕES DE RESPOSTA
-- ====================================================
CREATE TABLE IF NOT EXISTS options (
  id INT AUTO_INCREMENT PRIMARY KEY,
  question_id INT NOT NULL,
  option_text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================
-- TABELA DE PROGRESSO DO USUÁRIO (TRILHAS)
-- ====================================================
CREATE TABLE IF NOT EXISTS user_progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  trail_id INT NOT NULL,
  level_id INT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  score INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (trail_id) REFERENCES trails(id) ON DELETE CASCADE,
  FOREIGN KEY (level_id) REFERENCES levels(id) ON DELETE CASCADE,
  INDEX idx_user_trail (user_id, trail_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================
-- TABELA DE PROGRESSO DO USUÁRIO NOS CURSOS
-- ====================================================
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
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_course (user_id, course_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================
-- TABELA DE PROGRESSO DO USUÁRIO NAS AULAS
-- ====================================================
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
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_lesson (user_id, lesson_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================
-- TABELA DE PROGRESSO EM CONTEÚDOS DE AULAS
-- ====================================================
CREATE TABLE IF NOT EXISTS user_content_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    lesson_content_id INT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP NULL,
    answer_text TEXT,
    answer_file_url VARCHAR(500),
    score DECIMAL(5,2),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_content_id) REFERENCES lesson_contents(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_content (user_id, lesson_content_id),
    INDEX idx_user_progress (user_id, completed)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================
-- TABELA DE CERTIFICADOS
-- ====================================================
CREATE TABLE IF NOT EXISTS certificates (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    course_id INT NOT NULL,
    certificate_url VARCHAR(255),
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE KEY unique_certificate (user_id, course_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================
-- TABELA DE COMENTÁRIOS
-- ====================================================
CREATE TABLE IF NOT EXISTS comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    course_id INT NOT NULL,
    lesson_id INT,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================
-- DADOS INICIAIS - TRILHAS
-- ====================================================
INSERT INTO trails (title, description, image_url, difficulty_level, duration_hours, status) VALUES
('Água', 'Aprenda sobre conservação de água, ciclo hidrológico e práticas sustentáveis.', '/images/trails/water.jpg', 'beginner', 20, 'published'),
('Energia', 'Descubra sobre fontes de energia renovável, eficiência energética e consumo consciente.', '/images/trails/energy.jpg', 'intermediate', 25, 'published'),
('Clima', 'Entenda sobre mudanças climáticas, efeito estufa e ações para mitigação.', '/images/trails/climate.jpg', 'intermediate', 30, 'published'),
('Reciclagem', 'Aprenda sobre separação de resíduos, compostagem e redução de lixo.', '/images/trails/recycling.jpg', 'beginner', 15, 'published');

-- ====================================================
-- DADOS INICIAIS - USUÁRIO ADMINISTRADOR
-- ====================================================
-- Senha padrão: 123456 (altere após o primeiro login!)
DELETE FROM users WHERE email = 'adm@gmail.com';
INSERT INTO users (name, email, password, is_admin) VALUES 
('Administrador', 'adm@gmail.com', '$2b$10$IsD0CXXUPOdvwmWWmOowHeevr96uvWK.THCfDbYzTOY06cfg6tqHW', TRUE);

-- ====================================================
-- DADOS INICIAIS - CURSOS DE EXEMPLO
-- ====================================================
INSERT INTO courses (trail_id, title, description, image_url, video_url, duration_minutes, difficulty_level, instructor, price, is_free, sequence_order, status, learning_objectives, target_audience) VALUES
(1, 'Introdução à Sustentabilidade', 'Conceitos básicos de sustentabilidade e desenvolvimento sustentável', '/images/courses/intro-sustainability.jpg', 'https://www.youtube.com/watch?v=example1', 60, 'beginner', 'Dr. Maria Silva', 0.00, true, 1, 'published', 'Compreender os princípios básicos da sustentabilidade\nIdentificar práticas sustentáveis no dia a dia\nAnalisar o impacto ambiental de ações cotidianas', 'Iniciantes em sustentabilidade'),
(1, 'Gestão de Resíduos', 'Aprenda técnicas eficientes de gestão e reciclagem de resíduos', '/images/courses/waste-management.jpg', 'https://www.youtube.com/watch?v=example2', 90, 'intermediate', 'Prof. João Santos', 49.90, false, 2, 'published', 'Aprender técnicas de gestão de resíduos\nImplementar sistemas de reciclagem\nReduzir desperdício em ambientes corporativos', 'Profissionais de gestão ambiental'),
(2, 'Energia Solar', 'Fundamentos e aplicações práticas da energia solar', '/images/courses/solar-energy.jpg', 'https://www.youtube.com/watch?v=example3', 120, 'intermediate', 'Eng. Carlos Oliveira', 79.90, false, 1, 'published', 'Entender os fundamentos da energia solar\nDimensionar sistemas fotovoltaicos\nCalcular viabilidade econômica', 'Engenheiros e técnicos'),
(2, 'Energia Eólica', 'Como a energia eólica está transformando o setor energético', '/images/courses/wind-energy.jpg', 'https://www.youtube.com/watch?v=example4', 90, 'advanced', 'Dra. Ana Costa', 99.90, false, 2, 'published', 'Compreender a energia eólica e suas aplicações\nAnalisar viabilidade de projetos eólicos\nAvaliar impactos ambientais', 'Profissionais do setor energético'),
(3, 'Conservação de Espécies', 'Estratégias para preservação de espécies ameaçadas', '/images/courses/species-conservation.jpg', 'https://www.youtube.com/watch?v=example5', 150, 'advanced', 'Dr. Pedro Mendes', 129.90, false, 1, 'published', 'Aprender estratégias de conservação\nImplementar programas de preservação\nMonitorar populações de espécies', 'Biólogos e conservacionistas');

-- ====================================================
-- MENSAGEM DE SUCESSO
-- ====================================================
SELECT 'Banco de dados GREEN MIND criado com sucesso!' AS Status,
       'Tabelas criadas: users, trails, courses, lessons, lesson_contents e mais!' AS Detalhes,
       'Usuário admin: adm@gmail.com | Senha: 123456' AS Credenciais;
