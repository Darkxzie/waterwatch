export function Badge({ children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] backdrop-blur ${className}`}
    >
      {children}
    </span>
  );
}
