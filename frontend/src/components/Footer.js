import React from 'react';
import { Box, Container, Grid, Typography, Button, TextField, InputAdornment } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Footer = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Box sx={{ background: '#174A97', color: '#fff', pt: { xs: 8, md: 12 }, pb: 4, mt: 8 }} component="footer">
      <Container maxWidth="lg">
        {/* Chamada para ação */}
        <Grid container alignItems="center" spacing={2} sx={{ mb: 8 }}>
          <Grid item xs={12} md={8}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: '#fff' }}>
              Pronto para começar sua jornada?
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 400, maxWidth: 600, color: '#fff' }}>
              Junte-se a milhares de pessoas que estão aprendendo sobre sustentabilidade de forma divertida e eficiente. Crie sua conta gratuitamente e comece agora mesmo!
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' }, mt: { xs: 2, md: 0 } }}>
            {!isAuthenticated && (
              <Button
                variant="contained"
                size="large"
                sx={{ background: '#B6E13A', color: '#174A97', fontWeight: 700, borderRadius: 2, px: 4, py: 1.5, fontSize: '1.1rem', boxShadow: 'none', '&:hover': { background: '#B6E13A', opacity: 0.9 } }}
                onClick={() => window.location.href = '/register'}
              >
                Criar Conta Gratuita
              </Button>
            )}
          </Grid>
        </Grid>

        {/* Links e informações */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          {/* Coluna 1: Logo + descrição + redes sociais */}
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#fff' }}>
                Green Mind
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 2, color: '#fff' }}>
              Aprenda sobre meio ambiente de forma divertida e gamificada. Transforme seu aprendizado em uma jornada épica com desafios, conquistas e muito conhecimento sustentável.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <a href="#" style={{ color: '#fff' }}><i className="material-icons">facebook</i></a>
              <a href="#" style={{ color: '#fff' }}><i className="material-icons">instagram</i></a>
              <a href="#" style={{ color: '#fff' }}><i className="material-icons">linkedin</i></a>
            </Box>
          </Grid>
          {/* Coluna 2: Plataforma */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#fff' }}>
              Plataforma
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <a href="/trails" style={{ color: '#fff', textDecoration: 'none' }}>Trilhas</a>
              <a href="/about" style={{ color: '#fff', textDecoration: 'none' }}>Sobre Nós</a>
              <a href="/contact" style={{ color: '#fff', textDecoration: 'none' }}>Contato</a>
              <a href="/faq" style={{ color: '#fff', textDecoration: 'none' }}>Perguntas frequentes</a>
            </Box>
          </Grid>
          {/* Coluna 3: Temas Ambientais */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#fff' }}>
              Temas Ambientais
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <a href="/trails" style={{ color: '#fff', textDecoration: 'none' }}>Água</a>
              <a href="/trails" style={{ color: '#fff', textDecoration: 'none' }}>Energia</a>
              <a href="/trails" style={{ color: '#fff', textDecoration: 'none' }}>Clima</a>
              <a href="/trails" style={{ color: '#fff', textDecoration: 'none' }}>Reciclagem</a>
            </Box>
          </Grid>
          {/* Coluna 4: Boletim informativo */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#fff' }}>
              Boletim informativo
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: '#fff' }}>
              Receba dicas, novidades e desafios de sustentabilidade.
            </Typography>
            <TextField
              fullWidth
              placeholder="Seu e-mail"
              variant="outlined"
              sx={{
                bgcolor: '#fff',
                borderRadius: 2,
                input: { color: '#174A97', fontWeight: 500, fontSize: 16, p: 1.5 },
                '& fieldset': { border: 'none' },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      variant="contained"
                      sx={{
                        background: '#B6E13A',
                        color: '#174A97',
                        borderRadius: 2,
                        boxShadow: 'none',
                        fontWeight: 700,
                        px: 3,
                        py: 1,
                        minWidth: 0,
                        '&:hover': { background: '#B6E13A', opacity: 0.9 },
                      }}
                    >
                      OK
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>

        {/* Rodapé */}
        <Box sx={{ borderTop: '1px solid #fff', pt: 3, mt: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { md: 'center' }, justifyContent: 'space-between', color: '#fff', fontSize: 14 }}>
          <Box sx={{ mb: { xs: 2, md: 0 } }}>
            © {new Date().getFullYear()} Green Mind. Todos os direitos reservados.
          </Box>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <a href="/terms" style={{ color: '#fff', textDecoration: 'none' }}>Termos de Uso</a>
            <a href="/privacy" style={{ color: '#fff', textDecoration: 'none' }}>Política de Privacidade</a>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 