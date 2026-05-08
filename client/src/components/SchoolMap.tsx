import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from "react-leaflet";
import { LatLngBounds } from "leaflet";
import L from "leaflet";
import type { School } from "../types/school";

interface SchoolMapProps {
  schools: School[];
  selectedSchool: School | null;
  onSchoolClick: (school: School) => void;
}

// Custom icon for markers
const schoolIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3556/3556098.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const selectedIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3556/3556161.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

// Component to handle map bounds
const MapBoundsUpdater: React.FC<{ schools: School[] }> = ({ schools }) => {
  const map = useMap();

  useEffect(() => {
    if (schools.length === 0) return;

    const bounds = new LatLngBounds(schools.map((school) => [school.lat, school.lng]));
    map.fitBounds(bounds, { padding: [100, 100] });
  }, [schools, map]);

  return null;
};

const SchoolMap: React.FC<SchoolMapProps> = ({ schools, selectedSchool, onSchoolClick }) => {
  const defaultCenter: [number, number] = [40.7282, -73.7949]; // Center of NYC

  return (
    <MapContainer
      center={defaultCenter}
      zoom={12}
      className="w-full h-full"
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      <MapBoundsUpdater schools={schools} />

      {schools.map((school) => (
        <React.Fragment key={school.id}>
          <Marker
            position={[school.lat, school.lng]}
            icon={selectedSchool?.id === school.id ? selectedIcon : schoolIcon}
            eventHandlers={{
              click: () => onSchoolClick(school),
            }}
          >
            <Popup>
              <div className="text-center">
                <p className="font-bold text-gray-800">{school.name}</p>
                <p className="text-sm text-gray-600">{school.borough}</p>
              </div>
            </Popup>
          </Marker>

          {/* Highlight circle for selected school */}
          {selectedSchool?.id === school.id && (
            <Circle
              center={[school.lat, school.lng]}
              radius={500}
              pathOptions={{
                color: "rgb(14, 165, 233)",
                fillColor: "rgb(14, 165, 233)",
                fillOpacity: 0.1,
                weight: 2,
              }}
            />
          )}
        </React.Fragment>
      ))}
    </MapContainer>
  );
};

export default SchoolMap;
