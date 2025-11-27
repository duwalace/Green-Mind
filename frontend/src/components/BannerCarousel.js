import React, { useState, useEffect, memo } from 'react';
import { Box, Typography, Button, IconButton, useMediaQuery } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const slides = [
  {
    image: '/banner2.png',
    title: 'Cuidar das cidades para preservar o meio ambiente.',
    description: 'Essa é a missão que a gente compartilha.',
    button: { text: 'Saiba mais sobre o GreenMind', link: '#' },
    alt: 'Banner sobre cuidados com o meio ambiente'
  },
  {
    image: '/banner3.png',
    title: 'Torne-se um agente da mudança ambiental.',
    description: 'Aprenda de forma leve, divertida e 100% online!',
    button: { text: '🌱 Acesse agora', link: '/register' },
    alt: 'Banner sobre educação ambiental online'
  },
  {
    image: '/banner1.png',
    title: 'Workshop Futuro Ambiental',
    description: (
      <>
        Aprenda sobre separação correta de lixo, gestão de resíduos e sustentabilidade em um programa <b>gratuito e prático!</b><br /><br />
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>100% online e com certificado</li>
          <li>Com trocas de experiências e materiais de apoio</li>
          <li>Ideal para promover mudanças ambientais!</li>
        </ul>
        <br />
        <b>Vem ser parte da mudança!</b>
      </>
    ),
    button: { text: 'Inscreva-se!', link: '#' },
    alt: 'Banner do Workshop Futuro Ambiental'
  },
];

// Componente de imagem otimizada
const OptimizedBackgroundImage = memo(({ src, alt, isVisible, ...props }) => {
  return (
    <Box
      component="div"
      role="img"
      aria-label={alt}
      {...props}
      sx={{
        ...props.sx,
        backgroundImage: `url(${src})`,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.4s cubic-bezier(.4,0,.2,1)',
      }}
    />
  );
});

const BannerCarousel = () => {
  const [current, setCurrent] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const handlePrev = () => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  const handleNext = () => setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));

  // Autoplay
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000); // 5 segundos
    return () => clearInterval(interval);
  }, [current]);

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: { xs: '60vh', sm: '70vh', md: '85vh', lg: '90vh' },
        minHeight: 400,
        maxHeight: 800,
        overflow: 'hidden',
        mb: 0,
        borderRadius: { xs: 0, md: '1px' },
        boxShadow: { xs: 'none', md: '0 4px 32px 0 rgba(0,0,0,0.10)' },
      }}
    >
      {slides.map((slide, idx) => (
        <OptimizedBackgroundImage
          key={idx}
          src={slide.image}
          alt={slide.alt}
          isVisible={idx === current}
          sx={{
            display: 'flex',
            alignItems: 'stretch',
            justifyContent: 'flex-start',
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1,
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            borderRadius: { xs: 0, md: '1px' },
            overflow: 'hidden',
          }}
        >
          {/* Degradê especial para banner1 (índice 2) */}
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: { xs: '100%', md: idx === 2 ? '45%' : '60%' },
              height: '100%',
              zIndex: 2,
              background: idx === 2
                ? 'linear-gradient(110deg, #A5A626 0%, #329C93 100%)'
                : 'linear-gradient(90deg, #A5A626cc 0%, #329C9380 60%, #329C9300 100%)',
              opacity: idx === 0 ? 0.65 : 0.80,
              clipPath: idx === 2
                ? { xs: 'none', md: 'polygon(0 0, 100% 0, 80% 100%, 0% 100%)' }
                : 'none',
              pointerEvents: 'none',
              transition: 'all 0.4s',
            }}
          />
          {/* Conteúdo */}
          <Box
            sx={{
              position: 'relative',
              zIndex: 3,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-start',
              height: '100%',
              pl: { xs: 2, sm: 4, md: 10, lg: 18 },
              pr: { xs: 2, sm: 4, md: 0 },
              maxWidth: { xs: '100%', sm: '90%', md: '40%' },
              color: '#fff',
              textShadow: '0 2px 16px rgba(0,0,0,0.25)',
              py: { xs: 4, sm: 0 },
              boxSizing: 'border-box',
            }}
          >
            <Typography
              variant="h3"
              sx={{ fontWeight: 700, mb: 2, lineHeight: 1.1, fontSize: { xs: '1.5rem', sm: '1.5rem', md: '1.5rem', lg: '1.5rem' } }}
            >
              {slide.title}
            </Typography>
            {typeof slide.description === 'string' ? (
              <Typography variant="body1" sx={{ mb: 3, color: '#e0e0e0', fontWeight: 400, fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.35rem', lg: '1.5rem' } }}>
                {slide.description}
              </Typography>
            ) : (
              <Box sx={{ mb: 3, color: '#e0e0e0', fontWeight: 400, fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.35rem', lg: '1.5rem' } }}>
                {slide.description}
              </Box>
            )}
            <Button
              variant="contained"
              sx={{
                background: '#CDEB6E',
                color: '#234B1C',
                fontWeight: 700,
                borderRadius: 2,
                px: 4,
                py: 1.2,
                fontSize: { xs: '1rem', sm: '1.1rem' },
                boxShadow: '0 2px 12px 0 rgba(0,0,0,0.10)',
                textTransform: 'none',
                '&:hover': { background: '#B6E13A', color: '#234B1C' },
                transition: 'all 0.3s',
              }}
              onClick={() => {
                if (slide.button.link.startsWith('/')) {
                  navigate(slide.button.link);
                } else if (slide.button.link && slide.button.link !== '#') {
                  window.open(slide.button.link, '_blank');
                }
              }}
            >
              {slide.button.text}
            </Button>
          </Box>
        </OptimizedBackgroundImage>
      ))}
      {/* Setas de navegação */}
      <IconButton
        onClick={handlePrev}
        sx={{
          position: 'absolute',
          top: '50%',
          left: { xs: 8, md: 24 },
          transform: 'translateY(-50%)',
          color: '#fff',
          background: 'rgba(0,0,0,0.25)',
          '&:hover': { background: 'rgba(0,0,0,0.45)' },
          zIndex: 4,
          width: 44,
          height: 44,
          boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)',
          borderRadius: '50%',
          transition: 'all 0.3s',
        }}
        aria-label="Anterior"
      >
        <ArrowBackIos sx={{ fontSize: 22 }} />
      </IconButton>
      <IconButton
        onClick={handleNext}
        sx={{
          position: 'absolute',
          top: '50%',
          right: { xs: 8, md: 24 },
          transform: 'translateY(-50%)',
          color: '#fff',
          background: 'rgba(0,0,0,0.25)',
          '&:hover': { background: 'rgba(0,0,0,0.45)' },
          zIndex: 4,
          width: 44,
          height: 44,
          boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)',
          borderRadius: '50%',
          transition: 'all 0.3s',
        }}
        aria-label="Próximo"
      >
        <ArrowForwardIos sx={{ fontSize: 22 }} />
      </IconButton>
    </Box>
  );
};

export default BannerCarousel;