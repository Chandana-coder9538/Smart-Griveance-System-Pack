import React, { useState, useEffect } from 'react';
import { Complaint, ComplaintStatus, Department } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { UrgencyBadge } from '../components/UrgencyBadge';
import { StatusTimeline } from '../components/StatusTimeline';
import { OfficerContact } from '../components/OfficerContact';
import { DepartmentMap } from '../components/DepartmentMap';
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Building,
  Cpu,
  Clock,
  Phone,
  Mail,
  FileText,
  Calendar,
  Sparkles,
  MapPin,
  RefreshCw,
  Wrench,
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface Props {
  complaintId: string;
  onNavigate: (path: string) => void;
}

export const ComplaintDetailPage: React.FC<Props> = ({
  complaintId,
  onNavigate,
}) => {
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [department, setDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Editable Form fields
  const [status, setStatus] = useState<ComplaintStatus>('submitted');
  const [officerName, setOfficerName] = useState('');
  const [officerPhone, setOfficerPhone] = useState('');
  const [officerEmail, setOfficerEmail] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');

  const fetchComplaint = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/complaints/${encodeURIComponent(complaintId)}`);
      if (!res.ok) {
        throw new Error('Complaint not found');
      }
      const data = await res.json();
      const c: Complaint = data.complaint;
      setComplaint(c);
      setDepartment(data.department || null);
      setStatus(c.status);
      setOfficerName(c.assigned_officer_name || '');
      setOfficerPhone(c.assigned_officer_phone || '');
      setOfficerEmail(c.assigned_officer_email || '');
      setResolutionNotes(c.resolution_notes || '');
    } catch (e: any) {
      toast.error(e.message || 'Failed to load complaint details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaint();
  }, [complaintId]);

  const handleSave = async () => {
    if (!complaint) return;
    setSaving(true);

    try {
      const res = await fetch(`/api/complaints/${complaint.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          assigned_officer_name: officerName || null,
          assigned_officer_phone: officerPhone || null,
          assigned_officer_email: officerEmail || null,
          resolution_notes: resolutionNotes || null,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to update complaint record');
      }

      const updated = await res.json();
      setComplaint(updated.complaint);
      toast.success(`Complaint ${complaint.id} successfully updated!`);
    } catch (err: any) {
      toast.error(err.message || 'Error updating record');
    } finally {
      setSaving(false);
    }
  };

  const handleQuickStatus = (newStatus: ComplaintStatus, defaultNotes?: string) => {
    setStatus(newStatus);
    if (defaultNotes && !resolutionNotes) {
      setResolutionNotes(defaultNotes);
    }
    toast.info(`Status changed to: ${newStatus.replace('_', ' ').toUpperCase()}`);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center flex flex-col items-center justify-center gap-3">
        <RefreshCw className="w-8 h-8 animate-spin text-cyan-400" />
        <p className="text-xs text-slate-400">Loading municipal record...</p>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-100">Grievance Not Found</h2>
        <p className="text-xs text-slate-400">The requested ID {complaintId} does not exist.</p>
        <button
          onClick={() => onNavigate('/dashboard')}
          className="px-4 py-2 bg-slate-800 text-cyan-300 rounded-xl text-xs"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Top Breadcrumb & Nav */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('/dashboard')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Admin Command</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">ID:</span>
          <span className="font-mono font-bold text-sm text-cyan-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-white/10">
            {complaint.id}
          </span>
        </div>
      </div>

      {/* Main Glassmorphic Container */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl">
        {/* Header with Title and Badges */}
        <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <span className="text-xs uppercase font-bold text-slate-400 font-mono block mb-1">
              Municipal Case File
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
              {complaint.title}
            </h1>
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-red-400" />
                {complaint.location} ({complaint.district})
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                {format(new Date(complaint.created_at), 'PPP pp')}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={status} size="lg" />
            <UrgencyBadge
              level={complaint.urgency_level}
              score={complaint.urgency_score}
              size="lg"
            />
          </div>
        </div>

        {/* 5-Step Timeline */}
        <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/5 shadow-inner">
          <StatusTimeline
            status={status}
            createdAt={complaint.created_at}
            updatedAt={complaint.updated_at}
            actualResolutionDate={complaint.actual_resolution_date}
            predictedDays={complaint.predicted_resolution_days}
          />
        </div>

        {/* 2-Column Grid: Details & Officer/AI Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 7 cols: Citizen statement + Admin Control Form */}
          <div className="lg:col-span-7 space-y-6">
            {/* Citizen statement */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Citizen Statement & Evidence
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {complaint.description}
              </p>

              {complaint.photo_url && (
                <div className="mt-3 rounded-xl overflow-hidden border border-white/10 h-44 bg-black/40">
                  <img
                    src={complaint.photo_url}
                    alt={complaint.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Citizen Details Box */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Complainant Verification Info
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Name</span>
                  <span className="font-semibold text-slate-200">{complaint.citizen_name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Email</span>
                  <span className="font-mono text-slate-200 truncate block">
                    {complaint.citizen_email}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Phone</span>
                  <span className="font-mono text-slate-200">{complaint.citizen_phone || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* ADMIN LIFECYCLE MANAGEMENT PANEL */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-950/40 to-slate-900/90 border border-purple-500/40 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-purple-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-purple-200">
                    Municipal Case Administration & Dispatch
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-purple-300">Admin Mode</span>
              </div>

              {/* Quick Status Buttons */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Quick Lifecycle State Actions:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickStatus('in_progress', 'Field repair unit dispatched to site.')}
                    className="p-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>In Progress</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleQuickStatus(
                        'resolved',
                        'Field inspection confirmed repair complete and verified against safety standards.'
                      )
                    }
                    className="p-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mark Resolved</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickStatus('escalated', 'SLA exceeded. Flagged to Central Director.')}
                    className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Escalate (SLA)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickStatus('closed', 'Case closed and archived.')}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <span>Archive / Close</span>
                  </button>
                </div>
              </div>

              {/* Status Select */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1 font-semibold">
                    Current Grievance Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ComplaintStatus)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-slate-100 text-xs focus:outline-none focus:border-purple-500 font-semibold"
                  >
                    <option value="submitted">Submitted</option>
                    <option value="under_review">Under Review</option>
                    <option value="assigned">Officer Assigned</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed / Archived</option>
                    <option value="escalated">Escalated</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1 font-semibold">
                    Assigned Field Officer Name
                  </label>
                  <input
                    type="text"
                    value={officerName}
                    onChange={(e) => setOfficerName(e.target.value)}
                    placeholder="e.g. Officer Marcus Cole"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-slate-100 text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1 font-semibold">
                    Officer Phone Contact
                  </label>
                  <input
                    type="tel"
                    value={officerPhone}
                    onChange={(e) => setOfficerPhone(e.target.value)}
                    placeholder="+1 (555) 234-7890"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-slate-100 text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1 font-semibold">
                    Officer Official Email
                  </label>
                  <input
                    type="email"
                    value={officerEmail}
                    onChange={(e) => setOfficerEmail(e.target.value)}
                    placeholder="m.cole@city.gov"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-slate-100 text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Resolution Notes */}
              <div>
                <label className="block text-xs text-slate-300 mb-1 font-semibold">
                  Field Resolution Notes & Verification Audit
                </label>
                <textarea
                  rows={3}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Detail work performed by field crew, materials used, inspection results, or escalation reasons..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-slate-100 text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Save Button */}
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 transition-all cursor-pointer disabled:opacity-50"
              >
                {saving ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{saving ? 'Updating Municipal Record...' : 'Save & Publish Updates'}</span>
              </button>
            </div>
          </div>

          {/* Right 5 cols: AI Matrix & Department Map */}
          <div className="lg:col-span-5 space-y-4">
            {/* AI Diagnostics Card */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/30 space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex items-center gap-1.5 text-cyan-300 font-bold text-xs">
                  <Cpu className="w-4 h-4" />
                  <span>Gemini 3.7 AI Diagnostic Matrix</span>
                </div>
                <span className="text-[10px] font-mono text-cyan-400">
                  {Math.round(complaint.ai_confidence * 100)}% Confidence
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Classified Department:</span>
                  <span className="font-semibold text-cyan-300">{complaint.department_name}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Assigned Domain:</span>
                  <span className="font-mono text-slate-200">
                    {complaint.category} / {complaint.sub_category}
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Calculated SLA:</span>
                  <span className="font-mono font-bold text-amber-400">
                    {complaint.predicted_resolution_days} Days
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Sentiment Score:</span>
                  <span className="font-mono text-slate-200">{complaint.sentiment_score}/10</span>
                </div>
              </div>

              {complaint.ai_reasoning && (
                <div className="pt-2 border-t border-white/5 text-[11px] text-slate-300">
                  <strong className="text-cyan-400">Reasoning: </strong>
                  {complaint.ai_reasoning}
                </div>
              )}
            </div>

            {/* Department Geographic Location Map */}
            <DepartmentMap
              complaintLat={complaint.latitude}
              complaintLng={complaint.longitude}
              complaintTitle={complaint.title}
              complaintLocation={complaint.location}
              department={department}
              departmentName={complaint.department_name}
              height="280px"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
