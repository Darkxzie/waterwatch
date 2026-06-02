import { api } from '../lib/api.js';
import { useAuthStore } from '../store/authStore.js';

export function useAuth() {
  const { user, accessToken, setAuth, logout } = useAuthStore();

  return {
    user,
    accessToken,
    login: async (payload) => {
      const response = await api.post('/auth/login', payload);
      setAuth(response.data.data);
      return response.data.data;
    },
    register: async (payload) => {
      const response = await api.post('/auth/register', payload);
      setAuth(response.data.data);
      return response.data.data;
    },
    logout: async () => {
      await api.post('/auth/logout');
      logout();
    },
  };
}
