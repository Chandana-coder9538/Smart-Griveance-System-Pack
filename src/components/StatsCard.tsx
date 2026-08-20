import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface Props {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: 'blue' | 'emerald' | 'amber' | 'rose' | 'purple' | 'cyan';
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  onClick?: () => void;
}

export const StatsCard: React.FC<Props> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'blue',
  trend,
  onClick,
}) => {
  const colorStyles = {
    blue: {
      bg: 'from-blue-500/10 to-indigo-500/5',
      border: 'border-blue-500/30',
      iconBg: 'bg-blue-500/20 text-blue-400',
      glow: 'group-hover:border-blue-500/60',
    },
    emerald: {
      bg: 'from-emerald-500/10 to-teal-500/5',
      border: 'border-emerald-500/30',
      iconBg: 'bg-emerald-500/20 text-emerald-400',
      glow: 'group-hover:border-emerald-500/60',
    },
    amber: {
      bg: 'from-amber-500/10 to-yellow-500/5',
      border: 'border-amber-500/30',
      iconBg: 'bg-amber-500/20 text-amber-400',
      glow: 'group-hover:border-amber-500/60',
    },
    rose: {
      bg: 'from-rose-500/15 to-red-500/5',
      border: 'border-rose-500/40',
      iconBg: 'bg-rose-500/25 text-rose-400',
      glow: 'group-hover:border-rose-500/70',
    },
    purple: {
      bg: 'from-purple-500/10 to-violet-500/5',
      border: 'border-purple-500/30',
      iconBg: 'bg-purple-500/20 text-purple-400',
      glow: 'group-hover:border-purple-500/60',
    },
    cyan: {
      bg: 'from-cyan-500/10 to-sky-500/5',
      border: 'border-cyan-500/30',
      iconBg: 'bg-cyan-500/20 text-cyan-400',
      glow: 'group-hover:border-cyan-500/60',
    },
  }[color];

  return (
    <div
      onClick={onClick}
      className={`group relative p-5 rounded-2xl bg-gradient-to-br ${colorStyles.bg} border ${colorStyles.border} ${colorStyles.glow} backdrop-blur-xl transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:-translate-y-1 hover:shadow-xl' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {title}
          </p>
          <h3 className="text-2xl sm:text-3xl font-extrabold font-['Outfit',sans-serif] text-slate-100 mt-1">
            {value}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorStyles.iconBg} shadow-inner transition-transform duration-300 group-hover:scale-110`}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>

      {trend && (
        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-white/5 text-xs">
          {trend.isPositive ? (
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
          )}
          <span
            className={trend.isPositive ? 'text-emerald-400 font-medium' : 'text-rose-400 font-medium'}
          >
            {trend.value}
          </span>
          <span className="text-slate-400">vs last period</span>
        </div>
      )}
    </div>
  );
};
