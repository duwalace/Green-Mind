import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [open, setOpen] = useState(false);
  const [editCourse, setEditCourse] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', trail_id: '' });
  const [trails, setTrails] = useState([]);

  const fetchCourses = async () => {
    const res = await axios.get('http://localhost:3001/api/courses');
    setCourses(res.data.courses || []);
  };

  const fetchTrails = async () => {
    const res = await axios.get('http://localhost:3001/api/trails');
    setTrails(res.data.trails || []);
  };

  useEffect(() => { fetchCourses(); fetchTrails(); }, []);

  const handleOpen = (course = null) => {
    setEditCourse(course);
    setForm(course ? { title: course.title, description: course.description, trail_id: course.trail_id || '' } : { title: '', description: '', trail_id: '' });
    setOpen(true);
  };
  const handleClose = () => { setOpen(false); setEditCourse(null); };

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    if (!form.trail_id) return; // trail_id obrigatório
    if (editCourse) {
      await axios.put(`http://localhost:3001/api/courses/${editCourse.id}`, form);
    } else {
      await axios.post('http://localhost:3001/api/courses', form);
    }
    fetchCourses();
    handleClose();
  };

  const handleDelete = async id => {
    await axios.delete(`http://localhost:3001/api/courses/${id}`);
    fetchCourses();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>Gerenciar Cursos</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>Adicionar Curso</Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Título</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Trilha</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course.id}>
                <TableCell>{course.title}</TableCell>
                <TableCell>{course.description}</TableCell>
                <TableCell>{course.trail_title || '-'}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpen(course)}><EditIcon /></IconButton>
                  <IconButton color="error" onClick={() => handleDelete(course.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editCourse ? 'Editar Curso' : 'Adicionar Curso'}</DialogTitle>
        <DialogContent>
          <TextField label="Título" name="title" value={form.title} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
          <TextField label="Descrição" name="description" value={form.description} onChange={handleChange} fullWidth multiline rows={3} sx={{ mb: 2 }} />
          <FormControl fullWidth sx={{ mb: 2 }} required>
            <InputLabel id="trail-label">Trilha</InputLabel>
            <Select
              labelId="trail-label"
              name="trail_id"
              value={form.trail_id}
              label="Trilha"
              onChange={handleChange}
            >
              <MenuItem value=""><em>Selecione uma trilha</em></MenuItem>
              {trails.map(trail => (
                <MenuItem key={trail.id} value={trail.id}>{trail.title}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained" disabled={!form.trail_id}>Salvar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminCourses; 