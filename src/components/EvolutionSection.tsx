import React, { useState } from 'react';
import { TrendingUp, ArrowDownRight, ArrowUpRight, Minus, Table, Plus, Eye } from 'lucide-react';
import { EvaluationRecord, SkinfoldKey } from '../types';
import { SKINFOLD_DEFINITIONS } from '../data/protocolData';

interface EvolutionSectionProps {
  evaluations: EvaluationRecord[];
  currentRecord: EvaluationRecord | null;
  onSelectEvaluation: (record: EvaluationRecord) => void;
  onAddNewEvaluation: () => void;
}

type EvolutionMetric = 'percentualGordura' | 'peso' | 'massaGordaKg' | 'massaLivreGorduraKg' | 'somaDobras';

export const EvolutionSection: React.FC<EvolutionSectionProps> = ({
  evaluations,
  currentRecord,
  onSelectEvaluation,
  onAddNewEvaluation,
}) => {
  const [selectedMetric, setSelectedMetric] = useState<EvolutionMetric>('percentualGordura');

  // Combine saved evaluations with current active record if not saved yet
  const displayList = evaluations.length > 0 ? evaluations : (currentRecord ? [currentRecord] : []);

  const metricConfigs: Record<EvolutionMetric, { label: string; unit: string; color: string; stroke: string }> = {
    percentualGordura: { label: '% de Gordura', unit: '%', color: 'text-cyan-700', stroke: '#0891b2' },
    peso: { label: 'Peso Corporal', unit: 'kg', color: 'text-slate-900', stroke: '#0f172a' },
    massaGordaKg: { label: 'Massa Gorda', unit: 'kg', color: 'text-amber-700', stroke: '#d97706' },
    massaLivreGorduraKg: { label: 'Massa Livre (Magra)', unit: 'kg', color: 'text-emerald-700', stroke: '#059669' },
    somaDobras: { label: 'Soma das Dobras', unit: 'mm', color: 'text-indigo-700', stroke: '#4f46e5' },
  };

  const getMetricValue = (ev: EvaluationRecord, metric: EvolutionMetric): number => {
    switch (metric) {
      case 'percentualGordura':
        return ev.results.percentualGordura;
      case 'peso':
        return ev.patient.peso;
      case 'massaGordaKg':
        return ev.results.massaGordaKg;
      case 'massaLivreGorduraKg':
        return ev.results.massaLivreGorduraKg;
      case 'somaDobras':
        return ev.results.somaDobras;
      default:
        return 0;
    }
  };

  const foldsToCompare: SkinfoldKey[] = [
    'peitoral',
    'triceps',
    'biceps',
    'subescapular',
    'axilarMedia',
    'supraIliaca',
    'abdomen',
    'coxa',
    'panturrilhaMedial',
  ];

  // SVG Line Chart points
  const points = displayList.map((ev, idx) => ({
    label: ev.titulo || `Avaliação ${idx + 1}`,
    val: getMetricValue(ev, selectedMetric),
    date: ev.patient.dataAvaliacao,
  }));

  const values = points.map((p) => p.val);
  const minVal = Math.min(...values) * 0.9;
  const maxVal = Math.max(...values) * 1.1 || 10;
  const valRange = maxVal - minVal || 1;

  const chartWidth = 500;
  const chartHeight = 180;
  const paddingX = 40;
  const paddingY = 25;

  const getX = (idx: number) => {
    if (points.length <= 1) return chartWidth / 2;
    return paddingX + (idx / (points.length - 1)) * (chartWidth - 2 * paddingX);
  };

  const getY = (val: number) => {
    return chartHeight - paddingY - ((val - minVal) / valRange) * (chartHeight - 2 * paddingY);
  };

  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(p.val)}`)
    .join(' ');

  return (
    <div id="card-evolucao-corporal" className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs p-4 sm:p-6 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 mb-5 border-b border-slate-100 dark:border-slate-800 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 flex items-center justify-center border border-sky-100 dark:border-sky-800 shadow-2xs shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white uppercase font-sans">
              Evolução Corporal & Comparação
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Acompanhamento longitudinal de dobras, peso e massa funcional ao longo das consultas.
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onAddNewEvaluation}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 min-h-[44px] text-xs font-semibold rounded-xl text-sky-800 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900/60 border border-sky-200 dark:border-sky-800 transition-colors active:scale-95 cursor-pointer self-stretch sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Tomada</span>
        </button>
      </div>

      {/* Metric Selector Buttons styled as Bento pills with horizontal swipe on mobile */}
      <div className="flex items-center gap-2 mb-5 overflow-x-auto no-scrollbar pb-1">
        {(Object.keys(metricConfigs) as EvolutionMetric[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setSelectedMetric(m)}
            className={`px-4 py-2 min-h-[44px] rounded-xl text-xs font-semibold whitespace-nowrap border transition-all active:scale-95 cursor-pointer shrink-0 ${
              selectedMetric === m
                ? 'bg-slate-900 dark:bg-sky-600 text-white border-slate-900 dark:border-sky-600 shadow-2xs'
                : 'bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {metricConfigs[m].label}
          </button>
        ))}
      </div>

      {/* Bento Sub-Tile: SVG Trend Chart */}
      <div className="p-4 sm:p-5 bg-slate-50/80 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-700 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200 font-mono uppercase">
            Gráfico de Tendência: {metricConfigs[selectedMetric].label}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            {points.length} avaliações registradas
          </span>
        </div>

        <div className="w-full h-48 relative">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-full overflow-visible"
            preserveAspectRatio="none"
          >
            {/* Grid horizontal lines */}
            {[0.25, 0.5, 0.75].map((factor) => {
              const yPos = paddingY + factor * (chartHeight - 2 * paddingY);
              return (
                <line
                  key={factor}
                  x1={paddingX}
                  y1={yPos}
                  x2={chartWidth - paddingX}
                  y2={yPos}
                  stroke="currentColor"
                  className="text-slate-200 dark:text-slate-700"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              );
            })}

            {/* Path line */}
            {points.length > 1 && (
              <path
                d={pathD}
                fill="none"
                stroke={metricConfigs[selectedMetric].stroke}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Data circles & text values */}
            {points.map((p, idx) => {
              const cx = getX(idx);
              const cy = getY(p.val);
              return (
                <g key={idx} className="cursor-pointer group">
                  <circle
                    cx={cx}
                    cy={cy}
                    r="5"
                    fill={metricConfigs[selectedMetric].stroke}
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="transition-transform group-hover:scale-125"
                  />
                  <text
                    x={cx}
                    y={cy - 10}
                    textAnchor="middle"
                    className="fill-slate-800 dark:fill-slate-100 font-bold text-[11px] font-mono"
                  >
                    {p.val.toFixed(1)} {metricConfigs[selectedMetric].unit}
                  </text>
                  <text
                    x={cx}
                    y={chartHeight - 6}
                    textAnchor="middle"
                    className="fill-slate-500 dark:fill-slate-400 text-[9.5px] font-mono"
                  >
                    {p.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Textual progress badges */}
        <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-700 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {displayList.map((ev, i) => (
            <button
              key={ev.id || i}
              type="button"
              onClick={() => onSelectEvaluation(ev)}
              className="px-3.5 py-2 min-h-[44px] rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer hover:border-sky-500 dark:hover:border-sky-400 shadow-2xs transition-colors shrink-0 active:scale-95"
            >
              <span className="font-bold">{ev.titulo || `Avaliação ${i + 1}`}</span>
              <span className="text-slate-400">→</span>
              <strong className="font-mono text-sky-800 dark:text-sky-300">
                {getMetricValue(ev, selectedMetric).toFixed(1)} {metricConfigs[selectedMetric].unit}
              </strong>
            </button>
          ))}
        </div>
      </div>

      {/* Seção Bento: Tabela Comparativa de Dobras Cutâneas */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase font-sans">
            Tabela Comparativa de Espessura das Dobras (mm)
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Valores individuais do adipômetro
          </span>
        </div>

        <div className="overflow-x-auto no-scrollbar border border-slate-200 dark:border-slate-700 rounded-2xl">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700 text-xs">
            <thead className="bg-slate-50/80 dark:bg-slate-800/80 font-mono text-[11px] text-slate-600 dark:text-slate-300">
              <tr>
                <th className="px-4 py-3 text-left font-bold uppercase tracking-wider">
                  Dobra Cutânea
                </th>
                {displayList.map((ev, idx) => (
                  <th key={ev.id || idx} className="px-4 py-3 text-right font-bold uppercase whitespace-nowrap">
                    {ev.titulo || `Avaliação ${idx + 1}`}
                  </th>
                ))}
                {displayList.length >= 2 && (
                  <th className="px-4 py-3 text-right font-bold uppercase text-slate-800 dark:text-slate-200 bg-slate-100/70 dark:bg-slate-800 whitespace-nowrap">
                    Variação (Delta)
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900 font-mono">
              {foldsToCompare.map((foldKey) => {
                const def = SKINFOLD_DEFINITIONS[foldKey];
                const vals = displayList.map((ev) => ev.skinfolds[foldKey] ?? null);
                const firstVal = vals[0];
                const lastVal = vals[vals.length - 1];
                const hasDelta = displayList.length >= 2 && firstVal !== null && lastVal !== null;
                const delta = hasDelta ? Number((lastVal! - firstVal!).toFixed(1)) : null;

                return (
                  <tr key={foldKey} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-2.5 text-slate-900 dark:text-white font-sans font-medium flex items-center gap-2 whitespace-nowrap">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                      {def.name}
                    </td>
                    {vals.map((v, i) => (
                      <td key={i} className="px-4 py-2.5 text-right text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        {v !== null && Number(v) > 0 ? `${Number(v).toFixed(1)} mm` : '—'}
                      </td>
                    ))}
                    {displayList.length >= 2 && (
                      <td className="px-4 py-2.5 text-right font-bold bg-slate-50/50 dark:bg-slate-800/50 whitespace-nowrap">
                        {delta !== null ? (
                          <span
                            className={`inline-flex items-center gap-0.5 ${
                              delta < 0
                                ? 'text-emerald-700 dark:text-emerald-400'
                                : delta > 0
                                ? 'text-rose-600 dark:text-rose-400'
                                : 'text-slate-500 dark:text-slate-400'
                            }`}
                          >
                            {delta < 0 ? (
                              <ArrowDownRight className="w-3.5 h-3.5" />
                            ) : delta > 0 ? (
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            ) : (
                              <Minus className="w-3 h-3" />
                            )}
                            {delta > 0 ? `+${delta}` : delta} mm
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}

              {/* Soma Geral Row */}
              <tr className="bg-slate-50/90 dark:bg-slate-800/60 font-bold border-t-2 border-slate-200 dark:border-slate-700">
                <td className="px-4 py-3 text-slate-900 dark:text-white font-sans whitespace-nowrap">
                  SOMA TOTAL DAS DOBRAS
                </td>
                {displayList.map((ev, i) => (
                  <td key={i} className="px-4 py-3 text-right text-slate-900 dark:text-white whitespace-nowrap">
                    {ev.results.somaDobras.toFixed(1)} mm
                  </td>
                ))}
                {displayList.length >= 2 && (
                  <td className="px-4 py-3 text-right text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 whitespace-nowrap">
                    {(() => {
                      const d = Number(
                        (
                          displayList[displayList.length - 1].results.somaDobras -
                          displayList[0].results.somaDobras
                        ).toFixed(1)
                      );
                      return (
                        <span className={d < 0 ? 'text-emerald-700 dark:text-emerald-400' : d > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'}>
                          {d > 0 ? `+${d}` : d} mm
                        </span>
                      );
                    })()}
                  </td>
                )}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
