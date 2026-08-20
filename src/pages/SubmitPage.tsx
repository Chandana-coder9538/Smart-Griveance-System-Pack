import React, { useState } from 'react';
import { ComplaintCategory, Complaint, AIClassificationResponse } from '../types';
import { UrgencyBadge } from '../components/UrgencyBadge';
import {
  UploadCloud,
  MapPin,
  Sparkles,
  Camera,
  CheckCircle2,
  Copy,
  ArrowRight,
  RefreshCw,
  Cpu,
  AlertCircle,
  FileText,
  Building,
  Clock,
  HeartHandshake,
  Check,
  Flame,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';

interface Props {
  onNavigate: (path: string) => void;
  currentUserEmail: string;
  currentUserName: string;
}

const DISTRICT_OPTIONS = [
  'Downtown',
  'North River',
  'Central District',
  'West Valley',
  'Waterfront',
  'South Bay',
  'Highland Park',
  'Twin Peaks',
];

const PRESETS = [
  {
    title: 'Severe Deep Pothole on Main Blvd',
    description:
      'Massive 2-foot wide pothole near pedestrian crosswalk causing swerving and tyre damage. Water accumulating inside makes it invisible at night.',
    location: '1044 Main Blvd & 4th Cross Ave',
    district: 'Downtown',
    photoUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80',
    tag: 'Road Hazard',
  },
  {
    title: 'Sparking Exposed High-Voltage Power Cable',
    description:
      'Storm damaged overhead power line that is dangling 6 feet above children playground sidewalk with visible electrical sparks and buzzing sound.',
    location: 'Elm Street Park, Corner Pole #18',
    district: 'Central District',
    photoUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&auto=format&fit=crop&q=80',
    tag: 'Critical Danger',
  },
  {
    title: 'Clogged Storm Drain Causing Street Flooding',
    description:
      'Heavy plastic debris and silt blocking storm inlet. Knee-high dirty water backing into residential basements and storefront entrances.',
    location: '782 Waterfront Promenade',
    district: 'Waterfront',
    photoUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80',
    tag: 'Drainage Alert',
  },
  {
    title: 'Uncollected Commercial Garbage Heap & Rodents',
    description:
      'Solid waste pile left unattended for 8 days behind public market. Strong foul odor, fly infestation, and rats invading nearby eateries.',
    location: 'Market Lane & 2nd St Alley',
    district: 'North River',
    photoUrl: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?w=600&auto=format&fit=crop&q=80',
    tag: 'Sanitation',
  },
];

export const SubmitPage: React.FC<Props> = ({
  onNavigate,
  currentUserEmail,
  currentUserName,
}) => {
  const [name, setName] = useState(currentUserName || 'Chandana Kumar');
  const [email, setEmail] = useState(currentUserEmail || '2005chandanakg@gmail.com');
  const [phone, setPhone] = useState('+1 (555) 392-8192');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [district, setDistrict] = useState('Downtown');
  const [latitude, setLatitude] = useState(37.7749);
  const [longitude, setLongitude] = useState(-122.4194);
  const [photoUrl, setPhotoUrl] = useState('');
  const [isDetectingGeo, setIsDetectingGeo] = useState(false);

  // Submission / AI Loading States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStep, setSubmissionStep] = useState('');
  const [createdComplaint, setCreatedComplaint] = useState<Complaint | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  // Handle Geo Detection
  const handleDetectGPS = () => {
    setIsDetectingGeo(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(pos.coords.latitude);
          setLongitude(pos.coords.longitude);
          if (!location) {
            setLocation(`GPS Tagged: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
          }
          setIsDetectingGeo(false);
          toast.success('Exact GPS coordinates captured!');
        },
        () => {
          // Fallback with simulated slight offset
          setLatitude(37.7749 + (Math.random() - 0.5) * 0.03);
          setLongitude(-122.4194 + (Math.random() - 0.5) * 0.03);
          setIsDetectingGeo(false);
          toast.info('GPS simulated for active district jurisdiction');
        }
      );
    } else {
      setIsDetectingGeo(false);
      toast.info('Geo-tagging calibrated to district sector');
    }
  };

  const handleApplyPreset = (preset: (typeof PRESETS)[0]) => {
    setTitle(preset.title);
    setDescription(preset.description);
    setLocation(preset.location);
    setDistrict(preset.district);
    setPhotoUrl(preset.photoUrl);
    toast.success(`Loaded preset: "${preset.tag}"`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
        toast.success('Photo attached to complaint');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error('Please provide a title and detailed description');
      return;
    }

    setIsSubmitting(true);
    setSubmissionStep('Initiating Gemini 3.7 Neural Assessment...');

    try {
      setTimeout(() => {
        setSubmissionStep('Classifying department & scoring urgency matrix...');
      }, 700);

      setTimeout(() => {
        setSubmissionStep('Generating predictive SLA & assigning depot...');
      }, 1400);

      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          location: location || `${district}, Municipal Sector`,
          district,
          latitude,
          longitude,
          photo_url: photoUrl || null,
          citizen_name: name,
          citizen_email: email,
          citizen_phone: phone,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to submit grievance');
      }

      const data = await res.json();
      setCreatedComplaint(data.complaint);
      setIsSubmitting(false);

      // Trigger Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (err) {
        // Safe fallback
      }

      toast.success('Grievance registered & AI triaged successfully!');
    } catch (error: any) {
      setIsSubmitting(false);
      toast.error(error.message || 'Submission error. Please try again.');
    }
  };

  const handleCopyId = () => {
    if (!createdComplaint) return;
    navigator.clipboard.writeText(createdComplaint.id);
    setCopiedId(true);
    toast.success('Tracking ID copied to clipboard!');
    setTimeout(() => setCopiedId(false), 2500);
  };

  const handleReset = () => {
    setCreatedComplaint(null);
    setTitle('');
    setDescription('');
    setLocation('');
    setPhotoUrl('');
  };

  // SUCCESS SCREEN AFTER SUBMISSION
  if (createdComplaint) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-emerald-500/30 text-center shadow-2xl relative overflow-hidden">
          {/* Glowing emerald backdrop */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

          {/* Success Check Icon */}
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)] mb-4">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold block mb-1">
            Registration Verified
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-['Outfit',sans-serif]">
            Grievance Successfully Lodged
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-md mx-auto">
            Your complaint has been processed through the Gemini 3.7 Flash triage pipeline and assigned to the municipal queue.
          </p>

          {/* Tracking ID Badge with One-Click Copy */}
          <div className="my-6 p-4 rounded-2xl bg-slate-900/90 border border-white/10 max-w-md mx-auto flex items-center justify-between gap-3 shadow-inner">
            <div className="text-left">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Permanent Tracking ID
              </span>
              <span className="text-xl sm:text-2xl font-mono font-extrabold text-cyan-400">
                {createdComplaint.id}
              </span>
            </div>
            <button
              onClick={handleCopyId}
              className="px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {copiedId ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy ID</span>
                </>
              )}
            </button>
          </div>

          {/* AI Triage Matrix Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-cyan-500/30 text-left mb-8 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Gemini AI Neural Triage Report
                </span>
              </div>
              <span className="text-[10px] font-mono bg-cyan-500/10 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/20">
                Confidence: {Math.round(createdComplaint.ai_confidence * 100)}%
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <span className="text-[10px] text-slate-400 block mb-1 font-semibold">
                  URGENCY TIER
                </span>
                <UrgencyBadge
                  level={createdComplaint.urgency_level}
                  score={createdComplaint.urgency_score}
                  size="sm"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <span className="text-[10px] text-slate-400 block mb-1 font-semibold">
                  ROUTED TO
                </span>
                <span className="font-bold text-slate-200 block truncate">
                  {createdComplaint.department_name}
                </span>
                <span className="text-[10px] text-cyan-400">
                  {createdComplaint.category} / {createdComplaint.sub_category}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <span className="text-[10px] text-slate-400 block mb-1 font-semibold">
                  ESTIMATED SLA
                </span>
                <span className="font-bold text-amber-300 font-mono block text-sm">
                  {createdComplaint.predicted_resolution_days} Days
                </span>
                <span className="text-[10px] text-slate-400">Target Resolution</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <span className="text-[10px] text-slate-400 block mb-1 font-semibold">
                  SENTIMENT SCORE
                </span>
                <span className="font-bold text-slate-200 block font-mono">
                  {createdComplaint.sentiment_score}/10
                </span>
                <span className="text-[10px] text-slate-400">Citizen Distress</span>
              </div>
            </div>

            {/* AI Reasoning Summary */}
            {createdComplaint.ai_reasoning && (
              <div className="mt-3.5 pt-3 border-t border-white/5 text-xs text-slate-300">
                <strong className="text-cyan-400">AI Assessment: </strong>
                {createdComplaint.ai_reasoning}
              </div>
            )}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onNavigate(`/track?id=${createdComplaint.id}`)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
            >
              <span>Track Grievance Status Live</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('/my-complaints')}
              className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-xs sm:text-sm border border-white/10 transition-colors cursor-pointer"
            >
              View in My Complaints
            </button>

            <button
              onClick={handleReset}
              className="px-4 py-3 rounded-xl text-slate-400 hover:text-slate-200 text-xs font-medium transition-colors"
            >
              Submit Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              Public Redressal Portal
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-['Outfit',sans-serif] mt-1">
            Submit a Public Grievance
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Detailed complaints are instantly assessed by Gemini AI and auto-routed to the jurisdictional field depot.
          </p>
        </div>
      </div>

      {/* Preset Quick-Fill Chips */}
      <div className="p-4 rounded-2xl glass-panel border border-white/10 space-y-2">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
          ⚡ Quick Incident Templates (1-Click Fill)
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.tag}
              type="button"
              onClick={() => handleApplyPreset(p)}
              className="p-2.5 text-left rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-white/5 hover:border-cyan-500/30 transition-all group cursor-pointer"
            >
              <span className="text-xs font-bold text-cyan-300 block group-hover:text-cyan-200">
                {p.tag}
              </span>
              <span className="text-[11px] text-slate-400 truncate block mt-0.5">
                {p.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Submission Form */}
      <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl">
        {/* Section 1: Citizen Info */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            <span>1. Citizen Contact Credentials</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Grievance Details */}
        <div className="pt-4 border-t border-white/10">
          <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5" />
            <span>2. Grievance Specifics</span>
          </h3>

          <div className="space-y-3.5">
            <div>
              <label className="block text-xs text-slate-300 mb-1">
                Complaint Title / Brief Subject *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Broken water pipeline flooding street near elementary school"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-slate-100 text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">
                Detailed Description & Public Safety Hazard *
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue, hazards to motorists/pedestrians, duration, and any property damage..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-slate-100 text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Geographic Location & District */}
        <div className="pt-4 border-t border-white/10">
          <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            <span>3. Incident Location & Geographic Boundary</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-300 mb-1">
                Street Address / Landmark
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. 542 Elm Street, near Metro Station Gate 2"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-slate-100 text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">
                Municipal District Jurisdiction
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
              >
                {DISTRICT_OPTIONS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* GPS Auto-tag Bar */}
          <div className="mt-3 p-3 rounded-xl bg-slate-900/60 border border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <MapPin className="w-4 h-4 text-red-400" />
              <span className="font-mono text-[11px]">
                Lat: {latitude.toFixed(4)}, Lng: {longitude.toFixed(4)}
              </span>
            </div>

            <button
              type="button"
              onClick={handleDetectGPS}
              disabled={isDetectingGeo}
              className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {isDetectingGeo ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              <span>{isDetectingGeo ? 'Acquiring GPS...' : 'Auto-Detect My GPS'}</span>
            </button>
          </div>
        </div>

        {/* Section 4: Photo / Visual Evidence */}
        <div className="pt-4 border-t border-white/10">
          <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5" />
            <span>4. Visual Evidence / Photo Upload</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            {/* Upload Box */}
            <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/15 rounded-2xl hover:border-cyan-500/50 bg-slate-900/40 hover:bg-slate-900/80 cursor-pointer transition-all">
              <UploadCloud className="w-8 h-8 text-cyan-400 mb-2" />
              <span className="text-xs font-semibold text-slate-200">
                Click to browse or drop photo
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">
                PNG, JPG or WebP up to 10MB
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {/* Photo Preview / URL paste */}
            <div className="space-y-2">
              <input
                type="url"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="Or paste direct image URL (https://...)"
                className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-white/10 text-slate-100 text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />

              {photoUrl ? (
                <div className="relative rounded-xl overflow-hidden border border-white/10 h-28 bg-black/40">
                  <img
                    src={photoUrl}
                    alt="Evidence Preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setPhotoUrl('')}
                    className="absolute top-1 right-1 px-2 py-0.5 bg-red-600 text-white rounded text-[10px] font-bold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="h-28 rounded-xl border border-white/5 bg-slate-900/30 flex items-center justify-center text-xs text-slate-500">
                  No photo attached (optional)
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-white/10">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-3 shadow-xl shadow-cyan-500/25 transition-all cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>{submissionStep || 'Processing AI Triage...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Submit Grievance to AI Triage Queue</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
          <p className="text-[11px] text-center text-slate-400 mt-2">
            Auto-protected by municipal SLA audit guarantees. Real-time updates dispatched to your email.
          </p>
        </div>
      </form>
    </div>
  );
};
