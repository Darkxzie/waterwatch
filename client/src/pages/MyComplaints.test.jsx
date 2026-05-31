import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import MyComplaints from './MyComplaints.jsx';

vi.mock('../hooks/useComplaints.js', () => ({
  useMyComplaints: vi.fn()
}));

import { useMyComplaints } from '../hooks/useComplaints.js';

describe('MyComplaints page', () => {
  it('shows an empty state when the user has no complaints', () => {
    useMyComplaints.mockReturnValue({ data: [], isLoading: false, error: null });

    render(<MyComplaints />);

    expect(screen.getByText(/no complaints yet/i)).toBeTruthy();
  });

  it('shows a login-related error message when the query errors', () => {
    useMyComplaints.mockReturnValue({ data: [], isLoading: false, error: new Error('Unauthorized') });

    render(<MyComplaints />);

    expect(screen.getByText(/please login to view your complaints/i)).toBeTruthy();
  });
});
