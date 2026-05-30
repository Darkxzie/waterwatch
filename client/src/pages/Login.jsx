import { useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper.jsx';
import { Button } from '../components/ui/Button.jsx';
import { useAuth } from '../hooks/useAuth.js';

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });

  return (
    <PageWrapper className="flex justify-center">
      <form
        className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-soft"
        onSubmit={async (event) => {
          event.preventDefault();
          await login(form);
        }}
      >
        <h1 className="font-heading text-3xl font-bold">Login</h1>
        <div className="mt-6 grid gap-4">
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
          <Button type="submit">Login</Button>
        </div>
      </form>
    </PageWrapper>
  );
}
