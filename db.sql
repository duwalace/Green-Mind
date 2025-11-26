-- ====================================================
-- GREEN MIND - BANCO DE DADOS COMPLETO E ATUALIZADO
-- Sistema de Cursos com Múltiplos Conteúdos por Aula + Sistema de Quiz Interativo
-- Versão Consolidada - Novembro 2025
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
-- SISTEMA DE QUIZ INTERATIVO (Estilo Kahoot)
-- ====================================================

-- ====================================================
-- TABELA DE QUIZZES
-- ====================================================
CREATE TABLE IF NOT EXISTS quizzes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    course_id INT,
    trail_id INT,
    image_url VARCHAR(255),
    difficulty_level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
    time_limit_seconds INT DEFAULT 300,
    points_per_question INT DEFAULT 100,
    passing_score DECIMAL(5,2) DEFAULT 70.00,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (trail_id) REFERENCES trails(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_course (course_id),
    INDEX idx_trail (trail_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================
-- TABELA DE PERGUNTAS DO QUIZ
-- ====================================================
CREATE TABLE IF NOT EXISTS quiz_questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quiz_id INT NOT NULL,
    question_text TEXT NOT NULL,
    question_type ENUM('multiple_choice', 'true_false', 'text') DEFAULT 'multiple_choice',
    image_url VARCHAR(255),
    time_limit_seconds INT DEFAULT 30,
    points INT DEFAULT 100,
    sequence_order INT DEFAULT 0,
    
    -- Opções para múltipla escolha (JSON array)
    options JSON,
    -- Índice da resposta correta (0, 1, 2, 3) ou 'true'/'false' para true/false
    correct_answer VARCHAR(255) NOT NULL,
    explanation TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
    INDEX idx_quiz_sequence (quiz_id, sequence_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================
-- TABELA DE TENTATIVAS DE QUIZ
-- Suporta usuários autenticados e visitantes (guests)
-- ====================================================
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quiz_id INT NOT NULL,
    user_id INT NULL,
    guest_name VARCHAR(100) DEFAULT NULL,
    score DECIMAL(5,2) DEFAULT 0.00,
    total_questions INT NOT NULL,
    correct_answers INT DEFAULT 0,
    time_taken_seconds INT,
    passed BOOLEAN DEFAULT FALSE,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_user_quiz (user_id, quiz_id),
    INDEX idx_guest_name (guest_name),
    INDEX idx_score (quiz_id, score DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT = 'Tentativas de quizzes - suporta usuários autenticados (user_id) e visitantes (guest_name)';

-- ====================================================
-- TABELA DE RESPOSTAS DO USUÁRIO
-- ====================================================
CREATE TABLE IF NOT EXISTS quiz_user_answers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    attempt_id INT NOT NULL,
    question_id INT NOT NULL,
    user_answer VARCHAR(500) NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    time_taken_seconds INT,
    points_earned INT DEFAULT 0,
    answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (attempt_id) REFERENCES quiz_attempts(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES quiz_questions(id) ON DELETE CASCADE,
    
    INDEX idx_attempt (attempt_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================
-- TABELA DE RANKING/LEADERBOARD
-- ====================================================
CREATE TABLE IF NOT EXISTS quiz_leaderboard (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quiz_id INT NOT NULL,
    user_id INT NOT NULL,
    best_score DECIMAL(5,2) DEFAULT 0.00,
    best_time_seconds INT,
    total_attempts INT DEFAULT 1,
    last_attempt_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    UNIQUE KEY unique_user_quiz_leaderboard (quiz_id, user_id),
    INDEX idx_ranking (quiz_id, best_score DESC, best_time_seconds ASC)
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
-- DADOS INICIAIS - QUIZZES DE EXEMPLO
-- ====================================================

-- Quiz 1: Sustentabilidade Básica
INSERT INTO quizzes (title, description, course_id, trail_id, difficulty_level, time_limit_seconds, points_per_question, passing_score, status, created_by) 
VALUES (
    'Quiz de Sustentabilidade Básica',
    'Teste seus conhecimentos sobre conceitos fundamentais de sustentabilidade e práticas ecológicas.',
    1, -- ID do curso "Introdução à Sustentabilidade"
    1, -- ID da trilha "Água"
    'beginner',
    600, -- 10 minutos
    100,
    70.00,
    'published',
    1 -- ID do admin
);

-- Perguntas do Quiz 1
INSERT INTO quiz_questions (quiz_id, question_text, question_type, options, correct_answer, explanation, sequence_order, points) VALUES
(
    1,
    'O que significa "sustentabilidade"?',
    'multiple_choice',
    JSON_ARRAY(
        'Usar todos os recursos naturais disponíveis',
        'Atender às necessidades presentes sem comprometer as gerações futuras',
        'Produzir sem se preocupar com o meio ambiente',
        'Reciclar apenas plástico'
    ),
    '1',
    'Sustentabilidade é o equilíbrio entre desenvolvimento econômico, social e ambiental, garantindo recursos para as próximas gerações.',
    1,
    100
),
(
    1,
    'Qual é uma das principais fontes de energia renovável?',
    'multiple_choice',
    JSON_ARRAY(
        'Carvão mineral',
        'Petróleo',
        'Energia Solar',
        'Gás natural'
    ),
    '2',
    'A energia solar é renovável, limpa e abundante, sendo uma das melhores alternativas aos combustíveis fósseis.',
    2,
    100
),
(
    1,
    'A reciclagem ajuda a reduzir a quantidade de lixo nos aterros?',
    'true_false',
    JSON_ARRAY('Verdadeiro', 'Falso'),
    '0',
    'Sim! A reciclagem transforma materiais descartados em novos produtos, reduzindo significativamente o lixo nos aterros.',
    3,
    100
),
(
    1,
    'Qual destes NÃO é um dos 3 Rs da sustentabilidade?',
    'multiple_choice',
    JSON_ARRAY(
        'Reduzir',
        'Reutilizar',
        'Reciclar',
        'Renovar'
    ),
    '3',
    'Os 3 Rs da sustentabilidade são: Reduzir, Reutilizar e Reciclar. "Renovar" não faz parte deste conceito básico.',
    4,
    100
),
(
    1,
    'O efeito estufa é totalmente prejudicial ao planeta?',
    'true_false',
    JSON_ARRAY('Verdadeiro', 'Falso'),
    '1',
    'Falso! O efeito estufa natural é essencial para manter a temperatura da Terra. O problema é o efeito estufa intensificado pelas atividades humanas.',
    5,
    100
);

-- Quiz 2: Energia Sustentável
INSERT INTO quizzes (title, description, course_id, trail_id, difficulty_level, time_limit_seconds, points_per_question, passing_score, status, created_by) 
VALUES (
    'Energia Sustentável',
    'Avalie seus conhecimentos sobre fontes de energia renovável e eficiência energética.',
    3, -- ID do curso "Energia Solar"
    2, -- ID da trilha "Energia"
    'intermediate',
    480, -- 8 minutos
    150,
    75.00,
    'published',
    1
);

-- Perguntas do Quiz 2
INSERT INTO quiz_questions (quiz_id, question_text, question_type, options, correct_answer, explanation, sequence_order, points) VALUES
(
    2,
    'Qual a principal vantagem da energia eólica?',
    'multiple_choice',
    JSON_ARRAY(
        'É a mais barata de todas',
        'Não emite gases poluentes',
        'Funciona 24 horas por dia',
        'Não precisa de manutenção'
    ),
    '1',
    'A energia eólica é limpa e não emite gases do efeito estufa, contribuindo para a redução do aquecimento global.',
    1,
    150
),
(
    2,
    'Painéis solares funcionam apenas com luz solar direta?',
    'true_false',
    JSON_ARRAY('Verdadeiro', 'Falso'),
    '1',
    'Falso! Os painéis solares também funcionam em dias nublados, embora com eficiência reduzida.',
    2,
    150
),
(
    2,
    'Qual destes é um exemplo de energia NÃO renovável?',
    'multiple_choice',
    JSON_ARRAY(
        'Hidroelétrica',
        'Biomassa',
        'Nuclear',
        'Geotérmica'
    ),
    '2',
    'A energia nuclear, apesar de limpa, depende de urânio, um recurso finito, sendo classificada como não renovável.',
    3,
    150
);

-- Quiz 3: Gestão de Resíduos
INSERT INTO quizzes (title, description, course_id, trail_id, difficulty_level, time_limit_seconds, points_per_question, passing_score, status, created_by) 
VALUES (
    'Gestão de Resíduos e Reciclagem',
    'Teste seus conhecimentos sobre separação de resíduos, compostagem e economia circular.',
    2, -- ID do curso "Gestão de Resíduos"
    4, -- ID da trilha "Reciclagem"
    'intermediate',
    600,
    120,
    70.00,
    'published',
    1
);

-- Perguntas do Quiz 3
INSERT INTO quiz_questions (quiz_id, question_text, question_type, options, correct_answer, explanation, sequence_order, points) VALUES
(
    3,
    'Qual cor da lixeira é destinada ao papel?',
    'multiple_choice',
    JSON_ARRAY(
        'Verde',
        'Amarelo',
        'Azul',
        'Vermelho'
    ),
    '2',
    'A lixeira azul é destinada ao papel e papelão na coleta seletiva.',
    1,
    120
),
(
    3,
    'Restos de alimentos podem ser transformados em adubo através da compostagem?',
    'true_false',
    JSON_ARRAY('Verdadeiro', 'Falso'),
    '0',
    'Verdadeiro! A compostagem transforma resíduos orgânicos em adubo rico em nutrientes.',
    2,
    120
),
(
    3,
    'Quanto tempo leva para uma garrafa de plástico se decompor na natureza?',
    'multiple_choice',
    JSON_ARRAY(
        '5 anos',
        '50 anos',
        '100 anos',
        'Mais de 400 anos'
    ),
    '3',
    'Garrafas plásticas podem levar mais de 400 anos para se decompor, por isso a reciclagem é essencial.',
    3,
    120
);

-- ====================================================
-- MENSAGEM DE SUCESSO
-- ====================================================
SELECT 'Banco de dados GREEN MIND criado com sucesso!' AS Status,
       'Sistema completo: Cursos + Quiz Interativo + Suporte a Visitantes' AS Sistema,
       'Tabelas: 24 tabelas criadas' AS Tabelas,
       'Usuário admin: adm@gmail.com | Senha: 123456' AS Credenciais,
       '3 quizzes de exemplo criados' AS Dados;
