import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { renderApp } from '../test/renderApp.jsx';

describe('Home page', () => {
  it('shows the hero headline and core CTAs', () => {
    renderApp('/');

    expect(screen.getByText('Fix it faster.', { exact: false })).toBeTruthy();
    expect(screen.getByRole('button', { name: /report an issue/i })).toBeTruthy();
    expect(screen.getByRole('link', { name: /view live map/i })).toBeTruthy();
  });
});
