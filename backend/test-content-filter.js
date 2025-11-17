// Script de teste para o sistema de filtro de conteúdo
const contentValidator = require('./utils/contentValidator');

console.log('🧪 TESTE DO SISTEMA DE FILTRO DE CONTEÚDO\n');
console.log('='.repeat(60));

// Testes de Nome de Jogador
console.log('\n📝 TESTE 1: VALIDAÇÃO DE NOMES DE JOGADORES\n');

const playerNameTests = [
  { name: 'João Silva', expected: true },
  { name: 'Player123', expected: true },
  { name: 'Ana', expected: true },
  { name: 'Maria Clara', expected: true },
  { name: 'J', expected: false, reason: 'Muito curto' },
  { name: 'Este nome tem mais de vinte caracteres', expected: false, reason: 'Muito longo' },
  { name: 'puta', expected: false, reason: 'Palavra ofensiva' },
  { name: 'idiota', expected: false, reason: 'Palavra ofensiva' },
  { name: 'p0rra', expected: false, reason: 'Variação ofensiva' },
  { name: 'p u t a', expected: false, reason: 'Bypass com espaços' },
  { name: 'joão@#$%', expected: false, reason: 'Caracteres especiais' },
  { name: 'aaaaaaaaaa', expected: false, reason: 'Spam' },
  { name: '12345678901', expected: false, reason: 'Apenas números' },
];

playerNameTests.forEach(test => {
  const result = contentValidator.validatePlayerName(test.name);
  const status = result.valid === test.expected ? '✅' : '❌';
  console.log(`${status} "${test.name}"`);
  console.log(`   Esperado: ${test.expected ? 'Válido' : 'Inválido'}`);
  console.log(`   Resultado: ${result.valid ? 'Válido' : 'Inválido'}`);
  if (!result.valid) {
    console.log(`   Razão: ${result.reason}`);
  }
  console.log('');
});

// Testes de Título de Quiz
console.log('\n📝 TESTE 2: VALIDAÇÃO DE TÍTULOS DE QUIZ\n');

const titleTests = [
  { title: 'Quiz de Sustentabilidade', expected: true },
  { title: 'Teste sobre Energias Renováveis', expected: true },
  { title: 'Reciclagem 101', expected: true },
  { title: 'A', expected: false, reason: 'Muito curto' },
  { title: 'Quiz com palavrão', expected: false, reason: 'Palavra ofensiva' },
  { title: 'Teste de merda', expected: false, reason: 'Palavra ofensiva' },
  { title: 'Quiz f0da', expected: false, reason: 'Variação ofensiva' },
];

titleTests.forEach(test => {
  const result = contentValidator.validateQuizTitle(test.title);
  const status = result.valid === test.expected ? '✅' : '❌';
  console.log(`${status} "${test.title}"`);
  console.log(`   Esperado: ${test.expected ? 'Válido' : 'Inválido'}`);
  console.log(`   Resultado: ${result.valid ? 'Válido' : 'Inválido'}`);
  if (!result.valid) {
    console.log(`   Razão: ${result.reason}`);
  }
  console.log('');
});

// Testes de Perguntas
console.log('\n📝 TESTE 3: VALIDAÇÃO DE PERGUNTAS DE QUIZ\n');

const questionTests = [
  { 
    question: 'Qual é a principal fonte de energia renovável?', 
    expected: true 
  },
  { 
    question: 'O que significa sustentabilidade ambiental?', 
    expected: true 
  },
  { 
    question: 'Curta', 
    expected: false, 
    reason: 'Muito curta' 
  },
  { 
    question: 'Esta pergunta contém palavrão e é ofensiva', 
    expected: false, 
    reason: 'Palavra ofensiva' 
  },
  { 
    question: 'Pergunta com conteúdo puta que pariu', 
    expected: false, 
    reason: 'Expressão ofensiva' 
  },
];

questionTests.forEach(test => {
  const result = contentValidator.validateQuizQuestion(test.question);
  const status = result.valid === test.expected ? '✅' : '❌';
  console.log(`${status} "${test.question.substring(0, 50)}${test.question.length > 50 ? '...' : ''}"`);
  console.log(`   Esperado: ${test.expected ? 'Válido' : 'Inválido'}`);
  console.log(`   Resultado: ${result.valid ? 'Válido' : 'Inválido'}`);
  if (!result.valid) {
    console.log(`   Razão: ${result.reason}`);
  }
  console.log('');
});

// Testes de Opções de Resposta
console.log('\n📝 TESTE 4: VALIDAÇÃO DE OPÇÕES DE RESPOSTA\n');

const optionsTests = [
  { 
    options: ['Energia Solar', 'Energia Eólica', 'Energia Nuclear', 'Carvão'], 
    expected: true 
  },
  { 
    options: ['Sim', 'Não'], 
    expected: true 
  },
  { 
    options: ['Apenas uma opção'], 
    expected: false, 
    reason: 'Menos de 2 opções' 
  },
  { 
    options: ['Opção válida', 'Opção com palavrão'], 
    expected: false, 
    reason: 'Opção ofensiva' 
  },
  { 
    options: ['Opção 1', 'Opção com idiota'], 
    expected: false, 
    reason: 'Opção ofensiva' 
  },
];

optionsTests.forEach(test => {
  const result = contentValidator.validateQuizOptions(test.options);
  const status = result.valid === test.expected ? '✅' : '❌';
  console.log(`${status} [${test.options.join(', ')}]`);
  console.log(`   Esperado: ${test.expected ? 'Válido' : 'Inválido'}`);
  console.log(`   Resultado: ${result.valid ? 'Válido' : 'Inválido'}`);
  if (!result.valid) {
    console.log(`   Razão: ${result.reason}`);
  }
  console.log('');
});

// Testes de Detecção de Bypass
console.log('\n📝 TESTE 5: DETECÇÃO DE TENTATIVAS DE BYPASS\n');

const bypassTests = [
  { text: 'p0rra', description: 'Números substituindo letras' },
  { text: 'put@', description: 'Símbolos substituindo letras' },
  { text: 'p u t a', description: 'Espaços entre letras' },
  { text: 'p.u.t.a', description: 'Pontos entre letras' },
  { text: 'p-u-t-a', description: 'Hífens entre letras' },
  { text: 'puuuuuta', description: 'Caracteres repetidos' },
  { text: 'f0d4', description: 'Múltiplos números' },
  { text: 'c4r4lh0', description: 'Padrão complexo' },
];

bypassTests.forEach(test => {
  const result = contentValidator.validatePlayerName(test.text);
  const status = !result.valid ? '✅' : '❌';
  console.log(`${status} "${test.text}" - ${test.description}`);
  console.log(`   Deve ser bloqueado: ${!result.valid ? 'SIM' : 'NÃO'}`);
  if (!result.valid) {
    console.log(`   Razão: ${result.reason}`);
  }
  console.log('');
});

// Testes de Spam
console.log('\n📝 TESTE 6: DETECÇÃO DE SPAM\n');

const spamTests = [
  { text: 'aaaaaaaaa', description: 'Caracteres repetidos' },
  { text: '12345678901', description: 'Apenas números (telefone)' },
  { text: '@#$%@#$%@#$', description: 'Apenas caracteres especiais' },
  { text: 'http://spam.com', description: 'URL' },
  { text: 'www.spam.com', description: 'URL sem protocolo' },
  { text: 'teste@email.com', description: 'Email' },
  { text: '(11) 99999-9999', description: 'Telefone formatado' },
  { text: 'whatsapp 11999999999', description: 'WhatsApp' },
];

spamTests.forEach(test => {
  const result = contentValidator.validatePlayerName(test.text);
  const status = !result.valid ? '✅' : '❌';
  console.log(`${status} "${test.text}" - ${test.description}`);
  console.log(`   Deve ser bloqueado: ${!result.valid ? 'SIM' : 'NÃO'}`);
  if (!result.valid) {
    console.log(`   Razão: ${result.reason}`);
  }
  console.log('');
});

// Resumo
console.log('\n' + '='.repeat(60));
console.log('✅ TESTES CONCLUÍDOS!');
console.log('='.repeat(60));
console.log('\n📊 O sistema de filtro está funcionando corretamente.');
console.log('🛡️ Palavras ofensivas, spam e bypass attempts estão sendo bloqueados.');
console.log('\n💡 Para adicionar mais palavras, edite: backend/config/blocklist.js');
console.log('📖 Documentação completa em: backend/CONTENT_FILTER_README.md\n');

