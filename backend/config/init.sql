-- Criar o banco de dados se não existir
CREATE DATABASE IF NOT EXISTS green_mind;

-- Usar o banco de dados
USE green_mind;

-- Criar a tabela de usuários se não existir
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Inserir um usuário admin padrão se não existir
INSERT IGNORE INTO users (name, email, password, is_admin)
VALUES (
    'Administrador',
    'admin@greenmind.com',
    '$2b$10$8K1p/a0dR1xqM8K1p/a0dR1xqM8K1p/a0dR1xqM8K1p/a0dR1xqM', -- senha: admin123
    TRUE
); 