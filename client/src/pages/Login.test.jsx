import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login.jsx';

const loginMock = vi.fn();
const registerMock = vi.fn();

vi.mock('../hooks/useAuth.js', () => ({
  useAuth: () => ({
    login: loginMock,
    register: registerMock,
  }),
}));

describe('Login page', () => {
  beforeEach(() => {
    loginMock.mockReset();
    registerMock.mockReset();
  });

  it('shows demo admin credentials and login form by default', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByText(/admin@waterwatch\.local/i)).toBeTruthy();
    expect(screen.getAllByRole('button', { name: /^login$/i }).length).toBeGreaterThan(0);
  });

  it('surfaces authentication failures', async () => {
    loginMock.mockRejectedValue({
      response: { data: { error: 'Invalid email or password' } },
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'bad-password' },
    });
    fireEvent.click(screen.getAllByRole('button', { name: /^login$/i })[1]);

    await waitFor(() => {
      expect(screen.getByText(/invalid email or password/i)).toBeTruthy();
    });
  });
});
