import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Paper,
  Chip,
  Avatar,
  LinearProgress,
  Alert,
  useTheme,
  Stack,
  Divider,
  alpha,
  Badge
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  School as SchoolIcon,
  People as PeopleIcon,
  MenuBook as MenuBookIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Timeline as TimelineIcon,
  Assessment as AssessmentIcon,
  LocalFireDepartment as FireIcon,
  Star as StarIcon,
  EmojiEvents as TrophyIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const StatCard = ({ title, value, icon, trend, color, loading, subtitle }) => {
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
          background: `linear-gradient(135deg, ${alpha(color, 0.05)} 0%, ${alpha(color, 0.1)} 100%)`,
          border: `2px solid ${alpha(color, 0.15)}`,
          borderRadius: 4,
          transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: `0 20px 40px ${alpha(color, 0.25)}`,
            border: `2px solid ${alpha(color, 0.4)}`,
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '5px',
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
                background: `linear-gradient(135deg, ${alpha(color, 0.2)} 0%, ${alpha(color, 0.3)} 100%)`,
                boxShadow: `0 8px 16px ${alpha(color, 0.25)}`
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {trend > 0 ? (
                    <TrendingUpIcon sx={{ color: '#4CAF50', fontSize: 20 }} />
                  ) : (
                    <TrendingDownIcon sx={{ color: '#F44336', fontSize: 20 }} />
                  )}
                  <Typography variant="caption" sx={{ color: trend > 0 ? '#4CAF50' : '#F44336', fontWeight: 700 }}>
                    {Math.abs(trend)}%
                  </Typography>
                </Box>
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
                mb: 1,
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
              mb: 0.5,
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

const ActivityCard = ({ activity, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          transition: 'all 0.3s',
          background: isHovered ? alpha('#667eea', 0.03) : 'transparent',
          '&:hover': {
            pl: 3
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              activity.is_completed ? (
                <CheckCircleIcon sx={{ fontSize: 16, color: '#4CAF50' }} />
              ) : null
            }
          >
            <Avatar 
              src={activity.user_avatar} 
              alt={activity.user_name}
              sx={{ 
                width: 48, 
                height: 48,
                border: `3px solid ${activity.is_completed ? '#A5D6A7' : '#90CAF9'}`,
                boxShadow: `0 4px 12px ${alpha(activity.is_completed ? '#4CAF50' : '#2196F3', 0.2)}`
              }}
            />
          </Badge>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }} noWrap>
              {activity.user_name}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {activity.course_title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <Chip
                label={activity.is_completed ? 'Concluído' : `${activity.progress_percentage}%`}
                size="small"
                sx={{
                  background: activity.is_completed 
                    ? 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)'
                    : 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
                  color: activity.is_completed ? '#2E7D32' : '#1565C0',
                  fontWeight: 700,
                  border: `1px solid ${activity.is_completed ? '#A5D6A7' : '#90CAF9'}`,
                  fontSize: '0.7rem'
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
      {index < 4 && <Divider sx={{ opacity: 0.3 }} />}
    </motion.div>
  );
};

const DashboardReports = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statistics, setStatistics] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalTrails: 0,
    totalLessons: 0,
    activeUsers: 0,
    completionRate: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    fetchReportsData();
  }, []);

  const fetchReportsData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const statsRes = await axios.get('http://localhost:3001/api/admin/statistics', { headers });
      setStatistics(statsRes.data);

      const activitiesRes = await axios.get('http://localhost:3001/api/admin/recent-activities', { headers });
      setRecentActivities(activitiesRes.data.activities || []);

    } catch (err) {
      console.error('Erro ao carregar relatórios:', err);
      setError('Erro ao carregar dados dos relatórios');
    } finally {
      setLoading(false);
    }
  };

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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #0277BD 0%, #29B6F6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(2, 119, 189, 0.4)'
              }}
            >
              <AssessmentIcon sx={{ color: 'white', fontSize: 28 }} />
            </Box>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 800,
                background: 'linear-gradient(135deg, #0277BD 0%, #29B6F6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Relatórios e Análises
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Visualize estatísticas detalhadas e acompanhe o desempenho da plataforma
          </Typography>
        </Box>
      </motion.div>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Cards de Estatísticas Premium */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total de Usuários"
            subtitle="Base de usuários"
            value={statistics.totalUsers}
            icon={<PeopleIcon />}
            trend={12}
            color="#0277BD"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Usuários Ativos"
            subtitle="Últimos 30 dias"
            value={statistics.activeUsers}
            icon={<CheckCircleIcon />}
            trend={8}
            color="#00897B"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total de Trilhas"
            subtitle="Jornadas criadas"
            value={statistics.totalTrails}
            icon={<TimelineIcon />}
            trend={5}
            color="#2E7D32"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total de Cursos"
            subtitle="Conteúdo disponível"
            value={statistics.totalCourses}
            icon={<MenuBookIcon />}
            trend={15}
            color="#F57C00"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total de Aulas"
            subtitle="Lições criadas"
            value={statistics.totalLessons}
            icon={<AssignmentIcon />}
            trend={-3}
            color="#66BB6A"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Taxa de Conclusão"
            subtitle="Média geral"
            value={`${statistics.completionRate}%`}
            icon={<TrophyIcon />}
            trend={7}
            color="#2E7D32"
            loading={loading}
          />
        </Grid>
      </Grid>

      {/* Seção de Gráficos e Análises */}
      <Grid container spacing={3}>
        {/* Métricas de Engajamento */}
        <Grid item xs={12} lg={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card 
              elevation={0}
              sx={{ 
                height: '100%',
                borderRadius: 4,
                background: 'white',
                border: '1px solid rgba(0,0,0,0.08)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
              }}
            >
              <Box
                sx={{
                  p: 3,
                  background: 'linear-gradient(135deg, rgba(46, 125, 50, 0.05) 0%, rgba(102, 187, 106, 0.05) 100%)',
                  borderBottom: '1px solid rgba(0,0,0,0.05)'
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
                  Métricas de Engajamento
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                  Indicadores de desempenho principais
                </Typography>
              </Box>

              <CardContent sx={{ p: 3 }}>
                <Stack spacing={3.5}>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #2E7D32 0%, #66BB6A 100%)'
                          }}
                        />
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                          Taxa de Conclusão
                        </Typography>
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: '#2E7D32' }}>
                        {statistics.completionRate}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={parseFloat(statistics.completionRate) || 0} 
                      sx={{ 
                        height: 12, 
                        borderRadius: 6,
                        bgcolor: alpha('#2E7D32', 0.1),
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 6,
                          background: 'linear-gradient(90deg, #2E7D32 0%, #66BB6A 100%)',
                          boxShadow: '0 2px 8px rgba(46, 125, 50, 0.3)'
                        }
                      }}
                    />
                  </Box>

                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #00897B 0%, #4DB6AC 100%)'
                          }}
                        />
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                          Usuários Ativos vs Total
                        </Typography>
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: '#00897B' }}>
                        {statistics.totalUsers > 0 
                          ? Math.round((statistics.activeUsers / statistics.totalUsers) * 100) 
                          : 0}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={statistics.totalUsers > 0 
                        ? (statistics.activeUsers / statistics.totalUsers) * 100 
                        : 0} 
                      sx={{ 
                        height: 12, 
                        borderRadius: 6,
                        bgcolor: alpha('#00897B', 0.1),
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 6,
                          background: 'linear-gradient(90deg, #00897B 0%, #4DB6AC 100%)',
                          boxShadow: '0 2px 8px rgba(0, 137, 123, 0.3)'
                        }
                      }}
                    />
                  </Box>

                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #0277BD 0%, #29B6F6 100%)'
                          }}
                        />
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                          Conteúdo Publicado
                        </Typography>
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: '#0277BD' }}>
                        {statistics.totalLessons > 0 ? '92%' : '0%'}
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={statistics.totalLessons > 0 ? 92 : 0} 
                      sx={{ 
                        height: 12, 
                        borderRadius: 6,
                        bgcolor: alpha('#0277BD', 0.1),
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 6,
                          background: 'linear-gradient(90deg, #0277BD 0%, #29B6F6 100%)',
                          boxShadow: '0 2px 8px rgba(2, 119, 189, 0.3)'
                        }
                      }}
                    />
                  </Box>

                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)'
                          }}
                        />
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                          Satisfação dos Usuários
                        </Typography>
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: '#2E7D32' }}>
                        96%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={96} 
                      sx={{ 
                        height: 12, 
                        borderRadius: 6,
                        bgcolor: alpha('#2E7D32', 0.1),
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 6,
                          background: 'linear-gradient(90deg, #2E7D32 0%, #4CAF50 100%)',
                          boxShadow: '0 2px 8px rgba(46, 125, 50, 0.3)'
                        }
                      }}
                    />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Atividades Recentes */}
        <Grid item xs={12} lg={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card 
              elevation={0}
              sx={{ 
                height: '100%',
                borderRadius: 4,
                background: 'white',
                border: '1px solid rgba(0,0,0,0.08)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
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
                  Atividades Recentes
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                  Últimas interações dos usuários
                </Typography>
              </Box>
              
              <CardContent sx={{ p: 2 }}>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                    <CircularProgress />
                  </Box>
                ) : recentActivities.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <FireIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      Nenhuma atividade recente
                    </Typography>
                    <Typography variant="body2" color="text.disabled">
                      As atividades dos usuários aparecerão aqui
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ maxHeight: 480, overflow: 'auto' }}>
                    {recentActivities.slice(0, 5).map((activity, index) => (
                      <ActivityCard key={index} activity={activity} index={index} />
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Resumo de Conteúdo */}
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card 
              elevation={0}
              sx={{ 
                borderRadius: 4,
                background: 'white',
                border: '1px solid rgba(0,0,0,0.08)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
              }}
            >
              <Box
                sx={{
                  p: 3,
                  background: 'linear-gradient(135deg, rgba(2, 119, 189, 0.05) 0%, rgba(41, 182, 246, 0.05) 100%)',
                  borderBottom: '1px solid rgba(0,0,0,0.05)'
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
                  Resumo de Conteúdo
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                  Visão geral da plataforma
                </Typography>
              </Box>
              
              <CardContent sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        textAlign: 'center',
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, rgba(46, 125, 50, 0.05) 0%, rgba(46, 125, 50, 0.1) 100%)',
                        border: '2px solid rgba(46, 125, 50, 0.2)',
                        transition: 'all 0.3s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 12px 24px rgba(46, 125, 50, 0.15)'
                        }
                      }}
                    >
                      <TimelineIcon sx={{ fontSize: 48, color: '#2E7D32', mb: 1 }} />
                      <Typography variant="h4" fontWeight={800} sx={{ color: '#2E7D32', mb: 0.5 }}>
                        {statistics.totalTrails}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" fontWeight={600}>
                        Trilhas
                      </Typography>
                      <Chip 
                        icon={<TrendingUpIcon />}
                        label="+5%" 
                        size="small"
                        sx={{ 
                          mt: 1,
                          bgcolor: '#E8F5E9', 
                          color: '#2E7D32',
                          fontWeight: 700
                        }}
                      />
                    </Paper>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        textAlign: 'center',
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, rgba(0, 137, 123, 0.05) 0%, rgba(0, 137, 123, 0.1) 100%)',
                        border: '2px solid rgba(0, 137, 123, 0.2)',
                        transition: 'all 0.3s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 12px 24px rgba(0, 137, 123, 0.15)'
                        }
                      }}
                    >
                      <MenuBookIcon sx={{ fontSize: 48, color: '#00897B', mb: 1 }} />
                      <Typography variant="h4" fontWeight={800} sx={{ color: '#00897B', mb: 0.5 }}>
                        {statistics.totalCourses}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" fontWeight={600}>
                        Cursos
                      </Typography>
                      <Chip 
                        icon={<TrendingUpIcon />}
                        label="+15%" 
                        size="small"
                        sx={{ 
                          mt: 1,
                          bgcolor: '#E0F2F1', 
                          color: '#00897B',
                          fontWeight: 700
                        }}
                      />
                    </Paper>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        textAlign: 'center',
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, rgba(245, 124, 0, 0.05) 0%, rgba(245, 124, 0, 0.1) 100%)',
                        border: '2px solid rgba(245, 124, 0, 0.3)',
                        transition: 'all 0.3s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 12px 24px rgba(245, 124, 0, 0.15)'
                        }
                      }}
                    >
                      <AssignmentIcon sx={{ fontSize: 48, color: '#F57C00', mb: 1 }} />
                      <Typography variant="h4" fontWeight={800} sx={{ color: '#F57C00', mb: 0.5 }}>
                        {statistics.totalLessons}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" fontWeight={600}>
                        Aulas
                      </Typography>
                      <Chip 
                        icon={<TrendingDownIcon />}
                        label="-3%" 
                        size="small"
                        sx={{ 
                          mt: 1,
                          bgcolor: '#FFF3E0', 
                          color: '#F57C00',
                          fontWeight: 700
                        }}
                      />
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardReports;
