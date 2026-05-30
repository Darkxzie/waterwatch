export function Badge({ children, className = '' }) {
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${className}`}>{children}</span>;
}
