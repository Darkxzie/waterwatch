import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Analytics from './Analytics.jsx';

vi.mock('recharts', () => {
  const Simple = ({ children }) => <div>{children}</div>;
  return {
    ResponsiveContainer: Simple,
    BarChart: Simple,
    Bar: Simple,
    CartesianGrid: Simple,
    LineChart: Simple,
    Line: Simple,
    PieChart: Simple,
    Pie: Simple,
    Tooltip: () => <div>Tooltip</div>,
    XAxis: () => <div />,
    YAxis: () => <div />,
    Cell: () => <div />
  };
});

vi.mock('../hooks/useComplaints.js', () => ({
  useAdminSummary: vi.fn(),
  useAdminTrends: vi.fn(),
  useAdminResolutionTime: vi.fn()
}));

import { useAdminResolutionTime, useAdminSummary, useAdminTrends } from '../hooks/useComplaints.js';

describe('Analytics page', () => {
  it('shows admin login guidance when summary loading fails', () => {
    useAdminSummary.mockReturnValue({ data: null, error: new Error('Forbidden') });
    useAdminTrends.mockReturnValue({ data: [] });
    useAdminResolutionTime.mockReturnValue({ data: [] });

    render(<Analytics />);

    expect(screen.getByText(/login as the seeded admin/i)).toBeTruthy();
  });

  it('renders analytics sections when summary data exists', () => {
    useAdminSummary.mockReturnValue({
      data: {
        byType: [{ issueType: 'LEAKAGE', _count: { _all: 2 } }],
        bySeverity: [{ aiSeverity: 'HIGH', _count: { _all: 2 } }]
      },
      error: null
    });
    useAdminTrends.mockReturnValue({ data: [{ createdAt: '2026-05-30T00:00:00.000Z' }] });
    useAdminResolutionTime.mockReturnValue({
      data: [{ issueType: 'LEAKAGE', createdAt: '2026-05-30T00:00:00.000Z', resolvedAt: '2026-05-30T04:00:00.000Z' }]
    });

    render(<Analytics />);

    expect(screen.getByText(/complaints by type/i)).toBeTruthy();
    expect(screen.getByText(/severity distribution/i)).toBeTruthy();
  });
});
