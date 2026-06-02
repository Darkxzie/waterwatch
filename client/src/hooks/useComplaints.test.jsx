import { describe, expect, it, vi, beforeEach } from 'vitest';

const useQueryMock = vi.fn((config) => config);
const apiGetMock = vi.fn();

vi.mock('@tanstack/react-query', () => ({
  useQuery: useQueryMock,
}));

vi.mock('../lib/api.js', () => ({
  api: {
    get: apiGetMock,
  },
}));

const {
  useAdminComplaints,
  useAdminResolutionTime,
  useAdminSummary,
  useAdminTrends,
  useMapComplaints,
  useMyComplaints,
} = await import('./useComplaints.js');

describe('useComplaints hooks', () => {
  beforeEach(() => {
    useQueryMock.mockClear();
    apiGetMock.mockReset();
  });

  it('builds the map complaints query', async () => {
    apiGetMock.mockResolvedValueOnce({ data: { data: [{ id: 'cmp-1' }] } });

    const query = useMapComplaints();
    const result = await query.queryFn();

    expect(query.queryKey).toEqual(['map-complaints']);
    expect(result).toEqual([{ id: 'cmp-1' }]);
    expect(apiGetMock).toHaveBeenCalledWith('/map/complaints');
  });

  it('builds the my complaints query', async () => {
    apiGetMock.mockResolvedValueOnce({ data: { data: [{ id: 'mine-1' }] } });

    const query = useMyComplaints();
    const result = await query.queryFn();

    expect(query.queryKey).toEqual(['my-complaints']);
    expect(result).toEqual([{ id: 'mine-1' }]);
    expect(apiGetMock).toHaveBeenCalledWith('/complaints/mine');
  });

  it('builds the admin complaints query', async () => {
    apiGetMock.mockResolvedValueOnce({ data: { data: [{ id: 'admin-1' }] } });

    const query = useAdminComplaints();
    const result = await query.queryFn();

    expect(query.queryKey).toEqual(['admin-complaints']);
    expect(result).toEqual([{ id: 'admin-1' }]);
    expect(apiGetMock).toHaveBeenCalledWith('/admin/complaints');
  });

  it('builds the admin summary query', async () => {
    apiGetMock.mockResolvedValueOnce({ data: { data: { totals: 3 } } });

    const query = useAdminSummary();
    const result = await query.queryFn();

    expect(query.queryKey).toEqual(['admin-summary']);
    expect(result).toEqual({ totals: 3 });
    expect(apiGetMock).toHaveBeenCalledWith('/admin/analytics/summary');
  });

  it('builds the admin trends query', async () => {
    apiGetMock.mockResolvedValueOnce({ data: { data: [{ createdAt: '2026-05-30' }] } });

    const query = useAdminTrends();
    const result = await query.queryFn();

    expect(query.queryKey).toEqual(['admin-trends']);
    expect(result).toEqual([{ createdAt: '2026-05-30' }]);
    expect(apiGetMock).toHaveBeenCalledWith('/admin/analytics/trends');
  });

  it('builds the admin resolution time query', async () => {
    apiGetMock.mockResolvedValueOnce({ data: { data: [{ resolvedAt: '2026-05-31' }] } });

    const query = useAdminResolutionTime();
    const result = await query.queryFn();

    expect(query.queryKey).toEqual(['admin-resolution-time']);
    expect(result).toEqual([{ resolvedAt: '2026-05-31' }]);
    expect(apiGetMock).toHaveBeenCalledWith('/admin/analytics/resolution-time');
  });
});
