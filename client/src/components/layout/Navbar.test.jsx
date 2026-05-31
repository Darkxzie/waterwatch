import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Navbar } from './Navbar.jsx';
import { useAuthStore } from '../../store/authStore.js';

describe('Navbar', () => {
  it('shows login when there is no authenticated user', () => {
    useAuthStore.setState({ user: null, accessToken: null });
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: /login/i })).toBeTruthy();
  });

  it('shows the current user name and logout when authenticated', () => {
    useAuthStore.setState({ user: { name: 'Asha', role: 'CITIZEN' }, accessToken: 'token' });
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText('Asha')).toBeTruthy();
    expect(screen.getByRole('button', { name: /logout/i })).toBeTruthy();
  });
});
