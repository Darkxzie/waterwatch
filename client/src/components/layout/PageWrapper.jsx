export function PageWrapper({ children, className = '' }) {
  return <main className={`page-enter mx-auto max-w-7xl px-4 py-8 md:px-6 xl:px-8 ${className}`}>{children}</main>;
}
