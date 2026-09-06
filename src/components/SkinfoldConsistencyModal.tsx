import React from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  HelpCircle,
  FileText,
  RotateCcw,
  Check,
  ShieldCheck,
  Stethoscope,
  Info,
  Scale
} from 'lucide-react';
import { ConsistencyAnalysisResult, ConsistencyIssue, SkinfoldKey } from '../types';

interface SkinfoldConsistencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: ConsistencyAnalysisResult | null;
  isLoading: boolean;
  patientName: string;
  onSelectFoldToCorrect?: (foldKey: SkinfoldKey) => void;
  onAppendToNotes?: (noteText: string) => void;
  onReanalyze?: () => void;
}

export const SkinfoldConsistencyModal: React.FC<SkinfoldConsistencyModalProps> = ({
  isOpen,
  onClose,
  result,
  isLoading,
  patientName,
  onSelectFoldToCorrect,
  onAppendToNotes,
  onReanalyze,
}) => {
  const [copiedNote, setCopiedNote] = React.useState(false);

  if (!isOpen) return null;

  const getStatusBadge = (status: 'consistente' | 'atencao' | 'inconsistente') => {
    switch (status) {
      case 'consistente':
        return {
          icon: <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
          title: 'Coerência Anatômica Confirmada',
          badgeText: 'Padrão Consistente',
          bgClass: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300',
          barColor: 'bg-emerald-500',
        };
      case 'atencao':
        return {
          icon: <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
          title: 'Atenção a Assimetrias Regionais',
          badgeText: 'Atenção Recomendada',
          bgClass: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300',
          barColor: 'bg-amber-500',
        };
      case 'inconsistente':
      default:
        return {
          icon: <AlertOctagon className="w-5 h-5 text-rose-600 dark:text-rose-400" />,
          title: 'Inconsistência Clínica Detectada',
          badgeText: 'Conferência Necessária',
          bgClass: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-300',
          barColor: 'bg-rose-500',
        };
    }
  };

  const getSeverityBadge = (sev: 'alta' | 'moderada' | 'leve') => {
    switch (sev) {
      case 'alta':
        return {
          label: 'Alta Prioridade',
          class: 'bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800',
        };
      case 'moderada':
        return {
          label: 'Moderada',
          class: 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800',
        };
      case 'leve':
      default:
        return {
          label: 'Discrepância Leve',
          class: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
        };
    }
  };

  const handleApplyToObservations = () => {
    if (!result || !onAppendToNotes) return;
    
    let note = `[Auditoria IA de Dobras Cutâneas - ${new Date().toLocaleDateString('pt-BR')}]: `;
    note += `Status: ${result.headline} (Score: ${result.overallScore}/100).\n`;
    note += `${result.summary}\n`;
    
    if (result.issues.length > 0) {
      note += `\nPontos de Atenção:\n`;
      result.issues.forEach((iss, idx) => {
        note += `${idx + 1}. ${iss.title} (${iss.skinfoldName}): ${iss.description}. Conduta: ${iss.suggestedAction}\n`;
      });
    }

    onAppendToNotes(note);
    setCopiedNote(true);
    setTimeout(() => setCopiedNote(false), 3000);
  };

  const statusConfig = result ? getStatusBadge(result.status) : null;

  return (
    <div
      id="modal-auditoria-consistencia"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="titulo-auditoria-consistencia"
    >
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 dark:bg-amber-400/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center shadow-2xs">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  id="titulo-auditoria-consistencia"
                  className="text-base font-bold text-slate-900 dark:text-white font-sans"
                >
                  Auditoria de Consistência Clínica de Dobras
                </h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                  <Sparkles className="w-2.5 h-2.5" />
                  IA Especialista ISAK
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Análise de proporções anatômicas e detecção de prováveis erros de pinçamento ou digitação
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer active:scale-95 shrink-0"
            aria-label="Fechar auditoria"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-12 h-12 rounded-full border-3 border-amber-200 dark:border-amber-900 border-t-amber-600 dark:border-t-amber-400 animate-spin" />
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Analisando proporções anatômicas com IA...
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1">
                  Cruzando relações entre tríceps/subescapular, bíceps, abdômen e plausibilidade biológica para {patientName}.
                </p>
              </div>
            </div>
          ) : !result ? (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400">
              <Info className="w-8 h-8 mx-auto mb-2 text-slate-400" />
              <p className="text-sm font-medium">Nenhum resultado de auditoria disponível.</p>
              <p className="text-xs mt-1">Clique em "Auditar Consistência" para analisar as medidas inseridas.</p>
            </div>
          ) : (
            <>
              {/* Score & Status Banner */}
              <div className={`p-4 rounded-2xl border ${statusConfig?.bgClass} transition-all`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{statusConfig?.icon}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/70 dark:bg-slate-900/70 shadow-2xs">
                          {statusConfig?.badgeText}
                        </span>
                        <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                          {new Date(result.analyzedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                        {result.headline}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                        {result.summary}
                      </p>
                    </div>
                  </div>

                  {/* Coherence Score Gauge */}
                  <div className="sm:text-right flex-shrink-0 bg-white/80 dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800 shadow-2xs">
                    <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">
                      Índice de Coerência
                    </span>
                    <div className="flex items-baseline justify-end gap-1 mt-0.5">
                      <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                        {result.overallScore}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">/100</span>
                    </div>
                    <div className="w-24 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mt-1.5">
                      <div
                        className={`h-full ${statusConfig?.barColor} rounded-full transition-all`}
                        style={{ width: `${result.overallScore}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Anatomic Ratios Pills (se calculadas) */}
              {result.anatomicRatios && (
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-3.5">
                  <div className="flex items-center gap-2 mb-2.5">
                    <Scale className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono">
                      Relações Antropométricas Calculadas
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {result.anatomicRatios.tricepsSubescapularRatio !== undefined && (
                      <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">
                          Tríceps / Subescapular
                        </span>
                        <div className="flex items-baseline justify-between mt-1">
                          <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                            {result.anatomicRatios.tricepsSubescapularRatio.toFixed(2)}x
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            Esp: 0.7 - 1.5x
                          </span>
                        </div>
                      </div>
                    )}

                    {result.anatomicRatios.bicepsTricepsRatio !== undefined && (
                      <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">
                          Bíceps / Tríceps
                        </span>
                        <div className="flex items-baseline justify-between mt-1">
                          <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                            {result.anatomicRatios.bicepsTricepsRatio.toFixed(2)}x
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            Esp: 0.3 - 0.7x
                          </span>
                        </div>
                      </div>
                    )}

                    {result.anatomicRatios.abdomenSuprailiacaRatio !== undefined && (
                      <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">
                          Abdômen / Supra-ilíaca
                        </span>
                        <div className="flex items-baseline justify-between mt-1">
                          <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                            {result.anatomicRatios.abdomenSuprailiacaRatio.toFixed(2)}x
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            Esp: 0.8 - 2.2x
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Detected Issues / Alerts Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <span>Inconsistências & Pontos de Conferência</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {result.issues.length} {result.issues.length === 1 ? 'alerta' : 'alertas'}
                    </span>
                  </h4>
                </div>

                {result.issues.length === 0 ? (
                  <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    <div>
                      <p className="font-bold">Nenhuma inconsistência evidente detectada.</p>
                      <p className="text-[11px] text-emerald-700/90 dark:text-emerald-400 mt-0.5">
                        Todas as dobras obedecem à anatomia clínica esperada para o perfil do paciente.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {result.issues.map((issue, idx) => {
                      const sev = getSeverityBadge(issue.severity);
                      return (
                        <div
                          key={idx}
                          className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs space-y-3 hover:border-amber-300 dark:hover:border-amber-800 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-md border ${sev.class}`}>
                                  {sev.label}
                                </span>
                                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                                  {issue.skinfoldName}
                                </span>
                              </div>
                              <h5 className="text-sm font-bold text-slate-900 dark:text-white">
                                {issue.title}
                              </h5>
                            </div>

                            {issue.skinfoldKey && onSelectFoldToCorrect && (
                              <button
                                type="button"
                                onClick={() => {
                                  onSelectFoldToCorrect(issue.skinfoldKey as SkinfoldKey);
                                  onClose();
                                }}
                                className="text-xs px-3 py-2 min-h-[44px] text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900 rounded-xl border border-sky-200 dark:border-sky-800 font-medium transition-colors flex-shrink-0 cursor-pointer active:scale-95 flex items-center justify-center"
                                title="Ver dica rápida e ajustar dobra"
                              >
                                Conferir Dobra
                              </button>
                            )}
                          </div>

                          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                            {issue.description}
                          </p>

                          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1.5 text-xs border border-slate-100 dark:border-slate-800">
                            <p className="text-slate-600 dark:text-slate-300">
                              <strong className="text-slate-900 dark:text-white font-semibold">Fundamento Clínico: </strong>
                              {issue.clinicalReason}
                            </p>
                            <p className="text-amber-800 dark:text-amber-300 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                              <strong className="font-semibold">Conduta Sugerida: </strong>
                              {issue.suggestedAction}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Recommendations Box */}
              {result.recommendations && result.recommendations.length > 0 && (
                <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 space-y-2">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono block">
                    Recomendações Práticas do Especialista:
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                    {result.recommendations.map((rec, rIdx) => (
                      <li key={rIdx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="px-5 sm:px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            {onAppendToNotes && result && (
              <button
                type="button"
                onClick={handleApplyToObservations}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors shadow-2xs cursor-pointer active:scale-95"
                title="Salvar resultado da auditoria nas anotações do prontuário"
              >
                {copiedNote ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400">Inserido nas Notas!</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                    <span>Inserir Parecer no Prontuário</span>
                  </>
                )}
              </button>
            )}

            {onReanalyze && (
              <button
                type="button"
                onClick={onReanalyze}
                disabled={isLoading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 min-h-[44px] rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50 active:scale-95"
                title="Executar nova auditoria"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reavaliar</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 min-h-[44px] rounded-xl text-xs font-bold bg-slate-900 dark:bg-sky-600 text-white hover:bg-slate-800 dark:hover:bg-sky-500 transition-colors shadow-xs cursor-pointer active:scale-95 flex items-center justify-center"
          >
            Concluir Auditoria
          </button>
        </div>

      </div>
    </div>
  );
};
