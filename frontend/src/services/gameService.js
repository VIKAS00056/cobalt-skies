import { apiRequest } from './api';

export const gameService = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.sort) query.append('sort', params.sort);
    if (params.featured) query.append('featured', 'true');

    const qs = query.toString() ? `?${query.toString()}` : '';
    return await apiRequest(`/games${qs}`);
  },

  getById: async (identifier) => {
    return await apiRequest(`/games/${identifier}`);
  },

  create: async (gameData) => {
    return await apiRequest('/games', {
      method: 'POST',
      data: gameData,
    });
  },

  update: async (id, gameData) => {
    return await apiRequest(`/games/${id}`, {
      method: 'PUT',
      data: gameData,
    });
  },

  delete: async (id) => {
    return await apiRequest(`/games/${id}`, {
      method: 'DELETE',
    });
  },
};
