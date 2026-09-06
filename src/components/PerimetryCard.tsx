import React, { useState } from 'react';
import {
  Ruler,
  HeartPulse,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Compass,
  Bluetooth
} from 'lucide-react';
import { Gender, PerimetryValues } from '../types';
import { PERIMETRY_GUIDE_DEFINITIONS } from '../data/perimetryGuideData';
import { PerimetryGuideModal } from './PerimetryGuideModal';

interface PerimetryCardProps {
  perimetry: PerimetryValues;
  onChangePerimetry: (key: keyof PerimetryValues, value: number | null) => void;
  rcq: number | null;
  rcqClassificacao: string | null;
  rcqRisco: 'baixo' | 'moderado' | 'alto' | 'muito_alto' | null;
  sexo: Gender;
  idade: number;
  onOpenAutoFill?: () => void;
}

export const PerimetryCard: React.FC<PerimetryCardProps> = ({
  perimetry,
  onChangePerimetry,
  rcq,
  rcqClassificacao,
  rcqRisco,
  sexo,
  idade,
  onOpenAutoFill,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [activeGuideKey, setActiveGuideKey] = useState<keyof PerimetryValues | null>(null);

  const handleOpenGuide = (key: keyof PerimetryValues) => {
    setActiveGuideKey(key);
    setIsGuideOpen(true);
  };

  const getRiscoBadge = (risco: 'baixo' | 'moderado' | 'alto' | 'muito_alto' | null) => {
    switch (risco) {
      case 'baixo':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800';
      case 'moderado':
        return 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800';
      case 'alto':
        return 'bg-orange-50 text-orange-800 border-orange-300 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-800';
      case 'muito_alto':
        return 'bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
    }
  };

  const getRiscoDotColor = (risco: 'baixo' | 'moderado' | 'alto' | 'muito_alto' | null) => {
    switch (risco) {
      case 'baixo':
        return 'bg-emerald-500';
      case 'moderado':
        return 'bg-amber-500';
      case 'alto':
        return 'bg-orange-500';
      case 'muito_alto':
        return 'bg-rose-600';
      default:
        return 'bg-slate-400';
    }
  };

  const perimetryFields: { key: keyof PerimetryValues; label: string; placeholder: string }[] = [
    { key: 'ombro', label: 'Ombro', placeholder: 'cm' },
    { key: 'torax', label: 'Tórax', placeholder: 'cm' },
    { key: 'cintura', label: 'Cintura (menor curvatura)', placeholder: 'cm' },
    { key: 'abdomen', label: 'Abdômen (cicatriz umbilical)', placeholder: 'cm' },
    { key: 'quadril', label: 'Quadril (maior perímetro)', placeholder: 'cm' },
    { key: 'bracoDireito', label: 'Braço Direito (relaxado)', placeholder: 'cm' },
    { key: 'bracoEsquerdo', label: 'Braço Esquerdo (relaxado)', placeholder: 'cm' },
    { key: 'antebracoDireito', label: 'Antebraço Direito', placeholder: 'cm' },
    { key: 'antebracoEsquerdo', label: 'Antebraço Esquerdo', placeholder: 'cm' },
    { key: 'coxaDireita', label: 'Coxa Direita (medial)', placeholder: 'cm' },
    { key: 'coxaEsquerda', label: 'Coxa Esquerda (medial)', placeholder: 'cm' },
    { key: 'panturrilhaDireita', label: 'Panturrilha Direita', placeholder: 'cm' },
    { key: 'panturrilhaEsquerda', label: 'Panturrilha Esquerda', placeholder: 'cm' },
  ];

  return (
    <div id="card-perimetria" className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs p-6 transition-all">
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 flex items-center justify-center border border-sky-100 dark:border-sky-900/60 shadow-2xs">
            <Ruler className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white uppercase font-sans">
              Perimetria & Circunferências Corporais
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Módulo complementar para cálculo de RCQ e proporcionalidade muscular.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenAutoFill && (
            <button
              type="button"
              onClick={onOpenAutoFill}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
              title="Importar perimetrias via Bluetooth ou arquivo TXT/CSV"
            >
              <Bluetooth className="w-3.5 h-3.5 text-sky-500" />
              <span>Importar Sensor</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => handleOpenGuide('cintura')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900/60 border border-sky-200 dark:border-sky-800 transition-colors cursor-pointer"
            title="Abrir guia de demarcação anatômica das medidas de perimetria"
          >
            <Compass className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>Guia Anatômico</span>
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
            title={isExpanded ? 'Recolher campos' : 'Expandir campos'}
            aria-label={isExpanded ? 'Recolher campos de perimetria' : 'Expandir campos de perimetria'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Bento Sub-Tile: Destaque para Cintura e Quadril -> Cálculo de RCQ */}
      <div className="mb-5 p-5 rounded-2xl bg-sky-50/60 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-sky-700 dark:text-sky-400" />
              <strong className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                Relação Cintura / Quadril (RCQ)
              </strong>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Indicador de distribuição de gordura androide (central) e risco cardiovascular (Applied Body Composition Assessment, 1996 / Bray & Gray).
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-sky-100 dark:border-sky-900/60 shadow-2xs">
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase block font-mono">Índice RCQ</span>
              <span className="text-xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                {rcq !== null ? rcq.toFixed(3) : '—'}
              </span>
            </div>

            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800"></div>

            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase block font-mono">
                Risco ({sexo === 'masculino' ? 'Homem' : 'Mulher'}, {idade}a)
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`w-2.5 h-2.5 rounded-full ${getRiscoDotColor(rcqRisco)}`}></span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getRiscoBadge(rcqRisco)}`}>
                  {rcqClassificacao || 'Preencha cintura e quadril'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pt-1">
          {perimetryFields.map((field) => {
            const val = perimetry[field.key];
            const isHighlight = field.key === 'cintura' || field.key === 'quadril';
            const guideDef = PERIMETRY_GUIDE_DEFINITIONS[field.key];

            return (
              <div
                key={field.key}
                className={`p-3 rounded-2xl border transition-all ${
                  isHighlight
                    ? 'bg-sky-50/70 dark:bg-sky-950/40 border-sky-300 dark:border-sky-800 ring-1 ring-sky-200 dark:ring-sky-900/60'
                    : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/70'
                }`}
              >
                {/* Header of input: Label + Question Mark Help Icon Button */}
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <label
                    htmlFor={`input-perimetria-${field.key}`}
                    className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate"
                    title={field.label}
                  >
                    {field.label}
                    {isHighlight && <span className="text-sky-700 dark:text-sky-400 ml-1 font-bold">*</span>}
                  </label>

                  <button
                    type="button"
                    onClick={() => handleOpenGuide(field.key)}
                    className="p-1 -mr-1 rounded-full text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-sky-100/70 dark:hover:bg-sky-950/80 transition-all cursor-pointer shrink-0 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    title={`Ponto anatômico correto: ${guideDef?.anatomicalLandmarks || 'Clique para ver a instrução e diagrama'}`}
                    aria-label={`Ver explicação anatômica para medição de ${field.label}`}
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="relative">
                  <input
                    id={`input-perimetria-${field.key}`}
                    type="number"
                    step="0.1"
                    min="10"
                    max="200"
                    placeholder="0.0"
                    value={val !== undefined && val !== null ? val : ''}
                    onChange={(e) => {
                      const v = e.target.value === '' ? null : parseFloat(e.target.value);
                      onChangePerimetry(field.key, v);
                    }}
                    className="w-full pl-3 pr-8 py-2 text-xs font-mono font-medium text-slate-900 dark:text-white bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400"
                  />
                  <span className="absolute right-2.5 top-2.5 text-[11px] font-mono text-slate-500 dark:text-slate-400 pointer-events-none">
                    cm
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Anatomical Guide Modal */}
      <PerimetryGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        selectedKey={activeGuideKey}
        onSelectKey={(key) => setActiveGuideKey(key)}
      />
    </div>
  );
};

