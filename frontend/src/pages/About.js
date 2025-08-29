import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';

// Styled components
const Section = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 0),
  backgroundColor: '#f5f5f5',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  textAlign: 'center',
  color: theme.palette.primary.main,
  fontWeight: 'bold',
}));

const TeamMemberCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
  },
}));

const About = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const teamMembers = [
    {
      name: 'João Silva',
      role: 'CEO & Fundador',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      description: 'Visionário apaixonado por sustentabilidade e inovação.'
    },
    {
      name: 'Maria Santos',
      role: 'Diretora de Sustentabilidade',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      description: 'Especialista em práticas sustentáveis e desenvolvimento ambiental.'
    },
    {
      name: 'Pedro Oliveira',
      role: 'CTO',
      image: 'https://randomuser.me/api/portraits/men/43.jpg',
      description: 'Líder em tecnologia e soluções inovadoras.'
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{
        background: 'linear-gradient(45deg, #1b5e20 30%, #2e7d32 90%)',
        color: '#fff',
        py: { xs: 8, md: 12 },
        mb: 6
      }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1, fontSize: 18 }}>
            <Box component="a" href="/" sx={{ color: '#fff', fontWeight: 700, textDecoration: 'none', fontFamily: 'inherit', fontSize: 18, opacity: 0.9, '&:hover': { textDecoration: 'underline' } }}>Início</Box>
            <Box sx={{ color: '#fff', mx: 0.5, fontWeight: 400, fontSize: 18, opacity: 0.7 }}>/</Box>
            <Box sx={{ color: '#fff', fontWeight: 400, fontSize: 18, opacity: 0.9 }}>Sobre</Box>
          </Box>
          <Typography variant="h2" component="h1" sx={{ 
            fontWeight: 800,
            mb: 2,
            fontSize: { xs: '2.5rem', md: '3.5rem' }
          }}>
            Sobre
          </Typography>
          
          <Typography variant="h6" sx={{ 
            maxWidth: '800px',
            mb: 4,
            opacity: 0.9,
            lineHeight: 1.6
          }}>
            Se ja um apoiador do Green Mind, remova anúncios, tenha créditos para certificados e outros benefícios
          </Typography>
        </Container>
      </Box>

      {/* Sobre Profissional Section */}
      <Box sx={{ background: '#fff', py: { xs: 6, md: 10 } }}>
        <Container sx={{ maxWidth: '1150px', px: { xs: 1, sm: 2, md: 4 }, mx: 'auto' }}>
          <Grid container spacing={{ xs: 4, md: 6 }} columnSpacing={{ xs: 0, md: 6, lg: 8 }} alignItems="stretch" justifyContent="center" sx={{ maxWidth: '100%', width: '100%' }}>
            {/* Texto 2 - Eduardo Walace */}
            <Grid item xs={12} md={5} sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-end' }, justifyContent: 'center', pb: { xs: 4, md: 0 }, height: { md: '100%' }, maxWidth: '100%' }}>
              <Box sx={{ width: { xs: '80%', sm: 260, md: 320, lg: 340 }, maxWidth: 340, height: 'auto', maxHeight: 400, borderRadius: 3, overflow: 'hidden', mb: 3, boxShadow: 2, background: '#e0e0e0', display: 'flex', alignItems: 'stretch', justifyContent: 'center' }}>
                <img src="/gruposobre.webp" alt="Eduardo Walace" style={{ width: '100%', height: 'auto', objectFit: 'cover', display: 'block' }} />
              </Box>
              <Typography variant="h6" sx={{ fontFamily: 'Catamaran', fontWeight: 700, mb: 1, textAlign: 'right', color: '#3A3A3A', fontSize: '20px', width: '100%' }}>
                Sobre o Grupo
              </Typography>
              <Typography variant="body2" sx={{ color: '#261C3F', textAlign: 'right', mb: 1, fontSize: '16px', fontFamily: 'Asap', fontWeight: 400, width: '100%' }}>
                
                Somos um grupo de estudantes do curso de Análise e Desenvolvimento de Sistemas (ADS) do SENAI Taubaté, atualmente engajados no desenvolvimento do projeto GreenMind. Nosso time é formado por Eduardo Walace, Davi Rocha, Gabrielly Santos Ferreira, Jarede de Santi, Lucas Azeredo e Lucas Kauan. Juntos, unimos nossas habilidades, conhecimentos e criatividade com o objetivo de construir uma solução inovadora e funcional.<br /><br />
                Cada integrante contribui de forma única para o andamento do projeto, e estamos comprometidos em aplicar na prática tudo o que aprendemos ao longo do curso, buscando crescimento profissional e pessoal ao longo do processo.
              </Typography>
            </Grid>
            {/* Texto 1 - Plataforma Green Mind */}
            <Grid item xs={12} md={7} sx={{ display: 'flex', alignItems: 'stretch', maxWidth: '100%' }}>
              <Card sx={{ background: '#F2FAFC', boxShadow: 2, borderRadius: 4, p: { xs: 2, sm: 3, md: 5 }, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%', minHeight: { xs: 'auto', md: 340 } }}>
                <Typography variant="h4" sx={{ fontFamily: 'Roboto', fontWeight: 400, mb: 2, color: '#222', fontSize: { xs: '2rem', sm: '2.5rem', md: '2.8rem', lg: '3rem' } }}>
                  Plataforma de educação ambiental Green Mind
                </Typography>
                <Typography variant="body2" sx={{ color: '#222', mb: 2, fontWeight: 400, fontSize: { xs: '16px', sm: '17px', md: '18px' }, fontFamily: 'Asap' }}>
                  Lançado em 2025, o Green Mind nasceu com o propósito de transformar a educação ambiental em algo acessível, interativo e inspirador para pessoas de todas as idades. Com uma abordagem semelhante ao Duolingo, a plataforma ensina temas sobre sustentabilidade de forma gamificada, leve e eficiente.
                </Typography>
                <Typography variant="body2" sx={{ color: '#222', mb: 2, fontSize: { xs: '16px', sm: '17px', md: '18px' }, fontFamily: 'Asap' }}>
                  Os idealizadores do projeto, Eduardo Walace da Silva e Davi Rocha de Farias, uniram seu conhecimento em tecnologia e paixão pelo meio ambiente para criar uma ferramenta que alia aprendizado e conscientização. Acreditando que a mudança começa com a educação, eles desenvolveram o Green Mind como um espaço gratuito onde os usuários podem aprender, praticar e aplicar conhecimentos sobre ecologia, preservação e ações sustentáveis no dia a dia.
                </Typography>
                <Typography variant="body2" sx={{ color: '#222', fontSize: { xs: '16px', sm: '17px', md: '18px' }, fontFamily: 'Asap' }}>
                  Em um mundo cada vez mais afetado pelas mudanças climáticas, o Green Mind busca empoderar cada pessoa com o conhecimento necessário para fazer a diferença — de forma divertida e envolvente.
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Missão Section */}
      <Section>
        <Container>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: '#1b5e20' }}>
                  No Green Mind, nossa missão é inspirar e capacitar pessoas e empresas a adotarem práticas sustentáveis que transformem positivamente o mundo.
                </Typography>
                <Typography variant="body1" sx={{ color: '#222', mb: 2 }}>
                  Acreditamos que cada pequena ação conta e que, juntos, podemos criar um impacto significativo no meio ambiente e na sociedade.
                </Typography>
                <Typography variant="body1" sx={{ color: '#222', mb: 2 }}>
                  Promovemos o aprendizado ambiental de forma interativa e acessível, incentivando a mudança de hábitos por meio da educação.<br />
                  Nosso objetivo é formar uma geração mais consciente, preparada para enfrentar os desafios ambientais do presente e do futuro.<br />
                  Com tecnologia, criatividade e engajamento, mostramos que cuidar do planeta pode ser algo leve, divertido e transformador.<br />
                  Junte-se a nós nessa jornada rumo a um mundo mais verde e equilibrado.
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card
                  sx={{
                    borderRadius: 5,
                    p: { xs: 3, md: 5 },
                    background: 'linear-gradient(135deg, #174A3A 80%, #1E7C5A 100%)',
                    color: 'white',
                    boxShadow: '0 8px 32px 0 rgba(23,74,58,0.18)',
                    border: '1.5px solid #1E7C5A',
                    minHeight: 320,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h4" sx={{ fontWeight: 800, mb: 3, color: '#B6E13A', letterSpacing: -1, textShadow: '0 2px 8px rgba(0,0,0,0.10)' }}>
                    Nossos Valores
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <span style={{ fontSize: 32, display: 'flex' }} role="img" aria-label="Sustentabilidade">🌱</span>
                      <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, letterSpacing: 0.2 }}>Sustentabilidade em primeiro lugar</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <span style={{ fontSize: 32, display: 'flex' }} role="img" aria-label="Impacto">🌍</span>
                      <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, letterSpacing: 0.2 }}>Impacto positivo</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <span style={{ fontSize: 32, display: 'flex' }} role="img" aria-label="Comunidade">🤝</span>
                      <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, letterSpacing: 0.2 }}>Comunidade engajada</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <span style={{ fontSize: 32, display: 'flex' }} role="img" aria-label="Inovação">🚀</span>
                      <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, letterSpacing: 0.2 }}>Inovação ecológica</Typography>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </motion.div>
        </Container>
      </Section>

      {/* O que nos torna únicos Section */}
      <Section sx={{ backgroundColor: 'white' }}>
        <Container>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <SectionTitle variant="h3">O que nos torna únicos</SectionTitle>
            <Grid container spacing={4}>
              {[
                {
                  title: 'Inovação Sustentável',
                  description: 'Desenvolvemos soluções inovadoras que combinam tecnologia e sustentabilidade.'
                },
                {
                  title: 'Impacto Mensurável',
                  description: 'Nossas ações geram resultados concretos e mensuráveis para o meio ambiente.'
                },
                {
                  title: 'Comunidade Engajada',
                  description: 'Construímos uma comunidade ativa e comprometida com a mudança.'
                }
              ].map((item, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
                    <CardContent>
                      <Typography variant="h5" gutterBottom color="primary">
                        {item.title}
                      </Typography>
                      <Typography variant="body1">
                        {item.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Section>

      {/* Nossa Equipe Section */}
      <Section>
        <Container>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <SectionTitle variant="h3">Nossa Equipe</SectionTitle>
            <Grid container spacing={4}>
              {teamMembers.map((member, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <TeamMemberCard>
                    <CardMedia
                      component="img"
                      height="300"
                      image={member.image}
                      alt={member.name}
                    />
                    <CardContent>
                      <Typography variant="h5" gutterBottom>
                        {member.name}
                      </Typography>
                      <Typography variant="subtitle1" color="primary" gutterBottom>
                        {member.role}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {member.description}
                      </Typography>
                    </CardContent>
                  </TeamMemberCard>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Section>
      <Footer />
    </Box>
  );
};

export default About; 