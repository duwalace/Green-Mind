import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import axios from 'axios';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get('http://localhost:3001/api/admin/users', { headers: { Authorization: `Bearer ${token}` } });
    setUsers(res.data.users || []);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handlePromote = async (id) => {
    const token = localStorage.getItem('token');
    await axios.put(`http://localhost:3001/api/admin/users/${id}/make-admin`, {}, { headers: { Authorization: `Bearer ${token}` } });
    fetchUsers();
  };

  const handleDelete = async (id) => {
    // Implemente a exclusão se desejar
    // await axios.delete(...)
    // fetchUsers();
    alert('Funcionalidade de exclusão pode ser implementada aqui.');
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={3}>Gerenciar Usuários</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Admin</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.is_admin ? 'Sim' : 'Não'}</TableCell>
                <TableCell align="right">
                  {!user.is_admin && (
                    <Button startIcon={<AdminPanelSettingsIcon />} onClick={() => handlePromote(user.id)}>
                      Tornar Admin
                    </Button>
                  )}
                  <IconButton color="error" onClick={() => handleDelete(user.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminUsers; 