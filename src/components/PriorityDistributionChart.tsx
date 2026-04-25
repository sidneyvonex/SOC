import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { FieldReport } from '../types';
import { Priority } from '../types';
import { PieChart as PieChartIcon } from 'lucide-react';

interface PriorityDistributionChartProps {
  reports: FieldReport[];
}

const PRIORITY_COLORS = {
  [Priority.CRITICAL]: '#ef4444',
  [Priority.HIGH]: '#f97316',
  [Priority.MEDIUM]: '#eab308',
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
    <div className="bg-linear-to-br from-slate-800/90 to-slate-700/90 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-md hover:shadow-xl hover:shadow-purple-500/20 transition-all">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-linear-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
          <PieChartIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Priority Distribution</h3>
          <p className="text-sm text-gray-300">Reports by threat level</p>
        </div>
      </div>
      <div>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              paddingAngle={3}
              dataKey="value"
              label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1e293b', 
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            <Legend 
              iconType="circle"
              wrapperStyle={{ paddingTop: '20px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
