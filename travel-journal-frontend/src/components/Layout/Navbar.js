
import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" style={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
          Дневник Путешествий
        </Typography>
        {user ? (
          <>
            <Box mr={2}>
              <Button
                color="inherit"
                component={Link}
                to="/travels/mine"
                variant={isActive('/travels/mine') ? 'outlined' : 'text'}
              >
                Мои Путешествия
              </Button>
            </Box>
            <Box mr={2}>
              <Button
                color="inherit"
                component={Link}
                to="/travels"
                variant={isActive('/travels') ? 'outlined' : 'text'}
              >
                Все Путешествия
              </Button>
            </Box>
            <Box mr={2}>
              <Button
                color="inherit"
                component={Link}
                to="/travels/new"
                variant={isActive('/travels/new') ? 'outlined' : 'text'}
              >
                Создать
              </Button>
            </Box>
            <Button color="inherit" onClick={handleLogout}>
              Выйти
            </Button>
          </>
        ) : (
          <>
            <Box mr={2}>
              <Button
                color="inherit"
                component={Link}
                to="/login"
                variant={isActive('/login') ? 'outlined' : 'text'}
              >
                Войти
              </Button>
            </Box>
            <Button
              color="inherit"
              component={Link}
              to="/register"
              variant={isActive('/register') ? 'outlined' : 'text'}
            >
              Регистрация
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
