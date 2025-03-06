import api from '../utils/api';

export const login = (credentials) => {
  return api.post('/auth/login', credentials);
};

export const checkAuth = () => {
  return api.get('/auth/verify');
};

export const register = (userData) => {
  return api.post('/auth/register', userData);
};

export const verifyToken = () => {
  return api.get('/auth/verify');
};

export const logout = () => {
  return api.get('/auth/logout');
};