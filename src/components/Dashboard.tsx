import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import type { FieldReport } from '../types';
import { ReportFeed } from './ReportFeed';
import { PriorityDistributionChart } from './PriorityDistributionChart';
import { StatusOverviewChart } from './StatusOverviewChart';
import { initialReports } from '../data/mockData';
import { STORAGE_KEYS } from '../constants';
import { 
  Shield, 
  RefreshCw, 
  LogOut, 
  AlertTriangle, 
  FileText, 
  Zap, 
  BookOpen,
  TrendingUp,
  TrendingDown,
  Activity
} from 'lucide-react';
import Swal from 'sweetalert2';

export const Dashboard = () => {
  const { user, logout, canViewReport } = useAuth();
  const [reports, setReports] = useState<FieldReport[]>([]);

  useEffect(() => {
    const storedReports = sessionStorage.getItem(STORAGE_KEYS.REPORTS);
    if (storedReports) {
      try {
        setReports(JSON.parse(storedReports));
      } catch (error) {
        console.error('Failed to parse stored reports:', error);
        setReports(initialReports);
      }
    } else {
      setReports(initialReports);
      sessionStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(initialReports));
    }
  }, []);

  const visibleReports = reports.filter(canViewReport);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Sign Out?',
      text: 'Are you sure you want to sign out?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, sign out',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      await Swal.fire({
        icon: 'success',
        title: 'Signed Out',
        text: 'Session terminated successfully',
        timer: 1500,
        showConfirmButton: false,
      });
      logout();
    }
  };

  const handleRefresh = async () => {
    await Swal.fire({
      icon: 'success',
      title: 'Data Refreshed',
      text: 'All data has been updated',
      timer: 1000,
      showConfirmButton: false,
    });
  };

  const criticalCount = visibleReports.filter(r => r.priority === 'CRITICAL').length;
  const openIncidents = visibleReports.filter(r => r.status === 'New' || r.status === 'Reviewed').length;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/95 backdrop-blur-md border-b border-purple-500/30 sticky top-0 z-50 shadow-lg">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-linear-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">G4S Security Operations</h1>
                  <p className="text-sm text-gray-300">
                    Welcome back, <span className="text-white font-semibold">{user?.fullName}</span> • <span className="text-purple-400 font-semibold">{user?.clearanceLevel}</span>
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/40 rounded-xl">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-sm text-green-300 font-semibold">All Systems Operational</span>
              </div>
              <button 
                onClick={handleRefresh}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors flex items-center gap-2 shadow-md"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="text-sm font-semibold">Refresh</span>
              </button>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors flex items-center gap-2 shadow-md"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-semibold">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Active Threats */}
          <div className="bg-linear-to-br from-red-500/20 to-red-600/20 border border-red-500/30 rounded-2xl p-6 hover:shadow-lg hover:shadow-red-500/20 transition-all group backdrop-blur-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-red-500/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div className="flex items-center gap-1 text-red-400 text-sm font-semibold">
                <TrendingUp className="w-4 h-4" />
                <span>+12%</span>
              </div>
            </div>
            <div>
              <p className="text-gray-300 text-sm font-semibold mb-1">Active Threats</p>
              <p className="text-4xl font-bold text-white">{criticalCount}</p>
              <p className="text-red-400 text-xs mt-2 font-medium">from last week</p>
            </div>
          </div>

          {/* IOCs Tracked */}
          <div className="bg-linear-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-2xl p-6 hover:shadow-lg hover:shadow-blue-500/20 transition-all group backdrop-blur-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex items-center gap-1 text-blue-400 text-sm font-semibold">
                <TrendingUp className="w-4 h-4" />
                <span>+5.2%</span>
              </div>
            </div>
            <div>
              <p className="text-gray-300 text-sm font-semibold mb-1">IOCs Tracked</p>
              <p className="text-4xl font-bold text-white">{visibleReports.length}</p>
              <p className="text-blue-400 text-xs mt-2 font-medium">from last week</p>
            </div>
          </div>

          {/* Open Incidents */}
          <div className="bg-linear-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 rounded-2xl p-6 hover:shadow-lg hover:shadow-yellow-500/20 transition-all group backdrop-blur-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-500/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="flex items-center gap-1 text-green-400 text-sm font-semibold">
                <TrendingDown className="w-4 h-4" />
                <span>-23%</span>
              </div>
            </div>
            <div>
              <p className="text-gray-300 text-sm font-semibold mb-1">Open Incidents</p>
              <p className="text-4xl font-bold text-white">{openIncidents}</p>
              <p className="text-green-400 text-xs mt-2 font-medium">from last week</p>
            </div>
          </div>

          {/* Knowledge Articles */}
          <div className="bg-linear-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-2xl p-6 hover:shadow-lg hover:shadow-purple-500/20 transition-all group backdrop-blur-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6 text-purple-400" />
              </div>
              <div className="flex items-center gap-1 text-purple-400 text-sm font-semibold">
                <TrendingUp className="w-4 h-4" />
                <span>+6%</span>
              </div>
            </div>
            <div>
              <p className="text-gray-300 text-sm font-semibold mb-1">Knowledge Articles</p>
              <p className="text-4xl font-bold text-white">0</p>
              <p className="text-purple-400 text-xs mt-2 font-medium">from last week</p>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PriorityDistributionChart reports={visibleReports} />
          <StatusOverviewChart reports={visibleReports} />
        </div>

        {/* Report Feed */}
        <ReportFeed reports={visibleReports} setReports={setReports} />
      </main>

      {/* Footer */}
      <footer className="bg-slate-800/90 backdrop-blur-md border-t border-purple-500/30 py-4 shadow-lg">
        <div className="px-6">
          <div className="flex items-center justify-center gap-2 text-gray-300 text-sm font-medium">
            <Activity className="w-4 h-4 text-purple-400" />
            <span>All activity monitored and logged • Clearance: <span className="text-purple-400 font-semibold">{user?.clearanceLevel}</span> • Session active</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
