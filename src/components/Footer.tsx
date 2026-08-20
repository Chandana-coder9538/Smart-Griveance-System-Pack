import React from 'react';
import { ShieldCheck, PhoneCall, Clock, CheckCircle2, Sparkles, Building } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full mt-auto glass-panel border-t border-white/10 py-10 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Col 1 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-600 flex items-center justify-center text-white">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-sm text-slate-100 font-['Outfit',sans-serif]">
              SPGPS
            </span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            Smart Public Grievance Prioritization System powered by Google Gemini 3.7 Flash autonomous neural classification.
          </p>
          <div className="flex items-center gap-2 text-[11px] text-cyan-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>AI Neural Triage Online (24/7)</span>
          </div>
        </div>

        {/* Col 2 */}
        <div>
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-200 mb-3">
            Emergency Hotlines
          </h4>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-slate-300">
              <PhoneCall className="w-3.5 h-3.5 text-red-400" />
              <span>Live Wire / Gas Hazard: <strong>911 / 1912</strong></span>
            </li>
            <li className="flex items-center gap-2 text-slate-300">
              <PhoneCall className="w-3.5 h-3.5 text-blue-400" />
              <span>Water Main Burst: <strong>1916</strong></span>
            </li>
            <li className="flex items-center gap-2 text-slate-300">
              <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
              <span>Road Sinkhole Dispatch: <strong>1800-RDS-FIX</strong></span>
            </li>
          </ul>
        </div>

        {/* Col 3 */}
        <div>
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-200 mb-3">
            SLA Commitments
          </h4>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-rose-400" />
              <span>Critical Urgency (5/5): <strong>&lt; 24 Hours</strong></span>
            </li>
            <li className="flex items-center gap-2 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>High Urgency (4/5): <strong>48 Hours</strong></span>
            </li>
            <li className="flex items-center gap-2 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Standard Maintenance: <strong>3 - 5 Days</strong></span>
            </li>
          </ul>
        </div>

        {/* Col 4 */}
        <div>
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-200 mb-3">
            Municipal Integrity
          </h4>
          <p className="text-slate-400 text-xs leading-relaxed mb-2">
            Automated tamper-evident status logs, open citizen tracking, and SLA escalation guarantees.
          </p>
          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-white/5 flex items-center gap-2 text-[11px] text-slate-300">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>96.4% AI classification precision on latest 10,000+ public reports.</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
        <p>© 2026 SPGPS Municipal Corporation. All citizen rights reserved.</p>
        <p className="font-mono">GovTech Civic Intelligence Platform</p>
      </div>
    </footer>
  );
};
