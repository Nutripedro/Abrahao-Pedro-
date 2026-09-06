import React, { useState } from 'react';
import {
  Sparkles,
  Info,
  AlertTriangle,
  Clock,
  Compass,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  ZoomIn,
  Eye,
  Layers,
  MapPin,
  Maximize2,
  Activity,
} from 'lucide-react';
import { Gender, SkinfoldKey, SkinfoldValues } from '../types';
import { SKINFOLD_TECHNIQUE_TIPS, SkinfoldTechniqueData } from '../data/skinfoldTechniqueTips';
import { SkinfoldPinchDiagram } from './SkinfoldPinchDiagram';
import { SKINFOLD_DEFINITIONS } from '../data/protocolData';
import { ResponsiveImage } from './common/ResponsiveImage';

interface SkinfoldQuickTipProps {
  selectedFoldKey: SkinfoldKey | null;
  onSelectFold: (key: SkinfoldKey) => void;
  skinfoldValues?: SkinfoldValues;
  requiredFolds?: SkinfoldKey[];
  sexo?: Gender;
  isInlineMode?: boolean;
}

export const SkinfoldQuickTip: React.FC<SkinfoldQuickTipProps> = ({
  selectedFoldKey,
  onSelectFold,
  skinfoldValues = {},
  requiredFolds = [],
  sexo = 'masculino',
  isInlineMode = false,
}) => {
  // Se nenhuma dobra foi selecionada pelo usuário, usa o tríceps como padrão inicial
  const activeKey = selectedFoldKey || 'triceps';
  const tipData: SkinfoldTechniqueData = SKINFOLD_TECHNIQUE_TIPS[activeKey] || SKINFOLD_TECHNIQUE_TIPS.triceps;
  const def = SKINFOLD_DEFINITIONS[activeKey] || SKINFOLD_DEFINITIONS.triceps;

  // Alternador de Visualização: Imagem IA vs Diagrama Vetorial
  const [visualTab, setVisualTab] = useState<'ia-image' | 'vector-diagram'>('ia-image');
  const [isImageZoomed, setIsImageZoomed] = useState<boolean>(false);

  const currentValue = skinfoldValues[activeKey];
  const isFilled = currentValue !== undefined && currentValue !== null && Number(currentValue) > 0;
  const isRequired = requiredFolds.length === 0 || requiredFolds.includes(activeKey);

  return (
    <div
      id="card-dica-rapida-pinçamento"
      className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs p-5 sm:p-6 space-y-5 transition-all"
    >
      {/* Cabeçalho da Dica Rápida */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center border border-amber-200/80 dark:border-amber-900/60 shadow-2xs shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xs font-bold tracking-tight text-slate-900 dark:text-white uppercase font-sans">
                Dica Rápida: Técnica de Pinçamento
              </h3>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Guia Visual IA & ISAK
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Instruções de palpação, orientação do eixo e aplicação do adipômetro.
            </p>
          </div>
        </div>

        {/* Status da Dobra Selecionada */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {isFilled ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Medido: {Number(currentValue).toFixed(1)} mm
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono text-slate-600 bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700">
              Aguardando medição
            </span>
          )}
        </div>
      </div>

      {/* Seletor Rápido de Dobras com Pílulas Deslizantes */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider block">
          Dobra em foco no momento:
        </span>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
          {(requiredFolds.length > 0 ? requiredFolds : (Object.keys(SKINFOLD_TECHNIQUE_TIPS) as SkinfoldKey[])).map((key) => {
            const item = SKINFOLD_TECHNIQUE_TIPS[key];
            const isSelected = activeKey === key;
            const hasVal = skinfoldValues[key] !== undefined && skinfoldValues[key] !== null && Number(skinfoldValues[key]) > 0;

            return (
              <button
                key={key}
                type="button"
                onClick={() => onSelectFold(key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium font-sans whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-slate-900 text-white dark:bg-sky-600 dark:text-white font-bold shadow-xs'
                    : hasVal
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 hover:bg-emerald-100'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span className="font-mono text-[10px] opacity-75">{item.number}.</span>
                <span>{item.shortName}</span>
                {hasVal && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ml-0.5"></span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Cartão de Identificação da Dobra Ativa */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-slate-900 text-white dark:bg-sky-600 font-mono text-xs font-bold flex items-center justify-center">
              {tipData.number}
            </span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white font-sans">
              {tipData.name}
            </h4>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-semibold">
              {tipData.regionalGroup}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1 font-mono text-[11px]">
              <Compass className="w-3.5 h-3.5 text-sky-700 dark:text-sky-400" />
              {tipData.orientationAngle}
            </span>
          </div>
        </div>

        {/* Alternador entre Imagem IA e Diagrama Vetorial */}
        <div className="flex items-center p-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 self-start sm:self-auto shadow-2xs">
          <button
            type="button"
            onClick={() => setVisualTab('ia-image')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              visualTab === 'ia-image'
                ? 'bg-slate-900 text-white dark:bg-sky-600 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Imagem IA</span>
          </button>
          <button
            type="button"
            onClick={() => setVisualTab('vector-diagram')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              visualTab === 'vector-diagram'
                ? 'bg-slate-900 text-white dark:bg-sky-600 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Diagrama Vetorial</span>
          </button>
        </div>
      </div>

      {/* ÁREA VISUAL PRINCIPAL (IMAGEM GERADA POR IA OU DIAGRAMA VETORIAL) */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden bg-slate-950 text-white">
        {visualTab === 'ia-image' ? (
          <div className="relative group">
            {/* Imagem médica gerada via IA */}
            <div className="relative w-full aspect-16/10 bg-slate-900 flex items-center justify-center overflow-hidden">
              <ResponsiveImage
                src={tipData.imageSrc}
                alt={tipData.imageAlt}
                className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
              />

              {/* Overlay com Anotação Anatômica Rápida */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent flex flex-col justify-end p-4 pointer-events-none">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-slate-950/80 px-2 py-0.5 rounded-md border border-emerald-500/30">
                      Técnica Real com Adipômetro
                    </span>
                    <p className="text-xs text-slate-200 font-medium mt-1 drop-shadow-sm line-clamp-1">
                      Pinçamento 1,0 cm acima das hastes • Eixo: {tipData.orientationAngle}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Rodapé explicativo da imagem */}
            <div className="p-3 bg-slate-900/95 border-t border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Diagrama anatômico gerado por IA para visualização clínica
              </span>
              <button
                type="button"
                onClick={() => setVisualTab('vector-diagram')}
                className="text-sky-400 hover:underline text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>Ver camadas anatômicas</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Diagrama Vetorial com Camadas e Cotas Numéricas */}
            <SkinfoldPinchDiagram
              foldKey={activeKey}
              orientation={tipData.orientationType}
              foldName={tipData.name}
            />
          </div>
        )}
      </div>

      {/* GUIA PASSO A PASSO DA TÉCNICA CLÍNICA (ISAK NÍVEL 1) */}
      <div className="space-y-3 pt-1">
        <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Passo a Passo da Técnica de Pinçamento
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {/* Passo 1: Ponto Anatômico & Marcação */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white font-mono text-[11px] uppercase">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span>1. Ponto de Marcação</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {tipData.anatomicalLandmark}
            </p>
          </div>

          {/* Passo 2: Postura do Paciente */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white font-mono text-[11px] uppercase">
              <Activity className="w-3.5 h-3.5 text-sky-500" />
              <span>2. Postura do Avaliado</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {tipData.patientStance}
            </p>
          </div>

          {/* Passo 3: Técnica com Polegar e Indicador */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white font-mono text-[11px] uppercase">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-white text-[9px] font-mono flex items-center justify-center font-bold">
                ✓
              </span>
              <span>3. Pinçamento Digital</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {tipData.pinchingMethod}
            </p>
          </div>

          {/* Passo 4: Aplicação das Hastes & Tempo */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white font-mono text-[11px] uppercase">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>4. Aplicação e 2 Segundos</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {tipData.caliperApplication} {tipData.timingRule}
            </p>
          </div>
        </div>
      </div>

      {/* Regra de Ouro ISAK & Erros Frequentes a Evitar */}
      <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 space-y-2">
        <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-bold text-xs uppercase font-mono">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>Erros Frequentes na Consulta ({tipData.shortName}):</span>
        </div>
        <ul className="space-y-1 text-xs text-amber-900 dark:text-amber-200 list-disc list-inside">
          {tipData.commonErrors.map((err, i) => (
            <li key={i} className="leading-relaxed">
              {err}
            </li>
          ))}
        </ul>
      </div>

      {/* Nota de Padronização e Repetibilidade */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
        <span className="font-mono">
          <strong>Referência ISAK:</strong> {tipData.isakRule}
        </span>
        <span className="font-mono text-slate-400">
          Variação tolerada: &lt; 5% entre medições
        </span>
      </div>
    </div>
  );
};
