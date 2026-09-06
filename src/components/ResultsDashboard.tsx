import React from 'react';
import { motion } from 'motion/react';
import {
  Activity,
  Award,
  BarChart3,
  CheckCircle2,
  Cpu,
  Flame,
  Layers,
  Percent,
  PieChart,
  Scale,
  Sparkles,
} from 'lucide-react';
import { CalculationResult, Gender, DensityEquation } from '../types';

interface ResultsDashboardProps {
  results: CalculationResult;
  peso: number;
  sexo: Gender;
  idade: number;
  densityEquation: DensityEquation;
  onEquationChange: (eq: DensityEquation) => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  results,
  peso,
  sexo,
  idade,
  densityEquation,
  onEquationChange,
}) => {
  if (!results.isValid) {
    return (
      <div id="card-resultado-pendente" className="bg-slate-900 text-white rounded-xl p-6 border border-slate-800 text-center">
        <div className="max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-cyan-400">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <h3 className="text-base font-bold">Aguardando Medição das Dobras</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Informe todas as medidas necessárias para calcular o percentual de gordura.
            Faltam medir {results.missingFields.length} dobra(s) no protocolo selecionado.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
            {results.missingFields.map((field) => (
              <span
                key={field}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700"
              >
                {field}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Calculate percentages for donut and bar
  const fatPct = results.percentualGordura;
  const leanPct = Number((100 - fatPct).toFixed(1));

  // SVG Donut calculation
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const fatStrokeDash = (fatPct / 100) * circumference;
  const leanStrokeDash = (leanPct / 100) * circumference;

  return (
    <motion.div
      id="card-resultado-avaliacao"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-4"
    >
      {/* 1. Resultado Principal: % Gordura Corporal e Métricas Chave */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* % Gordura Corporal em Destaque */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="bg-slate-900 text-white p-6 rounded-3xl border border-sky-900/60 relative overflow-hidden shadow-xs md:col-span-2"
        >
          <div className="absolute -top-1 -right-1 p-3 opacity-10">
            <Percent className="w-24 h-24 text-sky-400" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400 font-mono block">
              Resultado: % Gordura Corporal
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Equação: {results.equacaoNome}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-baseline gap-3">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl sm:text-5xl font-extrabold font-mono tracking-tight text-white tabular-nums">
                {results.percentualGordura.toFixed(1)}
              </span>
              <span className="text-2xl font-bold text-sky-300 font-mono">%</span>
            </div>
            <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-sky-950 text-sky-300 border border-sky-800">
              {results.gorduraClassificacao}
            </span>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 font-sans">
            <span>
              Faixa Normativa Saudável: <strong className="text-slate-200 font-mono">{results.faixaReferencia}</strong>
            </span>
            <span>
              Densidade Corporal: <strong className="text-sky-300 font-mono">{results.densidadeCorporal.toFixed(5)} g/cm³</strong>
            </span>
          </div>
        </motion.div>

        {/* Métricas Clínicas Complementares (IMC & TMB) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-3">
          {/* IMC */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.08, ease: 'easeOut' }}
            className="bg-white dark:bg-slate-900 p-4.5 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono">
                Índice IMC
              </span>
              <Scale className="w-4 h-4 text-slate-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white tabular-nums">
                {results.imc.toFixed(2)}
              </span>
              <span className="text-xs font-semibold text-slate-500 font-mono">kg/m²</span>
            </div>
            <span className="mt-2 block text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
              {results.imcClassificacao}
            </span>
          </motion.div>

          {/* Taxa Metabólica Basal (TMB) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.14, ease: 'easeOut' }}
            className="bg-white dark:bg-slate-900 p-4.5 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono">
                Taxa Metabólica Basal
              </span>
              <Flame className="w-4 h-4 text-orange-500" />
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white tabular-nums">
                {Math.round(results.tmb)}
              </span>
              <span className="text-xs font-semibold text-slate-500 font-mono">kcal/dia</span>
            </div>
            <span className="mt-2 block text-[11px] text-slate-500 dark:text-slate-400 truncate" title="Harris-Benedict (Roza & Shizgal, 1984)">
              Harris-Benedict Revisada
            </span>
          </motion.div>
        </div>
      </div>

      {/* 2. Visualização Dedicada: COMPOSIÇÃO CORPORAL (Logo abaixo do resultado do % de gordura) */}
      <motion.div
        id="visualizacao-composicao-corporal"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.18, ease: 'easeOut' }}
        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs p-4 sm:p-6 space-y-4 sm:space-y-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-400 border border-sky-100 dark:border-sky-800 flex items-center justify-center shrink-0 shadow-2xs">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-sans tracking-tight">
                  Composição Corporal
                </h3>
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  Modelo 2C (Bicompartimental)
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">
                Fracionamento do peso corporal total ({peso.toFixed(1)} kg) em Massa Gorda e Massa Livre de Gordura (Massa Magra)
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right shrink-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block">
              Peso de Referência
            </span>
            <span className="text-base font-bold font-mono text-slate-800 dark:text-slate-200">
              {peso.toFixed(1)} kg
            </span>
          </div>
        </div>

        {/* Dois Blocos de Cálculo Lado a Lado: Massa Gorda vs Massa Magra */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card de Cálculo: MASSA GORDA */}
          <div className="bg-amber-50/40 dark:bg-amber-950/20 rounded-2xl border border-amber-200/80 dark:border-amber-900/50 p-4 sm:p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500 ring-4 ring-amber-100 dark:ring-amber-900/40 shrink-0"></span>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300 font-mono">
                    Massa Gorda (MG)
                  </span>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800">
                  {results.percentualGordura.toFixed(1)}% do peso
                </span>
              </div>

              {/* Valor Grande em Quilos */}
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black font-mono text-amber-950 dark:text-amber-200 tabular-nums">
                  {results.massaGordaKg.toFixed(2)}
                </span>
                <span className="text-lg font-bold font-mono text-amber-800 dark:text-amber-300">kg</span>
                <span className="text-xs text-amber-700 dark:text-amber-400 font-mono ml-auto">
                  (~{results.massaGordaKg.toFixed(1)} kg)
                </span>
              </div>

              {/* Memória de Cálculo Explícita */}
              <div className="mt-4 p-3 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-amber-200/70 dark:border-amber-900/50 text-xs font-mono space-y-1">
                <span className="text-[10px] text-amber-800 dark:text-amber-400 font-bold uppercase block tracking-wider">
                  Cálculo da Massa Gorda:
                </span>
                <div className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                  <span className="text-amber-900 dark:text-amber-300 font-bold">MG (kg)</span> = Peso Total × (% Gordura / 100)
                </div>
                <div className="text-amber-950 dark:text-amber-200 font-bold pt-0.5">
                  = {peso.toFixed(1)} kg × ({results.percentualGordura.toFixed(1)} / 100) = <span className="underline decoration-amber-500 underline-offset-2">{results.massaGordaKg.toFixed(2)} kg</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-amber-800/90 dark:text-amber-400/90 leading-relaxed">
              Compreende a gordura de reserva energética subcutânea, visceral e os lipídios essenciais do sistema nervoso e membranas celulares.
            </p>
          </div>

          {/* Card de Cálculo: MASSA LIVRE DE GORDURA (MASSA MAGRA) */}
          <div className="bg-sky-50/40 dark:bg-sky-950/20 rounded-2xl border border-sky-200/80 dark:border-sky-900/50 p-4 sm:p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-sky-600 ring-4 ring-sky-100 dark:ring-sky-900/40 shrink-0"></span>
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-900 dark:text-sky-300 font-mono">
                    Massa Livre de Gordura (Massa Magra - MLG)
                  </span>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-900/60 text-sky-900 dark:text-sky-200 border border-sky-300 dark:border-sky-800">
                  {leanPct.toFixed(1)}% do peso
                </span>
              </div>

              {/* Valor Grande em Quilos */}
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black font-mono text-sky-950 dark:text-sky-200 tabular-nums">
                  {results.massaLivreGorduraKg.toFixed(2)}
                </span>
                <span className="text-lg font-bold font-mono text-sky-800 dark:text-sky-300">kg</span>
                <span className="text-xs text-sky-700 dark:text-sky-400 font-mono ml-auto">
                  (~{results.massaLivreGorduraKg.toFixed(1)} kg)
                </span>
              </div>

              {/* Memória de Cálculo Explícita */}
              <div className="mt-4 p-3 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-sky-200/70 dark:border-sky-900/50 text-xs font-mono space-y-1">
                <span className="text-[10px] text-sky-800 dark:text-sky-400 font-bold uppercase block tracking-wider">
                  Cálculo da Massa Livre de Gordura:
                </span>
                <div className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                  <span className="text-sky-900 dark:text-sky-300 font-bold">MLG (kg)</span> = Peso Total - Massa Gorda
                </div>
                <div className="text-sky-950 dark:text-sky-200 font-bold pt-0.5">
                  = {peso.toFixed(1)} kg - {results.massaGordaKg.toFixed(2)} kg = <span className="underline decoration-sky-500 underline-offset-2">{results.massaLivreGorduraKg.toFixed(2)} kg</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-sky-800/90 dark:text-sky-400/90 leading-relaxed">
              Compreende a massa muscular esquelética, massa óssea, vísceras, proteínas celulares e o compartimento de água corporal total (intracelular e extracelular).
            </p>
          </div>
        </div>

        {/* Balanço e Verificação Matemática da Composição Corporal */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1.5 font-sans">
            <span className="font-bold text-slate-800 dark:text-slate-200">
              Distribuição Proporcional em Quilos e Porcentagem:
            </span>
            <span className="font-mono text-slate-600 dark:text-slate-400 text-[11px]">
              Verificação: <strong className="text-sky-800 dark:text-sky-300">{results.massaLivreGorduraKg.toFixed(1)} kg</strong> (Massa Magra) + <strong className="text-amber-800 dark:text-amber-300">{results.massaGordaKg.toFixed(1)} kg</strong> (Massa Gorda) = <strong className="text-slate-900 dark:text-white">{peso.toFixed(1)} kg</strong> (100%)
            </span>
          </div>

          {/* Barra Visual Segmentada de Composição Corporal */}
          <div className="w-full h-8 bg-slate-200 dark:bg-slate-700 rounded-xl overflow-hidden flex shadow-inner">
            <div
              style={{ width: `${leanPct}%` }}
              className="bg-sky-600 h-full flex items-center justify-center text-white text-xs font-mono font-bold transition-all duration-500"
              title={`Massa Magra: ${results.massaLivreGorduraKg.toFixed(1)} kg (${leanPct.toFixed(1)}%)`}
            >
              {leanPct > 18 ? `Massa Magra: ${results.massaLivreGorduraKg.toFixed(1)} kg (${leanPct.toFixed(1)}%)` : `${results.massaLivreGorduraKg.toFixed(1)} kg`}
            </div>
            <div
              style={{ width: `${fatPct}%` }}
              className="bg-amber-500 h-full flex items-center justify-center text-amber-950 text-xs font-mono font-bold transition-all duration-500"
              title={`Massa Gorda: ${results.massaGordaKg.toFixed(1)} kg (${fatPct.toFixed(1)}%)`}
            >
              {fatPct > 14 ? `Gordura: ${results.massaGordaKg.toFixed(1)} kg (${fatPct.toFixed(1)}%)` : `${results.massaGordaKg.toFixed(1)} kg`}
            </div>
          </div>

          {/* Resumo com Razão Massa Magra / Massa Gorda */}
          <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono pt-1 gap-2">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-600"></span>
                <span>Massa Magra: <strong className="text-slate-700 dark:text-slate-300">{results.massaLivreGorduraKg.toFixed(2)} kg ({leanPct}%)</strong></span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>Massa Gorda: <strong className="text-slate-700 dark:text-slate-300">{results.massaGordaKg.toFixed(2)} kg ({fatPct}%)</strong></span>
              </span>
            </div>
            <span>
              Razão MLG / MG: <strong className="text-slate-800 dark:text-slate-200">{(results.massaLivreGorduraKg / Math.max(results.massaGordaKg, 0.01)).toFixed(2)} : 1</strong>
            </span>
          </div>
        </div>
      </motion.div>

      {/* Seção Bento: Composição Corporal Visual (Donut + Barras Horizontais) */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.22, ease: 'easeOut' }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {/* Gráfico Donut Circular */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col items-center justify-center">
          <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-tight mb-3 font-sans">
            Proporção de Composição
          </span>
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
              {/* Background circle */}
              <circle
                cx="70"
                cy="70"
                r={radius}
                className="stroke-slate-100 dark:stroke-slate-800"
                strokeWidth="14"
                fill="none"
              />
              {/* Lean mass stroke (Sky/Cyan) */}
              <circle
                cx="70"
                cy="70"
                r={radius}
                stroke="#0284c7"
                strokeWidth="14"
                strokeDasharray={`${leanStrokeDash} ${circumference}`}
                strokeDashoffset="0"
                strokeLinecap="round"
                fill="none"
              />
              {/* Fat mass stroke (Amber/Gold) */}
              <circle
                cx="70"
                cy="70"
                r={radius}
                stroke="#f59e0b"
                strokeWidth="14"
                strokeDasharray={`${fatStrokeDash} ${circumference}`}
                strokeDashoffset={`-${leanStrokeDash}`}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                {results.percentualGordura.toFixed(1)}%
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono">Gordura</span>
            </div>
          </div>

          <div className="w-full mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-around text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-600"></span>
              <span className="text-slate-600 dark:text-slate-300">Massa Magra: <strong>{leanPct}%</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="text-slate-600 dark:text-slate-300">Gordura: <strong>{fatPct}%</strong></span>
            </div>
          </div>
        </div>

        {/* Gráfico de Barras Visuais Proporcionais */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-tight font-sans">
                Divisão Fracionada da Massa Corporal (kg)
              </span>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                Peso: <strong className="text-slate-800 dark:text-slate-200">{peso.toFixed(1)} kg</strong>
              </span>
            </div>

            {/* Stacked bar single */}
            <div className="w-full h-8 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden flex shadow-inner mb-4">
              <div
                style={{ width: `${leanPct}%` }}
                className="bg-sky-600 h-full flex items-center justify-center text-white text-xs font-mono font-bold transition-all duration-500"
                title={`Massa Magra: ${results.massaLivreGorduraKg} kg (${leanPct}%)`}
              >
                {leanPct > 15 && `${results.massaLivreGorduraKg} kg`}
              </div>
              <div
                style={{ width: `${fatPct}%` }}
                className="bg-amber-500 h-full flex items-center justify-center text-slate-950 text-xs font-mono font-bold transition-all duration-500"
                title={`Massa Gorda: ${results.massaGordaKg} kg (${fatPct}%)`}
              >
                {fatPct > 12 && `${results.massaGordaKg} kg`}
              </div>
            </div>

            {/* Barras individuais horizontais */}
            <div className="space-y-2.5 text-xs">
              {/* PESO TOTAL */}
              <div>
                <div className="flex justify-between text-slate-700 dark:text-slate-300 mb-1">
                  <span className="font-semibold">PESO TOTAL</span>
                  <span className="font-mono font-bold">{peso.toFixed(1)} kg (100%)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="w-full h-full bg-slate-800 dark:bg-slate-200 rounded-full"></div>
                </div>
              </div>

              {/* MASSA LIVRE DE GORDURA */}
              <div>
                <div className="flex justify-between text-slate-700 dark:text-slate-300 mb-1">
                  <span className="font-semibold text-sky-800 dark:text-sky-300">MASSA LIVRE DE GORDURA (MAGRA)</span>
                  <span className="font-mono font-bold text-sky-800 dark:text-sky-300">
                    {results.massaLivreGorduraKg.toFixed(1)} kg ({leanPct}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${leanPct}%` }}
                    className="h-full bg-sky-600 rounded-full transition-all duration-500"
                  ></div>
                </div>
              </div>

              {/* MASSA GORDA */}
              <div>
                <div className="flex justify-between text-slate-700 dark:text-slate-300 mb-1">
                  <span className="font-semibold text-amber-800 dark:text-amber-300">MASSA GORDA</span>
                  <span className="font-mono font-bold text-amber-800 dark:text-amber-300">
                    {results.massaGordaKg.toFixed(1)} kg ({fatPct}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${fatPct}%` }}
                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono gap-2">
            <span>Soma das Dobras: <strong className="text-slate-800 dark:text-slate-200">{results.somaDobras.toFixed(1)} mm</strong></span>
            <span>Densidade Corporal: <strong className="text-slate-800 dark:text-slate-200">{results.densidadeCorporal.toFixed(5)} g/cm³</strong></span>
          </div>
        </div>
      </motion.div>

      {/* Bento Sub-Tile: Memória de Cálculo / Fórmulas Transparentes */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.28, ease: 'easeOut' }}
        className="p-4 sm:p-6 rounded-3xl bg-slate-900 text-slate-200 border border-slate-800 shadow-xs"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <Cpu className="w-4 h-4 text-sky-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
              Memória de Cálculo e Equações Aplicadas
            </h4>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-slate-400 text-[11px] font-medium font-sans">Equação:</span>
            <div className="inline-flex rounded-full shadow-inner border border-slate-700/80 bg-slate-950 p-1">
              <button
                type="button"
                onClick={() => onEquationChange('siri')}
                className={`min-h-[40px] px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer active:scale-95 ${
                  densityEquation === 'siri'
                    ? 'bg-sky-500 text-white shadow-2xs font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
                title="Equação de Siri (1961)"
              >
                Siri
              </button>
              <button
                type="button"
                onClick={() => onEquationChange('brozek')}
                className={`min-h-[40px] px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer active:scale-95 ${
                  densityEquation === 'brozek'
                    ? 'bg-sky-500 text-white shadow-2xs font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
                title="Equação de Brozek (1963)"
              >
                Brozek
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800/80">
            <span className="text-[10px] text-sky-400 block mb-1">
              1. Densidade Corporal ({results.equacaoNome})
            </span>
            <p className="text-slate-300 break-words leading-relaxed">
              {results.equacaoFormula}
            </p>
            <div className="mt-2 text-sky-300 font-bold">
              DC = {results.densidadeCorporal.toFixed(5)} g/cm³
            </div>
          </div>

          <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800/80">
            <span className="text-[10px] text-sky-400 block mb-1">
              2. Conversão para Percentual de Gordura
            </span>
            <p className="text-slate-300 break-words leading-relaxed">
              {results.conversaoFormula}
            </p>
            <div className="mt-2 text-sky-300 font-bold">
              %G = {results.percentualGordura.toFixed(1)}% | MG = {results.massaGordaKg.toFixed(1)} kg | MLG = {results.massaLivreGorduraKg.toFixed(1)} kg
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
