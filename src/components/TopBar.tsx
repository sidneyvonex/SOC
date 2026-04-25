import { Bell, Search, ChevronRight, LogOut, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface TopBarProps {
  pageTitle: string;
  searchTerm: string;
  onSearchChange: (v: string) => void;
  onLogout: () => void;
  onNewReport: () => void;
  canSubmit: boolean;
}

const initialsOf = (name?: string) =>
  (name ?? '?')
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

const clearanceBadge = (level?: string) => {
  switch (level) {
    case 'ADMIN':
      return 'bg-rose-100 text-rose-700 border-rose-200';
    case 'FIELD_COMMANDER':
      return 'bg-indigo-100 text-indigo-700 border-indigo-200';
    case 'ANALYST':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    default:
      return 'bg-slate-100 text-slate-600 border-slate-200';
  }
};

export const TopBar = ({
  pageTitle,
  searchTerm,
  onSearchChange,
  onLogout,
  onNewReport,
  canSubmit,
}: TopBarProps) => {
  const { user } = useAuth();
  const role = user?.clearanceLevel?.replace('_', ' ') ?? 'Guest';

  return (
    <header className="sticky top-0 z-30 bg-white/85 backdrop-blur border-b border-slate-200/80">
      <div className="px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Breadcrumb / page */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm text-slate-400 hidden sm:inline">Operations</span>
          <ChevronRight className="w-4 h-4 text-slate-300 hidden sm:inline" />
          <span className="text-sm font-semibold text-slate-800 truncate">{pageTitle}</span>
        </div>

        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search agent, location, summary..."
              className="w-full pl-10 pr-3 py-2 bg-slate-100 border border-transparent rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {canSubmit && (
            <button
              onClick={onNewReport}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-linear-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-sm font-semibold shadow-md shadow-indigo-500/30 transition-all hover:shadow-lg hover:shadow-indigo-500/40"
            >
              <Plus className="w-4 h-4" />
              New Report
            </button>
          )}

          <button
            className="relative w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
            aria-label="Notifications"
          >
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>

          {/* User chip */}
          <div className="hidden sm:flex items-center gap-2.5 pl-2 pr-1 py-1 rounded-xl border border-slate-200 bg-white">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-indigo-500 to-violet-600 text-white text-xs font-bold flex items-center justify-center">
              {initialsOf(user?.fullName)}
            </div>
            <div className="leading-tight pr-1">
              <div className="text-xs font-semibold text-slate-800 max-w-[140px] truncate">
                {user?.fullName ?? '—'}
              </div>
              <span
                className={`inline-block mt-0.5 text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded border ${clearanceBadge(user?.clearanceLevel)}`}
              >
                {role}
              </span>
            </div>
            <button
              onClick={onLogout}
              className="ml-1 w-8 h-8 rounded-lg hover:bg-rose-50 hover:text-rose-600 text-slate-400 flex items-center justify-center transition"
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
