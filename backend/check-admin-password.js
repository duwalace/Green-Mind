const pool = require('./config/database');
const bcrypt = require('bcrypt');

async function checkAdminPassword() {
  console.log('==============================================');
  console.log('  VERIFICAÇÃO DE SENHA DO ADMINISTRADOR');
  console.log('==============================================\n');

  try {
    // Buscar usuário admin
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      ['adm@gmail.com']
    );

    if (users.length === 0) {
      console.log('❌ Usuário admin não encontrado!\n');
      console.log('💡 Criando usuário admin...\n');
      
      const hashedPassword = await bcrypt.hash('123456', 10);
      await pool.execute(
        'INSERT INTO users (name, email, password, is_admin) VALUES (?, ?, ?, ?)',
        ['Administrador', 'adm@gmail.com', hashedPassword, true]
      );
      
      console.log('✅ Usuário admin criado com sucesso!');
      console.log('   Email: adm@gmail.com');
      console.log('   Senha: 123456\n');
    } else {
      const user = users[0];
      console.log('✅ Usuário admin encontrado:');
      console.log(`   Nome: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   É Admin: ${user.is_admin ? 'SIM' : 'NÃO'}`);
      console.log(`   Hash da senha: ${user.password.substring(0, 30)}...`);
      console.log('');

      // Testar senha
      console.log('🔐 Testando senha "123456"...');
      const isValid = await bcrypt.compare('123456', user.password);
      
      if (isValid) {
        console.log('✅ Senha "123456" está CORRETA\n');
      } else {
        console.log('❌ Senha "123456" está INCORRETA\n');
        console.log('💡 Resetando senha para "123456"...\n');
        
        const newHashedPassword = await bcrypt.hash('123456', 10);
        await pool.execute(
          'UPDATE users SET password = ? WHERE email = ?',
          [newHashedPassword, 'adm@gmail.com']
        );
        
        console.log('✅ Senha resetada com sucesso!');
        console.log('   Email: adm@gmail.com');
        console.log('   Nova senha: 123456\n');
      }
    }

    console.log('==============================================');
    console.log('  CREDENCIAIS DE ADMIN');
    console.log('==============================================');
    console.log('Email: adm@gmail.com');
    console.log('Senha: 123456');
    console.log('==============================================\n');

  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await pool.end();
  }
}

checkAdminPassword();

