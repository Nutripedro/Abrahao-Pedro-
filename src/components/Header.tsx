import React from 'react';
import {
  FileText,
  PlusCircle,
  Save,
  HelpCircle,
  RotateCcw,
  History,
  Activity,
  CheckCircle2,
  Bluetooth,
} from 'lucide-react';
import { PatientInfo } from '../types';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  patient: PatientInfo;
  onNewEvaluation: () => void;
  onSaveEvaluation: () => void;
  onOpenReport: () => void;
  onOpenGuide: () => void;
  onOpenHistory: () => void;
  onResetForm: () => void;
  onOpenAutoFill?: () => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  patient,
  onNewEvaluation,
  onSaveEvaluation,
  onOpenReport,
  onOpenGuide,
  onOpenHistory,
  onResetForm,
  onOpenAutoFill,
  savedCount,
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800/80 sticky top-0 z-30 shadow-sm backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar with title and Bento-styled actions */}
        <div className="py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sky-600 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-sm">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white font-serif">
                  Calculadora de Gordura por Dobras
                </h1>
                <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-950/80 text-sky-300 border border-sky-800/60">
                  Antropometria Clínica
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Determine o percentual de gordura corporal através de protocolos antropométricos validados.
              </p>
            </div>
          </div>

          {/* Action buttons styled with Bento rounded pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              id="btn-como-medir"
              type="button"
              onClick={onOpenGuide}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-full text-slate-200 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 transition-colors cursor-pointer"
              title="Guia prático de localização anatômica e técnica do adipômetro"
            >
              <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
              <span>Como medir?</span>
            </button>

            <button
              id="btn-historico-avaliacoes"
              type="button"
              onClick={onOpenHistory}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-full text-slate-200 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 transition-colors cursor-pointer"
              title="Ver histórico de avaliações salvas"
            >
              <History className="w-3.5 h-3.5 text-slate-300" />
              <span>Histórico ({savedCount})</span>
            </button>

            {onOpenAutoFill && (
              <button
                id="btn-preenchimento-automatico"
                type="button"
                onClick={onOpenAutoFill}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-full text-white bg-slate-800 hover:bg-slate-700/90 border border-sky-500/50 shadow-2xs hover:border-sky-400 transition-all cursor-pointer"
                title="Importar dados de balança bioimpedância via Bluetooth ou arquivo de texto"
              >
                <Bluetooth className="w-3.5 h-3.5 text-sky-400" />
                <span>Preenchimento Automático</span>
              </button>
            )}

            <button
              id="btn-limpar-avaliacao"
              type="button"
              onClick={onResetForm}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full text-slate-400 hover:text-white hover:bg-slate-800/80 border border-transparent hover:border-slate-700 transition-colors cursor-pointer"
              title="Redefinir campos"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Limpar</span>
            </button>

            <button
              id="btn-nova-avaliacao"
              type="button"
              onClick={onNewEvaluation}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-full text-slate-100 bg-slate-800 hover:bg-slate-700 border border-slate-700 shadow-xs transition-all cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 text-sky-400" />
              <span>Nova Avaliação</span>
            </button>

            <button
              id="btn-salvar-avaliacao"
              type="button"
              onClick={onSaveEvaluation}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-full text-white bg-sky-700 hover:bg-sky-600 border border-sky-600 shadow-xs transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Salvar</span>
            </button>

            <button
              id="btn-gerar-relatorio-pdf"
              type="button"
              onClick={onOpenReport}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-full text-slate-900 bg-sky-400 hover:bg-sky-300 shadow-xs transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              title="Gerar e imprimir laudo antropométrico em PDF"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Gerar Relatório PDF</span>
            </button>

            <ThemeToggle size="sm" />
          </div>
        </div>

        {/* Clinical Info Bento Pill Bar */}
        <div className="py-2 px-4 bg-slate-950/70 rounded-2xl mb-3 border border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-300 gap-y-2">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Paciente:</span>
              <strong className="text-white font-medium">
                {patient.nome || 'Não cadastrado'}
              </strong>
            </div>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Data da avaliação:</span>
              <strong className="text-white font-medium">
                {patient.dataAvaliacao
                  ? new Date(patient.dataAvaliacao + 'T00:00:00').toLocaleDateString('pt-BR')
                  : new Date().toLocaleDateString('pt-BR')}
              </strong>
            </div>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Avaliador:</span>
              <strong className="text-white font-medium">
                {patient.avaliador || 'Nutricionista Responsável'}
              </strong>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sky-400 text-[11px] font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Jackson-Pollock & Durnin-Womersley</span>
          </div>
        </div>
      </div>
    </header>
  );
};
