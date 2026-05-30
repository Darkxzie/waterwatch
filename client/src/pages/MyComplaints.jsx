import { PageWrapper } from '../components/layout/PageWrapper.jsx';
import { ComplaintCard } from '../components/complaints/ComplaintCard.jsx';

const mockComplaints = [
  {
    id: 'c1f2d3e4',
    issueType: 'PIPE_LEAK',
    createdAt: new Date().toISOString(),
    aiSeverity: 'HIGH',
    aiSummary: 'Continuous pipe leak reported near the residential lane.',
    status: 'UNDER_REVIEW'
  }
];

export default function MyComplaints() {
  return (
    <PageWrapper className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold">My Complaints</h1>
        <p className="mt-2 text-slate-600">Track status, AI summary, and resolution progress for your reports.</p>
      </div>
      <div className="grid gap-4">
        {mockComplaints.map((complaint) => (
          <ComplaintCard key={complaint.id} complaint={complaint} />
        ))}
      </div>
    </PageWrapper>
  );
}
