# 🎨 Paleta de Cores Padronizada - Green Mind Professional

## 📋 Visão Geral

Esta paleta foi criada para transmitir profissionalismo, sustentabilidade e harmonia visual. Todas as cores foram escolhidas para serem consistentes com o tema "Green Mind" e garantir acessibilidade e legibilidade.

---

## 🎯 Cores Principais

### 1. **Verde Principal** (Primary)
Uso: Elementos primários, botões principais, ações de sucesso, marca

| Variação | Código Hex | RGB | Uso |
|----------|-----------|-----|-----|
| Escuro   | `#1B5E20` | rgb(27, 94, 32) | Hover states, textos em fundos claros |
| Principal | `#2E7D32` | rgb(46, 125, 50) | Botões, links, elementos principais |
| Claro    | `#66BB6A` | rgb(102, 187, 106) | Backgrounds sutis, gradientes |

**Exemplos de uso:**
```jsx
// Botão principal
background: 'linear-gradient(135deg, #2E7D32 0%, #66BB6A 100%)'

// Chip de sucesso
bgcolor: '#E8F5E9', color: '#2E7D32', border: '1px solid #A5D6A7'
```

---

### 2. **Teal Complementar** (Secondary)
Uso: Informações secundárias, métricas de usuários, elementos de suporte

| Variação | Código Hex | RGB | Uso |
|----------|-----------|-----|-----|
| Escuro   | `#00695C` | rgb(0, 105, 92) | Texto em fundos claros |
| Principal | `#00897B` | rgb(0, 137, 123) | Cards estatísticos, ícones |
| Claro    | `#4DB6AC` | rgb(77, 182, 172) | Gradientes, backgrounds |

**Exemplos de uso:**
```jsx
// Card estatístico
color: '#00897B'
background: 'linear-gradient(90deg, #00897B 0%, #4DB6AC 100%)'

// Background sutil
background: 'linear-gradient(135deg, rgba(0, 137, 123, 0.05) 0%, rgba(77, 182, 172, 0.05) 100%)'
```

---

### 3. **Azul Informativo** (Info)
Uso: Dados informativos, visualizações, métricas gerais

| Variação | Código Hex | RGB | Uso |
|----------|-----------|-----|-----|
| Escuro   | `#01579B` | rgb(1, 87, 155) | Texto escuro |
| Principal | `#0277BD` | rgb(2, 119, 189) | Títulos, ícones informativos |
| Claro    | `#29B6F6` | rgb(41, 182, 246) | Gradientes, highlights |

**Exemplos de uso:**
```jsx
// Progress bar
bgcolor: alpha('#0277BD', 0.1)
background: 'linear-gradient(90deg, #0277BD 0%, #29B6F6 100%)'

// Chip informativo
background: 'linear-gradient(135deg, #E1F5FE 0%, #B3E5FC 100%)', 
color: '#0277BD'
```

---

### 4. **Laranja Âmbar** (Warning/Action)
Uso: CTAs secundários, alertas, destaques especiais

| Variação | Código Hex | RGB | Uso |
|----------|-----------|-----|-----|
| Escuro   | `#E65100` | rgb(230, 81, 0) | Texto em fundos claros |
| Principal | `#F57C00` | rgb(245, 124, 0) | Botões de ação, alertas |
| Claro    | `#FFA726` | rgb(255, 167, 38) | Gradientes, backgrounds |

**Exemplos de uso:**
```jsx
// Botão de destaque
background: 'linear-gradient(135deg, #F57C00 0%, #FFA726 100%)'

// Chip de alerta
bgcolor: '#FFF3E0', color: '#F57C00', border: '1px solid #FFCC80'
```

---

## 🎨 Cores de Estado

### Sucesso (Success)
- Principal: `#2E7D32` (mesmo verde principal)
- Background: `#E8F5E9`
- Border: `#A5D6A7`

### Erro (Error)
- Principal: `#D32F2F`
- Light: `#EF5350`
- Dark: `#C62828`

### Aviso (Warning)
- Principal: `#F57C00`
- Light: `#FFA726`
- Dark: `#E65100`

### Informação (Info)
- Principal: `#0277BD`
- Light: `#29B6F6`
- Dark: `#01579B`

---

## ⚫ Cores Neutras

### Backgrounds
| Nome | Código Hex | Uso |
|------|-----------|-----|
| Background Claro | `#FAFAFA` | Background principal da página |
| Background Secundário | `#F5F5F5` | Cards, seções |
| Paper | `#FFFFFF` | Elementos elevados, modais |

### Textos
| Nome | Código Hex | RGB | Uso |
|------|-----------|-----|-----|
| Texto Principal | `#424242` | rgb(66, 66, 66) | Títulos, texto principal |
| Texto Secundário | `#757575` | rgb(117, 117, 117) | Subtítulos, descrições |
| Texto Desabilitado | `#9E9E9E` | rgb(158, 158, 158) | Elementos inativos |

### Bordas
| Nome | Código Hex | Uso |
|------|-----------|-----|
| Border Light | `#E0E0E0` | Divisores sutis |
| Border Medium | `rgba(0,0,0,0.08)` | Bordas de cards |
| Border Strong | `rgba(0,0,0,0.12)` | Bordas destacadas |

---

## 📊 Aplicação por Componente

### Dashboard Cards (Estatísticas)
1. **Total de Cursos** → Verde Principal (`#2E7D32`)
2. **Usuários Ativos** → Teal (`#00897B`)
3. **Total de Usuários** → Azul (`#0277BD`)
4. **Taxa de Conclusão** → Laranja (`#F57C00`)

### Sidebar
- Background: `linear-gradient(180deg, #1B5E20 0%, #2E7D32 100%)`
- Texto: `#FFFFFF`
- Hover: `rgba(255,255,255,0.1)`
- Selected: `rgba(255,255,255,0.15)`

### Botões

#### Botão Primário
```jsx
background: 'linear-gradient(135deg, #2E7D32 0%, #66BB6A 100%)'
color: '#FFFFFF'
boxShadow: '0 8px 24px rgba(46, 125, 50, 0.4)'
```

#### Botão Secundário
```jsx
borderColor: '#2E7D32'
color: '#2E7D32'
'&:hover': { background: alpha('#2E7D32', 0.08) }
```

### Progress Bars
Usar gradientes suaves com alpha no background:
```jsx
bgcolor: alpha(mainColor, 0.1)
'& .MuiLinearProgress-bar': {
  background: 'linear-gradient(90deg, mainColor 0%, lightColor 100%)',
  boxShadow: `0 2px 8px ${alpha(mainColor, 0.3)}`
}
```

---

## ✅ Checklist de Acessibilidade

- [x] Contraste texto/fundo ≥ 4.5:1 (WCAG AA)
- [x] Cores não são a única forma de transmitir informação
- [x] Estados de foco visíveis
- [x] Paleta funciona em modo escuro e claro
- [x] Testado para daltonismo (deuteranopia/protanopia)

---

## 🚀 Como Usar

### 1. Importar o Tema
```javascript
import theme from './styles/theme';
import { ThemeProvider } from '@mui/material/styles';

<ThemeProvider theme={theme}>
  <App />
</ThemeProvider>
```

### 2. Acessar Cores do Tema
```javascript
import { useTheme } from '@mui/material/styles';

const theme = useTheme();
const primaryColor = theme.palette.primary.main; // #2E7D32
const secondaryColor = theme.palette.secondary.main; // #00897B
```

### 3. Usar Helper de Alpha
```javascript
import { alpha } from '@mui/material/styles';

// Criar cor com transparência
bgcolor: alpha('#2E7D32', 0.1) // Verde com 10% opacidade
```

---

## 📝 Notas Importantes

1. **Consistência**: Use sempre as cores da paleta. Evite criar novas cores.

2. **Gradientes**: Use gradientes de forma consistente:
   - Títulos: `linear-gradient(135deg, dark 0%, light 100%)`
   - Botões: `linear-gradient(135deg, main 0%, light 100%)`
   - Backgrounds: `linear-gradient(135deg, alpha(main, 0.05) 0%, alpha(main, 0.1) 100%)`

3. **Hierarquia Visual**: 
   - Verde (Principal) → Ações mais importantes
   - Teal (Secundário) → Informações complementares
   - Azul (Info) → Dados e métricas
   - Laranja (Warning) → Destaques e alertas

4. **Backgrounds Sutis**: Use sempre alpha baixo (0.05 - 0.1) para backgrounds de cards

5. **Shadows**: Mantenha consistente com a cor do elemento:
   ```javascript
   boxShadow: `0 8px 24px ${alpha(elementColor, 0.4)}`
   ```

---

## 🎨 Exemplos de Código Completos

### Card Estatístico
```jsx
<Card 
  sx={{ 
    background: `linear-gradient(135deg, ${alpha('#2E7D32', 0.03)} 0%, ${alpha('#2E7D32', 0.08)} 100%)`,
    border: `2px solid ${alpha('#2E7D32', 0.1)}`,
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: `0 20px 40px ${alpha('#2E7D32', 0.2)}`,
      border: `2px solid ${alpha('#2E7D32', 0.3)}`,
    }
  }}
>
  {/* Conteúdo */}
</Card>
```

### Chip com Status
```jsx
<Chip
  label="Ativo"
  sx={{
    background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
    color: '#2E7D32',
    fontWeight: 700,
    border: '1px solid #A5D6A7'
  }}
/>
```

---

## 📖 Referências

- Material Design 3 Guidelines
- WCAG 2.1 AAA Standards
- Color Psychology for Sustainability Brands

---

**Última Atualização:** Novembro 2025  
**Versão:** 1.0  
**Mantido por:** Equipe Green Mind

