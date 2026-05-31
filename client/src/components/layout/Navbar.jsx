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
    <header className="sticky top-0 z-20 border-b border-white/8 bg-night/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6 xl:px-8">
        <Link to="/" className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 animate-pulse-ring items-center justify-center rounded-2xl bg-gradient-to-br from-water to-sky font-heading text-base font-bold text-slate-950">
            WW
          </span>
          <div>
            <p className="font-heading text-xl font-bold text-white">WaterWatch</p>
            <p className="text-xs uppercase tracking-[0.28em] text-mist">Hyd civic response</p>
          </div>
        </Link>
        <nav className="hidden items-center gap-2 rounded-full border border-white/8 bg-white/5 p-2 md:flex">
          {navItems.map(([href, label], index) => (
            <NavLink
              key={href}
              to={href}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-medium transition duration-300 ${
                  isActive ? 'bg-white text-slate-950 shadow-soft' : 'text-mist hover:bg-white/8 hover:text-white'
                }`
              }
              style={{ animationDelay: `${index * 60}ms` }}
            >
              {label}
            </NavLink>
          ))}
        </nav>
        {user ? (
          <div className="flex items-center gap-3">
            <div className="hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-right md:block">
              <p className="text-sm font-semibold text-white">{user.name}</p>
              <p className="text-xs uppercase tracking-[0.22em] text-mist">{user.role}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                logout().catch(() => {
                  useAuthStore.getState().logout();
                });
              }}
              className="rounded-full border border-sky/25 bg-white/5 px-4 py-2 text-sm font-semibold text-sky transition hover:bg-white/10"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="rounded-full border border-sky/25 bg-white/5 px-4 py-2 text-sm font-semibold text-sky transition hover:bg-white/10">
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
