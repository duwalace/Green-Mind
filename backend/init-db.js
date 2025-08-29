const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

async function initializeDatabase() {
  let connection;
  try {
    // Criar conexão sem especificar o banco de dados
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: ''
    });

    console.log('Conectado ao MySQL');

    // Criar o banco de dados se não existir
    await connection.query('CREATE DATABASE IF NOT EXISTS green_mind');
    console.log('Banco de dados green_mind criado ou já existe');

    // Usar o banco de dados
    await connection.query('USE green_mind');

    // Ler e executar o arquivo SQL
    const sqlFile = await fs.readFile(path.join(__dirname, '../db.sql'), 'utf8');
    const statements = sqlFile.split(';').filter(stmt => stmt.trim());

    for (const statement of statements) {
      if (statement.trim()) {
        await connection.query(statement);
      }
    }

    console.log('Banco de dados inicializado com sucesso!');
  } catch (error) {
    console.error('Erro ao inicializar o banco de dados:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Executar a inicialização
initializeDatabase().catch(console.error); 