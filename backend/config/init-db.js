const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

async function initializeDatabase() {
  let connection;
  try {
    // Criar conexão sem banco de dados
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: ''
    });

    // Criar o banco de dados
    await connection.query('CREATE DATABASE IF NOT EXISTS green_mind');
    await connection.query('USE green_mind');

    // Criar a tabela de usuários
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        is_admin BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Verificar se já existe um usuário admin
    const [admins] = await connection.query(
      'SELECT * FROM users WHERE email = ?',
      ['admin@greenmind.com']
    );

    if (admins.length === 0) {
      // Criar hash da senha do admin
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      // Inserir usuário admin
      await connection.query(
        'INSERT INTO users (name, email, password, is_admin) VALUES (?, ?, ?, ?)',
        ['Administrador', 'admin@greenmind.com', hashedPassword, true]
      );
      console.log('Usuário admin criado com sucesso!');
    }

    console.log('Banco de dados inicializado com sucesso!');
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Executar a inicialização
initializeDatabase(); 