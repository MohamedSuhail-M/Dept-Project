import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { ArrowUpRight, Navigation } from 'lucide-react';

const SIVET_CENTER: [number, number] = [12.9125, 80.1850];

const sivetIcon = L.divIcon({
  html: '<div style="width:18px;height:18px;background:#E3EF26;border:2px solid #06231D;border-radius:50%;box-shadow:0 0 0 4px rgba(227,239,38,.25)"></div>',
  className: '',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

export function CollegeMap() {
  return (
    <div>
      <div className="h-full min-h-[420px] w-full border border-cream/12">
        <MapContainer center={SIVET_CENTER} zoom={15} scrollWheelZoom={false} className="h-full min-h-[420px] w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={SIVET_CENTER} icon={sivetIcon}>
            <Popup>
              <strong>S.I.V.E.T. College</strong><br />Gowrivakkam, Chennai
            </Popup>
          </Marker>
        </MapContainer>
      </div>
      <a
        href="https://www.google.com/maps/search/?api=1&query=S.I.V.E.T.+College+Gowrivakkam+Chennai"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.18em] text-lime link-underline"
      >
        <Navigation size={14} /> GET DIRECTIONS <ArrowUpRight size={14} />
      </a>
    </div>
  );
}
