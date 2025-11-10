const pool = require('./config/database');

async function diagnoseAdmin() {
  console.log('==============================================');
  console.log('  DIAGNÓSTICO DE USUÁRIOS ADMINISTRADORES');
  console.log('==============================================\n');

  try {
    // Verificar usuários admin
    const [adminUsers] = await pool.execute(
      'SELECT id, name, email, is_admin FROM users WHERE is_admin = TRUE'
    );

    console.log('👥 Usuários Administradores encontrados:', adminUsers.length);
    
    if (adminUsers.length === 0) {
      console.log('\n❌ PROBLEMA CRÍTICO: Não há usuários administradores!\n');
      console.log('💡 SOLUÇÃO: Execute o comando abaixo para criar um usuário admin:');
      console.log('   node backend/create-admin.js\n');
    } else {
      console.log('\n✅ Usuários com permissão de administrador:\n');
      adminUsers.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.name}`);
        console.log(`      Email: ${user.email}`);
        console.log(`      ID: ${user.id}`);
        console.log('');
      });
      
      console.log('💡 Use uma dessas contas para criar aulas no dashboard.\n');
      console.log('📝 Credenciais padrão do admin:');
      console.log('   Email: adm@gmail.com');
      console.log('   Senha: 123456\n');
    }

    // Verificar todos os usuários
    const [allUsers] = await pool.execute(
      'SELECT id, name, email, is_admin FROM users'
    );

    console.log('👤 Total de usuários cadastrados:', allUsers.length);
    console.log('\nLista completa de usuários:\n');
    allUsers.forEach((user, index) => {
      const adminBadge = user.is_admin ? '🔑 ADMIN' : '👤 USER';
      console.log(`   ${index + 1}. ${adminBadge} - ${user.name} (${user.email})`);
    });
    console.log('');

    // Verificar cursos
    const [courses] = await pool.execute('SELECT id, title FROM courses');
    console.log('📚 Total de cursos disponíveis:', courses.length);
    
    if (courses.length > 0) {
      console.log('\nCursos cadastrados:\n');
      courses.forEach((course, index) => {
        console.log(`   ${index + 1}. ${course.title} (ID: ${course.id})`);
      });
    } else {
      console.log('\n⚠️  AVISO: Não há cursos cadastrados.');
      console.log('   Você precisa criar cursos antes de criar aulas.\n');
    }
    console.log('');

    // Verificar aulas
    const [lessons] = await pool.execute('SELECT COUNT(*) as count FROM lessons');
    console.log('🎓 Total de aulas cadastradas:', lessons[0].count);
    console.log('');

    console.log('==============================================');
    console.log('  DIAGNÓSTICO COMPLETO');
    console.log('==============================================\n');

  } catch (error) {
    console.error('❌ Erro ao executar diagnóstico:', error.message);
  } finally {
    await pool.end();
  }
}

diagnoseAdmin();

