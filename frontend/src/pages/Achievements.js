import React, { useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  Star as StarIcon,
  WaterDrop as WaterIcon,
  Bolt as EnergyIcon,
  WbSunny as ClimateIcon,
  Delete as RecyclingIcon,
  Lock as LockIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

// Dados mockados de conquistas
const achievements = {
  water: [
    {
      id: 1,
      title: 'Primeiro Passo',
      description: 'Complete sua primeira lição sobre água',
      icon: <WaterIcon sx={{ fontSize: 40, color: '#2196F3' }} />,
      xp: 100,
      completed: true,
      date: '2024-01-15'
    },
    {
      id: 2,
      title: 'Mestre da Água',
      description: 'Complete todas as lições sobre água',
      icon: <WaterIcon sx={{ fontSize: 40, color: '#2196F3' }} />,
      xp: 500,
      completed: false,
      progress: 60
    }
  ],
  energy: [
    {
      id: 3,
      title: 'Energia Verde',
      description: 'Aprenda sobre energia renovável',
      icon: <EnergyIcon sx={{ fontSize: 40, color: '#FFC107' }} />,
      xp: 200,
      completed: true,
      date: '2024-01-20'
    },
    {
      id: 4,
      title: 'Eficiência Energética',
      description: 'Complete 5 lições sobre eficiência energética',
      icon: <EnergyIcon sx={{ fontSize: 40, color: '#FFC107' }} />,
      xp: 300,
      completed: false,
      progress: 40
    }
  ],
  climate: [
    {
      id: 5,
      title: 'Consciência Climática',
      description: 'Complete sua primeira lição sobre mudanças climáticas',
      icon: <ClimateIcon sx={{ fontSize: 40, color: '#4CAF50' }} />,
      xp: 150,
      completed: false,
      progress: 0
    }
  ],
  recycling: [
    {
      id: 6,
      title: 'Reciclador Iniciante',
      description: 'Aprenda os princípios básicos da reciclagem',
      icon: <RecyclingIcon sx={{ fontSize: 40, color: '#9C27B0' }} />,
      xp: 200,
      completed: false,
      progress: 20
    }
  ]
};

const Achievements = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const totalXP = Object.values(achievements)
    .flat()
    .filter(a => a.completed)
    .reduce((sum, a) => sum + a.xp, 0);

  const totalAchievements = Object.values(achievements)
    .flat()
    .filter(a => a.completed)
    .length;

  const renderAchievementCard = (achievement) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'visible',
          '&:hover': {
            transform: 'translateY(-4px)',
            transition: 'transform 0.2s'
          }
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            {achievement.icon}
            <Typography variant="h6" sx={{ ml: 1 }}>
              {achievement.title}
            </Typography>
            {achievement.completed ? (
              <Tooltip title="Conquista desbloqueada">
                <CheckCircleIcon
                  sx={{
                    color: 'success.main',
                    ml: 'auto',
                    fontSize: 24
                  }}
                />
              </Tooltip>
            ) : (
              <Tooltip title="Conquista bloqueada">
                <LockIcon
                  sx={{
                    color: 'text.disabled',
                    ml: 'auto',
                    fontSize: 24
                  }}
                />
              </Tooltip>
            )}
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {achievement.description}
          </Typography>
          {!achievement.completed && achievement.progress !== undefined && (
            <Box sx={{ mb: 1 }}>
              <LinearProgress
                variant="determinate"
                value={achievement.progress}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'rgba(0,0,0,0.1)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: 'primary.main'
                  }
                }}
              />
              <Typography variant="caption" color="text.secondary">
                {achievement.progress}% completo
              </Typography>
            </Box>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <StarIcon sx={{ color: '#FFD700', mr: 0.5 }} />
            <Typography variant="body2" color="text.secondary">
              {achievement.xp} XP
            </Typography>
            {achievement.completed && achievement.date && (
              <Chip
                label={new Date(achievement.date).toLocaleDateString()}
                size="small"
                sx={{ ml: 'auto' }}
              />
            )}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Cabeçalho com estatísticas */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Conquistas
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Total de XP
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <StarIcon sx={{ color: '#FFD700', mr: 1 }} />
                  <Typography variant="h4">{totalXP}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Conquistas Desbloqueadas
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrophyIcon sx={{ color: 'primary.main', mr: 1 }} />
                  <Typography variant="h4">{totalAchievements}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Tabs para categorias */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant={isMobile ? "scrollable" : "fullWidth"}
          scrollButtons={isMobile ? "auto" : false}
        >
          <Tab label="Todas" />
          <Tab label="Água" />
          <Tab label="Energia" />
          <Tab label="Clima" />
          <Tab label="Reciclagem" />
        </Tabs>
      </Box>

      {/* Grid de conquistas */}
      <Grid container spacing={3}>
        {selectedTab === 0 && Object.values(achievements).flat().map((achievement) => (
          <Grid item xs={12} sm={6} md={4} key={achievement.id}>
            {renderAchievementCard(achievement)}
          </Grid>
        ))}
        {selectedTab === 1 && achievements.water.map((achievement) => (
          <Grid item xs={12} sm={6} md={4} key={achievement.id}>
            {renderAchievementCard(achievement)}
          </Grid>
        ))}
        {selectedTab === 2 && achievements.energy.map((achievement) => (
          <Grid item xs={12} sm={6} md={4} key={achievement.id}>
            {renderAchievementCard(achievement)}
          </Grid>
        ))}
        {selectedTab === 3 && achievements.climate.map((achievement) => (
          <Grid item xs={12} sm={6} md={4} key={achievement.id}>
            {renderAchievementCard(achievement)}
          </Grid>
        ))}
        {selectedTab === 4 && achievements.recycling.map((achievement) => (
          <Grid item xs={12} sm={6} md={4} key={achievement.id}>
            {renderAchievementCard(achievement)}
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Achievements; 