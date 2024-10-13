
import React, { useState, useContext } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

const Register = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', form);
      
      login(res.data.token, res.data.user);
      navigate('/travels'); 
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка регистрации');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5}>
        <Typography variant="h4" gutterBottom>Регистрация</Typography>
        {error && <Typography color="error">{error}</Typography>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Имя пользователя"
            name="username"
            value={form.username}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Пароль"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <Box mt={2}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Зарегистрироваться
            </Button>
          </Box>
          <Box mt={2}>
            <Typography>
              Уже есть аккаунт? <Link to="/login">Войти</Link>
            </Typography>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default Register;
