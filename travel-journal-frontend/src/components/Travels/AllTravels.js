
import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import TravelList from './TravelList';
import { Typography, Box, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';

const AllTravels = () => {
  const [travels, setTravels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAllTravels = async () => {
      try {
        const res = await api.get('/travel');
        setTravels(res.data);
      } catch (err) {
        console.error('Ошибка при получении всех путешествий:', err);
        const errorMessage = err.response?.data?.message || 'Не удалось загрузить все путешествия.';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchAllTravels();
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

  return <TravelList travels={travels} />;
};

export default AllTravels;
