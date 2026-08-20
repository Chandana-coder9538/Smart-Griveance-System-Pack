import React from 'react';
import { Flame, AlertOctagon, ShieldAlert, Info, BarChart2 } from 'lucide-react';

interface Props {
  urgencyCounts: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

export const UrgencyBreakdown: React.FC<Props> = ({ urgencyCounts }) => {
  const total =
    (urgencyCounts.critical || 0) +
    (urgencyCounts.high || 0) +
    (urgencyCounts.medium || 0) +
    (urgencyCounts.low || 0) || 1;

  const tiers = [
    {
      key: 'critical',
      label: 'Critical (Score 5)',
      count: urgencyCounts.critical || 0,
      color: 'bg-red-500',
      textColor: 'text-red-400',
      borderColor: 'border-red-500/30',
      bgLight: 'bg-red-500/10',
      icon: Flame,
      slaTarget: '< 24 Hours',
    },
    {
      key: 'high',
      label: 'High (Score 4)',
      count: urgencyCounts.high || 0,
      color: 'bg-orange-500',
      textColor: 'text-orange-400',
      borderColor: 'border-orange-500/30',
      bgLight: 'bg-orange-500/10',
      icon: AlertOctagon,
      slaTarget: '1 - 2 Days',
    },
    {
      key: 'medium',
      label: 'Medium (Score 3)',
      count: urgencyCounts.medium || 0,
      color: 'bg-amber-500',
      textColor: 'text-amber-400',
      borderColor: 'border-amber-500/30',
      bgLight: 'bg-amber-500/10',
      icon: ShieldAlert,
      slaTarget: '2 - 3 Days',
    },
    {
      key: 'low',
      label: 'Low (Score 1-2)',
      count: urgencyCounts.low || 0,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/30',
      bgLight: 'bg-emerald-500/10',
      icon: Info,
      slaTarget: '3 - 5 Days',
    },
  ];

  return (
    <div className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-cyan-400" />
          <h3 className="text-base font-bold text-slate-100">AI Priority Urgency Tiers</h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">Total: {total}</span>
      </div>
      <p className="text-xs text-slate-400 mb-4">
        AI neural scoring distribution based on safety risk and citizen distress
      </p>

      {/* Multi-segmented Horizontal Progress Bar */}
      <div className="w-full h-3.5 bg-slate-900 rounded-full overflow-hidden flex p-0.5 border border-white/5 mb-5 shadow-inner">
        {tiers.map((t) => {
          const pct = ((t.count / total) * 100);
          if (pct === 0) return null;
          return (
            <div
              key={t.key}
              style={{ width: `${pct}%` }}
              className={`${t.color} h-full first:rounded-l-full last:rounded-r-full transition-all duration-500`}
              title={`${t.label}: ${t.count} (${pct.toFixed(1)}%)`}
            />
          );
        })}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mt-auto">
        {tiers.map((t) => {
          const Icon = t.icon;
          const pct = ((t.count / total) * 100).toFixed(1);
          return (
            <div
              key={t.key}
              className={`p-3 rounded-xl border ${t.borderColor} ${t.bgLight} flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Icon className={`w-3.5 h-3.5 ${t.textColor}`} />
                  <span className="text-xs font-semibold text-slate-200">
                    {t.key.toUpperCase()}
                  </span>
                </div>
                <span className={`text-base font-extrabold font-mono ${t.textColor}`}>
                  {t.count}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-1.5 border-t border-white/5">
                <span>{pct}% of queue</span>
                <span className="font-mono text-slate-300 text-[10px]">{t.slaTarget}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
