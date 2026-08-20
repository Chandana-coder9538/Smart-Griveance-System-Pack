import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { ExternalLink, Navigation, MapPin, Building2 } from 'lucide-react';
import { Department } from '../types';

interface Props {
  complaintLat?: number;
  complaintLng?: number;
  complaintTitle?: string;
  complaintLocation?: string;
  department?: Department | null;
  departmentName?: string;
  height?: string;
}

// Custom Leaflet Pin Icons
const complaintIcon = L.divIcon({
  className: 'custom-map-marker',
  html: `<div style="background-color: #ef4444; width: 30px; height: 30px; border-radius: 50%; border: 3px solid #ffffff; box-shadow: 0 0 15px rgba(239,68,68,0.8); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 13px;">📍</div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -15],
});

const depotIcon = L.divIcon({
  className: 'custom-map-marker',
  html: `<div style="background-color: #0ea5e9; width: 30px; height: 30px; border-radius: 50%; border: 3px solid #ffffff; box-shadow: 0 0 15px rgba(14,165,233,0.8); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 13px;">🏢</div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -15],
});

export const DepartmentMap: React.FC<Props> = ({
  complaintLat = 37.7749,
  complaintLng = -122.4194,
  complaintTitle = 'Incident Location',
  complaintLocation = 'City Coordinates',
  department,
  departmentName = 'Municipal Department',
  height = '320px',
}) => {
  const deptLat = department?.latitude || complaintLat + 0.008;
  const deptLng = department?.longitude || complaintLng + 0.009;

  const centerLat = (complaintLat + deptLat) / 2;
  const centerLng = (complaintLng + deptLng) / 2;

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${deptLat},${deptLng}&destination=${complaintLat},${complaintLng}`;

  return (
    <div className="w-full rounded-xl overflow-hidden border border-white/10 glass-panel relative">
      {/* Top Header info bar */}
      <div className="p-3 bg-slate-900/90 border-b border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="font-semibold text-slate-200">
            Dispatch Geo-Routing & Depot Proximity
          </span>
        </div>
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
        >
          <span>Open in Google Maps</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Map view */}
      <div style={{ height }} className="w-full relative z-0">
        <MapContainer
          center={[centerLat, centerLng]}
          zoom={13}
          scrollWheelZoom={false}
          className="w-full h-full"
        >
          {/* High-contrast dark CartoDB tiles */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />

          {/* Incident Pin */}
          <Marker position={[complaintLat, complaintLng]} icon={complaintIcon}>
            <Popup>
              <div className="text-xs p-1">
                <div className="flex items-center gap-1 font-bold text-red-400 mb-0.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Grievance Site</span>
                </div>
                <p className="font-semibold text-slate-100">{complaintTitle}</p>
                <p className="text-slate-400 text-[11px] mt-0.5">{complaintLocation}</p>
              </div>
            </Popup>
          </Marker>

          {/* Department Depot Pin */}
          <Marker position={[deptLat, deptLng]} icon={depotIcon}>
            <Popup>
              <div className="text-xs p-1">
                <div className="flex items-center gap-1 font-bold text-cyan-400 mb-0.5">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Assigned Jurisdiction</span>
                </div>
                <p className="font-semibold text-slate-100">
                  {department?.name || departmentName}
                </p>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  {department?.address || 'Municipal Operations Facility'}
                </p>
              </div>
            </Popup>
          </Marker>

          {/* Dispatch route line */}
          <Polyline
            positions={[
              [deptLat, deptLng],
              [centerLat + 0.002, centerLng - 0.001],
              [complaintLat, complaintLng],
            ]}
            color="#38bdf8"
            weight={3}
            dashArray="6, 8"
            opacity={0.8}
          />
        </MapContainer>
      </div>

      {/* Bottom status badge */}
      <div className="px-3 py-2 bg-slate-900/80 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> Incident
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-sky-500 inline-block" /> Municipal Depot
          </span>
        </div>
        <span className="font-mono text-cyan-400">
          Estimated Transit Time: ~12 mins
        </span>
      </div>
    </div>
  );
};
