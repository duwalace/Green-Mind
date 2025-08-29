import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import CreateLesson from '../components/CreateLesson';

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
  marginBottom: theme.spacing(3),
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: 12,
  boxShadow: 'none',
  '& .MuiTableHead-root': {
    backgroundColor: theme.palette.grey[50],
  },
  '& .MuiTableCell-head': {
    fontWeight: 600,
    color: theme.palette.text.primary,
  },
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  backgroundColor:
    status === 'published'
      ? theme.palette.success.light
      : status === 'draft'
      ? theme.palette.warning.light
      : theme.palette.grey[300],
  color:
    status === 'published'
      ? theme.palette.success.dark
      : status === 'draft'
      ? theme.palette.warning.dark
      : theme.palette.grey[700],
  fontWeight: 500,
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  padding: theme.spacing(1),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const AdminLessons = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('sequence_order');
  const [sortOrder, setSortOrder] = useState('asc');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState(null);

  const API_BASE_URL = 'http://localhost:3001/api';

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Token não encontrado');
      }

      const response = await fetch(`${API_BASE_URL}/admin/lessons`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Sessão expirada. Por favor, faça login novamente.');
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Erro ao carregar aulas');
      }

      const data = await response.json();
      setLessons(data.lessons);
    } catch (err) {
      console.error('Erro ao buscar aulas:', err);
      setError(err.message || 'Erro ao carregar aulas. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLesson = async (lessonData) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Token não encontrado');
      }

      const response = await fetch(`${API_BASE_URL}/admin/lessons`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(lessonData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Sessão expirada. Por favor, faça login novamente.');
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Erro ao criar aula');
      }

      await fetchLessons();
      setOpenCreateModal(false);
    } catch (err) {
      console.error('Erro ao criar aula:', err);
      setError(err.message || 'Erro ao criar aula. Tente novamente mais tarde.');
    }
  };

  const handleUpdateLesson = async (lessonData) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Token não encontrado');
      }

      const response = await fetch(`${API_BASE_URL}/admin/lessons/${lessonData.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(lessonData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Sessão expirada. Por favor, faça login novamente.');
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Erro ao atualizar aula');
      }

      await fetchLessons();
      setSelectedLesson(null);
    } catch (err) {
      console.error('Erro ao atualizar aula:', err);
      setError(err.message || 'Erro ao atualizar aula. Tente novamente mais tarde.');
    }
  };

  const handleDeleteLesson = async () => {
    if (!lessonToDelete) return;

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Token não encontrado');
      }

      const response = await fetch(`${API_BASE_URL}/admin/lessons/${lessonToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Sessão expirada. Por favor, faça login novamente.');
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Erro ao excluir aula');
      }

      await fetchLessons();
      setDeleteDialogOpen(false);
      setLessonToDelete(null);
    } catch (err) {
      console.error('Erro ao excluir aula:', err);
      setError(err.message || 'Erro ao excluir aula. Tente novamente mais tarde.');
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const filteredLessons = lessons
    .filter(lesson => {
      const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          lesson.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || lesson.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (typeof aValue === 'string') {
        return sortOrder === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'success';
      case 'draft':
        return 'warning';
      case 'archived':
        return 'default';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <StyledContainer maxWidth="xl">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" component="h1" gutterBottom>
              Gerenciar Aulas
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setOpenCreateModal(true)}
            >
              Nova Aula
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <StyledCard>
            <CardContent>
              <Grid container spacing={2} alignItems="center" mb={3}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Buscar aulas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      label="Status"
                    >
                      <MenuItem value="all">Todos</MenuItem>
                      <MenuItem value="published">Publicado</MenuItem>
                      <MenuItem value="draft">Rascunho</MenuItem>
                      <MenuItem value="archived">Arquivado</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={5}>
                  <Box display="flex" gap={1}>
                    <Button
                      variant="outlined"
                      startIcon={<SortIcon />}
                      onClick={() => handleSort('sequence_order')}
                    >
                      Ordem
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<SortIcon />}
                      onClick={() => handleSort('title')}
                    >
                      Título
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<SortIcon />}
                      onClick={() => handleSort('duration_minutes')}
                    >
                      Duração
                    </Button>
                  </Box>
                </Grid>
              </Grid>

              <StyledTableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Ordem</TableCell>
                      <TableCell>Título</TableCell>
                      <TableCell>Duração</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredLessons.map((lesson) => (
                      <TableRow key={lesson.id} hover>
                        <TableCell>{lesson.sequence_order}</TableCell>
                        <TableCell>
                          <Typography variant="body1" fontWeight={500}>
                            {lesson.title}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {lesson.description.substring(0, 100)}...
                          </Typography>
                        </TableCell>
                        <TableCell>{lesson.duration_minutes} min</TableCell>
                        <TableCell>
                          <StatusChip
                            label={
                              lesson.status === 'published'
                                ? 'Publicado'
                                : lesson.status === 'draft'
                                ? 'Rascunho'
                                : 'Arquivado'
                            }
                            status={lesson.status}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Box display="flex" justifyContent="flex-end" gap={1}>
                            <Tooltip title="Editar">
                              <ActionButton
                                onClick={() => setSelectedLesson(lesson)}
                                color="primary"
                              >
                                <EditIcon />
                              </ActionButton>
                            </Tooltip>
                            <Tooltip title="Excluir">
                              <ActionButton
                                onClick={() => {
                                  setLessonToDelete(lesson);
                                  setDeleteDialogOpen(true);
                                }}
                                color="error"
                              >
                                <DeleteIcon />
                              </ActionButton>
                            </Tooltip>
                            <Tooltip
                              title={
                                lesson.status === 'published'
                                  ? 'Arquivar'
                                  : 'Publicar'
                              }
                            >
                              <ActionButton
                                onClick={() =>
                                  handleUpdateLesson({
                                    ...lesson,
                                    status:
                                      lesson.status === 'published'
                                        ? 'archived'
                                        : 'published',
                                  })
                                }
                                color={
                                  lesson.status === 'published'
                                    ? 'warning'
                                    : 'success'
                                }
                              >
                                {lesson.status === 'published' ? (
                                  <VisibilityOffIcon />
                                ) : (
                                  <VisibilityIcon />
                                )}
                              </ActionButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </StyledTableContainer>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>

      {/* Create/Edit Modal */}
      <CreateLesson
        open={openCreateModal || !!selectedLesson}
        onClose={() => {
          setOpenCreateModal(false);
          setSelectedLesson(null);
        }}
        lesson={selectedLesson}
        onSave={selectedLesson ? handleUpdateLesson : handleCreateLesson}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir a aula "{lessonToDelete?.title}"?
            Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button
            onClick={handleDeleteLesson}
            color="error"
            variant="contained"
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </StyledContainer>
  );
};

export default AdminLessons; 