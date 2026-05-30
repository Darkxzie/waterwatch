export function Button({ children, className = '', loading = false, ...props }) {
  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center rounded-lg bg-water px-4 py-3 font-semibold text-white transition hover:bg-sky disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? 'Analyzing with AI...' : children}
    </button>
  );
}
