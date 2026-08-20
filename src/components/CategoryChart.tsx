import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';

interface Props {
  categoryCounts: Record<string, number>;
}

const CATEGORY_COLORS: Record<string, string> = {
  roads: '#38bdf8', // sky
  water: '#0284c7', // blue
  drainage: '#06b6d4', // cyan
  electricity: '#f59e0b', // amber
  streetlights: '#fbbf24', // yellow
  sanitation: '#10b981', // emerald
  parks: '#22c55e', // green
  housing: '#8b5cf6', // purple
  healthcare: '#ec4899', // pink
  education: '#6366f1', // indigo
  transport: '#14b8a6', // teal
  other: '#64748b', // slate
};

export const CategoryChart: React.FC<Props> = ({ categoryCounts }) => {
  const data = Object.entries(categoryCounts)
    .map(([category, count]) => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      value: Number(count) || 0,
      key: category,
      color: CATEGORY_COLORS[category] || '#64748b',
    }))
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value);

  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-2">
        <PieIcon className="w-4 h-4 text-cyan-400" />
        <h3 className="text-base font-bold text-slate-100">Category Distribution</h3>
      </div>
      <p className="text-xs text-slate-400 mb-4">
        AI auto-categorization breakdown across 12 municipal domains
      </p>

      <div className="h-64 w-full relative flex items-center justify-center">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    const percent = total > 0 ? ((d.value / total) * 100).toFixed(1) : 0;
                    return (
                      <div className="bg-slate-900 border border-white/10 p-2.5 rounded-lg shadow-xl text-xs">
                        <p className="font-bold text-slate-100 flex items-center gap-1.5">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: d.color }}
                          />
                          {d.name}
                        </p>
                        <p className="text-slate-300 mt-1">
                          Complaints: <span className="font-mono font-bold text-cyan-400">{d.value}</span> ({percent}%)
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-xs text-slate-500">No category data recorded</div>
        )}

        {/* Center Total Count label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-extrabold font-mono text-slate-100">{total}</span>
          <span className="text-[10px] uppercase tracking-wider text-slate-400">Total</span>
        </div>
      </div>

      {/* Mini Legend List */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-3 border-t border-white/5 text-xs mt-auto">
        {data.slice(0, 6).map((item) => (
          <div key={item.key} className="flex items-center gap-1.5 text-slate-300">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="truncate text-slate-300 text-[11px]">{item.name}</span>
            <span className="font-mono text-slate-400 ml-auto text-[11px]">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
