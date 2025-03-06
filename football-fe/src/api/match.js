import api from '../utils/api';

export const getMatches = (params) => {
  return api.get('/matches', { params });
};

export const getMatchById = (id) => {
  return api.get(`/matches/${id}`);
};

export const createMatch = (matchData) => {
  return api.post('/matches', matchData);
};

export const updateMatchResult = (id, resultData) => {
  return api.put(`/matches/${id}/result`, resultData);
};