import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { useAuthStore } from '../../store/authStore.js';

const navItems = [
  ['/', 'Home'],
  ['/report', 'Report'],
  ['/map', 'Live Map'],
  ['/my-complaints', 'My Complaints'],
  ['/dashboard', 'Dashboard'],
  ['/analytics', 'Analytics']
];

export function Navbar() {
  const user = useAuthStore((state) => state.user);
  const { logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link to="/" className="font-heading text-xl font-bold text-water">
          WaterWatch
        </Link>
        <nav className="hidden gap-5 text-sm font-medium md:flex">
          {navItems.map(([href, label]) => (
            <NavLink key={href} to={href} className={({ isActive }) => (isActive ? 'text-water' : 'text-slate-600')}>
              {label}
            </NavLink>
          ))}
        </nav>
        {user ? (
          <div className="flex items-center gap-3">
            <div className="hidden text-right md:block">
              <p className="text-sm font-semibold text-slate-800">{user.name}</p>
              <p className="text-xs uppercase tracking-wide text-slate-500">{user.role}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                logout().catch(() => {
                  useAuthStore.getState().logout();
                });
              }}
              className="rounded-lg border border-water px-4 py-2 text-sm font-semibold text-water"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="rounded-lg border border-water px-4 py-2 text-sm font-semibold text-water">
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
