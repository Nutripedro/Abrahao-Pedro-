import React from 'react';

interface MacroProgressBarProps {
  label: string;
  currentGrams: number;
  targetGrams: number;
  currentKcal?: number;
  percentVet: number;
  gKg?: number;
  color: 'amber' | 'blue' | 'emerald' | 'rose' | 'purple';
  unit?: string;
}

export const MacroProgressBar: React.FC<MacroProgressBarProps> = ({
  label,
  currentGrams,
  targetGrams,
  currentKcal,
  percentVet,
  gKg,
  color,
  unit = 'g'
}) => {
  const percentFilled = targetGrams > 0 ? Math.min(130, Math.round((currentGrams / targetGrams) * 100)) : 0;
  const isOver = currentGrams > targetGrams * 1.1;

  const colorStyles = {
    amber: {
      bar: 'bg-amber-500',
      badge: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800/60',
      text: 'text-amber-600 dark:text-amber-400'
    },
    blue: {
      bar: 'bg-sky-500',
      badge: 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 border-sky-200 dark:border-sky-800/60',
      text: 'text-sky-600 dark:text-sky-400'
    },
    emerald: {
      bar: 'bg-emerald-500',
      badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60',
      text: 'text-emerald-600 dark:text-emerald-400'
    },
    rose: {
      bar: 'bg-rose-500',
      badge: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-800/60',
      text: 'text-rose-600 dark:text-rose-400'
    },
    purple: {
      bar: 'bg-purple-500',
      badge: 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200 dark:border-purple-800/60',
      text: 'text-purple-600 dark:text-purple-400'
    }
  };

  const style = colorStyles[color];

  return (
    <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 space-y-2">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
          <span>{label}</span>
          {gKg !== undefined && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {gKg} g/kg
            </span>
          )}
        </div>
        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${style.badge}`}>
          {percentVet}% VET
        </span>
      </div>

      <div className="flex items-baseline justify-between">
        <div className="flex items-baseline gap-1 font-mono">
          <span className="text-lg font-bold text-slate-900 dark:text-white">
            {currentGrams}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">/ {targetGrams}{unit}</span>
        </div>
        {currentKcal !== undefined && (
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
            {currentKcal} kcal
          </span>
        )}
      </div>

      {/* Progress Track */}
      <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 rounded-full ${style.bar} ${isOver ? 'opacity-90' : ''}`}
          style={{ width: `${Math.min(100, percentFilled)}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500">
        <span>{percentFilled}% da meta</span>
        {isOver && <span className="text-rose-500 font-semibold">Excedeu meta</span>}
      </div>
    </div>
  );
};
