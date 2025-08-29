import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Avatar,
  Button,
  LinearProgress,
  Card,
  CardContent,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
  useTheme,
  useMediaQuery,
  Stack,
  Badge,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  Star as StarIcon,
  Timeline as TimelineIcon,
  Edit as EditIcon,
  WaterDrop as WaterIcon,
  Bolt as EnergyIcon,
  WbSunny as ClimateIcon,
  Delete as RecyclingIcon,
  PhotoCamera as PhotoCameraIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  LocationOn as LocationIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Psychology as PsychologyIcon,
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const Profile = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, setUser } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    location: user?.location || '',
    occupation: user?.occupation || '',
    interests: user?.interests || []
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Dados de exemplo para demonstração
  const stats = {
    completedCourses: 12,
    totalPoints: 2500,
    achievements: 8,
    level: user?.level || 1,
    xp: 750,
    nextLevelXp: 1000
  };

  const achievements = [
    {
      id: 1,
      title: 'Primeiro Passo',
      description: 'Completou sua primeira lição',
      icon: <TrophyIcon sx={{ color: '#FFD700' }} />,
      date: '2024-01-15',
      points: 100
    },
    {
      id: 2,
      title: 'Mestre da Água',
      description: 'Completou todas as lições sobre água',
      icon: <WaterIcon sx={{ color: '#2196F3' }} />,
      date: '2024-01-20',
      points: 500
    },
    {
      id: 3,
      title: 'Energia Verde',
      description: 'Aprendeu sobre energia renovável',
      icon: <EnergyIcon sx={{ color: '#FFC107' }} />,
      date: '2024-01-25',
      points: 300
    }
  ];

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEditClick = () => {
    setEditForm({
      name: user?.name || '',
      email: user?.email || '',
      bio: user?.bio || '',
      location: user?.location || '',
      occupation: user?.occupation || '',
      interests: user?.interests || []
    });
    setEditDialogOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSave = async () => {
    try {
      const response = await axios.put('http://localhost:3001/api/users/profile', editForm, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      // Atualizar o usuário com a URL completa do avatar
      const updatedUser = {
        ...response.data.user,
        avatar: response.data.user.avatar ? (response.data.user.avatar.startsWith('http') ? response.data.user.avatar : `http://localhost:3001${response.data.user.avatar}`) : null
      };
      
      setUser(updatedUser);
      setEditDialogOpen(false);
      setSnackbar({
        open: true,
        message: 'Perfil atualizado com sucesso!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Erro ao atualizar perfil',
        severity: 'error'
      });
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (user?.avatar && user.avatar.startsWith('blob:')) {
      URL.revokeObjectURL(user.avatar);
    }

    const formData = new FormData();
    formData.append('avatar', file);

    setUploading(true);
    try {
      const response = await axios.put('http://localhost:3001/api/users/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const updatedUser = {
        ...response.data.user,
        avatar: response.data.user.avatar ? `http://localhost:3001${response.data.user.avatar}` : null
      };
      setUser(updatedUser);
    } catch (error) {
      console.error('Error uploading avatar:', error);
    } finally {
      setUploading(false);
    }
  };

  React.useEffect(() => {
    return () => {
      if (user?.avatar && user.avatar.startsWith('blob:')) {
        URL.revokeObjectURL(user.avatar);
      }
    };
  }, [user?.avatar]);

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const ProfileHeader = () => (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)',
        borderRadius: 2,
        px: 4,
        py: 8,
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        mb: 4
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, transparent 60%)',
          pointerEvents: 'none'
        }}
      />
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} md="auto">
          <Box sx={{ position: 'relative', display: 'inline-block' }}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <Tooltip title="Alterar foto">
                  <IconButton
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': { bgcolor: 'primary.dark' },
                      width: 32,
                      height: 32
                    }}
                    onClick={handleImageClick}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <PhotoCameraIcon sx={{ fontSize: 16 }} />
                    )}
                  </IconButton>
                </Tooltip>
              }
            >
              <Avatar
                src={user?.avatar ? (user.avatar.startsWith('http') ? user.avatar : `http://localhost:3001${user.avatar}`) : null}
                alt={user?.name}
                sx={{
                  width: 120,
                  height: 120,
                  border: '4px solid rgba(255,255,255,0.2)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                }}
              />
            </Badge>
            <input
              type="file"
              accept="image/*"
              hidden
              ref={fileInputRef}
              onChange={handleImageChange}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              {user?.name}
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9, mb: user?.bio ? 1 : 2 }}>
              {user?.occupation || 'Estudante de Sustentabilidade'}
            </Typography>
            {user?.bio && (
              <Typography variant="body2" sx={{ opacity: 0.85, mb: 2, maxWidth: 500 }}>
                {user.bio}
              </Typography>
            )}
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              {user?.location && (
                <Chip
                  icon={<LocationIcon />}
                  label={user.location}
                  size="small"
                  sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }}
                />
              )}
              <Chip
                icon={<SchoolIcon />}
                label={`Nível ${stats.level}`}
                size="small"
                sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }}
              />
              <Chip
                icon={<StarIcon />}
                label={`${stats.totalPoints} pontos`}
                size="small"
                sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }}
              />
            </Stack>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={handleEditClick}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                }}
              >
                Editar Perfil
              </Button>
              <Button
                variant="outlined"
                startIcon={<ShareIcon />}
                sx={{ color: 'white', borderColor: 'white' }}
              >
                Compartilhar
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );

  const StatsCard = () => (
    <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Progresso
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
                {stats.completedCourses}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Cursos Completos
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
                {stats.totalPoints}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pontos Totais
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
                {stats.achievements}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Conquistas
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
                {stats.level}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Nível Atual
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Progresso para o próximo nível
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {stats.xp} / {stats.nextLevelXp} XP
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={(stats.xp / stats.nextLevelXp) * 100}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: 'rgba(0,0,0,0.1)',
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(90deg, #2E7D32 0%, #4CAF50 100%)',
                borderRadius: 4
              }
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );

  const AchievementsList = () => (
    <Grid container spacing={2}>
      {achievements.map((achievement) => (
        <Grid item xs={12} sm={6} md={4} key={achievement.id}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card
              sx={{
                height: '100%',
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)'
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {achievement.icon}
                  <Typography variant="h6" sx={{ ml: 1, fontWeight: 600 }}>
                    {achievement.title}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {achievement.description}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip
                    icon={<StarIcon sx={{ fontSize: 16 }} />}
                    label={`${achievement.points} pontos`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                  <Typography variant="caption" color="text.secondary">
                    {new Date(achievement.date).toLocaleDateString()}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      ))}
    </Grid>
  );

  const EditProfileDialog = () => {
    const [localForm, setLocalForm] = useState(editForm);
    const [focusedField, setFocusedField] = useState(null);

    // Atualizar o formulário local quando o editForm mudar
    useEffect(() => {
      setLocalForm(editForm);
    }, [editForm]);

    const handleLocalChange = (e) => {
      const { name, value } = e.target;
      setLocalForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
      try {
        const response = await axios.put('http://localhost:3001/api/users/profile', localForm, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        
        // Atualizar o usuário com a URL completa do avatar
        const updatedUser = {
          ...response.data.user,
          avatar: response.data.user.avatar ? (response.data.user.avatar.startsWith('http') ? response.data.user.avatar : `http://localhost:3001${response.data.user.avatar}`) : null
        };
        
        setUser(updatedUser);
        setEditDialogOpen(false);
        setSnackbar({
          open: true,
          message: 'Perfil atualizado com sucesso!',
          severity: 'success'
        });
      } catch (error) {
        console.error('Error updating profile:', error);
        setSnackbar({
          open: true,
          message: error.response?.data?.message || 'Erro ao atualizar perfil',
          severity: 'error'
        });
      }
    };

    return (
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        keepMounted
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h5" component="div">
              Editar Perfil
            </Typography>
            <IconButton onClick={() => setEditDialogOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nome"
                  name="name"
                  value={localForm.name}
                  onChange={handleLocalChange}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  variant="outlined"
                  autoFocus={focusedField === 'name'}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={localForm.email}
                  onChange={handleLocalChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  variant="outlined"
                  type="email"
                  autoFocus={focusedField === 'email'}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Localização"
                  name="location"
                  value={localForm.location}
                  onChange={handleLocalChange}
                  onFocus={() => setFocusedField('location')}
                  onBlur={() => setFocusedField(null)}
                  variant="outlined"
                  placeholder="Cidade, Estado"
                  autoFocus={focusedField === 'location'}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Ocupação"
                  name="occupation"
                  value={localForm.occupation}
                  onChange={handleLocalChange}
                  onFocus={() => setFocusedField('occupation')}
                  onBlur={() => setFocusedField(null)}
                  variant="outlined"
                  placeholder="Ex: Estudante, Profissional, etc."
                  autoFocus={focusedField === 'occupation'}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Biografia"
                  name="bio"
                  value={localForm.bio}
                  onChange={handleLocalChange}
                  onFocus={() => setFocusedField('bio')}
                  onBlur={() => setFocusedField(null)}
                  variant="outlined"
                  multiline
                  rows={4}
                  placeholder="Conte um pouco sobre você..."
                  autoFocus={focusedField === 'bio'}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setEditDialogOpen(false)}
            startIcon={<CancelIcon />}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            startIcon={<SaveIcon />}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <ProfileHeader />
          <StatsCard />
          
          <Paper sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  py: 2
                }
              }}
            >
              <Tab label="Conquistas" />
              <Tab label="Progresso" />
              <Tab label="Atividade" />
            </Tabs>

            <Box sx={{ p: 3 }}>
              {tabValue === 0 && <AchievementsList />}
              {tabValue === 1 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h6" color="text.secondary">
                    Em breve: Gráficos de progresso detalhados
                  </Typography>
                </Box>
              )}
              {tabValue === 2 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h6" color="text.secondary">
                    Em breve: Histórico de atividades
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </motion.div>
      </AnimatePresence>

      <EditProfileDialog />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile; 