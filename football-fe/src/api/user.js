import api from '../utils/api';

export const getUsers = (params) => {
  return api.get('/users', { params });
};

export const getUserById = (id) => {
  return api.get(`/users/${id}`);
};

export const updateUser = (id, userData) => {
  return api.put(`/users/${id}`, userData);
};