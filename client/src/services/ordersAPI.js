import api from './api';

const ordersAPI = {
  // Create order
  createOrder: async (orderData) => {
    const response = await api.post('/api/orders', orderData);
    return response.data;
  },

  // Get user orders
  getOrders: async (params = {}) => {
    const response = await api.get('/api/orders', { params });
    return response.data;
  },

  // Get single order
  getOrder: async (id) => {
    const response = await api.get(`/api/orders/${id}`);
    return response.data;
  },

  // Update order status
  updateOrderStatus: async (id, status, notes = '') => {
    const response = await api.patch(`/api/orders/${id}/status`, { 
      status, 
      notes 
    });
    return response.data;
  },

  // Cancel order
  cancelOrder: async (id, reason = '') => {
    const response = await api.patch(`/api/orders/${id}/cancel`, { reason });
    return response.data;
  },

  // Get order analytics (farmer)
  getOrderAnalytics: async (params = {}) => {
    const response = await api.get('/api/orders/analytics', { params });
    return response.data;
  },
};

export default ordersAPI;