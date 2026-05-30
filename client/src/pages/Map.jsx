import { PageWrapper } from '../components/layout/PageWrapper.jsx';
import { MapPlaceholder } from '../components/map/MapPlaceholder.jsx';

export default function MapPage() {
  return (
    <PageWrapper className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="rounded-3xl bg-white p-6 shadow-soft">
        <h1 className="font-heading text-2xl font-bold">Live Issue Map</h1>
        <p className="mt-2 text-sm text-slate-600">Filter by issue type, severity, status, and date range.</p>
      </aside>
      <MapPlaceholder title="Hyderabad Live Map" />
    </PageWrapper>
  );
}
