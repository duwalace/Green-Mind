import React from 'react';
import { Box, Container, Grid, Typography, TextField, InputAdornment, Link } from '@mui/material';

const linkHoverSx = {
  transition: 'color 0.2s, transform 0.2s',
  '&:hover': {
    color: '#B6E13A',
    textDecoration: 'underline',
    transform: 'translateY(-2px) scale(1.05)',
  },
};

const FooterLogged = () => {
  return (
    <Box sx={{ background: '#28589b', color: '#fff', pt: { xs: 8, md: 12 }, pb: 4, mt: 8 }} component="footer">
      <Container maxWidth="lg">
        {/* Chamada para ação (sem botão) */}
        <Grid container alignItems="center" spacing={2} sx={{ mb: 8 }}>
          <Grid item xs={12} md={12} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: '#fff' }}>
              Pronto para começar sua jornada?
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 400, maxWidth: 600, color: '#fff', mx: { xs: 'auto', md: 0 } }}>
              Junte-se a milhares de pessoas que estão aprendendo sobre sustentabilidade de forma divertida e eficiente.
            </Typography>
          </Grid>
        </Grid>

        {/* Links e informações */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          {/* Coluna 1: Logo + descrição + redes sociais */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#fff', mb: 2 }}>
              Mente Verde
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: '#fff' }}>
              Aprenda sobre meio ambiente de forma divertida e gamificada. Transforme seu aprendizado em uma jornada épica com desafios, conquistas e muito conhecimento sustentável.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Link href="#" underline="always" sx={{ color: '#fff', fontStyle: 'italic', fontWeight: 500, ...linkHoverSx }}>Facebook</Link>
              <Link href="#" underline="always" sx={{ color: '#fff', fontStyle: 'italic', fontWeight: 500, ...linkHoverSx }}>Instagram</Link>
              <Link href="#" underline="always" sx={{ color: '#fff', fontStyle: 'italic', fontWeight: 500, ...linkHoverSx }}>Linkedin</Link>
            </Box>
          </Grid>
          {/* Coluna 2: Plataforma */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#fff' }}>
              Plataforma
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/trails" underline="none" sx={{ color: '#fff', fontWeight: 700, ...linkHoverSx }}>Trilhas</Link>
              <Link href="/about" underline="none" sx={{ color: '#fff', fontWeight: 700, ...linkHoverSx }}>Sobre Nós</Link>
              <Link href="/contact" underline="none" sx={{ color: '#fff', fontWeight: 700, ...linkHoverSx }}>Contato</Link>
              <Link href="/faq" underline="none" sx={{ color: '#fff', fontWeight: 700, ...linkHoverSx }}>Perguntas</Link>
            </Box>
          </Grid>
          {/* Coluna 3: Temas Ambientais */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#fff' }}>
              Temas Ambientais
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography sx={{ color: '#fff', fontWeight: 500 }}>Água</Typography>
              <Typography sx={{ color: '#fff', fontWeight: 500 }}>Energia</Typography>
              <Typography sx={{ color: '#fff', fontWeight: 500 }}>Clima</Typography>
              <Typography sx={{ color: '#fff', fontWeight: 500 }}>Reciclagem</Typography>
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
                input: { color: '#28589b', fontWeight: 500, fontSize: 16, p: 1.5 },
                '& fieldset': { border: 'none' },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Box sx={{
                      background: '#B6E13A',
                      color: '#28589b',
                      borderRadius: 2,
                      fontWeight: 700,
                      px: 3,
                      py: 1,
                      minWidth: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      OK
                    </Box>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>

        {/* Rodapé */}
        <Box sx={{ borderTop: '1px solid #fff', pt: 3, mt: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { md: 'center' }, justifyContent: 'space-between', color: '#fff', fontSize: 14 }}>
          <Box sx={{ mb: { xs: 2, md: 0 } }}>
            © {new Date().getFullYear()} Mente Verde. Todos os direitos reservados.
          </Box>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link href="/terms" underline="none" sx={{ color: '#fff', ...linkHoverSx }}>Termos de Uso</Link>
            <Link href="/privacy" underline="none" sx={{ color: '#fff', ...linkHoverSx }}>Política de Privacidade</Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default FooterLogged; 