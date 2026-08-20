import React, { useState, useEffect } from 'react';
import { Complaint, ComplaintStatus } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { UrgencyBadge } from '../components/UrgencyBadge';
import {
  ListOrdered,
  Search,
  PlusCircle,
  Trash2,
  ExternalLink,
  Clock,
  MapPin,
  Building,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Info,
  Calendar,
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

interface Props {
  userEmail: string;
  userName: string;
  onNavigate: (path: string) => void;
}

export const MyComplaintsPage: React.FC<Props> = ({
  userEmail,
  userName,
  onNavigate,
}) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  const fetchMyComplaints = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/complaints');
      if (res.ok) {
        const data = await res.json();
        // Filter by user's email (case-insensitive)
        const myData = (data.complaints || []).filter(
          (c: Complaint) =>
            c.citizen_email?.toLowerCase() === userEmail.toLowerCase()
        );
        setComplaints(myData);
      }
    } catch (e) {
      toast.error('Failed to load your complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyComplaints();
  }, [userEmail]);

  // Handle Delete with 24-hour & "submitted" status check
  const handleDelete = async (complaint: Complaint) => {
    const hoursSinceCreation =
      (new Date().getTime() - new Date(complaint.created_at).getTime()) /
      (1000 * 60 * 60);

    if (complaint.status !== 'submitted') {
      toast.error(
        'Grievance is already under active review by field officers and cannot be withdrawn.'
      );
      return;
    }

    if (hoursSinceCreation > 24) {
      toast.error(
        'Withdrawal window expired (allowed only within 24 hours of submission).'
      );
      return;
    }

    if (!window.confirm(`Are you sure you want to withdraw grievance ${complaint.id}?`)) {
      return;
    }

    setIsDeletingId(complaint.id);
    try {
      const res = await fetch(`/api/complaints/${complaint.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to delete complaint');
      }
      toast.success(`Grievance ${complaint.id} successfully withdrawn.`);
      setComplaints((prev) => prev.filter((c) => c.id !== complaint.id));
    } catch (error: any) {
      toast.error(error.message || 'Could not cancel grievance.');
    } finally {
      setIsDeletingId(null);
    }
  };

  // Filter logic
  const filtered = complaints.filter((c) => {
    const matchesStatus =
      statusFilter === 'all' || c.status === statusFilter;
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalCount = complaints.length;
  const pendingCount = complaints.filter(
    (c) => c.status !== 'resolved' && c.status !== 'closed'
  ).length;
  const resolvedCount = complaints.filter(
    (c) => c.status === 'resolved' || c.status === 'closed'
  ).length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              Citizen Registry
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-['Outfit',sans-serif] mt-1">
            My Submitted Grievances
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Tracking records associated with <strong className="text-slate-300">{userEmail}</strong>
          </p>
        </div>

        <button
          onClick={() => onNavigate('/submit')}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Grievance</span>
        </button>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-white/10 text-center">
          <span className="text-xl sm:text-2xl font-mono font-extrabold text-slate-100 block">
            {totalCount}
          </span>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Total Filed
          </span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-amber-500/20 text-center">
          <span className="text-xl sm:text-2xl font-mono font-extrabold text-amber-400 block">
            {pendingCount}
          </span>
          <span className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider">
            In Progress
          </span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-emerald-500/20 text-center">
          <span className="text-xl sm:text-2xl font-mono font-extrabold text-emerald-400 block">
            {resolvedCount}
          </span>
          <span className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider">
            Resolved
          </span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="glass-panel p-3.5 rounded-2xl border border-white/10 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, title, or street..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900/90 border border-white/10 text-slate-100 text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs text-slate-400 whitespace-nowrap hidden sm:inline">
            Status:
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-xl bg-slate-900/90 border border-white/10 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Statuses</option>
            <option value="submitted">Submitted</option>
            <option value="under_review">Under Review</option>
            <option value="assigned">Assigned</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="escalated">Escalated</option>
          </select>

          <button
            onClick={fetchMyComplaints}
            title="Refresh list"
            className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-white/10 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Complaints List */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
          <RefreshCw className="w-6 h-6 animate-spin text-cyan-400" />
          <span className="text-xs">Fetching your grievance records...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-white/10 text-center max-w-md mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-400 mx-auto flex items-center justify-center border border-cyan-500/20">
            <ListOrdered className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">No Grievances Found</h3>
            <p className="text-xs text-slate-400 mt-1">
              {complaints.length === 0
                ? "You haven't submitted any complaints under this account yet."
                : 'No grievances match your current search or status filter.'}
            </p>
          </div>
          <button
            onClick={() => onNavigate('/submit')}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs inline-flex items-center gap-2 transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Submit Your First Report</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((c) => {
            const hoursSince =
              (new Date().getTime() - new Date(c.created_at).getTime()) /
              (1000 * 60 * 60);
            const canDelete = c.status === 'submitted' && hoursSince < 24;
            const remainingHours = Math.max(0, Math.round(24 - hoursSince));

            return (
              <div
                key={c.id}
                className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-cyan-500/30 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-mono font-bold text-xs text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                      {c.id}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <StatusBadge status={c.status} size="sm" />
                      <UrgencyBadge level={c.urgency_level} size="sm" showScore={false} />
                    </div>
                  </div>

                  {/* Title & Desc */}
                  <h3 className="text-sm font-bold text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-1">
                    {c.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {c.description}
                  </p>

                  {/* Meta Tags */}
                  <div className="mt-3 pt-3 border-t border-white/5 space-y-1 text-[11px] text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-red-400 shrink-0" />
                      <span className="truncate">{c.location} ({c.district})</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Building className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span className="truncate">{c.department_name}</span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        {format(new Date(c.created_at), 'MMM d, yyyy')}
                      </span>
                      <span className="font-mono text-amber-300">
                        SLA: {c.predicted_resolution_days} Days
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                  {/* Delete button or explanation tooltip */}
                  {canDelete ? (
                    <button
                      onClick={() => handleDelete(c)}
                      disabled={isDeletingId === c.id}
                      className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors cursor-pointer"
                      title={`You can cancel within 24 hours of submission (${remainingHours}h remaining)`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>
                        {isDeletingId === c.id ? 'Withdrawing...' : `Withdraw (${remainingHours}h left)`}
                      </span>
                    </button>
                  ) : (
                    <span
                      className="text-[10px] text-slate-500 flex items-center gap-1"
                      title="Withdrawal is disabled once investigation begins or after 24 hours"
                    >
                      <Info className="w-3 h-3" />
                      <span>Locked (In Triage)</span>
                    </span>
                  )}

                  <button
                    onClick={() => onNavigate(`/track?id=${c.id}`)}
                    className="px-3.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <span>Track Live</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
