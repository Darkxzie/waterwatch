import { useMemo, useState } from 'react';
import DOMPurify from 'dompurify';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper.jsx';
import { issueTypes } from '../constants/issueTypes.js';
import { useGeolocation } from '../hooks/useGeolocation.js';
import { LeafletBaseMap } from '../components/map/LeafletBaseMap.jsx';
import { Button } from '../components/ui/Button.jsx';
import { api } from '../lib/api.js';
import { useAuthStore } from '../store/authStore.js';

const DESCRIPTION_MIN_LENGTH = 20;

export default function Report() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { coords, error, setCoords } = useGeolocation();
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('Hyderabad');
  const [issueType, setIssueType] = useState(issueTypes[0].value);
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(null);
  const [submitError, setSubmitError] = useState('');

  const marker = useMemo(() => ({ latitude: coords.latitude, longitude: coords.longitude }), [coords.latitude, coords.longitude]);
  const descriptionLength = description.trim().length;
  const isValid = descriptionLength >= DESCRIPTION_MIN_LENGTH && Number.isFinite(coords.latitude) && Number.isFinite(coords.longitude);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError('');

    if (!user) {
      toast.error('Please login before submitting a complaint.');
      navigate('/login');
      return;
    }

    if (!isValid) {
      setSubmitError(`Description must be at least ${DESCRIPTION_MIN_LENGTH} characters and location must be valid.`);
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('issueType', issueType);
      formData.append('description', description.trim());
      formData.append('latitude', String(coords.latitude));
      formData.append('longitude', String(coords.longitude));
      formData.append('address', address.trim());
      if (photo) {
        formData.append('photo', photo);
      }

      const response = await api.post('/complaints', formData);
      setSubmitted(response.data.data);
      toast.success('Complaint submitted successfully');
    } catch (requestError) {
      const message = requestError.response?.data?.error || 'Complaint submission failed';
      setSubmitError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <PageWrapper className="flex justify-center">
        <section className="w-full max-w-2xl rounded-[2rem] bg-white p-8 shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-wide text-water">Complaint submitted</p>
          <h1 className="mt-2 font-heading text-3xl font-bold">Your report is now in the queue.</h1>
          <p className="mt-4 text-slate-600">Complaint ID: {submitted.id}</p>
          <div className="mt-6 grid gap-3 rounded-3xl bg-slate-50 p-5">
            <p>Severity: {submitted.aiSeverity || 'PENDING'}</p>
            <p>Priority: {submitted.aiPriority || 'ROUTINE'}</p>
            <p>Summary: {submitted.aiSummary || 'Analysis pending'}</p>
          </div>
          <div className="mt-6 flex gap-3">
            <Button type="button" onClick={() => navigate('/map')}>
              View on Map
            </Button>
            <Button
              type="button"
              className="bg-slate-800 hover:bg-slate-700"
              onClick={() => {
                setSubmitted(null);
                setDescription('');
                setPhoto(null);
                setSubmitError('');
              }}
            >
              Report Another Issue
            </Button>
          </div>
        </section>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
      <form className="rounded-[2rem] bg-white p-8 shadow-soft" onSubmit={handleSubmit}>
        <h1 className="font-heading text-3xl font-bold">Report a Water Issue</h1>
        <p className="mt-2 text-slate-600">Share what happened, attach a photo, and confirm the location pin.</p>
        {!user ? <p className="mt-3 rounded-2xl bg-sky/10 px-4 py-3 text-sm text-water">Login is required before complaint submission.</p> : null}
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
              minLength={DESCRIPTION_MIN_LENGTH}
              rows={6}
              className="rounded-2xl border border-slate-300 px-4 py-3 outline-none ring-water transition focus:ring-2"
              placeholder="Describe the issue, affected area, and urgency."
            />
            <span className={`text-xs ${descriptionLength >= DESCRIPTION_MIN_LENGTH ? 'text-low' : 'text-slate-500'}`}>
              {description.length}/1500 characters. Minimum {DESCRIPTION_MIN_LENGTH}.
            </span>
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-slate-700">Area / Address</span>
            <input
              value={address}
              onChange={(event) => setAddress(DOMPurify.sanitize(event.target.value))}
              className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-water"
              placeholder="Enter locality or landmark"
            />
          </label>
          <label className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">
            <span className="mb-3 block font-semibold text-slate-700">Photo Upload</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => {
                const selectedFile = event.target.files?.[0] || null;
                if (selectedFile && selectedFile.size > 10 * 1024 * 1024) {
                  setPhoto(null);
                  setSubmitError('Photo must be 10MB or smaller.');
                  return;
                }

                setSubmitError('');
                setPhoto(selectedFile);
              }}
            />
            <span className="mt-2 block">Accepts JPEG, PNG, WEBP up to 10MB.</span>
            {photo ? <span className="mt-2 block text-water">Selected: {photo.name}</span> : null}
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-700">Latitude</span>
              <input
                type="number"
                step="0.0001"
                value={coords.latitude}
                onChange={(event) =>
                  setCoords((current) => ({
                    ...current,
                    latitude: Number(event.target.value)
                  }))
                }
                className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-water"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-700">Longitude</span>
              <input
                type="number"
                step="0.0001"
                value={coords.longitude}
                onChange={(event) =>
                  setCoords((current) => ({
                    ...current,
                    longitude: Number(event.target.value)
                  }))
                }
                className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-water"
              />
            </label>
          </div>
          {submitError ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-critical">{submitError}</p> : null}
          <Button type="submit" loading={loading} loadingText="Submitting complaint..." disabled={loading || !isValid}>
            Submit Complaint
          </Button>
        </div>
      </form>
      <section className="space-y-4">
        <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-soft">
          <LeafletBaseMap
            center={[coords.latitude, coords.longitude]}
            marker={marker}
            popupText="Drag or click to adjust issue location"
            onSelect={({ lat, lng }) =>
              setCoords({
                latitude: lat,
                longitude: lng
              })
            }
          />
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-soft">
          <h2 className="font-heading text-xl font-semibold">Detected Location</h2>
          <p className="mt-2 text-sm text-slate-600">
            Lat: {coords.latitude.toFixed(4)} | Lng: {coords.longitude.toFixed(4)}
          </p>
          <p className="mt-2 text-sm text-slate-500">Click on the map or drag the marker to fine-tune the complaint location.</p>
          {error ? <p className="mt-2 text-sm text-critical">{error}</p> : null}
        </div>
      </section>
    </PageWrapper>
  );
}
