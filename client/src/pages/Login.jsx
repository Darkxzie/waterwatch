import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { PageWrapper } from '../components/layout/PageWrapper.jsx';
import { Button } from '../components/ui/Button.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { getApiErrorMessage } from '../lib/api.js';

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
        className="glass-panel relative w-full max-w-md overflow-hidden rounded-[2rem] p-8"
        onSubmit={async (event) => {
          event.preventDefault();
          setLoading(true);
          setError('');
          try {
            const payload =
              mode === 'register' ? form : { email: form.email, password: form.password };
            const authData = mode === 'register' ? await register(payload) : await login(payload);
            toast.success(
              mode === 'register' ? 'Account created successfully' : 'Logged in successfully'
            );
            navigate(authData.user.role === 'CITIZEN' ? '/my-complaints' : '/dashboard');
          } catch (requestError) {
            setError(getApiErrorMessage(requestError, 'Authentication failed'));
          } finally {
            setLoading(false);
          }
        }}
      >
        <div className="absolute -right-10 top-0 h-40 w-40 rounded-full bg-sky/15 blur-3xl" />
        <div className="relative">
          <div className="mb-6 flex gap-2 rounded-2xl border border-white/10 bg-white/5 p-1">
            {['login', 'register'].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setMode(item);
                  setError('');
                }}
                className={`flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  mode === item
                    ? 'bg-white text-slate-950 shadow-soft'
                    : 'text-mist hover:text-white'
                }`}
              >
                {item === 'login' ? 'Login' : 'Register'}
              </button>
            ))}
          </div>
          <h1 className="font-heading text-3xl font-bold text-white">
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="mt-2 text-sm leading-7 text-mist">
            Use the demo admin credentials or create a new citizen account to access the live flow.
          </p>
          <div className="mt-4 rounded-2xl border border-sky/15 bg-sky/10 px-4 py-3 text-sm text-sky">
            Demo admin: <span className="font-semibold">admin@waterwatch.local</span> /{' '}
            <span className="font-semibold">Admin@123</span>
          </div>
          <div className="mt-6 grid gap-4">
            {mode === 'register' ? (
              <input
                type="text"
                placeholder="Full name"
                className="input-dark rounded-2xl px-4 py-3 outline-none"
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({ ...current, name: event.target.value }))
                }
              />
            ) : null}
            <input
              type="email"
              placeholder="Email"
              className="input-dark rounded-2xl px-4 py-3 outline-none"
              value={form.email}
              onChange={(event) =>
                setForm((current) => ({ ...current, email: event.target.value }))
              }
            />
            <input
              type="password"
              placeholder="Password"
              className="input-dark rounded-2xl px-4 py-3 outline-none"
              value={form.password}
              onChange={(event) =>
                setForm((current) => ({ ...current, password: event.target.value }))
              }
            />
            {error ? (
              <p className="rounded-2xl bg-critical/10 px-4 py-3 text-sm text-critical">{error}</p>
            ) : null}
            <Button
              type="submit"
              loading={loading}
              loadingText={mode === 'login' ? 'Signing in...' : 'Creating account...'}
            >
              {mode === 'login' ? 'Login' : 'Register'}
            </Button>
          </div>
        </div>
      </form>
    </PageWrapper>
  );
}
