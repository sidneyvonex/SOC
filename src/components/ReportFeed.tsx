import { useState, Fragment, useMemo, useEffect } from 'react';
import type { FieldReport } from '../types';
import { ReportStatus, Priority } from '../types';
import { useAuth } from '../context/AuthContext';
import { formatTimestamp, priorityOrder } from '../utils/helpers';
import { STORAGE_KEYS } from '../constants';
import {
  Filter,
  Search,
  MapPin,
  User,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Archive,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  ArrowUpDown,
  Plus,
  Inbox,
  ShieldAlert,
} from 'lucide-react';
import { toast } from 'sonner';

interface ReportFeedProps {
  reports: FieldReport[];
  setReports: (reports: FieldReport[]) => void;
  searchTerm: string;
  onSearchChange: (v: string) => void;
  onNewReport: () => void;
  canSubmit: boolean;
}

type SortMode = 'newest' | 'oldest' | 'priority' | 'status';

const PRIORITY_PILL: Record<string, string> = {
  CRITICAL: 'text-rose-700 bg-rose-50 border-rose-200',
  HIGH:     'text-orange-700 bg-orange-50 border-orange-200',
  MEDIUM:   'text-amber-700 bg-amber-50 border-amber-200',
  LOW:      'text-emerald-700 bg-emerald-50 border-emerald-200',
};

const STATUS_PILL: Record<string, string> = {
  New:      'text-indigo-700 bg-indigo-50 border-indigo-200',
  Reviewed: 'text-amber-700 bg-amber-50 border-amber-200',
  Actioned: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  Closed:   'text-slate-600 bg-slate-100 border-slate-200',
};

const statusOrder: Record<string, number> = {
  New: 0,
  Reviewed: 1,
  Actioned: 2,
  Closed: 3,
};

export const ReportFeed = ({
  reports,
  setReports,
  searchTerm,
  onSearchChange,
  onNewReport,
  canSubmit,
}: ReportFeedProps) => {
  const { canEditReport, user } = useAuth();
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [sortMode, setSortMode] = useState<SortMode>('newest');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'New':      return <AlertCircle className="w-3.5 h-3.5" />;
      case 'Reviewed': return <Clock className="w-3.5 h-3.5" />;
      case 'Actioned': return <CheckCircle className="w-3.5 h-3.5" />;
      case 'Closed':   return <Archive className="w-3.5 h-3.5" />;
      default:         return <AlertCircle className="w-3.5 h-3.5" />;
    }
  };

  const handleStatusChange = (reportId: string, newStatus: ReportStatus) => {
    const report = reports.find((r) => r.id === reportId);
    if (!report) return;
    if (!canEditReport(report)) {
      toast.error('Permission denied', {
        description: 'Your clearance level does not permit this action.',
      });
      return;
    }
    if (report.status === newStatus) return;

    const previousStatus = report.status;

    const apply = (status: ReportStatus) => {
      const next = reports.map((r) =>
        r.id === reportId
          ? { ...r, status, updatedAt: new Date(), lastModifiedBy: user?.username }
          : r,
      );
      setReports(next);
      sessionStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(next));
      console.log(`[AUDIT] ${user?.username} changed ${reportId} → ${status}`);
    };

    apply(newStatus);

    toast.success(`Status → ${newStatus}`, {
      description: `Report #${reportId.slice(-6)} updated by ${user?.username}.`,
      duration: 4000,
      action: {
        label: 'Undo',
        onClick: () => {
          apply(previousStatus);
          toast.message('Status reverted', {
            description: `Restored to ${previousStatus}.`,
            duration: 1800,
          });
        },
      },
    });
  };

  const filteredAndSorted = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    const filtered = reports.filter((r) => {
      const matchesSearch =
        !term ||
        r.agent.toLowerCase().includes(term) ||
        r.location.toLowerCase().includes(term) ||
        r.summary.toLowerCase().includes(term);
      const matchesSeverity = filterSeverity === 'All' || r.priority === filterSeverity;
      const matchesStatus = filterStatus === 'All' || r.status === filterStatus;
      return matchesSearch && matchesSeverity && matchesStatus;
    });

    const sorted = [...filtered];
    switch (sortMode) {
      case 'newest':
        sorted.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
      case 'oldest':
        sorted.sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
        break;
      case 'priority':
        sorted.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
        break;
      case 'status':
        sorted.sort(
          (a, b) => (statusOrder[a.status] ?? 99) - (statusOrder[b.status] ?? 99),
        );
        break;
    }
    return sorted;
  }, [reports, searchTerm, filterSeverity, filterStatus, sortMode]);

  const clearFilters = () => {
    onSearchChange('');
    setFilterSeverity('All');
    setFilterStatus('All');
    setSortMode('newest');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900">Field Reports</h2>
          <p className="text-xs text-slate-500">
            {filteredAndSorted.length} of {reports.length} visible at your clearance
          </p>
        </div>
        {canSubmit && (
          <button
            onClick={onNewReport}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-linear-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-sm font-semibold shadow-md shadow-indigo-500/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            New Report
          </button>
        )}
      </div>

      {/* Filters bar */}
      <div className="px-5 py-3 bg-slate-50/60 border-b border-slate-100 flex flex-wrap items-center gap-2.5">
        <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold mr-1">
          <Filter className="w-3.5 h-3.5" />
          <span className="uppercase tracking-wider">Filter</span>
        </div>

        <div className="relative md:hidden flex-1 min-w-50">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        <select
          value={filterSeverity}
          onChange={(e) => setFilterSeverity(e.target.value)}
          className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-200"
        >
          <option value="All">All severities</option>
          {(Object.values(Priority) as string[]).map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-200"
        >
          <option value="All">All statuses</option>
          {(Object.values(ReportStatus) as string[]).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <div className="relative">
          <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          <select
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value as SortMode)}
            className="pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-200 appearance-none"
          >
            <option value="newest">Sort: Newest first</option>
            <option value="oldest">Sort: Oldest first</option>
            <option value="priority">Sort: Priority (high → low)</option>
            <option value="status">Sort: Status (new → closed)</option>
          </select>
        </div>

        <button
          onClick={clearFilters}
          className="ml-auto px-3 py-2 rounded-lg text-sm font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
        >
          Clear
        </button>
      </div>

      {/* Table / Empty */}
      {reports.length === 0 ? (
        <EmptyState
          title="No reports available"
          subtitle="Reports visible at your clearance level will appear here."
        />
      ) : filteredAndSorted.length === 0 ? (
        <EmptyState
          title="No matching reports"
          subtitle="Try clearing the filters or changing your search term."
        />
      ) : (
        <div className="overflow-x-auto soc-scroll">
          <table className="w-full text-sm">
            <thead className="bg-slate-50/70 border-b border-slate-100">
              <tr className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-5 py-3">Incident</th>
                <th className="px-5 py-3">Severity</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Location</th>
                <th className="px-5 py-3">Submitted</th>
                <th className="px-5 py-3">Created</th>
                <th className="px-5 py-3 w-12" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAndSorted.map((report) => (
                <Fragment key={report.id}>
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1.5 max-w-md">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-slate-400 tracking-wider">
                            #{report.id.slice(-6)}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-semibold text-slate-700">
                            <User className="w-3 h-3" />
                            {report.agent}
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium">
                            {report.timestamp}
                          </span>
                        </div>
                        <div className="text-sm text-slate-700 line-clamp-2">{report.summary}</div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${PRIORITY_PILL[report.priority]}`}
                      >
                        {report.priority === 'CRITICAL' && <AlertTriangle className="w-3 h-3" />}
                        {report.priority}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${STATUS_PILL[report.status]}`}
                      >
                        {getStatusIcon(report.status)}
                        {report.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 text-sm text-slate-600 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {report.location}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600 font-medium">
                      {report.submittedBy}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {formatTimestamp(report.createdAt)}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() =>
                          setSelectedReport(selectedReport === report.id ? null : report.id)
                        }
                        className="w-8 h-8 inline-flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition"
                        aria-label="Toggle details"
                      >
                        {selectedReport === report.id ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                  {selectedReport === report.id && (
                    <tr>
                      <td colSpan={7} className="px-5 py-4 bg-slate-50/50">
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Detail label="Last updated" value={formatTimestamp(report.updatedAt)} />
                            <Detail label="Agent time" value={report.timestamp} />
                            <Detail
                              label="Modified by"
                              value={report.lastModifiedBy ?? '—'}
                            />
                            <Detail label="Location" value={report.location} />
                          </div>

                          {canEditReport(report) ? (
                            <StatusStepper
                              currentStatus={report.status}
                              onChange={(s) => handleStatusChange(report.id, s)}
                            />
                          ) : (
                            <div className="flex items-center gap-2.5 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                              <span className="text-xs text-amber-900 font-medium">
                                Read-only at your clearance level.
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const STEP_ORDER: ReportStatus[] = [
  ReportStatus.NEW,
  ReportStatus.REVIEWED,
  ReportStatus.ACTIONED,
  ReportStatus.CLOSED,
];

const STEP_META: Record<
  string,
  { label: string; Icon: typeof AlertCircle; activeColor: string; ring: string }
> = {
  New:      { label: 'New',      Icon: AlertCircle,  activeColor: 'bg-indigo-500 text-white',   ring: 'ring-indigo-200' },
  Reviewed: { label: 'Reviewed', Icon: Clock,        activeColor: 'bg-amber-500 text-white',    ring: 'ring-amber-200' },
  Actioned: { label: 'Actioned', Icon: CheckCircle,  activeColor: 'bg-emerald-500 text-white',  ring: 'ring-emerald-200' },
  Closed:   { label: 'Closed',   Icon: Archive,      activeColor: 'bg-slate-600 text-white',    ring: 'ring-slate-200' },
};

interface StatusStepperProps {
  currentStatus: ReportStatus;
  onChange: (status: ReportStatus) => void;
}

const StatusStepper = ({ currentStatus, onChange }: StatusStepperProps) => {
  const currentIdx = STEP_ORDER.indexOf(currentStatus);
  const [pending, setPending] = useState<ReportStatus | null>(null);

  // Clear stale pending if currentStatus updated externally to that value
  useEffect(() => {
    if (pending && pending === currentStatus) setPending(null);
  }, [currentStatus, pending]);

  const pendingMeta = pending ? STEP_META[pending] : null;

  const handleConfirm = () => {
    if (pending) {
      onChange(pending);
      setPending(null);
    }
  };

  return (
    <div className="border-t border-slate-200 pt-4">
      <div className="flex items-center justify-between mb-3 gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          Update status
        </span>
        <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
          Select a stage — confirmation required
        </span>
      </div>

      <div className="relative">
        {/* Base connector */}
        <div className="absolute left-5 right-5 top-5 h-0.5 bg-slate-200 rounded-full" />
        {/* Filled connector to current */}
        <div
          className="absolute left-5 top-5 h-0.5 bg-linear-to-r from-indigo-400 via-amber-400 to-emerald-500 rounded-full transition-all duration-500"
          style={{
            width: `calc((100% - 2.5rem) * ${currentIdx / (STEP_ORDER.length - 1)})`,
          }}
        />

        <ol className="relative grid grid-cols-4 gap-1 sm:gap-2">
          {STEP_ORDER.map((status, idx) => {
            const meta = STEP_META[status];
            const isActive = idx === currentIdx;
            const isComplete = idx < currentIdx;
            const isPending = pending === status;

            return (
              <li key={status} className="flex flex-col items-center text-center">
                <button
                  type="button"
                  onClick={() => {
                    if (isActive) return;
                    setPending(isPending ? null : status);
                  }}
                  aria-current={isActive ? 'step' : undefined}
                  aria-pressed={isPending}
                  aria-label={`Set status to ${meta.label}`}
                  className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all border-2 ${
                    isActive
                      ? `${meta.activeColor} border-transparent ring-4 ${meta.ring} cursor-default`
                      : isPending
                        ? `${meta.activeColor} border-transparent ring-4 ${meta.ring} animate-pulse`
                        : isComplete
                          ? 'bg-white border-emerald-400 text-emerald-500 hover:scale-105'
                          : 'bg-white border-slate-200 text-slate-400 hover:border-indigo-300 hover:text-indigo-500 hover:scale-105'
                  } ${!isActive ? 'cursor-pointer' : ''}`}
                >
                  <meta.Icon className="w-4 h-4" strokeWidth={2.5} />
                </button>
                <span
                  className={`mt-2 text-[10px] sm:text-[11px] font-bold tracking-wide ${
                    isActive || isPending ? 'text-slate-900' : 'text-slate-500'
                  }`}
                >
                  {meta.label}
                </span>
                {isActive && (
                  <span className="text-[10px] text-slate-400 font-medium mt-0.5 hidden sm:inline">
                    Current
                  </span>
                )}
                {isPending && (
                  <span className="text-[10px] text-indigo-500 font-bold mt-0.5">Pending</span>
                )}
              </li>
            );
          })}
        </ol>
      </div>

      {/* Confirmation panel — appears when a pending status is selected */}
      {pending && pendingMeta && (
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200">
          <div className="flex items-start gap-3">
            <div
              className={`w-9 h-9 rounded-xl ${pendingMeta.activeColor} flex items-center justify-center shrink-0`}
            >
              <pendingMeta.Icon className="w-4 h-4" strokeWidth={2.5} />
            </div>
            <div className="text-sm text-slate-700 leading-snug">
              <div className="font-semibold text-slate-900">
                Confirm change: {STEP_META[currentStatus].label}{' '}
                <span className="text-slate-400">→</span> {pendingMeta.label}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                This update is signed against your operator ID and recorded in the audit log.
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:shrink-0 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => setPending(null)}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-white transition shadow-md ${pendingMeta.activeColor.split(' ')[0]} hover:opacity-90`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Confirm change
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Detail = ({ label, value }: { label: string; value: string }) => (
  <div>
    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</div>
    <div className="text-sm text-slate-800 font-medium mt-0.5">{value}</div>
  </div>
);

const EmptyState = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="flex flex-col items-center justify-center text-center py-14 px-6">
    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
      <Inbox className="w-5 h-5 text-slate-400" />
    </div>
    <p className="text-sm font-semibold text-slate-700">{title}</p>
    <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
  </div>
);
