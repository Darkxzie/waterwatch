import { Link } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper.jsx';
import { Button } from '../components/ui/Button.jsx';

export default function Home() {
  return (
    <PageWrapper className="space-y-12">
      <section className="grid gap-10 rounded-[2rem] bg-white p-8 shadow-soft lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <span className="inline-flex rounded-full bg-sky/15 px-4 py-2 text-sm font-semibold text-water">AI-powered civic response</span>
          <div className="space-y-4">
            <h1 className="font-heading text-5xl font-bold leading-tight">See it. Report it. Fix it.</h1>
            <p className="max-w-2xl text-lg text-slate-600">
              WaterWatch helps Hyderabad residents report water issues with photo, location, and AI-assisted triage so authorities can act faster.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link to="/report">
              <Button>Report an Issue</Button>
            </Link>
            <Link to="/map" className="inline-flex min-h-11 items-center rounded-lg border border-water px-4 py-3 font-semibold text-water">
              View Live Map
            </Link>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl bg-ink p-6 text-white">
            <p className="text-sm uppercase tracking-wide text-sky">Total complaints</p>
            <p className="mt-2 font-heading text-4xl font-bold">1,248</p>
          </div>
          <div className="rounded-3xl bg-water p-6 text-white">
            <p className="text-sm uppercase tracking-wide text-sky/80">Resolved this week</p>
            <p className="mt-2 font-heading text-4xl font-bold">324</p>
          </div>
          <div className="rounded-3xl bg-slate-100 p-6">
            <p className="text-sm font-semibold text-water">1. Report</p>
            <p className="mt-2 text-slate-600">Citizens submit issues with location and photos.</p>
          </div>
          <div className="rounded-3xl bg-slate-100 p-6">
            <p className="text-sm font-semibold text-water">2. AI Sorts</p>
            <p className="mt-2 text-slate-600">Severity and priority are suggested instantly.</p>
          </div>
        </div>
      </section>
      <footer className="rounded-3xl bg-ink p-6 text-sm text-white">
        HMWSSB Helpline: 155313 | Public issue monitoring and municipal escalation platform.
      </footer>
    </PageWrapper>
  );
}
