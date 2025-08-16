import api from './api';

const listingsAPI = {
  // Get all listings with filters
  getListings: async (params = {}) => {
    const response = await api.get('/api/listings', { params });
    return response.data;
  },

  // Get single listing
  getListing: async (id) => {
    const response = await api.get(`/api/listings/${id}`);
    return response.data;
  },

  // Create listing (farmer only)
  createListing: async (listingData) => {
    const response = await api.post('/api/listings', listingData);
    return response.data;
  },

  // Update listing (farmer only)
  updateListing: async (id, listingData) => {
    const response = await api.patch(`/api/listings/${id}`, listingData);
    return response.data;
  },

  // Delete listing
  deleteListing: async (id) => {
    const response = await api.delete(`/api/listings/${id}`);
    return response.data;
  },

  // Get farmer's listings
  getFarmerListings: async (params = {}) => {
    const response = await api.get('/api/farmers/me/listings', { params });
    return response.data;
  },

  // Get categories
  getCategories: async () => {
    const response = await api.get('/api/listings/categories');
    return response.data;
  },

  // Search suggestions
  getSearchSuggestions: async (query) => {
    const response = await api.get('/api/listings/suggestions', {
      params: { q: query }
    });
    return response.data;
  },
};

export default listingsAPI;