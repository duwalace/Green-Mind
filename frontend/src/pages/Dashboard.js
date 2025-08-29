import React from 'react';
import { Box, Toolbar } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardSidebar';
import DashboardOverview from './DashboardOverview';
import AdminCourses from './AdminCourses';
import AdminTrails from './AdminTrails';
import AdminUsers from './AdminUsers';
import AdminLessons from './AdminLessons';

const Dashboard = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#f9f9f9' }}>
      <DashboardSidebar />
      <Box component="main" sx={{ flexGrow: 1, width: '100%' }}>
        <Toolbar />
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          <Routes>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="/courses" element={<AdminCourses />} />
            <Route path="/trails" element={<AdminTrails />} />
            <Route path="/lessons" element={<AdminLessons />} />
            <Route path="/users" element={<AdminUsers />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard; 