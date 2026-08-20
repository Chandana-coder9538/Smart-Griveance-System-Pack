import React from 'react';
import { Camera, Cpu, Truck, CheckCircle2, ArrowRight, ShieldCheck, Sparkles, Navigation } from 'lucide-react';

export const CitizenStoryShowcase: React.FC = () => {
  const steps = [
    {
      stepNumber: '01',
      title: 'Citizen Instant Report',
      description:
        'Citizens capture or upload photos of public hazards (potholes, water leaks, dark streets). Auto-tags GPS coordinates and neighborhood boundaries.',
      icon: Camera,
      tag: 'Step 1: Input',
      gradient: 'from-blue-500/20 to-cyan-500/10',
      border: 'border-cyan-500/30',
      badge: 'Auto-GPS Tagged',
    },
    {
      stepNumber: '02',
      title: 'Gemini AI Deep Triage',
      description:
        'Google Gemini 3.7 Flash analyzes severity, grades urgency (1-5), scores sentiment, calculates SLA resolution days, and routes directly to the competent department.',
      icon: Cpu,
      tag: 'Step 2: AI Neural Core',
      gradient: 'from-purple-500/20 to-indigo-500/10',
      border: 'border-purple-500/30',
      badge: 'Zero Transfer Failures',
    },
    {
      stepNumber: '03',
      title: 'Field Crew On-Site Dispatch',
      description:
        'The assigned department depot (e.g. Roads Dept, Water Board) receives high-priority work orders with full diagnostic context and dispatches active paving/repair teams.',
      icon: Truck,
      tag: 'Step 3: Action',
      gradient: 'from-amber-500/20 to-orange-500/10',
      border: 'border-amber-500/30',
      badge: 'SLA Tracked',
    },
    {
      stepNumber: '04',
      title: 'Verified Resolution & Alert',
      description:
        'Field work is inspected, resolved, and verified. Citizens receive instant notification with before/after records and neighborhood roads are restored safely.',
      icon: CheckCircle2,
      tag: 'Step 4: Redressal',
      gradient: 'from-emerald-500/20 to-teal-500/10',
      border: 'border-emerald-500/30',
      badge: '100% Transparent',
    },
  ];

  return (
    <div className="w-full py-8">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          End-to-End Redressal Lifecycle
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-['Outfit',sans-serif]">
          How SPGPS Resolves Civic Grievances
        </h2>
        <p className="text-sm text-slate-400 mt-2">
          Transforming frustrating phone-tag and bureaucratic delays into autonomous, AI-driven municipal action
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={s.stepNumber}
              className={`p-6 rounded-2xl bg-gradient-to-b ${s.gradient} border ${s.border} backdrop-blur-xl relative flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl`}
            >
              {/* Header */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-900/80 border border-white/10 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-extrabold font-mono text-slate-600 group-hover:text-slate-400 transition-colors">
                    {s.stepNumber}
                  </span>
                </div>

                <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider block mb-1">
                  {s.tag}
                </span>

                <h4 className="text-lg font-bold text-slate-100 mb-2 leading-snug">
                  {s.title}
                </h4>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {s.description}
                </p>
              </div>

              {/* Bottom tag */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="px-2 py-0.5 rounded bg-black/40 text-slate-300 font-mono text-[10px]">
                  {s.badge}
                </span>
                {idx < 3 && (
                  <ArrowRight className="w-4 h-4 text-slate-500 hidden lg:block" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
