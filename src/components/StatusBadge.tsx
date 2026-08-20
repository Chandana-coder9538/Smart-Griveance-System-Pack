import React from 'react';
import { ComplaintStatus } from '../types';
import {
  FileText,
  Search,
  UserCheck,
  Wrench,
  CheckCircle2,
  Lock,
  AlertTriangle,
} from 'lucide-react';

interface Props {
  status: ComplaintStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<Props> = ({ status, size = 'md' }) => {
  const configMap: Record<
    ComplaintStatus,
    { label: string; bg: string; text: string; border: string; icon: any }
  > = {
    submitted: {
      label: 'Submitted',
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
      border: 'border-blue-500/30',
      icon: FileText,
    },
    under_review: {
      label: 'Under Review',
      bg: 'bg-purple-500/10',
      text: 'text-purple-400',
      border: 'border-purple-500/30',
      icon: Search,
    },
    assigned: {
      label: 'Officer Assigned',
      bg: 'bg-indigo-500/10',
      text: 'text-indigo-400',
      border: 'border-indigo-500/30',
      icon: UserCheck,
    },
    in_progress: {
      label: 'In Progress (Crew On-Site)',
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      border: 'border-amber-500/30',
      icon: Wrench,
    },
    resolved: {
      label: 'Resolved & Verified',
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      border: 'border-emerald-500/30',
      icon: CheckCircle2,
    },
    closed: {
      label: 'Archived / Closed',
      bg: 'bg-slate-500/10',
      text: 'text-slate-400',
      border: 'border-slate-500/30',
      icon: Lock,
    },
    escalated: {
      label: 'Escalated (SLA Alert)',
      bg: 'bg-rose-500/15',
      text: 'text-rose-400',
      border: 'border-rose-500/40',
      icon: AlertTriangle,
    },
  };

  const conf = configMap[status] || configMap.submitted;
  const Icon = conf.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs md:text-sm px-2.5 py-1 gap-1.5',
    lg: 'text-sm md:text-base px-3.5 py-1.5 gap-2',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${conf.bg} ${conf.text} ${conf.border} ${sizeClasses[size]}`}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
      <span className="whitespace-nowrap">{conf.label}</span>
      {status === 'escalated' && (
        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
      )}
    </span>
  );
};
