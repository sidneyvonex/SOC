import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DEMO_USERS } from '../constants';
import { Lock, Shield, User, KeyRound, AlertTriangle, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';

/**
 * Login Component
 * Provides authentication interface with role-based access
 * 
 * Security features:
 * - No plain text password display
 * - Login attempt tracking
 * - Clear indication of demo credentials (would be removed in production)
 * - Session management via AuthContext
 */

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(username, password);
      
      if (success) {
        await Swal.fire({
          icon: 'success',
          title: 'Access Granted',
          text: 'Authentication successful',
          timer: 1500,
          showConfirmButton: false,
        });
        navigate('/dashboard');
      } else {
        await Swal.fire({
          icon: 'error',
          title: 'Access Denied',
          text: 'Invalid credentials. Please try again.',
          confirmButtonText: 'OK',
        });
      }
    } catch (err) {
      await Swal.fire({
        icon: 'error',
        title: 'Authentication Error',
        text: 'An error occurred. Please try again.',
        confirmButtonText: 'OK',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = (role: keyof typeof DEMO_USERS) => {
    setUsername(DEMO_USERS[role].username);
    setPassword(DEMO_USERS[role].password);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-red-500 to-pink-600 rounded-2xl mb-4 shadow-2xl">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/30 border border-red-400/50 rounded-full mb-3 backdrop-blur-sm">
            <Lock className="w-4 h-4 text-red-300" />
            <span className="text-red-200 text-sm font-bold tracking-wider">CLASSIFIED</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-2 tracking-tight drop-shadow-lg">G4S SECURITY</h1>
          <p className="text-purple-100 text-lg font-medium">Security Operations Centre</p>
        </div>

        {/* Login Card - More visible with solid background */}
        <div className="bg-slate-800/95 backdrop-blur-md rounded-3xl shadow-2xl border border-purple-500/30 overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-white">Username</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-700/80 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all font-medium"
                    required
                    autoComplete="username"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-white">Password</label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-700/80 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all font-medium"
                    required
                    autoComplete="current-password"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full py-4 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    AUTHENTICATING...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    SECURE LOGIN
                  </>
                )}
              </button>
            </form>

            {/* Demo Access */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-slate-800 text-purple-300 font-semibold">DEMO ACCESS</span>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <button
                  type="button"
                  onClick={() => quickLogin('analyst')}
                  className="w-full px-4 py-3 bg-slate-700/70 hover:bg-slate-600/70 border border-slate-600 rounded-xl text-white text-sm font-semibold transition-all flex items-center justify-between group"
                  disabled={isLoading}
                >
                  <span className="font-bold">ANALYST</span>
                  <span className="text-xs text-purple-300 font-medium">View: LOW, MEDIUM</span>
                </button>
                <button
                  type="button"
                  onClick={() => quickLogin('commander')}
                  className="w-full px-4 py-3 bg-slate-700/70 hover:bg-slate-600/70 border border-slate-600 rounded-xl text-white text-sm font-semibold transition-all flex items-center justify-between group"
                  disabled={isLoading}
                >
                  <span className="font-bold">COMMANDER</span>
                  <span className="text-xs text-purple-300 font-medium">Full Access</span>
                </button>
                <button
                  type="button"
                  onClick={() => quickLogin('admin')}
                  className="w-full px-4 py-3 bg-slate-700/70 hover:bg-slate-600/70 border border-slate-600 rounded-xl text-white text-sm font-semibold transition-all flex items-center justify-between group"
                  disabled={isLoading}
                >
                  <span className="font-bold">ADMIN</span>
                  <span className="text-xs text-purple-300 font-medium">System Admin</span>
                </button>
              </div>
            </div>

            {/* Warning */}
            <div className="mt-4 flex items-start gap-3 p-3 bg-yellow-500/20 border border-yellow-500/40 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
              <span className="text-xs text-yellow-200 font-medium">Production: Remove demo credentials</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-purple-100 text-sm font-medium">
          Authorized Personnel Only • All Activity Monitored
        </p>
      </div>
    </div>
  );
};
