import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calculator,
  Check,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Eye,
  EyeOff,
  Layers,
  Zap,
  Award,
  Activity,
  Filter,
  Stethoscope,
  ShieldCheck,
  AlertOctagon,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Info,
  CheckCircle2
} from 'lucide-react';
import { Gender, MethodType, ProtocolType, SkinfoldKey, SkinfoldValues } from '../types';
import { SKINFOLD_DEFINITIONS } from '../data/protocolData';
import { SkinfoldNormsTooltip } from './SkinfoldNormsTooltip';
import {
  validateSkinfold,
  validateAllSkinfolds,
  getSkinfoldsIntegritySummary,
  validateTrialMeasurements,
  ABSOLUTE_BIOLOGICAL_MIN_MM,
  ABSOLUTE_CALIPER_MAX_MM,
} from '../utils/skinfoldValidation';

interface SkinfoldsInputCardProps {
  requiredFolds: SkinfoldKey[];
  skinfoldValues: SkinfoldValues;
  selectedFoldKey: SkinfoldKey | null;
  onSelectFold: (key: SkinfoldKey) => void;
  onChangeSkinfold: (key: SkinfoldKey, value: number | null) => void;
  onOpenGuide: () => void;
  onFillSampleValues?: () => void;
  sexo?: Gender;
  currentProtocol?: ProtocolType;
  currentMethod?: MethodType;
  onProtocolChange?: (p: ProtocolType) => void;
  onMethodChange?: (m: MethodType) => void;
  onOpenQuickTip?: (key: SkinfoldKey) => void;
  onAnalyzeConsistency?: () => void;
  isAnalyzingConsistency?: boolean;
  consistencyAuditStatus?: 'consistente' | 'atencao' | 'inconsistente' | null;
  consistencyAuditScore?: number | null;
}

const ALL_SKINFOLD_KEYS: SkinfoldKey[] = [
  'peitoral',
  'axilarMedia',
  'triceps',
  'subescapular',
  'abdomen',
  'supraIliaca',
  'coxa',
  'biceps',
  'panturrilhaMedial',
];

export const SkinfoldsInputCard: React.FC<SkinfoldsInputCardProps> = ({
  requiredFolds,
  skinfoldValues,
  selectedFoldKey,
  onSelectFold,
  onChangeSkinfold,
  onOpenGuide,
  onFillSampleValues,
  sexo = 'masculino',
  currentProtocol = 'jp-7',
  currentMethod = 'jackon-pollock',
  onProtocolChange,
  onMethodChange,
  onOpenQuickTip,
  onAnalyzeConsistency,
  isAnalyzingConsistency = false,
  consistencyAuditStatus = null,
  consistencyAuditScore = null,
}) => {
  // Modal state for 3-trial average calculator
  const [trialFold, setTrialFold] = useState<SkinfoldKey | null>(null);
  const [trial1, setTrial1] = useState<string>('');
  const [trial2, setTrial2] = useState<string>('');
  const [trial3, setTrial3] = useState<string>('');

  // Toggle whether to hide non-required fields or show all 9
  const [hideInactiveFolds, setHideInactiveFolds] = useState<boolean>(true);

  // Quick entry mode (Tab / Enter auto-advance & local persistence)
  const [quickEntryMode, setQuickEntryMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('nutri_saas_quick_entry');
    return saved !== null ? JSON.parse(saved) : true;
  });

  React.useEffect(() => {
    localStorage.setItem('nutri_saas_quick_entry', JSON.stringify(quickEntryMode));
  }, [quickEntryMode]);

  const normalizedSexo: Gender = sexo === 'feminino' ? 'feminino' : 'masculino';

  // Real-time validation map for all skinfold fields
  const validationMap = useMemo(() => {
    return validateAllSkinfolds(skinfoldValues, ALL_SKINFOLD_KEYS, normalizedSexo);
  }, [skinfoldValues, normalizedSexo]);

  // Overall integrity summary of required active fields
  const integritySummary = useMemo(() => {
    return getSkinfoldsIntegritySummary(validationMap, requiredFolds);
  }, [validationMap, requiredFolds]);

  // Real-time trial consistency for 3-trial calculator modal
  const trialConsistency = useMemo(() => {
    return validateTrialMeasurements(trial1, trial2, trial3, trialFold || undefined, normalizedSexo);
  }, [trial1, trial2, trial3, trialFold, normalizedSexo]);

  const openTrialModal = (key: SkinfoldKey) => {
    setTrialFold(key);
    const curr = skinfoldValues[key];
    setTrial1(curr ? String(curr) : '');
    setTrial2('');
    setTrial3('');
  };

  const applyTrialAverage = () => {
    if (!trialFold) return;
    if (trialConsistency.average !== null && !trialConsistency.hasErrors) {
      onChangeSkinfold(trialFold, trialConsistency.average);
    } else {
      const v1 = parseFloat(trial1.replace(',', '.'));
      const v2 = parseFloat(trial2.replace(',', '.'));
      const v3 = parseFloat(trial3.replace(',', '.'));
      const validVals = [v1, v2, v3].filter((v) => !isNaN(v) && v > 0);
      if (validVals.length > 0) {
        const avg = Number((validVals.reduce((a, b) => a + b, 0) / validVals.length).toFixed(1));
        onChangeSkinfold(trialFold, avg);
      }
    }
    setTrialFold(null);
  };

  const stepFold = (key: SkinfoldKey, delta: number) => {
    const current = skinfoldValues[key] !== null && skinfoldValues[key] !== undefined ? Number(skinfoldValues[key]) : 0;
    const nextVal = Math.max(0, Number((current + delta).toFixed(1)));
    onChangeSkinfold(key, nextVal);
  };

  const filledCount = requiredFolds.filter(
    (k) => skinfoldValues[k] !== undefined && skinfoldValues[k] !== null && Number(skinfoldValues[k]) > 0
  ).length;
  const isComplete = filledCount === requiredFolds.length;

  const quickProtocols: {
    id: ProtocolType;
    method: MethodType;
    label: string;
    badge: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'jp-3',
      method: 'jackon-pollock',
      label: 'JP 3 Dobras',
      badge: '3D',
      icon: <Zap className="w-3 h-3" />,
    },
    {
      id: 'jp-4',
      method: 'jackon-pollock',
      label: 'JP 4 Dobras',
      badge: '4D',
      icon: <Layers className="w-3 h-3" />,
    },
    {
      id: 'jp-7',
      method: 'jackon-pollock',
      label: 'JP 7 Dobras',
      badge: '7D',
      icon: <Award className="w-3 h-3" />,
    },
    {
      id: 'dw-4',
      method: 'durnin-womersley',
      label: 'Durnin-Womersley',
      badge: 'DW',
      icon: <Activity className="w-3 h-3" />,
    },
  ];

  const foldsToDisplay = hideInactiveFolds ? requiredFolds : ALL_SKINFOLD_KEYS;
  const hiddenCount = ALL_SKINFOLD_KEYS.length - requiredFolds.length;

  const getProtocolName = () => {
    if (currentProtocol === 'jp-3') return 'Jackson-Pollock (3 Dobras)';
    if (currentProtocol === 'jp-4') return 'Jackson-Pollock (4 Dobras)';
    if (currentProtocol === 'jp-7') return 'Jackson-Pollock (7 Dobras)';
    return 'Durnin & Womersley';
  };

  return (
    <div
      id="card-dobras-cutaneas"
      className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs p-6 transition-all"
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 flex items-center justify-center border border-sky-100 dark:border-sky-900/60 shadow-2xs">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white uppercase font-sans">
                Dobras Cutâneas (Adipômetro)
              </h2>
              <span className="hidden sm:inline-flex text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                Validação em Tempo Real (ISAK)
              </span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Insira as medidas em milímetros (mm). O sistema valida limites fisiológicos e previne erros de digitação.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0 sm:flex-wrap max-w-full -mx-1 px-1">
          {onAnalyzeConsistency && (
            <button
              id="btn-analise-consistencia-ia"
              type="button"
              onClick={onAnalyzeConsistency}
              disabled={isAnalyzingConsistency}
              className="inline-flex items-center gap-1.5 text-xs min-h-[40px] px-3.5 py-1.5 text-amber-900 dark:text-amber-300 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 rounded-full border border-amber-200 dark:border-amber-800 font-semibold transition-all cursor-pointer shadow-2xs hover:shadow-xs disabled:opacity-50 shrink-0"
              title="Analisar proporções anatômicas e coerência das dobras com Inteligência Artificial"
            >
              {isAnalyzingConsistency ? (
                <div className="w-3.5 h-3.5 rounded-full border-2 border-amber-600 border-t-transparent animate-spin" />
              ) : consistencyAuditStatus === 'consistente' ? (
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              ) : consistencyAuditStatus === 'inconsistente' ? (
                <AlertOctagon className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              ) : (
                <Stethoscope className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              )}
              <span>Auditar IA</span>
              {consistencyAuditScore !== null && consistencyAuditScore !== undefined && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ml-0.5 ${
                    consistencyAuditStatus === 'consistente'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                      : consistencyAuditStatus === 'atencao'
                      ? 'bg-amber-200/80 text-amber-900 dark:bg-amber-800/80 dark:text-amber-200'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300'
                  }`}
                >
                  {consistencyAuditScore}%
                </span>
              )}
            </button>
          )}

          <button
            id="btn-toggle-entrada-rapida"
            type="button"
            onClick={() => setQuickEntryMode(!quickEntryMode)}
            className={`inline-flex items-center gap-1.5 text-xs min-h-[40px] px-3.5 py-1.5 rounded-full border font-medium transition-all cursor-pointer shrink-0 ${
              quickEntryMode
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
            }`}
            title="Alternar Modo de Entrada Rápida (Pressione Enter para pular para o próximo campo)"
          >
            <Zap className={`w-3.5 h-3.5 ${quickEntryMode ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
            <span>Entrada Rápida: {quickEntryMode ? 'Ativa' : 'Desativada'}</span>
          </button>

          {onFillSampleValues && (
            <button
              id="btn-preencher-exemplo"
              type="button"
              onClick={onFillSampleValues}
              className="inline-flex items-center gap-1.5 text-xs min-h-[40px] px-3.5 py-1.5 text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900/60 rounded-full border border-sky-200 dark:border-sky-800 font-medium transition-colors cursor-pointer shrink-0"
              title="Preencher com valores normais para demonstração rápida"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Exemplo Clínico</span>
            </button>
          )}

          <div
            className={`inline-flex items-center gap-1.5 min-h-[40px] px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold border shrink-0 ${
              integritySummary.hasErrors
                ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                : isComplete
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
            }`}
          >
            {integritySummary.hasErrors ? (
              <AlertOctagon className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            ) : isComplete ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5" />
            )}
            <span>
              {filledCount}/{requiredFolds.length} Obrigatórias
            </span>
          </div>
        </div>
      </div>

      {/* BANNER 1: Alerta de Erro de Digitação / Limites Físicos (se houver erros críticos) */}
      {integritySummary.hasErrors && (
        <div
          id="banner-alerta-erro-dobras"
          className="mb-4 p-3.5 rounded-2xl border border-rose-200 dark:border-rose-800 bg-rose-50/90 dark:bg-rose-950/50 text-rose-900 dark:text-rose-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs animate-in fade-in"
        >
          <div className="flex items-start sm:items-center gap-2.5">
            <AlertOctagon className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <span className="font-bold block sm:inline">
                Atenção: {integritySummary.errorCount} campo(s) com valor fora dos limites físicos do adipômetro.
              </span>{' '}
              <span className="text-rose-800 dark:text-rose-300">
                Campos com alerta:{' '}
                <strong>
                  {integritySummary.criticalFields
                    .map((k) => SKINFOLD_DEFINITIONS[k]?.shortName || k)
                    .join(', ')}
                </strong>
                . Medidas menores que {ABSOLUTE_BIOLOGICAL_MIN_MM} mm ou maiores que {ABSOLUTE_CALIPER_MAX_MM} mm indicam provável erro de digitação (ex: omissão da vírgula).
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              if (integritySummary.criticalFields[0]) {
                onSelectFold(integritySummary.criticalFields[0]);
              }
            }}
            className="px-3 py-1.5 rounded-xl text-[11px] font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors shrink-0 cursor-pointer self-start sm:self-auto"
          >
            Revisar Campos
          </button>
        </div>
      )}

      {/* BANNER 2: Alerta de Valores Atípicos / Desvio Fisiológico (se não houver erros, mas houver avisos) */}
      {!integritySummary.hasErrors && integritySummary.hasWarnings && (
        <div
          id="banner-alerta-aviso-dobras"
          className="mb-4 p-3 rounded-2xl border border-amber-200 dark:border-amber-800/80 bg-amber-50/80 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 text-xs flex items-center justify-between gap-3 shadow-2xs"
        >
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <div>
              <span className="font-bold">Aviso Fisiológico:</span>{' '}
              <span>
                {integritySummary.warningCount} dobra(s) ({integritySummary.warningFields.map((k) => SKINFOLD_DEFINITIONS[k]?.shortName || k).join(', ')}) apresentam valores atípicos para o sexo {sexo}. Verifique a técnica de pinçamento para confirmar se não houve pinçamento do músculo subjacente.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Alerta de Inconsistência Detectada pela Auditoria IA */}
      {consistencyAuditStatus && consistencyAuditStatus !== 'consistente' && (
        <div
          className={`mb-4 p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-xs ${
            consistencyAuditStatus === 'inconsistente'
              ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-300'
              : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {consistencyAuditStatus === 'inconsistente' ? (
              <AlertOctagon className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            )}
            <div>
              <span className="font-bold">
                {consistencyAuditStatus === 'inconsistente'
                  ? 'Inconsistência anatômica detectada:'
                  : 'Atenção a assimetrias anatômicas:'}
              </span>{' '}
              <span>
                Há desproporções entre sítios anatômicos (ex: tríceps vs subescapular ou bíceps). Recomenda-se conferência das medidas.
              </span>
            </div>
          </div>
          {onAnalyzeConsistency && (
            <button
              type="button"
              onClick={onAnalyzeConsistency}
              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs hover:bg-slate-50 transition-colors shrink-0 cursor-pointer"
            >
              Ver Parecer Completo
            </button>
          )}
        </div>
      )}

      {/* Quick Visual Protocol Switcher Bar & Visibility Controls */}
      <div className="mb-4 p-3 bg-slate-50/80 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Quick Protocol Switcher Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1 font-mono">
            <Filter className="w-3 h-3 text-sky-500" />
            Método:
          </span>
          {quickProtocols.map((qp) => {
            const isSelected = qp.id === currentProtocol && qp.method === currentMethod;
            return (
              <button
                key={qp.id}
                type="button"
                onClick={() => {
                  if (onMethodChange) onMethodChange(qp.method);
                  if (onProtocolChange) onProtocolChange(qp.id);
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs rounded-xl font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 dark:bg-sky-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
                title={`Alternar para ${qp.label}`}
              >
                {qp.icon}
                <span>{qp.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Visibility Toggle Button */}
        <button
          type="button"
          onClick={() => setHideInactiveFolds(!hideInactiveFolds)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer self-start md:self-auto ${
            hideInactiveFolds
              ? 'bg-sky-100/70 dark:bg-sky-950/70 text-sky-800 dark:text-sky-300 border border-sky-300/80 dark:border-sky-800'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
          }`}
          title={
            hideInactiveFolds
              ? 'Clique para exibir todas as 9 dobras anatômicas'
              : 'Clique para ocultar as dobras não necessárias do protocolo'
          }
        >
          {hideInactiveFolds ? (
            <>
              <EyeOff className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>Ocultando não utilizadas ({requiredFolds.length} visíveis)</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              <span>Exibindo todas (9 dobras)</span>
            </>
          )}
        </button>
      </div>

      {/* Dynamic Status Notification */}
      {hideInactiveFolds && hiddenCount > 0 && (
        <div className="mb-3 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 flex items-center justify-between">
          <span>
            Exibindo apenas as <strong className="text-slate-900 dark:text-white">{requiredFolds.length} dobras exigidas</strong> para {getProtocolName()}. {hiddenCount} campos não utilizados foram ocultados.
          </span>
          <button
            type="button"
            onClick={() => setHideInactiveFolds(false)}
            className="text-sky-600 dark:text-sky-400 hover:underline font-bold ml-2 shrink-0 cursor-pointer"
          >
            Ver todas
          </button>
        </div>
      )}

      {/* Grid / List of skinfold inputs with real-time validation */}
      <div className="space-y-3">
        {foldsToDisplay.map((key, index) => {
          const def = SKINFOLD_DEFINITIONS[key];
          const val = skinfoldValues[key];
          const isFilled = val !== undefined && val !== null && Number(val) > 0;
          const isSelected = selectedFoldKey === key;
          const isRequiredInCurrentProtocol = requiredFolds.includes(key);

          // Real-time validation computation
          const validation = validationMap[key];
          const isError = validation.status === 'error';
          const isWarning = validation.status === 'warning';
          const isValidAndFilled = validation.status === 'valid';

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, delay: index * 0.03 }}
              layout
              onClick={() => onSelectFold(key)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2.5 ${
                !isRequiredInCurrentProtocol
                  ? 'opacity-60 bg-slate-100/50 dark:bg-slate-900/40 border-dashed border-slate-300 dark:border-slate-800'
                  : isError
                  ? 'bg-rose-50/50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 ring-1 ring-rose-400 shadow-2xs'
                  : isWarning
                  ? 'bg-amber-50/40 dark:bg-amber-950/25 border-amber-300 dark:border-amber-800 ring-1 ring-amber-300'
                  : isSelected
                  ? 'bg-sky-50/70 dark:bg-sky-950/50 border-sky-500 dark:border-sky-500 ring-1 ring-sky-500 shadow-2xs'
                  : isFilled
                  ? 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Left description */}
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-xl font-mono text-xs font-bold flex items-center justify-center shrink-0 ${
                      isError
                        ? 'bg-rose-600 text-white'
                        : isWarning
                        ? 'bg-amber-500 text-white'
                        : !isRequiredInCurrentProtocol
                        ? 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                        : isSelected
                        ? 'bg-sky-700 text-white'
                        : isFilled
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    {def.number}
                  </span>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {def.name}
                      </span>

                      {isRequiredInCurrentProtocol ? (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800 font-bold">
                          Obrigatória
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                          Não utilizada neste protocolo
                        </span>
                      )}

                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium">
                        {def.orientation}
                      </span>

                      {def.normas && (
                        <span className="hidden md:inline-flex text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700 px-2 py-0.5 rounded-full">
                          Normal: {sexo === 'feminino' ? def.normas.mulheres.faixaTexto : def.normas.homens.faixaTexto}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                      {def.anatomicalLocation}
                    </span>
                  </div>
                </div>

                {/* Right input, Dica Rápida, Média & Indicator */}
                <div className="flex flex-wrap sm:flex-nowrap items-center justify-between sm:justify-end gap-2 w-full sm:w-auto pt-2.5 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectFold(key);
                        if (onOpenQuickTip) onOpenQuickTip(key);
                      }}
                      className={`min-h-[44px] sm:min-h-[36px] px-3 sm:px-2.5 py-2 sm:py-1 text-xs sm:text-[11px] font-semibold rounded-xl sm:rounded-full border transition-all flex items-center gap-1 cursor-pointer active:scale-95 ${
                        isSelected
                          ? 'bg-amber-50 text-amber-900 border-amber-300 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800 shadow-2xs'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700'
                      }`}
                      title="Ver dica rápida com ilustração IA e diagrama de pinçamento"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Dica</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openTrialModal(key);
                      }}
                      className="min-h-[44px] sm:min-h-[36px] px-3 sm:px-2.5 py-2 sm:py-1 text-xs sm:text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl sm:rounded-full border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer active:scale-95"
                      title="Aferir 2 ou 3 vezes e calcular a média exata conforme ISAK"
                    >
                      Média 2-3x
                    </button>
                  </div>

                  {/* Input Group with Steppers & Unit */}
                  <div className="flex items-center gap-1">
                    {/* Decrement button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        stepFold(key, -0.5);
                      }}
                      className="min-h-[44px] w-9 sm:w-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 flex items-center justify-center font-mono font-bold text-sm select-none cursor-pointer"
                      title="Diminuir 0.5 mm"
                      aria-label={`Diminuir ${def.name} em 0.5 mm`}
                    >
                      -
                    </button>

                    <div className="relative w-28 sm:w-26">
                      <input
                        id={`input-dobra-${key}`}
                        type="number"
                        inputMode="decimal"
                        step="0.1"
                        min="0"
                        max="900"
                        placeholder="0.0"
                        value={val !== undefined && val !== null ? val : ''}
                        onFocus={() => onSelectFold(key)}
                        onChange={(e) => {
                          const v = e.target.value === '' ? null : parseFloat(e.target.value);
                          onChangeSkinfold(key, v);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && quickEntryMode) {
                            e.preventDefault();
                            const currentIndex = foldsToDisplay.indexOf(key);
                            if (currentIndex !== -1 && currentIndex < foldsToDisplay.length - 1) {
                              const nextKey = foldsToDisplay[currentIndex + 1];
                              const nextInput = document.getElementById(`input-dobra-${nextKey}`) as HTMLInputElement;
                              if (nextInput) {
                                nextInput.focus();
                                nextInput.select();
                              }
                            }
                          }
                        }}
                        className={`w-full min-h-[44px] pl-2.5 pr-8 py-2 text-base sm:text-sm font-mono font-bold text-right rounded-xl border focus:outline-none transition-all ${
                          isError
                            ? 'border-rose-400 dark:border-rose-600 bg-rose-50/80 dark:bg-rose-950/60 text-rose-950 dark:text-rose-100 focus:ring-2 focus:ring-rose-500'
                            : isWarning
                            ? 'border-amber-400 dark:border-amber-600 bg-amber-50/60 dark:bg-amber-950/40 text-amber-950 dark:text-amber-100 focus:ring-2 focus:ring-amber-500'
                            : !isRequiredInCurrentProtocol
                            ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-500'
                            : isFilled
                            ? 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500'
                            : 'bg-slate-50/70 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-500 focus:ring-2 focus:ring-sky-500'
                        }`}
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-mono font-semibold text-slate-400 pointer-events-none">
                        mm
                      </span>
                    </div>

                    {/* Increment button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        stepFold(key, 0.5);
                      }}
                      className="min-h-[44px] w-9 sm:w-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 flex items-center justify-center font-mono font-bold text-sm select-none cursor-pointer"
                      title="Aumentar 0.5 mm"
                      aria-label={`Aumentar ${def.name} em 0.5 mm`}
                    >
                      +
                    </button>
                  </div>

                  {/* Tooltip informativa da variação normal esperada (em mm) por sexo */}
                  <SkinfoldNormsTooltip
                    foldKey={key}
                    definition={def}
                    patientSexo={sexo}
                    currentValue={val}
                    preferBottom={index < 2}
                  />

                  {/* Fill & Validation checkmark indicator */}
                  <div className="w-5 flex justify-center">
                    {isError ? (
                      <AlertOctagon className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                    ) : isWarning ? (
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                    ) : isValidAndFilled ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                    )}
                  </div>
                </div>
              </div>

              {/* INLINE VALIDATION ALERT: Alerta em tempo real específico para o campo */}
              {isError && (
                <div
                  id={`alert-erro-${key}`}
                  className="p-2.5 rounded-xl bg-rose-100/80 dark:bg-rose-950/70 border border-rose-300 dark:border-rose-800 text-xs text-rose-950 dark:text-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 animate-in fade-in"
                >
                  <div className="flex items-start gap-2">
                    <AlertOctagon className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">{validation.title}: </span>
                      <span>{validation.message} </span>
                      <span className="text-rose-800 dark:text-rose-300 block text-[11px] mt-0.5">
                        {validation.clinicalExplanation}
                      </span>
                    </div>
                  </div>

                  {/* Botão de Auto-Correção de 1 clique (ex: 150 -> 15.0) */}
                  {validation.suggestion !== null && validation.suggestion !== undefined && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onChangeSkinfold(key, validation.suggestion!);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-2xs transition-colors shrink-0 cursor-pointer self-start sm:self-auto"
                      title="Aplicar correção automática sugerida"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>{validation.suggestionLabel || `Corrigir para ${validation.suggestion} mm`}</span>
                    </button>
                  )}
                </div>
              )}

              {isWarning && (
                <div
                  id={`alert-aviso-${key}`}
                  className="p-2 rounded-xl bg-amber-100/70 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 text-xs text-amber-950 dark:text-amber-200 flex items-start gap-2 animate-in fade-in"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">{validation.title}: </span>
                    <span>{validation.message} </span>
                    <span className="text-amber-800 dark:text-amber-300 block text-[11px] mt-0.5">
                      {validation.clinicalExplanation}
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Sum Preview Bar */}
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-400">
        <button
          type="button"
          onClick={onOpenGuide}
          className="text-sky-700 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 font-medium inline-flex items-center gap-1.5 cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Dúvidas de pinçamento? Ver protocolo completo</span>
        </button>

        <div className="flex items-center gap-3 flex-wrap">
          {integritySummary.hasErrors ? (
            <span className="text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1 text-[11px]">
              <AlertOctagon className="w-3.5 h-3.5" />
              Soma suspensa (corrija os valores destacados)
            </span>
          ) : (
            <div className="font-mono text-xs bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200/80 dark:border-slate-700">
              <span>Soma das dobras ativas: </span>
              <strong className="text-slate-900 dark:text-white font-bold text-sm">
                {requiredFolds
                  .reduce((acc, k) => acc + (Number(skinfoldValues[k]) || 0), 0)
                  .toFixed(1)}{' '}
                mm
              </strong>
            </div>
          )}
        </div>
      </div>

      {/* Mini-Modal: 3-trial Average Calculator com Validação em Tempo Real (ISAK TEM) */}
      {trialFold && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl max-w-md w-full p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xl animate-in fade-in zoom-in-95 my-auto">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calculator className="w-4 h-4 text-sky-600 shrink-0" />
                <span>Cálculo de Média (ISAK TEM)</span>
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                {SKINFOLD_DEFINITIONS[trialFold].shortName}
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Dobra: <strong className="text-slate-800 dark:text-slate-200">{SKINFOLD_DEFINITIONS[trialFold].name}</strong>.
              O protocolo ISAK recomenda 2 tomadas não consecutivas e cálculo da média. Se a diferença for &gt; 5%, faça a 3ª tomada.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-3">
              <div>
                <label className="text-xs sm:text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  1ª Medida
                </label>
                <div className="relative">
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.1"
                    min="1"
                    max="80"
                    autoFocus
                    placeholder="0.0"
                    value={trial1}
                    onChange={(e) => setTrial1(e.target.value)}
                    className="w-full min-h-[44px] pl-3 pr-8 py-2 text-base font-mono font-bold border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-sky-500 text-slate-900 dark:text-white bg-white dark:bg-slate-800"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 pointer-events-none">
                    mm
                  </span>
                </div>
              </div>
              <div>
                <label className="text-xs sm:text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  2ª Medida
                </label>
                <div className="relative">
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.1"
                    min="1"
                    max="80"
                    placeholder="0.0"
                    value={trial2}
                    onChange={(e) => setTrial2(e.target.value)}
                    className="w-full min-h-[44px] pl-3 pr-8 py-2 text-base font-mono font-bold border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-sky-500 text-slate-900 dark:text-white bg-white dark:bg-slate-800"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 pointer-events-none">
                    mm
                  </span>
                </div>
              </div>
              <div>
                <label className="text-xs sm:text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  3ª Medida (opc.)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.1"
                    min="1"
                    max="80"
                    placeholder="0.0"
                    value={trial3}
                    onChange={(e) => setTrial3(e.target.value)}
                    className="w-full min-h-[44px] pl-3 pr-8 py-2 text-base font-mono font-bold border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-sky-500 text-slate-900 dark:text-white bg-white dark:bg-slate-800"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 pointer-events-none">
                    mm
                  </span>
                </div>
              </div>
            </div>

            {/* Trial Real-Time Validation Feedback */}
            {trialConsistency.hasErrors && (
              <div className="mb-3 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-300 space-y-1">
                {trialConsistency.errorsList.map((err, i) => (
                  <div key={i} className="flex items-center gap-1.5 font-medium">
                    <AlertOctagon className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>{err}</span>
                  </div>
                ))}
              </div>
            )}

            {trialConsistency.warning && !trialConsistency.hasErrors && (
              <div className="mb-3 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{trialConsistency.warning}</span>
              </div>
            )}

            {trialConsistency.average !== null && !trialConsistency.hasErrors && (
              <div className="mb-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 block text-[11px]">Média Aritmética:</span>
                  <strong className="text-sm font-mono text-slate-900 dark:text-white">
                    {trialConsistency.average} mm
                  </strong>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block text-[11px]">Variação Técnica:</span>
                  <span
                    className={`font-mono font-bold text-xs ${
                      trialConsistency.isConsistent ? 'text-emerald-600' : 'text-amber-600'
                    }`}
                  >
                    Δ {trialConsistency.maxDiffMm} mm ({trialConsistency.maxDiffPercent}%)
                  </span>
                </div>
              </div>
            )}

            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setTrialFold(null)}
                className="min-h-[44px] px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer text-center"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={trialConsistency.hasErrors || trialConsistency.average === null}
                onClick={applyTrialAverage}
                className="min-h-[44px] px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 disabled:opacity-50 rounded-xl shadow-xs transition-colors cursor-pointer text-center"
              >
                Aplicar Média {trialConsistency.average ? `(${trialConsistency.average} mm)` : ''}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
