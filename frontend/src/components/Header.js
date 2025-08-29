import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery
} from '@mui/material';
import { Menu as MenuIcon, Person as PersonIcon, ExitToApp as ExitToAppIcon, EmojiEvents as EmojiEventsIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const navLinks = [
  { text: 'Lar', path: '/' },
  { text: 'Trilhas', path: '/trails' },
  { text: 'Cursos', path: '/courses' },
  { text: 'Conquistas', path: '/achievements' }
];

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElNav, setAnchorElNav] = useState(null);
  const isMobile = useMediaQuery('(max-width:900px)');

  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);
  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <AppBar 
      position="fixed" 
      elevation={0} 
      sx={{ 
        background: '#FFF', 
        boxShadow: 'none', 
        borderBottom: '1px solid rgba(0,0,0,0.1)', 
        zIndex: 1200 
      }}
    >
      <Container maxWidth={false} sx={{ px: { xs: 1, sm: 4 } }}>
        <Toolbar disableGutters sx={{ minHeight: 68 }}>
          {/* Logo animado */}
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 3, cursor: 'pointer', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.07) rotate(-3deg)' } }} onClick={() => navigate('/') }>
            <Box component="img" src="/logosite.png" alt="Logo" sx={{ height: 44, width: 44, mr: 1, borderRadius: 2, boxShadow: '0 2px 8px 0 rgba(44,62,80,0.08)' }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#2E7D32', letterSpacing: 0.5, display: { xs: 'none', sm: 'block' }, fontFamily: 'Poppins, Roboto, Arial' }}>
              Green Mind
            </Typography>
          </Box>

          {/* Menu hamburguer mobile */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton size="large" aria-label="menu" onClick={handleOpenNavMenu} sx={{ ml: 1 }}>
              <MenuIcon sx={{ color: '#2E7D32', fontSize: 32 }} />
            </IconButton>
            <Menu
              anchorEl={anchorElNav}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {navLinks.map((item) => (
                <MenuItem key={item.text} onClick={() => { handleCloseNavMenu(); navigate(item.path); }} selected={location.pathname === item.path}>
                  <Typography textAlign="center" sx={{ color: location.pathname === item.path ? '#2E7D32' : '#222', fontWeight: 600 }}>{item.text}</Typography>
                </MenuItem>
              ))}
              {isAuthenticated && user?.is_admin && (
                <MenuItem onClick={() => { handleCloseNavMenu(); navigate('/dashboard'); }}>
                  <Typography textAlign="center" sx={{ color: '#2E7D32', fontWeight: 600 }}>Dashboard</Typography>
                </MenuItem>
              )}
              {!isAuthenticated && (
                <>
                  <MenuItem onClick={() => { handleCloseNavMenu(); navigate('/login'); }}>
                    <Typography textAlign="center" sx={{ color: '#2E7D32', fontWeight: 600 }}>Entrar</Typography>
                  </MenuItem>
                  <MenuItem onClick={() => { handleCloseNavMenu(); navigate('/register'); }}>
                    <Typography textAlign="center" sx={{ color: '#fff', background: '#9B5DE5', px: 2, borderRadius: 2, fontWeight: 600 }}>Cadastrar</Typography>
                  </MenuItem>
                </>
              )}
            </Menu>
          </Box>

          {/* Menu centralizado desktop com barra animada */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center', gap: 2, position: 'relative' }}>
            {navLinks.map((item) => (
              <Button
                key={item.text}
                onClick={() => navigate(item.path)}
                sx={{
                  color: location.pathname === item.path ? '#2E7D32' : '#222',
                  fontWeight: 600,
                  fontSize: 17,
                  px: 2.5,
                  background: 'none',
                  boxShadow: 'none',
                  borderRadius: 2,
                  position: 'relative',
                  transition: 'color 0.2s',
                  '&:hover': { color: '#4CAF50', background: 'rgba(46,125,50,0.07)' },
                  minWidth: 90
                }}
                disableRipple
              >
                {item.text}
                {location.pathname === item.path && (
                  <Box sx={{ position: 'absolute', left: 12, right: 12, bottom: 2, height: 4, borderRadius: 2, background: 'linear-gradient(90deg, #B6E13A 0%, #4CAF50 100%)', transition: 'all 0.3s' }} />
                )}
              </Button>
            ))}
          </Box>

          {/* Botões à direita (Entrar/Cadastrar ou Avatar) */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 2 }}>
            {!isAuthenticated ? (
              <>
                <Button
                  variant="outlined"
                  sx={{ color: '#2E7D32', borderColor: '#2E7D32', fontWeight: 600, px: 3, borderRadius: 2, fontSize: 16, boxShadow: 'none', background: '#F5F5F5', '&:hover': { borderColor: '#4CAF50', color: '#4CAF50', background: '#F5F5F5' } }}
                  onClick={() => navigate('/login')}
                >
                  Entrar
                </Button>
                <Button
                  variant="contained"
                  sx={{ background: '#2E7D32', color: '#fff', fontWeight: 700, px: 3, borderRadius: 2, fontSize: 16, boxShadow: 'none', '&:hover': { background: '#1B5E20' } }}
                  onClick={() => navigate('/register')}
                >
                  Cadastrar
                </Button>
              </>
            ) : (
              <>
                <Tooltip title={user?.name || 'Conta'}>
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt={user?.name} src={user?.avatar} sx={{ width: 42, height: 42, bgcolor: '#2E7D32', color: '#fff', fontWeight: 700, border: '2px solid #B6E13A' }} />
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={anchorElUser}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                  <MenuItem disabled>
                    <Typography sx={{ fontWeight: 700, color: '#2E7D32' }}>{user?.name}</Typography>
                  </MenuItem>
                  {user?.is_admin && (
                    <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/dashboard'); }}>
                      <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
                      <ListItemText>Dashboard</ListItemText>
                    </MenuItem>
                  )}
                  <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/profile'); }}>
                    <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
                    <ListItemText>Perfil</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/achievements'); }}>
                    <ListItemIcon><EmojiEventsIcon fontSize="small" /></ListItemIcon>
                    <ListItemText>Conquistas</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={() => { handleCloseUserMenu(); handleLogout(); }}>
                    <ListItemIcon><ExitToAppIcon fontSize="small" /></ListItemIcon>
                    <ListItemText>Sair</ListItemText>
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header; 