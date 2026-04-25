import { useState, Fragment } from 'react';
import type { FieldReport } from '../types';
import { ReportStatus } from '../types';
import { useAuth } from '../context/AuthContext';
import { formatTimestamp } from '../utils/helpers';
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
  AlertTriangle
} from 'lucide-react';
import Swal from 'sweetalert2';

interface ReportFeedProps {
  reports: FieldReport[];
  setReports: (reports: FieldReport[]) => void;
}

export const ReportFeed = ({ reports, setReports }: ReportFeedProps) => {
  const { canEditReport, user } = useAuth();
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('All Severities');
  const [filterStatus, setFilterStatus] = useState('All Status');

  const getSeverityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'text-red-500 bg-red-500/10 border-red-500/30';
      case 'HIGH': return 'text-orange-500 bg-orange-500/10 border-orange-500/30';
      case 'MEDIUM': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
      case 'LOW': return 'text-green-500 bg-green-500/10 border-green-500/30';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'text-blue-500 bg-blue-500/10 border-blue-500/30';
      case 'Reviewed': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
      case 'Actioned': return 'text-green-500 bg-green-500/10 border-green-500/30';
      case 'Closed': return 'text-gray-500 bg-gray-500/10 border-gray-500/30';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'New': return <AlertCircle className="w-4 h-4" />;
      case 'Reviewed': return <Clock className="w-4 h-4" />;
      case 'Actioned': return <CheckCircle className="w-4 h-4" />;
      case 'Closed': return <Archive className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const handleStatusChange = async (reportId: string, newStatus: ReportStatus) => {
    const report = reports.find(r => r.id === reportId);
    if (!report || !canEditReport(report)) {
      await Swal.fire({
        icon: 'error',
        title: 'Permission Denied',
        text: 'You do not have permission to edit this report.',
        confirmButtonText: 'OK',
      });
      return;
    }

    const updatedReports = reports.map(r => 
      r.id === reportId 
        ? { 
            ...r, 
            status: newStatus, 
            updatedAt: new Date(),
            lastModifiedBy: user?.username 
          }
        : r
    );

    setReports(updatedReports);
    sessionStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(updatedReports));
    
    console.log(`[AUDIT] ${user?.username} changed report ${reportId} status to ${newStatus}`);
    
    await Swal.fire({
      icon: 'success',
      title: 'Status Updated',
      text: `Report status changed to ${newStatus}`,
      timer: 1500,
      showConfirmButton: false,
    });
  };

  // Filter reports
  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.agent.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.summary.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSeverity = filterSeverity === 'All Severities' || report.priority === filterSeverity;
    const matchesStatus = filterStatus === 'All Status' || report.status === filterStatus;

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setFilterSeverity('All Severities');
    setFilterStatus('All Status');
  };

  if (reports.length === 0) {
    return (
      <div className="bg-slate-800/90 backdrop-blur-md border border-slate-600/50 rounded-2xl p-8">
        <p className="text-center text-gray-300 font-medium">No reports available for your clearance level.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters & Search */}
      <div className="bg-slate-800/90 backdrop-blur-md border border-purple-500/30 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-white">
            <Filter className="w-5 h-5 text-purple-400" />
            <span className="font-bold">Filters & Search</span>
          </div>

          <div className="flex-1 min-w-62.5 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search incidents..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-700/70 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select 
            className="px-4 py-2.5 bg-slate-700/70 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-medium"
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
          >
            <option>All Severities</option>
            <option>CRITICAL</option>
            <option>HIGH</option>
            <option>MEDIUM</option>
            <option>LOW</option>
          </select>

          <select 
            className="px-4 py-2.5 bg-slate-700/70 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-medium"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option>All Status</option>
            <option>New</option>
            <option>Reviewed</option>
            <option>Actioned</option>
            <option>Closed</option>
          </select>

          <button 
            onClick={clearFilters}
            className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-all font-bold shadow-md"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Security Incidents Table */}
      <div className="bg-slate-800/90 backdrop-blur-md border border-purple-500/30 rounded-2xl overflow-hidden shadow-lg">
        <div className="flex items-center justify-between p-5 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">Security Incidents ({filteredReports.length})</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Incident</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Severity</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Assigned To</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Created</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {filteredReports.map((report) => (
                <Fragment key={report.id}>
                  <tr 
                    className="hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-bold text-white mb-1">{report.id}</div>
                        <div className="text-sm text-gray-400 line-clamp-2 max-w-xs">{report.summary}</div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-700 rounded-md text-xs text-gray-300">
                            <User className="w-3 h-3" />
                            {report.agent}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${getSeverityColor(report.priority)}`}>
                        {report.priority === 'CRITICAL' && <AlertTriangle className="w-3 h-3" />}
                        {report.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${getStatusColor(report.status)}`}>
                        {getStatusIcon(report.status)}
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 border border-purple-500/30 text-purple-400 rounded-lg text-xs font-medium">
                        <MapPin className="w-3 h-3" />
                        {report.location}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-white">{report.submittedBy}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-gray-400">
                        <Calendar className="w-4 h-4" />
                        {formatTimestamp(report.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => setSelectedReport(selectedReport === report.id ? null : report.id)}
                        className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        {selectedReport === report.id ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </td>
                  </tr>
                  {selectedReport === report.id && (
                    <tr>
                      <td colSpan={7} className="px-6 py-5 bg-slate-700/20">
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <span className="text-gray-400 text-xs font-medium">Updated:</span>
                              <div className="text-white text-sm mt-1">{formatTimestamp(report.updatedAt)}</div>
                            </div>
                            <div>
                              <span className="text-gray-400 text-xs font-medium">Timestamp:</span>
                              <div className="text-white text-sm mt-1">{report.timestamp}</div>
                            </div>
                            <div>
                              <span className="text-gray-400 text-xs font-medium">Modified By:</span>
                              <div className="text-white text-sm mt-1">{report.lastModifiedBy || 'N/A'}</div>
                            </div>
                            <div>
                              <span className="text-gray-400 text-xs font-medium">Location:</span>
                              <div className="text-white text-sm mt-1">{report.location}</div>
                            </div>
                          </div>

                          {/* Status Update Controls */}
                          {canEditReport(report) && (
                            <div className="border-t border-slate-600 pt-4">
                              <span className="text-sm text-gray-400 block mb-3 font-medium">Update Status:</span>
                              <div className="flex flex-wrap gap-2">
                                {Object.values(ReportStatus).map(status => (
                                  <button
                                    key={status}
                                    onClick={() => handleStatusChange(report.id, status)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                      report.status === status 
                                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' 
                                        : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                                    }`}
                                  >
                                    {status}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                          {!canEditReport(report) && (
                            <div className="flex items-center gap-3 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                              <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0" />
                              <span className="text-sm text-yellow-300">Read-only: Your clearance level does not permit status changes</span>
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
      </div>
    </div>
  );
};
