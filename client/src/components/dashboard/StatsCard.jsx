export function StatsCard({ label, value, tone = 'text-water' }) {
  return (
    <div className="glass-panel rounded-[1.75rem] p-5 transition duration-300 hover:-translate-y-1">
      <p className="text-sm uppercase tracking-[0.2em] text-mist">{label}</p>
      <p className={`mt-2 font-heading text-3xl font-bold ${tone}`}>{value}</p>
    </div>
  );
}
