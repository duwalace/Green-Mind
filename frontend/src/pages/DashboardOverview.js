import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Button,
  Chip,
  LinearProgress,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  School as SchoolIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  EmojiEvents as EmojiEventsIcon,
  MoreVert as MoreVertIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  AccessTime as AccessTimeIcon,
  CheckCircle as CheckCircleIcon,
  PlayCircle as PlayCircleIcon,
  Bookmark as BookmarkIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';

const StatCard = ({ title, value, icon, trend, color, loading }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card sx={{ 
        height: '100%',
        background: `linear-gradient(135deg, ${color}08 0%, ${color}15 100%)`,
        border: `1px solid ${color}20`,
        borderRadius: 2,
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 24px ${color}15`
        }
      }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ 
              width: 48, 
              height: 48, 
              borderRadius: 2, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              background: `${color}15`
            }}>
              {React.cloneElement(icon, { sx: { color: color, fontSize: 28 } })}
            </Box>
            <IconButton size="small">
              <MoreVertIcon sx={{ color: 'text.secondary' }} />
            </IconButton>
          </Box>
          
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            {loading ? '...' : value}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {title}
          </Typography>

          {trend && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {trend > 0 ? (
                <ArrowUpwardIcon sx={{ color: '#4CAF50', fontSize: 16 }} />
              ) : (
                <ArrowDownwardIcon sx={{ color: '#F44336', fontSize: 16 }} />
              )}
              <Typography 
                variant="caption" 
                sx={{ 
                  color: trend > 0 ? '#4CAF50' : '#F44336',
                  fontWeight: 600
                }}
              >
                {Math.abs(trend)}% em relação ao mês anterior
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

const ActivityItem = ({ activity, index }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'course_completed':
        return <CheckCircleIcon sx={{ color: '#4CAF50' }} />;
      case 'course_started':
        return <PlayCircleIcon sx={{ color: '#2196F3' }} />;
      case 'course_bookmarked':
        return <BookmarkIcon sx={{ color: '#FF9800' }} />;
      default:
        return <AccessTimeIcon sx={{ color: '#9E9E9E' }} />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'course_completed':
        return '#4CAF50';
      case 'course_started':
        return '#2196F3';
      case 'course_bookmarked':
        return '#FF9800';
      default:
        return '#9E9E9E';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <ListItem sx={{ px: 0 }}>
        <ListItemAvatar>
          <Avatar 
            src={activity.user.avatar} 
            alt={activity.user.name}
            sx={{ 
              width: 40, 
              height: 40,
              border: `2px solid ${getActivityColor(activity.type)}20`
            }}
          />
        </ListItemAvatar>
        <ListItemText
          primary={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {activity.user.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {activity.action}
              </Typography>
              <Typography variant="subtitle2" sx={{ color: getActivityColor(activity.type), fontWeight: 600 }}>
                {activity.course}
              </Typography>
            </Box>
          }
          secondary={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              {getActivityIcon(activity.type)}
              <Typography variant="caption" color="text.secondary">
                {activity.time}
              </Typography>
            </Box>
          }
        />
      </ListItem>
      <Divider variant="inset" component="li" />
    </motion.div>
  );
};

const DashboardOverview = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalUsers: 0,
    activeUsers: 0,
    completionRate: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Simular dados da API
        setStats({
          totalCourses: 24,
          totalUsers: 1568,
          activeUsers: 423,
          completionRate: 68
        });

        setRecentActivity([
          {
            type: 'course_completed',
            user: { name: 'Maria Silva', avatar: 'https://i.pravatar.cc/150?u=maria' },
            action: 'completou o curso',
            course: 'Conservação de Água',
            time: '2 horas atrás'
          },
          {
            type: 'course_started',
            user: { name: 'João Santos', avatar: 'https://i.pravatar.cc/150?u=joao' },
            action: 'iniciou o curso',
            course: 'Energia Renovável',
            time: '3 horas atrás'
          },
          {
            type: 'course_bookmarked',
            user: { name: 'Ana Costa', avatar: 'https://i.pravatar.cc/150?u=ana' },
            action: 'salvou o curso',
            course: 'Mudanças Climáticas',
            time: '5 horas atrás'
          },
          {
            type: 'course_completed',
            user: { name: 'Pedro Oliveira', avatar: 'https://i.pravatar.cc/150?u=pedro' },
            action: 'completou o curso',
            course: 'Reciclagem Avançada',
            time: '6 horas atrás'
          }
        ]);

        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Visão Geral
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Bem-vindo ao painel de controle. Aqui você pode gerenciar cursos, usuários e acompanhar o progresso da plataforma.
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total de Cursos"
            value={stats.totalCourses}
            icon={<SchoolIcon />}
            trend={12}
            color="#2196F3"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Usuários Ativos"
            value={stats.activeUsers}
            icon={<PeopleIcon />}
            trend={8}
            color="#4CAF50"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total de Usuários"
            value={stats.totalUsers}
            icon={<TrendingUpIcon />}
            trend={-3}
            color="#FF9800"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Taxa de Conclusão"
            value={`${stats.completionRate}%`}
            icon={<EmojiEventsIcon />}
            trend={5}
            color="#9C27B0"
            loading={loading}
          />
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ 
            borderRadius: 2,
            boxShadow: '0 2px 12px 0 rgba(0,0,0,0.05)',
            height: '100%'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Atividade Recente
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small"
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    borderColor: 'rgba(0,0,0,0.1)',
                    '&:hover': {
                      borderColor: 'rgba(0,0,0,0.2)',
                      background: 'rgba(0,0,0,0.02)'
                    }
                  }}
                >
                  Ver todas
                </Button>
              </Box>
              
              <List sx={{ p: 0 }}>
                {recentActivity.map((activity, index) => (
                  <ActivityItem key={index} activity={activity} index={index} />
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ 
            borderRadius: 2,
            boxShadow: '0 2px 12px 0 rgba(0,0,0,0.05)',
            height: '100%'
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Progresso Geral
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Cursos Completados
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    68%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={68} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    bgcolor: '#E0E0E0',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                      background: 'linear-gradient(90deg, #4CAF50 0%, #8BC34A 100%)'
                    }
                  }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Engajamento dos Usuários
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    82%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={82} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    bgcolor: '#E0E0E0',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                      background: 'linear-gradient(90deg, #2196F3 0%, #64B5F6 100%)'
                    }
                  }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Satisfação dos Usuários
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    94%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={94} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    bgcolor: '#E0E0E0',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                      background: 'linear-gradient(90deg, #FF9800 0%, #FFB74D 100%)'
                    }
                  }}
                />
              </Box>

              <Box sx={{ mt: 4 }}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                  Próximas Ações
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Chip 
                    label="Revisar novos cursos" 
                    size="small"
                    sx={{ 
                      background: '#E3F2FD',
                      color: '#1976D2',
                      fontWeight: 500,
                      '&:hover': { background: '#BBDEFB' }
                    }}
                  />
                  <Chip 
                    label="Atualizar conteúdo" 
                    size="small"
                    sx={{ 
                      background: '#E8F5E9',
                      color: '#2E7D32',
                      fontWeight: 500,
                      '&:hover': { background: '#C8E6C9' }
                    }}
                  />
                  <Chip 
                    label="Responder feedback" 
                    size="small"
                    sx={{ 
                      background: '#FFF3E0',
                      color: '#E65100',
                      fontWeight: 500,
                      '&:hover': { background: '#FFE0B2' }
                    }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardOverview; 