import axios from 'axios';
import { useAuthStore } from '../store/authStore.js';

export const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
