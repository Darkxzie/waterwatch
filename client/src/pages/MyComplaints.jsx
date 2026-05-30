import { PageWrapper } from '../components/layout/PageWrapper.jsx';
import { ComplaintCard } from '../components/complaints/ComplaintCard.jsx';
import { useMyComplaints } from '../hooks/useComplaints.js';

export default function MyComplaints() {
  const { data: complaints = [], isLoading, error } = useMyComplaints();

  return (
    <PageWrapper className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold">My Complaints</h1>
        <p className="mt-2 text-slate-600">Track status, AI summary, and resolution progress for your reports.</p>
      </div>
      {isLoading ? <div className="rounded-3xl bg-white p-6 shadow-soft">Loading your complaints...</div> : null}
      {error ? <div className="rounded-3xl bg-white p-6 text-critical shadow-soft">Please login to view your complaints.</div> : null}
      {!isLoading && !error && complaints.length === 0 ? (
        <div className="rounded-3xl bg-white p-6 shadow-soft">No complaints yet. Report your first issue from the Report page.</div>
      ) : null}
      <div className="grid gap-4">
        {complaints.map((complaint) => (
          <ComplaintCard key={complaint.id} complaint={complaint} />
        ))}
      </div>
    </PageWrapper>
  );
}
