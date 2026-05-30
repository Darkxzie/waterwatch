export function MapPlaceholder({ title = 'Live Map Preview' }) {
  return (
    <div className="flex min-h-80 items-center justify-center rounded-3xl border border-dashed border-sky/40 bg-gradient-to-br from-white to-sky/10 p-6 text-center">
      <div>
        <h3 className="font-heading text-xl font-semibold text-water">{title}</h3>
        <p className="mt-2 max-w-md text-sm text-slate-600">
          Leaflet integration is scaffolded here. Connect this surface to live complaint markers, clustering, and the heatmap layer.
        </p>
      </div>
    </div>
  );
}
