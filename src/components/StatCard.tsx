import type { ComponentType } from 'react';
import { TrendingDown, TrendingUp } from 'lucide-react';

type ColorTone = 'rose' | 'indigo' | 'amber' | 'emerald' | 'sky' | 'violet';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: ComponentType<{ className?: string }>;
  tone: ColorTone;
  delta?: number;
  deltaSuffix?: string;
}

const TONES: Record<
  ColorTone,
  { iconBg: string; iconRing: string; iconText: string; deltaUp: string; deltaDown: string }
> = {
  rose:    { iconBg: 'bg-rose-50',    iconRing: 'ring-rose-100',    iconText: 'text-rose-500',    deltaUp: 'text-rose-600',    deltaDown: 'text-emerald-600' },
  indigo:  { iconBg: 'bg-indigo-50',  iconRing: 'ring-indigo-100',  iconText: 'text-indigo-500',  deltaUp: 'text-emerald-600', deltaDown: 'text-rose-600' },
  amber:   { iconBg: 'bg-amber-50',   iconRing: 'ring-amber-100',   iconText: 'text-amber-500',   deltaUp: 'text-rose-600',    deltaDown: 'text-emerald-600' },
  emerald: { iconBg: 'bg-emerald-50', iconRing: 'ring-emerald-100', iconText: 'text-emerald-500', deltaUp: 'text-emerald-600', deltaDown: 'text-rose-600' },
  sky:     { iconBg: 'bg-sky-50',     iconRing: 'ring-sky-100',     iconText: 'text-sky-500',     deltaUp: 'text-emerald-600', deltaDown: 'text-rose-600' },
  violet:  { iconBg: 'bg-violet-50',  iconRing: 'ring-violet-100',  iconText: 'text-violet-500',  deltaUp: 'text-emerald-600', deltaDown: 'text-rose-600' },
};

export const StatCard = ({
  label,
  value,
  icon: Icon,
  tone,
  delta,
  deltaSuffix = 'vs last week',
}: StatCardProps) => {
  const t = TONES[tone];
  const isUp = (delta ?? 0) >= 0;
  const TrendIcon = isUp ? TrendingUp : TrendingDown;
  const trendClass = isUp ? t.deltaUp : t.deltaDown;

  return (
    <div className="group bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center ring-4 ${t.iconBg} ${t.iconRing} group-hover:scale-105 transition-transform`}
        >
          <Icon className={`w-5.5 h-5.5 ${t.iconText}`} />
        </div>
        {typeof delta === 'number' && (
          <span className={`inline-flex items-center gap-1 text-xs font-semibold ${trendClass}`}>
            <TrendIcon className="w-3.5 h-3.5" />
            {isUp ? '+' : ''}
            {delta}%
          </span>
        )}
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">{label}</p>
        <p className="text-3xl font-bold text-slate-900 tabular-nums">{value}</p>
        {typeof delta === 'number' && (
          <p className="text-[11px] text-slate-400 mt-1.5 font-medium">{deltaSuffix}</p>
        )}
      </div>
    </div>
  );
};
