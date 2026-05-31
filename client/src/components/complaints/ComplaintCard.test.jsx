import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ComplaintCard } from './ComplaintCard.jsx';

describe('ComplaintCard', () => {
  it('renders complaint summary, status, and identifier details', () => {
    render(
      <ComplaintCard
        complaint={{
          id: 'abcdef123456',
          issueType: 'LEAKAGE',
          createdAt: '2026-05-30T00:00:00.000Z',
          aiSeverity: 'HIGH',
          aiSummary: 'Pipe burst near the metro station',
          description: 'Fallback description',
          status: 'IN_PROGRESS'
        }}
      />
    );

    expect(screen.getByText(/pipe burst near the metro station/i)).toBeTruthy();
    expect(screen.getByText(/status: in progress/i)).toBeTruthy();
    expect(screen.getByText(/id: abcdef12/i)).toBeTruthy();
  });
});
