const { offensiveWords, offensivePatterns, suspiciousContexts } = require('../config/blocklist');

/**
 * Remove acentos e normaliza texto para comparação
 */
function normalizeText(text) {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .trim();
}

/**
 * Remove caracteres especiais mantendo apenas letras, números e espaços
 */
function cleanText(text) {
  if (!text) return '';
  
  return text
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Verifica se o texto contém palavras ofensivas da blocklist
 */
function containsOffensiveWord(text) {
  const normalized = normalizeText(text);
  const cleaned = cleanText(normalized);
  
  // Verifica palavras exatas
  for (const word of offensiveWords) {
    const normalizedWord = normalizeText(word);
    
    // Verifica palavra completa (com espaços ou início/fim do texto)
    const wordRegex = new RegExp(`\\b${normalizedWord}\\b`, 'gi');
    if (wordRegex.test(normalized) || wordRegex.test(cleaned)) {
      return { found: true, word };
    }
    
    // Verifica substring (para palavras compostas)
    if (normalized.includes(normalizedWord)) {
      return { found: true, word };
    }
  }
  
  return { found: false };
}

/**
 * Verifica se o texto contém padrões ofensivos usando regex
 */
function containsOffensivePattern(text) {
  const normalized = normalizeText(text);
  
  for (const pattern of offensivePatterns) {
    if (pattern.test(text) || pattern.test(normalized)) {
      return { found: true, pattern: pattern.source };
    }
  }
  
  return { found: false };
}

/**
 * Verifica contextos suspeitos (combinações de palavras)
 */
function containsSuspiciousContext(text) {
  const normalized = normalizeText(text);
  const words = normalized.split(/\s+/);
  
  for (const context of suspiciousContexts) {
    let allFound = true;
    for (const word of context) {
      if (!words.includes(normalizeText(word))) {
        allFound = false;
        break;
      }
    }
    
    if (allFound) {
      return { found: true, context: context.join(' ') };
    }
  }
  
  return { found: false };
}

/**
 * Verifica se o texto contém muitos caracteres repetidos (spam)
 */
function containsSpam(text) {
  if (!text) return { found: false };
  
  // Verifica caracteres repetidos (mais de 3 vezes seguidas)
  const repeatedChars = /(.)\1{3,}/g;
  if (repeatedChars.test(text)) {
    return { found: true, reason: 'Muitos caracteres repetidos' };
  }
  
  // Verifica se tem mais de 50% de caracteres especiais
  const specialChars = text.replace(/[a-zA-Z0-9\s]/g, '');
  const specialRatio = specialChars.length / text.length;
  if (specialRatio > 0.5 && text.length > 5) {
    return { found: true, reason: 'Muitos caracteres especiais' };
  }
  
  // Verifica se é só números
  if (/^\d+$/.test(text.trim()) && text.length > 8) {
    return { found: true, reason: 'Apenas números' };
  }
  
  return { found: false };
}

/**
 * Valida conteúdo completo (nome, pergunta, título, etc)
 * @param {string} text - Texto a ser validado
 * @param {object} options - Opções de validação
 * @returns {object} { valid: boolean, reason: string }
 */
function validateContent(text, options = {}) {
  const {
    minLength = 2,
    maxLength = 200,
    allowNumbers = true,
    allowSpecialChars = true,
    fieldName = 'campo'
  } = options;
  
  // Verificações básicas
  if (!text || typeof text !== 'string') {
    return {
      valid: false,
      reason: `${fieldName} é obrigatório`
    };
  }
  
  const trimmed = text.trim();
  
  if (trimmed.length < minLength) {
    return {
      valid: false,
      reason: `${fieldName} deve ter pelo menos ${minLength} caracteres`
    };
  }
  
  if (trimmed.length > maxLength) {
    return {
      valid: false,
      reason: `${fieldName} deve ter no máximo ${maxLength} caracteres`
    };
  }
  
  // Verifica se não é apenas espaços
  if (trimmed.length === 0) {
    return {
      valid: false,
      reason: `${fieldName} não pode conter apenas espaços`
    };
  }
  
  // Verifica palavras ofensivas
  const offensiveWord = containsOffensiveWord(trimmed);
  if (offensiveWord.found) {
    return {
      valid: false,
      reason: `${fieldName} contém conteúdo inadequado. Por favor, use linguagem apropriada.`
    };
  }
  
  // Verifica padrões ofensivos
  const offensivePattern = containsOffensivePattern(trimmed);
  if (offensivePattern.found) {
    return {
      valid: false,
      reason: `${fieldName} contém conteúdo inadequado. Por favor, use linguagem apropriada.`
    };
  }
  
  // Verifica contextos suspeitos
  const suspiciousContext = containsSuspiciousContext(trimmed);
  if (suspiciousContext.found) {
    return {
      valid: false,
      reason: `${fieldName} contém conteúdo inadequado. Por favor, use linguagem apropriada.`
    };
  }
  
  // Verifica spam
  const spam = containsSpam(trimmed);
  if (spam.found) {
    return {
      valid: false,
      reason: `${fieldName} contém formato inválido: ${spam.reason}`
    };
  }
  
  // Verifica se permite números
  if (!allowNumbers && /\d/.test(trimmed)) {
    return {
      valid: false,
      reason: `${fieldName} não pode conter números`
    };
  }
  
  // Verifica caracteres especiais excessivos
  if (!allowSpecialChars) {
    const specialCharsRegex = /[^a-zA-Z0-9\sáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ]/;
    if (specialCharsRegex.test(trimmed)) {
      return {
        valid: false,
        reason: `${fieldName} contém caracteres não permitidos`
      };
    }
  }
  
  return {
    valid: true,
    reason: 'Conteúdo válido'
  };
}

/**
 * Valida nome de usuário/jogador
 */
function validatePlayerName(name) {
  return validateContent(name, {
    minLength: 2,
    maxLength: 20,
    allowNumbers: true,
    allowSpecialChars: false,
    fieldName: 'Nome'
  });
}

/**
 * Valida título de quiz
 */
function validateQuizTitle(title) {
  return validateContent(title, {
    minLength: 3,
    maxLength: 100,
    allowNumbers: true,
    allowSpecialChars: true,
    fieldName: 'Título'
  });
}

/**
 * Valida descrição de quiz
 */
function validateQuizDescription(description) {
  if (!description || description.trim().length === 0) {
    return { valid: true, reason: 'Descrição é opcional' };
  }
  
  return validateContent(description, {
    minLength: 10,
    maxLength: 500,
    allowNumbers: true,
    allowSpecialChars: true,
    fieldName: 'Descrição'
  });
}

/**
 * Valida pergunta de quiz
 */
function validateQuizQuestion(question) {
  return validateContent(question, {
    minLength: 10,
    maxLength: 500,
    allowNumbers: true,
    allowSpecialChars: true,
    fieldName: 'Pergunta'
  });
}

/**
 * Valida opções de resposta
 */
function validateQuizOptions(options) {
  if (!Array.isArray(options)) {
    return {
      valid: false,
      reason: 'Opções devem ser um array'
    };
  }
  
  if (options.length < 2) {
    return {
      valid: false,
      reason: 'Deve haver pelo menos 2 opções de resposta'
    };
  }
  
  // Valida cada opção
  for (let i = 0; i < options.length; i++) {
    const validation = validateContent(options[i], {
      minLength: 1,
      maxLength: 200,
      allowNumbers: true,
      allowSpecialChars: true,
      fieldName: `Opção ${i + 1}`
    });
    
    if (!validation.valid) {
      return validation;
    }
  }
  
  return {
    valid: true,
    reason: 'Opções válidas'
  };
}

/**
 * Valida explicação da resposta
 */
function validateQuizExplanation(explanation) {
  if (!explanation || explanation.trim().length === 0) {
    return { valid: true, reason: 'Explicação é opcional' };
  }
  
  return validateContent(explanation, {
    minLength: 10,
    maxLength: 1000,
    allowNumbers: true,
    allowSpecialChars: true,
    fieldName: 'Explicação'
  });
}

module.exports = {
  validateContent,
  validatePlayerName,
  validateQuizTitle,
  validateQuizDescription,
  validateQuizQuestion,
  validateQuizOptions,
  validateQuizExplanation,
  normalizeText,
  cleanText
};

