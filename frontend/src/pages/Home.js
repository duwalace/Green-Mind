import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Stack,
  useTheme,
  useMediaQuery,
  Avatar
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  WaterDrop as WaterIcon,
  Bolt as EnergyIcon,
  WbSunny as ClimateIcon,
  Delete as RecyclingIcon,
  EmojiEvents as TrophyIcon,
  MenuBook as BookIcon,
  Person as PersonIcon,
  Dashboard as DashboardIcon,
  Assignment as AssignmentIcon,
  MilitaryTech as MedalIcon,
  FormatQuote as FormatQuoteIcon
} from '@mui/icons-material';
import BannerCarousel from '../components/BannerCarousel';
import Footer from '../components/Footer';

const features = [
  {
    icon: <WaterIcon sx={{ fontSize: 40, color: '#4FC3F7' }} />,
    title: 'Água',
    description: 'Aprenda sobre conservação de água e práticas sustentáveis',
    color: '#4FC3F7',
    bg: '#fff',
  },
  {
    icon: <EnergyIcon sx={{ fontSize: 40, color: '#FFD600' }} />,
    title: 'Energia',
    description: 'Descubra sobre fontes de energia renovável e eficiência',
    color: '#FFD600',
    bg: '#fff',
  },
  {
    icon: <ClimateIcon sx={{ fontSize: 40, color: '#B6E13A' }} />,
    title: 'Clima',
    description: 'Entenda sobre mudanças climáticas e ações para mitigação',
    color: '#B6E13A',
    bg: '#fff',
  },
  {
    icon: <RecyclingIcon sx={{ fontSize: 40, color: '#174A97' }} />,
    title: 'Reciclagem',
    description: 'Aprenda sobre separação de resíduos e redução de lixo',
    color: '#174A97',
    bg: '#fff',
  }
];

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ m: 0, p: 0 }}>
      {/* Hero Section */}
      <BannerCarousel />

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Typography
          variant="h3"
          component="h2"
          align="center"
          gutterBottom
          sx={{ mb: 2, fontWeight: 600 }}
        >
          Domine os conhecimentos ambientais mais relevantes
        </Typography>
        <Typography
          variant="h6"
          align="center"
          color="text.secondary"
          sx={{ mb: 6, maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}
        >
          Aprenda os principais conceitos e práticas da área ambiental e destaque-se na construção de um futuro sustentável.
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={feature.title} sx={{ display: 'flex', justifyContent: 'center' }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    minWidth: 220,
                    maxWidth: 260,
                    height: 180,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 12px 0 rgba(0,0,0,0.07)',
                    borderRadius: 3,
                    p: 2,
                    background: feature.bg,
                  }}
                  onClick={() => navigate('/trails')}
                >
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 0 }}>
                    <Box
                      sx={{
                        color: feature.color,
                        mb: 2
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography
                      gutterBottom
                      variant="h6"
                      component="h3"
                      sx={{ fontWeight: 600 }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 0 }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Why Choose Section */}
      <Box sx={{ background: 'linear-gradient(180deg, #f8fafc 60%, #fff 100%)', py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            align="center"
            gutterBottom
            sx={{ fontWeight: 700, mb: 2 }}
          >
            Por que escolher o Green Mind?
          </Typography>
          <Typography
            variant="h6"
            align="center"
            color="text.secondary"
            sx={{ mb: 6, maxWidth: 700, mx: 'auto', lineHeight: 1.6 }}
          >
            Nossa plataforma foi criada para tornar o aprendizado sobre meio ambiente uma experiência envolvente, motivadora e transformadora.
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {/* Card 1 */}
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ p: 3, borderRadius: 3, boxShadow: '0 2px 12px 0 rgba(0,0,0,0.07)', height: '100%' }}>
                <Box sx={{ bgcolor: '#FFB300', width: 56, height: 56, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.4 }}>
                    <TrophyIcon sx={{ color: '#fff', fontSize: 32 }} />
                  </motion.div>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Aprendizado Gamificado
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ganhe pontos verdes, desbloqueie conquistas ecológicas e suba de nível enquanto aprende sobre sustentabilidade de forma divertida.
                </Typography>
              </Card>
            </Grid>
            {/* Card 2 */}
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ p: 3, borderRadius: 3, boxShadow: '0 2px 12px 0 rgba(0,0,0,0.07)', height: '100%' }}>
                <Box sx={{ bgcolor: '#FFD600', width: 56, height: 56, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.4, delay: 0.1 }}>
                    <BookIcon sx={{ color: '#fff', fontSize: 32 }} />
                  </motion.div>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Aulas Interativas
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Conteúdo prático com atividades imersivas e desafios que simulam problemas ambientais do mundo real.
                </Typography>
              </Card>
            </Grid>
            {/* Card 3 */}
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ p: 3, borderRadius: 3, boxShadow: '0 2px 12px 0 rgba(0,0,0,0.07)', height: '100%' }}>
                <Box sx={{ bgcolor: '#F06292', width: 56, height: 56, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.4, delay: 0.2 }}>
                    <PersonIcon sx={{ color: '#fff', fontSize: 32 }} />
                  </motion.div>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Perfil Personalizado
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Acompanhe seu progresso, veja suas conquistas ambientais e descubra sua posição no ranking da comunidade verde.
                </Typography>
              </Card>
            </Grid>
            {/* Card 4 */}
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ p: 3, borderRadius: 3, boxShadow: '0 2px 12px 0 rgba(0,0,0,0.07)', height: '100%' }}>
                <Box sx={{ bgcolor: '#4FC3F7', width: 56, height: 56, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.4, delay: 0.3 }}>
                    <DashboardIcon sx={{ color: '#fff', fontSize: 32 }} />
                  </motion.div>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Dashboard Intuitivo
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Interface clara e objetiva que mostra onde você parou e quais conhecimentos ambientais deve explorar em seguida.
                </Typography>
              </Card>
            </Grid>
            {/* Card 5 */}
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ p: 3, borderRadius: 3, boxShadow: '0 2px 12px 0 rgba(0,0,0,0.07)', height: '100%' }}>
                <Box sx={{ bgcolor: '#B6E13A', width: 56, height: 56, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.4, delay: 0.4 }}>
                    <AssignmentIcon sx={{ color: '#fff', fontSize: 32 }} />
                  </motion.div>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Projetos Práticos
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Desenvolva ações e projetos voltados para a preservação ambiental que podem ser usados em seu portfólio pessoal ou comunitário.
                </Typography>
              </Card>
            </Grid>
            {/* Card 6 */}
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ p: 3, borderRadius: 3, boxShadow: '0 2px 12px 0 rgba(0,0,0,0.07)', height: '100%' }}>
                <Box sx={{ bgcolor: '#174A97', width: 56, height: 56, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.4, delay: 0.5 }}>
                    <MedalIcon sx={{ color: '#fff', fontSize: 32 }} />
                  </motion.div>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Conquistas e Medalhas
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Desbloqueie medalhas exclusivas ao dominar conceitos ambientais e completar desafios sustentáveis.
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box sx={{
        py: { xs: 8, md: 12 },
        background: 'linear-gradient(120deg, #174A97 60%, #7C4DFF 100%)',
        position: 'relative',
        boxShadow: '0 8px 32px 0 rgba(23,74,151,0.18)',
      }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Typography
            variant="h3"
            component="h2"
            align="center"
            gutterBottom
            sx={{ fontWeight: 800, mb: 2, color: '#fff', letterSpacing: 1 }}
          >
            Como Funciona
          </Typography>
          <Typography
            variant="h6"
            align="center"
            color="#e0e0e0"
            sx={{ mb: 8, maxWidth: 700, mx: 'auto', lineHeight: 1.6 }}
          >
            Uma jornada simples, interativa e transformadora para você se tornar um agente de mudança ambiental.
          </Typography>
          <Grid container spacing={5} justifyContent="center" alignItems="stretch">
            {/* Passo 1 */}
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 5, borderRadius: 5, boxShadow: '0 8px 32px 0 rgba(23,74,151,0.10)', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'box-shadow 0.2s', '&:hover': { boxShadow: '0 12px 36px 0 rgba(23,74,151,0.18)' } }}>
                <Box sx={{ bgcolor: '#174A97', width: 72, height: 72, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                  <BookIcon sx={{ fontSize: 40, color: '#fff' }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#174A97' }}>
                  Escolha sua trilha
                </Typography>
                <Typography variant="body1" align="center" sx={{ color: '#222', fontWeight: 400 }}>
                  Selecione o tema ambiental que mais combina com você e inicie sua jornada personalizada.
                </Typography>
              </Card>
            </Grid>
            {/* Passo 2 */}
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 5, borderRadius: 5, boxShadow: '0 8px 32px 0 rgba(182,225,58,0.10)', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'box-shadow 0.2s', '&:hover': { boxShadow: '0 12px 36px 0 rgba(182,225,58,0.18)' } }}>
                <Box sx={{ bgcolor: '#B6E13A', width: 72, height: 72, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                  <TrophyIcon sx={{ fontSize: 40, color: '#fff' }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#B6E13A' }}>
                  Aprenda de forma interativa
                </Typography>
                <Typography variant="body1" align="center" sx={{ color: '#222', fontWeight: 400 }}>
                  Participe de quizzes, desafios e atividades gamificadas para fixar o conhecimento de maneira divertida.
                </Typography>
              </Card>
            </Grid>
            {/* Passo 3 */}
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 5, borderRadius: 5, boxShadow: '0 8px 32px 0 rgba(255,179,0,0.10)', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'box-shadow 0.2s', '&:hover': { boxShadow: '0 12px 36px 0 rgba(255,179,0,0.18)' } }}>
                <Box sx={{ bgcolor: '#FFB300', width: 72, height: 72, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                  <DashboardIcon sx={{ fontSize: 40, color: '#fff' }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#FFB300' }}>
                  Provoque impacto positivo
                </Typography>
                <Typography variant="body1" align="center" sx={{ color: '#222', fontWeight: 400 }}>
                  Veja seu progresso, conquiste medalhas e inspire outras pessoas a fazerem a diferença.
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ py: { xs: 6, md: 10 }, background: 'linear-gradient(180deg, #f8fafc 60%, #fff 100%)' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            align="center"
            gutterBottom
            sx={{ fontWeight: 700, mb: 2 }}
          >
            O que dizem nossos alunos
          </Typography>
          <Typography
            variant="h6"
            align="center"
            color="text.secondary"
            sx={{ mb: 8, maxWidth: 700, mx: 'auto', lineHeight: 1.6 }}
          >
            Veja como o Green Mind está transformando a forma de aprender sobre o meio ambiente e sustentabilidade.
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {/* Depoimento 1 */}
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 4, borderRadius: 3, boxShadow: '0 4px 24px 0 rgba(163,133,250,0.07)', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box>
                  <Box sx={{ color: '#a385fa', mb: 2, fontSize: 28 }}>
                    <FormatQuoteIcon sx={{ fontSize: 36, color: '#a385fa', opacity: 0.8 }} />
                  </Box>
                  <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 4 }}>
                    "O Green Mind mudou completamente minha forma de enxergar os problemas ambientais. A abordagem gamificada me mantém engajado e os desafios são realmente motivadores!"
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
                  <Avatar sx={{ width: 48, height: 48, mr: 2 }} src="https://randomuser.me/api/portraits/men/32.jpg" />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      Carlos Silva
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Estudante de Gestão Ambiental
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
            {/* Depoimento 2 */}
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 4, borderRadius: 3, boxShadow: '0 4px 24px 0 rgba(163,133,250,0.07)', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box>
                  <Box sx={{ color: '#a385fa', mb: 2, fontSize: 28 }}>
                    <FormatQuoteIcon sx={{ fontSize: 36, color: '#a385fa', opacity: 0.8 }} />
                  </Box>
                  <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 4 }}>
                    "Comecei sem saber quase nada sobre sustentabilidade e hoje já consigo aplicar práticas ecológicas no meu dia a dia. A plataforma torna tudo mais claro e acessível."
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
                  <Avatar sx={{ width: 48, height: 48, mr: 2 }} src="https://randomuser.me/api/portraits/women/44.jpg" />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      Júlia Torres
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Designer Sustentável
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
            {/* Depoimento 3 */}
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 4, borderRadius: 3, boxShadow: '0 4px 24px 0 rgba(163,133,250,0.07)', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box>
                  <Box sx={{ color: '#a385fa', mb: 2, fontSize: 28 }}>
                    <FormatQuoteIcon sx={{ fontSize: 36, color: '#a385fa', opacity: 0.8 }} />
                  </Box>
                  <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 4 }}>
                    "Os projetos práticos do Green Mind me ajudaram a desenvolver ações ambientais para minha comunidade. Foi fundamental para meu crescimento pessoal e profissional."
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
                  <Avatar sx={{ width: 48, height: 48, mr: 2 }} src="https://randomuser.me/api/portraits/men/43.jpg" />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      Pedro Almeida
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Educador Ambiental
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default Home; 