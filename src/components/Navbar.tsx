import React, { useState } from 'react';
import { UserRole } from '../types';
import {
  ShieldAlert,
  Home,
  PlusCircle,
  Search,
  ListOrdered,
  LayoutDashboard,
  Menu,
  X,
  User,
  Shield,
  LogOut,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

interface Props {
  currentPath: string;
  onNavigate: (path: string) => void;
  userRole: UserRole;
  userEmail: string;
  userName: string;
  onToggleRole: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<Props> = ({
  currentPath,
  onNavigate,
  userRole,
  userEmail,
  userName,
  onToggleRole,
  onLogout,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Hidden on Welcome page
  if (currentPath === '/') return null;

  const citizenNav = [
    { label: 'Home', path: '/home', icon: Home },
    { label: 'Submit Grievance', path: '/submit', icon: PlusCircle },
    { label: 'Track Status', path: '/track', icon: Search },
    { label: 'My Complaints', path: '/my-complaints', icon: ListOrdered },
  ];

  const adminNav = [
    { label: 'Home', path: '/home', icon: Home },
    { label: 'Submit Grievance', path: '/submit', icon: PlusCircle },
    { label: 'Track Status', path: '/track', icon: Search },
    { label: 'Admin Command Dashboard', path: '/dashboard', icon: LayoutDashboard },
  ];

  const navItems = userRole === 'admin' ? adminNav : citizenNav;

  const handleNav = (path: string) => {
    onNavigate(path);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => handleNav('/home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold font-['Outfit',sans-serif] text-base tracking-tight text-slate-100">
                SPGPS
              </span>
              <span className="px-1.5 py-0.2 text-[9px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 rounded font-semibold">
                AI TRIAGE
              </span>
            </div>
            <span className="text-[10px] text-slate-400 block -mt-0.5 leading-none">
              Smart Public Grievance Prioritization
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Role Switcher & User Profile */}
        <div className="hidden md:flex items-center gap-3">
          {/* Quick Role Toggle */}
          <button
            onClick={onToggleRole}
            title="Click to switch between Citizen and Admin mode"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono border transition-all ${
              userRole === 'admin'
                ? 'bg-purple-500/20 border-purple-500/40 text-purple-300 hover:bg-purple-500/30'
                : 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30'
            }`}
          >
            {userRole === 'admin' ? (
              <>
                <Shield className="w-3.5 h-3.5 text-purple-400" />
                <span>Admin Mode</span>
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span>Citizen Mode</span>
              </>
            )}
            <RefreshCw className="w-3 h-3 text-slate-400 ml-1 hover:rotate-180 transition-transform" />
          </button>

          {/* User Email Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-white/5 text-xs text-slate-300">
            <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-cyan-400">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="max-w-[130px] truncate text-slate-300 text-xs">
              {userName}
            </span>
          </div>

          {/* Logout */}
          <button
            onClick={onLogout}
            title="Sign Out / Back to Welcome"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-transparent hover:border-white/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onToggleRole}
            className="px-2 py-1 text-xs rounded bg-slate-800 text-cyan-400 font-mono border border-white/10"
          >
            {userRole === 'admin' ? 'Admin' : 'Citizen'}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg text-slate-300 hover:bg-slate-800"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden glass-panel border-b border-white/10 px-4 pt-3 pb-5 space-y-2">
          <div className="pb-2 border-b border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span>Signed in as: {userName}</span>
            <span className="font-mono text-cyan-400">({userRole})</span>
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-3 border-t border-white/10 flex gap-2">
            <button
              onClick={onToggleRole}
              className="flex-1 py-2 rounded-lg text-xs font-mono bg-slate-800 text-slate-200 border border-white/10"
            >
              Switch to {userRole === 'admin' ? 'Citizen' : 'Admin'} Mode
            </button>
            <button
              onClick={onLogout}
              className="px-3 py-2 rounded-lg text-xs bg-rose-500/20 text-rose-300 border border-rose-500/30"
            >
              Exit
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
