import { create } from 'zustand';
import api from '../api/axios';

const useAuthStore = create((set) => ({
  // État initial
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,

  // Connexion
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const { token, user } = response.data;

      localStorage.setItem('token', token);

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });

      return { success: true };
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Erreur de connexion',
        isLoading: false,
      });
      return { success: false };
    }
  },

  // Inscription
  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/api/auth/register', {
        name,
        email,
        password,
      });
      const token = response.data?.token;
      const user = response.data?.user || response.data;

      localStorage.setItem('token', token);

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });

      return { success: true };
    } catch (error) {
      set({
        error: error.response?.data?.message || "Erreur d'inscription",
        isLoading: false,
      });
      return { success: false };
    }
  },

  // Déconnexion
  logout: () => {
    localStorage.removeItem('token');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

  // Réinitialiser les erreurs
  clearError: () => set({ error: null }),
}));

export default useAuthStore;