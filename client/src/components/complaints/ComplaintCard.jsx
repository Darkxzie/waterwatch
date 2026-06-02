import { Badge } from '../ui/Badge.jsx';
import { getSeverityColor } from '../../utils/getSeverityColor.js';
import { formatDate } from '../../utils/formatDate.js';
import { StatusTimeline } from './StatusTimeline.jsx';

export function ComplaintCard({ complaint }) {
  return (
    <article className="glass-panel rounded-[1.75rem] p-5 transition duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-heading text-lg font-semibold text-white">
            {complaint.issueType.replaceAll('_', ' ')}
          </h3>
          <p className="text-sm text-mist">{formatDate(complaint.createdAt)}</p>
        </div>
        <Badge className={getSeverityColor(complaint.aiSeverity)}>
          {complaint.aiSeverity || 'PENDING'}
        </Badge>
      </div>
      <p className="mt-4 text-sm leading-7 text-slate-200">
        {complaint.aiSummary || complaint.description}
      </p>
      <div className="mt-4">
        <StatusTimeline currentStatus={complaint.status} />
      </div>
      <div className="mt-4 flex items-center justify-between text-sm text-mist">
        <span>Status: {complaint.status.replaceAll('_', ' ')}</span>
        <span>ID: {complaint.id.slice(0, 8)}</span>
      </div>
    </article>
  );
}
