import React, { useState, useEffect } from 'react';
import { Complaint, KPIData } from '../types';
import { StatsCard } from '../components/StatsCard';
import { ComplaintHeatmap } from '../components/ComplaintHeatmap';
import { CategoryChart } from '../components/CategoryChart';
import { UrgencyBreakdown } from '../components/UrgencyBreakdown';
import { StatusBadge } from '../components/StatusBadge';
import { UrgencyBadge } from '../components/UrgencyBadge';
import {
  LayoutDashboard,
  ShieldCheck,
  Flame,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  RefreshCw,
  Cpu,
  ArrowUpRight,
  Sparkles,
  Sliders,
  ExternalLink,
  MapPin,
  Building,
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface Props {
  onNavigate: (path: string) => void;
}

export const AdminDashboardPage: React.FC<Props> = ({ onNavigate }) => {
  const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'month' | 'all'>('all');
  const [kpis, setKpis] = useState<KPIData | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuditing, setIsAuditing] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [kpiRes, complaintsRes] = await Promise.all([
        fetch('/api/kpis'),
        fetch('/api/complaints'),
      ]);

      if (kpiRes.ok) {
        const kpiData = await kpiRes.json();
        setKpis(kpiData);
      }

      if (complaintsRes.ok) {
        const cData = await complaintsRes.json();
        setComplaints(cData.complaints || []);
      }
    } catch (err) {
      toast.error('Failed to load admin analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Run Manual Overdue Audit
  const handleRunOverdueAudit = async () => {
    setIsAuditing(true);
    try {
      const res = await fetch('/api/simulate/check-overdue', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        toast.success(
          `SLA Audit Complete: ${data.escalatedCount} overdue complaints flagged and escalated to central supervision.`
        );
        fetchDashboardData();
      }
    } catch (e) {
      toast.error('Audit run failed');
    } finally {
      setIsAuditing(false);
    }
  };

  // Filter complaints
  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept =
      deptFilter === 'all' || c.department_name.toLowerCase().includes(deptFilter.toLowerCase());
    const matchesUrgency =
      urgencyFilter === 'all' || c.urgency_level === urgencyFilter;
    const matchesDistrict =
      !selectedDistrict || c.district === selectedDistrict;

    return matchesSearch && matchesDept && matchesUrgency && matchesDistrict;
  });

  // Top critical complaints for urgent queue
  const criticalComplaints = complaints.filter(
    (c) =>
      (c.urgency_level === 'critical' || c.urgency_level === 'high') &&
      c.status !== 'resolved' &&
      c.status !== 'closed'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      {/* Header Bar with Quick Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono text-[10px] border border-purple-500/30 uppercase font-bold">
              Command Authority
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Municipal Operations Central (MOC)
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-100 font-['Outfit',sans-serif] mt-1">
            Grievance Intelligence & Triage Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time municipal KPIs, algorithmic triage workload, and jurisdictional response telemetry
          </p>
        </div>

        {/* Time filters & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Time Tabs */}
          <div className="p-1 bg-slate-900/90 rounded-xl border border-white/10 flex text-xs font-semibold">
            {(['today', 'week', 'month', 'all'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeFilter(t)}
                className={`px-3 py-1.5 rounded-lg transition-all capitalize cursor-pointer ${
                  timeFilter === t
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t === 'all' ? 'All Time' : t}
              </button>
            ))}
          </div>

          {/* Trigger SLA Audit */}
          <button
            onClick={handleRunOverdueAudit}
            disabled={isAuditing}
            title="Scan database and escalate overdue complaints"
            className="px-3.5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            <AlertTriangle className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
            <span>{isAuditing ? 'Auditing...' : 'Run SLA Audit'}</span>
          </button>

          {/* Refresh */}
          <button
            onClick={fetchDashboardData}
            title="Refresh analytics"
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 5 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard
          title="Total Grievances"
          value={kpis?.totalComplaints || 0}
          subtitle="Cumulative citywide"
          icon={LayoutDashboard}
          color="blue"
          trend={{ value: '+14% this week', isPositive: true }}
        />

        <StatsCard
          title="Critical & High"
          value={kpis?.criticalPending || 0}
          subtitle="Immediate dispatch"
          icon={Flame}
          color="rose"
          trend={{ value: 'Priority queue', isPositive: false }}
        />

        <StatsCard
          title="Verified Resolved"
          value={kpis?.resolvedComplaints || 0}
          subtitle={`${kpis?.resolutionRate || 0}% overall rate`}
          icon={CheckCircle2}
          color="emerald"
          trend={{ value: '+8% vs last month', isPositive: true }}
        />

        <StatsCard
          title="Pending / Active"
          value={kpis?.pendingComplaints || 0}
          subtitle="In triage / review"
          icon={Clock}
          color="amber"
        />

        <StatsCard
          title="SLA Violations"
          value={kpis?.overdueComplaints || 0}
          subtitle="Escalated alerts"
          icon={AlertTriangle}
          color="purple"
        />
      </div>

      {/* Jurisdictional Heatmap */}
      {kpis?.districtStats && (
        <ComplaintHeatmap
          districtStats={kpis.districtStats}
          onSelectDistrict={(d) => {
            setSelectedDistrict(selectedDistrict === d ? null : d);
            toast.info(
              selectedDistrict === d
                ? 'Cleared district filter'
                : `Filtered table to: ${d}`
            );
          }}
        />
      )}

      {/* Charts Grid: Category Recharts + Urgency Tiers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryChart categoryCounts={kpis?.categoryCounts || {}} />
        <UrgencyBreakdown urgencyCounts={kpis?.urgencyCounts || { critical: 0, high: 0, medium: 0, low: 0 }} />
      </div>

      {/* Critical Action Queue Callout */}
      {criticalComplaints.length > 0 && (
        <div className="glass-panel p-5 rounded-2xl border border-red-500/40 bg-red-950/20 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-red-400 animate-pulse" />
              <h3 className="text-base font-bold text-red-200">
                High-Severity Priority Action Queue ({criticalComplaints.length} Items)
              </h3>
            </div>
            <span className="text-xs text-red-300 font-mono">
              Action Required within SLA
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {criticalComplaints.slice(0, 3).map((c) => (
              <div
                key={c.id}
                onClick={() => onNavigate(`/complaint/${c.id}`)}
                className="p-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-red-500/30 cursor-pointer transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-bold text-red-400">
                      {c.id}
                    </span>
                    <UrgencyBadge level={c.urgency_level} score={c.urgency_score} size="sm" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-100 group-hover:text-red-300 transition-colors line-clamp-1">
                    {c.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                    {c.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="truncate">{c.department_name}</span>
                  <span className="font-mono text-red-400 font-bold flex items-center gap-0.5">
                    Manage <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Filterable Grievance Table */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>All Registered Public Grievances</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                {filteredComplaints.length} Total
              </span>
            </h3>
            {selectedDistrict && (
              <span className="text-xs text-cyan-400 flex items-center gap-1 mt-0.5">
                Filtered by district: <strong>{selectedDistrict}</strong>
                <button
                  onClick={() => setSelectedDistrict(null)}
                  className="ml-1 text-slate-400 hover:text-white underline"
                >
                  (clear)
                </button>
              </span>
            )}
          </div>

          {/* Search and Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search complaints..."
                className="pl-9 pr-3 py-1.5 rounded-xl bg-slate-900/90 border border-white/10 text-slate-100 text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-white/10 text-slate-300 text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Urgencies</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-white/10 text-slate-300 text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Departments</option>
              <option value="roads">Roads & Infrastructure</option>
              <option value="water">Water & Sewage</option>
              <option value="drainage">Stormwater & Drainage</option>
              <option value="electricity">Electrical & Power</option>
              <option value="sanitation">Solid Waste & Sanitation</option>
            </select>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto rounded-2xl border border-white/5">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-white/10">
              <tr>
                <th className="py-3 px-4">Grievance ID</th>
                <th className="py-3 px-4">Subject & Location</th>
                <th className="py-3 px-4">Department & Sector</th>
                <th className="py-3 px-4">AI Urgency</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">SLA Target</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No complaints match current filters
                  </td>
                </tr>
              ) : (
                filteredComplaints.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-slate-900/60 transition-colors group cursor-pointer"
                    onClick={() => onNavigate(`/complaint/${c.id}`)}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-cyan-400 whitespace-nowrap">
                      {c.id}
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <p className="font-semibold text-slate-100 truncate group-hover:text-cyan-300 transition-colors">
                        {c.title}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-red-400 shrink-0" />
                        {c.location}
                      </p>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-medium text-slate-200 block">
                        {c.department_name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        District: {c.district}
                      </span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <UrgencyBadge
                        level={c.urgency_level}
                        score={c.urgency_score}
                        size="sm"
                      />
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <StatusBadge status={c.status} size="sm" />
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap font-mono text-amber-300">
                      {c.predicted_resolution_days} Days
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate(`/complaint/${c.id}`);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold inline-flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <span>Manage</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
