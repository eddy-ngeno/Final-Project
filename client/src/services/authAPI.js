import api from './api';

const authAPI = {
  // Register
  register: async (userData) => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },

  // Login
  login: async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await api.post('/api/auth/logout');
    return response.data;
  },

  // Refresh token
  refresh: async () => {
    const response = await api.post('/api/auth/refresh');
    return response.data;
  },

  // Verify email
  verifyEmail: async (token) => {
    const response = await api.post('/api/auth/verify-email', { token });
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await api.post('/api/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (token, password) => {
    const response = await api.post('/api/auth/reset-password', { 
      token, 
      password 
    });
    return response.data;
  },

  // Update profile
  updateProfile: async (profileData) => {
    const response = await api.patch('/api/users/me', profileData);
    return response.data;
  },

  // Get current user
  getMe: async () => {
    const response = await api.get('/api/users/me');
    return response.data;
  },
};

export default authAPI;