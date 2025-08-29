import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box, Typography, TextField, Button, Link, Paper, Alert, Checkbox, FormControlLabel
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Preencha todos os campos');
      return false;
    }
    if (!formData.email.includes('@')) {
      setError('Email inválido');
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
      const result = await login(formData.email, formData.password);
      if (result.success) {
        if (remember) {
          localStorage.setItem('rememberEmail', formData.email);
        } else {
          localStorage.removeItem('rememberEmail');
        }
        navigate('/');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberEmail');
    if (rememberedEmail) {
      setFormData(prev => ({ ...prev, email: rememberedEmail }));
      setRemember(true);
    }
  }, []);

  return (
    <Box sx={{
      minHeight: '100vh',
      background: `url('/images/Imagens/login.jpg') center/cover no-repeat`,
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      p: 2
    }}>
      <Box sx={{ width: '100%', maxWidth: 420, mx: 'auto', position: 'relative', zIndex: 1 }}>
        <Paper elevation={6} sx={{ borderRadius: 5, p: { xs: 3, md: 5 }, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
          <Box sx={{ mb: 2 }}>
            <img src="/logo192.png" alt="Logo" style={{ height: 48, marginBottom: 8 }} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, color: '#1a1a1a', textAlign: 'center' }}>
            Entrar
          </Typography>
          {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              InputProps={{ sx: { borderRadius: 5, background: '#f5f7fa' } }}
              error={Boolean(error && error.includes('Email'))}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              InputProps={{ sx: { borderRadius: 5, background: '#f5f7fa' } }}
              error={Boolean(error && error.includes('senha'))}
            />
            <FormControlLabel
              control={
                <Checkbox 
                  checked={remember} 
                  onChange={e => setRemember(e.target.checked)} 
                  sx={{ color: '#2E7D32' }} 
                />
              }
              label="Lembrar meu email"
              sx={{ mt: 1, mb: 2 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 1, mb: 2, borderRadius: 5, background: '#2E7D32', fontWeight: 700, fontSize: 18, py: 1.5, boxShadow: 'none', '&:hover': { background: '#256029' } }}
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
              <Link component={RouterLink} to="/register" underline="hover" sx={{ color: '#2E7D32', fontWeight: 600 }}>
                Cadastrar
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Login; 