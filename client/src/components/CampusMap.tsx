import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Link } from "react-router-dom";
import type { Campus, CampusType } from "../data/cunyCampuses";

const typeColor: Record<CampusType, string> = {
  "Senior College": "#2563eb",
  "Community College": "#10b981",
  "Graduate / Professional": "#a855f7",
};

const buildIcon = (color: string) =>
  L.divIcon({
    className: "cuny-marker",
    html: `<span style="background:${color};box-shadow:0 0 0 3px white,0 4px 14px rgba(0,0,0,0.3);width:16px;height:16px;display:block;border-radius:50%;"></span>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });

// Cache icons by color so we don't recreate them on every render.
const iconCache: Record<string, L.DivIcon> = {};
const iconFor = (type: CampusType) => {
  const color = typeColor[type];
  if (!iconCache[color]) iconCache[color] = buildIcon(color);
  return iconCache[color];
};

const FitBounds = ({ campuses }: { campuses: Campus[] }) => {
  const map = useMap();
  useEffect(() => {
    if (!campuses.length) return;
    try {
      const bounds = L.latLngBounds(campuses.map((c) => c.coords));
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
      }
    } catch {
      /* ignore */
    }
  }, [campuses, map]);
  return null;
};

interface Props {
  campuses: Campus[];
  height?: string;
}

const heightClassMap: Record<string, string> = {
  "320px": "h-[320px]",
  "420px": "h-[420px]",
  "520px": "h-[520px]",
};

const CampusMap = ({ campuses, height = "420px" }: Props) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const center: [number, number] = useMemo(() => {
    if (campuses.length === 1) return campuses[0].coords;
    return [40.7128, -74.006];
  }, [campuses]);

  const shellHeightClass = heightClassMap[height] ?? heightClassMap["420px"];

  if (!isMounted) {
    return (
      <div
        className={`rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm relative ${shellHeightClass} bg-slate-100 dark:bg-slate-800 animate-pulse`}
      />
    );
  }

  return (
    <div
      className={`rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm relative ${shellHeightClass}`}
    >
      <MapContainer
        className="h-full w-full"
        center={center}
        zoom={campuses.length === 1 ? 13 : 11}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds campuses={campuses} />
        {campuses.map((c) => (
          <Marker key={c.id} position={c.coords} icon={iconFor(c.type)}>
            <Popup>
              <div className="min-w-50">
                <strong className="text-sm">{c.name}</strong>
                <p className="my-1 text-xs text-slate-600 dark:text-slate-300">
                  {c.type} · {c.borough}
                </p>
                <Link
                  to={`/schools/${c.id}`}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-200"
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
