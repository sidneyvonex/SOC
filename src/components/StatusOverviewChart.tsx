import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { FieldReport } from '../types';
import { ReportStatus } from '../types';
import { BarChart3 } from 'lucide-react';

interface StatusOverviewChartProps {
  reports: FieldReport[];
}

const STATUS_COLORS = {
  [ReportStatus.NEW]: '#6366f1',
  [ReportStatus.REVIEWED]: '#f59e0b',
  [ReportStatus.ACTIONED]: '#10b981',
  [ReportStatus.CLOSED]: '#94a3b8',
};

export const StatusOverviewChart = ({ reports }: StatusOverviewChartProps) => {
  const statusCounts = reports.reduce((acc, report) => {
    acc[report.status] = (acc[report.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Always show all four buckets (even if zero) so the chart looks balanced
  const data = (Object.values(ReportStatus) as ReportStatus[]).map((status) => ({
    name: status,
    value: statusCounts[status] || 0,
    color: STATUS_COLORS[status],
  }));

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs h-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 ring-4 ring-indigo-100 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Status Overview</h3>
            <p className="text-xs text-slate-500">Reports by current status</p>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 20, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              color: '#0f172a',
              boxShadow: '0 10px 25px -10px rgba(15,23,42,0.15)',
            }}
            cursor={{ fill: 'rgba(99, 102, 241, 0.06)' }}
          />
          <Bar dataKey="value" radius={[10, 10, 0, 0]} maxBarSize={48}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
