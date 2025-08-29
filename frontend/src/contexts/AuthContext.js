import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      checkAuth(token);
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuth = async (token) => {
    try {
      setError(null);
      const response = await api.get('/auth/verify');
      const user = {
        ...response.data.user,
        avatar: response.data.user.avatar ? (response.data.user.avatar.startsWith('http') ? response.data.user.avatar : `${process.env.REACT_APP_API_URL || 'http://localhost:3001'}${response.data.user.avatar}`) : null
      };
      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Erro na verificação de autenticação:', error);
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
      setError(error.response?.data?.message || 'Erro na verificação de autenticação');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await api.post('/auth/login', { email, password });
      const { token, user: userData } = response.data;
      const user = {
        ...userData,
        avatar: userData.avatar ? (userData.avatar.startsWith('http') ? userData.avatar : `${process.env.REACT_APP_API_URL || 'http://localhost:3001'}${userData.avatar}`) : null
      };
      localStorage.setItem('token', token);
      setUser(user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error('Erro no login:', error);
      const errorMessage = error.response?.data?.message || 'Erro ao fazer login';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    }
  };

  const register = async (formData) => {
    try {
      setError(null);
      const response = await api.post('/auth/register', formData);
      const { token, user: responseUser } = response.data;
      
      const user = {
        ...responseUser,
        avatar: responseUser.avatar 
          ? (responseUser.avatar.startsWith('http') 
              ? responseUser.avatar 
              : `${process.env.REACT_APP_API_URL || 'http://localhost:3001'}${responseUser.avatar}`)
          : null
      };

      localStorage.setItem('token', token);
      setUser(user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error('Erro no registro:', error);
      const errorMessage = error.response?.data?.message || 'Erro ao registrar';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

  const value = {
    user,
    setUser: updateUser,
    loading,
    isAuthenticated,
    error,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext; 