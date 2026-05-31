import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { renderApp } from './test/renderApp.jsx';

describe('App shell', () => {
  it('renders the landing page tagline', () => {
    renderApp('/');
    expect(screen.getByText('Fix it faster.', { exact: false })).toBeTruthy();
  });
});
