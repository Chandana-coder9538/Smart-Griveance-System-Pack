import React from 'react';
import { UrgencyLevel } from '../types';
import { Flame, AlertOctagon, Info, ShieldAlert } from 'lucide-react';

interface Props {
  level: UrgencyLevel;
  score?: number;
  showScore?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const UrgencyBadge: React.FC<Props> = ({
  level,
  score,
  showScore = true,
  size = 'md',
}) => {
  const config = {
    critical: {
      label: 'Critical Priority',
      bg: 'bg-red-500/20',
      text: 'text-red-300',
      border: 'border-red-500/50',
      icon: Flame,
      glow: 'animate-pulse-glow',
      bar: 'bg-red-500',
    },
    high: {
      label: 'High Priority',
      bg: 'bg-orange-500/20',
      text: 'text-orange-300',
      border: 'border-orange-500/40',
      icon: AlertOctagon,
      glow: '',
      bar: 'bg-orange-500',
    },
    medium: {
      label: 'Medium Priority',
      bg: 'bg-amber-500/15',
      text: 'text-amber-300',
      border: 'border-amber-500/30',
      icon: ShieldAlert,
      glow: '',
      bar: 'bg-amber-500',
    },
    low: {
      label: 'Low Priority',
      bg: 'bg-emerald-500/15',
      text: 'text-emerald-300',
      border: 'border-emerald-500/30',
      icon: Info,
      glow: '',
      bar: 'bg-emerald-500',
    },
  }[level] || {
    label: 'Standard',
    bg: 'bg-slate-500/15',
    text: 'text-slate-300',
    border: 'border-slate-500/30',
    icon: Info,
    glow: '',
    bar: 'bg-slate-500',
  };

  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs md:text-sm px-2.5 py-1 gap-1.5',
    lg: 'text-sm md:text-base px-3 py-1.5 gap-2',
  };

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border ${config.bg} ${config.text} ${config.border} ${config.glow} ${sizeClasses[size]}`}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span className="whitespace-nowrap">{config.label}</span>
      {showScore && score !== undefined && (
        <span className="ml-0.5 px-1.5 py-0.2 text-[10px] bg-black/40 rounded-full font-mono text-white/90">
          {score}/5
        </span>
      )}
    </span>
  );
};
