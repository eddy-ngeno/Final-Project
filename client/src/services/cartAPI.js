import api from './api';

const cartAPI = {
  // Get cart
  getCart: async () => {
    const response = await api.get('/api/cart');
    return response.data;
  },

  // Sync cart with server
  syncCart: async (items) => {
    const response = await api.post('/api/cart/sync', { items });
    return response.data;
  },

  // Add to cart
  addToCart: async (listingId, quantity) => {
    const response = await api.post('/api/cart/add', { 
      listingId, 
      quantity 
    });
    return response.data;
  },

  // Update cart item
  updateCartItem: async (listingId, quantity) => {
    const response = await api.patch('/api/cart/update', { 
      listingId, 
      quantity 
    });
    return response.data;
  },

  // Remove from cart
  removeFromCart: async (listingId) => {
    const response = await api.delete('/api/cart/remove', { 
      data: { listingId }
    });
    return response.data;
  },

  // Clear cart
  clearCart: async () => {
    const response = await api.delete('/api/cart');
    return response.data;
  },
};

export default cartAPI;