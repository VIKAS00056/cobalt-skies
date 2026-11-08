import { apiRequest } from './api';

export const eventService = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.type && params.type !== 'all') query.append('type', params.type);
    if (params.sort) query.append('sort', params.sort);
    if (params.featured) query.append('featured', 'true');

    const qs = query.toString() ? `?${query.toString()}` : '';
    return await apiRequest(`/events${qs}`);
  },

  getById: async (identifier) => {
    return await apiRequest(`/events/${identifier}`);
  },

  create: async (eventData) => {
    return await apiRequest('/events', {
      method: 'POST',
      data: eventData,
    });
  },

  update: async (id, eventData) => {
    return await apiRequest(`/events/${id}`, {
      method: 'PUT',
      data: eventData,
    });
  },

  delete: async (id) => {
    return await apiRequest(`/events/${id}`, {
      method: 'DELETE',
    });
  },
};
