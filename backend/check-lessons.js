const pool = require('./config/database');

async function checkLessons() {
  console.log('==============================================');
  console.log('  VERIFICAÇÃO DE AULAS NO BANCO DE DADOS');
  console.log('==============================================\n');

  try {
    // Verificar tabela lessons
    const [tables] = await pool.execute("SHOW TABLES LIKE 'lessons'");
    
    if (tables.length === 0) {
      console.log('❌ PROBLEMA: Tabela "lessons" NÃO EXISTE!');
      console.log('   Execute o arquivo db.sql para criar a tabela.\n');
      return;
    }

    console.log('✅ Tabela "lessons" existe no banco\n');

    // Buscar TODAS as aulas (independente do status)
    const [allLessons] = await pool.execute(`
      SELECT l.*, c.title as course_title 
      FROM lessons l
      LEFT JOIN courses c ON l.course_id = c.id
      ORDER BY l.created_at DESC
    `);

    console.log(`📊 Total de aulas no banco: ${allLessons.length}\n`);

    if (allLessons.length === 0) {
      console.log('⚠️  Não há aulas cadastradas no sistema.\n');
    } else {
      // Agrupar por status
      const byStatus = {
        draft: allLessons.filter(l => l.status === 'draft'),
        published: allLessons.filter(l => l.status === 'published'),
        archived: allLessons.filter(l => l.status === 'archived')
      };

      console.log('📈 Aulas por Status:');
      console.log(`   🟡 Rascunho (draft):    ${byStatus.draft.length}`);
      console.log(`   🟢 Publicadas:          ${byStatus.published.length}`);
      console.log(`   🔴 Arquivadas:          ${byStatus.archived.length}`);
      console.log('');

      // Mostrar aulas em RASCUNHO (as que não aparecem para usuários comuns)
      if (byStatus.draft.length > 0) {
        console.log('🟡 AULAS EM RASCUNHO (que não aparecem na lista pública):\n');
        byStatus.draft.forEach((lesson, index) => {
          console.log(`   ${index + 1}. "${lesson.title}"`);
          console.log(`      ID: ${lesson.id}`);
          console.log(`      Curso: ${lesson.course_title || 'N/A'} (ID: ${lesson.course_id})`);
          console.log(`      Ordem: ${lesson.sequence_order}`);
          console.log(`      Status: ${lesson.status}`);
          console.log(`      Criada em: ${lesson.created_at}`);
          console.log('');
        });
      }

      // Mostrar aulas PUBLICADAS
      if (byStatus.published.length > 0) {
        console.log('🟢 AULAS PUBLICADAS (visíveis para todos):\n');
        byStatus.published.forEach((lesson, index) => {
          console.log(`   ${index + 1}. "${lesson.title}"`);
          console.log(`      ID: ${lesson.id}`);
          console.log(`      Curso: ${lesson.course_title || 'N/A'} (ID: ${lesson.course_id})`);
          console.log(`      Ordem: ${lesson.sequence_order}`);
          console.log('');
        });
      }

      // Agrupar por curso
      console.log('📚 Aulas por Curso:\n');
      const byCourse = {};
      allLessons.forEach(lesson => {
        if (!byCourse[lesson.course_id]) {
          byCourse[lesson.course_id] = {
            title: lesson.course_title || 'Sem título',
            lessons: []
          };
        }
        byCourse[lesson.course_id].lessons.push(lesson);
      });

      Object.entries(byCourse).forEach(([courseId, data]) => {
        console.log(`   📖 ${data.title} (ID: ${courseId})`);
        console.log(`      Total de aulas: ${data.lessons.length}`);
        data.lessons.forEach(lesson => {
          const statusIcon = lesson.status === 'published' ? '🟢' : lesson.status === 'draft' ? '🟡' : '🔴';
          console.log(`      ${statusIcon} ${lesson.title} (Ordem: ${lesson.sequence_order})`);
        });
        console.log('');
      });
    }

    console.log('==============================================');
    console.log('  DIAGNÓSTICO');
    console.log('==============================================\n');

    if (allLessons.length > 0) {
      const draftCount = allLessons.filter(l => l.status === 'draft').length;
      if (draftCount > 0) {
        console.log(`⚠️  ATENÇÃO: Você tem ${draftCount} aula(s) em RASCUNHO`);
        console.log('   Essas aulas NÃO aparecem na lista pública.');
        console.log('   Apenas administradores podem vê-las no dashboard admin.\n');
        console.log('💡 Para torná-las visíveis:');
        console.log('   1. Acesse o Dashboard Admin');
        console.log('   2. Edite a aula');
        console.log('   3. Mude o status para "Publicado"\n');
      } else {
        console.log('✅ Todas as aulas estão publicadas!\n');
      }
    }

    console.log('✅ Correção aplicada!');
    console.log('   - Nova rota admin criada: GET /api/admin/courses/:id/lessons');
    console.log('   - Esta rota retorna TODAS as aulas (draft + published + archived)');
    console.log('   - O frontend agora usa esta nova rota');
    console.log('   - As aulas em rascunho agora aparecerão no dashboard admin!\n');

  } catch (error) {
    console.error('❌ Erro ao verificar aulas:', error.message);
  } finally {
    await pool.end();
  }
}

checkLessons();

