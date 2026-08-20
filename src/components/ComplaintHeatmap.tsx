import React, { useState } from 'react';
import { DistrictMetric } from '../types';
import { MapPin, AlertTriangle, CheckCircle2, Layers } from 'lucide-react';

interface DistrictData {
  count: number;
  criticalCount: number;
  resolvedCount: number;
  lat: number;
  lng: number;
}

interface Props {
  districtStats: Record<string, DistrictData>;
  onSelectDistrict?: (district: string) => void;
}

export const ComplaintHeatmap: React.FC<Props> = ({ districtStats, onSelectDistrict }) => {
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);

  const districts = (Object.entries(districtStats || {}) as [string, DistrictData][]).map(([name, data]) => ({
    name,
    count: data.count || 0,
    criticalCount: data.criticalCount || 0,
    resolvedCount: data.resolvedCount || 0,
    lat: data.lat || 0,
    lng: data.lng || 0,
  }));

  const maxCount = Math.max(...districts.map((d) => d.count), 1);

  // Schematic SVG District Coordinate Grid
  const districtMapLayout: Record<string, { cx: number; cy: number; rx: number; ry: number }> = {
    'Downtown': { cx: 250, cy: 110, rx: 70, ry: 45 },
    'North River': { cx: 370, cy: 90, rx: 65, ry: 40 },
    'Central District': { cx: 210, cy: 190, rx: 75, ry: 50 },
    'West Valley': { cx: 100, cy: 140, rx: 65, ry: 45 },
    'Waterfront': { cx: 350, cy: 230, rx: 75, ry: 55 },
    'South Bay': { cx: 230, cy: 300, rx: 70, ry: 45 },
    'Highland Park': { cx: 90, cy: 260, rx: 60, ry: 40 },
    'Twin Peaks': { cx: 120, cy: 350, rx: 55, ry: 35 },
  };

  return (
    <div className="glass-panel p-5 rounded-2xl border border-white/10 relative overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base font-bold text-slate-100">
              Jurisdictional Complaint Density Heatmap
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Geographic incident distribution and priority clusters across municipal sectors
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs text-slate-300 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-white/5">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Low Load
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Moderate
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" /> High / Critical
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* SVG Interactive District Schematic */}
        <div className="lg:col-span-8 relative bg-slate-950/60 rounded-xl p-4 border border-white/5 flex items-center justify-center min-h-[300px]">
          <svg viewBox="0 0 460 400" className="w-full h-full max-h-[360px]">
            {/* Grid overlay lines */}
            <defs>
              <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />
              </pattern>
              <radialGradient id="criticalGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
              </radialGradient>
            </defs>

            <rect width="460" height="400" fill="url(#grid)" />

            {/* Connecting transit arteries */}
            <path
              d="M 100 140 Q 210 190 250 110 T 370 90 M 210 190 L 350 230 M 210 190 L 230 300 M 100 140 L 90 260 L 120 350 L 230 300"
              fill="none"
              stroke="rgba(56, 189, 248, 0.15)"
              strokeWidth="2"
              strokeDasharray="4 4"
            />

            {/* Districts Render */}
            {districts.map((d) => {
              const pos = districtMapLayout[d.name] || { cx: 200, cy: 200, rx: 50, ry: 40 };
              const ratio = d.count / maxCount;
              const hasCritical = d.criticalCount > 0;
              const isHovered = hoveredDistrict === d.name;

              // Color based on critical and density
              let fillColor = 'rgba(16, 185, 129, 0.2)';
              let strokeColor = 'rgba(16, 185, 129, 0.6)';

              if (hasCritical || ratio > 0.6) {
                fillColor = isHovered ? 'rgba(239, 68, 68, 0.5)' : 'rgba(239, 68, 68, 0.25)';
                strokeColor = '#ef4444';
              } else if (ratio > 0.3) {
                fillColor = isHovered ? 'rgba(245, 158, 11, 0.5)' : 'rgba(245, 158, 11, 0.25)';
                strokeColor = '#f59e0b';
              } else if (isHovered) {
                fillColor = 'rgba(56, 189, 248, 0.4)';
                strokeColor = '#38bdf8';
              }

              // Scale bubble radius dynamically
              const radius = Math.max(16, Math.min(36, 14 + (d.count / maxCount) * 22));

              return (
                <g
                  key={d.name}
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setHoveredDistrict(d.name)}
                  onMouseLeave={() => setHoveredDistrict(null)}
                  onClick={() => onSelectDistrict?.(d.name)}
                >
                  {/* District Boundary Zone */}
                  <ellipse
                    cx={pos.cx}
                    cy={pos.cy}
                    rx={pos.rx}
                    ry={pos.ry}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={isHovered ? 2 : 1}
                    className="transition-all duration-300"
                  />

                  {/* Pulsing ring for critical areas */}
                  {hasCritical && (
                    <circle
                      cx={pos.cx}
                      cy={pos.cy}
                      r={radius + 8}
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="1.5"
                      opacity="0.4"
                      className="animate-ping"
                    />
                  )}

                  {/* Center Density Bubble */}
                  <circle
                    cx={pos.cx}
                    cy={pos.cy}
                    r={radius}
                    fill={hasCritical ? '#ef4444' : '#0ea5e9'}
                    opacity={isHovered ? 0.9 : 0.75}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />

                  {/* Count Text */}
                  <text
                    x={pos.cx}
                    y={pos.cy + 4}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="12"
                    fontWeight="bold"
                    fontFamily="'Plus Jakarta Sans', sans-serif"
                  >
                    {d.count}
                  </text>

                  {/* Label Text */}
                  <text
                    x={pos.cx}
                    y={pos.cy + pos.ry - 8}
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="10"
                    fontWeight="600"
                  >
                    {d.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* District Detail Sidebar List */}
        <div className="lg:col-span-4 space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            District Load Ranking
          </p>
          {districts
            .sort((a, b) => b.count - a.count)
            .map((d) => (
              <div
                key={d.name}
                onMouseEnter={() => setHoveredDistrict(d.name)}
                onMouseLeave={() => setHoveredDistrict(null)}
                onClick={() => onSelectDistrict?.(d.name)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  hoveredDistrict === d.name
                    ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-200'
                    : 'bg-slate-900/60 border-white/5 hover:border-white/20 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <div>
                    <h5 className="text-xs font-bold leading-tight text-slate-100">
                      {d.name}
                    </h5>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                      <span className="text-red-400 flex items-center gap-0.5">
                        <AlertTriangle className="w-2.5 h-2.5" /> {d.criticalCount} Critical
                      </span>
                      <span className="text-emerald-400 flex items-center gap-0.5">
                        <CheckCircle2 className="w-2.5 h-2.5" /> {d.resolvedCount} Done
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-extrabold font-mono text-slate-100">
                    {d.count}
                  </span>
                  <span className="block text-[9px] text-slate-400">Total</span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
