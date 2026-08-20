import React from 'react';
import { Phone, Mail, UserCheck, ShieldCheck, AlertTriangle } from 'lucide-react';

interface Props {
  officerName: string | null;
  officerPhone: string | null;
  officerEmail: string | null;
  department: string;
  isOverdue?: boolean;
}

export const OfficerContact: React.FC<Props> = ({
  officerName,
  officerPhone,
  officerEmail,
  department,
  isOverdue = false,
}) => {
  const name = officerName || 'Duty Dispatch Officer';
  const phone = officerPhone || '+1 (555) 234-7890';
  const email = officerEmail || 'grievance.support@city.gov';

  return (
    <div
      className={`p-4 rounded-xl transition-all duration-300 ${
        isOverdue
          ? 'bg-rose-950/40 border border-rose-500/40 text-rose-100 shadow-[0_0_20px_rgba(244,63,94,0.15)]'
          : 'glass-card border border-white/10 text-slate-200'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
              isOverdue
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50'
                : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
            }`}
          >
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-sm leading-tight flex items-center gap-1.5">
              {name}
              {isOverdue && (
                <span className="px-1.5 py-0.5 text-[10px] bg-rose-500/30 border border-rose-400/50 text-rose-300 rounded font-mono font-normal">
                  SLA ALERT
                </span>
              )}
            </h4>
            <p className="text-xs text-slate-400">{department}</p>
          </div>
        </div>

        <span
          className={`text-[11px] px-2 py-0.5 rounded-md font-mono ${
            isOverdue
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              : 'bg-slate-800 text-slate-300 border border-white/5'
          }`}
        >
          Primary Assignee
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-white/5">
        <a
          href={`tel:${phone}`}
          className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
            isOverdue
              ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-[0_0_12px_rgba(244,63,94,0.3)]'
              : 'bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30'
          }`}
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Call: {phone}</span>
        </a>

        <a
          href={`mailto:${email}?subject=Inquiry regarding Grievance&body=Hello ${name},`}
          className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-white/10 transition-all"
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Email Officer</span>
        </a>
      </div>
    </div>
  );
};
