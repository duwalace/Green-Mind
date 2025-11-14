import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Typography,
  Avatar,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  MenuBook as MenuBookIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  Assessment as AssessmentIcon,
  Notifications as NotificationsIcon,
  Help as HelpIcon,
  Logout as LogoutIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Quiz as QuizIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

const drawerWidth = 280;

const menuItems = [
  {
    text: 'Visão Geral',
    icon: <DashboardIcon />,
    path: '/dashboard'
  },
  {
    text: 'Trilhas',
    icon: <SchoolIcon />,
    path: '/dashboard/trails'
  },
  {
    text: 'Cursos',
    icon: <MenuBookIcon />,
    path: '/dashboard/courses'
  },
  {
    text: 'Aulas',
    icon: <AssignmentIcon />,
    path: '/dashboard/lessons'
  },
  {
    text: 'Quizzes',
    icon: <QuizIcon />,
    path: '/dashboard/quizzes'
  },
  {
    text: 'Usuários',
    icon: <PeopleIcon />,
    path: '/dashboard/users'
  },
  { text: 'Relatórios', icon: <AssessmentIcon />, path: '/dashboard/reports' }
];

const DashboardSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [collapsed, setCollapsed] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const drawer = (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%',
      background: 'linear-gradient(180deg, #01579B 0%, #0277BD 100%)',
      color: '#fff'
    }}>
      {/* Header */}
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar 
            src={user?.avatar} 
            alt={user?.name}
            sx={{ 
              width: 40, 
              height: 40, 
              border: '2px solid rgba(255,255,255,0.2)',
              bgcolor: '#29B6F6'
            }}
          />
          {!collapsed && (
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {user?.name}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                Administrador
              </Typography>
            </Box>
          )}
        </Box>
        <IconButton 
          onClick={() => setCollapsed(!collapsed)}
          sx={{ 
            color: '#fff',
            '&:hover': { background: 'rgba(255,255,255,0.1)' }
          }}
        >
          {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Box>

      {/* Menu Items */}
      <List sx={{ flexGrow: 1, px: 2, py: 1 }}>
        {menuItems.map((item) => (
          <motion.div
            key={item.text}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                selected={location.pathname === item.path}
                sx={{
                  borderRadius: 2,
                  '&.Mui-selected': {
                    background: 'rgba(255,255,255,0.1)',
                    '&:hover': {
                      background: 'rgba(255,255,255,0.15)',
                    }
                  },
                  '&:hover': {
                    background: 'rgba(255,255,255,0.05)',
                  }
                }}
              >
                <ListItemIcon sx={{ 
                  minWidth: 40,
                  color: location.pathname === item.path ? '#fff' : 'rgba(255,255,255,0.7)'
                }}>
                  {item.icon}
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{
                      fontSize: '0.95rem',
                      fontWeight: location.pathname === item.path ? 600 : 400
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          </motion.div>
        ))}
      </List>

      {/* Footer */}
      <Box sx={{ 
        p: 2, 
        borderTop: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: 1
      }}>
        <Tooltip title="Sair">
          <IconButton 
            onClick={handleLogout}
            sx={{ 
              color: 'rgba(255,255,255,0.7)',
              '&:hover': { 
                background: 'rgba(255,255,255,0.1)',
                color: '#fff'
              }
            }}
          >
            <LogoutIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      sx={{
        width: collapsed ? 80 : drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: collapsed ? 80 : drawerWidth,
          boxSizing: 'border-box',
          border: 'none',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      }}
      open={true}
    >
      {drawer}
    </Drawer>
  );
};

export default DashboardSidebar; 