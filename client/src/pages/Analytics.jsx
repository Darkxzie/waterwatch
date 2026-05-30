import { PageWrapper } from '../components/layout/PageWrapper.jsx';

export default function Analytics() {
  return (
    <PageWrapper className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold">Analytics</h1>
        <p className="mt-2 text-slate-600">Charts and area trends will connect to `/api/admin/analytics/*` data.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-soft">Bar chart placeholder</div>
        <div className="rounded-3xl bg-white p-6 shadow-soft">Line chart placeholder</div>
        <div className="rounded-3xl bg-white p-6 shadow-soft">Pie chart placeholder</div>
        <div className="rounded-3xl bg-white p-6 shadow-soft">Resolution time placeholder</div>
      </div>
    </PageWrapper>
  );
}
