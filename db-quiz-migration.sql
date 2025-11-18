-- ====================================================
-- GREEN MIND - SISTEMA DE QUIZ INTERATIVO (Estilo Kahoot)
-- Migration para adicionar funcionalidade de Quiz
-- ====================================================

USE green_mind;

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
-- ====================================================
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quiz_id INT NOT NULL,
    user_id INT NOT NULL,
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
    INDEX idx_score (quiz_id, score DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
-- DADOS INICIAIS - QUIZ DE EXEMPLO
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
    2,
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
    2,
    'Restos de alimentos podem ser transformados em adubo através da compostagem?',
    'true_false',
    JSON_ARRAY('Verdadeiro', 'Falso'),
    '0',
    'Verdadeiro! A compostagem transforma resíduos orgânicos em adubo rico em nutrientes.',
    2,
    120
),
(
    2,
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
SELECT 'Sistema de Quiz criado com sucesso!' AS Status,
       '4 novas tabelas: quizzes, quiz_questions, quiz_attempts, quiz_user_answers, quiz_leaderboard' AS Tabelas,
       '3 quizzes de exemplo criados' AS Dados;

