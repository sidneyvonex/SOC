import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DEMO_USERS } from '../constants';
import {
  Lock,
  Shield,
  User,
  KeyRound,
  AlertTriangle,
  Loader2,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import { SecurityIllustration } from './SecurityIllustration';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(username, password);

      if (success) {
        toast.success('Access granted', {
          description: 'Authentication successful — entering Operations Centre',
          duration: 1800,
        });
        setTimeout(() => navigate('/dashboard'), 600);
      } else {
        toast.error('Access denied', {
          description: 'Invalid credentials. Please verify and try again.',
        });
      }
    } catch {
      toast.error('Authentication error', {
        description: 'Something went wrong. Try again in a moment.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = (role: keyof typeof DEMO_USERS) => {
    setUsername(DEMO_USERS[role].username);
    setPassword(DEMO_USERS[role].password);
    toast.message('Demo credentials loaded', {
      description: `Filled in for the ${role.toUpperCase()} role`,
      duration: 1400,
    });
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left: Brand + illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-linear-to-br from-indigo-600 via-violet-600 to-fuchsia-600 overflow-hidden">
        {/* Decorative blurred orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-fuchsia-400 rounded-full mix-blend-screen filter blur-3xl opacity-30" />
          <div className="absolute -bottom-40 -right-32 w-[28rem] h-[28rem] bg-indigo-400 rounded-full mix-blend-screen filter blur-3xl opacity-30" />
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-violet-300 rounded-full mix-blend-screen filter blur-3xl opacity-20" />
        </div>

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative z-10 flex flex-col justify-between w-full p-10 xl:p-14 text-white">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <div className="font-bold tracking-tight text-lg leading-none">G4S SOC</div>
              <div className="text-[11px] uppercase tracking-widest text-white/70 mt-1">
                Security Operations Centre
              </div>
            </div>
          </div>

          {/* Illustration + tagline */}
          <div className="flex-1 flex flex-col items-center justify-center -mt-8">
            <SecurityIllustration className="w-full max-w-lg drop-shadow-2xl" />
            <div className="mt-8 text-center max-w-md">
              <h2 className="text-3xl xl:text-4xl font-bold tracking-tight leading-tight">
                Field intelligence, <br />
                <span className="text-fuchsia-200">secured end-to-end.</span>
              </h2>
              <p className="mt-3 text-sm text-white/75 leading-relaxed">
                Sign in to triage incidents, coordinate response teams and keep your operators in
                the loop — all from one classified workspace.
              </p>
            </div>
          </div>

          {/* Footer credentials */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 border border-white/20 backdrop-blur-sm">
              <Lock className="w-3.5 h-3.5" />
              TLS 1.3 mTLS
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 border border-white/20 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              Activity audited
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-rose-500/20 border border-rose-300/40 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-300 animate-pulse" />
              Classified
            </span>
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Mobile brand */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <div className="w-11 h-11 rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/30">
              <Shield className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <div className="font-bold tracking-tight text-lg leading-none text-slate-900">
                G4S SOC
              </div>
              <div className="text-[11px] uppercase tracking-widest text-slate-500 mt-1">
                Security Operations Centre
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Welcome back, operator
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Authenticate to enter your secure workspace.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="username" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. analyst"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition font-medium"
                  required
                  autoComplete="username"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-10 pr-11 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition font-medium"
                  required
                  autoComplete="current-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-linear-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold rounded-xl shadow-md shadow-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/40 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign in securely
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo Access */}
          <div className="mt-8">
            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider">
                  Quick demo access
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <DemoButton
                role="ANALYST"
                tag="Limited"
                onClick={() => quickLogin('analyst')}
                disabled={isLoading}
                tone="emerald"
              />
              <DemoButton
                role="COMMANDER"
                tag="Full"
                onClick={() => quickLogin('commander')}
                disabled={isLoading}
                tone="indigo"
              />
              <DemoButton
                role="ADMIN"
                tag="System"
                onClick={() => quickLogin('admin')}
                disabled={isLoading}
                tone="rose"
              />
            </div>

            <div className="mt-5 flex items-start gap-2.5 p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span className="text-xs text-amber-900 font-medium leading-relaxed">
                Demo credentials are visible for evaluation only. Remove before deploying to
                production.
              </span>
            </div>
          </div>

          <p className="text-center mt-8 text-xs text-slate-400 font-medium">
            Authorised personnel only • All activity monitored and audited
          </p>
        </div>
      </div>
    </div>
  );
};

interface DemoButtonProps {
  role: string;
  tag: string;
  onClick: () => void;
  disabled: boolean;
  tone: 'emerald' | 'indigo' | 'rose';
}

const TONE: Record<DemoButtonProps['tone'], string> = {
  emerald: 'border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50 text-emerald-700',
  indigo: 'border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50 text-indigo-700',
  rose: 'border-rose-200 hover:border-rose-300 hover:bg-rose-50 text-rose-700',
};

const DemoButton = ({ role, tag, onClick, disabled, tone }: DemoButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`group flex flex-col items-start gap-0.5 px-3 py-2.5 bg-white border rounded-xl text-left transition-all disabled:opacity-50 ${TONE[tone]}`}
  >
    <span className="text-[11px] font-bold tracking-wider">{role}</span>
    <span className="text-[10px] text-slate-400 font-medium">{tag}</span>
  </button>
);
