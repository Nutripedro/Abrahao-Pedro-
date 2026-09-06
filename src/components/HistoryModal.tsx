import React from 'react';
import { X, Calendar, User, Trash2, Copy, Eye, FileDown, Check, Clock } from 'lucide-react';
import { EvaluationRecord } from '../types';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  evaluations: EvaluationRecord[];
  onLoadEvaluation: (ev: EvaluationRecord) => void;
  onDuplicateEvaluation: (ev: EvaluationRecord) => void;
  onDeleteEvaluation: (id: string) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  evaluations,
  onLoadEvaluation,
  onDuplicateEvaluation,
  onDeleteEvaluation,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-800 text-sky-400 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight text-white font-sans">
                Histórico de Avaliações Registradas
              </h3>
              <p className="text-xs text-slate-400">
                {evaluations.length} tomadas salvas no banco de dados local da consulta
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer active:scale-95"
            aria-label="Fechar histórico"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of saved evaluations */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3 flex-1">
          {evaluations.length === 0 ? (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400 text-xs">
              Nenhuma avaliação salva ainda. Preencha os campos e clique em &quot;Salvar Avaliação&quot;.
            </div>
          ) : (
            evaluations.map((ev, idx) => (
              <div
                key={ev.id}
                className="p-4 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 hover:border-sky-500 dark:hover:border-sky-400 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-900 dark:bg-sky-600 text-white text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <strong className="text-sm font-bold text-slate-900 dark:text-white font-sans">
                      {ev.titulo || `Avaliação ${idx + 1}`}
                    </strong>
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950/70 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800 font-semibold">
                      {ev.protocol.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-300 font-mono">
                    <span>Data: {ev.patient.dataAvaliacao || 'Sem data'}</span>
                    <span>•</span>
                    <span>Peso: {ev.patient.peso.toFixed(1)} kg</span>
                    <span>•</span>
                    <span>
                      %G: <strong className="text-sky-800 dark:text-sky-400">{ev.results.percentualGordura.toFixed(1)}%</strong>
                    </span>
                    <span>•</span>
                    <span>Soma: {ev.results.somaDobras.toFixed(1)} mm</span>
                  </div>

                  {ev.patient.observacoes && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 italic">
                      Obs: {ev.patient.observacoes}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      onLoadEvaluation(ev);
                      onClose();
                    }}
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 min-h-[44px] text-xs font-semibold text-white bg-slate-900 dark:bg-sky-600 hover:bg-slate-800 dark:hover:bg-sky-500 rounded-xl transition-colors cursor-pointer active:scale-95"
                    title="Carregar esta avaliação no painel ativo"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Carregar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onDuplicateEvaluation(ev)}
                    className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer active:scale-95"
                    title="Duplicar para criar nova tomada baseada nesta"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteEvaluation(ev.id)}
                    className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer active:scale-95"
                    title="Excluir avaliação"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200/90 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 min-h-[44px] text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl cursor-pointer transition-colors active:scale-95"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
