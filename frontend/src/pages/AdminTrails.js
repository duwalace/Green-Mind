import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';

const AdminTrails = () => {
  const [trails, setTrails] = useState([]);
  const [open, setOpen] = useState(false);
  const [editTrail, setEditTrail] = useState(null);
  const [form, setForm] = useState({ title: '', description: '' });

  const fetchTrails = async () => {
    const res = await axios.get('http://localhost:3001/api/trails');
    setTrails(res.data.trails || []);
  };

  useEffect(() => { fetchTrails(); }, []);

  const handleOpen = (trail = null) => {
    setEditTrail(trail);
    setForm(trail ? { title: trail.title, description: trail.description } : { title: '', description: '' });
    setOpen(true);
  };
  const handleClose = () => { setOpen(false); setEditTrail(null); };

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    if (editTrail) {
      await axios.put(`http://localhost:3001/api/trails/${editTrail.id}`, form);
    } else {
      await axios.post('http://localhost:3001/api/trails', form);
    }
    fetchTrails();
    handleClose();
  };

  const handleDelete = async id => {
    await axios.delete(`http://localhost:3001/api/trails/${id}`);
    fetchTrails();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>Gerenciar Trilhas</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>Adicionar Trilha</Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Título</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trails.map((trail) => (
              <TableRow key={trail.id}>
                <TableCell>{trail.title}</TableCell>
                <TableCell>{trail.description}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpen(trail)}><EditIcon /></IconButton>
                  <IconButton color="error" onClick={() => handleDelete(trail.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editTrail ? 'Editar Trilha' : 'Adicionar Trilha'}</DialogTitle>
        <DialogContent>
          <TextField label="Título" name="title" value={form.title} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
          <TextField label="Descrição" name="description" value={form.description} onChange={handleChange} fullWidth multiline rows={3} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained">Salvar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminTrails; 