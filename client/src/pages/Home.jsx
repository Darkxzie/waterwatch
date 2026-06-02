import { Link } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper.jsx';
import { Button } from '../components/ui/Button.jsx';

const storyCards = [
  {
    label: 'Report',
    body: 'Capture a leak, outage, or contamination point with a location pin in seconds.',
  },
  {
    label: 'Analyze',
    body: 'AI triage adds severity, summary, and routing signals before the issue reaches staff.',
  },
  {
    label: 'Resolve',
    body: 'Authorities see priority, trend, and field-ready context in a single operational view.',
  },
];

export default function Home() {
  return (
    <PageWrapper className="space-y-12">
      <section className="relative overflow-hidden rounded-[2.4rem] border border-white/8 px-8 py-10 shadow-soft glass-panel lg:px-12 lg:py-14">
        <div className="surface-grid absolute inset-0 opacity-30" />
        <div className="absolute -left-20 top-10 h-60 w-60 rounded-full bg-water/20 blur-3xl" />
        <div className="absolute right-0 top-0 h-72 w-72 animate-float rounded-full bg-sky/10 blur-3xl" />
        <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-7">
            <span className="inline-flex rounded-full border border-sky/20 bg-sky/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-sky">
              AI-powered civic water response
            </span>
            <div className="space-y-5">
              <h1 className="max-w-3xl font-heading text-5xl font-extrabold leading-[1.02] text-white md:text-6xl">
                See it. Report it. <span className="text-sky">Fix it faster.</span>
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-mist">
                WaterWatch gives residents a clean, fast way to report water issues while giving
                municipal teams a dark, data-rich command center for response.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link to="/report">
                <Button>Report an Issue</Button>
              </Link>
              <Link
                to="/map"
                className="inline-flex min-h-11 items-center rounded-xl border border-white/12 bg-white/6 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                View Live Map
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/6 p-5 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.24em] text-mist">Total complaints</p>
                <p className="mt-3 font-heading text-4xl font-bold text-white">1,248</p>
              </div>
              <div className="rounded-3xl border border-sky/20 bg-sky/10 p-5 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.24em] text-sky">Resolved this week</p>
                <p className="mt-3 font-heading text-4xl font-bold text-white">324</p>
              </div>
              <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-5 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.24em] text-emerald-300">Avg response</p>
                <p className="mt-3 font-heading text-4xl font-bold text-white">2.8h</p>
              </div>
            </div>
          </div>
          <div className="grid gap-4 lg:pl-8">
            {storyCards.map((card, index) => (
              <div
                key={card.label}
                className="glass-panel rounded-[1.75rem] p-6 transition duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 90}ms` }}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky">
                  {card.label}
                </p>
                <p className="mt-3 text-base leading-7 text-slate-200">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="glass-panel rounded-[2rem] p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky">How it works</p>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {storyCards.map((card, index) => (
              <div
                key={card.label}
                className="rounded-[1.5rem] border border-white/8 bg-white/5 p-5"
              >
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 font-heading text-lg font-bold text-white">
                  0{index + 1}
                </div>
                <h2 className="font-heading text-xl font-semibold text-white">{card.label}</h2>
                <p className="mt-3 text-sm leading-7 text-mist">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[2rem] border border-sky/15 bg-gradient-to-br from-sky/15 to-transparent p-8 shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky">
            Public helpline
          </p>
          <h2 className="mt-3 font-heading text-3xl font-bold text-white">HMWSSB 155313</h2>
          <p className="mt-4 text-sm leading-7 text-mist">
            Use WaterWatch for traceable issue reporting, public map visibility, and authority
            follow-through. The helpline remains available for urgent escalation.
          </p>
        </div>
      </section>
    </PageWrapper>
  );
}
