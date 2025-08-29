import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box, Typography, TextField, Button, Link, Paper, Alert
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { generateAvatarSvg } from '../utils/avatarUtils';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Preencha todos os campos');
      return false;
    }

    if (formData.name.length < 3) {
      setError('O nome deve ter pelo menos 3 caracteres');
      return false;
    }

    if (!formData.email.includes('@')) {
      setError('Email inválido');
      return false;
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const { confirmPassword, ...registerData } = formData;
      // Generate avatar with initials
      const avatar = generateAvatarSvg(formData.name);
      const result = await register({ ...registerData, avatar });
      
      if (result.success) {
        // Revoke the blob URL after registration
        URL.revokeObjectURL(avatar);
        navigate('/');
      } else {
        setError(result.error);
        // Revoke the blob URL if registration fails
        URL.revokeObjectURL(avatar);
      }
    } catch (err) {
      setError('Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: `url('/images/Imagens/login.jpg') center/cover no-repeat`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      <Box sx={{ width: '100%', maxWidth: 420, mx: 'auto' }}>
        <Paper elevation={6} sx={{ borderRadius: 5, p: { xs: 3, md: 5 }, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
          <Box sx={{ mb: 2 }}>
            <img src="/login.png" alt="Logo" style={{ height: 48, marginBottom: 8 }} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, color: '#1a1a1a', textAlign: 'center' }}>
            Criar Conta
          </Typography>
          {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              required
              fullWidth
              id="name"
              label="Nome"
              name="name"
              autoComplete="name"
              value={formData.name}
              onChange={handleChange}
              InputProps={{ sx: { borderRadius: 5, background: '#f5f7fa' } }}
              sx={{ mb: 2 }}
              error={Boolean(error && error.includes('nome'))}
            />
            <TextField
              required
              fullWidth
              id="email"
              label="E-mail"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              InputProps={{ sx: { borderRadius: 5, background: '#f5f7fa' } }}
              sx={{ mb: 2 }}
              error={Boolean(error && error.includes('Email'))}
            />
            <TextField
              required
              fullWidth
              name="password"
              label="Senha"
              type="password"
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              InputProps={{ sx: { borderRadius: 5, background: '#f5f7fa' } }}
              sx={{ mb: 2 }}
              error={Boolean(error && error.includes('senha'))}
            />
            <TextField
              required
              fullWidth
              name="confirmPassword"
              label="Confirmar Senha"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              InputProps={{ sx: { borderRadius: 5, background: '#f5f7fa' } }}
              sx={{ mb: 3 }}
              error={Boolean(error && error.includes('senhas'))}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mb: 2, borderRadius: 5, background: '#2E7D32', fontWeight: 700, fontSize: 18, py: 1.5, boxShadow: 'none', '&:hover': { background: '#256029' } }}
              disabled={loading}
            >
              {loading ? 'Registrando...' : 'Registrar'}
            </Button>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Link component={RouterLink} to="/login" underline="hover" sx={{ color: '#2E7D32', fontWeight: 600 }}>
                Já tem uma conta? Entre aqui
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Register; 