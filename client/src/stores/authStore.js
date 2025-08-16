import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import authAPI from '../services/authAPI';
import { toast } from 'react-toastify';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      isInitialized: false,

      // Initialize auth state
      initialize: async () => {
        set({ isLoading: true });
        
        try {
          const { refreshToken } = get();
          
          if (refreshToken) {
            const response = await authAPI.refresh();
            set({
              user: response.user,
              accessToken: response.accessToken,
              refreshToken: response.refreshToken,
              isLoading: false,
              isInitialized: true,
            });
          } else {
            set({ 
              isLoading: false, 
              isInitialized: true 
            });
          }
        } catch (error) {
          console.error('Auth initialization failed:', error);
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isLoading: false,
            isInitialized: true,
          });
        }
      },

      // Login
      login: async (credentials) => {
        set({ isLoading: true });
        
        try {
          const response = await authAPI.login(credentials);
          
          set({
            user: response.user,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            isLoading: false,
          });
          
          toast.success('Welcome back!');
          return response;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      // Register
      register: async (userData) => {
        set({ isLoading: true });
        
        try {
          const response = await authAPI.register(userData);
          set({ isLoading: false });
          
          toast.success('Registration successful! Please check your email to verify your account.');
          return response;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      // Logout
      logout: async () => {
        try {
          await authAPI.logout();
        } catch (error) {
          console.error('Logout API call failed:', error);
        } finally {
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
          });
          toast.success('Logged out successfully');
        }
      },

      // Update user profile
      updateProfile: async (profileData) => {
        const { user } = get();
        
        try {
          const updatedUser = await authAPI.updateProfile(profileData);
          
          set({
            user: { ...user, ...updatedUser },
          });
          
          toast.success('Profile updated successfully');
          return updatedUser;
        } catch (error) {
          throw error;
        }
      },

      // Set auth tokens (used by API interceptors)
      setTokens: (accessToken, refreshToken) => {
        set({ accessToken, refreshToken });
      },

      // Clear auth state
      clearAuth: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);

export { useAuthStore };