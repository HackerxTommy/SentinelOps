import { create } from 'zustand';
import api from '../lib/api';

export const useAuthStore = create((set) => ({
  user: null,
  org: null,
  token: null,
  isLoading: true,
  error: null,

  // Initialize from localStorage
  init: async () => {
    const token = localStorage.getItem('sentinel_token');
    if (!token) {
      set({ isLoading: false });
      return;
    }

    try {
      set({ token, isLoading: true });
      const { data } = await api.get('/api/auth/me');
      set({
        user: data.user,
        org: data.org,
        token,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      localStorage.removeItem('sentinel_token');
      set({ user: null, org: null, token: null, isLoading: false, error: null });
    }
  },

  // Login
  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await api.post('/api/auth/login', { email, password });
      localStorage.setItem('sentinel_token', data.token);
      set({
        user: data.user,
        org: data.org,
        token: data.token,
        isLoading: false,
        error: null,
      });
      return data;
    } catch (err) {
      const message = err.response?.data?.error || 'Login failed';
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  // Register
  register: async ({ name, email, password, org_name }) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await api.post('/api/auth/register', { name, email, password, org_name });
      localStorage.setItem('sentinel_token', data.token);
      set({
        user: data.user,
        org: data.org,
        token: data.token,
        isLoading: false,
        error: null,
      });
      return data;
    } catch (err) {
      const message = err.response?.data?.error || 'Registration failed';
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('sentinel_token');
    set({ user: null, org: null, token: null, error: null });
    window.location.href = '/';
  },

  // Clear error
  clearError: () => set({ error: null }),
}));
