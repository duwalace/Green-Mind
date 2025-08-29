import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Container,
  Breadcrumbs,
  Link as MuiLink
} from '@mui/material';
import {
  WaterDrop as WaterIcon,
  Bolt as EnergyIcon,
  WbSunny as ClimateIcon,
  Delete as RecyclingIcon
} from '@mui/icons-material';
import Layout from '../components/Layout';

const trails = [
  {
    id: 1,
    title: 'Água',
    description: 'Aprenda sobre conservação de água, ciclo hidrológico e práticas sustentáveis.',
    icon: <WaterIcon sx={{ fontSize: 60 }} />,
    color: '#2196F3',
    image: '/images/water.jpg',
    levels: 5
  },
  {
    id: 2,
    title: 'Energia',
    description: 'Descubra sobre fontes de energia renovável, eficiência energética e consumo consciente.',
    icon: <EnergyIcon sx={{ fontSize: 60 }} />,
    color: '#FFC107',
    image: '/images/energy.jpg',
    levels: 5
  },
  {
    id: 3,
    title: 'Clima',
    description: 'Entenda sobre mudanças climáticas, efeito estufa e ações para mitigação.',
    icon: <ClimateIcon sx={{ fontSize: 60 }} />,
    color: '#4CAF50',
    image: '/images/climate.jpg',
    levels: 5
  },
  {
    id: 4,
    title: 'Reciclagem',
    description: 'Aprenda sobre separação de resíduos, compostagem e redução de lixo.',
    icon: <RecyclingIcon sx={{ fontSize: 60 }} />,
    color: '#9C27B0',
    image: '/images/recycling.jpg',
    levels: 5
  }
];

const TrailSelection = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      {/* HEADER ESTILO SOBRE */}
      <Box sx={{
        width: '100vw',
        position: 'relative',
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw',
        background: 'linear-gradient(45deg, #FFA000 30%, #FFB300 90%)',
        color: '#fff',
        py: { xs: 8, md: 12 },
        mb: 6
      }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1, fontSize: 18 }}>
            <Box component="a" href="/" sx={{ color: '#fff', fontWeight: 700, textDecoration: 'none', fontFamily: 'inherit', fontSize: 18, opacity: 0.9, '&:hover': { textDecoration: 'underline' } }}>Início</Box>
            <Box sx={{ color: '#fff', mx: 0.5, fontWeight: 400, fontSize: 18, opacity: 0.7 }}>/</Box>
            <Box sx={{ color: '#fff', fontWeight: 400, fontSize: 18, opacity: 0.9 }}>Trilhas</Box>
          </Box>
          <Typography variant="h2" component="h1" sx={{ 
            fontWeight: 800,
            mb: 2,
            fontSize: { xs: '2.5rem', md: '3.5rem' }
          }}>
            Trilhas
          </Typography>
          
          <Typography variant="h6" sx={{ 
            maxWidth: '800px',
            mb: 4,
            opacity: 0.9,
            lineHeight: 1.6
          }}>
            Seja um apoiador do Green Mind, remova anúncios, tenha créditos para certificados e outros benefícios
          </Typography>

          <Typography variant="subtitle1" sx={{ 
            color: '#fff', 
            fontWeight: 400, 
            fontSize: '18px', 
            maxWidth: '800px', 
            fontFamily: 'Asap', 
            opacity: 0.9,
            mt: 2 
          }}>
            Explore nossos trilhas sobre sustentabilidade e meio ambiente
          </Typography>
        </Container>
      </Box>

      {/* Espaço extra entre header e cards */}
      <Box sx={{ height: { xs: 32, md: 56 } }} />

      {/* CARDS DAS TRILHAS */}
      <Box sx={{ background: '#fff', py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center">
            {trails.map((trail) => (
              <Grid item xs={12} sm={6} md={3} key={trail.id}>
                <Card
                  sx={{
                    height: '100%',
                    minHeight: 380,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    borderRadius: 4,
                    boxShadow: '0 2px 16px 0 rgba(44,62,80,0.07)',
                    transition: 'transform 0.18s',
                    '&:hover': {
                      transform: 'translateY(-6px) scale(1.03)',
                      boxShadow: '0 8px 32px 0 rgba(44,62,80,0.13)',
                      cursor: 'pointer',
                    },
                    background: '#fff',
                  }}
                  onClick={() => navigate(`/trails/${trail.id}`)}
                >
                  <Box sx={{
                    width: '100%',
                    height: 140,
                    bgcolor: trail.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                  }}>
                    {React.cloneElement(trail.icon, { sx: { fontSize: 70, color: '#fff' } })}
                  </Box>
                  <CardContent sx={{
                    flexGrow: 1,
                    width: '100%',
                    textAlign: 'center',
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}>
                    <Box>
                      <Typography gutterBottom variant="h6" component="h2" sx={{ fontWeight: 700, color: trail.color, fontSize: '1.25rem', mb: 1 }}>
                        {trail.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 48, lineHeight: 1.6 }}>
                        {trail.description}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="#329C93" sx={{ fontWeight: 600, display: 'block', mb: 2 }}>
                        {trail.levels} níveis de aprendizado
                      </Typography>
                      <Button
                        variant="contained"
                        fullWidth
                        sx={{
                          background: trail.color,
                          color: '#fff',
                          fontWeight: 700,
                          borderRadius: 2,
                          boxShadow: 'none',
                          textTransform: 'none',
                          fontSize: '1rem',
                          py: 1.5,
                          '&:hover': {
                            background: trail.color,
                            opacity: 0.92,
                          },
                        }}
                        onClick={e => {
                          e.stopPropagation();
                          navigate(`/trails/${trail.id}`);
                        }}
                      >
                        Ver trilha
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Layout>
  );
};

export default TrailSelection; 