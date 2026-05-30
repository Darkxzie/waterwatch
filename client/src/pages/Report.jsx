import { useState } from 'react';
import DOMPurify from 'dompurify';
import { PageWrapper } from '../components/layout/PageWrapper.jsx';
import { issueTypes } from '../constants/issueTypes.js';
import { useGeolocation } from '../hooks/useGeolocation.js';
import { MapPlaceholder } from '../components/map/MapPlaceholder.jsx';
import { Button } from '../components/ui/Button.jsx';

export default function Report() {
  const { coords, error } = useGeolocation();
  const [description, setDescription] = useState('');
  const [issueType, setIssueType] = useState(issueTypes[0].value);

  return (
    <PageWrapper className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
      <section className="rounded-[2rem] bg-white p-8 shadow-soft">
        <h1 className="font-heading text-3xl font-bold">Report a Water Issue</h1>
        <p className="mt-2 text-slate-600">Share what happened, attach a photo, and confirm the location pin.</p>
        <div className="mt-8 grid gap-6">
          <div className="grid gap-3 sm:grid-cols-2">
            {issueTypes.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setIssueType(item.value)}
                className={`rounded-2xl border p-4 text-left ${issueType === item.value ? 'border-water bg-sky/10' : 'border-slate-200'}`}
              >
                <div className="text-2xl">{item.icon}</div>
                <div className="mt-2 font-semibold">{item.label}</div>
              </button>
            ))}
          </div>
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-slate-700">Description</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(DOMPurify.sanitize(event.target.value))}
              minLength={20}
              rows={6}
              className="rounded-2xl border border-slate-300 px-4 py-3 outline-none ring-water transition focus:ring-2"
              placeholder="Describe the issue, affected area, and urgency."
            />
            <span className="text-xs text-slate-500">{description.length}/1500 characters</span>
          </label>
          <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">
            Drag and drop image upload area. Accepts JPEG, PNG, WEBP up to 10MB.
          </div>
          <Button disabled={description.trim().length < 20}>Submit Complaint</Button>
        </div>
      </section>
      <section className="space-y-4">
        <MapPlaceholder title="Confirm Location Pin" />
        <div className="rounded-3xl bg-white p-6 shadow-soft">
          <h2 className="font-heading text-xl font-semibold">Detected Location</h2>
          <p className="mt-2 text-sm text-slate-600">
            Lat: {coords.latitude.toFixed(4)} | Lng: {coords.longitude.toFixed(4)}
          </p>
          {error ? <p className="mt-2 text-sm text-critical">{error}</p> : null}
        </div>
      </section>
    </PageWrapper>
  );
}
