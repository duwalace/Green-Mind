import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  LinearProgress,
  Card,
  CardContent,
  Alert,
  IconButton
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import Layout from '../components/Layout';

// Dados mockados para exemplo
const mockQuestions = {
  1: [
    {
      id: 1,
      question: 'Qual é a porcentagem de água doce disponível no planeta?',
      options: [
        '2,5%',
        '10%',
        '25%',
        '50%'
      ],
      correctAnswer: 0
    },
    {
      id: 2,
      question: 'Qual é o principal uso da água no Brasil?',
      options: [
        'Consumo humano',
        'Agricultura',
        'Indústria',
        'Geração de energia'
      ],
      correctAnswer: 1
    }
  ],
  2: [
    {
      id: 1,
      question: 'Qual é a fonte de energia renovável mais utilizada no Brasil?',
      options: [
        'Solar',
        'Eólica',
        'Hidrelétrica',
        'Biomassa'
      ],
      correctAnswer: 2
    }
  ]
};

const TrailLevel = () => {
  const { trailId, levelId } = useParams();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [questions] = useState(mockQuestions[levelId] || []);

  const handleAnswerSelect = (event) => {
    setSelectedAnswer(Number(event.target.value));
  };

  const handleSubmit = () => {
    const isAnswerCorrect = selectedAnswer === questions[currentQuestion].correctAnswer;
    setIsCorrect(isAnswerCorrect);
    setShowResult(true);
    if (isAnswerCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Nível completo
      navigate(`/trail/${trailId}/level/${Number(levelId) + 1}`);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <Layout>
      <Container maxWidth="md">
        <Box sx={{ mb: 4 }}>
          <IconButton
            onClick={() => navigate(`/trail/${trailId}`)}
            sx={{ mb: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" gutterBottom>
            Nível {levelId}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>

        {questions.length > 0 ? (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Questão {currentQuestion + 1} de {questions.length}
              </Typography>
              <Typography variant="h5" sx={{ mb: 3 }}>
                {questions[currentQuestion].question}
              </Typography>

              <FormControl component="fieldset">
                <RadioGroup
                  value={selectedAnswer}
                  onChange={handleAnswerSelect}
                >
                  {questions[currentQuestion].options.map((option, index) => (
                    <FormControlLabel
                      key={index}
                      value={index}
                      control={<Radio />}
                      label={option}
                      disabled={showResult}
                    />
                  ))}
                </RadioGroup>
              </FormControl>

              {showResult && (
                <Alert
                  severity={isCorrect ? 'success' : 'error'}
                  sx={{ mt: 2 }}
                  icon={isCorrect ? <CheckCircleIcon /> : <CancelIcon />}
                >
                  {isCorrect
                    ? 'Resposta correta! Parabéns!'
                    : 'Resposta incorreta. Tente novamente!'}
                </Alert>
              )}

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                {!showResult ? (
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={selectedAnswer === null}
                  >
                    Verificar Resposta
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                  >
                    {currentQuestion < questions.length - 1 ? 'Próxima Questão' : 'Concluir Nível'}
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        ) : (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" color="error">
              Nenhuma questão disponível para este nível.
            </Typography>
          </Paper>
        )}
      </Container>
    </Layout>
  );
};

export default TrailLevel;