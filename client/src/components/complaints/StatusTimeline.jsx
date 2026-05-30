import { statusFlow } from '../../constants/statusFlow.js';

export function StatusTimeline({ currentStatus }) {
  const currentIndex = statusFlow.indexOf(currentStatus);

  return (
    <div className="flex flex-wrap gap-2">
      {statusFlow.map((status, index) => {
        const active = status === currentStatus;
        const completed = currentIndex >= index;
        return (
          <span
            key={status}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              active ? 'bg-water text-white' : completed ? 'bg-sky/20 text-water' : 'bg-slate-200 text-slate-600'
            }`}
          >
            {status.replaceAll('_', ' ')}
          </span>
        );
      })}
    </div>
  );
}
