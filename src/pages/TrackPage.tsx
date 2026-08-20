import React, { useState, useEffect } from 'react';
import { Complaint, Department } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { UrgencyBadge } from '../components/UrgencyBadge';
import { StatusTimeline } from '../components/StatusTimeline';
import { OfficerContact } from '../components/OfficerContact';
import { DepartmentMap } from '../components/DepartmentMap';
import {
  Search,
  AlertCircle,
  Clock,
  MapPin,
  Calendar,
  Building,
  Cpu,
  Eye,
  CheckCircle2,
  Phone,
  Mail,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  Share2,
  RefreshCw,
  X,
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface Props {
  initialId?: string;
  onNavigate: (path: string) => void;
}

export const TrackPage: React.FC<Props> = ({ initialId = '', onNavigate }) => {
  const [searchId, setSearchId] = useState(initialId);
  const [loading, setLoading] = useState(false);
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [department, setDepartment] = useState<Department | null>(null);
  const [recentComplaints, setRecentComplaints] = useState<Complaint[]>([]);
  const [zoomPhoto, setZoomPhoto] = useState<string | null>(null);

  // Fetch recent complaints on mount for quick selection
  useEffect(() => {
    fetchRecent();
    if (initialId) {
      handleSearch(initialId);
    }
  }, [initialId]);

  const fetchRecent = async () => {
    try {
      const res = await fetch('/api/complaints');
      if (res.ok) {
        const data = await res.json();
        setRecentComplaints(data.complaints?.slice(0, 5) || []);
      }
    } catch (e) {
      console.error('Failed to load recent complaints', e);
    }
  };

  const handleSearch = async (idToSearch: string) => {
    const id = idToSearch.trim().toUpperCase();
    if (!id) {
      toast.error('Please enter a Grievance Tracking ID');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/complaints/${encodeURIComponent(id)}`);
      if (!res.ok) {
        throw new Error('Complaint ID not found in municipal registry');
      }
      const data = await res.json();
      setComplaint(data.complaint);
      setDepartment(data.department || null);
      setSearchId(id);
      toast.success(`Loaded grievance: ${id}`);
    } catch (err: any) {
      setComplaint(null);
      toast.error(err.message || 'Tracking ID not found');
    } finally {
      setLoading(false);
    }
  };

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchId);
  };

  // Calculate Overdue status
  const isOverdue =
    complaint?.status === 'escalated' ||
    (complaint &&
      complaint.status !== 'resolved' &&
      complaint.status !== 'closed' &&
      new Date().getTime() - new Date(complaint.created_at).getTime() >
        complaint.predicted_resolution_days * 24 * 60 * 60 * 1000);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Header & Search Bar */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="max-w-2xl mx-auto text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 mb-2">
            <Search className="w-3.5 h-3.5" />
            <span>Public Tracking & Transparency Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-['Outfit',sans-serif]">
            Track Grievance Redressal Status
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Enter your unique grievance tracking number to view real-time stage progress, assigned crew details, and map route.
          </p>
        </div>

        {/* Input Bar */}
        <form onSubmit={onFormSubmit} className="max-w-xl mx-auto flex gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="e.g. GRV-1001, GRV-1002..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-900/90 border border-white/15 text-slate-100 text-sm font-mono placeholder-slate-500 focus:outline-none focus:border-cyan-400 shadow-inner"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>Track</span>
          </button>
        </form>

        {/* Quick Sample IDs */}
        <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
          <span>Quick Samples:</span>
          {recentComplaints.slice(0, 4).map((rc) => (
            <button
              key={rc.id}
              onClick={() => {
                setSearchId(rc.id);
                handleSearch(rc.id);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-white/5 text-cyan-300 font-mono text-[11px] transition-colors cursor-pointer"
            >
              {rc.id} ({rc.urgency_level})
            </button>
          ))}
        </div>
      </div>

      {/* COMPLAINT DETAILS VIEW */}
      {complaint && (
        <div className="space-y-6">
          {/* Overdue Alert Banner if SLA Expired */}
          {isOverdue && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/80 to-red-900/60 border border-rose-500/50 text-rose-100 flex items-start gap-3 shadow-[0_0_25px_rgba(244,63,94,0.25)] animate-pulse">
              <ShieldAlert className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-extrabold text-sm text-rose-200">
                  RESOLUTION OVERDUE — SLA ESCALATION IN EFFECT
                </h4>
                <p className="text-xs text-rose-200/90 mt-0.5 leading-relaxed">
                  This grievance has surpassed its target completion deadline of {complaint.predicted_resolution_days} days. An automated notice has been dispatched to the Central Municipal Vigilance Director.
                </p>
              </div>
            </div>
          )}

          {/* Main Info Card */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl">
            {/* Top Bar with Tracking ID, Badges & Dates */}
            <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-bold text-slate-400 font-mono">
                    Grievance ID
                  </span>
                  <span className="text-lg sm:text-2xl font-mono font-extrabold text-cyan-400">
                    {complaint.id}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-100 mt-1">
                  {complaint.title}
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <StatusBadge status={complaint.status} size="lg" />
                <UrgencyBadge
                  level={complaint.urgency_level}
                  score={complaint.urgency_score}
                  size="lg"
                />
              </div>
            </div>

            {/* 5-Step Animated Status Timeline */}
            <div className="bg-slate-950/60 p-4 sm:p-6 rounded-2xl border border-white/5 shadow-inner">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Redressal Progress Lifecycle
              </h3>
              <StatusTimeline
                status={complaint.status}
                createdAt={complaint.created_at}
                updatedAt={complaint.updated_at}
                actualResolutionDate={complaint.actual_resolution_date}
                predictedDays={complaint.predicted_resolution_days}
                isOverdue={isOverdue}
              />
            </div>

            {/* Description & Incident Metadata */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: Details & Photos */}
              <div className="lg:col-span-2 space-y-4">
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Citizen Complaint Statement
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {complaint.description}
                  </p>
                </div>

                {/* Evidence Photo */}
                {complaint.photo_url && (
                  <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center justify-between">
                      <span>Attached Photographic Evidence</span>
                      <span className="text-[10px] text-cyan-400 font-normal">Click to zoom</span>
                    </h4>
                    <div
                      onClick={() => setZoomPhoto(complaint.photo_url)}
                      className="relative h-48 rounded-xl overflow-hidden cursor-pointer group border border-white/10"
                    >
                      <img
                        src={complaint.photo_url}
                        alt={complaint.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold transition-opacity">
                        <Eye className="w-4 h-4 mr-1" /> View Full Image
                      </div>
                    </div>
                  </div>
                )}

                {/* Resolution Notes (if resolved) */}
                {complaint.resolution_notes && (
                  <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-100">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300 mb-1 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Official Field Resolution Report</span>
                    </h4>
                    <p className="text-xs text-emerald-200 mt-1 leading-relaxed">
                      {complaint.resolution_notes}
                    </p>
                    {complaint.actual_resolution_date && (
                      <span className="text-[10px] text-emerald-400 font-mono block mt-2">
                        Closed on: {format(new Date(complaint.actual_resolution_date), 'PPP pp')}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Right Col: AI & Dispatch Metrics */}
              <div className="space-y-4">
                {/* AI Diagnostics Card */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/30 space-y-3">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <div className="flex items-center gap-1.5 text-cyan-300 font-bold text-xs">
                      <Cpu className="w-4 h-4" />
                      <span>Gemini 3.7 AI Diagnostic</span>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400">
                      {Math.round(complaint.ai_confidence * 100)}% Match
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span className="text-slate-400">Category:</span>
                      <span className="font-semibold text-slate-200 uppercase">
                        {complaint.category}
                      </span>
                    </div>

                    <div className="flex justify-between text-slate-300">
                      <span className="text-slate-400">Sub-Category:</span>
                      <span className="font-semibold text-slate-200">
                        {complaint.sub_category}
                      </span>
                    </div>

                    <div className="flex justify-between text-slate-300">
                      <span className="text-slate-400">Target SLA:</span>
                      <span className="font-mono font-bold text-amber-400">
                        {complaint.predicted_resolution_days} Days
                      </span>
                    </div>

                    <div className="flex justify-between text-slate-300">
                      <span className="text-slate-400">Distress Score:</span>
                      <span className="font-mono text-slate-200">
                        {complaint.sentiment_score}/10
                      </span>
                    </div>
                  </div>

                  {complaint.ai_reasoning && (
                    <p className="text-[11px] text-slate-400 pt-2 border-t border-white/5 leading-normal">
                      "{complaint.ai_reasoning}"
                    </p>
                  )}
                </div>

                {/* Assigned Field Officer Contact Card */}
                <OfficerContact
                  officerName={complaint.assigned_officer_name}
                  officerPhone={complaint.assigned_officer_phone}
                  officerEmail={complaint.assigned_officer_email}
                  department={complaint.department_name}
                  isOverdue={isOverdue}
                />
              </div>
            </div>

            {/* Department Geographic Location Map */}
            <div className="pt-2">
              <DepartmentMap
                complaintLat={complaint.latitude}
                complaintLng={complaint.longitude}
                complaintTitle={complaint.title}
                complaintLocation={complaint.location}
                department={department}
                departmentName={complaint.department_name}
                height="340px"
              />
            </div>
          </div>
        </div>
      )}

      {/* Photo Zoom Lightbox Modal */}
      {zoomPhoto && (
        <div
          onClick={() => setZoomPhoto(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div className="relative max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden border border-white/20">
            <img
              src={zoomPhoto}
              alt="Zoomed Evidence"
              referrerPolicy="no-referrer"
              className="max-h-[85vh] w-auto object-contain"
            />
            <button
              onClick={() => setZoomPhoto(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/80 text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
