/**
 * TESTE RÁPIDO - Verificar se "pau" está sendo bloqueado
 */

const { 
  isTextClean, 
  cleanText, 
  validateText,
  getBlockedWords
} = require('./utils/profanityFilter');

console.log('\n🧪 TESTE: Verificando palavra "pau"\n');

// Verificar se está na lista
const blockedWords = getBlockedWords();
const hasPau = blockedWords.includes('pau');
console.log(`📊 Total de palavras bloqueadas: ${blockedWords.length}`);
console.log(`✅ Palavra "pau" está na lista? ${hasPau ? 'SIM' : 'NÃO'}\n`);

// Testes com "pau"
const testes = [
  'pau',
  'Pau',
  'PAU',
  'p4u',
  'p@u',
  'Jogador Pau',
  'PauNoZap',
  'PlayerPau123',
  'Quiz Legal',  // Este deve passar
  'Jogador Normal'  // Este deve passar
];

console.log('🔍 Testando detecção:\n');

testes.forEach(texto => {
  const limpo = isTextClean(texto);
  const cleaned = cleanText(texto);
  const validation = validateText(texto, 'nickname');
  
  console.log(`Texto: "${texto}"`);
  console.log(`  Limpo: ${limpo ? '✅ APROVADO' : '❌ BLOQUEADO'}`);
  console.log(`  Substituído: "${cleaned}"`);
  console.log(`  Válido: ${validation.valid ? '✅' : '❌'} ${validation.valid ? '' : '- ' + validation.message}`);
  console.log('');
});

console.log('✅ TESTE CONCLUÍDO!\n');

// Verificar se precisa reiniciar o servidor
console.log('⚠️  IMPORTANTE: Se você já tinha o servidor rodando, REINICIE-O para aplicar as mudanças!\n');
console.log('Para reiniciar:');
console.log('  1. Pare o servidor (Ctrl+C)');
console.log('  2. Execute: npm start\n');

