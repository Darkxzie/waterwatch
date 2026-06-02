import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useGeolocation } from './useGeolocation.js';

const originalGeolocation = navigator.geolocation;

afterEach(() => {
  vi.unstubAllGlobals();
  if (originalGeolocation) {
    navigator.geolocation = originalGeolocation;
  } else {
    delete navigator.geolocation;
  }
});

describe('useGeolocation', () => {
  it('uses live browser coordinates when available', async () => {
    navigator.geolocation = {
      getCurrentPosition(success) {
        success({
          coords: {
            latitude: 17.41,
            longitude: 78.49,
          },
        });
      },
    };

    const { result } = renderHook(() => useGeolocation());

    await waitFor(() => {
      expect(result.current.coords).toEqual({ latitude: 17.41, longitude: 78.49 });
    });
    expect(result.current.error).toBeNull();
  });

  it('returns a fallback error when access is denied', async () => {
    navigator.geolocation = {
      getCurrentPosition(_success, error) {
        error(new Error('blocked'));
      },
    };

    const { result } = renderHook(() => useGeolocation());

    await waitFor(() => {
      expect(result.current.error).toBe('Location access denied. Using Hyderabad as default.');
    });
    expect(result.current.coords).toEqual({ latitude: 17.385, longitude: 78.4867 });
  });

  it('reports unsupported browsers', async () => {
    vi.stubGlobal('navigator', {});

    const { result } = renderHook(() => useGeolocation());

    await waitFor(() => {
      expect(result.current.error).toBe('Geolocation is not supported by this browser.');
    });
  });
});
