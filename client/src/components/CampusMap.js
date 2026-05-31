import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Link } from "react-router-dom";
// Fix default marker icon paths under Vite bundling
const colorIcon = (color) =>
  L.divIcon({
    className: "cuny-marker",
    html: `<span style="background:${color};box-shadow:0 0 0 3px white,0 4px 14px rgba(0,0,0,0.3);width:16px;height:16px;display:block;border-radius:50%;"></span>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
const typeColor = {
  "Senior College": "#2563eb",
  "Community College": "#10b981",
  "Graduate / Professional": "#a855f7",
};
const FitBounds = ({ campuses }) => {
  const map = useMap();
  useEffect(() => {
    if (!campuses.length) return;
    try {
      const bounds = L.latLngBounds(campuses.map((c) => c.coords));
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
      }
    } catch {
      /* ignore — fall back to default view */
    }
  }, [campuses, map]);
  return null;
};
const heightClassMap = {
  "320px": "h-[320px]",
  "420px": "h-[420px]",
  "520px": "h-[520px]",
};
const CampusMap = ({ campuses, height = "420px" }) => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  const center = useMemo(() => {
    if (campuses.length === 1) return campuses[0].coords;
    return [40.7128, -74.006];
  }, [campuses]);
  const shellHeightClass = heightClassMap[height] ?? heightClassMap["420px"];
  if (!isMounted) {
    return _jsx("div", {
      className: `rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm relative ${shellHeightClass} bg-slate-100 dark:bg-slate-800 animate-pulse`,
    });
  }
  return _jsx("div", {
    className: `rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm relative ${shellHeightClass}`,
    children: _jsxs(MapContainer, {
      className: "h-full w-full",
      center: center,
      zoom: campuses.length === 1 ? 13 : 11,
      scrollWheelZoom: false,
      children: [
        _jsx(TileLayer, {
          attribution:
            '\u00A9 <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        }),
        _jsx(FitBounds, { campuses: campuses }),
        campuses.map((c) =>
          _jsx(
            Marker,
            {
              position: c.coords,
              icon: colorIcon(typeColor[c.type]),
              children: _jsx(Popup, {
                children: _jsxs("div", {
                  className: "min-w-[200px]",
                  children: [
                    _jsx("strong", { className: "text-sm", children: c.name }),
                    _jsxs("p", {
                      className: "my-1 text-xs text-slate-600 dark:text-slate-300",
                      children: [c.type, " \u00B7 ", c.borough],
                    }),
                    _jsx(Link, {
                      to: `/schools/${c.id}`,
                      className:
                        "text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-200",
                      children: "View details \u2192",
                    }),
                  ],
                }),
              }),
            },
            c.id
          )
        ),
      ],
    }),
  });
};
export default CampusMap;
