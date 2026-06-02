import { useState } from 'react';
import toast from 'react-hot-toast';
import { PageWrapper } from '../components/layout/PageWrapper.jsx';
import { StatsCard } from '../components/dashboard/StatsCard.jsx';
import { api, getApiErrorMessage } from '../lib/api.js';
import { useAdminComplaints, useAdminResolutionTime } from '../hooks/useComplaints.js';
import { statusFlow } from '../constants/statusFlow.js';

export default function Dashboard() {
  const { data: complaints = [], error, refetch, isFetching } = useAdminComplaints();
  const { data: resolution = [] } = useAdminResolutionTime();
  const [updatingId, setUpdatingId] = useState(null);

  const avgHours =
    resolution.length > 0
      ? (
          resolution.reduce(
            (total, item) =>
              total + (new Date(item.resolvedAt) - new Date(item.createdAt)) / (1000 * 60 * 60),
            0
          ) / resolution.length
        ).toFixed(1)
      : '0';
  const resolvedToday = complaints.filter((item) => item.status === 'RESOLVED').length;
  const criticalIssues = complaints.filter((item) => item.aiSeverity === 'CRITICAL').length;
  const openCount = complaints.filter(
    (item) => item.status !== 'RESOLVED' && item.status !== 'REJECTED'
  ).length;

  async function handleStatusChange(id, status) {
    try {
      setUpdatingId(id);
      await api.patch(`/admin/complaints/${id}/status`, { status });
      await refetch();
      toast.success('Complaint status updated');
    } catch (requestError) {
      toast.error(getApiErrorMessage(requestError, 'Status update failed'));
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <PageWrapper className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky">
            Operations console
          </p>
          <h1 className="mt-2 font-heading text-4xl font-bold text-white">Authority Dashboard</h1>
          <p className="mt-2 text-sm leading-7 text-mist">
            A darker, denser command view for triage, scanning, and response updates.
          </p>
        </div>
        {isFetching ? (
          <p className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-mist">
            Refreshing...
          </p>
        ) : null}
      </div>
      {error ? (
        <div className="glass-panel rounded-[2rem] p-6 text-critical">
          Login as the seeded admin to use dashboard tools.
        </div>
      ) : null}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard label="Total Open" value={String(openCount)} />
        <StatsCard label="Critical Issues" value={String(criticalIssues)} tone="text-critical" />
        <StatsCard label="Resolved Today" value={String(resolvedToday)} tone="text-low" />
        <StatsCard label="Avg Resolution Time" value={`${avgHours}h`} />
      </section>
      <section className="glass-panel rounded-[2rem] p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-heading text-2xl font-semibold text-white">Authority Queue</h2>
          <p className="text-sm text-mist">{complaints.length} rows</p>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm text-slate-200">
            <thead>
              <tr className="border-b border-white/8 text-mist">
                <th className="py-3">ID</th>
                <th>Type</th>
                <th>Area</th>
                <th>Severity</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((complaint) => (
                <tr
                  key={complaint.id}
                  className="border-b border-white/6 transition hover:bg-white/[0.03]"
                >
                  <td className="py-3 font-medium text-white">{complaint.id.slice(0, 8)}</td>
                  <td>{complaint.issueType.replaceAll('_', ' ')}</td>
                  <td>{complaint.address || 'Unknown area'}</td>
                  <td>{complaint.aiSeverity || 'PENDING'}</td>
                  <td>{complaint.aiPriority || 'ROUTINE'}</td>
                  <td>{complaint.status.replaceAll('_', ' ')}</td>
                  <td>
                    <select
                      value={complaint.status}
                      onChange={(event) => handleStatusChange(complaint.id, event.target.value)}
                      disabled={updatingId === complaint.id}
                      className="input-dark rounded-xl px-3 py-2 outline-none"
                    >
                      {statusFlow.map((status) => (
                        <option key={status} value={status}>
                          {status.replaceAll('_', ' ')}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </PageWrapper>
  );
}
