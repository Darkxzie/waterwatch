import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App.jsx';

describe('App shell', () => {
  it('renders the landing page tagline', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('See it. Report it. Fix it.')).toBeTruthy();
  });
});
