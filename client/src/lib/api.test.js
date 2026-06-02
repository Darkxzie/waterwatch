import { beforeEach, describe, expect, it } from 'vitest';
import { api } from './api.js';
import { useAuthStore } from '../store/authStore.js';

describe('api client', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, accessToken: null });
  });

  it('uses the default API base URL and credentials', () => {
    expect(api.defaults.baseURL).toBe('/api');
    expect(api.defaults.withCredentials).toBe(true);
  });

  it('attaches the bearer token when one is stored', async () => {
    useAuthStore.setState({ user: { id: 'user-1' }, accessToken: 'token-1' });

    const handler = api.interceptors.request.handlers[0].fulfilled;
    const config = await handler({ headers: {} });

    expect(config.headers.Authorization).toBe('Bearer token-1');
  });
});
