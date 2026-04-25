import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { FieldReport } from '../types';
import { Priority } from '../types';
import { PieChart as PieChartIcon } from 'lucide-react';

interface PriorityDistributionChartProps {
  reports: FieldReport[];
}

const PRIORITY_COLORS = {
  [Priority.CRITICAL]: '#ef4444',
  [Priority.HIGH]: '#fb923c',
  [Priority.MEDIUM]: '#facc15',
  [Priority.LOW]: '#10b981',
};

export const PriorityDistributionChart = ({ reports }: PriorityDistributionChartProps) => {
  const priorityCounts = reports.reduce((acc, report) => {
    acc[report.priority] = (acc[report.priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(priorityCounts).map(([priority, count]) => ({
    name: priority,
    value: count,
    color: PRIORITY_COLORS[priority as keyof typeof PRIORITY_COLORS],
  }));

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs h-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 ring-4 ring-rose-100 flex items-center justify-center">
            <PieChartIcon className="w-5 h-5 text-rose-500" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Priority Distribution</h3>
            <p className="text-xs text-slate-500">Reports by threat level</p>
          </div>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="h-[280px] flex items-center justify-center text-sm text-slate-400">
          No reports to chart
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={95}
              paddingAngle={3}
              dataKey="value"
              stroke="#fff"
              strokeWidth={2}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                color: '#0f172a',
                boxShadow: '0 10px 25px -10px rgba(15,23,42,0.15)',
              }}
            />
            <Legend
              iconType="circle"
              wrapperStyle={{ paddingTop: '12px', fontSize: '12px', color: '#475569' }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};
