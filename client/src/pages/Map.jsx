import { useMemo, useState } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { PageWrapper } from '../components/layout/PageWrapper.jsx';
import { LeafletBaseMap, markerIcon } from '../components/map/LeafletBaseMap.jsx';
import { useMapComplaints } from '../hooks/useComplaints.js';
import { severityLevels } from '../constants/severityLevels.js';

export default function MapPage() {
  const { data: complaints = [], isLoading } = useMapComplaints();
  const [severity, setSeverity] = useState('ALL');
  const filtered = useMemo(
    () => complaints.filter((item) => (severity === 'ALL' ? true : item.aiSeverity === severity)),
    [complaints, severity]
  );

  return (
    <PageWrapper className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="rounded-3xl bg-white p-6 shadow-soft">
        <h1 className="font-heading text-2xl font-bold">Live Issue Map</h1>
        <p className="mt-2 text-sm text-slate-600">Filter by severity and inspect the latest public complaints.</p>
        <div className="mt-4 grid gap-2">
          <select
            value={severity}
            onChange={(event) => setSeverity(event.target.value)}
            className="rounded-2xl border border-slate-300 px-3 py-2"
          >
            <option value="ALL">All severities</option>
            {severityLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
          <p className="text-sm text-slate-500">{filtered.length} complaints visible</p>
        </div>
      </aside>
      <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-soft">
        <LeafletBaseMap center={[17.385, 78.4867]} zoom={12} popupText="Water issue location">
          {filtered.map((complaint) => (
            <Marker key={complaint.id} position={[complaint.latitude, complaint.longitude]} icon={markerIcon}>
              <Popup>
                <div className="space-y-1">
                  <p className="font-semibold">{complaint.issueType.replaceAll('_', ' ')}</p>
                  <p>Severity: {complaint.aiSeverity || 'PENDING'}</p>
                  <p>Status: {complaint.status}</p>
                  <p>Area: {complaint.address || 'Address unavailable'}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </LeafletBaseMap>
        {isLoading ? <div className="border-t bg-white p-4 text-sm text-slate-500">Loading public complaints...</div> : null}
      </div>
    </PageWrapper>
  );
}
