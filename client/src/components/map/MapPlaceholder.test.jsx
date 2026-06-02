import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MapPlaceholder } from './MapPlaceholder.jsx';

describe('MapPlaceholder', () => {
  it('renders the provided placeholder title', () => {
    render(<MapPlaceholder title="Map Coming Soon" />);

    expect(screen.getByText('Map Coming Soon')).toBeTruthy();
    expect(screen.getByText(/Leaflet integration is scaffolded here/i)).toBeTruthy();
  });
});
