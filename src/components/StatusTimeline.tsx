import React from 'react';
import { ComplaintStatus } from '../types';
import { Check, Clock, AlertCircle, Sparkles, UserCheck, Wrench, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';

interface Props {
  status: ComplaintStatus;
  createdAt: string;
  updatedAt?: string;
  actualResolutionDate?: string | null;
  predictedDays?: number;
  isOverdue?: boolean;
}

export const StatusTimeline: React.FC<Props> = ({
  status,
  createdAt,
  updatedAt,
  actualResolutionDate,
  predictedDays = 3,
  isOverdue = false,
}) => {
  const steps = [
    {
      id: 'submitted',
      label: 'Submitted',
      subtext: 'AI Triaged & Graded',
      icon: Sparkles,
      order: 1,
    },
    {
      id: 'under_review',
      label: 'Under Review',
      subtext: 'Jurisdiction Validated',
      icon: Clock,
      order: 2,
    },
    {
      id: 'assigned',
      label: 'Assigned',
      subtext: 'Field Officer Allocated',
      icon: UserCheck,
      order: 3,
    },
    {
      id: 'in_progress',
      label: 'In Progress',
      subtext: 'Crew Dispatched',
      icon: Wrench,
      order: 4,
    },
    {
      id: 'resolved',
      label: 'Resolved',
      subtext: 'Work Verified',
      icon: CheckCircle2,
      order: 5,
    },
  ];

  // Map status to step index (1-based)
  const getStepLevel = (s: ComplaintStatus): number => {
    switch (s) {
      case 'submitted':
        return 1;
      case 'under_review':
        return 2;
      case 'assigned':
        return 3;
      case 'in_progress':
      case 'escalated':
        return 4;
      case 'resolved':
      case 'closed':
        return 5;
      default:
        return 1;
    }
  };

  const currentLevel = getStepLevel(status);

  return (
    <div className="w-full py-4 px-2">
      {/* Desktop/Tablet Horizontal Timeline */}
      <div className="relative">
        {/* Background track line */}
        <div className="absolute top-5 left-8 right-8 h-1 bg-slate-800 rounded-full hidden sm:block">
          {/* Active progress fill */}
          <div
            className={`h-full transition-all duration-700 rounded-full ${
              isOverdue ? 'bg-gradient-to-r from-cyan-500 via-amber-500 to-rose-500' : 'bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-500'
            }`}
            style={{
              width: `${Math.max(0, ((currentLevel - 1) / (steps.length - 1)) * 100)}%`,
            }}
          />
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 sm:gap-2">
          {steps.map((step) => {
            const isCompleted = step.order < currentLevel || (step.order === 5 && currentLevel === 5);
            const isCurrent = step.order === currentLevel && currentLevel !== 5;
            const isUpcoming = step.order > currentLevel;
            const StepIcon = step.icon;

            return (
              <div
                key={step.id}
                className="flex sm:flex-col items-center sm:items-center text-left sm:text-center relative gap-3 sm:gap-1.5"
              >
                {/* Step Circle */}
                <div
                  className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    isCompleted
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                      : isCurrent
                      ? isOverdue
                        ? 'bg-rose-500/20 border-rose-400 text-rose-300 animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                        : 'bg-cyan-500/20 border-cyan-400 text-cyan-300 ring-4 ring-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                      : 'bg-slate-900 border-slate-700 text-slate-500'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 stroke-[2.5]" />
                  ) : (
                    <StepIcon className="w-4 h-4" />
                  )}

                  {/* Active ping ring */}
                  {isCurrent && (
                    <span className="absolute -inset-1 rounded-full border border-cyan-400/50 animate-ping" />
                  )}
                </div>

                {/* Step Labels */}
                <div className="flex flex-col">
                  <span
                    className={`text-xs sm:text-sm font-semibold ${
                      isCompleted
                        ? 'text-slate-200'
                        : isCurrent
                        ? 'text-cyan-400'
                        : 'text-slate-500'
                    }`}
                  >
                    {step.label}
                  </span>
                  <span className="text-[11px] text-slate-400 leading-tight">
                    {step.subtext}
                  </span>

                  {/* Context timestamp if relevant */}
                  {step.order === 1 && createdAt && (
                    <span className="text-[10px] text-slate-500 font-mono mt-0.5">
                      {format(new Date(createdAt), 'MMM d, HH:mm')}
                    </span>
                  )}
                  {step.order === 5 && actualResolutionDate && (
                    <span className="text-[10px] text-emerald-400 font-mono mt-0.5 font-medium">
                      {format(new Date(actualResolutionDate), 'MMM d, HH:mm')}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Overdue / SLA warning tag */}
      {isOverdue && status !== 'resolved' && status !== 'closed' && (
        <div className="mt-4 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 animate-bounce" />
          <span>
            <strong>Resolution Overdue:</strong> Target SLA ({predictedDays} days) has expired. Escalated to central municipal monitoring.
          </span>
        </div>
      )}
    </div>
  );
};
