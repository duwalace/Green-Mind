const pool = require('./config/database');

async function testDatabase() {
  console.log('🔍 Testando conexão com o banco de dados...\n');
  
  try {
    // Testar conexão básica
    const connection = await pool.getConnection();
    console.log('✅ Conexão com o banco estabelecida com sucesso!');
    connection.release();
    
    // Testar query simples
    const [result] = await pool.execute('SELECT 1 as test');
    console.log('✅ Query de teste executada:', result);
    
    // Verificar tabelas
    const [tables] = await pool.execute('SHOW TABLES');
    console.log('\n📊 Tabelas no banco de dados:');
    tables.forEach((table, index) => {
      const tableName = Object.values(table)[0];
      console.log(`   ${index + 1}. ${tableName}`);
    });
    
    // Testar query na tabela de quizzes
    console.log('\n🎯 Testando query na tabela quizzes...');
    const [quizzes] = await pool.execute('SELECT COUNT(*) as count FROM quizzes');
    console.log(`✅ Total de quizzes: ${quizzes[0].count}`);
    
    // Testar query na tabela de cursos
    console.log('\n📚 Testando query na tabela courses...');
    const [courses] = await pool.execute('SELECT COUNT(*) as count FROM courses');
    console.log(`✅ Total de cursos: ${courses[0].count}`);
    
    // Testar query na tabela de usuários
    console.log('\n👥 Testando query na tabela users...');
    const [users] = await pool.execute('SELECT COUNT(*) as count FROM users');
    console.log(`✅ Total de usuários: ${users[0].count}`);
    
    console.log('\n✅✅✅ Todos os testes passaram! O banco de dados está funcionando corretamente.\n');
    
  } catch (error) {
    console.error('\n❌ ERRO ao testar banco de dados:');
    console.error(`   Tipo: ${error.code || 'Desconhecido'}`);
    console.error(`   Mensagem: ${error.message}`);
    console.error(`   Stack: ${error.stack}`);
    
    console.log('\n💡 Possíveis soluções:');
    console.log('   1. Verifique se o WAMP está rodando');
    console.log('   2. Verifique se o MySQL está ativo (ícone verde no WAMP)');
    console.log('   3. Execute: npm run init-db (para criar o banco de dados)');
    console.log('   4. Verifique as credenciais em backend/config/database.js\n');
  } finally {
    await pool.end();
    process.exit(0);
  }
}

testDatabase();

