import { renderHook, act } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useAuth } from './useAuth.js';
import { useAuthStore } from '../store/authStore.js';

vi.mock('../lib/api.js', () => ({
  api: {
    post: vi.fn(),
  },
}));

const { api } = await import('../lib/api.js');

afterEach(() => {
  vi.clearAllMocks();
  useAuthStore.setState({ user: null, accessToken: null });
});

describe('useAuth', () => {
  it('stores login data from the API response', async () => {
    api.post.mockResolvedValueOnce({
      data: {
        data: {
          user: { id: 'user-1', name: 'Asha' },
          accessToken: 'token-1',
        },
      },
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login({ email: 'asha@example.com', password: 'SecurePass1' });
    });

    expect(useAuthStore.getState().user).toEqual({ id: 'user-1', name: 'Asha' });
    expect(useAuthStore.getState().accessToken).toBe('token-1');
  });

  it('clears auth state after logout', async () => {
    useAuthStore.setState({
      user: { id: 'user-1', name: 'Asha' },
      accessToken: 'token-1',
    });
    api.post.mockResolvedValueOnce({ data: { data: {} } });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.logout();
    });

    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().accessToken).toBeNull();
  });
});
