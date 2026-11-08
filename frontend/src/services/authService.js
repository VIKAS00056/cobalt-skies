import { apiRequest } from './api';

export const authService = {
  login: async (credentials) => {
    return await apiRequest('/auth/login', {
      method: 'POST',
      data: credentials,
    });
  },

  register: async (userData) => {
    return await apiRequest('/auth/register', {
      method: 'POST',
      data: userData,
    });
  },

  getProfile: async () => {
    return await apiRequest('/auth/profile');
  },

  updateProfile: async (userData) => {
    return await apiRequest('/auth/profile', {
      method: 'PUT',
      data: userData,
    });
  },

  forgotPassword: async (email) => {
    return await apiRequest('/auth/forgot-password', {
      method: 'POST',
      data: { email },
    });
  },
};
