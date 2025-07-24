import { defineStore } from 'pinia';
import api from '../services/api';

export const useAuthStore = defineStore('auth', {
  persist: true,
  state: () => ({
    user: null as null | Record<string, any>,
  }),
  actions: {
    async login(credentials: { email: string; password: string }) {
      await api.get('/sanctum/csrf-cookie'); 
      await api.post('/login', credentials);
      const { data } = await api.get('/api/user');
      this.user = data;
    },
    async register(payload: { name: string; email: string; password: string; password_confirmation: string }) {
      await api.get('/sanctum/csrf-cookie');
      await api.post('/register', payload);
      const { data } = await api.get('/api/user');
      this.user = data;
    },
    async logout() {
      await api.post('/logout');
      this.user = null;
    },
    async fetchUser() {
      const { data } = await api.get('/api/user');
      this.user = data;
    },
  },
});
