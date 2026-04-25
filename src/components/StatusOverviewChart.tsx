import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { FieldReport } from '../types';
import { ReportStatus } from '../types';
import { BarChart3 } from 'lucide-react';

interface StatusOverviewChartProps {
  reports: FieldReport[];
}

const STATUS_COLORS = {
  [ReportStatus.NEW]: '#3b82f6',
  [ReportStatus.REVIEWED]: '#f59e0b',
  [ReportStatus.ACTIONED]: '#10b981',
  [ReportStatus.CLOSED]: '#6b7280',
};

export const StatusOverviewChart = ({ reports }: StatusOverviewChartProps) => {
  const statusCounts = reports.reduce((acc, report) => {
    acc[report.status] = (acc[report.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(statusCounts).map(([status, count]) => ({
    name: status.replace(/_/g, ' '),
    value: count,
    color: STATUS_COLORS[status as keyof typeof STATUS_COLORS],
  }));

  return (
    <div className="bg-linear-to-br from-slate-800/90 to-slate-700/90 border border-blue-500/30 rounded-2xl p-6 backdrop-blur-md hover:shadow-xl hover:shadow-blue-500/20 transition-all">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-linear-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
          <BarChart3 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Status Overview</h3>
          <p className="text-sm text-gray-300">Reports by current status</p>
        </div>
      </div>
      <div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              axisLine={{ stroke: '#334155' }}
            />
            <YAxis 
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              axisLine={{ stroke: '#334155' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1e293b', 
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#fff'
              }}
              cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
