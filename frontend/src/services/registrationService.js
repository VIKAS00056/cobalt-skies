import { apiRequest } from './api';

export const registrationService = {
  getMyRegistrations: async (type) => {
    const qs = type ? `?type=${type}` : '';
    return await apiRequest(`/registrations/my-registrations${qs}`);
  },

  getById: async (identifier) => {
    return await apiRequest(`/registrations/${identifier}`);
  },

  getAll: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.itemType) query.append('itemType', params.itemType);
    if (params.paymentStatus) query.append('paymentStatus', params.paymentStatus);
    if (params.registrationStatus) query.append('registrationStatus', params.registrationStatus);

    const qs = query.toString() ? `?${query.toString()}` : '';
    return await apiRequest(`/registrations${qs}`);
  },

  cancel: async (id) => {
    return await apiRequest(`/registrations/${id}/cancel`, {
      method: 'PATCH',
    });
  },
};
