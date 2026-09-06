import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  DensityEquation,
  EvaluationRecord,
  Gender,
  MethodType,
  PatientInfo,
  PerimetryValues,
  ProtocolType,
  SkinfoldKey,
  SkinfoldValues,
  ConsistencyAnalysisResult,
} from '../types';
import {
  calculateBMI,
  getRequiredSkinfolds,
  runAnthropometricAssessment,
} from '../utils/anthropometry';
import {
  INITIAL_SAMPLE_EVALUATIONS,
  PROTOCOLS_LIST,
  SKINFOLD_DEFINITIONS,
} from '../data/protocolData';
import { Header } from '../components/Header';
import { GeneralInfoCard } from '../components/GeneralInfoCard';
import { ProtocolSelector } from '../components/ProtocolSelector';
import { AnatomicalBodyMap } from '../components/AnatomicalBodyMap';
import { SkinfoldQuickTip } from '../components/SkinfoldQuickTip';
import { SkinfoldsInputCard } from '../components/SkinfoldsInputCard';
import { PerimetryCard } from '../components/PerimetryCard';
import { ResultsDashboard } from '../components/ResultsDashboard';
import { ClassificationCard } from '../components/ClassificationCard';
import { GoalProjectionCard } from '../components/GoalProjectionCard';
import { EvolutionSection } from '../components/EvolutionSection';
import { MeasurementGuideModal } from '../components/MeasurementGuideModal';
import { PrintableReportModal } from '../components/PrintableReportModal';
import { HistoryModal } from '../components/HistoryModal';
import { AutoFillModal } from '../components/AutoFillModal';
import { SkinfoldConsistencyModal } from '../components/SkinfoldConsistencyModal';
import {
  CheckCircle2,
  AlertCircle,
  FileText,
  Save,
  RotateCcw,
  Sparkles,
  Info,
  ShieldAlert,
  Loader2,
  TrendingDown,
  TrendingUp,
  Scale,
  Activity,
  Calendar,
  Layers,
  ArrowDownRight,
  ArrowUpRight,
  Minus,
  Bluetooth,
  MapPin,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

// ==========================================================================
// DASHBOARD DE EVOLUÇÃO HISTÓRICA DO % GORDURA E PESO (RECHARTS)
// ==========================================================================

interface HistoricalEvolutionDashboardProps {
  evaluations: EvaluationRecord[];
  currentRecord: EvaluationRecord | null;
  onSelectEvaluation?: (record: EvaluationRecord) => void;
}

interface ChartDataPoint {
  id: string;
  rawRecord: EvaluationRecord;
  titulo: string;
  data: string;
  fullDate: string;
  peso: number;
  percentualGordura: number;
  massaGordaKg: number;
  massaLivreGorduraKg: number;
  imc: number;
  isCurrent?: boolean;
}

export const HistoricalEvolutionDashboard: React.FC<HistoricalEvolutionDashboardProps> = ({
  evaluations,
  currentRecord,
  onSelectEvaluation,
}) => {
  const [chartMode, setChartMode] = useState<'dual' | 'gordura' | 'peso' | 'composicao'>('dual');
  const [includeCurrent, setIncludeCurrent] = useState<boolean>(true);

  // Combine saved evaluations and active evaluation into a chronological series
  const chartData: ChartDataPoint[] = useMemo(() => {
    const list: EvaluationRecord[] = [...evaluations];

    // Append current record if valid and not already stored under the same ID
    if (includeCurrent && currentRecord && currentRecord.results.isValid) {
      const alreadyPresent = list.some((e) => e.id === currentRecord.id);
      if (!alreadyPresent) {
        list.push({
          ...currentRecord,
          titulo: currentRecord.titulo || 'Avaliação Atual (Hoje)',
        });
      }
    }

    // Sort chronologically
    list.sort((a, b) => {
      const dateA = new Date(a.patient.dataAvaliacao || a.createdAt || 0).getTime();
      const dateB = new Date(b.patient.dataAvaliacao || b.createdAt || 0).getTime();
      return dateA - dateB;
    });

    return list.map((ev, idx) => {
      const dateObj = ev.patient.dataAvaliacao
        ? new Date(ev.patient.dataAvaliacao + 'T00:00:00')
        : new Date();
      const formattedDate = dateObj.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
      });
      const fullDate = dateObj.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });

      return {
        id: ev.id,
        rawRecord: ev,
        titulo: ev.titulo || `Avaliação ${idx + 1}`,
        data: formattedDate,
        fullDate,
        peso: Number(ev.patient.peso.toFixed(1)),
        percentualGordura: Number(ev.results.percentualGordura.toFixed(1)),
        massaGordaKg: Number(ev.results.massaGordaKg.toFixed(1)),
        massaLivreGorduraKg: Number(ev.results.massaLivreGorduraKg.toFixed(1)),
        imc: Number(ev.results.imc.toFixed(2)),
        isCurrent: ev.id === currentRecord?.id,
      };
    });
  }, [evaluations, currentRecord, includeCurrent]);

  const firstEval = chartData[0];
  const lastEval = chartData[chartData.length - 1];

  const deltaPeso =
    firstEval && lastEval ? Number((lastEval.peso - firstEval.peso).toFixed(1)) : 0;
  const deltaGordura =
    firstEval && lastEval
      ? Number((lastEval.percentualGordura - firstEval.percentualGordura).toFixed(1))
      : 0;
  const deltaMassaMagra =
    firstEval && lastEval
      ? Number((lastEval.massaLivreGorduraKg - firstEval.massaLivreGorduraKg).toFixed(1))
      : 0;
  const deltaMassaGorda =
    firstEval && lastEval
      ? Number((lastEval.massaGordaKg - firstEval.massaGordaKg).toFixed(1))
      : 0;

  // Custom Medical-grade Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item: ChartDataPoint = payload[0].payload;
      return (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 text-xs font-sans space-y-2 min-w-[210px] animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              {item.titulo}
            </span>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
              {item.fullDate}
            </span>
          </div>
          
          <div className="space-y-1.5 font-mono pt-1">
            <div className="flex items-center justify-between text-sky-700 dark:text-sky-400">
              <span className="font-sans text-slate-600 dark:text-slate-300 flex items-center gap-1">
                <Scale className="w-3 h-3 text-sky-500" /> Peso Corporal:
              </span>
              <strong className="text-sm font-bold">{item.peso.toFixed(1)} kg</strong>
            </div>

            <div className="flex items-center justify-between text-amber-700 dark:text-amber-400">
              <span className="font-sans text-slate-600 dark:text-slate-300 flex items-center gap-1">
                <Activity className="w-3 h-3 text-amber-500" /> % Gordura:
              </span>
              <strong className="text-sm font-bold">{item.percentualGordura.toFixed(1)}%</strong>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-400 font-sans block text-[10px]">Massa Magra:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {item.massaLivreGorduraKg.toFixed(1)} kg
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-sans block text-[10px]">Massa Gorda:</span>
                <span className="font-bold text-orange-600 dark:text-orange-400">
                  {item.massaGordaKg.toFixed(1)} kg
                </span>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 font-sans flex justify-between pt-1">
              <span>IMC: <strong>{item.imc.toFixed(2)} kg/m²</strong></span>
              {item.isCurrent && (
                <span className="text-sky-600 dark:text-sky-400 font-semibold">• Em edição</span>
              )}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      id="dashboard-evolucao-historica"
      className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs p-4 sm:p-7 space-y-4 sm:space-y-6 transition-colors duration-200"
    >
      {/* 1. Header do Dashboard */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-400 flex items-center justify-center border border-sky-100 dark:border-sky-800/80 shadow-2xs shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold font-sans text-slate-900 dark:text-white tracking-tight">
                Evolução Histórica da Composição Corporal
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-100 text-sky-800 dark:bg-sky-900/60 dark:text-sky-300">
                Recharts
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Acompanhamento longitudinal do percentual de gordura corporal (%G) e peso (kg)
            </p>
          </div>
        </div>

        {/* Controles de Visualização */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Seletor de Modo de Gráfico */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200 dark:border-slate-700/70 text-xs overflow-x-auto no-scrollbar max-w-full flex-nowrap shrink-0">
            <button
              type="button"
              onClick={() => setChartMode('dual')}
              className={`min-h-[40px] px-3.5 py-2 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                chartMode === 'dual'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Peso + %G
            </button>
            <button
              type="button"
              onClick={() => setChartMode('gordura')}
              className={`min-h-[40px] px-3.5 py-2 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                chartMode === 'gordura'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Apenas %G
            </button>
            <button
              type="button"
              onClick={() => setChartMode('peso')}
              className={`min-h-[40px] px-3.5 py-2 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                chartMode === 'peso'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Apenas Peso
            </button>
            <button
              type="button"
              onClick={() => setChartMode('composicao')}
              className={`min-h-[40px] px-3.5 py-2 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                chartMode === 'composicao'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Magra vs Gorda
            </button>
          </div>

          {/* Toggle Incluir Avaliação Atual */}
          {currentRecord && currentRecord.results.isValid && (
            <label className="min-h-[40px] flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 cursor-pointer bg-slate-50 dark:bg-slate-800/40 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800">
              <input
                type="checkbox"
                checked={includeCurrent}
                onChange={(e) => setIncludeCurrent(e.target.checked)}
                className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
              />
              <span>Incluir consulta atual</span>
            </label>
          )}
        </div>
      </div>

      {/* 2. Resumo de Métricas / Deltas de Evolução */}
      {firstEval && lastEval && chartData.length > 1 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Card % Gordura */}
          <div className="p-4 bg-slate-50/80 dark:bg-slate-800/40 rounded-2xl border border-slate-200/90 dark:border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 font-mono block">
              % Gordura Corporal
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                {lastEval.percentualGordura.toFixed(1)}%
              </span>
              <span
                className={`inline-flex items-center text-xs font-bold font-mono px-1.5 py-0.5 rounded-full ${
                  deltaGordura < 0
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                    : deltaGordura > 0
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {deltaGordura < 0 ? (
                  <ArrowDownRight className="w-3 h-3 mr-0.5" />
                ) : deltaGordura > 0 ? (
                  <ArrowUpRight className="w-3 h-3 mr-0.5" />
                ) : (
                  <Minus className="w-3 h-3 mr-0.5" />
                )}
                {deltaGordura > 0 ? `+${deltaGordura}` : deltaGordura}%
              </span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-1">
              Inicial: {firstEval.percentualGordura.toFixed(1)}%
            </span>
          </div>

          {/* Card Peso */}
          <div className="p-4 bg-slate-50/80 dark:bg-slate-800/40 rounded-2xl border border-slate-200/90 dark:border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400 font-mono block">
              Peso Corporal
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                {lastEval.peso.toFixed(1)} kg
              </span>
              <span
                className={`inline-flex items-center text-xs font-bold font-mono px-1.5 py-0.5 rounded-full ${
                  deltaPeso < 0
                    ? 'bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300'
                    : deltaPeso > 0
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {deltaPeso < 0 ? (
                  <ArrowDownRight className="w-3 h-3 mr-0.5" />
                ) : deltaPeso > 0 ? (
                  <ArrowUpRight className="w-3 h-3 mr-0.5" />
                ) : (
                  <Minus className="w-3 h-3 mr-0.5" />
                )}
                {deltaPeso > 0 ? `+${deltaPeso}` : deltaPeso} kg
              </span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-1">
              Inicial: {firstEval.peso.toFixed(1)} kg
            </span>
          </div>

          {/* Card Massa Magra */}
          <div className="p-4 bg-slate-50/80 dark:bg-slate-800/40 rounded-2xl border border-slate-200/90 dark:border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-mono block">
              Massa Livre (Magra)
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                {lastEval.massaLivreGorduraKg.toFixed(1)} kg
              </span>
              <span
                className={`inline-flex items-center text-xs font-bold font-mono px-1.5 py-0.5 rounded-full ${
                  deltaMassaMagra >= 0
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'
                }`}
              >
                {deltaMassaMagra >= 0 ? `+${deltaMassaMagra}` : deltaMassaMagra} kg
              </span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-1">
              Inicial: {firstEval.massaLivreGorduraKg.toFixed(1)} kg
            </span>
          </div>

          {/* Card Massa Gorda */}
          <div className="p-4 bg-slate-50/80 dark:bg-slate-800/40 rounded-2xl border border-slate-200/90 dark:border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 font-mono block">
              Massa Adiposa
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                {lastEval.massaGordaKg.toFixed(1)} kg
              </span>
              <span
                className={`inline-flex items-center text-xs font-bold font-mono px-1.5 py-0.5 rounded-full ${
                  deltaMassaGorda <= 0
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'
                }`}
              >
                {deltaMassaGorda > 0 ? `+${deltaMassaGorda}` : deltaMassaGorda} kg
              </span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-1">
              Inicial: {firstEval.massaGordaKg.toFixed(1)} kg
            </span>
          </div>
        </div>
      )}

      {/* 3. Área do Gráfico Recharts */}
      <div className="w-full h-[320px] pt-2">
        {chartData.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-xs">
            <Activity className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-2 animate-pulse" />
            <p>Nenhuma avaliação disponível para o gráfico histórico.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 10, right: chartMode === 'dual' ? 20 : 10, left: -10, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#cbd5e1"
                className="opacity-40 dark:opacity-15"
              />

              <XAxis
                dataKey="data"
                stroke="#94a3b8"
                tick={{ fontSize: 11, fill: '#64748b' }}
                dy={6}
              />

              {/* Modo 1: Dual Axes (Peso e % de Gordura) */}
              {chartMode === 'dual' && (
                <>
                  <YAxis
                    yAxisId="peso"
                    orientation="left"
                    stroke="#0284c7"
                    unit=" kg"
                    domain={['dataMin - 2', 'dataMax + 2']}
                    tick={{ fontSize: 11, fill: '#0284c7' }}
                  />
                  <YAxis
                    yAxisId="gordura"
                    orientation="right"
                    stroke="#f59e0b"
                    unit=" %"
                    domain={['dataMin - 2', 'dataMax + 2']}
                    tick={{ fontSize: 11, fill: '#f59e0b' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}
                  />
                  <Area
                    yAxisId="peso"
                    type="monotone"
                    dataKey="peso"
                    name="Peso Corporal (kg)"
                    fill="#0284c7"
                    fillOpacity={0.08}
                    stroke="#0284c7"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#0284c7', strokeWidth: 2, stroke: '#ffffff' }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    yAxisId="gordura"
                    type="monotone"
                    dataKey="percentualGordura"
                    name="% Gordura Corporal"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    dot={{ r: 5, fill: '#f59e0b', strokeWidth: 2, stroke: '#ffffff' }}
                    activeDot={{ r: 7 }}
                  />
                </>
              )}

              {/* Modo 2: Apenas % de Gordura */}
              {chartMode === 'gordura' && (
                <>
                  <YAxis
                    stroke="#f59e0b"
                    unit=" %"
                    domain={['dataMin - 2', 'dataMax + 2']}
                    tick={{ fontSize: 11, fill: '#f59e0b' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
                  <Area
                    type="monotone"
                    dataKey="percentualGordura"
                    name="% Gordura Corporal"
                    fill="#f59e0b"
                    fillOpacity={0.15}
                    stroke="#f59e0b"
                    strokeWidth={3}
                    dot={{ r: 5, fill: '#f59e0b', strokeWidth: 2, stroke: '#ffffff' }}
                    activeDot={{ r: 7 }}
                  />
                </>
              )}

              {/* Modo 3: Apenas Peso */}
              {chartMode === 'peso' && (
                <>
                  <YAxis
                    stroke="#0284c7"
                    unit=" kg"
                    domain={['dataMin - 2', 'dataMax + 2']}
                    tick={{ fontSize: 11, fill: '#0284c7' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
                  <Area
                    type="monotone"
                    dataKey="peso"
                    name="Peso Corporal (kg)"
                    fill="#0284c7"
                    fillOpacity={0.15}
                    stroke="#0284c7"
                    strokeWidth={3}
                    dot={{ r: 5, fill: '#0284c7', strokeWidth: 2, stroke: '#ffffff' }}
                    activeDot={{ r: 7 }}
                  />
                </>
              )}

              {/* Modo 4: Massa Magra vs Massa Gorda */}
              {chartMode === 'composicao' && (
                <>
                  <YAxis
                    stroke="#64748b"
                    unit=" kg"
                    domain={['dataMin - 2', 'dataMax + 2']}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
                  <Area
                    type="monotone"
                    dataKey="massaLivreGorduraKg"
                    name="Massa Livre / Magra (kg)"
                    fill="#10b981"
                    fillOpacity={0.15}
                    stroke="#10b981"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="massaGordaKg"
                    name="Massa Gorda (kg)"
                    fill="#f59e0b"
                    fillOpacity={0.15}
                    stroke="#f59e0b"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#f59e0b', strokeWidth: 2, stroke: '#fff' }}
                  />
                </>
              )}
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* 4. Timeline Interativa das Avaliações */}
      {chartData.length > 0 && (
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono block mb-2.5">
            Histórico das Consultas Registradas (Clique para inspecionar):
          </span>
          <div className="flex flex-wrap gap-2">
            {chartData.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectEvaluation && onSelectEvaluation(item.rawRecord)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                  item.isCurrent
                    ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-800 ring-2 ring-sky-500/20'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold">{item.titulo}</span>
                <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                  ({item.fullDate})
                </span>
                <span className="font-mono font-bold text-sky-700 dark:text-sky-400 ml-1">
                  {item.percentualGordura}%G
                </span>
                <span className="text-slate-300 dark:text-slate-600">|</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">
                  {item.peso}kg
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const STORAGE_KEY_EVALS = 'nutri_dobras_avaliacoes_v1';
const STORAGE_KEY_CURRENT = 'nutri_dobras_current_state_v1';

export function Anthropometry() {
  // Initialize patient state
  const [patient, setPatient] = useState<PatientInfo>(() => {
    return {
      id: 'paciente-demo',
      nome: 'Camila Mendonça Rodrigues',
      sexo: 'feminino',
      idade: 28,
      peso: 62.8,
      altura: 165,
      dataNascimento: '1998-04-15',
      nivelAtividade: 'moderado',
      avaliador: 'Dra. Vanessa Rios (CRN 4281)',
      dataAvaliacao: new Date().toISOString().split('T')[0],
      observacoes: 'Paciente relata boa evolução na disposição física e adesão satisfatória à distribuição proteica recomendada. Meta de recomposição corporal em curso.',
    };
  });

  const [method, setMethod] = useState<MethodType>('jackon-pollock');
  const [protocol, setProtocol] = useState<ProtocolType>('jp-7');
  const [densityEquation, setDensityEquation] = useState<DensityEquation>('siri');

  // Skinfold values (in mm)
  const [skinfolds, setSkinfolds] = useState<SkinfoldValues>(() => ({
    peitoral: 12.0,
    axilarMedia: 13.2,
    triceps: 16.5,
    subescapular: 15.0,
    abdomen: 20.2,
    supraIliaca: 17.5,
    coxa: 24.0,
    biceps: 10.0,
    panturrilhaMedial: 15.0,
  }));

  // Perimetry values (in cm)
  const [perimetry, setPerimetry] = useState<PerimetryValues>(() => ({
    ombro: 101.5,
    torax: 87.5,
    cintura: 70.0,
    abdomen: 78.5,
    quadril: 99.0,
    bracoDireito: 28.2,
    bracoEsquerdo: 28.0,
    coxaDireita: 56.5,
    coxaEsquerda: 56.4,
    panturrilhaDireita: 36.2,
    panturrilhaEsquerda: 36.2,
  }));

  // Selected anatomical hotspot on body map
  const [selectedFoldKey, setSelectedFoldKey] = useState<SkinfoldKey | null>('triceps');

  // Alternador do painel lateral de dobras (Dica Rápida com IA vs Mapa Anatômico)
  const [sideViewMode, setSideViewMode] = useState<'dica-rapida' | 'mapa-corporal'>('dica-rapida');

  // AI summary state
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  // Stored historical evaluations for comparison
  const [evaluations, setEvaluations] = useState<EvaluationRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_EVALS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_SAMPLE_EVALUATIONS;
  });

  // Modals state
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isAutoFillOpen, setIsAutoFillOpen] = useState<boolean>(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);

  // Auditoria IA de Consistência e Coerência Clínica de Dobras
  const [isAnalyzingConsistency, setIsAnalyzingConsistency] = useState<boolean>(false);
  const [consistencyAuditResult, setConsistencyAuditResult] = useState<ConsistencyAnalysisResult | null>(null);

  // Quick Notification Toast
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'warn' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'warn' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Disparo da Auditoria Clínica de Inconsistência de Dobras com IA
  const handleAnalyzeConsistency = async () => {
    const filledCount = Object.values(skinfolds).filter(
      (v) => v !== null && v !== undefined && !isNaN(Number(v)) && Number(v) > 0
    ).length;

    if (filledCount < 2) {
      showToast('Preencha ao menos 2 dobras cutâneas para auditar a coerência anatômica.', 'warn');
      return;
    }

    setIsAnalyzingConsistency(true);
    setIsAuditModalOpen(true);

    try {
      const response = await fetch('/api/analyze-skinfold-consistency', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient: {
            sexo: patient.sexo,
            idade: patient.idade,
            peso: patient.peso,
            altura: patient.altura,
            nivelAtividade: patient.nivelAtividade,
          },
          skinfolds,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Falha ao analisar inconsistências.');
      }

      const resultData: ConsistencyAnalysisResult = await response.json();
      setConsistencyAuditResult(resultData);

      if (resultData.status === 'inconsistente') {
        showToast('Inconsistência anatômica detectada. Confira os dados sinalizados.', 'warn');
      } else if (resultData.status === 'atencao') {
        showToast('Atenção a assimetrias específicas nas dobras.', 'info');
      } else {
        showToast('Dobras cutâneas clinicamente consistentes!', 'success');
      }
    } catch (err: any) {
      console.error('Erro na auditoria de consistência:', err);
      showToast(err.message || 'Erro ao conectar ao serviço de auditoria.', 'warn');
    } finally {
      setIsAnalyzingConsistency(false);
    }
  };

  // Preenchimento Automático via Bluetooth ou Arquivo
  const handleApplyImportedData = (data: {
    patientUpdate?: Partial<PatientInfo>;
    perimetryUpdate?: Partial<PerimetryValues>;
    skinfoldUpdate?: Partial<SkinfoldValues>;
    bioimpedanceNote?: string;
  }) => {
    let appliedCount = 0;

    if (data.patientUpdate && Object.keys(data.patientUpdate).length > 0) {
      setPatient((prev) => ({ ...prev, ...data.patientUpdate }));
      appliedCount += Object.keys(data.patientUpdate).length;
    }

    if (data.perimetryUpdate && Object.keys(data.perimetryUpdate).length > 0) {
      setPerimetry((prev) => ({ ...prev, ...data.perimetryUpdate }));
      appliedCount += Object.keys(data.perimetryUpdate).length;
    }

    if (data.skinfoldUpdate && Object.keys(data.skinfoldUpdate).length > 0) {
      setSkinfolds((prev) => ({ ...prev, ...data.skinfoldUpdate }));
      appliedCount += Object.keys(data.skinfoldUpdate).length;
    }

    if (data.bioimpedanceNote) {
      setPatient((prev) => ({
        ...prev,
        observacoes: prev.observacoes
          ? `${prev.observacoes}\n\n${data.bioimpedanceNote}`
          : data.bioimpedanceNote,
      }));
    }

    showToast(
      `Preenchimento automático concluído com sucesso! ${appliedCount} medida(s) importada(s).`,
      'success'
    );
  };

  // Persist evaluations in localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_EVALS, JSON.stringify(evaluations));
    } catch (e) {
      console.error('Storage error:', e);
    }
  }, [evaluations]);

  // Derive required folds list based on active protocol and sex
  const requiredFolds = useMemo(() => {
    return getRequiredSkinfolds(method, protocol, patient.sexo);
  }, [method, protocol, patient.sexo]);

  // Keep selected fold key valid when protocol changes
  useEffect(() => {
    if (selectedFoldKey && !requiredFolds.includes(selectedFoldKey)) {
      setSelectedFoldKey(requiredFolds[0] || null);
    }
  }, [requiredFolds, selectedFoldKey]);

  // Execute pure anthropometric calculation engine
  const calculationResults = useMemo(() => {
    return runAnthropometricAssessment(
      patient.peso,
      patient.altura,
      patient.idade,
      patient.sexo,
      method,
      protocol,
      densityEquation,
      skinfolds,
      perimetry
    );
  }, [patient.peso, patient.altura, patient.idade, patient.sexo, method, protocol, densityEquation, skinfolds, perimetry]);

  // Current active evaluation as a record object
  const currentRecord = useMemo<EvaluationRecord>(() => {
    return {
      id: 'current-eval',
      titulo: 'Avaliação em Andamento',
      patient,
      method,
      protocol,
      densityEquation,
      skinfolds,
      perimetry,
      results: calculationResults,
      createdAt: new Date().toISOString(),
    };
  }, [patient, method, protocol, densityEquation, skinfolds, perimetry, calculationResults]);

  // Listen for global open report events from the persistent header
  useEffect(() => {
    const handleOpenReportEvent = () => {
      setIsReportOpen(true);
    };
    window.addEventListener('open-printable-report', handleOpenReportEvent);
    return () => {
      window.removeEventListener('open-printable-report', handleOpenReportEvent);
    };
  }, []);

  // Update skinfold value
  const handleSkinfoldChange = (key: SkinfoldKey, val: number | null) => {
    setSkinfolds((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  // Update perimetry value
  const handlePerimetryChange = (key: keyof PerimetryValues, val: number | null) => {
    setPerimetry((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  // Patient Info change
  const handlePatientChange = (updates: Partial<PatientInfo>) => {
    setPatient((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  // Reset form
  const handleResetForm = () => {
    if (window.confirm('Deseja limpar todos os valores de dobras desta avaliação?')) {
      setSkinfolds({
        peitoral: null,
        axilarMedia: null,
        triceps: null,
        subescapular: null,
        abdomen: null,
        supraIliaca: null,
        coxa: null,
        biceps: null,
        panturrilhaMedial: null,
      });
      showToast('Campos de dobras redefinidos para nova coleta.', 'info');
    }
  };

  // New clean evaluation
  const handleNewEvaluation = () => {
    setPatient((prev) => ({
      ...prev,
      dataAvaliacao: new Date().toISOString().split('T')[0],
      observacoes: '',
    }));
    setSkinfolds({
      peitoral: null,
      axilarMedia: null,
      triceps: null,
      subescapular: null,
      abdomen: null,
      supraIliaca: null,
      coxa: null,
      biceps: null,
      panturrilhaMedial: null,
    });
    showToast('Nova avaliação iniciada. Insira as medidas do cliente.', 'info');
  };

  // Save current evaluation into history
  const handleSaveEvaluation = () => {
    if (!calculationResults.isValid) {
      showToast(
        `Preencha todas as dobras obrigatórias (${calculationResults.missingFields.length} pendente(s)) para salvar.`,
        'warn'
      );
      return;
    }

    const newEvalId = `eval-${Date.now()}`;
    const count = evaluations.length + 1;
    const newRecord: EvaluationRecord = {
      id: newEvalId,
      titulo: `Avaliação ${count} (${new Date().toLocaleDateString('pt-BR')})`,
      patient: { ...patient },
      method,
      protocol,
      densityEquation,
      skinfolds: { ...skinfolds },
      perimetry: { ...perimetry },
      results: { ...calculationResults },
      createdAt: new Date().toISOString(),
    };

    setEvaluations((prev) => [...prev, newRecord]);
    showToast('Avaliação salva com sucesso no histórico do paciente!', 'success');
  };

  // Load a saved evaluation into editor
  const handleLoadEvaluation = (ev: EvaluationRecord) => {
    setPatient({ ...ev.patient });
    setMethod(ev.method);
    setProtocol(ev.protocol);
    setDensityEquation(ev.densityEquation || 'siri');
    setSkinfolds({ ...ev.skinfolds });
    setPerimetry({ ...ev.perimetry });
    showToast(`Avaliação "${ev.titulo}" carregada para visualização.`, 'info');
  };

  // Duplicate evaluation
  const handleDuplicateEvaluation = (ev: EvaluationRecord) => {
    const duplicated: EvaluationRecord = {
      ...ev,
      id: `eval-${Date.now()}`,
      titulo: `${ev.titulo} (Cópia)`,
      patient: {
        ...ev.patient,
        dataAvaliacao: new Date().toISOString().split('T')[0],
      },
      createdAt: new Date().toISOString(),
    };
    setEvaluations((prev) => [...prev, duplicated]);
    showToast(`Avaliação duplicada com sucesso.`, 'success');
  };

  // Delete evaluation
  const handleDeleteEvaluation = (id: string) => {
    if (window.confirm('Tem certeza de que deseja remover esta avaliação do histórico?')) {
      setEvaluations((prev) => prev.filter((item) => item.id !== id));
      showToast('Avaliação removida do histórico.', 'info');
    }
  };

  // Sample values helper for demonstration
  const handleFillSampleValues = () => {
    if (patient.sexo === 'masculino') {
      setSkinfolds({
        peitoral: 10.5,
        axilarMedia: 12.0,
        triceps: 11.2,
        subescapular: 13.5,
        abdomen: 18.0,
        supraIliaca: 14.5,
        coxa: 16.0,
        biceps: 6.5,
        panturrilhaMedial: 9.0,
      });
    } else {
      setSkinfolds({
        peitoral: 12.0,
        axilarMedia: 13.2,
        triceps: 16.5,
        subescapular: 15.0,
        abdomen: 20.2,
        supraIliaca: 17.5,
        coxa: 24.0,
        biceps: 10.0,
        panturrilhaMedial: 15.0,
      });
    }
    showToast('Valores de exemplo clínico preenchidos com sucesso.', 'info');
  };

  const handleGenerateSummary = async () => {
    if (!calculationResults.isValid) {
      showToast('A avaliação precisa estar completa para gerar o resumo.', 'warn');
      return;
    }

    setIsGeneratingSummary(true);
    
    const prompt = `Paciente: ${patient.nome}, Idade: ${patient.idade}, Sexo: ${patient.sexo}, Altura: ${patient.altura}cm, Peso: ${patient.peso}kg. Nível de atividade: ${patient.nivelAtividade}. Resultados: % Gordura: ${calculationResults.percentualGordura.toFixed(1)}% (${calculationResults.gorduraClassificacao}), Massa Gorda: ${calculationResults.massaGordaKg.toFixed(1)}kg, Massa Magra: ${calculationResults.massaLivreGorduraKg.toFixed(1)}kg. TMB: ${Math.round(calculationResults.tmb)} kcal/dia. IMC: ${calculationResults.imc.toFixed(2)} (${calculationResults.imcClassificacao}). Observações atuais: ${patient.observacoes || 'Nenhuma'}.`;

    try {
      const response = await fetch('/api/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Falha ao gerar o resumo');
      }

      const data = await response.json();
      
      handlePatientChange({
        observacoes: (patient.observacoes ? patient.observacoes + '\n\n---\nResumo IA:\n' : 'Resumo IA:\n') + data.text
      });
      showToast('Resumo gerado com sucesso.', 'success');
    } catch (error) {
      console.error(error);
      showToast('Erro ao gerar o resumo com IA.', 'warn');
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const activeProtocolConfig =
    PROTOCOLS_LIST.find((p) => p.id === protocol) || PROTOCOLS_LIST[0];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col font-sans text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* Top Professional Header */}
      <Header
        patient={patient}
        onNewEvaluation={handleNewEvaluation}
        onSaveEvaluation={handleSaveEvaluation}
        onOpenReport={() => setIsReportOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onResetForm={handleResetForm}
        onOpenAutoFill={() => setIsAutoFillOpen(true)}
        savedCount={evaluations.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-4 sm:space-y-6">
        {/* Floating Toast Message */}
        {toastMessage && (
          <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-5">
            <div
              className={`px-5 py-3.5 rounded-2xl shadow-xl border flex items-center gap-3 text-xs font-medium ${
                toastMessage.type === 'success'
                  ? 'bg-slate-900 text-white border-sky-500'
                  : toastMessage.type === 'warn'
                  ? 'bg-amber-900 text-amber-100 border-amber-500'
                  : 'bg-slate-800 text-slate-200 border-slate-700'
              }`}
            >
              {toastMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
              ) : toastMessage.type === 'warn' ? (
                <AlertCircle className="w-4 h-4 text-amber-300 shrink-0" />
              ) : (
                <Info className="w-4 h-4 text-sky-300 shrink-0" />
              )}
              <span>{toastMessage.text}</span>
            </div>
          </div>
        )}

        {/* Quick Auto-Fill Banner */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-sky-50 dark:bg-sky-950/70 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-sky-100 dark:border-sky-900 shrink-0 shadow-2xs">
              <Bluetooth className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-sans">
                  Modo de Preenchimento Automático
                </h3>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  Bluetooth & TXT/CSV
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Importe medições de balanças de bioimpedância (InBody, Tanita), fitas digitais de perimetria ou relatórios em texto simples.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsAutoFillOpen(true)}
            className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl text-white bg-slate-900 dark:bg-sky-600 hover:bg-slate-800 dark:hover:bg-sky-500 shadow-xs transition-all cursor-pointer shrink-0 self-stretch sm:self-auto active:scale-95"
          >
            <Bluetooth className="w-4 h-4 text-sky-400 dark:text-white" />
            <span>Abrir Preenchimento Automático</span>
          </button>
        </div>

        {/* Section 2: DADOS DO AVALIADO (INFORMAÇÕES GERAIS) */}
        <GeneralInfoCard
          patient={patient}
          onChange={handlePatientChange}
          imc={calculationResults.imc}
          imcClassificacao={calculationResults.imcClassificacao}
        />

        {/* Section 3: SELEÇÃO DO PROTOCOLO (MÉTODO & NÚMERO DE DOBRAS) */}
        <ProtocolSelector
          method={method}
          protocol={protocol}
          sexo={patient.sexo}
          onMethodChange={setMethod}
          onProtocolChange={setProtocol}
        />

        {/* Section 4 & 5: ÁREA DE DOBRAS CUTÂNEAS + DICA RÁPIDA (IA) / MAPA ANATÔMICO */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Input fields */}
          <div className="lg:col-span-7 space-y-6">
            <SkinfoldsInputCard
              requiredFolds={requiredFolds}
              skinfoldValues={skinfolds}
              selectedFoldKey={selectedFoldKey}
              onSelectFold={(k) => setSelectedFoldKey(k)}
              onChangeSkinfold={handleSkinfoldChange}
              onOpenGuide={() => setIsGuideOpen(true)}
              onFillSampleValues={handleFillSampleValues}
              sexo={patient.sexo}
              currentProtocol={protocol}
              currentMethod={method}
              onProtocolChange={setProtocol}
              onMethodChange={setMethod}
              onOpenQuickTip={(k) => {
                setSelectedFoldKey(k);
                setSideViewMode('dica-rapida');
              }}
              onAnalyzeConsistency={handleAnalyzeConsistency}
              isAnalyzingConsistency={isAnalyzingConsistency}
              consistencyAuditStatus={consistencyAuditResult?.status || null}
              consistencyAuditScore={consistencyAuditResult?.overallScore ?? null}
            />
          </div>

          {/* Right: Painel Lateral Auxiliar (Dica Rápida com IA vs Mapa Anatômico 2D) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Seletor Superior de Visualização Lateral */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-1.5 flex items-center gap-1 shadow-2xs">
              <button
                type="button"
                onClick={() => setSideViewMode('dica-rapida')}
                className={`flex-1 min-h-[44px] py-2 px-3 rounded-xl text-xs font-bold font-sans transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${
                  sideViewMode === 'dica-rapida'
                    ? 'bg-slate-900 text-white dark:bg-sky-600 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Dica Rápida (IA)</span>
              </button>
              <button
                type="button"
                onClick={() => setSideViewMode('mapa-corporal')}
                className={`flex-1 min-h-[44px] py-2 px-3 rounded-xl text-xs font-bold font-sans transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${
                  sideViewMode === 'mapa-corporal'
                    ? 'bg-slate-900 text-white dark:bg-sky-600 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Mapa Anatômico 2D</span>
              </button>
            </div>

            {/* Conteúdo Renderizado (Dica Rápida ou Mapa Anatômico) */}
            {sideViewMode === 'dica-rapida' ? (
              <SkinfoldQuickTip
                selectedFoldKey={selectedFoldKey}
                onSelectFold={(k) => setSelectedFoldKey(k)}
                skinfoldValues={skinfolds}
                requiredFolds={requiredFolds}
                sexo={patient.sexo}
              />
            ) : (
              <AnatomicalBodyMap
                requiredFolds={requiredFolds}
                skinfoldValues={skinfolds}
                selectedFoldKey={selectedFoldKey}
                onSelectFold={(k) => setSelectedFoldKey(k)}
                onSwitchToQuickTip={() => setSideViewMode('dica-rapida')}
              />
            )}
          </div>
        </div>

        {/* Section 14: PERIMETRIA & RCQ */}
        <PerimetryCard
          perimetry={perimetry}
          onChangePerimetry={handlePerimetryChange}
          rcq={calculationResults.rcq}
          rcqClassificacao={calculationResults.rcqClassificacao}
          rcqRisco={calculationResults.rcqRisco}
          sexo={patient.sexo}
          idade={patient.idade}
          onOpenAutoFill={() => setIsAutoFillOpen(true)}
        />

        {/* Section 8, 9, 11, 15: RESULTADO PRINCIPAL & DASHBOARD DE RESULTADOS */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-600"></span>
              <h2 className="text-base font-bold font-sans text-slate-900 dark:text-white tracking-tight">
                Resultado da Avaliação & Diagnóstico Antropométrico
              </h2>
            </div>
            {calculationResults.isValid && (
              <span className="text-xs font-mono text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 font-bold self-start sm:self-auto">
                Cálculo Validado em Tempo Real
              </span>
            )}
          </div>

          <ResultsDashboard
            results={calculationResults}
            peso={patient.peso}
            sexo={patient.sexo}
            idade={patient.idade}
            densityEquation={densityEquation}
            onEquationChange={setDensityEquation}
          />
        </div>

        {/* Section 10: CLASSIFICAÇÃO NORMATIVA */}
        {calculationResults.isValid && (
          <ClassificationCard
            results={calculationResults}
            sexo={patient.sexo}
            idade={patient.idade}
          />
        )}

        {/* Section 11: SIMULADOR DE METAS DE COMPOSIÇÃO CORPORAL */}
        {calculationResults.isValid && (
          <GoalProjectionCard
            results={calculationResults}
            pesoAtual={patient.peso}
            alturaCm={patient.altura}
            sexo={patient.sexo}
            idade={patient.idade}
            onApplyToNotes={(summaryText) => {
              setPatient((prev) => ({
                ...prev,
                observacoes: prev.observacoes
                  ? `${prev.observacoes}\n\n${summaryText}`
                  : summaryText,
              }));
            }}
          />
        )}

        {/* Observações Clínicas & Conduta Nutricional */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs p-4 sm:p-7 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-1">
            <label htmlFor="textarea-observacoes" className="block text-xs font-bold text-slate-900 dark:text-slate-200 uppercase font-mono">
              Observações Clínicas & Orientações ao Paciente
            </label>
            <button
              type="button"
              onClick={handleGenerateSummary}
              disabled={!calculationResults.isValid || isGeneratingSummary}
              className={`min-h-[44px] flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-full transition-colors border cursor-pointer active:scale-95 self-start sm:self-auto ${
                !calculationResults.isValid || isGeneratingSummary
                  ? 'bg-slate-50 dark:bg-slate-800/50 text-slate-400 border-slate-200 dark:border-slate-700 cursor-not-allowed'
                  : 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800 hover:bg-sky-100 dark:hover:bg-sky-900/60'
              }`}
            >
              {isGeneratingSummary ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              {isGeneratingSummary ? 'Gerando...' : 'Resumo IA'}
            </button>
          </div>
          <textarea
            id="textarea-observacoes"
            rows={3}
            value={patient.observacoes || ''}
            onChange={(e) => handlePatientChange({ observacoes: e.target.value })}
            placeholder="Registre aqui metas de recomposição, plano de hidratação, orientações de treino resistido e data para a próxima avaliação antropométrica..."
            className="w-full p-4 text-sm sm:text-xs text-slate-800 dark:text-slate-100 bg-slate-50/70 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white dark:focus:bg-slate-800 resize-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>

        {/* Section: DASHBOARD DE EVOLUÇÃO HISTÓRICA (%G E PESO - RECHARTS) */}
        <HistoricalEvolutionDashboard
          evaluations={evaluations}
          currentRecord={calculationResults.isValid ? currentRecord : null}
          onSelectEvaluation={handleLoadEvaluation}
        />

        {/* Section 12 & 13: COMPARAÇÃO DE AVALIAÇÕES & EVOLUÇÃO CORPORAL */}
        <EvolutionSection
          evaluations={evaluations}
          currentRecord={calculationResults.isValid ? currentRecord : null}
          onSelectEvaluation={handleLoadEvaluation}
          onAddNewEvaluation={handleNewEvaluation}
        />
      </main>

      {/* Footer */}
      <footer className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200/90 dark:border-slate-800 py-6 sm:py-8 mt-8 sm:mt-12 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-slate-800 dark:text-slate-200 font-sans">
              Calculadora de Gordura por Dobras
            </span>
            <span>•</span>
            <span>Jackson & Pollock (1978/1980) e Durnin & Womersley (1974)</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Conformidade LGPD (Art. 7º e 11) • Armazenamento local seguro e confidencial.
          </div>
        </div>
      </footer>

      {/* Modais */}
      <MeasurementGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        selectedFold={selectedFoldKey}
      />

      <PrintableReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        patient={patient}
        results={calculationResults}
        skinfolds={skinfolds}
        perimetry={perimetry}
        protocolName={activeProtocolConfig.name}
        allEvaluations={evaluations}
      />

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        evaluations={evaluations}
        onLoadEvaluation={handleLoadEvaluation}
        onDuplicateEvaluation={handleDuplicateEvaluation}
        onDeleteEvaluation={handleDeleteEvaluation}
      />

      <AutoFillModal
        isOpen={isAutoFillOpen}
        onClose={() => setIsAutoFillOpen(false)}
        currentPatient={patient}
        currentPerimetry={perimetry}
        currentSkinfolds={skinfolds}
        onApplyData={handleApplyImportedData}
      />

      <SkinfoldConsistencyModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        result={consistencyAuditResult}
        isLoading={isAnalyzingConsistency}
        patientName={patient.nome}
        onSelectFoldToCorrect={(k) => {
          setSelectedFoldKey(k);
          setSideViewMode('dica-rapida');
          setIsAuditModalOpen(false);
        }}
        onAppendToNotes={(note) => {
          setPatient((prev) => ({
            ...prev,
            observacoes: prev.observacoes ? `${prev.observacoes}\n\n${note}` : note,
          }));
          showToast('Parecer da auditoria incluído nas observações do paciente.', 'success');
        }}
        onReanalyze={handleAnalyzeConsistency}
      />
    </div>
  );
}
