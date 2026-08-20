import React, { useState } from 'react';
import { CitizenStoryShowcase } from '../components/CitizenStoryShowcase';
import { UserRole } from '../types';
import {
  PlusCircle,
  Search,
  Cpu,
  Layers,
  Clock,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Sparkles,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
} from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  onNavigate: (path: string) => void;
  userRole: UserRole;
  userName: string;
}

export const HomePage: React.FC<Props> = ({ onNavigate, userRole, userName }) => {
  const [quickTrackId, setQuickTrackId] = useState('');

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTrackId.trim()) {
      toast.error('Please enter a valid tracking ID (e.g. GRV-...)');
      return;
    }
    const cleanId = quickTrackId.trim().toUpperCase();
    onNavigate(`/track?id=${encodeURIComponent(cleanId)}`);
  };

  const featureCards = [
    {
      title: 'Gemini 3.7 AI Classification',
      description:
        'Analyzes complaint descriptions in natural language, automatically tags 12 municipal departments, grades severity (1-5), and assesses citizen distress.',
      icon: Cpu,
      color: 'from-blue-500/20 to-cyan-500/10',
      border: 'border-cyan-500/30',
      badge: 'Zero-Touch Triage',
    },
    {
      title: 'Dynamic Geo-Routing',
      description:
        'Maps incident coordinates directly to the nearest municipal maintenance depot with real-time transit calculation and OpenStreetMap overlays.',
      icon: MapPin,
      color: 'from-purple-500/20 to-indigo-500/10',
      border: 'border-purple-500/30',
      badge: 'GIS Integrated',
    },
    {
      title: 'Predictive SLA Engine',
      description:
        'Predicts resolution deadlines based on historical data, weather, and department backlog. Flags automatic escalation warnings when overdue.',
      icon: Clock,
      color: 'from-amber-500/20 to-orange-500/10',
      border: 'border-amber-500/30',
      badge: 'Anti-Overdue Protection',
    },
    {
      title: 'Transparent Citizen Oversight',
      description:
        '5-step real-time progress tracker, direct officer contacts, and photo verification ensure complete accountability from report to repair.',
      icon: ShieldCheck,
      color: 'from-emerald-500/20 to-teal-500/10',
      border: 'border-emerald-500/30',
      badge: '100% Verifiable',
    },
  ];

  return (
    <div className="w-full space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative pt-6 pb-10 text-center max-w-4xl mx-auto px-4">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold backdrop-blur-md mb-4 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Generation Municipal Grievance Automation</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-cyan-200 tracking-tight font-['Outfit',sans-serif] leading-tight">
          Smart Public Grievance Prioritization System
        </h1>

        <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto mt-4 leading-relaxed">
          Report municipal issues in seconds. Our autonomous Gemini AI classifies severity, routes to the right repair crews, and tracks progress with transparent accountability.
        </p>

        {/* Primary CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
          <button
            onClick={() => onNavigate('/submit')}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm flex items-center gap-2.5 shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Submit a Grievance</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigate('/track')}
            className="px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-semibold text-sm flex items-center gap-2.5 border border-white/15 hover:border-cyan-400/50 hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            <Search className="w-5 h-5 text-cyan-400" />
            <span>Track by Grievance ID</span>
          </button>

          {userRole === 'admin' && (
            <button
              onClick={() => onNavigate('/dashboard')}
              className="px-6 py-3.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 font-semibold text-sm flex items-center gap-2.5 border border-purple-500/40 hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <Layers className="w-5 h-5 text-purple-400" />
              <span>Admin Command Center</span>
            </button>
          )}
        </div>

        {/* Quick Search Widget Bar */}
        <div className="mt-10 max-w-lg mx-auto">
          <form
            onSubmit={handleTrackSubmit}
            className="glass-panel p-2 rounded-2xl border border-white/10 flex items-center gap-2 shadow-2xl"
          >
            <Search className="w-5 h-5 text-slate-400 ml-2 shrink-0" />
            <input
              type="text"
              value={quickTrackId}
              onChange={(e) => setQuickTrackId(e.target.value)}
              placeholder="Enter Grievance Tracking ID (e.g. GRV-1001)..."
              className="w-full bg-transparent border-none text-slate-100 text-xs sm:text-sm placeholder-slate-500 focus:outline-none px-2"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shrink-0 transition-colors cursor-pointer"
            >
              Track Now
            </button>
          </form>
        </div>
      </section>

      {/* Live Stats Strip */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-white/10 text-center">
            <span className="text-2xl sm:text-3xl font-extrabold font-['Outfit',sans-serif] text-cyan-400 font-mono block">
              10,480+
            </span>
            <span className="text-xs font-semibold text-slate-300 block mt-1">
              Grievances Resolved
            </span>
            <span className="text-[10px] text-slate-500">Across 8 city districts</span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/10 text-center">
            <span className="text-2xl sm:text-3xl font-extrabold font-['Outfit',sans-serif] text-emerald-400 font-mono block">
              96.4%
            </span>
            <span className="text-xs font-semibold text-slate-300 block mt-1">
              AI Triage Accuracy
            </span>
            <span className="text-[10px] text-slate-500">Gemini 3.7 Flash validated</span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/10 text-center">
            <span className="text-2xl sm:text-3xl font-extrabold font-['Outfit',sans-serif] text-amber-400 font-mono block">
              1.8 Days
            </span>
            <span className="text-xs font-semibold text-slate-300 block mt-1">
              Avg Resolution Time
            </span>
            <span className="text-[10px] text-slate-500">Down 64% with smart dispatch</span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/10 text-center">
            <span className="text-2xl sm:text-3xl font-extrabold font-['Outfit',sans-serif] text-purple-400 font-mono block">
              24 / 7
            </span>
            <span className="text-xs font-semibold text-slate-300 block mt-1">
              Autonomous Ingestion
            </span>
            <span className="text-[10px] text-slate-500">Zero municipal queue backlog</span>
          </div>
        </div>
      </section>

      {/* Citizen Journey Showcase (4-Step Graphic Workflow) */}
      <section className="max-w-7xl mx-auto px-4">
        <CitizenStoryShowcase />
      </section>

      {/* Core AI Platform Capabilities Grid */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
            Engineered for Precision
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-['Outfit',sans-serif] mt-1">
            Built-In Intelligence & Accountability
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {featureCards.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className={`p-6 rounded-2xl bg-gradient-to-br ${feat.color} border ${feat.border} backdrop-blur-xl transition-all duration-300 hover:shadow-xl`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-900/80 border border-white/10 flex items-center justify-center text-cyan-400">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-black/40 text-cyan-300 font-mono text-[10px] border border-cyan-500/20">
                    {feat.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-100 mb-2">{feat.title}</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
