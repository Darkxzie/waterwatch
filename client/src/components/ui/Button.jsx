export function Button({ children, className = '', loading = false, loadingText = 'Loading...', ...props }) {
  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center rounded-xl border border-sky/20 bg-gradient-to-r from-water to-sky px-5 py-3 font-semibold text-slate-950 shadow-glow transition duration-300 hover:-translate-y-0.5 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? loadingText : children}
    </button>
  );
}
