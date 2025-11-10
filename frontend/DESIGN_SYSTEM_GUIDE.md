# 🎨 Green Mind - Design System Completo
## Guia Profissional de Interface Administrativa

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Paleta de Cores](#paleta-de-cores)
3. [Tipografia](#tipografia)
4. [Layout e Grid](#layout-e-grid)
5. [Componentes UI](#componentes-ui)
6. [Espaçamento](#espaçamento)
7. [Sombras e Elevação](#sombras-e-elevação)
8. [Animações e Transições](#animações-e-transições)
9. [Iconografia](#iconografia)
10. [Plano de Implementação](#plano-de-implementação)

---

## 🎯 Visão Geral

### Princípios de Design

**1. Clareza e Legibilidade**
- Hierarquia visual clara
- Contraste adequado (WCAG AAA quando possível)
- Espaçamento generoso
- Tipografia legível

**2. Profissionalismo**
- Design limpo e moderno
- Cores sóbrias e harmoniosas
- Elementos bem alinhados
- Consistência visual

**3. Sustentabilidade Visual**
- Paleta inspirada na natureza
- Verde como cor protagonista
- Tons terrosos e naturais
- Transmite confiança e responsabilidade

**4. Usabilidade**
- Interface intuitiva
- Feedback visual claro
- Estados bem definidos
- Responsivo e adaptável

---

## 🎨 Paleta de Cores

### Cores Primárias

#### 🟢 Verde Principal (Primary) - Sustentabilidade
**Uso:** Elementos primários, botões principais, ações de sucesso

| Variação | Hex | RGB | HSL | Uso Principal |
|----------|-----|-----|-----|---------------|
| **Dark** | `#1B5E20` | 27, 94, 32 | 125°, 55%, 24% | Hover states, textos |
| **Main** | `#2E7D32` | 46, 125, 50 | 123°, 46%, 34% | Botões, links principais |
| **Light** | `#66BB6A` | 102, 187, 106 | 123°, 40%, 57% | Backgrounds, gradientes |
| **Lighter** | `#A5D6A7` | 165, 214, 167 | 122°, 37%, 74% | Backgrounds sutis |

**Psicologia:** Natureza, crescimento, sustentabilidade, saúde

```jsx
// Exemplo de uso
<Button sx={{
  background: 'linear-gradient(135deg, #2E7D32 0%, #66BB6A 100%)',
  color: '#fff',
  '&:hover': {
    background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)',
  }
}} />
```

---

#### 🔷 Teal Complementar (Secondary) - Inovação
**Uso:** Informações secundárias, métricas de usuários, elementos de suporte

| Variação | Hex | RGB | HSL | Uso Principal |
|----------|-----|-----|-----|---------------|
| **Dark** | `#00695C` | 0, 105, 92 | 173°, 100%, 21% | Textos escuros |
| **Main** | `#00897B` | 0, 137, 123 | 174°, 100%, 27% | Cards, ícones |
| **Light** | `#4DB6AC` | 77, 182, 172 | 174°, 43%, 51% | Gradientes |
| **Lighter** | `#B2DFDB` | 178, 223, 219 | 175°, 39%, 79% | Backgrounds |

**Psicologia:** Confiança, profissionalismo, tecnologia

---

#### 🔵 Azul Informativo (Info) - Dados
**Uso:** Dados informativos, visualizações, métricas, analytics

| Variação | Hex | RGB | HSL | Uso Principal |
|----------|-----|-----|-----|---------------|
| **Dark** | `#01579B` | 1, 87, 155 | 204°, 99%, 31% | Textos, sidebar |
| **Main** | `#0277BD` | 2, 119, 189 | 202°, 98%, 37% | Informações |
| **Light** | `#29B6F6` | 41, 182, 246 | 199°, 92%, 56% | Highlights |
| **Lighter** | `#B3E5FC` | 179, 229, 252 | 199°, 90%, 85% | Backgrounds |

**Psicologia:** Confiança, estabilidade, inteligência

---

#### 🟠 Laranja Âmbar (Action) - Energia
**Uso:** CTAs secundários, alertas importantes, ações especiais

| Variação | Hex | RGB | HSL | Uso Principal |
|----------|-----|-----|-----|---------------|
| **Dark** | `#E65100` | 230, 81, 0 | 21°, 100%, 45% | Textos escuros |
| **Main** | `#F57C00` | 245, 124, 0 | 30°, 100%, 48% | Botões de ação |
| **Light** | `#FFA726` | 255, 167, 38 | 36°, 100%, 57% | Gradientes |
| **Lighter** | `#FFE0B2` | 255, 224, 178 | 36°, 100%, 85% | Backgrounds |

**Psicologia:** Energia, entusiasmo, criatividade, urgência

---

### Cores de Estado

#### ✅ Sucesso (Success)
```css
Primary: #2E7D32    /* Verde Principal */
Light: #66BB6A
Dark: #1B5E20
Background: #E8F5E9
Border: #A5D6A7
```

#### ⚠️ Aviso (Warning)
```css
Primary: #F57C00    /* Laranja */
Light: #FFA726
Dark: #E65100
Background: #FFF3E0
Border: #FFCC80
```

#### ❌ Erro (Error)
```css
Primary: #D32F2F
Light: #EF5350
Dark: #C62828
Background: #FFEBEE
Border: #EF9A9A
```

#### ℹ️ Info (Information)
```css
Primary: #0277BD
Light: #29B6F6
Dark: #01579B
Background: #E1F5FE
Border: #81D4FA
```

---

### Cores Neutras

#### Backgrounds
```css
/* Níveis de Background */
Level 0 (Base):       #FAFAFA      /* Background geral */
Level 1 (Paper):      #FFFFFF      /* Cards, modals */
Level 2 (Elevated):   #F5F5F5      /* Seções secundárias */
Level 3 (Overlay):    rgba(0,0,0,0.6)  /* Modals backdrop */

/* Gradientes de Background */
Dashboard BG: linear-gradient(180deg, #FAFAFA 0%, #F5F5F5 100%)
Card BG: linear-gradient(135deg, #FFFFFF 0%, #FAFAFA 100%)
```

#### Textos
```css
/* Hierarquia de Texto */
Primary:    #212121      /* Títulos principais */
Secondary:  #424242      /* Texto de corpo */
Tertiary:   #757575      /* Descrições, labels */
Disabled:   #9E9E9E      /* Elementos inativos */
Hint:       #BDBDBD      /* Placeholder text */
```

#### Bordas
```css
/* Níveis de Borda */
Light:      #EEEEEE             /* Divisores sutis */
Default:    #E0E0E0             /* Bordas padrão */
Strong:     #BDBDBD             /* Bordas destacadas */
Dark:       rgba(0,0,0,0.12)    /* Bordas em fundos claros */
```

---

## ✍️ Tipografia

### Família de Fontes

```css
/* Font Stack Profissional */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
--font-secondary: 'Poppins', 'Inter', sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
```

**Justificativa:**
- **Inter:** Clareza excepcional, otimizada para telas, moderna
- **Poppins:** Títulos e headers, geométrica e amigável
- **JetBrains Mono:** Código e dados técnicos

### Escala Tipográfica

#### Títulos (Poppins)

```css
/* h1 - Hero Title */
font-family: 'Poppins';
font-size: 40px;
font-weight: 700;
line-height: 1.2;
letter-spacing: -0.5px;
color: #212121;

/* h2 - Page Title */
font-family: 'Poppins';
font-size: 32px;
font-weight: 700;
line-height: 1.25;
letter-spacing: -0.3px;
color: #212121;

/* h3 - Section Title */
font-family: 'Poppins';
font-size: 24px;
font-weight: 600;
line-height: 1.3;
letter-spacing: -0.2px;
color: #424242;

/* h4 - Subsection Title */
font-family: 'Poppins';
font-size: 20px;
font-weight: 600;
line-height: 1.4;
letter-spacing: 0;
color: #424242;

/* h5 - Card Title */
font-family: 'Inter';
font-size: 18px;
font-weight: 600;
line-height: 1.5;
letter-spacing: 0;
color: #424242;

/* h6 - Small Title */
font-family: 'Inter';
font-size: 16px;
font-weight: 600;
line-height: 1.5;
letter-spacing: 0.15px;
color: #757575;
```

#### Corpo de Texto (Inter)

```css
/* Body Large */
font-family: 'Inter';
font-size: 16px;
font-weight: 400;
line-height: 1.6;
letter-spacing: 0.15px;
color: #424242;

/* Body Regular */
font-family: 'Inter';
font-size: 14px;
font-weight: 400;
line-height: 1.5;
letter-spacing: 0.25px;
color: #424242;

/* Body Small */
font-family: 'Inter';
font-size: 12px;
font-weight: 400;
line-height: 1.4;
letter-spacing: 0.4px;
color: #757575;
```

#### Elementos Especiais

```css
/* Button Text */
font-family: 'Inter';
font-size: 14px;
font-weight: 600;
line-height: 1.75;
letter-spacing: 0.4px;
text-transform: uppercase;

/* Caption */
font-family: 'Inter';
font-size: 12px;
font-weight: 400;
line-height: 1.66;
letter-spacing: 0.4px;
color: #757575;

/* Overline */
font-family: 'Inter';
font-size: 10px;
font-weight: 600;
line-height: 2.66;
letter-spacing: 1.5px;
text-transform: uppercase;
color: #9E9E9E;
```

### Implementação em Material-UI

```javascript
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
    h1: {
      fontFamily: "'Poppins', sans-serif",
      fontSize: '2.5rem',    // 40px
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.5px',
    },
    h2: {
      fontFamily: "'Poppins', sans-serif",
      fontSize: '2rem',      // 32px
      fontWeight: 700,
      lineHeight: 1.25,
      letterSpacing: '-0.3px',
    },
    h3: {
      fontFamily: "'Poppins', sans-serif",
      fontSize: '1.5rem',    // 24px
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.2px',
    },
    h4: {
      fontFamily: "'Poppins', sans-serif",
      fontSize: '1.25rem',   // 20px
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.125rem',  // 18px
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1rem',      // 16px
      fontWeight: 600,
      lineHeight: 1.5,
      letterSpacing: '0.15px',
    },
    body1: {
      fontSize: '1rem',      // 16px
      lineHeight: 1.6,
      letterSpacing: '0.15px',
    },
    body2: {
      fontSize: '0.875rem',  // 14px
      lineHeight: 1.5,
      letterSpacing: '0.25px',
    },
    button: {
      fontSize: '0.875rem',  // 14px
      fontWeight: 600,
      letterSpacing: '0.4px',
      textTransform: 'uppercase',
    },
    caption: {
      fontSize: '0.75rem',   // 12px
      lineHeight: 1.66,
      letterSpacing: '0.4px',
    },
    overline: {
      fontSize: '0.625rem',  // 10px
      fontWeight: 600,
      lineHeight: 2.66,
      letterSpacing: '1.5px',
      textTransform: 'uppercase',
    },
  },
});
```

---

## 📐 Layout e Grid

### Estrutura do Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│ SIDEBAR (280px)     │  MAIN CONTENT AREA                    │
│                     │  ┌─────────────────────────────────┐  │
│ ┌─────────────┐    │  │  Header / Breadcrumb            │  │
│ │   Avatar    │    │  │  padding: 24px                  │  │
│ │   Name      │    │  └─────────────────────────────────┘  │
│ └─────────────┘    │                                        │
│                     │  ┌─────────────────────────────────┐  │
│ Navigation Menu     │  │  Stats Cards Grid               │  │
│ • Visão Geral      │  │  4 columns on desktop           │  │
│ • Trilhas          │  │  2 columns on tablet            │  │
│ • Cursos           │  │  1 column on mobile             │  │
│ • Aulas            │  │  gap: 24px                      │  │
│ • Usuários         │  └─────────────────────────────────┘  │
│ • Relatórios       │                                        │
│                     │  ┌─────────────────────────────────┐  │
│ ───────────────     │  │  Charts / Tables                │  │
│                     │  │  Responsive layout              │  │
│ Footer Actions      │  │  padding: 24px                  │  │
│ • Notificações     │  └─────────────────────────────────┘  │
│ • Ajuda            │                                        │
│ • Sair             │                                        │
└─────────────────────────────────────────────────────────────┘
```

### Breakpoints

```javascript
const breakpoints = {
  xs: 0,      // Mobile phones (portrait)
  sm: 600,    // Mobile phones (landscape) / Small tablets
  md: 960,    // Tablets
  lg: 1280,   // Desktops
  xl: 1920,   // Large desktops
  xxl: 2560   // Ultra-wide screens
};
```

### Grid System

```css
/* Container Widths */
.container-sm  { max-width: 640px; }   /* Formulários */
.container-md  { max-width: 768px; }   /* Conteúdo médio */
.container-lg  { max-width: 1024px; }  /* Conteúdo padrão */
.container-xl  { max-width: 1280px; }  /* Dashboards */
.container-xxl { max-width: 1536px; }  /* Wide dashboards */

/* Grid Columns */
12-column grid system
Gap: 24px (desktop), 16px (mobile)
```

### Zonas de Conteúdo

#### 1. Sidebar (Navegação)
```css
Width: 280px (expandida), 80px (collapsed)
Background: linear-gradient(180deg, #1B5E20 0%, #2E7D32 100%)
Position: fixed
Height: 100vh
z-index: 1200
```

#### 2. Header / TopBar
```css
Height: 64px
Background: #FFFFFF
Border-bottom: 1px solid #E0E0E0
Box-shadow: 0 2px 8px rgba(0,0,0,0.05)
Padding: 0 24px
Position: sticky
Top: 0
z-index: 1100
```

#### 3. Main Content Area
```css
Padding: 24px (desktop), 16px (mobile)
Background: #FAFAFA
Min-height: calc(100vh - 64px)
Margin-left: 280px (com sidebar)
```

#### 4. Footer (Opcional)
```css
Height: 48px
Background: #FFFFFF
Border-top: 1px solid #E0E0E0
Padding: 0 24px
Text-align: center
```

---

## 🧩 Componentes UI

### 1. Botões

#### Primary Button (Ação Principal)
```jsx
<Button
  variant="contained"
  sx={{
    background: 'linear-gradient(135deg, #2E7D32 0%, #66BB6A 100%)',
    color: '#FFFFFF',
    padding: '12px 32px',
    fontSize: '14px',
    fontWeight: 600,
    letterSpacing: '0.4px',
    textTransform: 'uppercase',
    borderRadius: '8px',
    boxShadow: '0 8px 24px rgba(46, 125, 50, 0.3)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)',
      boxShadow: '0 12px 32px rgba(46, 125, 50, 0.4)',
      transform: 'translateY(-2px)',
    },
    '&:active': {
      transform: 'translateY(0)',
      boxShadow: '0 4px 16px rgba(46, 125, 50, 0.3)',
    },
    '&:disabled': {
      background: '#BDBDBD',
      color: '#FFFFFF',
      boxShadow: 'none',
    }
  }}
>
  Salvar Curso
</Button>
```

#### Secondary Button (Ação Secundária)
```jsx
<Button
  variant="outlined"
  sx={{
    borderColor: '#2E7D32',
    color: '#2E7D32',
    padding: '12px 32px',
    fontSize: '14px',
    fontWeight: 600,
    letterSpacing: '0.4px',
    textTransform: 'uppercase',
    borderRadius: '8px',
    borderWidth: '2px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      borderWidth: '2px',
      borderColor: '#1B5E20',
      background: 'rgba(46, 125, 50, 0.08)',
      transform: 'translateY(-2px)',
    },
    '&:active': {
      transform: 'translateY(0)',
    }
  }}
>
  Cancelar
</Button>
```

#### Text Button (Ação Terciária)
```jsx
<Button
  variant="text"
  sx={{
    color: '#2E7D32',
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: 600,
    letterSpacing: '0.4px',
    textTransform: 'uppercase',
    borderRadius: '6px',
    '&:hover': {
      background: 'rgba(46, 125, 50, 0.08)',
    }
  }}
>
  Ver Detalhes
</Button>
```

#### Icon Button
```jsx
<IconButton
  sx={{
    width: 40,
    height: 40,
    color: '#757575',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    '&:hover': {
      background: 'rgba(46, 125, 50, 0.08)',
      color: '#2E7D32',
      transform: 'scale(1.05)',
    }
  }}
>
  <EditIcon />
</IconButton>
```

---

### 2. Cards

#### Stats Card (Card Estatístico)
```jsx
<Card
  sx={{
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '16px',
    border: '2px solid transparent',
    background: 'linear-gradient(135deg, rgba(46, 125, 50, 0.03) 0%, rgba(46, 125, 50, 0.08) 100%)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 20px 40px rgba(46, 125, 50, 0.15)',
      border: '2px solid rgba(46, 125, 50, 0.2)',
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '4px',
      background: 'linear-gradient(90deg, #2E7D32 0%, #66BB6A 100%)',
    }
  }}
>
  <CardContent sx={{ p: 3 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #2E7D32 0%, #66BB6A 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 16px rgba(46, 125, 50, 0.3)',
        }}
      >
        <SchoolIcon sx={{ color: '#fff', fontSize: 24 }} />
      </Box>
      <Chip
        label="+12%"
        size="small"
        sx={{
          background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
          color: '#2E7D32',
          fontWeight: 700,
          border: '1px solid #A5D6A7',
        }}
      />
    </Box>
    
    <Typography variant="h3" sx={{ mb: 0.5, color: '#212121', fontWeight: 700 }}>
      1,245
    </Typography>
    
    <Typography variant="body2" sx={{ color: '#757575', fontWeight: 500 }}>
      Total de Cursos
    </Typography>
  </CardContent>
</Card>
```

#### Content Card (Card de Conteúdo)
```jsx
<Card
  elevation={0}
  sx={{
    borderRadius: '12px',
    border: '1px solid #E0E0E0',
    background: '#FFFFFF',
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: '0 12px 24px rgba(0,0,0,0.08)',
      transform: 'translateY(-4px)',
    }
  }}
>
  <CardContent sx={{ p: 3 }}>
    {/* Conteúdo */}
  </CardContent>
</Card>
```

---

### 3. Tables (Tabelas)

```jsx
<TableContainer
  component={Paper}
  elevation={0}
  sx={{
    borderRadius: '12px',
    border: '1px solid #E0E0E0',
    overflow: 'hidden'
  }}
>
  <Table>
    <TableHead>
      <TableRow
        sx={{
          background: 'linear-gradient(135deg, #F5F5F5 0%, #FAFAFA 100%)',
          borderBottom: '2px solid #E0E0E0',
        }}
      >
        <TableCell
          sx={{
            fontWeight: 700,
            fontSize: '14px',
            color: '#424242',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            padding: '16px 24px',
          }}
        >
          Nome do Curso
        </TableCell>
        {/* Mais colunas */}
      </TableRow>
    </TableHead>
    
    <TableBody>
      <TableRow
        sx={{
          transition: 'background 0.2s ease',
          '&:hover': {
            background: 'rgba(46, 125, 50, 0.04)',
          },
          '&:last-child td': {
            borderBottom: 0,
          }
        }}
      >
        <TableCell sx={{ padding: '16px 24px' }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Introdução à Sustentabilidade
          </Typography>
        </TableCell>
        {/* Mais células */}
      </TableRow>
    </TableBody>
  </Table>
</TableContainer>
```

---

### 4. Forms (Formulários)

#### Text Field
```jsx
<TextField
  fullWidth
  label="Título do Curso"
  variant="outlined"
  sx={{
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      background: '#FFFFFF',
      transition: 'all 0.3s ease',
      '& fieldset': {
        borderColor: '#E0E0E0',
        borderWidth: '2px',
      },
      '&:hover fieldset': {
        borderColor: '#2E7D32',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#2E7D32',
        borderWidth: '2px',
      },
    },
    '& .MuiInputLabel-root': {
      color: '#757575',
      fontWeight: 500,
      '&.Mui-focused': {
        color: '#2E7D32',
        fontWeight: 600,
      },
    },
  }}
/>
```

#### Select
```jsx
<FormControl fullWidth>
  <InputLabel>Nível de Dificuldade</InputLabel>
  <Select
    label="Nível de Dificuldade"
    sx={{
      borderRadius: '8px',
      '& .MuiOutlinedInput-notchedOutline': {
        borderWidth: '2px',
        borderColor: '#E0E0E0',
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: '#2E7D32',
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#2E7D32',
        borderWidth: '2px',
      },
    }}
  >
    <MenuItem value="beginner">Iniciante</MenuItem>
    <MenuItem value="intermediate">Intermediário</MenuItem>
    <MenuItem value="advanced">Avançado</MenuItem>
  </Select>
</FormControl>
```

---

### 5. Chips (Tags)

```jsx
{/* Status Chip - Ativo */}
<Chip
  label="Ativo"
  size="small"
  sx={{
    background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
    color: '#2E7D32',
    fontWeight: 700,
    fontSize: '12px',
    border: '1px solid #A5D6A7',
    borderRadius: '6px',
    height: '24px',
  }}
/>

{/* Status Chip - Premium */}
<Chip
  label="Premium"
  size="small"
  icon={<StarIcon sx={{ fontSize: 16 }} />}
  sx={{
    background: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)',
    color: '#F57C00',
    fontWeight: 700,
    fontSize: '12px',
    border: '1px solid #FFCC80',
    borderRadius: '6px',
    height: '24px',
  }}
/>

{/* Status Chip - Rascunho */}
<Chip
  label="Rascunho"
  size="small"
  sx={{
    background: '#F5F5F5',
    color: '#757575',
    fontWeight: 700,
    fontSize: '12px',
    border: '1px solid #E0E0E0',
    borderRadius: '6px',
    height: '24px',
  }}
/>
```

---

### 6. Progress Bars

```jsx
<LinearProgress
  variant="determinate"
  value={75}
  sx={{
    height: 8,
    borderRadius: 4,
    background: 'rgba(46, 125, 50, 0.1)',
    '& .MuiLinearProgress-bar': {
      borderRadius: 4,
      background: 'linear-gradient(90deg, #2E7D32 0%, #66BB6A 100%)',
      boxShadow: '0 2px 8px rgba(46, 125, 50, 0.3)',
    }
  }}
/>

{/* Com label */}
<Box sx={{ width: '100%' }}>
  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
    <Typography variant="body2" sx={{ fontWeight: 600, color: '#424242' }}>
      Progresso do Curso
    </Typography>
    <Typography variant="body2" sx={{ fontWeight: 700, color: '#2E7D32' }}>
      75%
    </Typography>
  </Box>
  <LinearProgress variant="determinate" value={75} sx={{ /* styles */ }} />
</Box>
```

---

### 7. Modals/Dialogs

```jsx
<Dialog
  open={open}
  onClose={handleClose}
  maxWidth="md"
  fullWidth
  PaperProps={{
    sx: {
      borderRadius: '16px',
      boxShadow: '0 24px 64px rgba(0,0,0,0.15)',
    }
  }}
>
  <DialogTitle
    sx={{
      background: 'linear-gradient(135deg, #2E7D32 0%, #66BB6A 100%)',
      color: '#fff',
      padding: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <SchoolIcon sx={{ fontSize: 28 }} />
      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        Criar Novo Curso
      </Typography>
    </Box>
    <IconButton onClick={handleClose} sx={{ color: '#fff' }}>
      <CloseIcon />
    </IconButton>
  </DialogTitle>
  
  <DialogContent sx={{ padding: '32px 24px' }}>
    {/* Conteúdo do formulário */}
  </DialogContent>
  
  <DialogActions sx={{ padding: '16px 24px', borderTop: '1px solid #E0E0E0' }}>
    <Button onClick={handleClose} variant="outlined">
      Cancelar
    </Button>
    <Button onClick={handleSave} variant="contained">
      Salvar
    </Button>
  </DialogActions>
</Dialog>
```

---

### 8. Alerts/Snackbars

```jsx
<Alert
  severity="success"
  sx={{
    borderRadius: '12px',
    border: '2px solid #A5D6A7',
    background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
    boxShadow: '0 8px 16px rgba(46, 125, 50, 0.2)',
    '& .MuiAlert-icon': {
      color: '#2E7D32',
      fontSize: 24,
    },
    '& .MuiAlert-message': {
      fontSize: '14px',
      fontWeight: 600,
      color: '#1B5E20',
    }
  }}
>
  Curso criado com sucesso!
</Alert>
```

---

### 9. Badges

```jsx
<Badge
  badgeContent={4}
  sx={{
    '& .MuiBadge-badge': {
      background: 'linear-gradient(135deg, #F57C00 0%, #FFA726 100%)',
      color: '#fff',
      fontWeight: 700,
      fontSize: '11px',
      height: '20px',
      minWidth: '20px',
      borderRadius: '10px',
      border: '2px solid #fff',
      boxShadow: '0 2px 8px rgba(245, 124, 0, 0.4)',
    }
  }}
>
  <NotificationsIcon />
</Badge>
```

---

## 📏 Espaçamento

### Sistema de Espaçamento (8px base)

```javascript
const spacing = {
  0: '0px',       // 0
  1: '4px',       // 0.5 × 8
  2: '8px',       // 1 × 8
  3: '12px',      // 1.5 × 8
  4: '16px',      // 2 × 8
  5: '20px',      // 2.5 × 8
  6: '24px',      // 3 × 8
  7: '28px',      // 3.5 × 8
  8: '32px',      // 4 × 8
  10: '40px',     // 5 × 8
  12: '48px',     // 6 × 8
  16: '64px',     // 8 × 8
  20: '80px',     // 10 × 8
  24: '96px',     // 12 × 8
};
```

### Guidelines de Uso

#### Padding Interno de Componentes
```css
/* Cards */
padding: 24px;          /* Desktop */
padding: 16px;          /* Mobile */

/* Modais */
padding: 32px 24px;     /* Desktop */
padding: 24px 16px;     /* Mobile */

/* Sidebar */
padding: 16px;          /* Itens de menu */

/* Botões */
padding: 12px 32px;     /* Large */
padding: 10px 24px;     /* Medium */
padding: 8px 16px;      /* Small */
```

#### Margin e Gap entre Elementos
```css
/* Entre cards em grid */
gap: 24px;              /* Desktop */
gap: 16px;              /* Mobile */

/* Entre seções */
margin-bottom: 32px;    /* Desktop */
margin-bottom: 24px;    /* Mobile */

/* Entre títulos e conteúdo */
margin-bottom: 16px;

/* Entre parágrafos */
margin-bottom: 12px;

/* Entre elementos inline */
gap: 8px;
```

#### Espaçamento de Layout
```css
/* Container padding */
padding: 24px;          /* Desktop */
padding: 16px;          /* Mobile */

/* Section spacing */
margin-bottom: 48px;    /* Major sections */
margin-bottom: 32px;    /* Subsections */
margin-bottom: 24px;    /* Components */
```

---

## 🎭 Sombras e Elevação

### Sistema de Elevação (0-24)

```css
/* Level 0 - Flat */
box-shadow: none;

/* Level 1 - Subtle */
box-shadow: 0 2px 4px rgba(0,0,0,0.04);

/* Level 2 - Raised */
box-shadow: 0 2px 8px rgba(0,0,0,0.08);

/* Level 3 - Overlay */
box-shadow: 0 4px 12px rgba(0,0,0,0.10);

/* Level 4 - Sticky */
box-shadow: 0 6px 16px rgba(0,0,0,0.12);

/* Level 6 - Dropdown */
box-shadow: 0 8px 20px rgba(0,0,0,0.14);

/* Level 8 - Modal */
box-shadow: 0 12px 28px rgba(0,0,0,0.16);

/* Level 12 - Popover */
box-shadow: 0 16px 32px rgba(0,0,0,0.18);

/* Level 16 - Menu */
box-shadow: 0 20px 40px rgba(0,0,0,0.20);

/* Level 24 - Max */
box-shadow: 0 24px 48px rgba(0,0,0,0.22);
```

### Sombras Coloridas (para elementos branded)

```css
/* Verde Principal */
box-shadow: 0 8px 24px rgba(46, 125, 50, 0.3);
box-shadow: 0 12px 32px rgba(46, 125, 50, 0.4);    /* Hover */

/* Teal Secundário */
box-shadow: 0 8px 24px rgba(0, 137, 123, 0.3);

/* Azul Info */
box-shadow: 0 8px 24px rgba(2, 119, 189, 0.3);

/* Laranja Action */
box-shadow: 0 8px 24px rgba(245, 124, 0, 0.3);

/* Erro */
box-shadow: 0 8px 24px rgba(211, 47, 47, 0.3);
```

### Uso por Componente

```javascript
// Cards padrão
elevation: 0
border: '1px solid #E0E0E0'

// Cards hover
boxShadow: '0 12px 24px rgba(0,0,0,0.08)'

// Botões primários
boxShadow: '0 8px 24px rgba(46, 125, 50, 0.3)'

// Botões hover
boxShadow: '0 12px 32px rgba(46, 125, 50, 0.4)'

// Modais
boxShadow: '0 24px 64px rgba(0,0,0,0.15)'

// Dropdowns
boxShadow: '0 8px 20px rgba(0,0,0,0.14)'

// Sidebar
boxShadow: '2px 0 12px rgba(0,0,0,0.08)'
```

---

## ⚡ Animações e Transições

### Curvas de Easing

```css
/* Standard - Uso geral */
transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
duration: 300ms;

/* Decelerate - Entrada (in) */
transition-timing-function: cubic-bezier(0.0, 0, 0.2, 1);
duration: 200ms;

/* Accelerate - Saída (out) */
transition-timing-function: cubic-bezier(0.4, 0, 1, 1);
duration: 150ms;

/* Sharp - Movimento rápido e preciso */
transition-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
duration: 200ms;
```

### Transições Comuns

```css
/* Hover genérico */
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

/* Transformações */
transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);

/* Opacidade */
transition: opacity 0.2s ease;

/* Background/Cor */
transition: background 0.3s ease, color 0.3s ease;

/* Sombra */
transition: box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);

/* Combinadas */
transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
            box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```

### Animações com Framer Motion

```jsx
import { motion } from 'framer-motion';

// Fade In
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
>
  {/* Conteúdo */}
</motion.div>

// Slide Up
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
>
  {/* Conteúdo */}
</motion.div>

// Scale In
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.3 }}
>
  {/* Conteúdo */}
</motion.div>

// Hover Animation
<motion.div
  whileHover={{ scale: 1.02, y: -4 }}
  whileTap={{ scale: 0.98 }}
  transition={{ duration: 0.2 }}
>
  {/* Card interativo */}
</motion.div>

// Stagger Children
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }}
>
  {items.map(item => (
    <motion.div
      key={item.id}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
    >
      {/* Item */}
    </motion.div>
  ))}
</motion.div>
```

### Loading States

```jsx
// Skeleton Loading
<Skeleton
  variant="rectangular"
  width="100%"
  height={200}
  sx={{
    borderRadius: '12px',
    background: 'linear-gradient(90deg, #F5F5F5 25%, #EEEEEE 50%, #F5F5F5 75%)',
    backgroundSize: '200% 100%',
    animation: 'loading 1.5s ease-in-out infinite',
    '@keyframes loading': {
      '0%': {
        backgroundPosition: '200% 0',
      },
      '100%': {
        backgroundPosition: '-200% 0',
      },
    },
  }}
/>

// Circular Loading
<CircularProgress
  size={40}
  thickness={4}
  sx={{
    color: '#2E7D32',
    '& .MuiCircularProgress-circle': {
      strokeLinecap: 'round',
    }
  }}
/>

// Button Loading State
<Button
  disabled={loading}
  startIcon={loading && <CircularProgress size={20} />}
>
  {loading ? 'Salvando...' : 'Salvar'}
</Button>
```

---

## 🎨 Iconografia

### Biblioteca de Ícones
**Material Icons** - Consistente, profissional, completa

```jsx
import {
  Dashboard,
  School,
  MenuBook,
  People,
  Assessment,
  Settings,
  Notifications,
  Add,
  Edit,
  Delete,
  Save,
  Close,
  Check,
  Error,
  Warning,
  Info,
} from '@mui/icons-material';
```

### Tamanhos de Ícones

```css
/* Extra Small */
fontSize: 16px;      /* Badges, chips */

/* Small */
fontSize: 20px;      /* Buttons, inputs */

/* Medium (padrão) */
fontSize: 24px;      /* Menu, toolbar */

/* Large */
fontSize: 32px;      /* Headers, hero sections */

/* Extra Large */
fontSize: 48px;      /* Empty states, ilustrações */
```

### Cores de Ícones

```css
/* Primary */
color: #2E7D32;      /* Ações principais */

/* Secondary */
color: #757575;      /* Ícones informativos */

/* Disabled */
color: #BDBDBD;      /* Ícones desabilitados */

/* On Primary */
color: #FFFFFF;      /* Ícones em backgrounds coloridos */

/* Error */
color: #D32F2F;      /* Ícones de erro */

/* Warning */
color: #F57C00;      /* Ícones de alerta */

/* Success */
color: #2E7D32;      /* Ícones de sucesso */

/* Info */
color: #0277BD;      /* Ícones informativos */
```

### Ícones com Background

```jsx
<Box
  sx={{
    width: 48,
    height: 48,
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #2E7D32 0%, #66BB6A 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 16px rgba(46, 125, 50, 0.3)',
  }}
>
  <SchoolIcon sx={{ color: '#fff', fontSize: 24 }} />
</Box>
```

---

## 📋 Plano de Implementação

### Fase 1: Fundação (1-2 dias)

#### ✅ Setup Inicial
- [ ] Instalar fontes (Inter, Poppins)
- [ ] Atualizar theme.js com nova tipografia
- [ ] Criar arquivo de variáveis CSS globais
- [ ] Implementar sistema de espaçamento
- [ ] Configurar Framer Motion

```bash
# Instalar dependências
npm install framer-motion
npm install @fontsource/inter @fontsource/poppins
```

```javascript
// index.js - Importar fontes
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
```

---

### Fase 2: Componentes Base (2-3 dias)

#### ✅ Criar/Atualizar Componentes
- [ ] Botões (Primary, Secondary, Text, Icon)
- [ ] Inputs (TextField, Select, Checkbox, Radio)
- [ ] Cards (Stats, Content, Interactive)
- [ ] Chips/Tags
- [ ] Progress Bars
- [ ] Alerts/Notifications

**Arquivo:** `frontend/src/components/common/`

```
components/
  common/
    Button.js
    Card.js
    TextField.js
    Select.js
    Chip.js
    ProgressBar.js
    Alert.js
```

---

### Fase 3: Layout Dashboard (2-3 dias)

#### ✅ Redesign do Dashboard Principal
- [ ] **DashboardSidebar.js** - Atualizar gradiente para verde
- [ ] **DashboardOverview.js** - Aplicar novos cards estatísticos
- [ ] **Header/TopBar** - Criar se não existir
- [ ] **Layout responsivo** - Grid de cards
- [ ] **Animações de entrada** - Framer Motion

**Prioridades:**
1. Sidebar com gradiente verde (`#1B5E20` → `#2E7D32`)
2. Cards estatísticos com novo design
3. Gráficos com nova paleta
4. Tabelas com hover states

---

### Fase 4: Páginas Admin (3-4 dias)

#### ✅ Atualizar Páginas Existentes
- [ ] **AdminCourses.js**
  - Header com gradiente teal
  - Tabela redesenhada
  - Modais atualizados
  - Botões de ação
  
- [ ] **AdminTrails.js**
  - Cards de trilhas
  - Formulários
  - Status chips
  
- [ ] **AdminUsers.js**
  - Tabela de usuários
  - Filtros e busca
  - Badges de roles
  
- [ ] **AdminLessons.js**
  - Lista de aulas
  - Editor de conteúdo
  - Preview de vídeo
  
- [ ] **DashboardReports.js**
  - Gráficos atualizados
  - Cards de métricas
  - Export de relatórios

---

### Fase 5: Componentes Especializados (2-3 dias)

#### ✅ Criar Componentes Novos
- [ ] **DataTable Component** - Tabela reutilizável com sorting/filtering
- [ ] **StatCard Component** - Card estatístico padronizado
- [ ] **ChartCard Component** - Card para gráficos
- [ ] **EmptyState Component** - Estados vazios
- [ ] **LoadingState Component** - Estados de carregamento
- [ ] **ConfirmDialog Component** - Modal de confirmação

---

### Fase 6: Refinamento Visual (2-3 dias)

#### ✅ Polimento Final
- [ ] Revisar todos os espaçamentos
- [ ] Aplicar sombras consistentes
- [ ] Adicionar animações de transição
- [ ] Testar responsividade
- [ ] Ajustar contrastes
- [ ] Validar acessibilidade

---

### Fase 7: Otimização (1-2 dias)

#### ✅ Performance e UX
- [ ] Lazy loading de imagens
- [ ] Skeleton screens
- [ ] Otimizar animações
- [ ] Code splitting
- [ ] Bundle size optimization

---

### Fase 8: Documentação (1 dia)

#### ✅ Documentar Sistema
- [ ] Criar Storybook (opcional)
- [ ] Documentar componentes
- [ ] Criar guia de uso
- [ ] Screenshots do antes/depois

---

## 🎯 Checklist de Qualidade

### Visual
- [ ] Paleta de cores consistente em todos os componentes
- [ ] Tipografia hierárquica e legível
- [ ] Espaçamentos uniformes (sistema 8px)
- [ ] Sombras aplicadas corretamente
- [ ] Bordas arredondadas (8-16px)
- [ ] Gradientes suaves e profissionais

### UX
- [ ] Feedback visual em todas as interações
- [ ] Estados de loading visíveis
- [ ] Estados de erro claros
- [ ] Transições suaves (300ms)
- [ ] Hover states definidos
- [ ] Focus states acessíveis

### Responsividade
- [ ] Mobile (< 600px) - Layout vertical
- [ ] Tablet (600-960px) - Grid 2 colunas
- [ ] Desktop (> 960px) - Grid 4 colunas
- [ ] Sidebar responsiva (collapse em mobile)
- [ ] Tipografia escalonável

### Acessibilidade
- [ ] Contraste WCAG AA (mínimo 4.5:1)
- [ ] Labels em todos os inputs
- [ ] ARIA labels quando necessário
- [ ] Navegação por teclado
- [ ] Focus visível
- [ ] Textos alternativos em imagens

### Performance
- [ ] Imagens otimizadas (WebP)
- [ ] Lazy loading
- [ ] Memoização de componentes
- [ ] Code splitting por rota
- [ ] Bundle size < 500KB (inicial)

---

## 🛠️ Ferramentas Recomendadas

### Design
- **Figma** - Protótipos e mockups
- **Coolors.co** - Paletas de cores
- **Type Scale** - Escala tipográfica
- **Contrast Checker** - Verificar contraste WCAG

### Desenvolvimento
- **Material-UI** - Componentes base
- **Framer Motion** - Animações
- **React Hook Form** - Formulários
- **Recharts** - Gráficos
- **React Table** - Tabelas complexas

### Testes
- **Lighthouse** - Performance e acessibilidade
- **WAVE** - Acessibilidade web
- **BrowserStack** - Testes cross-browser

---

## 📖 Referências e Inspirações

### Design Systems
- Material Design 3 (Google)
- Ant Design
- Chakra UI
- Radix UI

### Dashboards de Referência
- Stripe Dashboard
- Linear App
- Notion
- Vercel Dashboard

### Princípios
- Laws of UX
- Nielsen Norman Group
- WCAG 2.1 Guidelines
- Google UX Playbook

---

## 📞 Próximos Passos

### Imediato
1. Revisar este documento com a equipe
2. Aprovar paleta de cores e tipografia
3. Criar protótipo no Figma (opcional)
4. Iniciar Fase 1 (Setup)

### Curto Prazo (1-2 semanas)
1. Implementar componentes base
2. Redesign do dashboard principal
3. Atualizar páginas admin
4. Testes de usabilidade

### Longo Prazo (1 mês+)
1. Modo escuro (dark mode)
2. Personalização de temas
3. Biblioteca de componentes
4. Design tokens documentados

---

**✨ Última Atualização:** Novembro 2025  
**📄 Versão:** 1.0  
**👥 Equipe:** Green Mind Development Team

---

> **Nota:** Este é um documento vivo. Atualize conforme necessário durante o desenvolvimento. Mantenha a consistência e a qualidade visual em primeiro lugar.


