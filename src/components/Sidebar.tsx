import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Shield,
  LayoutDashboard,
  FileText,
  Activity,
  ScrollText,
  UserCircle,
  Settings,
  HelpCircle,
  Lock,
  X,
} from 'lucide-react';

interface SidebarProps {
  active: string;
  onNavigate: (key: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  key: string;
  label: string;
  icon: typeof LayoutDashboard;
}

const MENU: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'reports', label: 'Field Reports', icon: FileText },
  { key: 'activity', label: 'Activity', icon: Activity },
  { key: 'audit', label: 'Audit Log', icon: ScrollText },
];

const PERSONAL: NavItem[] = [
  { key: 'profile', label: 'Profile', icon: UserCircle },
  { key: 'settings', label: 'Settings', icon: Settings },
  { key: 'support', label: 'Support', icon: HelpCircle },
];

export const Sidebar = ({ active, onNavigate, isOpen, onClose }: SidebarProps) => {
  const { user } = useAuth();

  // Close drawer on Escape key (mobile)
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  // Lock body scroll when drawer open on mobile
  useEffect(() => {
    if (isOpen && typeof window !== 'undefined' && window.innerWidth < 1024) {
      const orig = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = orig;
      };
    }
  }, [isOpen]);

  const handleNavigate = (key: string) => {
    onNavigate(key);
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      onClose();
    }
  };

  const renderItem = (item: NavItem) => {
    const Icon = item.icon;
    const isActive = active === item.key;
    return (
      <button
        key={item.key}
        onClick={() => handleNavigate(item.key)}
        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
          isActive
            ? 'bg-linear-to-r from-indigo-50 to-violet-50 text-indigo-700 shadow-sm border border-indigo-100'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        }`}
      >
        <Icon
          className={`w-4.5 h-4.5 shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}
        />
        <span>{item.label}</span>
      </button>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity duration-200 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />

      {/* Drawer / sidebar */}
      <aside
        className={`fixed lg:sticky top-0 z-50 flex flex-col w-64 shrink-0 h-screen bg-white border-r border-slate-200/80 transition-transform duration-300 ease-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Brand */}
        <div className="px-5 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/30">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="leading-tight">
              <div className="font-bold text-slate-900 text-base">G4S SOC</div>
              <div className="text-[11px] text-slate-500 font-medium">Operations Centre</div>
            </div>
          </div>
          {/* Mobile-only close button */}
          <button
            onClick={onClose}
            className="lg:hidden w-9 h-9 rounded-lg hover:bg-slate-100 text-slate-500 flex items-center justify-center transition"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto soc-scroll px-3 py-5 space-y-6">
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold tracking-[0.18em] text-slate-400">
              MENU
            </div>
            <div className="space-y-1">{MENU.map(renderItem)}</div>
          </div>

          <div>
            <div className="px-3 mb-2 text-[10px] font-bold tracking-[0.18em] text-slate-400">
              PERSONAL
            </div>
            <div className="space-y-1">{PERSONAL.map(renderItem)}</div>
          </div>
        </nav>

        {/* Clearance card */}
        <div className="m-3 p-4 rounded-2xl bg-linear-to-br from-slate-900 via-slate-800 to-indigo-900 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-3.5 h-3.5 text-amber-300" />
            <span className="text-[10px] font-bold tracking-widest text-amber-300">
              CLASSIFIED
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-snug">
            Signed in as{' '}
            <span className="font-semibold text-white">{user?.fullName ?? '—'}</span>.
          </p>
          <div className="mt-2 inline-flex items-center px-2.5 py-1 rounded-md bg-white/10 text-[10px] font-bold tracking-wider">
            {user?.clearanceLevel ?? 'GUEST'}
          </div>
        </div>
      </aside>
    </>
  );
};
