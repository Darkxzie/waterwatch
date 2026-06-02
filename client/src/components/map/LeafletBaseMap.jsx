import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconAnchor: [12, 41],
});

export { icon as markerIcon };

function ClickSetter({ onSelect }) {
  useMapEvents({
    click(event) {
      onSelect?.(event.latlng);
    },
  });

  return null;
}

export function LeafletBaseMap({
  center,
  marker,
  onSelect,
  children,
  popupText = 'Selected location',
  zoom = 13,
  className = 'h-[420px] w-full rounded-3xl',
}) {
  return (
    <MapContainer center={center} zoom={zoom} scrollWheelZoom className={className}>
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickSetter onSelect={onSelect} />
      {marker ? (
        <Marker
          position={[marker.latitude, marker.longitude]}
          draggable={Boolean(onSelect)}
          icon={icon}
          eventHandlers={
            onSelect
              ? {
                  dragend(event) {
                    const { lat, lng } = event.target.getLatLng();
                    onSelect({ lat, lng });
                  },
                }
              : undefined
          }
        >
          <Popup>{popupText}</Popup>
        </Marker>
      ) : null}
      {children}
    </MapContainer>
  );
}
