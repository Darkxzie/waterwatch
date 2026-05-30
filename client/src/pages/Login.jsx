import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { PageWrapper } from '../components/layout/PageWrapper.jsx';
import { Button } from '../components/ui/Button.jsx';
import { useAuth } from '../hooks/useAuth.js';

export default function Login() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  return (
    <PageWrapper className="flex justify-center">
      <form
        className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-soft"
        onSubmit={async (event) => {
          event.preventDefault();
          setLoading(true);
          setError('');
          try {
            const payload = mode === 'register' ? form : { email: form.email, password: form.password };
            const authData = mode === 'register' ? await register(payload) : await login(payload);
            toast.success(mode === 'register' ? 'Account created successfully' : 'Logged in successfully');
            navigate(authData.user.role === 'CITIZEN' ? '/my-complaints' : '/dashboard');
          } catch (requestError) {
            setError(requestError.response?.data?.error || 'Authentication failed');
          } finally {
            setLoading(false);
          }
        }}
      >
        <div className="mb-6 flex gap-2 rounded-2xl bg-slate-100 p-1">
          {['login', 'register'].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setMode(item);
                setError('');
              }}
              className={`flex-1 rounded-xl px-4 py-2 text-sm font-semibold ${
                mode === item ? 'bg-white text-water shadow-sm' : 'text-slate-500'
              }`}
            >
              {item === 'login' ? 'Login' : 'Register'}
            </button>
          ))}
        </div>
        <h1 className="font-heading text-3xl font-bold">{mode === 'login' ? 'Login' : 'Create Account'}</h1>
        <p className="mt-2 text-sm text-slate-600">
          Demo admin: `admin@waterwatch.local` / `Admin@123`
        </p>
        <div className="mt-6 grid gap-4">
          {mode === 'register' ? (
            <input
              type="text"
              placeholder="Full name"
              className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-water"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            />
          ) : null}
          <input
            type="email"
            placeholder="Email"
            className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-water"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          />
          <input
            type="password"
            placeholder="Password"
            className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-water"
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
          />
          {error ? <p className="text-sm text-critical">{error}</p> : null}
          <Button type="submit" loading={loading} loadingText={mode === 'login' ? 'Signing in...' : 'Creating account...'}>
            {mode === 'login' ? 'Login' : 'Register'}
          </Button>
        </div>
      </form>
    </PageWrapper>
  );
}
