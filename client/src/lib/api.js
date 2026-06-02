import axios from 'axios';
import { useAuthStore } from '../store/authStore.js';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
const isGithubPagesHost =
  typeof window !== 'undefined' && window.location.hostname.endsWith('github.io');

export const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export function getApiErrorMessage(requestError, fallbackMessage) {
  const responseMessage = requestError.response?.data?.error;
  if (responseMessage) {
    return responseMessage;
  }

  const missingHostedApi =
    isGithubPagesHost &&
    apiBaseUrl === '/api' &&
    (requestError.code === 'ERR_NETWORK' || requestError.response?.status === 404);

  if (missingHostedApi) {
    return 'This GitHub Pages deployment has no hosted backend API configured yet. Set VITE_API_BASE_URL to a live server before using login.';
  }

  return fallbackMessage;
}
