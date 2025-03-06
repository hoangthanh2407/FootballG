import api from '../utils/api';

export const getTeams = (params) => {
  return api.get('/teams', { params });
};

export const getTeam = (id) => {
  return api.get(`/teams/${id}`);
};

export const createTeam = (teamData) => {
  return api.post('/teams', teamData);
};

export const updateTeam = (id, teamData) => {
  return api.put(`/teams/${id}`, teamData);
};

export const deleteTeam = (id) => {
  return api.delete(`/teams/${id}`);
};

export const toggleTeamStatus = (id) => {
  return api.put(`/teams/${id}/toggleTeamStatus`);
};
