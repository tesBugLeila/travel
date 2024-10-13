
import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  useEffect(() => {
    if (token) {
     
      api.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(response => {
          setUser(response.data.user);
        })
        .catch(() => {
          setUser(null);
          setToken('');
          localStorage.removeItem('token');
        });
    }
  }, [token]);

  const login = (token, user) => {
    setToken(token);
    setUser(user);
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
