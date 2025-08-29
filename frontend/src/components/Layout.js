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
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  School as SchoolIcon,
  EmojiEvents as EmojiEventsIcon,
  Person as PersonIcon,
  ExitToApp as ExitToAppIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import Footer from './Footer';
import FooterLogged from './FooterLogged';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { text: 'Início', icon: <HomeIcon />, path: '/' },
    { text: 'Trilhas', icon: <SchoolIcon />, path: '/trails' },
    { text: 'Conquistas', icon: <EmojiEventsIcon />, path: '/achievements' }
  ];

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => {
              navigate(item.path);
              setDrawerOpen(false);
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider />
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        {drawer}
      </Drawer>

      <Container component="main" sx={{ flexGrow: 1, py: 0 }}>
        {children}
      </Container>

      {isAuthenticated ? <FooterLogged /> : <Footer />}
    </Box>
  );
};

export default Layout; 