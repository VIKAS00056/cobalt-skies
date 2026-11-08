import { apiRequest } from './api';

export const paymentService = {
  createOrder: async (orderPayload) => {
    return await apiRequest('/payments/create-order', {
      method: 'POST',
      data: orderPayload,
    });
  },

  verifyPayment: async (verificationPayload) => {
    return await apiRequest('/payments/verify', {
      method: 'POST',
      data: verificationPayload,
    });
  },

  getMyPayments: async () => {
    return await apiRequest('/payments/my-payments');
  },
};
