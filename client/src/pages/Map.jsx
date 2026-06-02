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
    <PageWrapper className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <aside className="glass-panel rounded-[2rem] p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky">
          Public monitoring
        </p>
        <h1 className="mt-3 font-heading text-3xl font-bold text-white">Live Issue Map</h1>
        <p className="mt-3 text-sm leading-7 text-mist">
          Inspect the active complaint surface across the city with a calmer, darker field view.
        </p>
        <div className="mt-6 grid gap-3">
          <select
            value={severity}
            onChange={(event) => setSeverity(event.target.value)}
            className="input-dark rounded-2xl px-4 py-3 outline-none"
          >
            <option value="ALL">All severities</option>
            {severityLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
          <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-mist">Visible complaints</p>
            <p className="mt-2 font-heading text-3xl font-bold text-white">{filtered.length}</p>
          </div>
          <div className="grid gap-2 text-sm text-mist">
            <p className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-critical" /> Critical
            </p>
            <p className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-high" /> High
            </p>
            <p className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-medium" /> Medium
            </p>
            <p className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-low" /> Low
            </p>
          </div>
        </div>
      </aside>
      <div className="overflow-hidden rounded-[2rem] border border-white/8 shadow-soft glass-panel">
        <LeafletBaseMap center={[17.385, 78.4867]} zoom={12} popupText="Water issue location">
          {filtered.map((complaint) => (
            <Marker
              key={complaint.id}
              position={[complaint.latitude, complaint.longitude]}
              icon={markerIcon}
            >
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
        {isLoading ? (
          <div className="border-t border-white/8 bg-white/5 p-4 text-sm text-mist">
            Loading public complaints...
          </div>
        ) : null}
      </div>
    </PageWrapper>
  );
}
