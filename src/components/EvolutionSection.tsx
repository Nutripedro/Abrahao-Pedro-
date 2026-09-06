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
    <div id="card-evolucao-corporal" className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 mb-5 border-b border-slate-100 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-100 shadow-2xs">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-slate-900 uppercase font-sans">
              Evolução Corporal & Comparação
            </h2>
            <span className="text-xs text-slate-500">
              Acompanhamento longitudinal de dobras, peso e massa funcional ao longo das consultas.
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onAddNewEvaluation}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-full text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nova Tomada</span>
        </button>
      </div>

      {/* Metric Selector Buttons styled as Bento pills */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        {(Object.keys(metricConfigs) as EvolutionMetric[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setSelectedMetric(m)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
              selectedMetric === m
                ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {metricConfigs[m].label}
          </button>
        ))}
      </div>

      {/* Bento Sub-Tile: SVG Trend Chart */}
      <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200/80 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-700 font-mono uppercase">
            Gráfico de Tendência: {metricConfigs[selectedMetric].label}
          </span>
          <span className="text-xs text-slate-500 font-mono">
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
                  stroke="#e2e8f0"
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
                    fill="#1e293b"
                    fontSize="11"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {p.val.toFixed(1)} {metricConfigs[selectedMetric].unit}
                  </text>
                  <text
                    x={cx}
                    y={chartHeight - 6}
                    textAnchor="middle"
                    fill="#64748b"
                    fontSize="9.5"
                    fontFamily="monospace"
                  >
                    {p.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Textual progress badges */}
        <div className="mt-4 pt-3 border-t border-slate-200/80 flex flex-wrap items-center gap-2.5">
          {displayList.map((ev, i) => (
            <div
              key={ev.id || i}
              onClick={() => onSelectEvaluation(ev)}
              className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs text-slate-700 flex items-center gap-1.5 cursor-pointer hover:border-sky-500 shadow-2xs transition-colors"
            >
              <span className="font-bold">{ev.titulo || `Avaliação ${i + 1}`}</span>
              <span className="text-slate-400">→</span>
              <strong className="font-mono text-sky-800">
                {getMetricValue(ev, selectedMetric).toFixed(1)} {metricConfigs[selectedMetric].unit}
              </strong>
            </div>
          ))}
        </div>
      </div>

      {/* Seção Bento: Tabela Comparativa de Dobras Cutâneas */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-800 uppercase font-sans">
            Tabela Comparativa de Espessura das Dobras (mm)
          </span>
          <span className="text-xs text-slate-500">
            Valores individuais do adipômetro
          </span>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="bg-slate-50/80 font-mono text-[11px] text-slate-600">
              <tr>
                <th className="px-4 py-3 text-left font-bold uppercase tracking-wider">
                  Dobra Cutânea
                </th>
                {displayList.map((ev, idx) => (
                  <th key={ev.id || idx} className="px-4 py-3 text-right font-bold uppercase">
                    {ev.titulo || `Avaliação ${idx + 1}`}
                  </th>
                ))}
                {displayList.length >= 2 && (
                  <th className="px-4 py-3 text-right font-bold uppercase text-slate-800 bg-slate-100/70">
                    Variação (Delta)
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white font-mono">
              {foldsToCompare.map((foldKey) => {
                const def = SKINFOLD_DEFINITIONS[foldKey];
                const vals = displayList.map((ev) => ev.skinfolds[foldKey] ?? null);
                const firstVal = vals[0];
                const lastVal = vals[vals.length - 1];
                const hasDelta = displayList.length >= 2 && firstVal !== null && lastVal !== null;
                const delta = hasDelta ? Number((lastVal! - firstVal!).toFixed(1)) : null;

                return (
                  <tr key={foldKey} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-2.5 text-slate-900 font-sans font-medium flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                      {def.name}
                    </td>
                    {vals.map((v, i) => (
                      <td key={i} className="px-4 py-2.5 text-right text-slate-700">
                        {v !== null && Number(v) > 0 ? `${Number(v).toFixed(1)} mm` : '—'}
                      </td>
                    ))}
                    {displayList.length >= 2 && (
                      <td className="px-4 py-2.5 text-right font-bold bg-slate-50/50">
                        {delta !== null ? (
                          <span
                            className={`inline-flex items-center gap-0.5 ${
                              delta < 0
                                ? 'text-emerald-700'
                                : delta > 0
                                ? 'text-rose-600'
                                : 'text-slate-500'
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
              <tr className="bg-slate-50/90 font-bold border-t-2 border-slate-200">
                <td className="px-4 py-3 text-slate-900 font-sans">
                  SOMA TOTAL DAS DOBRAS
                </td>
                {displayList.map((ev, i) => (
                  <td key={i} className="px-4 py-3 text-right text-slate-900">
                    {ev.results.somaDobras.toFixed(1)} mm
                  </td>
                ))}
                {displayList.length >= 2 && (
                  <td className="px-4 py-3 text-right text-slate-900 bg-slate-100">
                    {(() => {
                      const d = Number(
                        (
                          displayList[displayList.length - 1].results.somaDobras -
                          displayList[0].results.somaDobras
                        ).toFixed(1)
                      );
                      return (
                        <span className={d < 0 ? 'text-emerald-700' : d > 0 ? 'text-rose-600' : 'text-slate-700'}>
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
