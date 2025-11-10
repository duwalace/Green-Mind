const pool = require('./config/database');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function promoteUser() {
  console.log('==============================================');
  console.log('  PROMOVER USUÁRIO PARA ADMINISTRADOR');
  console.log('==============================================\n');

  try {
    // Listar usuários
    const [users] = await pool.execute(
      'SELECT id, name, email, is_admin FROM users ORDER BY id'
    );

    if (users.length === 0) {
      console.log('❌ Não há usuários cadastrados no sistema.');
      rl.close();
      await pool.end();
      return;
    }

    console.log('👥 Usuários cadastrados:\n');
    users.forEach((user, index) => {
      const adminBadge = user.is_admin ? '🔑 ADMIN' : '👤 USER';
      console.log(`   ${index + 1}. ${adminBadge} - ${user.name}`);
      console.log(`      Email: ${user.email}`);
      console.log(`      ID: ${user.id}`);
      console.log('');
    });

    const userIndex = await question(`Selecione o usuário (1-${users.length}): `);
    const selectedUser = users[parseInt(userIndex) - 1];

    if (!selectedUser) {
      console.log('❌ Usuário inválido selecionado.');
      rl.close();
      await pool.end();
      return;
    }

    if (selectedUser.is_admin) {
      console.log(`\n⚠️  O usuário "${selectedUser.name}" já é administrador.`);
      rl.close();
      await pool.end();
      return;
    }

    const confirm = await question(`\n⚠️  Tem certeza que deseja promover "${selectedUser.name}" para administrador? (s/n): `);

    if (confirm.toLowerCase() !== 's') {
      console.log('\n❌ Operação cancelada.');
      rl.close();
      await pool.end();
      return;
    }

    // Promover usuário
    await pool.execute(
      'UPDATE users SET is_admin = TRUE WHERE id = ?',
      [selectedUser.id]
    );

    console.log('\n✅ ✅ ✅ SUCESSO! ✅ ✅ ✅');
    console.log(`\n🎉 Usuário "${selectedUser.name}" promovido para administrador!`);
    console.log(`\n💡 Agora ${selectedUser.name} pode:`);
    console.log('   - Criar e editar aulas');
    console.log('   - Criar e editar cursos');
    console.log('   - Gerenciar trilhas');
    console.log('   - Gerenciar usuários');
    console.log('');

  } catch (error) {
    console.error('❌ Erro ao promover usuário:', error.message);
  } finally {
    rl.close();
    await pool.end();
  }
}

promoteUser();

