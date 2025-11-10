import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Chip,
  Button,
  LinearProgress,
  Divider,
  Stack,
  alpha
} from '@mui/material';
import {
  Palette as PaletteIcon,
  CheckCircle as CheckIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Error as ErrorIcon
} from '@mui/icons-material';

/**
 * Componente de demonstração da paleta de cores padronizada
 * Use esta página como referência visual para todas as cores do sistema
 */
const ColorPaletteDemo = () => {
  const colorSections = [
    {
      title: 'Verde Principal (Primary)',
      description: 'Cor principal do sistema, usada em elementos primários e ações de sucesso',
      colors: [
        { name: 'Escuro', hex: '#1B5E20', usage: 'Hover states, textos' },
        { name: 'Principal', hex: '#2E7D32', usage: 'Botões, links principais' },
        { name: 'Claro', hex: '#66BB6A', usage: 'Backgrounds, gradientes' }
      ]
    },
    {
      title: 'Teal Complementar (Secondary)',
      description: 'Cor secundária para informações complementares',
      colors: [
        { name: 'Escuro', hex: '#00695C', usage: 'Texto em fundos claros' },
        { name: 'Principal', hex: '#00897B', usage: 'Cards, ícones' },
        { name: 'Claro', hex: '#4DB6AC', usage: 'Gradientes' }
      ]
    },
    {
      title: 'Azul Informativo (Info)',
      description: 'Usado para dados informativos e visualizações',
      colors: [
        { name: 'Escuro', hex: '#01579B', usage: 'Texto escuro' },
        { name: 'Principal', hex: '#0277BD', usage: 'Ícones, títulos' },
        { name: 'Claro', hex: '#29B6F6', usage: 'Gradientes, highlights' }
      ]
    },
    {
      title: 'Laranja Âmbar (Warning)',
      description: 'CTAs secundários, alertas e destaques',
      colors: [
        { name: 'Escuro', hex: '#E65100', usage: 'Texto em fundos claros' },
        { name: 'Principal', hex: '#F57C00', usage: 'Botões, alertas' },
        { name: 'Claro', hex: '#FFA726', usage: 'Gradientes' }
      ]
    }
  ];

  const stateColors = [
    { name: 'Sucesso', color: '#2E7D32', bg: '#E8F5E9', icon: <CheckIcon />, description: 'Ações bem-sucedidas' },
    { name: 'Informação', color: '#0277BD', bg: '#E1F5FE', icon: <InfoIcon />, description: 'Mensagens informativas' },
    { name: 'Aviso', color: '#F57C00', bg: '#FFF3E0', icon: <WarningIcon />, description: 'Alertas e atenção' },
    { name: 'Erro', color: '#D32F2F', bg: '#FFEBEE', icon: <ErrorIcon />, description: 'Erros e falhas' }
  ];

  const ColorCard = ({ hex, name, usage }) => (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 3,
        border: '2px solid rgba(0,0,0,0.08)',
        transition: 'all 0.3s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 12px 24px ${alpha(hex, 0.2)}`
        }
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: 80,
          borderRadius: 2,
          bgcolor: hex,
          mb: 2,
          boxShadow: `0 4px 12px ${alpha(hex, 0.3)}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: 'white',
            fontWeight: 700,
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}
        >
          {hex}
        </Typography>
      </Box>
      <Typography variant="subtitle2" fontWeight={700} gutterBottom>
        {name}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {usage}
      </Typography>
    </Paper>
  );

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FAFAFA 0%, #F5F5F5 100%)',
      py: 6
    }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #2E7D32 0%, #66BB6A 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(46, 125, 50, 0.4)'
              }}
            >
              <PaletteIcon sx={{ color: 'white', fontSize: 32 }} />
            </Box>
          </Box>
          <Typography 
            variant="h3" 
            fontWeight={800}
            sx={{
              background: 'linear-gradient(135deg, #2E7D32 0%, #66BB6A 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2
            }}
          >
            Paleta de Cores Padronizada
          </Typography>
          <Typography variant="h6" color="text.secondary" fontWeight={500}>
            Green Mind Professional - Guia Visual de Referência
          </Typography>
        </Box>

        {/* Cores Principais */}
        {colorSections.map((section, idx) => (
          <Box key={idx} sx={{ mb: 6 }}>
            <Typography variant="h5" fontWeight={800} gutterBottom>
              {section.title}
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {section.description}
            </Typography>
            <Grid container spacing={3}>
              {section.colors.map((color, colorIdx) => (
                <Grid item xs={12} sm={6} md={4} key={colorIdx}>
                  <ColorCard {...color} />
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}

        <Divider sx={{ my: 6 }} />

        {/* Estados */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" fontWeight={800} gutterBottom>
            Cores de Estado
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Cores para feedback visual e estados do sistema
          </Typography>
          <Grid container spacing={3}>
            {stateColors.map((state, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    borderRadius: 3,
                    background: `linear-gradient(135deg, ${state.bg} 0%, ${alpha(state.color, 0.1)} 100%)`,
                    border: `2px solid ${alpha(state.color, 0.2)}`,
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: `0 12px 24px ${alpha(state.color, 0.2)}`
                    }
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        bgcolor: state.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                        boxShadow: `0 4px 12px ${alpha(state.color, 0.3)}`
                      }}
                    >
                      {React.cloneElement(state.icon, { sx: { color: 'white', fontSize: 24 } })}
                    </Box>
                    <Typography variant="h6" fontWeight={700} sx={{ color: state.color, mb: 1 }}>
                      {state.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {state.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Divider sx={{ my: 6 }} />

        {/* Exemplos de Uso */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" fontWeight={800} gutterBottom>
            Exemplos de Aplicação
          </Typography>
          <Grid container spacing={3}>
            {/* Botões */}
            <Grid item xs={12} md={6}>
              <Card elevation={0} sx={{ p: 3, borderRadius: 3, border: '2px solid rgba(0,0,0,0.08)' }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Botões
                </Typography>
                <Stack spacing={2}>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      background: 'linear-gradient(135deg, #2E7D32 0%, #66BB6A 100%)',
                      fontWeight: 700,
                      py: 1.5,
                      borderRadius: 2
                    }}
                  >
                    Botão Principal (Verde)
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      background: 'linear-gradient(135deg, #00897B 0%, #4DB6AC 100%)',
                      fontWeight: 700,
                      py: 1.5,
                      borderRadius: 2
                    }}
                  >
                    Botão Secundário (Teal)
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      background: 'linear-gradient(135deg, #0277BD 0%, #29B6F6 100%)',
                      fontWeight: 700,
                      py: 1.5,
                      borderRadius: 2
                    }}
                  >
                    Botão Informativo (Azul)
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      background: 'linear-gradient(135deg, #F57C00 0%, #FFA726 100%)',
                      fontWeight: 700,
                      py: 1.5,
                      borderRadius: 2
                    }}
                  >
                    Botão de Ação (Laranja)
                  </Button>
                </Stack>
              </Card>
            </Grid>

            {/* Chips */}
            <Grid item xs={12} md={6}>
              <Card elevation={0} sx={{ p: 3, borderRadius: 3, border: '2px solid rgba(0,0,0,0.08)' }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Chips e Tags
                </Typography>
                <Stack spacing={2}>
                  <Chip
                    label="Curso Gratuito"
                    sx={{
                      background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
                      color: '#2E7D32',
                      fontWeight: 700,
                      border: '1px solid #A5D6A7'
                    }}
                  />
                  <Chip
                    label="Usuário Ativo"
                    sx={{
                      background: 'linear-gradient(135deg, #E0F2F1 0%, #B2DFDB 100%)',
                      color: '#00897B',
                      fontWeight: 700,
                      border: '1px solid #80CBC4'
                    }}
                  />
                  <Chip
                    label="Informação"
                    sx={{
                      background: 'linear-gradient(135deg, #E1F5FE 0%, #B3E5FC 100%)',
                      color: '#0277BD',
                      fontWeight: 700,
                      border: '1px solid #81D4FA'
                    }}
                  />
                  <Chip
                    label="Destaque"
                    sx={{
                      background: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)',
                      color: '#F57C00',
                      fontWeight: 700,
                      border: '1px solid #FFCC80'
                    }}
                  />
                </Stack>
              </Card>
            </Grid>

            {/* Progress Bars */}
            <Grid item xs={12}>
              <Card elevation={0} sx={{ p: 3, borderRadius: 3, border: '2px solid rgba(0,0,0,0.08)' }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Barras de Progresso
                </Typography>
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="body2" fontWeight={600} color="#2E7D32" gutterBottom>
                      Verde - Taxa de Conclusão: 75%
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={75}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        bgcolor: alpha('#2E7D32', 0.1),
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 5,
                          background: 'linear-gradient(90deg, #2E7D32 0%, #66BB6A 100%)',
                          boxShadow: '0 2px 8px rgba(46, 125, 50, 0.3)'
                        }
                      }}
                    />
                  </Box>
                  <Box>
                    <Typography variant="body2" fontWeight={600} color="#00897B" gutterBottom>
                      Teal - Engajamento: 82%
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={82}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        bgcolor: alpha('#00897B', 0.1),
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 5,
                          background: 'linear-gradient(90deg, #00897B 0%, #4DB6AC 100%)',
                          boxShadow: '0 2px 8px rgba(0, 137, 123, 0.3)'
                        }
                      }}
                    />
                  </Box>
                  <Box>
                    <Typography variant="body2" fontWeight={600} color="#0277BD" gutterBottom>
                      Azul - Conteúdo Publicado: 92%
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={92}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        bgcolor: alpha('#0277BD', 0.1),
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 5,
                          background: 'linear-gradient(90deg, #0277BD 0%, #29B6F6 100%)',
                          boxShadow: '0 2px 8px rgba(2, 119, 189, 0.3)'
                        }
                      }}
                    />
                  </Box>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Footer */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(46, 125, 50, 0.05) 0%, rgba(102, 187, 106, 0.05) 100%)',
            border: '2px solid rgba(46, 125, 50, 0.1)'
          }}
        >
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Documentação Completa
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Para mais informações sobre como usar esta paleta, consulte o arquivo <code>COLOR_PALETTE.md</code>
          </Typography>
          <Typography variant="caption" color="text.disabled">
            Última atualização: Novembro 2025 • Versão 1.0
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default ColorPaletteDemo;

