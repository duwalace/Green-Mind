/**
 * ====================================================
 * FILTRO DE PROFANIDADE - GREEN MIND
 * ====================================================
 * Sistema de filtragem de palavras ofensivas para PT-BR
 * Uso: Quiz (títulos/descrições) e Nicknames (multiplayer)
 * 
 * Implementação própria (sem dependências externas)
 * ====================================================
 */

// ====================================================
// LISTA DE PALAVRAS OFENSIVAS EM PORTUGUÊS (PT-BR)
// ====================================================
const portugueseProfanity = [
  // Palavrões comuns
  'porra', 'caralho', 'merda', 'puta', 'puto', 'foda', 'foder', 'fodido',
  'cacete', 'buceta', 'cu', 'cuzão', 'cuzao', 'pica', 'piroca', 'rola',
  'bosta', 'viado', 'bicha', 'veado', 'arrombado', 'babaca',
  'imbecil', 'desgraça', 'desgraçado',
  'filho da puta', 'fdp', 'pqp', 'vsf', 'vai se fuder', 'vtnc', 'vai tomar no cu',
  'fudido', 'fudida', 'filha da puta',
  
  // Variações com acentuação e erros ortográficos
  'porr4', 'p0rra', 'c4ralho', 'karalho', 'merd4', 'm3rda', 'put4', 'f0da',
  'fod4', 'c4cete', 'buc3ta', 'pik4', 'p1roca', 'r0la', 'b0sta', 'vi4do',
  'bich4', 've4do', 'arr0mbado', 'bab4ca', 'idi0ta', 'imb3cil',
  'ot4rio', 'desgr4ça', 'desgraçad0', 'fud1do', 'fut1da',
  
  // Ofensas discriminatórias
  'macaco', 'neguinho', 'negão', 'crioulo', 'crioula',
  'sapatão', 'traveco', 'boiola', 'baitola',
  
  // Insultos regionais (apenas os mais graves)
  'vagabundo', 'vagabunda', 'piranha', 'galinha', 'rapariga',
  
  // Termos sexuais explícitos
  'pornô', 'porno', 'putaria',
  'broxa', 'gozar', 'gozo', 'punheta', 'masturbação', 'masturbar',
  
  // Combinações e expressões
  'tomar no cu', 'vai se foder', 'vai tomar', 'me chupa', 'chupa aqui',
  'pau no cu', 'cu de', 'filha da puta', 'puta que pariu', 'puta merda',
  'vai toma no cu', 'se fude', 'se foda', 'ta de sacanagem',
  
  // Variações de escrita (leet speak)
  'c4r4lh0', 'p0rr4', 'put4', 'f0d4', 'fud3r', 'fud1d0', 'b0st4',
  'v14d0', 'pir4nh4', 'v4g4bund4',
  'buc3t4', 'buc€t4', 'put@', 'c@ralho'
];

// Lista de palavras em inglês (básica)
const englishProfanity = [
  'fuck', 'shit', 'bitch', 'ass', 'asshole', 'dick', 'pussy', 'cock',
  'damn', 'hell', 'bastard', 'cunt', 'motherfucker', 'nigger', 'fag'
];

// Combinar todas as palavras
let blockedWords = [...portugueseProfanity, ...englishProfanity];

// ====================================================
// CLASSE DE FILTRO
// ====================================================
class ProfanityFilter {
  constructor(customWords = []) {
    this.words = [...blockedWords, ...customWords];
    this.replacementChar = '*';
  }

  /**
   * Adicionar palavras customizadas
   */
  addWords(...words) {
    this.words.push(...words.map(w => w.toLowerCase()));
  }

  /**
   * Remover palavras
   */
  removeWords(...words) {
    this.words = this.words.filter(w => 
      !words.map(word => word.toLowerCase()).includes(w)
    );
  }

  /**
   * Verificar se texto contém profanidade
   */
  isProfane(text) {
    if (!text || typeof text !== 'string') return false;
    
    const lowerText = text.toLowerCase();
    
    // Verificar cada palavra bloqueada
    return this.words.some(word => {
      // Criar regex para detectar a palavra com limites
      const regex = new RegExp(`\\b${this.escapeRegex(word)}\\b|${this.escapeRegex(word)}`, 'i');
      return regex.test(lowerText);
    });
  }

  /**
   * Limpar texto substituindo profanidade por asteriscos
   */
  clean(text) {
    if (!text || typeof text !== 'string') return text;
    
    let cleaned = text;
    
    this.words.forEach(word => {
      const regex = new RegExp(`\\b${this.escapeRegex(word)}\\b|${this.escapeRegex(word)}`, 'gi');
      cleaned = cleaned.replace(regex, this.replacementChar.repeat(word.length));
    });
    
    return cleaned;
  }

  /**
   * Obter lista de palavras bloqueadas
   */
  getList() {
    return [...this.words];
  }

  /**
   * Escapar caracteres especiais de regex
   */
  escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}

// Instância global do filtro
const filter = new ProfanityFilter();

// ====================================================
// CONFIGURAÇÕES
// ====================================================
const REPLACEMENT_CHAR = '*';

const ERROR_MESSAGES = {
  profanity_detected: 'Texto contém linguagem inapropriada',
  profanity_in_nickname: 'Nome de usuário contém linguagem inapropriada',
  profanity_in_quiz: 'Conteúdo do quiz contém linguagem inapropriada'
};

// ====================================================
// FUNÇÕES PRINCIPAIS
// ====================================================

/**
 * Verifica se o texto contém profanidade
 */
function isTextClean(text) {
  if (!text || typeof text !== 'string') {
    return true;
  }
  
  try {
    return !filter.isProfane(text);
  } catch (error) {
    console.error('Erro ao verificar profanidade:', error);
    return true;
  }
}

/**
 * Limpa o texto substituindo profanidade por asteriscos
 */
function cleanText(text) {
  if (!text || typeof text !== 'string') {
    return text;
  }
  
  try {
    return filter.clean(text);
  } catch (error) {
    console.error('Erro ao limpar profanidade:', error);
    return text;
  }
}

/**
 * Valida texto e retorna resultado com mensagem de erro
 */
function validateText(text, context = 'general') {
  if (!text || typeof text !== 'string') {
    return {
      valid: true,
      message: '',
      cleanedText: text
    };
  }
  
  const clean = isTextClean(text);
  
  if (clean) {
    return {
      valid: true,
      message: '',
      cleanedText: text
    };
  }
  
  const cleanedText = cleanText(text);
  let message = ERROR_MESSAGES.profanity_detected;
  
  if (context === 'nickname') {
    message = ERROR_MESSAGES.profanity_in_nickname;
  } else if (context.includes('quiz')) {
    message = ERROR_MESSAGES.profanity_in_quiz;
  }
  
  return {
    valid: false,
    message: message,
    cleanedText: cleanedText
  };
}

/**
 * Middleware Express para validar campos de texto
 */
function validateProfanity(fields = [], autoClean = false) {
  return (req, res, next) => {
    const errors = [];
    
    for (const field of fields) {
      const text = req.body[field];
      
      if (text && typeof text === 'string') {
        const validation = validateText(text, field);
        
        if (!validation.valid) {
          if (autoClean) {
            req.body[field] = validation.cleanedText;
            console.warn(`[PROFANITY FILTER] Campo "${field}" foi limpo automaticamente`);
          } else {
            errors.push({
              field: field,
              message: validation.message
            });
          }
        }
      }
    }
    
    if (errors.length > 0 && !autoClean) {
      return res.status(400).json({
        message: 'Validação falhou: linguagem inapropriada detectada',
        errors: errors
      });
    }
    
    next();
  };
}

/**
 * Adicionar palavras customizadas
 */
function addCustomWords(words) {
  if (Array.isArray(words)) {
    filter.addWords(...words);
    console.log(`[PROFANITY FILTER] ${words.length} palavras customizadas adicionadas`);
  }
}

/**
 * Remover palavras
 */
function removeWords(words) {
  if (Array.isArray(words)) {
    filter.removeWords(...words);
    console.log(`[PROFANITY FILTER] ${words.length} palavras removidas do filtro`);
  }
}

/**
 * Obter lista de palavras bloqueadas
 */
function getBlockedWords() {
  return filter.getList();
}

/**
 * Registra tentativa de uso de profanidade
 */
function logProfanityAttempt(text, context, userId = null) {
  const timestamp = new Date().toISOString();
  const logMessage = `[PROFANITY ATTEMPT] ${timestamp} | Context: ${context} | User: ${userId || 'guest'} | Text: "${text}"`;
  
  console.warn(logMessage);
}

// ====================================================
// EXPORTAÇÕES
// ====================================================
module.exports = {
  // Funções principais
  isTextClean,
  cleanText,
  validateText,
  
  // Middleware Express
  validateProfanity,
  
  // Gestão de palavras
  addCustomWords,
  removeWords,
  getBlockedWords,
  
  // Logs
  logProfanityAttempt,
  
  // Constantes
  ERROR_MESSAGES
};

console.log('✅ Filtro de Profanidade carregado com sucesso!');
console.log(`📊 Total de palavras bloqueadas: ${blockedWords.length}`);
