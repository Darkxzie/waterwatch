import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OfflineBanner } from './OfflineBanner.jsx';
import { useUiStore } from '../../store/uiStore.js';

describe('OfflineBanner', () => {
  beforeEach(() => {
    Object.defineProperty(window.navigator, 'onLine', {
      configurable: true,
      value: true
    });
  });

  it('renders nothing while online', () => {
    useUiStore.setState({ isOffline: false });
    render(<OfflineBanner />);
    expect(screen.queryByText(/you appear to be offline/i)).toBeNull();
  });

  it('renders an offline warning when the ui store is offline', () => {
    Object.defineProperty(window.navigator, 'onLine', {
      configurable: true,
      value: false
    });
    useUiStore.setState({ isOffline: true });
    render(<OfflineBanner />);
    expect(screen.getByText(/you appear to be offline/i)).toBeTruthy();
  });
});
