import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Button, Card, CardContent, Avatar, CircularProgress, Divider
} from '@mui/material';
import axios from 'axios';
import Footer from '../components/Footer';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/courses/${id}`);
        setCourse(response.data.course);
      } catch (err) {
        setError('Erro ao carregar o curso');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}><CircularProgress /></Box>;
  }
  if (error || !course) {
    return <Container maxWidth="md" sx={{ py: 8 }}><Typography color="error" align="center">{error || 'Curso não encontrado'}</Typography></Container>;
  }

  return (
    <>
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
        <Typography variant="body1" sx={{ color: '#1976D2', fontWeight: 600, mb: 2, textAlign: 'center' }}>
          Bem-vindo(a)! Aqui você encontra todos os detalhes e benefícios deste curso. Prepare-se para uma experiência de aprendizado completa e envolvente!
        </Typography>
        <Card elevation={3} sx={{ borderRadius: 4, p: { xs: 2, md: 4 }, mb: 4 }}>
          <CardContent>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, color: '#174A97' }}>
              {course.title}
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 3, color: '#333', fontWeight: 500 }}>
              {course.description}
            </Typography>
            <Divider sx={{ my: 3 }} />
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#174A97' }}>
                O que você vai aprender
              </Typography>
              <ul style={{ marginLeft: 24, color: '#222', fontSize: 18, lineHeight: 1.7 }}>
                {course.learning_objectives && course.learning_objectives.split('\n').map((item, idx) => (
                  <li key={idx}><span style={{ fontWeight: 500 }}>{item}</span></li>
                ))}
              </ul>
            </Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#174A97' }}>Instrutor</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar src={`https://i.pravatar.cc/150?u=${course.instructor}`} />
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{course.instructor}</Typography>
              </Box>
            </Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ color: '#222' }}>
                <b>Preço:</b> {course.is_free ? 'Gratuito' : `R$ ${Number(course.price || 0).toFixed(2)}`}<br />
                <b>Duração:</b> {course.duration_minutes} minutos<br />
                <b>Nível:</b> {course.difficulty_level === 'beginner' ? 'Iniciante' : course.difficulty_level === 'intermediate' ? 'Intermediário' : 'Avançado'}
              </Typography>
            </Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ color: '#388e3c', fontWeight: 700, mb: 1 }}>
                100% gratuito, com direito a certificado!
              </Typography>
            </Box>
            <Button
              variant="contained"
              size="large"
              sx={{ background: 'linear-gradient(90deg, #1976D2 0%, #21CBF3 100%)', color: '#fff', fontWeight: 700, borderRadius: 2, px: 5, py: 1.5, fontSize: '1.1rem', boxShadow: 'none', '&:hover': { background: 'linear-gradient(90deg, #1565C0 0%, #21CBF3 100%)' } }}
              onClick={() => navigate(`/courses/${course.id}/start`)}
            >
              Começar
            </Button>
          </CardContent>
        </Card>
        <Card elevation={1} sx={{ borderRadius: 3, p: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#174A97' }}>
            Conteúdo
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Avatar sx={{ bgcolor: '#1976D2', color: '#fff', fontWeight: 700 }}>M</Avatar>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>Módulo Único</Typography>
              <Typography variant="body2" color="text.secondary">Aulas do curso</Typography>
            </Box>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {/* Aqui você pode listar as aulas se desejar, ou um resumo */}
            {course.total_lessons ? `${course.total_lessons} Aulas` : 'Conteúdo detalhado disponível ao iniciar o curso.'}
          </Typography>
        </Card>
      </Container>
      <Footer />
    </>
  );
};

export default CourseDetails; 