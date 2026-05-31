import { afterEach, beforeEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import { useAuthStore } from '../store/authStore.js';
import { useUiStore } from '../store/uiStore.js';

beforeEach(() => {
  useAuthStore.setState({ user: null, accessToken: null });
  useUiStore.setState({ isOffline: false });
  window.localStorage.clear();
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
