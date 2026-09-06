import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import clsx from 'clsx';

interface ThemeToggleProps {
  showLabel?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  showLabel = false,
  className,
  size = 'md',
}) => {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <button
      id="theme-toggle-btn"
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Ativar modo diurno (claro)' : 'Ativar modo noturno (escuro)'}
      title={isDark ? 'Alternar para Modo Claro' : 'Alternar para Modo Noturno (Consultório)'}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-xl transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-400 select-none",
        isDark
          ? "bg-slate-800 text-amber-300 hover:bg-slate-700/90 border border-slate-700/80 shadow-xs"
          : "bg-slate-100 text-slate-700 hover:bg-slate-200/90 border border-slate-200 shadow-2xs",
        size === 'sm' ? "p-1.5 text-xs" : "px-3 py-1.5 text-xs font-semibold",
        className
      )}
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {isDark ? (
          <Sun className="w-4 h-4 text-amber-300 animate-in spin-in-90 duration-300" />
        ) : (
          <Moon className="w-4 h-4 text-slate-600 animate-in spin-in-90 duration-300" />
        )}
      </div>

      {showLabel && (
        <span className="font-medium">
          {isDark ? 'Modo Noturno' : 'Modo Claro'}
        </span>
      )}
    </button>
  );
};
