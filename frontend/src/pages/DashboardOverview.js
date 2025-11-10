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
  useMediaQuery,
  alpha,
  Stack,
  Paper
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
  Bookmark as BookmarkIcon,
  Stars as StarsIcon,
  Visibility as VisibilityIcon,
  LocalFireDepartment as FireIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const StatCard = ({ title, value, icon, trend, color, loading, subtitle }) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card 
        elevation={0}
        sx={{ 
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          background: `linear-gradient(135deg, ${alpha(color, 0.03)} 0%, ${alpha(color, 0.08)} 100%)`,
          border: `2px solid ${alpha(color, 0.1)}`,
          borderRadius: 4,
          transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: `0 20px 40px ${alpha(color, 0.2)}`,
            border: `2px solid ${alpha(color, 0.3)}`,
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${color} 0%, ${alpha(color, 0.6)} 100%)`,
            transform: isHovered ? 'scaleX(1)' : 'scaleX(0)',
            transformOrigin: 'left',
            transition: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)'
          }
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
            <motion.div
              animate={{ 
                scale: isHovered ? 1.1 : 1,
                rotate: isHovered ? 5 : 0
              }}
              transition={{ duration: 0.3 }}
            >
              <Box sx={{ 
                width: 64, 
                height: 64, 
                borderRadius: 3, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                background: `linear-gradient(135deg, ${alpha(color, 0.15)} 0%, ${alpha(color, 0.25)} 100%)`,
                boxShadow: `0 8px 16px ${alpha(color, 0.2)}`
              }}>
                {React.cloneElement(icon, { 
                  sx: { 
                    color: color, 
                    fontSize: 32,
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                  } 
                })}
              </Box>
            </motion.div>
            
            {trend && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
              >
                <Chip
                  icon={trend > 0 ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                  label={`${Math.abs(trend)}%`}
                  size="small"
                  sx={{
                    background: trend > 0 
                      ? 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)'
                      : 'linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%)',
                    color: trend > 0 ? '#2E7D32' : '#C62828',
                    fontWeight: 700,
                    border: `1px solid ${trend > 0 ? '#A5D6A7' : '#EF9A9A'}`,
                    fontSize: '0.75rem'
                  }}
                />
              </motion.div>
            )}
          </Box>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 800, 
                mb: 0.5,
                background: `linear-gradient(135deg, ${color} 0%, ${alpha(color, 0.7)} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              {loading ? '...' : value}
            </Typography>
          </motion.div>
          
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'text.secondary',
              fontWeight: 600,
              mb: 1,
              fontSize: '0.875rem'
            }}
          >
            {title}
          </Typography>

          {subtitle && (
            <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.75rem' }}>
              {subtitle}
            </Typography>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

const ActivityItem = ({ activity, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const getActivityIcon = (type) => {
    switch (type) {
      case 'course_completed':
        return <CheckCircleIcon sx={{ fontSize: 20 }} />;
      case 'course_started':
        return <PlayCircleIcon sx={{ fontSize: 20 }} />;
      case 'course_bookmarked':
        return <BookmarkIcon sx={{ fontSize: 20 }} />;
      default:
        return <AccessTimeIcon sx={{ fontSize: 20 }} />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'course_completed':
        return { bg: '#E8F5E9', color: '#2E7D32', border: '#A5D6A7' };
      case 'course_started':
        return { bg: '#E3F2FD', color: '#1565C0', border: '#90CAF9' };
      case 'course_bookmarked':
        return { bg: '#FFF3E0', color: '#E65100', border: '#FFB74D' };
      default:
        return { bg: '#F5F5F5', color: '#616161', border: '#E0E0E0' };
    }
  };

  const colors = getActivityColor(activity.type);

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <ListItem 
        sx={{ 
          px: 0,
          py: 2,
          borderRadius: 2,
          transition: 'all 0.3s',
          position: 'relative',
          '&:hover': {
            background: alpha(colors.color, 0.02),
            pl: 1
          }
        }}
      >
        <ListItemAvatar>
          <Box sx={{ position: 'relative' }}>
            <motion.div
              animate={{ scale: isHovered ? 1.05 : 1 }}
              transition={{ duration: 0.2 }}
            >
              <Avatar 
                src={activity.user.avatar} 
                alt={activity.user.name}
                sx={{ 
                  width: 48, 
                  height: 48,
                  border: `3px solid ${colors.border}`,
                  boxShadow: `0 4px 12px ${alpha(colors.color, 0.2)}`
                }}
              />
            </motion.div>
            <Box
              sx={{
                position: 'absolute',
                bottom: -4,
                right: -4,
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: colors.bg,
                border: `2px solid white`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: colors.color,
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}
            >
              {getActivityIcon(activity.type)}
            </Box>
          </Box>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                {activity.user.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {activity.action}
              </Typography>
              <Chip
                label={activity.course}
                size="small"
                sx={{
                  background: colors.bg,
                  color: colors.color,
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  border: `1px solid ${colors.border}`,
                  maxWidth: 200,
                  '& .MuiChip-label': {
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }
                }}
              />
            </Stack>
          }
          secondary={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <AccessTimeIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 500 }}>
                  {activity.time}
                </Typography>
              </Box>
            </Box>
          }
        />
      </ListItem>
      {index < 3 && <Divider sx={{ opacity: 0.5 }} />}
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
        setLoading(true);
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        // Buscar estatísticas reais
        const statsRes = await axios.get('http://localhost:3001/api/admin/statistics', { headers });
        setStats({
          totalCourses: statsRes.data.totalCourses || 0,
          totalUsers: statsRes.data.totalUsers || 0,
          activeUsers: statsRes.data.activeUsers || 0,
          completionRate: statsRes.data.completionRate || 0
        });

        // Buscar atividades recentes
        const activitiesRes = await axios.get('http://localhost:3001/api/admin/recent-activities', { headers });
        const activities = activitiesRes.data.activities || [];
        
        // Transformar dados para o formato esperado
        const formattedActivities = activities.slice(0, 4).map(activity => {
          const hoursAgo = Math.floor((new Date() - new Date(activity.last_accessed_at)) / (1000 * 60 * 60));
          return {
            type: activity.is_completed ? 'course_completed' : 'course_started',
            user: { 
              name: activity.user_name, 
              avatar: activity.user_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(activity.user_name)}&background=4CAF50&color=fff`
            },
            action: activity.is_completed ? 'completou o curso' : `está em ${activity.progress_percentage}% do curso`,
            course: activity.course_title,
            time: hoursAgo === 0 ? 'agora há pouco' : `${hoursAgo}h atrás`
          };
        });

        setRecentActivity(formattedActivities);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
        // Se falhar, usar dados de exemplo
        setStats({
          totalCourses: 0,
          totalUsers: 0,
          activeUsers: 0,
          completionRate: 0
        });
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <Box sx={{ 
      p: { xs: 2, md: 4 },
      background: 'linear-gradient(135deg, #F5F7FA 0%, #E8EEF2 100%)',
      minHeight: '100vh'
    }}>
      {/* Header Premium */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ mb: 5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #2E7D32 0%, #66BB6A 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(46, 125, 50, 0.4)'
              }}
            >
              <DashboardIcon sx={{ color: 'white', fontSize: 28 }} />
            </Box>
            <Box>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #2E7D32 0%, #66BB6A 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  mb: 0.5
                }}
              >
                Dashboard Administrativo
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                Monitore e gerencie sua plataforma de aprendizado em tempo real
              </Typography>
            </Box>
          </Box>
          
          {/* Barra de Status Rápido */}
          <Paper
            elevation={0}
            sx={{
              mt: 3,
              p: 2,
              borderRadius: 3,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.3)',
              display: 'flex',
              gap: 3,
              flexWrap: 'wrap',
              alignItems: 'center'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <VisibilityIcon sx={{ color: '#0277BD', fontSize: 20 }} />
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                Em tempo real
              </Typography>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FireIcon sx={{ color: '#F57C00', fontSize: 20 }} />
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                Atualizado agora
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }} />
            <Chip
              icon={<StarsIcon />}
              label="Sistema Operacional"
              size="small"
              sx={{
                background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
                color: '#2E7D32',
                fontWeight: 700,
                border: '1px solid #A5D6A7'
              }}
            />
          </Paper>
        </Box>
      </motion.div>

      {/* Stats Grid Premium */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total de Cursos"
            subtitle="Conteúdo disponível"
            value={stats.totalCourses}
            icon={<SchoolIcon />}
            trend={12}
            color="#2E7D32"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Usuários Ativos"
            subtitle="Últimos 30 dias"
            value={stats.activeUsers}
            icon={<PeopleIcon />}
            trend={8}
            color="#00897B"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total de Usuários"
            subtitle="Base total"
            value={stats.totalUsers}
            icon={<TrendingUpIcon />}
            trend={-3}
            color="#0277BD"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Taxa de Conclusão"
            subtitle="Média geral"
            value={`${stats.completionRate}%`}
            icon={<EmojiEventsIcon />}
            trend={5}
            color="#F57C00"
            loading={loading}
          />
        </Grid>
      </Grid>

      {/* Recent Activity & Progress */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card 
              elevation={0}
              sx={{ 
                borderRadius: 4,
                background: 'white',
                border: '1px solid rgba(0,0,0,0.05)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                height: '100%',
                overflow: 'hidden'
              }}
            >
              <Box
                sx={{
                  p: 3,
                  background: 'linear-gradient(135deg, rgba(46, 125, 50, 0.05) 0%, rgba(102, 187, 106, 0.05) 100%)',
                  borderBottom: '1px solid rgba(0,0,0,0.05)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
                    Atividade Recente
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    Últimas interações dos usuários
                  </Typography>
                </Box>
                <Button 
                  variant="outlined" 
                  size="small"
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    borderColor: '#2E7D32',
                    color: '#2E7D32',
                    '&:hover': {
                      borderColor: '#2E7D32',
                      background: alpha('#2E7D32', 0.08)
                    }
                  }}
                >
                  Ver todas
                </Button>
              </Box>
              
              <CardContent sx={{ p: 3 }}>
                {recentActivity.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <PlayCircleIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      Nenhuma atividade recente
                    </Typography>
                    <Typography variant="body2" color="text.disabled">
                      As atividades dos usuários aparecerão aqui
                    </Typography>
                  </Box>
                ) : (
                  <List sx={{ p: 0 }}>
                    {recentActivity.map((activity, index) => (
                      <ActivityItem key={index} activity={activity} index={index} />
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} lg={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card 
              elevation={0}
              sx={{ 
                borderRadius: 4,
                background: 'white',
                border: '1px solid rgba(0,0,0,0.05)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                height: '100%',
                overflow: 'hidden'
              }}
            >
              <Box
                sx={{
                  p: 3,
                  background: 'linear-gradient(135deg, rgba(0, 137, 123, 0.05) 0%, rgba(77, 182, 172, 0.05) 100%)',
                  borderBottom: '1px solid rgba(0,0,0,0.05)'
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
                  Métricas de Desempenho
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                  Indicadores principais
                </Typography>
              </Box>

              <CardContent sx={{ p: 3 }}>
                <Stack spacing={3}>
                  {/* Cursos Completados */}
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        Cursos Completados
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: '#2E7D32' }}>
                        68%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={68} 
                      sx={{ 
                        height: 10, 
                        borderRadius: 5,
                        bgcolor: alpha('#2E7D32', 0.1),
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 5,
                          background: 'linear-gradient(90deg, #2E7D32 0%, #66BB6A 100%)',
                          boxShadow: '0 2px 8px rgba(46, 125, 50, 0.3)'
                        }
                      }}
                    />
                  </Box>

                  {/* Engajamento */}
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        Engajamento dos Usuários
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: '#00897B' }}>
                        82%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={82} 
                      sx={{ 
                        height: 10, 
                        borderRadius: 5,
                        bgcolor: alpha('#00897B', 0.1),
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 5,
                          background: 'linear-gradient(90deg, #00897B 0%, #4DB6AC 100%)',
                          boxShadow: '0 2px 8px rgba(0, 137, 123, 0.3)'
                        }
                      }}
                    />
                  </Box>

                  {/* Satisfação */}
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        Satisfação dos Usuários
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: '#0277BD' }}>
                        94%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={94} 
                      sx={{ 
                        height: 10, 
                        borderRadius: 5,
                        bgcolor: alpha('#0277BD', 0.1),
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 5,
                          background: 'linear-gradient(90deg, #0277BD 0%, #29B6F6 100%)',
                          boxShadow: '0 2px 8px rgba(2, 119, 189, 0.3)'
                        }
                      }}
                    />
                  </Box>
                </Stack>

                <Divider sx={{ my: 3 }} />

                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700, color: 'text.primary' }}>
                    Ações Recomendadas
                  </Typography>
                  <Stack spacing={1.5}>
                    <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                      <Chip 
                        icon={<CheckCircleIcon />}
                        label="Revisar novos cursos" 
                        size="medium"
                        clickable
                        sx={{ 
                          width: '100%',
                          justifyContent: 'flex-start',
                          background: 'linear-gradient(135deg, #E1F5FE 0%, #B3E5FC 100%)',
                          color: '#0277BD',
                          fontWeight: 600,
                          border: '1px solid #81D4FA',
                          '&:hover': { 
                            background: 'linear-gradient(135deg, #B3E5FC 0%, #81D4FA 100%)',
                            boxShadow: '0 4px 12px rgba(2, 119, 189, 0.2)'
                          }
                        }}
                      />
                    </motion.div>
                    <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                      <Chip 
                        icon={<SchoolIcon />}
                        label="Atualizar conteúdo" 
                        size="medium"
                        clickable
                        sx={{ 
                          width: '100%',
                          justifyContent: 'flex-start',
                          background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
                          color: '#2E7D32',
                          fontWeight: 600,
                          border: '1px solid #A5D6A7',
                          '&:hover': { 
                            background: 'linear-gradient(135deg, #C8E6C9 0%, #A5D6A7 100%)',
                            boxShadow: '0 4px 12px rgba(46, 125, 50, 0.2)'
                          }
                        }}
                      />
                    </motion.div>
                    <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                      <Chip 
                        icon={<EmojiEventsIcon />}
                        label="Responder feedback" 
                        size="medium"
                        clickable
                        sx={{ 
                          width: '100%',
                          justifyContent: 'flex-start',
                          background: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)',
                          color: '#F57C00',
                          fontWeight: 600,
                          border: '1px solid #FFCC80',
                          '&:hover': { 
                            background: 'linear-gradient(135deg, #FFE0B2 0%, #FFCC80 100%)',
                            boxShadow: '0 4px 12px rgba(245, 124, 0, 0.2)'
                          }
                        }}
                      />
                    </motion.div>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardOverview; 