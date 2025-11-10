import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Tooltip,
  Paper,
  Stack,
  Badge,
  Divider,
  alpha
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  School as SchoolIcon,
  AccessTime as AccessTimeIcon,
  TrendingUp as TrendingIcon,
  Visibility as VisibilityIcon,
  Image as ImageIcon,
  Explore as ExploreIcon,
  Star as StarIcon,
  Timeline as TimelineIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const TrailCard = ({ trail, onEdit, onDelete, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getDifficultyColor = (level) => {
    const colors = {
      beginner: { bg: '#E8F5E9', color: '#2E7D32', border: '#A5D6A7', gradient: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)' },
      intermediate: { bg: '#FFF3E0', color: '#E65100', border: '#FFB74D', gradient: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)' },
      advanced: { bg: '#FFEBEE', color: '#C62828', border: '#EF9A9A', gradient: 'linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%)' }
    };
    return colors[level] || colors.beginner;
  };

  const getStatusColor = (status) => {
    const colors = {
      published: { bg: '#E8F5E9', color: '#2E7D32', icon: <CheckIcon /> },
      draft: { bg: '#FFF3E0', color: '#E65100', icon: <AccessTimeIcon /> },
      archived: { bg: '#F5F5F5', color: '#616161', icon: <AccessTimeIcon /> }
    };
    return colors[status] || colors.draft;
  };

  const difficultyColors = getDifficultyColor(trail.difficulty_level);
  const statusColors = getStatusColor(trail.status);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card
        elevation={0}
        sx={{
          height: '100%',
          borderRadius: 4,
          overflow: 'hidden',
          border: '2px solid',
          borderColor: isHovered ? alpha(difficultyColors.color, 0.4) : 'rgba(0,0,0,0.08)',
          transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
          position: 'relative',
          '&:hover': {
            transform: 'translateY(-12px) scale(1.02)',
            boxShadow: `0 24px 48px ${alpha(difficultyColors.color, 0.2)}`
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: difficultyColors.gradient,
            transform: isHovered ? 'scaleY(1)' : 'scaleY(0)',
            transformOrigin: 'top',
            transition: 'transform 0.3s'
          }
        }}
      >
        {/* Image/Banner Section */}
        <Box sx={{ position: 'relative', height: 220, overflow: 'hidden' }}>
          {trail.image_url ? (
            <CardMedia
              component="img"
              height="220"
              image={trail.image_url}
              alt={trail.title}
              sx={{
                transition: 'transform 0.6s',
                transform: isHovered ? 'scale(1.15)' : 'scale(1)'
              }}
            />
          ) : (
            <Box
              sx={{
                height: 220,
                background: `linear-gradient(135deg, ${difficultyColors.bg} 0%, ${alpha(difficultyColors.color, 0.2)} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <ExploreIcon sx={{ fontSize: 80, color: difficultyColors.color, opacity: 0.2 }} />
              <Box
                sx={{
                  position: 'absolute',
                  width: 200,
                  height: 200,
                  borderRadius: '50%',
                  background: alpha(difficultyColors.color, 0.1),
                  top: -50,
                  right: -50
                }}
              />
            </Box>
          )}

          {/* Overlay Badges */}
          <Stack
            direction="row"
            spacing={1}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16
            }}
          >
            <Chip
              label={trail.status === 'published' ? 'Publicado' : trail.status === 'draft' ? 'Rascunho' : 'Arquivado'}
              icon={statusColors.icon}
              size="small"
              sx={{
                background: statusColors.bg,
                color: statusColors.color,
                fontWeight: 700,
                border: `1px solid ${statusColors.color}`,
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            />
          </Stack>

          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
              p: 2
            }}
          >
            <Chip
              icon={<TrendingIcon />}
              label={trail.difficulty_level === 'beginner' ? 'Iniciante' : trail.difficulty_level === 'intermediate' ? 'Intermediário' : 'Avançado'}
              size="small"
              sx={{
                background: difficultyColors.bg,
                color: difficultyColors.color,
                fontWeight: 700,
                border: `1px solid ${difficultyColors.border}`,
                backdropFilter: 'blur(10px)'
              }}
            />
          </Box>
        </Box>

        {/* Content */}
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              mb: 1.5,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              minHeight: 64,
              lineHeight: 1.3
            }}
          >
            {trail.title}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2.5,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              minHeight: 60,
              lineHeight: 1.6
            }}
          >
            {trail.description}
          </Typography>

          {/* Meta Info */}
          <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7 }}>
              <AccessTimeIcon sx={{ fontSize: 18, color: '#06b6d4' }} />
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#06b6d4' }}>
                {trail.duration_hours}h
              </Typography>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7 }}>
              <TimelineIcon sx={{ fontSize: 18, color: '#f093fb' }} />
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#f093fb' }}>
                Trilha
              </Typography>
            </Box>
          </Stack>

          {/* Actions */}
          <Stack direction="row" spacing={1.5}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => onEdit(trail)}
              sx={{
                borderRadius: 2.5,
                textTransform: 'none',
                fontWeight: 700,
                py: 1.2,
                borderColor: difficultyColors.border,
                color: difficultyColors.color,
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                  borderColor: difficultyColors.color,
                  background: alpha(difficultyColors.color, 0.08),
                  transform: 'translateY(-2px)',
                  boxShadow: `0 8px 16px ${alpha(difficultyColors.color, 0.2)}`
                },
                transition: 'all 0.3s'
              }}
            >
              Editar
            </Button>
            <Tooltip title="Excluir Trilha">
              <IconButton
                color="error"
                onClick={() => onDelete(trail.id, trail.title)}
                sx={{
                  borderRadius: 2.5,
                  border: '2px solid',
                  borderColor: 'rgba(211, 47, 47, 0.2)',
                  px: 2,
                  '&:hover': {
                    borderColor: 'error.main',
                    background: alpha('#d32f2f', 0.08),
                    transform: 'scale(1.05)',
                    boxShadow: '0 8px 16px rgba(211, 47, 47, 0.2)'
                  },
                  transition: 'all 0.3s'
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const AdminTrails = () => {
  const [trails, setTrails] = useState([]);
  const [open, setOpen] = useState(false);
  const [editTrail, setEditTrail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    difficulty_level: 'beginner',
    duration_hours: 10,
    image_url: '',
    status: 'published'
  });

  const API_BASE_URL = 'http://localhost:3001/api';

  const fetchTrails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/trails`);
      setTrails(res.data.trails || []);
    } catch (err) {
      console.error('Erro ao carregar trilhas:', err);
      setError('Erro ao carregar trilhas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrails();
  }, []);

  const handleOpen = (trail = null) => {
    if (trail) {
      setEditTrail(trail);
      setForm({
        title: trail.title || '',
        description: trail.description || '',
        difficulty_level: trail.difficulty_level || 'beginner',
        duration_hours: trail.duration_hours || 10,
        image_url: trail.image_url || '',
        status: trail.status || 'published'
      });
    } else {
      setEditTrail(null);
      setForm({
        title: '',
        description: '',
        difficulty_level: 'beginner',
        duration_hours: 10,
        image_url: '',
        status: 'published'
      });
    }
    setError(null);
    setSuccess(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditTrail(null);
    setError(null);
    setSuccess(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!form.title || !form.description) {
        setError('Título e descrição são obrigatórios');
        return;
      }

      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      if (editTrail) {
        await axios.put(`${API_BASE_URL}/trails/${editTrail.id}`, form, { headers });
        setSuccess('Trilha atualizada com sucesso!');
      } else {
        await axios.post(`${API_BASE_URL}/trails`, form, { headers });
        setSuccess('Trilha criada com sucesso!');
      }

      await fetchTrails();
      setTimeout(() => handleClose(), 1500);
    } catch (error) {
      console.error('Erro ao salvar trilha:', error);
      setError(error.response?.data?.message || 'Erro ao salvar trilha');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Tem certeza que deseja excluir a trilha "${title}"? Esta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/trails/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Trilha excluída com sucesso!');
      await fetchTrails();
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Erro ao deletar trilha:', error);
      setError(error.response?.data?.message || 'Erro ao deletar trilha');
      setTimeout(() => setError(null), 3000);
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 24px rgba(6, 182, 212, 0.4)'
                  }}
                >
                  <ExploreIcon sx={{ color: 'white', fontSize: 28 }} />
                </Box>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  Gerenciar Trilhas
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                Crie jornadas de aprendizado completas para seus alunos
              </Typography>
            </Box>
            
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpen()}
              size="large"
              sx={{
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 700,
                px: 4,
                py: 1.5,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
                '&:hover': {
                  boxShadow: '0 12px 32px rgba(102, 126, 234, 0.5)',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s'
              }}
            >
              Nova Trilha
            </Button>
          </Box>

          {/* Stats Bar */}
          <Paper
            elevation={0}
            sx={{
              mt: 3,
              p: 2.5,
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
              <Badge badgeContent={trails.length} color="primary" max={999}>
                <ExploreIcon sx={{ color: '#06b6d4', fontSize: 24 }} />
              </Badge>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                Total de Trilhas
              </Typography>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckIcon sx={{ color: '#2E7D32', fontSize: 24 }} />
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                {trails.filter(t => t.status === 'published').length} Publicadas
              </Typography>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccessTimeIcon sx={{ color: '#E65100', fontSize: 24 }} />
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                {trails.filter(t => t.status === 'draft').length} Em Rascunho
              </Typography>
            </Box>
          </Paper>
        </Box>
      </motion.div>

      {/* Alertas */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setSuccess(null)}>
              {success}
            </Alert>
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid de Trilhas */}
      {loading && !open ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={64} thickness={4} />
        </Box>
      ) : trails.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Paper 
            elevation={0}
            sx={{ 
              p: 8, 
              textAlign: 'center',
              borderRadius: 4,
              border: '2px dashed rgba(0,0,0,0.1)'
            }}
          >
            <ExploreIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom fontWeight={700}>
              Nenhuma trilha cadastrada
            </Typography>
            <Typography color="text.secondary" paragraph>
              Comece criando a primeira trilha de aprendizado
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpen()}
              sx={{
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 700,
                px: 4,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}
            >
              Criar Primeira Trilha
            </Button>
          </Paper>
        </motion.div>
      ) : (
        <Grid container spacing={3}>
          {trails.map((trail, index) => (
            <Grid item xs={12} sm={6} lg={4} key={trail.id}>
              <TrailCard
                trail={trail}
                onEdit={handleOpen}
                onDelete={handleDelete}
                index={index}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Dialog de Criação/Edição */}
      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: '0 24px 48px rgba(0,0,0,0.2)'
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
            color: 'white',
            py: 3
          }}
        >
          <Typography variant="h5" fontWeight={800}>
            {editTrail ? 'Editar Trilha' : 'Nova Trilha'}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
            {editTrail ? 'Atualize as informações da trilha' : 'Crie uma nova jornada de aprendizado'}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ mt: 3 }}>
          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>{success}</Alert>}

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Título da Trilha"
                name="title"
                value={form.title}
                onChange={handleChange}
                fullWidth
                required
                placeholder="Ex: Introdução à Sustentabilidade"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Descrição"
                name="description"
                value={form.description}
                onChange={handleChange}
                fullWidth
                required
                multiline
                rows={4}
                placeholder="Descreva os objetivos e conteúdo desta trilha..."
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Nível de Dificuldade</InputLabel>
                <Select
                  name="difficulty_level"
                  value={form.difficulty_level}
                  label="Nível de Dificuldade"
                  onChange={handleChange}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="beginner">Iniciante</MenuItem>
                  <MenuItem value="intermediate">Intermediário</MenuItem>
                  <MenuItem value="advanced">Avançado</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Duração Total"
                name="duration_hours"
                type="number"
                value={form.duration_hours}
                onChange={handleChange}
                fullWidth
                InputProps={{
                  endAdornment: <InputAdornment position="end">horas</InputAdornment>,
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="URL da Imagem"
                name="image_url"
                value={form.image_url}
                onChange={handleChange}
                fullWidth
                placeholder="/images/trails/..."
                helperText="Caminho relativo ou URL completa da imagem"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={form.status}
                  label="Status"
                  onChange={handleChange}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="published">Publicado</MenuItem>
                  <MenuItem value="draft">Rascunho</MenuItem>
                  <MenuItem value="archived">Arquivado</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 3, gap: 1 }}>
          <Button 
            onClick={handleClose} 
            disabled={loading}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={loading || !form.title || !form.description}
            startIcon={loading ? <CircularProgress size={20} /> : null}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 700,
              px: 4,
              background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
              '&:hover': {
                boxShadow: '0 8px 20px rgba(6, 182, 212, 0.4)'
              }
            }}
          >
            {loading ? 'Salvando...' : 'Salvar Trilha'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminTrails;
