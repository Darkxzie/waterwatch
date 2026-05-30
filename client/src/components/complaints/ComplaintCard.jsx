import { Badge } from '../ui/Badge.jsx';
import { getSeverityColor } from '../../utils/getSeverityColor.js';
import { formatDate } from '../../utils/formatDate.js';

export function ComplaintCard({ complaint }) {
  return (
    <article className="rounded-3xl bg-white p-5 shadow-soft">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-heading text-lg font-semibold">{complaint.issueType.replaceAll('_', ' ')}</h3>
          <p className="text-sm text-slate-500">{formatDate(complaint.createdAt)}</p>
        </div>
        <Badge className={getSeverityColor(complaint.aiSeverity)}>{complaint.aiSeverity || 'PENDING'}</Badge>
      </div>
      <p className="mt-4 text-sm text-slate-700">{complaint.aiSummary || complaint.description}</p>
      <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
        <span>Status: {complaint.status}</span>
        <span>ID: {complaint.id.slice(0, 8)}</span>
      </div>
    </article>
  );
}
