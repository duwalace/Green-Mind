// Blocklist de palavras e expressões ofensivas
// Este arquivo contém termos que serão bloqueados em nomes de usuários e perguntas de quiz

const offensiveWords = [
  // Palavrões comuns
  'puta', 'puto', 'caralho', 'cacete', 'foda', 'foder', 'fodido', 'merda', 
  'bosta', 'cu', 'cuzao', 'cuzão', 'porra', 'pica', 'piroca', 'buceta', 
  'xota', 'xoxota', 'viado', 'bicha', 'veado', 'vadia', 'vagabunda', 
  'arrombado', 'babaca', 'desgraça', 'desgraçado', 'fdp', 'filho da puta',
  'filha da puta', 'pqp', 'pnc', 'vsf', 'vai se foder', 'vai tomar no cu',
  'vai pro inferno', 'corno', 'chifrudo', 'safado', 'safada', 'prostituta',
  'prostituto', 'rapariga', 'galinha', 'trouxa', 'otario', 'otário', 
  'idiota', 'imbecil', 'retardado', 'debil', 'débil', 'burro', 'jumento',
  'palavrao', 'palavrão',
  
  // Variações e bypass attempts comuns
  'p0rra', 'p0rn0', 'c@ralho', 'c4ralho', 'put@', 'b0sta', 'merda',
  'f0der', 'f0da', 'p!ca', 'p1ca', 'buc3ta', 'x0t4', 'v14d0', 'b1ch4',
  
  // Termos racistas e discriminatórios
  'preto', 'macaco', 'crioulo', 'negro', 'negrão', 'negao', 'pretinho',
  'branquelo', 'amarelo', 'japa', 'china', 'pardo', 'mulato', 'cabelo duro',
  'cabelo ruim', 'favelado', 'indigena', 'índio', 'bugre',
  
  // Termos homofóbicos e transfóbicos  
  'gay', 'homo', 'sapa', 'sapatao', 'sapatão', 'lésbica', 'lesbica',
  'traveco', 'travesti', 'transexual', 'trans', 'boiola', 'maricas',
  'baitola', 'fresco', 'bichonas', 'afeminado',
  
  // Termos machistas e misóginos
  'vaca', 'cadela', 'cachorra', 'gostosa', 'gata', 'rabuda', 'rabão',
  'peitos', 'bunduda', 'popozuda', 'piranhas', 'piriguete', 'rodada',
  'oferecida', 'mulher de programa', 'puta de luxo',
  
  // Termos relacionados a violência
  'matar', 'morrer', 'morte', 'suicídio', 'suicida', 'assassino', 'assassina',
  'estupro', 'estuprador', 'violência', 'agressão', 'terrorismo', 'terrorista',
  'bomba', 'explosão', 'ataque', 'arma', 'faca', 'revólver', 'pistola',
  
  // Termos relacionados a drogas
  'maconha', 'drogas', 'cocaína', 'crack', 'heroína', 'ecstasy', 'lsd',
  'baseado', 'beck', 'prensado', 'traficante', 'trafico', 'tráfico',
  'chapado', 'doidão', 'louco', 'pó', 'farinha', 'pino',
  
  // Ofensas religiosas
  'diabo', 'capeta', 'satanas', 'satanás', 'demonio', 'demônio', 'inferno',
  'cristo', 'jesus', 'deus', 'igreja', 'padre', 'pastor', 'bispo',
  'freira', 'catolico', 'católico', 'evangélico', 'evangélica',
  
  // Termos políticos ofensivos
  'corrupto', 'ladrão', 'ladrao', 'bandido', 'vagabundo', 'comunista',
  'nazista', 'fascista', 'ditador', 'golpista', 'miliciano',
  
  // Ofensas gerais
  'lixo', 'nojento', 'escroto', 'asqueroso', 'fedorento', 'porco',
  'imundo', 'seboso', 'gordo', 'obeso', 'baleia', 'elefante', 'magro',
  'anoréxico', 'palito', 'feio', 'horrível', 'monstro', 'aberração',
  
  // Termos de assédio sexual
  'sexo', 'sexual', 'tesão', 'tesao', 'goza', 'gozar', 'prazer', 'orgasmo',
  'masturbação', 'masturbar', 'punheta', 'siririca', 'dedada', 'chupa',
  'chupar', 'mama', 'mamar', 'língua', 'lingua', 'lamber', 'oral',
  
  // Termos de ódio e bullying
  'ódio', 'odio', 'odeio', 'detesto', 'nojo', 'repugnante', 'inferior',
  'superior', 'perfeito', 'merece morrer', 'vai se matar', 'se mata',
  
  // Spam e conteúdo inadequado
  'spam', 'scam', 'golpe', 'fraude', 'roubo', 'fake', 'falso', 'mentira',
  'enganação', 'propaganda', 'anúncio', 'venda', 'compre', 'acesse',
  'clique aqui', 'whatsapp', 'telegram', 'link', 'promoção',
  
  // Palavras relacionadas a conteúdo adulto
  'pornô', 'porno', 'pornografia', 'adulto', 'xxx', 'nudes', 'pelado',
  'pelada', 'nu', 'nua', 'strip', 'stripper', 'webcam', 'only fans',
  'onlyfans', 'privacy', 'cam girl', 'modelo', 'acompanhante',
  
  // Bypass attempts comuns com caracteres especiais
  'p.u.t.a', 'c.u', 'f.o.d.a', 'm.e.r.d.a', 'p u t a', 'c u',
  'f o d a', 'm e r d a', 'p-u-t-a', 'c-u', 'f-o-d-a', 'm-e-r-d-a',
  
  // Números e letras substituídas
  '4ss', '3u', '0u', '1d10t4', 'n3gr0', 'pr3t0', 'v14d0', 'f0d4'
];

// Padrões regex para detectar variações
const offensivePatterns = [
  // Números no meio de palavras (ex: p0rr4, f0d4)
  /p[0o]rr[a4@]/gi,
  /f[0o]d[a4@]/gi,
  /c[a4@]r[a4@]lh[0o]/gi,
  /m[e3]rd[a4@]/gi,
  /b[0o]st[a4@]/gi,
  /put[a4@]/gi,
  /v[i1]ad[0o]/gi,
  /b[i1]ch[a4@]/gi,
  
  // Espaços entre letras (p u t a)
  /p\s*u\s*t\s*a/gi,
  /c\s*u/gi,
  /f\s*o\s*d\s*a/gi,
  /m\s*e\s*r\s*d\s*a/gi,
  
  // Pontos entre letras (p.u.t.a)
  /p\.u\.t\.a/gi,
  /c\.u/gi,
  /f\.o\.d\.a/gi,
  /m\.e\.r\.d\.a/gi,
  
  // Hífens entre letras (p-u-t-a)
  /p-u-t-a/gi,
  /c-u/gi,
  /f-o-d-a/gi,
  /m-e-r-d-a/gi,
  
  // Asteriscos e símbolos (p*ta, f*da)
  /p[*@#$%&]+t[*@#$%&]*a/gi,
  /f[*@#$%&]+d[*@#$%&]*a/gi,
  /c[*@#$%&]+u/gi,
  
  // Repetição de caracteres (puuuuta, foooda)
  /p[uU]{2,}t[aA]/gi,
  /f[oO]{2,}d[aA]/gi,
  /m[eE]{2,}rd[aA]/gi,
  
  // URLs suspeitas
  /https?:\/\//gi,
  /www\./gi,
  /\.com/gi,
  /\.net/gi,
  /\.org/gi,
  
  // Menções a redes sociais e contatos
  /whats.*app/gi,
  /telegram/gi,
  /instagram/gi,
  /facebook/gi,
  /tiktok/gi,
  /twitter/gi,
  /discord/gi,
  
  // Telefones
  /\d{2}\s*9?\d{4}[-.\s]?\d{4}/g,
  /\(\d{2}\)\s*9?\d{4}[-.\s]?\d{4}/g,
  
  // Emails
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
];

// Contextos suspeitos (palavras que quando combinadas podem ser ofensivas)
const suspiciousContexts = [
  ['você', 'é', 'burro'],
  ['vc', 'é', 'burro'],
  ['você', 'é', 'idiota'],
  ['vai', 'se', 'matar'],
  ['mata', 'essa'],
  ['seu', 'lixo'],
  ['é', 'lixo'],
  ['sem', 'vergonha'],
  ['vagabundo', 'safado']
];

module.exports = {
  offensiveWords,
  offensivePatterns,
  suspiciousContexts
};
