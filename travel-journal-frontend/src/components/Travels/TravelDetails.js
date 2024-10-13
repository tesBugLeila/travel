
import React, { useEffect, useState, Suspense, lazy, useContext } from 'react';
import { Container, Typography, Box, Grid, Paper, CircularProgress, Button, Dialog, DialogContent, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const TravelMap = lazy(() => import('./TravelMap'));

const TravelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [travel, setTravel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  const [open, setOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchTravel = async () => {
      try {
        const res = await api.get(`/travel/${id}`);
        setTravel(res.data);
      } catch (err) {
        console.error('Ошибка при получении деталей путешествия:', err);
        const errorMessage = err.response?.data?.message || 'Не удалось загрузить данные о путешествии.';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchTravel();
  }, [id]);


  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box mt={5} textAlign="center">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Box mt={5} textAlign="center">
          <Typography color="error">{error}</Typography>
        </Box>
      </Container>
    );
  }

  if (!travel) {
    return (
      <Container maxWidth="md">
        <Box mt={5} textAlign="center">
          <Typography>Путешествие не найдено.</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box mt={5}>
        <Grid container spacing={4}>
       
          <Grid item xs={12} md={6}>
            <Paper elevation={3} style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: 'none', border: 'none' }}>
              <Typography variant="h4" gutterBottom>
                {travel.location}
              </Typography>
              {travel.images && travel.images.length > 0 && (
                <Box mb={3}>
                 
                  <img
                    src={`http://localhost:5000${travel.images[0]}`}
                    alt={travel.location}
                    style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', cursor: 'pointer' }}
                    onClick={() => handleImageClick(0)}
                  />
                </Box>
              )}
              <Typography variant="body1" gutterBottom>
                {travel.description}
              </Typography>
              <Typography variant="body1">
                <strong>Стоимость:</strong> {travel.cost ? `${travel.cost} ₽` : 'Не указано'}
              </Typography>
              <Typography variant="body1">
                <strong>Оценка:</strong> {travel.rating ? travel.rating : 'Не указано'}
              </Typography>
              <Typography variant="body1">
                <strong>Места культурного наследия:</strong> {travel.heritageSites.length > 0 ? travel.heritageSites.join(', ') : 'Не указано'}
              </Typography>
              <Typography variant="body1">
                <strong>Места для посещения:</strong> {travel.placesToVisit.length > 0 ? travel.placesToVisit.join(', ') : 'Не указано'}
              </Typography>
           
          
            </Paper>

          
            {travel.images && travel.images.length > 1 && (
              <Box mt={4}>
                <Typography variant="h6" gutterBottom>
                  Изображения:
                </Typography>
                <Grid container spacing={2}>
                  {travel.images.map((image, index) => (
                    <Grid item xs={6} sm={4} md={3} key={index}>
                      <img
                        src={`http://localhost:5000${image}`}
                        alt={`Image ${index + 1}`}
                        style={{ width: '100%', height: 'auto', cursor: 'pointer' }}
                        onClick={() => handleImageClick(index)}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Grid>

       
          <Grid item xs={12} md={6}>
            <Paper elevation={3} style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: 'none', border: 'none' }}>
              <Typography variant="h6" gutterBottom>
                Местоположение:
              </Typography>
              <Box style={{ height: '500px', width: '100%' }}>
                <Suspense fallback={<CircularProgress />}>
                  <TravelMap coordinates={travel.coordinates.coordinates} location={travel.location} />
                </Suspense>
              </Box>
            </Paper>
          </Grid>
        </Grid>

      
        <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
          <DialogContent>
            <Box position="relative">
              <IconButton
                onClick={handleClose}
                style={{ position: 'absolute', right: 8, top: 8, color: '#fff', zIndex: 1 }}
              >
                <CloseIcon />
              </IconButton>
              <Grid container spacing={2}>
                {travel.images.map((image, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <img
                      src={`http://localhost:5000${image}`}
                      alt={`Image ${index + 1}`}
                      style={{ width: '100%', height: 'auto' }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </DialogContent>
        </Dialog>
      </Box>
    </Container>
  );
};

export default TravelDetails;


