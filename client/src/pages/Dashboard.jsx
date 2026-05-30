import { useState } from 'react';
import toast from 'react-hot-toast';
import { PageWrapper } from '../components/layout/PageWrapper.jsx';
import { StatsCard } from '../components/dashboard/StatsCard.jsx';
import { api } from '../lib/api.js';
import { useAdminComplaints, useAdminResolutionTime } from '../hooks/useComplaints.js';
import { statusFlow } from '../constants/statusFlow.js';

export default function Dashboard() {
  const { data: complaints = [], error, refetch, isFetching } = useAdminComplaints();
  const { data: resolution = [] } = useAdminResolutionTime();
  const [updatingId, setUpdatingId] = useState(null);

  const avgHours =
    resolution.length > 0
      ? (
          resolution.reduce((total, item) => total + (new Date(item.resolvedAt) - new Date(item.createdAt)) / (1000 * 60 * 60), 0) /
          resolution.length
        ).toFixed(1)
      : '0';
  const resolvedToday = complaints.filter((item) => item.status === 'RESOLVED').length;
  const criticalIssues = complaints.filter((item) => item.aiSeverity === 'CRITICAL').length;
  const openCount = complaints.filter((item) => item.status !== 'RESOLVED' && item.status !== 'REJECTED').length;

  async function handleStatusChange(id, status) {
    try {
      setUpdatingId(id);
      await api.patch(`/admin/complaints/${id}/status`, { status });
      await refetch();
      toast.success('Complaint status updated');
    } catch (requestError) {
      toast.error(requestError.response?.data?.error || 'Status update failed');
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <PageWrapper className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold md:text-4xl">Authority Dashboard</h1>
        <p className="mt-2 text-slate-600">Review, sort, and assign incoming complaints with priority context.</p>
      </div>
      {error ? <div className="rounded-3xl bg-white p-6 text-critical shadow-soft">Login as the seeded admin to use dashboard tools.</div> : null}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard label="Total Open" value={String(openCount)} />
        <StatsCard label="Critical Issues" value={String(criticalIssues)} tone="text-critical" />
        <StatsCard label="Resolved Today" value={String(resolvedToday)} tone="text-low" />
        <StatsCard label="Avg Resolution Time" value={`${avgHours}h`} />
      </section>
      <section className="rounded-[2rem] bg-white p-6 shadow-soft">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-heading text-2xl font-semibold">Authority Queue</h2>
          {isFetching ? <p className="text-sm text-slate-500">Refreshing...</p> : null}
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b text-slate-500">
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
                <tr key={complaint.id} className="border-b">
                  <td className="py-3 font-medium">{complaint.id.slice(0, 8)}</td>
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
                      className="rounded-xl border border-slate-300 px-3 py-2"
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
