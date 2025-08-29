const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const pool = require('./config/database');

async function checkDatabase() {
  try {
    // Testar conexão com o pool
    console.log('Testando conexão com o banco de dados...');
    const [testResult] = await pool.execute('SELECT 1');
    console.log('Conexão com o banco OK:', testResult);

    // Verificar tabelas
    console.log('\nVerificando tabelas...');
    const [tables] = await pool.execute('SHOW TABLES');
    console.log('Tabelas encontradas:', tables);

    // Verificar estrutura da tabela users
    console.log('\nVerificando estrutura da tabela users...');
    const [columns] = await pool.execute('DESCRIBE users');
    console.log('Colunas da tabela users:', columns);

    // Verificar usuários existentes
    console.log('\nVerificando usuários cadastrados...');
    const [users] = await pool.execute('SELECT id, name, email, is_admin FROM users');
    console.log('Usuários encontrados:', users);

    console.log('\nVerificação concluída com sucesso!');
  } catch (error) {
    console.error('Erro ao verificar banco de dados:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
  } finally {
    process.exit(0);
  }
}

async function updateUsersTable() {
  let connection;
  try {
    console.log('Iniciando atualização da tabela users...');
    
    // Criar conexão direta para garantir que estamos no banco correto
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'green_mind'
    });

    console.log('Conexão com o banco estabelecida');

    // Verificar se a tabela existe
    const [tables] = await connection.execute(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = 'green_mind' 
      AND TABLE_NAME = 'users'
    `);

    if (tables.length === 0) {
      console.log('Tabela users não encontrada!');
      return;
    }

    console.log('Tabela users encontrada');

    // Verificar colunas existentes
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'green_mind' 
      AND TABLE_NAME = 'users'
    `);
    
    const existingColumns = columns.map(col => col.COLUMN_NAME);
    console.log('Colunas existentes:', existingColumns);

    // Adicionar colunas se não existirem
    const columnsToAdd = [
      { name: 'location', type: 'VARCHAR(100)' },
      { name: 'occupation', type: 'VARCHAR(100)' },
      { name: 'level', type: 'INT DEFAULT 1' },
      { name: 'xp', type: 'INT DEFAULT 0' }
    ];

    for (const column of columnsToAdd) {
      if (!existingColumns.includes(column.name)) {
        console.log(`Adicionando coluna ${column.name}...`);
        try {
          await connection.execute(`
            ALTER TABLE users 
            ADD COLUMN ${column.name} ${column.type}
          `);
          console.log(`Coluna ${column.name} adicionada com sucesso!`);
        } catch (error) {
          console.error(`Erro ao adicionar coluna ${column.name}:`, error.message);
        }
      } else {
        console.log(`Coluna ${column.name} já existe`);
      }
    }

    // Verificar novamente as colunas após as alterações
    const [updatedColumns] = await connection.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'green_mind' 
      AND TABLE_NAME = 'users'
    `);
    
    console.log('Colunas após atualização:', updatedColumns.map(col => col.COLUMN_NAME));
    console.log('Atualização da tabela concluída!');

  } catch (error) {
    console.error('Erro durante a atualização:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Conexão fechada');
    }
    process.exit(0);
  }
}

// Executar verificação
checkDatabase();
updateUsersTable(); 