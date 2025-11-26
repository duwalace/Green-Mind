/**
 * Script de Teste - Filtro de Profanidade
 * 
 * Testa se títulos comuns de quiz educacional passam pelo filtro
 * Uso: node test-profanity-filter.js
 */

const { validateText, getBlockedWords } = require('./utils/profanityFilter');

console.log('🧪 TESTANDO FILTRO DE PROFANIDADE\n');
console.log('='.repeat(60));

// Testes com títulos que DEVEM passar
const titlesShouldPass = [
  'Quiz de Sustentabilidade',
  'Teste sobre Meio Ambiente',
  'Conhecimentos Gerais',
  'História do Brasil - Pau-Brasil',
  'Matemática Básica',
  'Ciências Naturais',
  'Geografia Mundial',
  'Literatura Brasileira',
  'Educação Ambiental',
  'Reciclagem e Resíduos'
];

// Testes com títulos que DEVEM ser bloqueados
const titlesShouldFail = [
  'Quiz de merda',
  'Teste porra',
  'Vai se foder',
  'Teste fdp',
  'Quiz caralho'
];

console.log('\n✅ TESTANDO TÍTULOS QUE DEVEM PASSAR:\n');
let passCount = 0;
let failCount = 0;

titlesShouldPass.forEach(title => {
  const validation = validateText(title, 'quiz_title');
  if (validation.valid) {
    console.log(`  ✅ PASSOU: "${title}"`);
    passCount++;
  } else {
    console.log(`  ❌ BLOQUEADO (ERRO!): "${title}"`);
    console.log(`     Mensagem: ${validation.message}`);
    failCount++;
  }
});

console.log(`\n📊 Resultado: ${passCount}/${titlesShouldPass.length} passaram`);

if (failCount > 0) {
  console.log(`⚠️  ATENÇÃO: ${failCount} título(s) foram bloqueados indevidamente!`);
}

console.log('\n' + '='.repeat(60));
console.log('\n❌ TESTANDO TÍTULOS QUE DEVEM SER BLOQUEADOS:\n');

let blockedCount = 0;
let passedCount = 0;

titlesShouldFail.forEach(title => {
  const validation = validateText(title, 'quiz_title');
  if (!validation.valid) {
    console.log(`  ✅ BLOQUEADO: "${title}"`);
    console.log(`     Mensagem: ${validation.message}`);
    blockedCount++;
  } else {
    console.log(`  ❌ PASSOU (ERRO!): "${title}"`);
    passedCount++;
  }
});

console.log(`\n📊 Resultado: ${blockedCount}/${titlesShouldFail.length} foram bloqueados`);

if (passedCount > 0) {
  console.log(`⚠️  ATENÇÃO: ${passedCount} título(s) ofensivo(s) passaram pelo filtro!`);
}

console.log('\n' + '='.repeat(60));
console.log('\n📋 ESTATÍSTICAS DO FILTRO:\n');
console.log(`  Total de palavras bloqueadas: ${getBlockedWords().length}`);
console.log(`  Falsos positivos: ${failCount}`);
console.log(`  Falsos negativos: ${passedCount}`);

const accuracy = ((passCount + blockedCount) / (titlesShouldPass.length + titlesShouldFail.length) * 100).toFixed(2);
console.log(`  Precisão: ${accuracy}%`);

console.log('\n' + '='.repeat(60));

if (failCount === 0 && passedCount === 0) {
  console.log('\n✅ FILTRO FUNCIONANDO PERFEITAMENTE!\n');
} else {
  console.log('\n⚠️  FILTRO PRECISA DE AJUSTES!\n');
  if (failCount > 0) {
    console.log('  → Remova mais palavras comuns da lista de bloqueio');
  }
  if (passedCount > 0) {
    console.log('  → Adicione mais variações de palavras ofensivas');
  }
}
