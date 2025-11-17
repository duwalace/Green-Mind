// Validador de conteúdo para o frontend
// Sincronizado com backend/utils/contentValidator.js

// Lista simplificada de palavras ofensivas (versão frontend)
const offensiveWords = [
  'puta', 'puto', 'caralho', 'cacete', 'foda', 'foder', 'fodido', 'merda',
  'bosta', 'cu', 'cuzao', 'cuzão', 'porra', 'pica', 'piroca', 'buceta',
  'xota', 'xoxota', 'viado', 'bicha', 'veado', 'vadia', 'vagabunda',
  'arrombado', 'babaca', 'desgraça', 'desgraçado', 'fdp', 'filho da puta',
  'filha da puta', 'pqp', 'pnc', 'vsf', 'vai se foder', 'vai tomar no cu',
  'corno', 'safado', 'safada', 'prostituta', 'prostituto', 'rapariga',
  'otario', 'otário', 'idiota', 'imbecil', 'retardado', 'debil', 'débil',
  'p0rra', 'p0rn0', 'c@ralho', 'c4ralho', 'put@', 'b0sta', 'merda',
  'f0der', 'f0da', 'p!ca', 'p1ca', 'buc3ta', 'x0t4', 'v14d0', 'b1ch4',
  'preto', 'macaco', 'crioulo', 'negro', 'negrão', 'negao',
  'gay', 'homo', 'sapa', 'sapatao', 'sapatão', 'lésbica', 'lesbica',
  'traveco', 'travesti', 'boiola', 'maricas', 'baitola', 'fresco',
  'vaca', 'cadela', 'cachorra', 'gostosa', 'piranhas', 'piriguete',
  'matar', 'morrer', 'morte', 'suicídio', 'suicida', 'assassino',
  'estupro', 'estuprador', 'violência', 'terrorista', 'bomba',
  'maconha', 'drogas', 'cocaína', 'crack', 'heroína', 'ecstasy',
  'baseado', 'beck', 'traficante', 'trafico', 'tráfico',
  'diabo', 'capeta', 'satanas', 'satanás', 'demonio', 'demônio',
  'corrupto', 'ladrão', 'ladrao', 'bandido', 'vagabundo',
  'nazista', 'fascista', 'ditador',
  'lixo', 'nojento', 'escroto', 'asqueroso', 'fedorento', 'porco',
  'gordo', 'obeso', 'baleia', 'magro', 'anoréxico', 'feio', 'horrível',
  'sexo', 'sexual', 'tesão', 'tesao', 'goza', 'gozar', 'orgasmo',
  'masturbação', 'masturbar', 'punheta', 'siririca', 'chupa', 'chupar',
  'ódio', 'odio', 'odeio', 'detesto', 'nojo', 'vai se matar', 'se mata',
  'spam', 'scam', 'golpe', 'fraude', 'fake', 'falso',
  'pornô', 'porno', 'pornografia', 'xxx', 'nudes', 'pelado', 'pelada',
  'stripper', 'webcam', 'only fans', 'onlyfans', 'acompanhante'
];

// Padrões regex para detectar variações
const offensivePatterns = [
  /p[0o]rr[a4@]/gi,
  /f[0o]d[a4@]/gi,
  /c[a4@]r[a4@]lh[0o]/gi,
  /m[e3]rd[a4@]/gi,
  /b[0o]st[a4@]/gi,
  /put[a4@]/gi,
  /v[i1]ad[0o]/gi,
  /b[i1]ch[a4@]/gi,
  /p\s*u\s*t\s*a/gi,
  /c\s*u/gi,
  /f\s*o\s*d\s*a/gi,
  /m\s*e\s*r\s*d\s*a/gi,
  /p\.u\.t\.a/gi,
  /c\.u/gi,
  /f\.o\.d\.a/gi,
  /m\.e\.r\.d\.a/gi,
  /p-u-t-a/gi,
  /c-u/gi,
  /f-o-d-a/gi,
  /m-e-r-d-a/gi,
  /p[*@#$%&]+t[*@#$%&]*a/gi,
  /f[*@#$%&]+d[*@#$%&]*a/gi,
  /c[*@#$%&]+u/gi,
  /p[uU]{2,}t[aA]/gi,
  /f[oO]{2,}d[aA]/gi,
  /m[eE]{2,}rd[aA]/gi,
  /https?:\/\//gi,
  /www\./gi,
  /\.com/gi,
  /\.net/gi,
  /\.org/gi,
  /whats.*app/gi,
  /telegram/gi,
  /instagram/gi,
  /facebook/gi,
  /tiktok/gi,
  /\d{2}\s*9?\d{4}[-.\s]?\d{4}/g,
  /\(\d{2}\)\s*9?\d{4}[-.\s]?\d{4}/g,
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
];

/**
 * Remove acentos e normaliza texto
 */
function normalizeText(text) {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
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
 * Verifica se o texto contém palavras ofensivas
 */
function containsOffensiveWord(text) {
  const normalized = normalizeText(text);
  const cleaned = cleanText(normalized);
  
  for (const word of offensiveWords) {
    const normalizedWord = normalizeText(word);
    
    const wordRegex = new RegExp(`\\b${normalizedWord}\\b`, 'gi');
    if (wordRegex.test(normalized) || wordRegex.test(cleaned)) {
      return { found: true, word };
    }
    
    if (normalized.includes(normalizedWord)) {
      return { found: true, word };
    }
  }
  
  return { found: false };
}

/**
 * Verifica se o texto contém padrões ofensivos
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
 * Verifica spam
 */
function containsSpam(text) {
  if (!text) return { found: false };
  
  // Caracteres repetidos
  const repeatedChars = /(.)\1{3,}/g;
  if (repeatedChars.test(text)) {
    return { found: true, reason: 'Muitos caracteres repetidos' };
  }
  
  // Muitos caracteres especiais
  const specialChars = text.replace(/[a-zA-Z0-9\s]/g, '');
  const specialRatio = specialChars.length / text.length;
  if (specialRatio > 0.5 && text.length > 5) {
    return { found: true, reason: 'Muitos caracteres especiais' };
  }
  
  // Só números
  if (/^\d+$/.test(text.trim()) && text.length > 8) {
    return { found: true, reason: 'Apenas números' };
  }
  
  return { found: false };
}

/**
 * Valida nome de jogador
 */
export function validatePlayerName(name) {
  if (!name || typeof name !== 'string') {
    return {
      valid: false,
      reason: 'Nome é obrigatório'
    };
  }
  
  const trimmed = name.trim();
  
  if (trimmed.length < 2) {
    return {
      valid: false,
      reason: 'Nome deve ter pelo menos 2 caracteres'
    };
  }
  
  if (trimmed.length > 20) {
    return {
      valid: false,
      reason: 'Nome deve ter no máximo 20 caracteres'
    };
  }
  
  // Verifica palavras ofensivas
  const offensiveWord = containsOffensiveWord(trimmed);
  if (offensiveWord.found) {
    return {
      valid: false,
      reason: 'Nome contém conteúdo inadequado. Por favor, escolha outro nome.'
    };
  }
  
  // Verifica padrões ofensivos
  const offensivePattern = containsOffensivePattern(trimmed);
  if (offensivePattern.found) {
    return {
      valid: false,
      reason: 'Nome contém conteúdo inadequado. Por favor, escolha outro nome.'
    };
  }
  
  // Verifica spam
  const spam = containsSpam(trimmed);
  if (spam.found) {
    return {
      valid: false,
      reason: `Nome inválido: ${spam.reason}`
    };
  }
  
  // Verifica caracteres especiais excessivos
  const specialCharsRegex = /[^a-zA-Z0-9\sáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ]/;
  if (specialCharsRegex.test(trimmed)) {
    return {
      valid: false,
      reason: 'Nome não pode conter caracteres especiais'
    };
  }
  
  return {
    valid: true,
    reason: 'Nome válido'
  };
}

/**
 * Valida código de sala
 */
export function validateRoomCode(code) {
  if (!code || typeof code !== 'string') {
    return {
      valid: false,
      reason: 'Código da sala é obrigatório'
    };
  }
  
  const trimmed = code.trim();
  
  if (trimmed.length !== 6) {
    return {
      valid: false,
      reason: 'Código da sala deve ter 6 caracteres'
    };
  }
  
  // Código deve ser alfanumérico
  if (!/^[A-Z0-9]+$/.test(trimmed)) {
    return {
      valid: false,
      reason: 'Código inválido'
    };
  }
  
  return {
    valid: true,
    reason: 'Código válido'
  };
}

export default {
  validatePlayerName,
  validateRoomCode,
  normalizeText,
  cleanText
};

