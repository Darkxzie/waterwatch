import { statusFlow } from '../../constants/statusFlow.js';

export function StatusTimeline({ currentStatus }) {
  return (
    <div className="flex flex-wrap gap-2">
      {statusFlow.map((status) => {
        const active = status === currentStatus;
        return (
          <span
            key={status}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${active ? 'bg-water text-white' : 'bg-slate-200 text-slate-600'}`}
          >
            {status.replaceAll('_', ' ')}
          </span>
        );
      })}
    </div>
  );
}
