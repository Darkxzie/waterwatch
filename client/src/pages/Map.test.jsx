import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import MapPage from './Map.jsx';

vi.mock('../components/map/LeafletBaseMap.jsx', () => ({
  markerIcon: {},
  LeafletBaseMap: ({ children }) => <div>{children}</div>,
}));

vi.mock('react-leaflet', () => ({
  Marker: ({ children }) => <div>{children}</div>,
  Popup: ({ children }) => <div>{children}</div>,
}));

vi.mock('../hooks/useComplaints.js', () => ({
  useMapComplaints: vi.fn(),
}));

import { useMapComplaints } from '../hooks/useComplaints.js';

describe('Map page', () => {
  it('shows a loading message while complaints are loading', () => {
    useMapComplaints.mockReturnValue({ data: [], isLoading: true });

    render(<MapPage />);

    expect(screen.getByText(/loading public complaints/i)).toBeTruthy();
  });

  it('filters visible complaints by severity', () => {
    useMapComplaints.mockReturnValue({
      data: [
        {
          id: '1',
          issueType: 'LEAKAGE',
          latitude: 17.1,
          longitude: 78.1,
          address: 'A',
          aiSeverity: 'HIGH',
          status: 'OPEN',
        },
        {
          id: '2',
          issueType: 'NO_WATER',
          latitude: 17.2,
          longitude: 78.2,
          address: 'B',
          aiSeverity: 'LOW',
          status: 'OPEN',
        },
      ],
      isLoading: false,
    });

    render(<MapPage />);

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'HIGH' } });

    expect(screen.getByText('1')).toBeTruthy();
  });
});
