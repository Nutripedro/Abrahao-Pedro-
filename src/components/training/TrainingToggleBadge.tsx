import React from 'react';
import { GraduationCap, Shield, FlaskConical, Check } from 'lucide-react';
import { useTrainingMode } from '../../contexts/TrainingModeContext';

export const TrainingToggleBadge: React.FC = () => {
  const { isTrainingMode, toggleTrainingMode } = useTrainingMode();

  return (
    <button
      type="button"
      onClick={toggleTrainingMode}
      title={
        isTrainingMode
          ? 'Modo de Treinamento ATIVO com dados sintéticos (Clique para desativar)'
          : 'Ativar Modo de Treinamento (Oculta dados sensíveis e carrega pacientes fictícios para aprendizado)'
      }
      className={`relative inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
        isTrainingMode
          ? 'bg-amber-500/10 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700/60 shadow-xs ring-2 ring-amber-500/20'
          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200/70 dark:hover:bg-slate-700'
      }`}
    >
      <FlaskConical
        className={`w-3.5 h-3.5 transition-transform ${
          isTrainingMode ? 'text-amber-600 dark:text-amber-400 scale-110' : 'text-slate-400'
        }`}
      />
      <span className="hidden sm:inline">
        {isTrainingMode ? 'Modo Treinamento' : 'Treinamento'}
      </span>
      {isTrainingMode && (
        <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-amber-500 animate-ping" />
      )}
    </button>
  );
};
