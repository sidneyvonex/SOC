import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import type { FieldReport } from '../types';
import { ReportFeed } from './ReportFeed';
import { ReportForm } from './ReportForm';
import { PriorityDistributionChart } from './PriorityDistributionChart';
import { StatusOverviewChart } from './StatusOverviewChart';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { StatCard } from './StatCard';
import { initialReports } from '../data/mockData';
import { STORAGE_KEYS } from '../constants';
import {
  AlertTriangle,
  FileText,
  CheckCircle,
  Activity,
  ShieldCheck,
  Lock,
  EyeOff,
  Server,
  UserCircle2,
  IdCard,
  Clock,
  LogOut,
} from 'lucide-react';
import { toast } from 'sonner';
import type { ComponentType, SVGProps } from 'react';

export const Dashboard = () => {
  const { user, logout, canViewReport, canEditReport } = useAuth();
  const [allReports, setAllReports] = useState<FieldReport[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeNav, setActiveNav] = useState('dashboard');
  const [showForm, setShowForm] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Load / persist
  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEYS.REPORTS);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as FieldReport[];
        setAllReports(
          parsed.map((r) => ({
            ...r,
            createdAt: new Date(r.createdAt),
            updatedAt: new Date(r.updatedAt),
          })),
        );
      } catch {
        setAllReports(initialReports);
      }
    } else {
      setAllReports(initialReports);
      sessionStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(initialReports));
    }
  }, []);

  const visibleReports = useMemo(
    () => allReports.filter(canViewReport),
    [allReports, canViewReport],
  );

  // Stats based on visible reports only
  const stats = useMemo(() => {
    const total = visibleReports.length;
    const critical = visibleReports.filter((r) => r.priority === 'CRITICAL').length;
    const open = visibleReports.filter((r) => r.status === 'New' || r.status === 'Reviewed').length;
    const actioned = visibleReports.filter((r) => r.status === 'Actioned').length;
    const hidden = allReports.length - visibleReports.length;
    return { total, critical, open, actioned, hidden };
  }, [visibleReports, allReports]);

  // Per brief: any authenticated user can file a field report (gated by ProtectedRoute);
  // editing/triage of existing reports is what's restricted by clearance.
  const canSubmit = !!user;

  const handleLogout = () => {
    toast('Sign out of secure session?', {
      description: 'Your session will end and the audit log will record this action.',
      icon: <LogOut className="w-4 h-4" />,
      duration: 8000,
      action: {
        label: 'Sign out',
        onClick: () => {
          toast.success('Signed out', { description: 'Session ended.', duration: 1400 });
          logout();
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => undefined,
      },
    });
  };

  // Setter that updates state and persists
  const updateReports = (next: FieldReport[]) => {
    setAllReports(next);
    sessionStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(next));
  };

  // For ReportFeed: pass it visible reports and a setter that merges back into the full list
  const setVisibleReports = (next: FieldReport[]) => {
    // Map by id, preserving any reports the user can't see
    const byId = new Map(next.map((r) => [r.id, r]));
    const merged = allReports.map((r) => byId.get(r.id) ?? r);
    // If new reports were added (not in original), append them
    const existingIds = new Set(allReports.map((r) => r.id));
    next.forEach((r) => {
      if (!existingIds.has(r.id)) merged.unshift(r);
    });
    updateReports(merged);
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar
        active={activeNav}
        onNavigate={setActiveNav}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          pageTitle="Dashboard"
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onLogout={handleLogout}
          onNewReport={() => setShowForm(true)}
          onMenuToggle={() => setSidebarOpen((v) => !v)}
          canSubmit={canSubmit}
        />

        <main className="flex-1 px-4 sm:px-6 py-5 sm:py-6 space-y-5 sm:space-y-6">
          {/* Greeting */}
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Welcome back, {user?.fullName?.split(' ')[0] ?? 'Operator'}
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Here&apos;s the field intelligence picture for today.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                All systems operational
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-600 border border-slate-200 font-semibold">
                <Server className="w-3.5 h-3.5" />
                Encrypted session
              </span>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              label="Critical incidents"
              value={stats.critical}
              icon={AlertTriangle}
              tone="rose"
              delta={12}
            />
            <StatCard
              label="Open queue"
              value={stats.open}
              icon={FileText}
              tone="amber"
              delta={-23}
            />
            <StatCard
              label="Actioned"
              value={stats.actioned}
              icon={CheckCircle}
              tone="emerald"
              delta={8}
            />
            <StatCard
              label="Total visible"
              value={stats.total}
              icon={Activity}
              tone="indigo"
              delta={5}
            />
          </div>

          {/* Operator info + charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <OperatorCard hiddenCount={stats.hidden} />
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
              <PriorityDistributionChart reports={visibleReports} />
              <StatusOverviewChart reports={visibleReports} />
            </div>
          </div>

          {/* Field reports */}
          <ReportFeed
            reports={visibleReports}
            setReports={setVisibleReports}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onNewReport={() => setShowForm(true)}
            canSubmit={canSubmit}
          />

          {/* Footer */}
          <footer className="pt-2 pb-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
            <Lock className="w-3.5 h-3.5" />
            All activity audited and logged. Clearance{' '}
            <span className="font-semibold text-slate-600">
              {user?.clearanceLevel?.replace('_', ' ')}
            </span>{' '}
            • You can edit:{' '}
            <span className="font-semibold text-slate-600">
              {visibleReports.filter(canEditReport).length}
            </span>
            /{stats.total}
          </footer>
        </main>
      </div>

      {/* Modal */}
      <ReportForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        reports={allReports}
        setReports={updateReports}
      />
    </div>
  );
};

const OperatorCard = ({ hiddenCount }: { hiddenCount: number }) => {
  const { user } = useAuth();
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Operator Profile</h3>
          <p className="text-xs text-slate-500">Session credentials</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-violet-50 ring-4 ring-violet-100 flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-violet-500" />
        </div>
      </div>

      <div className="space-y-3">
        <Row icon={UserCircle2} label="Full name" value={user?.fullName ?? '—'} />
        <Row icon={IdCard} label="Username" value={user?.username ?? '—'} />
        <Row
          icon={ShieldCheck}
          label="Clearance"
          value={user?.clearanceLevel?.replace('_', ' ') ?? '—'}
        />
        <Row
          icon={Clock}
          label="Last login"
          value={
            user?.lastLogin
              ? new Date(user.lastLogin).toLocaleString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Now'
          }
        />
      </div>

      {hiddenCount > 0 && (
        <div className="mt-4 flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
          <EyeOff className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
          <p className="text-xs text-slate-600 leading-relaxed">
            <span className="font-semibold text-slate-800">{hiddenCount}</span> report
            {hiddenCount === 1 ? '' : 's'} hidden — your clearance level does not permit access.
          </p>
        </div>
      )}
    </div>
  );
};

type IconType = ComponentType<SVGProps<SVGSVGElement> & { strokeWidth?: number }>;

const Row = ({ icon: Icon, label, value }: { icon: IconType; label: string; value: string }) => (
  <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-b-0">
    <div className="flex items-center gap-2.5 text-sm text-slate-600 font-medium">
      <Icon className="w-4 h-4 text-slate-400" strokeWidth={2} />
      {label}
    </div>
    <div className="text-sm text-slate-900 font-semibold truncate max-w-[55%] text-right">
      {value}
    </div>
  </div>
);
