import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Dashboard from './Dashboard.jsx';

vi.mock('../hooks/useComplaints.js', () => ({
  useAdminComplaints: vi.fn(),
  useAdminResolutionTime: vi.fn(),
}));

import { useAdminComplaints, useAdminResolutionTime } from '../hooks/useComplaints.js';

describe('Dashboard page', () => {
  it('shows admin login guidance when the dashboard query errors', () => {
    useAdminComplaints.mockReturnValue({
      data: [],
      error: new Error('Forbidden'),
      refetch: vi.fn(),
      isFetching: false,
    });
    useAdminResolutionTime.mockReturnValue({ data: [] });

    render(<Dashboard />);

    expect(screen.getByText(/login as the seeded admin/i)).toBeTruthy();
  });

  it('renders authority queue metrics from complaint data', () => {
    useAdminComplaints.mockReturnValue({
      data: [
        {
          id: 'abc12345',
          issueType: 'LEAKAGE',
          address: 'Ameerpet',
          aiSeverity: 'CRITICAL',
          aiPriority: 'URGENT',
          status: 'OPEN',
        },
        {
          id: 'def67890',
          issueType: 'NO_WATER',
          address: 'Kukatpally',
          aiSeverity: 'HIGH',
          aiPriority: 'ROUTINE',
          status: 'RESOLVED',
        },
      ],
      error: null,
      refetch: vi.fn(),
      isFetching: false,
    });
    useAdminResolutionTime.mockReturnValue({
      data: [{ createdAt: '2026-05-30T00:00:00.000Z', resolvedAt: '2026-05-30T02:00:00.000Z' }],
    });

    render(<Dashboard />);

    expect(screen.getByText(/authority queue/i)).toBeTruthy();
    expect(screen.getByText(/2 rows/i)).toBeTruthy();
  });
});
