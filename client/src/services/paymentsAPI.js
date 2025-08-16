import api from './api';

const paymentsAPI = {
  // Initiate M-Pesa payment
  initiateMpesaPayment: async (orderId, phoneNumber) => {
    const response = await api.post('/api/payments/mpesa/initiate', {
      orderId,
      phoneNumber
    });
    return response.data;
  },

  // Create Stripe payment intent
  createStripePaymentIntent: async (orderId) => {
    const response = await api.post('/api/payments/stripe/intent', {
      orderId
    });
    return response.data;
  },

  // Confirm Stripe payment
  confirmStripePayment: async (paymentIntentId, paymentMethodId) => {
    const response = await api.post('/api/payments/stripe/confirm', {
      paymentIntentId,
      paymentMethodId
    });
    return response.data;
  },

  // Get payment status
  getPaymentStatus: async (orderId) => {
    const response = await api.get(`/api/payments/status/${orderId}`);
    return response.data;
  },
};

export default paymentsAPI;