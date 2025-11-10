import { createTheme } from '@mui/material/styles';

// Paleta Padronizada - Green Mind Professional
const theme = createTheme({
  palette: {
    primary: {
      main: '#2E7D32',      // Verde Principal
      light: '#66BB6A',     // Verde Claro
      dark: '#1B5E20',      // Verde Escuro
    },
    secondary: {
      main: '#00897B',      // Teal Complementar
      light: '#4DB6AC',     // Teal Claro
      dark: '#00695C',      // Teal Escuro
    },
    info: {
      main: '#0277BD',      // Azul Informativo
      light: '#29B6F6',     // Azul Claro
      dark: '#01579B',      // Azul Escuro
    },
    warning: {
      main: '#F57C00',      // Laranja Âmbar
      light: '#FFA726',     // Laranja Claro
      dark: '#E65100',      // Laranja Escuro
    },
    success: {
      main: '#2E7D32',      // Verde (mesma cor primária)
      light: '#66BB6A',
      dark: '#1B5E20',
    },
    error: {
      main: '#D32F2F',      // Vermelho Suave
      light: '#EF5350',
      dark: '#C62828',
    },
    background: {
      default: '#FAFAFA',   // Fundo Claro
      paper: '#FFFFFF',     // Papel Branco
    },
    text: {
      primary: '#424242',   // Texto Principal
      secondary: '#757575', // Texto Secundário
      disabled: '#9E9E9E',  // Texto Desabilitado
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 24px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

export default theme; 