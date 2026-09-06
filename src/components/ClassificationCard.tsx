import React from 'react';
import { motion } from 'motion/react';
import { Award, ShieldCheck, AlertTriangle, TrendingUp } from 'lucide-react';
import { CalculationResult, Gender } from '../types';

interface ClassificationCardProps {
  results: CalculationResult;
  sexo: Gender;
  idade: number;
}

export const ClassificationCard: React.FC<ClassificationCardProps> = ({
  results,
  sexo,
  idade,
}) => {
  if (!results.isValid) return null;

  const pct = results.percentualGordura;

  // Scale levels for visual gauge
  const levels =
    sexo === 'masculino'
      ? [
          { label: 'Atleta', range: '< 6%', max: 6, color: 'bg-cyan-500' },
          { label: 'Excelente', range: '6 - 10%', max: 10, color: 'bg-emerald-500' },
          { label: 'Bom', range: '11 - 14%', max: 14, color: 'bg-teal-500' },
          { label: 'Médio', range: '15 - 17%', max: 17, color: 'bg-blue-500' },
          { label: 'Acima', range: '18 - 20%', max: 20, color: 'bg-amber-500' },
          { label: 'Elevado', range: '21 - 25%', max: 25, color: 'bg-orange-500' },
          { label: 'Muito Elev.', range: '> 25%', max: 35, color: 'bg-rose-500' },
        ]
      : [
          { label: 'Atleta', range: '< 14%', max: 14, color: 'bg-cyan-500' },
          { label: 'Excelente', range: '14 - 17%', max: 17, color: 'bg-emerald-500' },
          { label: 'Bom', range: '18 - 21%', max: 21, color: 'bg-teal-500' },
          { label: 'Médio', range: '22 - 24%', max: 24, color: 'bg-blue-500' },
          { label: 'Acima', range: '25 - 27%', max: 27, color: 'bg-amber-500' },
          { label: 'Elevado', range: '28 - 32%', max: 32, color: 'bg-orange-500' },
          { label: 'Muito Elev.', range: '> 32%', max: 42, color: 'bg-rose-500' },
        ];

  return (
    <motion.div
      id="card-classificacao-gordura"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs p-4 sm:p-6 transition-all"
    >
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-400 flex items-center justify-center border border-sky-100 dark:border-sky-900 shadow-2xs shrink-0">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white uppercase font-sans">
              Classificação do Percentual de Gordura
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Estratificado por Sexo ({sexo === 'masculino' ? 'Masculino' : 'Feminino'}) e Faixa Etária ({idade} anos) - Pollock & Wilmore / ACSM
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        {/* Percentual Atual */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="p-4 bg-slate-50/80 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700"
        >
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase block font-mono">
            Percentual Atual
          </span>
          <div className="flex items-baseline gap-1 mt-1.5">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
              {results.percentualGordura.toFixed(1)}
            </span>
            <span className="text-sm font-bold text-slate-600 dark:text-slate-300 font-mono">%</span>
          </div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">Aferido via Adipômetro</span>
        </motion.div>

        {/* Faixa de Referência */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="p-4 bg-slate-50/80 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700"
        >
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase block font-mono">
            Faixa Ideal Recomendada
          </span>
          <div className="flex items-baseline gap-1 mt-1.5">
            <span className="text-2xl font-bold font-mono text-sky-800 dark:text-sky-300 tabular-nums">
              {results.faixaReferencia}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">Saúde cardiovascular e metabólica</span>
        </motion.div>

        {/* Diagnóstico Clínico */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="p-4 bg-slate-50/80 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700"
        >
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase block font-mono">
            Diagnóstico Antropométrico
          </span>
          <div className="mt-1.5">
            <span className="text-base font-bold text-slate-900 dark:text-white block">
              {results.gorduraClassificacao}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">Tabela Clínica de Referência</span>
        </motion.div>
      </div>

      {/* Visual Reference Gauge */}
      <div className="space-y-2 pt-1">
        <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block">
          Posição na Escala Normativa ({sexo === 'masculino' ? 'Homens' : 'Mulheres'}, {idade} anos):
        </span>
        <div className="overflow-x-auto no-scrollbar pb-1">
          <div className="grid grid-cols-7 gap-1.5 min-w-[420px] sm:min-w-0">
            {levels.map((lvl) => (
              <div key={lvl.label} className="text-center">
                <div className={`h-2.5 rounded-full ${lvl.color} opacity-85 mb-1.5`}></div>
                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 block truncate">
                  {lvl.label}
                </span>
                <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500 block">
                  {lvl.range}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
