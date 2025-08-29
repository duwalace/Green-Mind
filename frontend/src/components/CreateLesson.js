import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  IconButton,
  Grid,
  FormHelperText,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 16,
    padding: theme.spacing(2),
    minWidth: '600px',
    maxWidth: '800px',
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2),
  '& .MuiTypography-root': {
    fontSize: '1.5rem',
    fontWeight: 600,
    color: theme.palette.primary.main,
  },
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(3),
  '& .MuiTextField-root': {
    marginBottom: theme.spacing(2),
  },
}));

const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(2),
  gap: theme.spacing(2),
}));

const UploadBox = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.primary.main}`,
  borderRadius: 8,
  padding: theme.spacing(3),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.primary.light + '10',
  },
}));

const CreateLesson = ({ open, onClose, courseId, lesson, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    video_url: '',
    duration_minutes: '',
    sequence_order: '',
    status: 'draft',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [videoFile, setVideoFile] = useState(null);

  useEffect(() => {
    if (lesson) {
      setFormData({
        title: lesson.title || '',
        description: lesson.description || '',
        content: lesson.content || '',
        video_url: lesson.video_url || '',
        duration_minutes: lesson.duration_minutes || '',
        sequence_order: lesson.sequence_order || '',
        status: lesson.status || 'draft',
      });
    }
  }, [lesson]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Título é obrigatório';
    if (!formData.description.trim()) newErrors.description = 'Descrição é obrigatória';
    if (!formData.content.trim()) newErrors.content = 'Conteúdo é obrigatório';
    if (!formData.duration_minutes) newErrors.duration_minutes = 'Duração é obrigatória';
    if (formData.duration_minutes && formData.duration_minutes < 1) {
      newErrors.duration_minutes = 'Duração deve ser maior que 0';
    }
    if (!formData.sequence_order) newErrors.sequence_order = 'Ordem é obrigatória';
    if (formData.sequence_order && formData.sequence_order < 1) {
      newErrors.sequence_order = 'Ordem deve ser maior que 0';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Here you would typically handle file upload first if there's a video file
      if (videoFile) {
        // Implement video upload logic here
        // const videoUrl = await uploadVideo(videoFile);
        // formData.video_url = videoUrl;
      }

      await onSave({
        ...formData,
        course_id: courseId,
      });
      onClose();
    } catch (error) {
      console.error('Error saving lesson:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Erro ao salvar aula. Tente novamente.'
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) { // 100MB limit
        setErrors(prev => ({
          ...prev,
          video: 'O arquivo deve ter no máximo 100MB'
        }));
        return;
      }
      setVideoFile(file);
      setErrors(prev => ({
        ...prev,
        video: ''
      }));
    }
  };

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <StyledDialogTitle>
        <Typography variant="h5">
          {lesson ? 'Editar Aula' : 'Criar Nova Aula'}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </StyledDialogTitle>

      <form onSubmit={handleSubmit}>
        <StyledDialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Título da Aula"
                name="title"
                value={formData.title}
                onChange={handleChange}
                error={!!errors.title}
                helperText={errors.title}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descrição"
                name="description"
                value={formData.description}
                onChange={handleChange}
                error={!!errors.description}
                helperText={errors.description}
                multiline
                rows={3}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Conteúdo"
                name="content"
                value={formData.content}
                onChange={handleChange}
                error={!!errors.content}
                helperText={errors.content}
                multiline
                rows={6}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Duração (minutos)"
                name="duration_minutes"
                type="number"
                value={formData.duration_minutes}
                onChange={handleChange}
                error={!!errors.duration_minutes}
                helperText={errors.duration_minutes}
                variant="outlined"
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ordem na Sequência"
                name="sequence_order"
                type="number"
                value={formData.sequence_order}
                onChange={handleChange}
                error={!!errors.sequence_order}
                helperText={errors.sequence_order}
                variant="outlined"
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.status}>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  label="Status"
                >
                  <MenuItem value="draft">Rascunho</MenuItem>
                  <MenuItem value="published">Publicado</MenuItem>
                  <MenuItem value="archived">Arquivado</MenuItem>
                </Select>
                {errors.status && <FormHelperText>{errors.status}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <UploadBox
                component="label"
                onClick={() => document.getElementById('video-upload').click()}
              >
                <input
                  id="video-upload"
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  {videoFile ? videoFile.name : 'Clique para fazer upload do vídeo'}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Arraste e solte um arquivo de vídeo ou clique para selecionar
                </Typography>
                {errors.video && (
                  <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                    {errors.video}
                  </Typography>
                )}
              </UploadBox>
            </Grid>
          </Grid>
        </StyledDialogContent>

        <StyledDialogActions>
          <Button onClick={onClose} color="inherit">
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Salvando...' : 'Salvar Aula'}
          </Button>
        </StyledDialogActions>
      </form>
    </StyledDialog>
  );
};

export default CreateLesson; 