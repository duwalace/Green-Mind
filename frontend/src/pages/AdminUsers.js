import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Button,
  Chip,
  Avatar,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  TextField,
  InputAdornment,
  Tooltip,
  Badge,
  Grid,
  Card,
  CardContent,
  Stack,
  Divider,
  alpha
} from '@mui/material';
import {
  Delete as DeleteIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  RemoveModerator as RemoveModeratorIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  Shield as ShieldIcon,
  TrendingUp as TrendingIcon,
  Group as GroupIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const UserCard = ({ user, onPromote, onDemote, onDelete, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
          border: '2px solid',
          borderColor: isHovered ? (user.is_admin ? '#2E7D32' : '#667eea') : 'rgba(0,0,0,0.08)',
          transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: user.is_admin ? '0 16px 32px rgba(46, 125, 50, 0.2)' : '0 16px 32px rgba(102, 126, 234, 0.2)'
          }
        }}
      >
        <CardContent sx={{ p: 3 }}>
          {/* Header com Avatar */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                user.is_admin ? (
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid white',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                    }}
                  >
                    <ShieldIcon sx={{ fontSize: 14, color: 'white' }} />
                  </Box>
                ) : null
              }
            >
              <Avatar
                src={user.avatar}
                alt={user.name}
                sx={{
                  width: 64,
                  height: 64,
                  background: user.is_admin 
                    ? 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)' 
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: '3px solid',
                  borderColor: user.is_admin ? '#A5D6A7' : '#90CAF9',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  boxShadow: user.is_admin ? '0 8px 16px rgba(46, 125, 50, 0.3)' : '0 8px 16px rgba(102, 126, 234, 0.3)'
                }}
              >
                {user.name?.charAt(0).toUpperCase()}
              </Avatar>
            </Badge>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight={800} gutterBottom>
                {user.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {user.email}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Status Badge */}
          <Box sx={{ mb: 2 }}>
            {user.is_admin ? (
              <Chip
                icon={<AdminPanelSettingsIcon />}
                label="Administrador"
                size="medium"
                sx={{
                  background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
                  color: '#2E7D32',
                  fontWeight: 700,
                  border: '1px solid #A5D6A7',
                  width: '100%'
                }}
              />
            ) : (
              <Chip
                icon={<PersonIcon />}
                label="Usuário"
                size="medium"
                variant="outlined"
                sx={{
                  width: '100%',
                  fontWeight: 600
                }}
              />
            )}
          </Box>

          {/* Meta Info */}
          <Stack spacing={1} sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                Cadastrado em {formatDate(user.created_at)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                ID: {user.id}
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ my: 2 }} />

          {/* Actions */}
          <Stack direction="row" spacing={1}>
            {!user.is_admin ? (
              <Tooltip title="Promover a Admin">
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<AdminPanelSettingsIcon />}
                  onClick={() => onPromote(user.id, user.name)}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 700,
                    borderWidth: 2,
                    borderColor: '#A5D6A7',
                    color: '#2E7D32',
                    '&:hover': {
                      borderWidth: 2,
                      borderColor: '#2E7D32',
                      background: alpha('#2E7D32', 0.08)
                    }
                  }}
                >
                  Promover
                </Button>
              </Tooltip>
            ) : (
              <Tooltip title="Remover Privilégios">
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<RemoveModeratorIcon />}
                  onClick={() => onDemote(user.id, user.name)}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 700,
                    borderWidth: 2,
                    borderColor: '#FFB74D',
                    color: '#E65100',
                    '&:hover': {
                      borderWidth: 2,
                      borderColor: '#E65100',
                      background: alpha('#E65100', 0.08)
                    }
                  }}
                >
                  Remover
                </Button>
              </Tooltip>
            )}
            <Tooltip title="Deletar Usuário">
              <IconButton
                color="error"
                onClick={() => onDelete(user.id, user.name)}
                sx={{
                  borderRadius: 2,
                  border: '2px solid',
                  borderColor: 'rgba(211, 47, 47, 0.2)',
                  px: 2,
                  '&:hover': {
                    borderWidth: 2,
                    borderColor: 'error.main',
                    background: alpha('#d32f2f', 0.08)
                  }
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

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({ open: false, action: null, userId: null, userName: '' });

  const API_BASE_URL = 'http://localhost:3001/api';

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data.users || []);
      setFilteredUsers(res.data.users || []);
    } catch (err) {
      console.error('Erro ao carregar usuários:', err);
      setError('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleOpenConfirmDialog = (action, userId, userName) => {
    setConfirmDialog({ open: true, action, userId, userName });
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialog({ open: false, action: null, userId: null, userName: '' });
  };

  const handleConfirmAction = async () => {
    const { action, userId } = confirmDialog;
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      if (action === 'promote') {
        await axios.put(`${API_BASE_URL}/admin/users/${userId}/make-admin`, {}, { headers });
        setSuccess('Usuário promovido a administrador com sucesso!');
      } else if (action === 'demote') {
        await axios.put(`${API_BASE_URL}/admin/users/${userId}/remove-admin`, {}, { headers });
        setSuccess('Privilégios de administrador removidos com sucesso!');
      } else if (action === 'delete') {
        await axios.delete(`${API_BASE_URL}/admin/users/${userId}`, { headers });
        setSuccess('Usuário deletado com sucesso!');
      }

      await fetchUsers();
      handleCloseConfirmDialog();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Erro na ação:', err);
      setError(err.response?.data?.message || 'Erro ao executar ação');
      handleCloseConfirmDialog();
      setTimeout(() => setError(null), 3000);
    }
  };

  const getActionDialog = () => {
    const { action, userName } = confirmDialog;
    let title = '';
    let content = '';
    let confirmText = '';
    let color = 'primary';

    switch (action) {
      case 'promote':
        title = 'Promover a Administrador';
        content = `Tem certeza que deseja promover "${userName}" a administrador? Este usuário terá acesso total ao painel de administração.`;
        confirmText = 'Promover';
        color = 'success';
        break;
      case 'demote':
        title = 'Remover Privilégios de Admin';
        content = `Tem certeza que deseja remover os privilégios de administrador de "${userName}"?`;
        confirmText = 'Remover Privilégios';
        color = 'warning';
        break;
      case 'delete':
        title = 'Deletar Usuário';
        content = `Tem certeza que deseja deletar "${userName}"? Esta ação NÃO PODE ser desfeita e todos os dados do usuário serão perdidos permanentemente.`;
        confirmText = 'Deletar';
        color = 'error';
        break;
      default:
        return null;
    }

    return (
      <Dialog 
        open={confirmDialog.open} 
        onClose={handleCloseConfirmDialog} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: 4 }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {action === 'delete' && <DeleteIcon color="error" />}
          {action === 'promote' && <AdminPanelSettingsIcon color="success" />}
          {action === 'demote' && <RemoveModeratorIcon color="warning" />}
          {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>{content}</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button 
            onClick={handleCloseConfirmDialog} 
            variant="outlined"
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirmAction} 
            variant="contained" 
            color={color} 
            autoFocus
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
          >
            {confirmText}
          </Button>
        </DialogActions>
      </Dialog>
    );
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
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)'
              }}
            >
              <GroupIcon sx={{ color: 'white', fontSize: 28 }} />
            </Box>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 800,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Gerenciar Usuários
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Gerencie usuários, permissões e acompanhe o cadastro da plataforma
          </Typography>
        </Box>
      </motion.div>

      {/* Alertas */}
      <AnimatePresence>
        {success && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setSuccess(null)}>{success}</Alert>
          </motion.div>
        )}
        {error && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError(null)}>{error}</Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Busca e Estatísticas */}
      <Paper
        elevation={0}
        sx={{
          mb: 4,
          p: 3,
          borderRadius: 3,
          background: 'white',
          border: '1px solid rgba(0,0,0,0.08)'
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#667eea' }} />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2 }
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack direction="row" spacing={2} justifyContent="flex-end" flexWrap="wrap">
              <Chip
                icon={<PersonIcon />}
                label={`${users.length} Usuários`}
                sx={{
                  background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
                  color: '#1565C0',
                  fontWeight: 700,
                  border: '1px solid #90CAF9',
                  px: 1
                }}
              />
              <Chip
                icon={<ShieldIcon />}
                label={`${users.filter(u => u.is_admin).length} Admins`}
                sx={{
                  background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
                  color: '#2E7D32',
                  fontWeight: 700,
                  border: '1px solid #A5D6A7',
                  px: 1
                }}
              />
              <Chip
                icon={<CheckIcon />}
                label={`${users.filter(u => !u.is_admin).length} Regulares`}
                sx={{
                  background: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)',
                  color: '#E65100',
                  fontWeight: 700,
                  border: '1px solid #FFB74D',
                  px: 1
                }}
              />
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Grid de Usuários */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={64} thickness={4} />
        </Box>
      ) : filteredUsers.length === 0 ? (
        <Paper 
          elevation={0}
          sx={{ 
            p: 8, 
            textAlign: 'center',
            borderRadius: 4,
            border: '2px dashed rgba(0,0,0,0.1)'
          }}
        >
          <PersonIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom fontWeight={700}>
            {searchTerm ? 'Nenhum usuário encontrado' : 'Nenhum usuário cadastrado'}
          </Typography>
          <Typography color="text.secondary">
            {searchTerm ? 'Tente ajustar os termos de busca' : 'Os usuários cadastrados aparecerão aqui'}
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredUsers.map((user, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={user.id}>
              <UserCard
                user={user}
                onPromote={handleOpenConfirmDialog.bind(null, 'promote')}
                onDemote={handleOpenConfirmDialog.bind(null, 'demote')}
                onDelete={handleOpenConfirmDialog.bind(null, 'delete')}
                index={index}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Dialog de Confirmação */}
      {getActionDialog()}
    </Box>
  );
};

export default AdminUsers;
