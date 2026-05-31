import { PageWrapper } from '../components/layout/PageWrapper.jsx';
import { ComplaintCard } from '../components/complaints/ComplaintCard.jsx';
import { useMyComplaints } from '../hooks/useComplaints.js';

export default function MyComplaints() {
  const { data: complaints = [], isLoading, error } = useMyComplaints();

  return (
    <PageWrapper className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky">Citizen tracking</p>
          <h1 className="mt-2 font-heading text-4xl font-bold text-white">My Complaints</h1>
          <p className="mt-2 text-sm leading-7 text-mist">Track issue state, AI summary, and response progress in a calmer dark interface.</p>
        </div>
        <div className="rounded-2xl border border-white/8 bg-white/5 px-5 py-4">
          <p className="text-xs uppercase tracking-[0.22em] text-mist">Total reports</p>
          <p className="mt-2 font-heading text-3xl font-bold text-white">{complaints.length}</p>
        </div>
      </div>
      {isLoading ? <div className="glass-panel rounded-[2rem] p-6 text-mist">Loading your complaints...</div> : null}
      {error ? <div className="glass-panel rounded-[2rem] p-6 text-critical">Please login to view your complaints.</div> : null}
      {!isLoading && !error && complaints.length === 0 ? (
        <div className="glass-panel rounded-[2rem] p-6 text-mist">No complaints yet. Report your first issue from the Report page.</div>
      ) : null}
      <div className="grid gap-4">
        {complaints.map((complaint) => (
          <ComplaintCard key={complaint.id} complaint={complaint} />
        ))}
      </div>
    </PageWrapper>
  );
}
