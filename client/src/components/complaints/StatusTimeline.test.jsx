import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusTimeline } from './StatusTimeline.jsx';

describe('StatusTimeline', () => {
  it('renders the current status and prior stages', () => {
    render(<StatusTimeline currentStatus="IN_PROGRESS" />);

    expect(screen.getByText(/pending/i)).toBeTruthy();
    expect(screen.getByText(/in progress/i)).toBeTruthy();
  });
});
