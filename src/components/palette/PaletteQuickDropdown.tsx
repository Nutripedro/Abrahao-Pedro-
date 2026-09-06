import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check, ChevronDown, Sparkles, Sliders } from 'lucide-react';
import { useTheme, PALETTE_OPTIONS, LightPaletteId } from '../../contexts/ThemeContext';
import clsx from 'clsx';

interface PaletteQuickDropdownProps {
  className?: string;
  compact?: boolean;
}

export const PaletteQuickDropdown: React.FC<PaletteQuickDropdownProps> = ({
  className,
  compact = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { palette, setPalette, currentPalette, setPaletteModalOpen } = useTheme();

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={clsx("relative", className)} ref={dropdownRef}>
      <button
        type="button"
        id="btn-paleta-cores-header"
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "inline-flex items-center gap-1.5 rounded-2xl border transition-all cursor-pointer select-none text-xs font-bold",
          "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-2xs",
          compact ? "p-1.5" : "px-2.5 sm:px-3 py-1.5"
        )}
        title="Alterar Paleta de Cores do Consultório (Tema Claro)"
        aria-label="Selecionar paleta de cores"
      >
        <div className="flex items-center gap-1.5">
          <span className="text-sm">{currentPalette.icon}</span>
          {!compact && (
            <span className="hidden sm:inline font-semibold">
              {currentPalette.name}
            </span>
          )}
        </div>
        <ChevronDown
          className={clsx(
            "w-3.5 h-3.5 text-slate-400 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 text-xs space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 px-1">
            <div className="flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-bold text-slate-900 dark:text-white text-xs">
                Paletas de Cores (Tema Claro)
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">3 Opções</span>
          </div>

          <div className="space-y-1.5">
            {PALETTE_OPTIONS.map((pal) => {
              const isSelected = palette === pal.id;

              return (
                <button
                  key={pal.id}
                  type="button"
                  onClick={() => {
                    setPalette(pal.id);
                    setIsOpen(false);
                  }}
                  className={clsx(
                    "w-full p-2.5 rounded-2xl border transition-all cursor-pointer text-left flex items-start gap-2.5",
                    isSelected
                      ? "bg-slate-50 dark:bg-slate-800/80 border-emerald-500 shadow-xs ring-1 ring-emerald-500/20"
                      : "bg-white dark:bg-slate-900/40 border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  )}
                >
                  <span className="text-xl shrink-0 mt-0.5">{pal.icon}</span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-slate-900 dark:text-white text-xs">
                        {pal.name}
                      </p>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      )}
                    </div>
                    <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 line-clamp-1">
                      {pal.subtitle}
                    </p>

                    {/* Color Swatch Dots */}
                    <div className="flex items-center gap-1.5 mt-2">
                      <span
                        className="w-3.5 h-3.5 rounded-md border border-slate-300 shadow-2xs"
                        style={{ backgroundColor: pal.colors.background }}
                        title={`Fundo: ${pal.colors.background}`}
                      />
                      <span
                        className="w-3.5 h-3.5 rounded-md border border-slate-300 shadow-2xs"
                        style={{ backgroundColor: pal.colors.accent }}
                        title={`Destaque: ${pal.colors.accent}`}
                      />
                      <span
                        className="w-3.5 h-3.5 rounded-md border border-slate-300 shadow-2xs"
                        style={{ backgroundColor: pal.colors.textPrimary }}
                        title={`Texto: ${pal.colors.textPrimary}`}
                      />
                      {pal.colors.secondaryElement && (
                        <span
                          className="w-3.5 h-3.5 rounded-md border border-slate-300 shadow-2xs"
                          style={{ backgroundColor: pal.colors.secondaryElement.bg }}
                          title={`Secundário: ${pal.colors.secondaryElement.bg}`}
                        />
                      )}
                      <span className="text-[10px] text-slate-400 font-mono ml-auto">
                        Opção {pal.optionNumber}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setPaletteModalOpen(true);
              }}
              className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Ver Detalhes & Diretrizes (Alt+P)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
