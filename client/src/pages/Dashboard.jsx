import { PageWrapper } from '../components/layout/PageWrapper.jsx';
import { StatsCard } from '../components/dashboard/StatsCard.jsx';

export default function Dashboard() {
  return (
    <PageWrapper className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold md:text-4xl">Authority Dashboard</h1>
        <p className="mt-2 text-slate-600">Review, sort, and assign incoming complaints with priority context.</p>
      </div>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard label="Total Open" value="128" />
        <StatsCard label="Critical Issues" value="21" tone="text-critical" />
        <StatsCard label="Resolved Today" value="34" tone="text-low" />
        <StatsCard label="Avg Resolution Time" value="18h" />
      </section>
      <section className="rounded-[2rem] bg-white p-6 shadow-soft">
        <h2 className="font-heading text-2xl font-semibold">Authority Queue</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b text-slate-500">
                <th className="py-3">ID</th>
                <th>Type</th>
                <th>Area</th>
                <th>Severity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3">WW-1021</td>
                <td>DIRTY WATER</td>
                <td>Madhapur</td>
                <td>HIGH</td>
                <td>UNDER_REVIEW</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </PageWrapper>
  );
}
