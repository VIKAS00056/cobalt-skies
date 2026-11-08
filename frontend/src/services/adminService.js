import { apiRequest } from './api';

export const adminService = {
  getStats: async () => {
    return await apiRequest('/admin/stats');
  },

  getUsers: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.role) query.append('role', params.role);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return await apiRequest(`/admin/users${qs}`);
  },

  toggleBlockUser: async (id) => {
    return await apiRequest(`/admin/users/${id}/toggle-block`, {
      method: 'PATCH',
    });
  },

  getPayments: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.status) query.append('status', params.status);
    if (params.itemType) query.append('itemType', params.itemType);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return await apiRequest(`/admin/payments${qs}`);
  },

  exportRegistrationsCSV: async () => {
    const blob = await apiRequest('/admin/export/registrations');
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Cobalt_Skies_Registrations_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },

  exportPaymentsCSV: async () => {
    const blob = await apiRequest('/admin/export/payments');
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Cobalt_Skies_Payments_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },
};
