import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Report from './Report.jsx';
import { useAuthStore } from '../store/authStore.js';
import { api } from '../lib/api.js';

vi.mock('../hooks/useGeolocation.js', () => ({
  useGeolocation: () => ({
    coords: { latitude: 17.385, longitude: 78.4867 },
    error: '',
    setCoords: vi.fn(),
  }),
}));

vi.mock('../components/map/LeafletBaseMap.jsx', () => ({
  LeafletBaseMap: () => <div>Mock map</div>,
}));

describe('Report page', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, accessToken: null });
  });

  it('shows the login requirement message for anonymous users', () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter>
          <Report />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByText(/login is required before complaint submission/i)).toBeTruthy();
  });

  it('renders a success state after a valid complaint submission', async () => {
    useAuthStore.setState({
      user: { id: 'u1', name: 'Asha', role: 'CITIZEN' },
      accessToken: 'token',
    });
    vi.spyOn(api, 'post').mockResolvedValue({
      data: {
        data: {
          id: 'CMP-1',
          aiSeverity: 'HIGH',
          aiPriority: 'URGENT',
          aiSummary: 'Pipe leak confirmed',
        },
      },
    });

    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter>
          <Report />
        </MemoryRouter>
      </QueryClientProvider>
    );

    fireEvent.change(screen.getByPlaceholderText(/describe the issue/i), {
      target: { value: 'Broken pipeline leaking water near the main road for several hours.' },
    });

    fireEvent.click(screen.getByRole('button', { name: /submit complaint/i }));

    await waitFor(() => {
      expect(screen.getByText(/complaint submitted/i)).toBeTruthy();
      expect(screen.getByText(/CMP-1/i)).toBeTruthy();
    });
  });
});
