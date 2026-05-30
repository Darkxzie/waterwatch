export function StatsCard({ label, value, tone = 'text-water' }) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-soft">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-2 font-heading text-3xl font-bold ${tone}`}>{value}</p>
    </div>
  );
}
