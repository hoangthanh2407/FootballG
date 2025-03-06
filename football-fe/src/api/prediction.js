import api from '../utils/api';

export const getPredictions = (params) => {
  return api.get('/predictions', { params });
};

export const getPredictionsByUser = (userId) => {
  return api.get(`/predictions/user/${userId}`);
};

export const getUserRankings = () => {
  return api.get('/predictions');
};

export const predictMatch = (matchId, predictionData) => {
  return api.post(`/matches/${matchId}/predict`, predictionData);
};