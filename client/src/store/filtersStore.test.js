import { afterEach, describe, expect, it } from 'vitest';
import { useFiltersStore } from './filtersStore.js';

afterEach(() => {
  useFiltersStore.setState({
    severity: 'ALL',
    issueType: 'ALL',
    status: 'ALL',
  });
});

describe('useFiltersStore', () => {
  it('updates a named filter key', () => {
    useFiltersStore.getState().setFilter('severity', 'HIGH');

    expect(useFiltersStore.getState().severity).toBe('HIGH');
    expect(useFiltersStore.getState().issueType).toBe('ALL');
  });
});
