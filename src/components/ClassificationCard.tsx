import React from 'react';
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
    <div id="card-classificacao-gordura" className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 transition-all">
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-100 shadow-2xs">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-slate-900 uppercase font-sans">
              Classificação do Percentual de Gordura
            </h2>
            <span className="text-xs text-slate-500">
              Estratificado por Sexo ({sexo === 'masculino' ? 'Masculino' : 'Feminino'}) e Faixa Etária ({idade} anos) - Pollock & Wilmore / ACSM
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        {/* Percentual Atual */}
        <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80">
          <span className="text-[11px] font-semibold text-slate-500 uppercase block font-mono">
            Percentual Atual
          </span>
          <div className="flex items-baseline gap-1 mt-1.5">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {results.percentualGordura.toFixed(1)}
            </span>
            <span className="text-sm font-bold text-slate-600 font-mono">%</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Aferido via Adipômetro</span>
        </div>

        {/* Faixa de Referência */}
        <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80">
          <span className="text-[11px] font-semibold text-slate-500 uppercase block font-mono">
            Faixa Ideal Recomendada
          </span>
          <div className="flex items-baseline gap-1 mt-1.5">
            <span className="text-2xl font-bold font-mono text-sky-800 tabular-nums">
              {results.faixaReferencia}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Saúde cardiovascular e metabólica</span>
        </div>

        {/* Diagnóstico Clínico */}
        <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80">
          <span className="text-[11px] font-semibold text-slate-500 uppercase block font-mono">
            Diagnóstico Antropométrico
          </span>
          <div className="mt-1.5">
            <span className="text-base font-bold text-slate-900 block">
              {results.gorduraClassificacao}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Tabela Clínica de Referência</span>
        </div>
      </div>

      {/* Visual Reference Gauge */}
      <div className="space-y-2 pt-1">
        <span className="text-[11px] font-semibold text-slate-600 block">
          Posição na Escala Normativa ({sexo === 'masculino' ? 'Homens' : 'Mulheres'}, {idade} anos):
        </span>
        <div className="grid grid-cols-7 gap-1.5">
          {levels.map((lvl) => (
            <div key={lvl.label} className="text-center">
              <div className={`h-2.5 rounded-full ${lvl.color} opacity-85 mb-1.5`}></div>
              <span className="text-[10px] font-bold text-slate-700 block truncate">
                {lvl.label}
              </span>
              <span className="text-[9px] font-mono text-slate-400 block">
                {lvl.range}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
