import { useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import type { FieldReport } from '../types';
import { Priority, ReportStatus } from '../types';
import { useAuth } from '../context/AuthContext';
import { generateId, sanitizeInput } from '../utils/helpers';
import { STORAGE_KEYS } from '../constants';
import {
  X,
  Send,
  MapPin,
  User as UserIcon,
  Clock,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import { toast } from 'sonner';

interface ReportFormProps {
  isOpen: boolean;
  onClose: () => void;
  reports: FieldReport[];
  setReports: (reports: FieldReport[]) => void;
}

const PRIORITY_PILL: Record<Priority, string> = {
  CRITICAL: 'border-rose-300 text-rose-700 bg-rose-50',
  HIGH:     'border-orange-300 text-orange-700 bg-orange-50',
  MEDIUM:   'border-amber-300 text-amber-700 bg-amber-50',
  LOW:      'border-emerald-300 text-emerald-700 bg-emerald-50',
};

export const ReportForm = ({ isOpen, onClose, reports, setReports }: ReportFormProps) => {
  const { user } = useAuth();
  const [agent, setAgent] = useState('');
  const [location, setLocation] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
  const [summary, setSummary] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const reset = () => {
    setAgent('');
    setLocation('');
    setTimestamp('');
    setPriority(Priority.MEDIUM);
    setSummary('');
  };

  const handleClose = () => {
    if (submitting) return;
    reset();
    onClose();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!agent.trim() || !location.trim() || !timestamp.trim() || !summary.trim()) {
      toast.warning('Missing fields', {
        description: 'All fields are required to log a field report.',
      });
      return;
    }
    if (summary.trim().length < 10) {
      toast.warning('Summary too short', {
        description: 'Provide at least 10 characters of context.',
      });
      return;
    }

    setSubmitting(true);

    const newReport: FieldReport = {
      id: generateId(),
      agent: sanitizeInput(agent.trim().toUpperCase()),
      location: sanitizeInput(location.trim()),
      timestamp: sanitizeInput(timestamp.trim().toUpperCase()),
      priority,
      status: ReportStatus.NEW,
      summary: sanitizeInput(summary.trim()),
      createdAt: new Date(),
      updatedAt: new Date(),
      submittedBy: user?.username ?? 'unknown',
    };

    const updated = [newReport, ...reports];
    setReports(updated);
    sessionStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(updated));

    console.log(
      `[AUDIT] ${user?.username} submitted new ${priority} report ${newReport.id} from ${newReport.agent}`,
    );

    setSubmitting(false);
    reset();
    onClose();

    toast.success('Report submitted', {
      description: `Field report from ${newReport.agent} has been logged.`,
      duration: 2200,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-linear-to-r from-indigo-50 via-violet-50 to-pink-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/30">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">New Field Report</h2>
              <p className="text-xs text-slate-500">
                Submitting as <span className="font-semibold text-slate-700">{user?.fullName}</span>{' '}
                • {user?.clearanceLevel}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-9 h-9 rounded-lg hover:bg-slate-200/60 text-slate-500 flex items-center justify-center transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto soc-scroll">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Agent codename" icon={UserIcon}>
              <input
                value={agent}
                onChange={(e) => setAgent(e.target.value)}
                placeholder="e.g. FALCON"
                maxLength={20}
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 font-medium uppercase tracking-wide"
              />
            </Field>

            <Field label="Location" icon={MapPin}>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Mombasa"
                maxLength={60}
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 font-medium"
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Time (24h)" icon={Clock}>
              <input
                value={timestamp}
                onChange={(e) => setTimestamp(e.target.value)}
                placeholder="e.g. 1430H"
                maxLength={10}
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 font-medium"
              />
            </Field>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Priority
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(Object.values(Priority) as Priority[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`py-2 rounded-lg text-xs font-bold border transition-all ${
                      priority === p
                        ? `${PRIORITY_PILL[p]} ring-2 ring-offset-1 ring-indigo-300`
                        : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Summary
            </label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Describe what was observed, when, and any source reliability notes..."
              rows={5}
              maxLength={1000}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 font-medium resize-none soc-scroll"
            />
            <div className="text-[11px] text-slate-400 text-right">{summary.length}/1000</div>
          </div>

          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-50 border border-amber-200">
            <ShieldCheck className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-900 leading-relaxed">
              Inputs are sanitised and recorded against your operator ID. Treat all entries as
              classified.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-linear-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold flex items-center gap-2 shadow-md shadow-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/40 disabled:opacity-50 transition-all"
            >
              <Send className="w-4 h-4" />
              {submitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface FieldProps {
  label: string;
  icon: typeof UserIcon;
  children: ReactNode;
}

const Field = ({ label, icon: Icon, children }: FieldProps) => (
  <div className="space-y-1.5">
    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{label}</label>
    <div className="relative">
      <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      {children}
    </div>
  </div>
);

