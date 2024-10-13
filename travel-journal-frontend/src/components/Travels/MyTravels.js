
import React, { useEffect, useState, useContext } from 'react';
import api from '../../services/api';
import TravelList from './TravelList';
import { Typography, Box, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';

const MyTravels = () => {
  const [travels, setTravels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyTravels = async () => {
      try {
        const res = await api.get('/travel/mine');
        setTravels(res.data);
      } catch (err) {
        console.error('Ошибка при получении моих путешествий:', err);
        const errorMessage = err.response?.data?.message || 'Не удалось загрузить ваши путешествия.';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchMyTravels();
  }, []);

  if (loading) {
    return (
      <Box mt={5} textAlign="center">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box mt={5} textAlign="center">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (travels.length === 0) {
    return (
      <Box mt={5} textAlign="center">
        <Typography variant="h6">У вас еще нет путешествий. Создайте первое!</Typography>
      </Box>
    );
  }

  return <TravelList travels={travels} />;
};

export default MyTravels;
