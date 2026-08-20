import React, { useState } from 'react';
import { ThreeCanvas } from '../components/ThreeCanvas';
import { UserRole } from '../types';
import { ShieldCheck, User, Sparkles, ArrowRight, ShieldAlert, Cpu, CheckCircle2, Lock } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  onLogin: (role: UserRole, email: string, name: string) => void;
  currentUser: { email: string; name: string; role: UserRole } | null;
  onNavigate: (path: string) => void;
}

export const WelcomePage: React.FC<Props> = ({ onLogin, currentUser, onNavigate }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('citizen');
  const [email, setEmail] = useState('2005chandanakg@gmail.com');
  const [name, setName] = useState('Chandana Kumar');
  const [password, setPassword] = useState('••••••••');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter an email address');
      return;
    }
    const displayName = name || (selectedRole === 'admin' ? 'Municipal Officer' : 'Citizen');
    onLogin(selectedRole, email, displayName);
    toast.success(`Welcome ${displayName}! Signed in as ${selectedRole.toUpperCase()}`);
    onNavigate('/home');
  };

  const handleQuickDemo = (role: UserRole) => {
    if (role === 'admin') {
      onLogin('admin', 'admin.triage@city.gov', 'Admin Olivia Taylor');
      toast.success('Signed in as Central Municipal Admin');
    } else {
      onLogin('citizen', '2005chandanakg@gmail.com', 'Chandana Kumar');
      toast.success('Signed in as Verified Citizen');
    }
    onNavigate('/home');
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden bg-slate-950">
      {/* Background 3D Canvas */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-70 pointer-events-none md:pointer-events-auto">
        <ThreeCanvas />
      </div>

      {/* Atmospheric radial background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Brand */}
      <div className="relative z-10 text-center mb-6 max-w-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-cyan-500/30 text-cyan-300 text-xs font-semibold backdrop-blur-md mb-3 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span>Google Gemini 3.7 Flash Neural Triage</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-cyan-200 tracking-tight font-['Outfit',sans-serif]">
          SPGPS
        </h1>
        <p className="text-sm sm:text-base text-slate-300 font-medium mt-1">
          Smart Public Grievance Prioritization System
        </p>
        <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
          Autonomous grievance grading, urgency matrix scoring, and zero-latency department routing
        </p>
      </div>

      {/* Main Glassmorphic Auth Card */}
      <div className="relative z-10 w-full max-w-md glass-panel p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/10 backdrop-blur-2xl">
        {currentUser ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 mx-auto flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-100">
                Welcome back, {currentUser.name}!
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Active session as{' '}
                <span className="font-mono font-semibold text-cyan-400 uppercase">
                  {currentUser.role}
                </span>{' '}
                ({currentUser.email})
              </p>
            </div>
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => onNavigate('/home')}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
              >
                <span>Enter Municipal Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleQuickDemo(currentUser.role === 'admin' ? 'citizen' : 'admin')}
                className="w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-medium text-xs border border-white/5 transition-all"
              >
                Switch Role to {currentUser.role === 'admin' ? 'Citizen' : 'Admin'}
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Role Selection Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900/80 rounded-2xl border border-white/5 mb-5">
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('citizen');
                  setEmail('2005chandanakg@gmail.com');
                  setName('Chandana Kumar');
                }}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedRole === 'citizen'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Citizen Portal</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedRole('admin');
                  setEmail('admin.triage@city.gov');
                  setName('Admin Olivia Taylor');
                }}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedRole === 'admin'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Command</span>
              </button>
            </div>

            {/* Login / Register Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jane Doe"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-slate-100 text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-slate-100 text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-slate-100 text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <button
                type="submit"
                className={`w-full py-3 mt-2 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
                  selectedRole === 'admin'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-purple-500/25'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-cyan-500/25'
                }`}
              >
                <span>
                  {isRegistering ? 'Create Account & Sign In' : `Sign In as ${selectedRole === 'admin' ? 'Admin' : 'Citizen'}`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Demo Pre-fill Links */}
            <div className="mt-5 pt-4 border-t border-white/5 space-y-2">
              <span className="text-[11px] text-slate-400 block text-center">
                Or quick-access with 1-click test credentials:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('citizen')}
                  className="py-2 px-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-cyan-500/20 text-cyan-300 text-[11px] font-medium transition-colors"
                >
                  ⚡ Demo Citizen
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('admin')}
                  className="py-2 px-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-purple-500/20 text-purple-300 text-[11px] font-medium transition-colors"
                >
                  🛡️ Demo Admin
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Feature Highlights Footer */}
      <div className="relative z-10 mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl w-full text-center text-xs text-slate-400">
        <div className="p-2.5 rounded-xl bg-slate-900/40 border border-white/5 backdrop-blur-sm">
          <span className="font-bold text-slate-200 block">AI Triage</span>
          <span className="text-[11px] text-slate-400">Gemini 3.7 Flash</span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-900/40 border border-white/5 backdrop-blur-sm">
          <span className="font-bold text-slate-200 block">12 Departments</span>
          <span className="text-[11px] text-slate-400">Auto-routed</span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-900/40 border border-white/5 backdrop-blur-sm">
          <span className="font-bold text-slate-200 block">Live SLA Timers</span>
          <span className="text-[11px] text-slate-400">Overdue alerts</span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-900/40 border border-white/5 backdrop-blur-sm">
          <span className="font-bold text-slate-200 block">Geo-Tracking</span>
          <span className="text-[11px] text-slate-400">OSM & Leaflet Maps</span>
        </div>
      </div>
    </div>
  );
};
