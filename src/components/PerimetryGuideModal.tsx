import React, { useState } from 'react';
import {
  X,
  Ruler,
  Compass,
  AlertCircle,
  CheckCircle2,
  HeartPulse,
  Activity,
  Layers,
  ChevronRight,
  Info
} from 'lucide-react';
import { PerimetryValues } from '../types';
import {
  PERIMETRY_GUIDE_DEFINITIONS,
  PerimetryGuideDefinition
} from '../data/perimetryGuideData';

interface PerimetryGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedKey: keyof PerimetryValues | null;
  onSelectKey?: (key: keyof PerimetryValues) => void;
}

export const PerimetryGuideModal: React.FC<PerimetryGuideModalProps> = ({
  isOpen,
  onClose,
  selectedKey,
  onSelectKey
}) => {
  const [currentKey, setCurrentKey] = useState<keyof PerimetryValues>(selectedKey || 'cintura');

  // Keep state in sync when selectedKey prop changes
  React.useEffect(() => {
    if (selectedKey) {
      setCurrentKey(selectedKey);
    }
  }, [selectedKey]);

  if (!isOpen) return null;

  const currentDef: PerimetryGuideDefinition =
    PERIMETRY_GUIDE_DEFINITIONS[currentKey] || PERIMETRY_GUIDE_DEFINITIONS.cintura;

  const handleSelect = (key: keyof PerimetryValues) => {
    setCurrentKey(key);
    if (onSelectKey) {
      onSelectKey(key);
    }
  };

  const categories = [
    {
      id: 'tronco',
      name: 'Tronco & Abdômen',
      keys: ['ombro', 'torax', 'cintura', 'abdomen', 'quadril'] as (keyof PerimetryValues)[]
    },
    {
      id: 'membros_superiores',
      name: 'Membros Superiores',
      keys: ['bracoDireito', 'bracoEsquerdo', 'antebracoDireito', 'antebracoEsquerdo'] as (keyof PerimetryValues)[]
    },
    {
      id: 'membros_inferiores',
      name: 'Membros Inferiores',
      keys: ['coxaDireita', 'coxaEsquerda', 'panturrilhaDireita', 'panturrilhaEsquerda'] as (keyof PerimetryValues)[]
    }
  ];

  const marker = currentDef.svgMarker;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="perimetry-guide-title"
    >
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 bg-slate-900 dark:bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-400/30 flex items-center justify-center shadow-xs">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-400/20 text-sky-300 border border-sky-400/30">
                  Padronização Antropométrica ISAK / Lohman
                </span>
              </div>
              <h3 id="perimetry-guide-title" className="text-base sm:text-lg font-bold tracking-tight text-white font-sans mt-0.5">
                {currentDef.label}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Fechar guia de perimetria"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Navigation Bar */}
        <div className="px-4 sm:px-6 py-2.5 bg-slate-100 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700/60 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" />
            Medidas:
          </span>
          <div className="flex items-center gap-1.5 flex-nowrap">
            {Object.keys(PERIMETRY_GUIDE_DEFINITIONS).map((k) => {
              const itemKey = k as keyof PerimetryValues;
              const def = PERIMETRY_GUIDE_DEFINITIONS[itemKey];
              const isSelected = itemKey === currentKey;
              return (
                <button
                  key={itemKey}
                  type="button"
                  onClick={() => handleSelect(itemKey)}
                  className={`px-3 py-1 text-xs rounded-full font-medium transition-all whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-sky-600 text-white shadow-xs font-semibold'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {def.shortName}
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Body: Split view (SVG Visual Diagram + Textual Guidelines) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column: Visual Anatomical SVG Schematic (5 cols on md) */}
          <div className="md:col-span-5 flex flex-col items-center bg-slate-50 dark:bg-slate-950/70 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="w-full flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-sky-500" />
                Localização Anatômica
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800 font-bold">
                Plano {currentDef.tapePlane === 'horizontal' ? 'Horizontal' : 'Perpendicular'}
              </span>
            </div>

            {/* SVG Anatomical Human Body Silhouette */}
            <div className="relative w-full flex items-center justify-center py-2">
              <svg
                viewBox="0 0 240 440"
                className="w-full max-w-[210px] h-auto drop-shadow-xs select-none"
                aria-label={`Diagrama anatômico destacando o plano de medição de ${currentDef.label}`}
              >
                <defs>
                  {/* Gradient for body silhouette */}
                  <linearGradient id="bodySilhouetteGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#64748b" stopOpacity="0.45" />
                  </linearGradient>

                  {/* Tape pattern */}
                  <pattern id="tapeRulerPattern" width="6" height="4" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="0" x2="0" y2="4" stroke="#0284c7" strokeWidth="1" />
                    <line x1="3" y1="0" x2="3" y2="2" stroke="#0284c7" strokeWidth="0.75" />
                  </pattern>

                  <filter id="tapeGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#0284c7" floodOpacity="0.7" />
                  </filter>
                </defs>

                {/* Anatomical Body Silhouette Outline */}
                <g fill="url(#bodySilhouetteGrad)" stroke="#64748b" strokeWidth="1.2" strokeLinejoin="round">
                  {/* Head & Neck */}
                  <path d="M 120 18 C 110 18 106 28 106 40 C 106 53 111 64 116 68 L 115 76 L 125 76 L 124 68 C 129 64 134 53 134 40 C 134 28 130 18 120 18 Z" />

                  {/* Torso & Arms & Legs (Simplified anatomical silhouette) */}
                  <path d="
                    M 115 76 
                    C 105 78 88 84 72 92
                    C 64 96 58 105 56 118
                    C 52 135 48 160 46 185
                    C 45 198 46 215 48 230
                    C 49 238 53 244 58 244
                    C 62 244 64 238 65 228
                    C 68 205 72 175 75 155
                    C 78 145 82 138 86 136
                    C 86 148 88 162 90 178
                    C 91 190 89 202 85 218
                    C 83 226 84 235 88 240
                    L 88 285
                    C 88 310 92 345 94 370
                    C 95 385 96 405 94 422
                    C 93 427 96 430 102 430
                    C 107 430 110 426 110 420
                    C 112 400 114 375 114 345
                    C 114 320 116 280 118 250
                    L 122 250
                    C 124 280 126 320 126 345
                    C 126 375 128 400 130 420
                    C 130 426 133 430 138 430
                    C 144 430 147 427 146 422
                    C 144 405 145 385 146 370
                    C 148 345 152 310 152 285
                    L 152 240
                    C 156 235 157 226 155 218
                    C 151 202 149 190 150 178
                    C 152 162 154 148 154 136
                    C 158 138 162 145 165 155
                    C 168 175 172 205 175 228
                    C 176 238 178 244 182 244
                    C 187 244 191 238 192 230
                    C 194 215 195 198 194 185
                    C 192 160 188 135 184 118
                    C 182 105 176 96 168 92
                    C 152 84 135 78 125 76
                    Z
                  " />
                </g>

                {/* Anatomical Landmark Bone/Surface Dots */}
                <g fill="#94a3b8" opacity="0.65">
                  {/* Acromion points */}
                  <circle cx="70" cy="90" r="2.5" />
                  <circle cx="170" cy="90" r="2.5" />
                  {/* Sternal angle / Xiphoid */}
                  <circle cx="120" cy="115" r="2" />
                  <circle cx="120" cy="138" r="2" />
                  {/* Umbilicus */}
                  <circle cx="120" cy="184" r="2.5" />
                  {/* Iliac crest line */}
                  <circle cx="94" cy="172" r="2" />
                  <circle cx="146" cy="172" r="2" />
                  {/* Greater trochanters */}
                  <circle cx="86" cy="220" r="2" />
                  <circle cx="154" cy="220" r="2" />
                  {/* Patellae */}
                  <circle cx="102" cy="330" r="2.5" />
                  <circle cx="138" cy="330" r="2.5" />
                </g>

                {/* Highlighted Measuring Tape Loop (Front & Posterior Plane) */}
                <g filter="url(#tapeGlow)">
                  {/* Tape band behind or full loop */}
                  <rect
                    x={marker.xStart}
                    y={marker.y - 3}
                    width={Math.max(20, marker.xEnd - marker.xStart)}
                    height="7"
                    rx="3.5"
                    fill="#38bdf8"
                    fillOpacity="0.25"
                    stroke="#0284c7"
                    strokeWidth="1.5"
                  />
                  {/* Active Measuring Tape Line */}
                  <line
                    x1={marker.xStart - 4}
                    y1={marker.y + 0.5}
                    x2={marker.xEnd + 4}
                    y2={marker.y + 0.5}
                    stroke="#0284c7"
                    strokeWidth="2.5"
                    strokeDasharray="4 2"
                  />
                  {/* Tape end anchors */}
                  <circle cx={marker.xStart} cy={marker.y + 0.5} r="3" fill="#0284c7" />
                  <circle cx={marker.xEnd} cy={marker.y + 0.5} r="3" fill="#0284c7" />
                </g>

                {/* Visual Label Tag on the SVG */}
                <g transform={`translate(${marker.xEnd + 10}, ${marker.y - 10})`}>
                  <rect
                    x="0"
                    y="0"
                    width="60"
                    height="20"
                    rx="6"
                    fill="#0f172a"
                    fillOpacity="0.9"
                    stroke="#38bdf8"
                    strokeWidth="1"
                  />
                  <text
                    x="30"
                    y="13"
                    fill="#38bdf8"
                    fontSize="9"
                    fontWeight="bold"
                    textAnchor="middle"
                    fontFamily="monospace"
                  >
                    {currentDef.shortName}
                  </text>
                </g>

                {/* Indicator arrow pointing to the measurement plane */}
                <line
                  x1={marker.xEnd + 10}
                  y1={marker.y}
                  x2={marker.xEnd + 2}
                  y2={marker.y}
                  stroke="#38bdf8"
                  strokeWidth="1.2"
                />
              </svg>
            </div>

            {/* Diagram Caption */}
            <div className="w-full text-center mt-2 px-2 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {currentDef.shortName}
              </span>
              : a linha azul destaca a passagem transversal da fita métrica.
            </div>
          </div>

          {/* Right Column: Complete Anatomical & Clinical Textual Instructions (7 cols on md) */}
          <div className="md:col-span-7 space-y-4 text-xs">
            {/* Box 1: Ponto Anatômico Exato */}
            <div className="p-4 rounded-2xl bg-sky-50/70 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900/60">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-6 h-6 rounded-lg bg-sky-600 text-white flex items-center justify-center shrink-0">
                  <Compass className="w-3.5 h-3.5" />
                </div>
                <strong className="text-xs font-bold text-sky-900 dark:text-sky-200 uppercase tracking-wide">
                  Ponto Anatômico de Referência
                </strong>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-sans pl-8">
                {currentDef.anatomicalLandmarks}
              </p>
            </div>

            {/* Box 2: Técnica da Fita Métrica */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                  <Ruler className="w-3.5 h-3.5" />
                </div>
                <strong className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                  Técnica de Passagem da Fita Métrica
                </strong>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed pl-8">
                {currentDef.technique}
              </p>
            </div>

            {/* Box 3: Postura & Posição do Paciente */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <strong className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                  Posicionamento & Conduta do Avaliado
                </strong>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed pl-8">
                {currentDef.bodyPosition}
              </p>
            </div>

            {/* Box 4: Relevância Clínica */}
            <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-6 h-6 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0">
                  <HeartPulse className="w-3.5 h-3.5" />
                </div>
                <strong className="text-xs font-bold text-amber-950 dark:text-amber-300 uppercase tracking-wide">
                  Significado Clínico & Aplicação Nutricional
                </strong>
              </div>
              <p className="text-amber-900/90 dark:text-amber-200/90 leading-relaxed pl-8">
                {currentDef.clinicalRelevance}
              </p>
            </div>

            {/* Standard Reference Tag */}
            <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400 dark:text-slate-500 font-mono">
              <Info className="w-3.5 h-3.5 shrink-0" />
              <span>Referência normativa: {currentDef.standardReference}</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-6 py-3.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
            Dica clínica: utilize fita inextensível com mola retrátil calibrada para pressão neutra de 10-15g/cm².
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-500 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer ml-auto"
          >
            Entendido / Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
