import React, { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './styles/theme';
import { Box, CircularProgress } from '@mui/material';

// Componentes com carregamento imediato
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

// Páginas com lazy loading
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const TrailSelection = lazy(() => import('./pages/TrailSelection'));
const TrailLevel = lazy(() => import('./pages/TrailLevel'));
const Profile = lazy(() => import('./pages/Profile'));
const Achievements = lazy(() => import('./pages/Achievements'));
const About = lazy(() => import('./pages/About'));
const TrailCourses = lazy(() => import('./pages/TrailCourses'));
const AllCourses = lazy(() => import('./pages/AllCourses'));
const CourseDetails = lazy(() => import('./pages/CourseDetails'));
const Aulas = lazy(() => import('./pages/Aulas'));
const AdminLessons = lazy(() => import('./pages/AdminLessons'));

// Componente de loading
const LoadingFallback = () => (
  <Box 
    sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '50vh' 
    }}
  >
    <CircularProgress color="primary" />
  </Box>
);

const App = () => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/trails" element={<TrailSelection />} />
            <Route path="/trails/:trailId" element={<TrailCourses />} />
            <Route path="/courses" element={<AllCourses />} />
            <Route path="/courses/:courseId/start" element={<Aulas />} />
            <Route path="/courses/:courseId/level" element={<TrailLevel />} />
            <Route path="/courses/:id" element={<CourseDetails />} />
            <Route path="/dashboard/*" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/achievements" element={<PrivateRoute><Achievements /></PrivateRoute>} />
            <Route
              path="/admin/lessons"
              element={
                <PrivateRoute>
                  <AdminRoute>
                    <AdminLessons />
                  </AdminRoute>
                </PrivateRoute>
              }
            />
          </Routes>
        </Suspense>
      </Box>
    </ThemeProvider>
  );
};

export default App;
