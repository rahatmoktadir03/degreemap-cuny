import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Link } from "react-router-dom";
import type { Campus, CampusType } from "../data/cunyCampuses";

// Fix default marker icon paths under Vite bundling
const colorIcon = (color: string) =>
  L.divIcon({
    className: "cuny-marker",
    html: `<span style="background:${color};box-shadow:0 0 0 3px white,0 4px 14px rgba(0,0,0,0.3);width:16px;height:16px;display:block;border-radius:50%;"></span>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });

const typeColor: Record<CampusType, string> = {
  "Senior College": "#2563eb",
  "Community College": "#10b981",
  "Graduate / Professional": "#a855f7",
};

const FitBounds = ({ campuses }: { campuses: Campus[] }) => {
  const map = useMap();
  useEffect(() => {
    if (!campuses.length) return;
    const bounds = L.latLngBounds(campuses.map((c) => c.coords));
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [campuses, map]);
  return null;
};

interface Props {
  campuses: Campus[];
  height?: string;
}

const CampusMap = ({ campuses, height = "420px" }: Props) => {
  return (
    <div
      className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm"
      style={{ height }}
    >
      <MapContainer
        center={[40.7128, -74.006]}
        zoom={11}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds campuses={campuses} />
        {campuses.map((c) => (
          <Marker key={c.id} position={c.coords} icon={colorIcon(typeColor[c.type])}>
            <Popup>
              <div style={{ minWidth: 200 }}>
                <strong style={{ fontSize: 13 }}>{c.name}</strong>
                <p style={{ margin: "4px 0", fontSize: 12, color: "#475569" }}>
                  {c.type} · {c.borough}
                </p>
                <Link
                  to={`/schools/${c.id}`}
                  style={{ fontSize: 12, color: "#2563eb", fontWeight: 600 }}
                >
                  View details →
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default CampusMap;
