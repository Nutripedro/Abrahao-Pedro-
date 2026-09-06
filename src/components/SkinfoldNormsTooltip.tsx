import React, { useState, useRef, useEffect } from 'react';
import { Info, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { Gender, SkinfoldDefinition, SkinfoldKey } from '../types';
import { SKINFOLD_NORMATIVE_RANGES } from '../data/protocolData';

interface SkinfoldNormsTooltipProps {
  foldKey: SkinfoldKey;
  definition: SkinfoldDefinition;
  patientSexo?: Gender;
  currentValue?: number | null;
  preferBottom?: boolean;
}

export const SkinfoldNormsTooltip: React.FC<SkinfoldNormsTooltipProps> = ({
  foldKey,
  definition,
  patientSexo = 'masculino',
  currentValue,
  preferBottom = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const norms = definition.normas || SKINFOLD_NORMATIVE_RANGES[foldKey];

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  if (!norms) return null;

  const isMaleActive = patientSexo === 'masculino';
  const isFemaleActive = patientSexo === 'feminino';

  // Analysis of current value against the patient's sex norms
  const activeSexNorms = isFemaleActive ? norms.mulheres : norms.homens;
  const numVal = currentValue !== undefined && currentValue !== null ? Number(currentValue) : null;

  let valueStatus: { text: string; type: 'normal' | 'warn' } | null = null;
  if (numVal !== null && numVal > 0) {
    if (numVal < activeSexNorms.min) {
      valueStatus = {
        text: `${numVal.toFixed(1)} mm está abaixo do intervalo típico (${activeSexNorms.faixaTexto})`,
        type: 'warn',
      };
    } else if (numVal > activeSexNorms.max) {
      valueStatus = {
        text: `${numVal.toFixed(1)} mm está acima do intervalo típico (${activeSexNorms.faixaTexto})`,
        type: 'warn',
      };
    } else {
      valueStatus = {
        text: `${numVal.toFixed(1)} mm está dentro da variação esperada (${activeSexNorms.faixaTexto})`,
        type: 'normal',
      };
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative inline-flex items-center"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Trigger Button */}
      <button
        type="button"
        id={`btn-tooltip-${foldKey}`}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        onFocus={() => setIsOpen(true)}
        className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-400 ${
          isOpen
            ? 'bg-sky-100 text-sky-800 ring-2 ring-sky-400 shadow-2xs'
            : 'text-slate-400 hover:text-sky-700 hover:bg-slate-100'
        }`}
        title={`Variação normal esperada: Dobra ${definition.name}`}
        aria-label={`Ver variação normal esperada para a dobra ${definition.name}`}
        aria-expanded={isOpen}
      >
        <Info className="w-3.5 h-3.5" />
      </button>

      {/* Floating Tooltip Window */}
      {isOpen && (
        <div
          role="tooltip"
          className={`absolute right-0 w-80 sm:w-88 p-4 bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700/80 z-40 text-xs animate-in fade-in zoom-in-95 pointer-events-auto ${
            preferBottom ? 'top-full mt-2' : 'bottom-full mb-2'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-2.5 mb-2.5 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-1.5 text-sky-400 font-mono text-[10px] font-bold uppercase tracking-wider">
                <span>Variação Normal Esperada</span>
              </div>
              <h4 className="text-sm font-bold text-white tracking-tight mt-0.5">
                Dobra {definition.name}
              </h4>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
              aria-label="Fechar tooltip"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Clinical comparison by sex */}
          <div className="space-y-2 mb-3">
            {/* Masculino Card */}
            <div
              className={`p-2.5 rounded-xl border transition-all ${
                isMaleActive
                  ? 'bg-sky-950/60 border-sky-400/80 ring-1 ring-sky-400/50'
                  : 'bg-slate-800/60 border-slate-700/60'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-200">Homens (♂)</span>
                  {isMaleActive && (
                    <span className="px-2 py-0.2 rounded-full bg-sky-500/20 text-sky-300 text-[10px] font-mono font-bold">
                      Perfil Ativo
                    </span>
                  )}
                </div>
                <span className="font-mono text-xs font-bold text-sky-300">
                  {norms.homens.faixaTexto}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Referência média populacional:</span>
                <span className="font-mono text-slate-200 font-medium">
                  {norms.homens.media.toFixed(1)} mm
                </span>
              </div>
            </div>

            {/* Feminino Card */}
            <div
              className={`p-2.5 rounded-xl border transition-all ${
                isFemaleActive
                  ? 'bg-sky-950/60 border-sky-400/80 ring-1 ring-sky-400/50'
                  : 'bg-slate-800/60 border-slate-700/60'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-200">Mulheres (♀)</span>
                  {isFemaleActive && (
                    <span className="px-2 py-0.2 rounded-full bg-sky-500/20 text-sky-300 text-[10px] font-mono font-bold">
                      Perfil Ativo
                    </span>
                  )}
                </div>
                <span className="font-mono text-xs font-bold text-sky-300">
                  {norms.mulheres.faixaTexto}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Referência média populacional:</span>
                <span className="font-mono text-slate-200 font-medium">
                  {norms.mulheres.media.toFixed(1)} mm
                </span>
              </div>
            </div>
          </div>

          {/* Current measurement feedback if entered */}
          {valueStatus && (
            <div
              className={`p-2 rounded-xl mb-2.5 flex items-center gap-2 text-[11px] ${
                valueStatus.type === 'normal'
                  ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-200'
                  : 'bg-amber-950/50 border border-amber-500/40 text-amber-200'
              }`}
            >
              {valueStatus.type === 'normal' ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              )}
              <span className="leading-tight font-sans">{valueStatus.text}</span>
            </div>
          )}

          {/* Clinical note */}
          <p className="text-[11px] text-slate-300 leading-relaxed mb-2 bg-slate-800/40 p-2 rounded-lg border border-slate-800">
            {norms.descricaoClinica}
          </p>

          {/* Reference source footer */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>Ref: {norms.referencia}</span>
            <span className="text-slate-500">Unidade: mm</span>
          </div>
        </div>
      )}
    </div>
  );
};
