import React from 'react';
import { SkinfoldDefinition, SkinfoldKey, SkinfoldValues } from '../types';
import { SKINFOLD_DEFINITIONS } from '../data/protocolData';
import { Check, Info, Sparkles } from 'lucide-react';

interface AnatomicalBodyMapProps {
  requiredFolds: SkinfoldKey[];
  skinfoldValues: SkinfoldValues;
  selectedFoldKey: SkinfoldKey | null;
  onSelectFold: (key: SkinfoldKey) => void;
  onSwitchToQuickTip?: () => void;
}

export const AnatomicalBodyMap: React.FC<AnatomicalBodyMapProps> = ({
  requiredFolds,
  skinfoldValues,
  selectedFoldKey,
  onSelectFold,
  onSwitchToQuickTip,
}) => {
  const activeDef = selectedFoldKey ? SKINFOLD_DEFINITIONS[selectedFoldKey] : null;

  // Helper for pin state
  const getPinState = (key: SkinfoldKey) => {
    const isSelected = selectedFoldKey === key;
    const isFilled =
      skinfoldValues[key] !== undefined &&
      skinfoldValues[key] !== null &&
      Number(skinfoldValues[key]) > 0;
    const isRequired = requiredFolds.includes(key);

    return { isSelected, isFilled, isRequired };
  };

  return (
    <div id="card-mapa-corporal" className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs p-4 sm:p-6 transition-all flex flex-col h-full">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white uppercase font-sans">
            Mapa Anatômico dos Pontos
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">Localização anatômica das dobras</span>
        </div>
        <span className="text-[11px] font-mono font-medium px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
          {requiredFolds.filter((k) => skinfoldValues[k] && Number(skinfoldValues[k]) > 0).length} de {requiredFolds.length} medidos
        </span>
      </div>

      {/* Legend styled with Bento pill dots */}
      <div className="flex items-center justify-center gap-4 text-[11px] text-slate-600 dark:text-slate-400 mb-3 py-2 px-3 bg-slate-50/80 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
          <span>Preenchido</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
          <span>Pendente</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-600 ring-2 ring-sky-300"></span>
          <span>Selecionado</span>
        </div>
      </div>

      {/* SVG Canvas Container with Front and Back Silhouettes */}
      <div className="relative flex-1 min-h-[360px] bg-slate-50/60 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-3 flex items-center justify-center overflow-hidden">
        <div className="grid grid-cols-2 gap-2 w-full max-w-sm">
          {/* VISTA ANTERIOR (FRONT) */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold tracking-wider text-slate-600 dark:text-slate-400 uppercase mb-1 font-mono">
              Vista Anterior (Frente)
            </span>
            <div className="relative w-[150px] h-[330px]">
              <svg
                viewBox="0 0 200 440"
                className="w-full h-full drop-shadow-xs"
                style={{ overflow: 'visible' }}
              >
                {/* Silhouette Path Front */}
                <g fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5" strokeLinejoin="round">
                  {/* Head */}
                  <ellipse cx="100" cy="35" rx="20" ry="26" />
                  {/* Neck */}
                  <path d="M 92 60 L 92 75 L 108 75 L 108 60 Z" />
                  {/* Torso & Arms */}
                  <path d="
                    M 85 75 
                    C 70 78, 55 90, 48 120 
                    C 42 145, 38 180, 35 220 
                    C 34 232, 42 235, 48 225 
                    C 52 195, 58 150, 68 125 
                    C 68 150, 69 190, 72 230 
                    L 72 250 
                    C 72 270, 78 300, 80 340 
                    C 82 370, 84 410, 82 430 
                    L 96 430 
                    C 98 400, 99 350, 99 310 
                    L 101 310 
                    C 101 350, 102 400, 104 430 
                    L 118 430 
                    C 116 410, 118 370, 120 340 
                    C 122 300, 128 270, 128 250 
                    L 128 230 
                    C 131 190, 132 150, 132 125 
                    C 142 150, 148 195, 152 225 
                    C 158 235, 166 232, 165 220 
                    C 162 180, 158 145, 152 120 
                    C 145 90, 130 78, 115 75 
                    Z" />
                </g>

                {/* Markers Front: Peitoral(1), Axilar(2), Abdômen(5), Supra-ilíaca(6), Coxa(7), Bíceps(8), Panturrilha(9) */}
                {[
                  'peitoral',
                  'axilarMedia',
                  'abdomen',
                  'supraIliaca',
                  'coxa',
                  'biceps',
                  'panturrilhaMedial',
                ].map((keyStr) => {
                  const key = keyStr as SkinfoldKey;
                  const def = SKINFOLD_DEFINITIONS[key];
                  const isRequired = requiredFolds.includes(key);
                  if (!isRequired && key !== 'biceps' && key !== 'panturrilhaMedial') return null;

                  const { isSelected, isFilled } = getPinState(key);
                  const cx = def.cxFront || 100;
                  const cy = def.cyFront || 150;

                  return (
                    <g
                      key={key}
                      onClick={() => onSelectFold(key)}
                      className="cursor-pointer group"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && onSelectFold(key)}
                    >
                      {/* Outer pulse when selected */}
                      {isSelected && (
                        <circle
                          cx={cx}
                          cy={cy}
                          r="15"
                          fill="none"
                          stroke="#0891b2"
                          strokeWidth="2.5"
                          className="animate-ping opacity-60"
                        />
                      )}

                      {/* Touch target hit area */}
                      <circle cx={cx} cy={cy} r="18" fill="transparent" />

                      {/* Main Node Circle */}
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isSelected ? '11' : '9'}
                        fill={
                          isSelected
                            ? '#0e7490'
                            : isFilled
                            ? '#059669'
                            : isRequired
                            ? '#475569'
                            : '#94a3b8'
                        }
                        stroke="#ffffff"
                        strokeWidth="2"
                        className="transition-all duration-200 group-hover:scale-110"
                      />

                      {/* Number inside */}
                      <text
                        x={cx}
                        y={cy + 3.5}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize={isSelected ? '10' : '8.5'}
                        fontWeight="bold"
                        fontFamily="monospace"
                        pointerEvents="none"
                      >
                        {def.number}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* VISTA POSTERIOR (BACK) */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold tracking-wider text-slate-600 dark:text-slate-400 uppercase mb-1 font-mono">
              Vista Posterior (Costas)
            </span>
            <div className="relative w-[150px] h-[330px]">
              <svg
                viewBox="0 0 200 440"
                className="w-full h-full drop-shadow-xs"
                style={{ overflow: 'visible' }}
              >
                {/* Silhouette Path Back */}
                <g fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5" strokeLinejoin="round">
                  {/* Head Back */}
                  <ellipse cx="100" cy="35" rx="20" ry="26" />
                  {/* Neck Back */}
                  <path d="M 92 60 L 92 75 L 108 75 L 108 60 Z" />
                  {/* Spine line subtle */}
                  <path d="M 100 80 L 100 230" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3,3" />
                  {/* Torso & Arms Back */}
                  <path d="
                    M 85 75 
                    C 70 78, 55 90, 48 120 
                    C 42 145, 38 180, 35 220 
                    C 34 232, 42 235, 48 225 
                    C 52 195, 58 150, 68 125 
                    C 68 150, 69 190, 72 230 
                    L 72 250 
                    C 72 270, 78 300, 80 340 
                    C 82 370, 84 410, 82 430 
                    L 96 430 
                    C 98 400, 99 350, 99 310 
                    L 101 310 
                    C 101 350, 102 400, 104 430 
                    L 118 430 
                    C 116 410, 118 370, 120 340 
                    C 122 300, 128 270, 128 250 
                    L 128 230 
                    C 131 190, 132 150, 132 125 
                    C 142 150, 148 195, 152 225 
                    C 158 235, 166 232, 165 220 
                    C 162 180, 158 145, 152 120 
                    C 145 90, 130 78, 115 75 
                    Z" />
                </g>

                {/* Markers Back: Tríceps(3), Subescapular(4) */}
                {['triceps', 'subescapular'].map((keyStr) => {
                  const key = keyStr as SkinfoldKey;
                  const def = SKINFOLD_DEFINITIONS[key];
                  const isRequired = requiredFolds.includes(key);

                  const { isSelected, isFilled } = getPinState(key);
                  const cx = def.cxBack || 100;
                  const cy = def.cyBack || 150;

                  return (
                    <g
                      key={key}
                      onClick={() => onSelectFold(key)}
                      className="cursor-pointer group"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && onSelectFold(key)}
                    >
                      {isSelected && (
                        <circle
                          cx={cx}
                          cy={cy}
                          r="15"
                          fill="none"
                          stroke="#0891b2"
                          strokeWidth="2.5"
                          className="animate-ping opacity-60"
                        />
                      )}

                      <circle cx={cx} cy={cy} r="18" fill="transparent" />

                      <circle
                        cx={cx}
                        cy={cy}
                        r={isSelected ? '11' : '9'}
                        fill={
                          isSelected
                            ? '#0e7490'
                            : isFilled
                            ? '#059669'
                            : isRequired
                            ? '#475569'
                            : '#94a3b8'
                        }
                        stroke="#ffffff"
                        strokeWidth="2"
                        className="transition-all duration-200 group-hover:scale-110"
                      />

                      <text
                        x={cx}
                        y={cy + 3.5}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize={isSelected ? '10' : '8.5'}
                        fontWeight="bold"
                        fontFamily="monospace"
                        pointerEvents="none"
                      >
                        {def.number}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Anatomical Spot Details Bento Sub-Tile */}
      <div className="mt-4 p-4 bg-sky-50/50 dark:bg-slate-800/70 rounded-2xl border border-sky-100 dark:border-slate-700 min-h-[105px] flex flex-col justify-between">
        {activeDef ? (
          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-slate-900 dark:bg-slate-700 text-white font-mono text-[11px] font-bold flex items-center justify-center">
                  {activeDef.number}
                </span>
                <strong className="text-xs font-bold text-slate-900 dark:text-white font-sans">
                  {activeDef.name}
                </strong>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {activeDef.orientation}
                </span>
              </div>

              {skinfoldValues[activeDef.key] && Number(skinfoldValues[activeDef.key]) > 0 ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  <Check className="w-3 h-3" />
                  {Number(skinfoldValues[activeDef.key]).toFixed(1)} mm
                </span>
              ) : (
                <span className="text-[11px] font-mono text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                  Pendente
                </span>
              )}
            </div>

            <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong className="text-slate-900 dark:text-white">Localização:</strong> {activeDef.anatomicalLocation}
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 italic">
              <strong>Pinçamento:</strong> {activeDef.pinchingTips}
            </p>

            {onSwitchToQuickTip && (
              <div className="mt-3 pt-2.5 border-t border-sky-100 dark:border-slate-700 flex items-center justify-between gap-2 flex-wrap">
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Dúvida no pinçamento ou ângulo?</span>
                <button
                  type="button"
                  onClick={onSwitchToQuickTip}
                  className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px] text-[11px] font-bold text-amber-900 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-950/60 hover:bg-amber-200/80 dark:hover:bg-amber-900/60 active:scale-95 rounded-xl transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Ver Dica Rápida com IA</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-center text-xs text-slate-600 dark:text-slate-400 py-3">
            <Info className="w-4 h-4 mr-1.5 text-sky-700 dark:text-sky-400 shrink-0" />
            <span>Selecione um ponto anatômico no mapa ou no painel ao lado para ver a técnica de pinçamento.</span>
          </div>
        )}
      </div>
    </div>
  );
};
