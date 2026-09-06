import React, { useState, useMemo, useEffect } from 'react';
import {
  Target,
  ArrowDown,
  ArrowUp,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Copy,
  Check,
  Calendar,
  Scale,
  ShieldAlert,
  Sliders,
  TrendingDown,
  Info,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { CalculationResult, Gender, GoalSimulationResult } from '../types';
import { calculateGoalSimulation } from '../utils/anthropometry';

interface GoalProjectionCardProps {
  results: CalculationResult;
  pesoAtual: number;
  alturaCm?: number;
  sexo?: Gender;
  idade?: number;
  onApplyToNotes?: (summaryText: string) => void;
}

export const GoalProjectionCard: React.FC<GoalProjectionCardProps> = ({
  results,
  pesoAtual,
  alturaCm = 175,
  sexo = 'masculino',
  idade = 30,
  onApplyToNotes,
}) => {
  if (!results.isValid) return null;

  const gender: Gender = sexo === 'feminino' ? 'feminino' : 'masculino';

  // Extrair faixas normativas para sugestão inicial inteligente
  const matches = results.faixaReferencia.match(/(\d+(?:\.\d+)?)%.*?(\d+(?:\.\d+)?)%/);
  const minNormativo = matches ? parseFloat(matches[1]) : (gender === 'masculino' ? 10 : 18);
  const maxNormativo = matches ? parseFloat(matches[2]) : (gender === 'masculino' ? 18 : 25);
  const mediaNormativa = Number(((minNormativo + maxNormativo) / 2).toFixed(1));

  // Meta padrão inicial: se acima do máximo, sugerir maxNormativo; se abaixo, minNormativo; se dentro, a própria gordura atual
  const initialTarget = useMemo(() => {
    const current = results.percentualGordura;
    if (current > maxNormativo) return maxNormativo;
    if (current < minNormativo) return minNormativo;
    return Number(current.toFixed(1));
  }, [results.percentualGordura, minNormativo, maxNormativo]);

  // Estado do objetivo de % de gordura inserido pelo nutricionista
  const [targetFatInput, setTargetFatInput] = useState<number>(initialTarget);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Atualizar quando o paciente/avaliação mudar
  useEffect(() => {
    setTargetFatInput(initialTarget);
  }, [initialTarget]);

  // Cálculo da simulação de metas com premissa de manutenção de massa magra
  const simulation: GoalSimulationResult = useMemo(() => {
    return calculateGoalSimulation({
      pesoAtualKg: pesoAtual,
      percentualGorduraAtual: results.percentualGordura,
      percentualGorduraAlvo: targetFatInput,
      massaLivreGorduraAtualKg: results.massaLivreGorduraKg,
      alturaCm,
      sexo: gender,
      idade,
    });
  }, [pesoAtual, results.percentualGordura, targetFatInput, results.massaLivreGorduraKg, alturaCm, gender, idade]);

  const handleApplyPreset = (val: number) => {
    setTargetFatInput(Number(val.toFixed(1)));
  };

  const handleStepChange = (delta: number) => {
    setTargetFatInput((prev) => {
      const next = Number((prev + delta).toFixed(1));
      return Math.min(Math.max(next, 3.0), 60.0);
    });
  };

  const handleCopySummary = () => {
    const isPerda = simulation.tipoMeta === 'perda_gordura';
    const isGanho = simulation.tipoMeta === 'ganho_gordura';
    
    let conduta = '';
    if (isPerda) {
      conduta = `Meta de Composição Corporal (Simulador Clínico):\n` +
        `• % Gordura Atual: ${simulation.percentualGorduraAtual.toFixed(1)}% → Meta: ${simulation.percentualGorduraAlvo.toFixed(1)}%\n` +
        `• Gordura a Perder: ${Math.abs(simulation.gorduraDiferencaKg).toFixed(1)} kg de tecido adiposo\n` +
        `• Massa Magra: ${simulation.massaLivreGorduraPreservadaKg.toFixed(1)} kg (100% preservada)\n` +
        `• Peso Alvo Projetado: ${simulation.pesoAlvoKg.toFixed(1)} kg (redução total de ${Math.abs(simulation.pesoDiferencaKg).toFixed(1)} kg)\n` +
        `• Prazo Estimado (0,5 kg/semana): ~${simulation.semanasEstimadasSustentavel} semanas (~${simulation.mesesEstimadosSustentavel} meses)`;
    } else if (isGanho) {
      conduta = `Meta de Composição Corporal (Simulador Clínico):\n` +
        `• % Gordura Atual: ${simulation.percentualGorduraAtual.toFixed(1)}% → Meta: ${simulation.percentualGorduraAlvo.toFixed(1)}%\n` +
        `• Gordura a Recuperar: ${Math.abs(simulation.gorduraDiferencaKg).toFixed(1)} kg\n` +
        `• Massa Magra: ${simulation.massaLivreGorduraPreservadaKg.toFixed(1)} kg (mantida)\n` +
        `• Peso Alvo Projetado: ${simulation.pesoAlvoKg.toFixed(1)} kg`;
    } else {
      conduta = `Meta de Composição Corporal (Simulador Clínico):\n` +
        `• Conduta: Manutenção da composição corporal atual (${simulation.percentualGorduraAtual.toFixed(1)}% de gordura, ${simulation.massaLivreGorduraPreservadaKg.toFixed(1)} kg de massa magra).`;
    }

    if (onApplyToNotes) {
      onApplyToNotes(conduta);
    } else {
      navigator.clipboard.writeText(conduta);
    }

    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  const isPerda = simulation.tipoMeta === 'perda_gordura';
  const isGanho = simulation.tipoMeta === 'ganho_gordura';
  const isManutencao = simulation.tipoMeta === 'manutencao';

  return (
    <div id="simulador-metas" className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-7 space-y-6">
      {/* Cabeçalho do Módulo Clínico */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200/70 shadow-2xs shrink-0 mt-0.5">
            <Target className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm font-bold tracking-tight text-slate-900 uppercase font-sans">
                Simulador de Metas de Composição Corporal
              </h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                Modelo Heymsfield & ACSM
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Projeção de peso alvo e redução lipídica assumindo manutenção de 100% da massa livre de gordura ({simulation.massaLivreGorduraPreservadaKg.toFixed(1)} kg).
            </p>
          </div>
        </div>

        {/* Botão de Conduta / Transferência para Prontuário */}
        <button
          type="button"
          onClick={handleCopySummary}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200/90 shadow-2xs transition-all cursor-pointer shrink-0 self-start sm:self-auto"
          title="Transfere a síntese do cálculo da meta para as observações da consulta"
        >
          {isCopied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700 font-bold">Inserido nas Observações!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span>Inserir na Conduta Clínica</span>
            </>
          )}
        </button>
      </div>

      {/* Painel Interativo de Entrada do % Alvo */}
      <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <label htmlFor="input-meta-gordura" className="block text-xs font-bold text-slate-800 uppercase font-mono tracking-wider">
              Definir Objetivo de % de Gordura Corporal
            </label>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              Gordura Atual: <strong className="font-mono text-slate-800">{results.percentualGordura.toFixed(1)}%</strong> ({results.gorduraClassificacao}) | Faixa Normativa Saudável: <span className="font-mono font-semibold text-slate-700">{results.faixaReferencia}</span>
            </span>
          </div>

          {/* Campo Numérico com Controles Finos */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              type="button"
              onClick={() => handleStepChange(-0.5)}
              className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center justify-center font-mono font-bold text-sm shadow-2xs cursor-pointer transition-colors"
              title="Diminuir 0.5%"
            >
              -
            </button>

            <div className="relative flex items-center">
              <input
                id="input-meta-gordura"
                type="number"
                min="3.0"
                max="60.0"
                step="0.1"
                value={targetFatInput}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  if (!isNaN(val)) setTargetFatInput(val);
                }}
                className="w-28 text-center px-2 py-1.5 text-lg font-bold font-mono text-slate-900 bg-white border-2 border-emerald-500 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-400/40 shadow-xs tabular-nums"
              />
              <span className="absolute right-3 pointer-events-none text-xs font-bold font-mono text-slate-400">
                %
              </span>
            </div>

            <button
              type="button"
              onClick={() => handleStepChange(0.5)}
              className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center justify-center font-mono font-bold text-sm shadow-2xs cursor-pointer transition-colors"
              title="Aumentar 0.5%"
            >
              +
            </button>
          </div>
        </div>

        {/* Slider Contínuo */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span>3.0% (Mínimo Biológico)</span>
            <span className="text-emerald-700 font-bold">Alvo Selecionado: {targetFatInput.toFixed(1)}%</span>
            <span>40.0%</span>
          </div>
          <input
            type="range"
            min="3.0"
            max="40.0"
            step="0.1"
            value={targetFatInput}
            onChange={(e) => setTargetFatInput(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-700"
          />
        </div>

        {/* Botões de Atalhos Clínicos Rápidos */}
        <div className="flex items-center gap-2 flex-wrap pt-1">
          <span className="text-[10px] font-bold font-mono uppercase text-slate-400 mr-1">
            Atalhos Clínicos:
          </span>
          <button
            type="button"
            onClick={() => handleApplyPreset(minNormativo)}
            className="px-2.5 py-1 text-[11px] font-mono font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-emerald-400 hover:text-emerald-800 transition-colors shadow-2xs"
          >
            Mín. Saudável ({minNormativo.toFixed(1)}%)
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset(mediaNormativa)}
            className="px-2.5 py-1 text-[11px] font-mono font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-emerald-400 hover:text-emerald-800 transition-colors shadow-2xs"
          >
            Média ({mediaNormativa.toFixed(1)}%)
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset(maxNormativo)}
            className="px-2.5 py-1 text-[11px] font-mono font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-emerald-400 hover:text-emerald-800 transition-colors shadow-2xs"
          >
            Máx. Saudável ({maxNormativo.toFixed(1)}%)
          </button>
          {results.percentualGordura > 12 && (
            <button
              type="button"
              onClick={() => handleApplyPreset(results.percentualGordura - 3)}
              className="px-2.5 py-1 text-[11px] font-mono font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-emerald-400 hover:text-emerald-800 transition-colors shadow-2xs"
            >
              Redução Moderada (-3%)
            </button>
          )}
          {results.percentualGordura > 15 && (
            <button
              type="button"
              onClick={() => handleApplyPreset(results.percentualGordura - 5)}
              className="px-2.5 py-1 text-[11px] font-mono font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-emerald-400 hover:text-emerald-800 transition-colors shadow-2xs"
            >
              Redução Significativa (-5%)
            </button>
          )}
          <button
            type="button"
            onClick={() => handleApplyPreset(sexo === 'masculino' ? 10 : 18)}
            className="px-2.5 py-1 text-[11px] font-mono font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-emerald-400 hover:text-emerald-800 transition-colors shadow-2xs"
          >
            Atlético ({sexo === 'masculino' ? '10%' : '18%'})
          </button>
        </div>
      </div>

      {/* Alerta de Risco Biológico se abaixo de gordura essencial */}
      {simulation.isAbaixoGorduraEssencial && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold uppercase font-mono text-amber-900">
              Alerta de Limite Fisiológico (Gordura Essencial)
            </h4>
            <p className="text-xs text-amber-800 leading-relaxed">
              {simulation.alertaClinico}
            </p>
          </div>
        </div>
      )}

      {/* RESULTADO PRINCIPAL DO CÁLCULO SOLICITADO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: GORDURA A PERDER (Kg) - Destaque Central */}
        <div className={`p-4 rounded-2xl border transition-all ${
          isPerda
            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
            : isGanho
            ? 'bg-sky-50/70 border-sky-200 text-sky-950'
            : 'bg-slate-50 border-slate-200 text-slate-900'
        }`}>
          <div className="flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <span className={isPerda ? 'text-emerald-800' : isGanho ? 'text-sky-800' : 'text-slate-500'}>
              {isPerda ? 'Gordura a Perder' : isGanho ? 'Gordura a Ganhar' : 'Status da Gordura'}
            </span>
            {isPerda ? (
              <ArrowDown className="w-4 h-4 text-emerald-600" />
            ) : isGanho ? (
              <ArrowUp className="w-4 h-4 text-sky-600" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-slate-400" />
            )}
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-3xl font-extrabold font-mono tabular-nums ${
              isPerda ? 'text-emerald-700' : isGanho ? 'text-sky-700' : 'text-slate-700'
            }`}>
              {Math.abs(simulation.gorduraDiferencaKg).toFixed(1)}
            </span>
            <span className="text-sm font-bold font-mono text-slate-600">kg</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {isPerda
              ? 'Massa adiposa pura a ser eliminada'
              : isGanho
              ? 'Aumento lipídico para restauração'
              : 'Manutenção do nível lipídico atual'}
          </span>
        </div>

        {/* Card 2: PESO TOTAL ALVO NA BALANÇA */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-2">
            <span>Peso Alvo na Balança</span>
            <Scale className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold font-mono text-slate-900 tabular-nums">
              {simulation.pesoAlvoKg.toFixed(1)}
            </span>
            <span className="text-sm font-bold font-mono text-slate-500">kg</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block font-mono">
            Variação: {simulation.pesoDiferencaKg > 0 ? `-${simulation.pesoDiferencaKg.toFixed(1)}` : `+${Math.abs(simulation.pesoDiferencaKg).toFixed(1)}`} kg
          </span>
        </div>

        {/* Card 3: MASSA MAGRA FIXA (100% PRESERVADA) */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-2">
            <span>Massa Magra Mantida</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
              100% Fixa
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold font-mono text-slate-900 tabular-nums">
              {simulation.massaLivreGorduraPreservadaKg.toFixed(1)}
            </span>
            <span className="text-sm font-bold font-mono text-slate-500">kg</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Massa muscular, óssea e visceral
          </span>
        </div>

        {/* Card 4: MASSA GORDA FINAL ALVO */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-2">
            <span>Massa Gorda Alvo</span>
            <Activity className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold font-mono text-slate-900 tabular-nums">
              {simulation.massaGordaAlvoKg.toFixed(1)}
            </span>
            <span className="text-sm font-bold font-mono text-slate-500">kg</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block font-mono">
            Exatos {simulation.percentualGorduraAlvo.toFixed(1)}% do peso final
          </span>
        </div>
      </div>

      {/* Tabela Comparativa Detalhada & Cronograma Clínico */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna 1 e 2: Tabela Comparativa de Composição (Atual vs Meta vs Variação) */}
        <div className="lg:col-span-2 overflow-x-auto">
          <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider mb-3">
            Quadro Comparativo de Composição Corporal
          </h3>

          <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-50 text-slate-700 font-mono border-b border-slate-200">
              <tr>
                <th className="p-2.5 font-bold">Parâmetro Clínico</th>
                <th className="p-2.5 font-bold text-right">Atual</th>
                <th className="p-2.5 font-bold text-right text-emerald-800">Meta Alvo</th>
                <th className="p-2.5 font-bold text-right">Variação (Δ)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              <tr className="hover:bg-slate-50/50">
                <td className="p-2.5 font-medium text-slate-900 flex items-center gap-1.5">
                  <span>Percentual de Gordura</span>
                </td>
                <td className="p-2.5 text-right font-mono font-bold text-slate-800 tabular-nums">
                  {simulation.percentualGorduraAtual.toFixed(1)}%
                </td>
                <td className="p-2.5 text-right font-mono font-bold text-emerald-700 tabular-nums bg-emerald-50/30">
                  {simulation.percentualGorduraAlvo.toFixed(1)}%
                </td>
                <td className="p-2.5 text-right font-mono font-semibold tabular-nums">
                  {simulation.percentualGorduraAlvo - simulation.percentualGorduraAtual > 0 ? '+' : ''}
                  {(simulation.percentualGorduraAlvo - simulation.percentualGorduraAtual).toFixed(1)}%
                </td>
              </tr>

              <tr className="hover:bg-slate-50/50 bg-emerald-50/10">
                <td className="p-2.5 font-semibold text-slate-900">
                  Massa Gorda (Tecido Adiposo)
                </td>
                <td className="p-2.5 text-right font-mono font-bold text-slate-800 tabular-nums">
                  {simulation.massaGordaAtualKg.toFixed(1)} kg
                </td>
                <td className="p-2.5 text-right font-mono font-bold text-emerald-700 tabular-nums bg-emerald-50/30">
                  {simulation.massaGordaAlvoKg.toFixed(1)} kg
                </td>
                <td className="p-2.5 text-right font-mono font-bold tabular-nums text-emerald-700">
                  {simulation.gorduraDiferencaKg > 0 ? `-${simulation.gorduraDiferencaKg.toFixed(1)}` : `+${Math.abs(simulation.gorduraDiferencaKg).toFixed(1)}`} kg
                </td>
              </tr>

              <tr className="hover:bg-slate-50/50">
                <td className="p-2.5 font-medium text-slate-700">
                  Massa Livre de Gordura (Massa Magra)
                </td>
                <td className="p-2.5 text-right font-mono text-slate-700 tabular-nums">
                  {simulation.massaLivreGorduraPreservadaKg.toFixed(1)} kg
                </td>
                <td className="p-2.5 text-right font-mono font-bold text-slate-900 tabular-nums bg-slate-50/50">
                  {simulation.massaLivreGorduraPreservadaKg.toFixed(1)} kg
                </td>
                <td className="p-2.5 text-right font-mono text-slate-400 tabular-nums">
                  0,0 kg (Constante)
                </td>
              </tr>

              <tr className="hover:bg-slate-50/50">
                <td className="p-2.5 font-bold text-slate-900">
                  Peso Corporal Total
                </td>
                <td className="p-2.5 text-right font-mono font-bold text-slate-800 tabular-nums">
                  {simulation.pesoAtualKg.toFixed(1)} kg
                </td>
                <td className="p-2.5 text-right font-mono font-bold text-emerald-700 tabular-nums bg-emerald-50/30">
                  {simulation.pesoAlvoKg.toFixed(1)} kg
                </td>
                <td className="p-2.5 text-right font-mono font-bold tabular-nums text-slate-800">
                  {simulation.pesoDiferencaKg > 0 ? `-${simulation.pesoDiferencaKg.toFixed(1)}` : `+${Math.abs(simulation.pesoDiferencaKg).toFixed(1)}`} kg
                </td>
              </tr>

              {simulation.imcAtual > 0 && (
                <tr className="hover:bg-slate-50/50">
                  <td className="p-2.5 font-medium text-slate-600">
                    Índice de Massa Corporal (IMC)
                  </td>
                  <td className="p-2.5 text-right font-mono text-slate-700 tabular-nums">
                    {simulation.imcAtual.toFixed(1)} kg/m²
                  </td>
                  <td className="p-2.5 text-right font-mono font-semibold text-slate-900 tabular-nums bg-slate-50/50">
                    {simulation.imcAlvo.toFixed(1)} kg/m²
                  </td>
                  <td className="p-2.5 text-right font-mono text-slate-600 tabular-nums">
                    {(simulation.imcAlvo - simulation.imcAtual).toFixed(1)} kg/m²
                  </td>
                </tr>
              )}

              <tr className="hover:bg-slate-50/50">
                <td className="p-2.5 font-medium text-slate-600">
                  Classificação Normativa
                </td>
                <td className="p-2.5 text-right font-sans text-slate-700">
                  {results.gorduraClassificacao}
                </td>
                <td className="p-2.5 text-right font-sans font-bold text-emerald-800 bg-emerald-50/30">
                  {simulation.classificacaoAlvo}
                </td>
                <td className="p-2.5 text-right font-sans text-xs text-slate-400">
                  Faixa: {results.faixaReferencia}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Coluna 3: Estimativa Temporal & Viabilidade Clínica */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-slate-700" />
              <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                Planejamento & Tempo de Tratamento
              </h3>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Estimativas baseadas nas diretrizes do ACSM e ABESO para oxidação lipídica fisiológica sem catabolismo de massa magra.
            </p>
          </div>

          {isPerda && simulation.semanasEstimadasSustentavel > 0 ? (
            <div className="space-y-3">
              {/* Ritmo Sustentável */}
              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[11px] font-bold text-emerald-800">
                    Ritmo Sustentável (~0,5 kg/sem)
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold">
                    Recomendado
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold font-mono text-slate-900">
                    {simulation.semanasEstimadasSustentavel}
                  </span>
                  <span className="text-xs font-medium text-slate-500">semanas</span>
                  <span className="text-xs font-medium text-slate-400">
                    (~{simulation.mesesEstimadosSustentavel} meses)
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Máxima retenção muscular e menor efeito rebote.
                </span>
              </div>

              {/* Ritmo Moderado */}
              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[11px] font-semibold text-slate-700">
                    Ritmo Moderado (~0,75 kg/sem)
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold font-mono text-slate-800">
                    {simulation.semanasEstimadasModerado}
                  </span>
                  <span className="text-xs font-medium text-slate-500">semanas</span>
                  <span className="text-xs font-medium text-slate-400">
                    (~{simulation.mesesEstimadosModerado} meses)
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Exige aporte proteico e treino resistido rigorosos.
                </span>
              </div>
            </div>
          ) : isGanho ? (
            <div className="p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-600">
              Objetivo de recuperação ou ganho ponderal. O planejamento nutricional deve focar em superávit calórico controlado associado a treinamento de hipertrofia.
            </div>
          ) : (
            <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-900">
              O paciente já atinge exatamente o percentual alvo desejado ({targetFatInput.toFixed(1)}%). Manutenção isocalórica recomendada.
            </div>
          )}

          <div className="pt-2 border-t border-slate-200/60 text-[10px] text-slate-400 leading-relaxed">
            *Fórmula: Peso Alvo = MLG / (1 - %G Alvo / 100). Preservar 100% da massa magra requer ingesta proteica calculada (1,6 a 2,2 g/kg) e estímulo neuromuscular com treino resistido.
          </div>
        </div>
      </div>
    </div>
  );
};
