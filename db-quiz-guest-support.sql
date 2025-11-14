-- Migração para suporte a visitantes não logados em quizzes
-- Execute este script no banco de dados para adicionar suporte a guests

USE green_mind;

-- Adicionar campo guest_name na tabela quiz_attempts (se não existir)
ALTER TABLE quiz_attempts 
ADD COLUMN IF NOT EXISTS guest_name VARCHAR(100) DEFAULT NULL AFTER user_id;

-- Modificar a constraint de user_id para permitir NULL
ALTER TABLE quiz_attempts 
MODIFY COLUMN user_id INT NULL;

-- Adicionar índice para melhorar performance em buscas por guest
ALTER TABLE quiz_attempts 
ADD INDEX IF NOT EXISTS idx_guest_name (guest_name);

-- Comentário explicativo
ALTER TABLE quiz_attempts 
COMMENT = 'Tentativas de quizzes - suporta usuários autenticados (user_id) e visitantes (guest_name)';

-- Verificar a estrutura
DESCRIBE quiz_attempts;

-- Exibir mensagem de sucesso
SELECT 'Migração concluída com sucesso! Agora os quizzes suportam visitantes não logados.' AS status;

