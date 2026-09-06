import React, { useState } from 'react';
import {
  Sliders,
  Check,
  BookOpen,
  Info,
  Sparkles,
  Zap,
  Activity,
  Layers,
  Award
} from 'lucide-react';
import { Gender, MethodType, ProtocolType, SkinfoldKey } from '../types';
import { PROTOCOLS_LIST, SKINFOLD_DEFINITIONS } from '../data/protocolData';
import { getRequiredSkinfolds } from '../utils/anthropometry';

interface ProtocolSelectorProps {
  method: MethodType;
  protocol: ProtocolType;
  sexo: Gender;
  onMethodChange: (m: MethodType) => void;
  onProtocolChange: (p: ProtocolType) => void;
}

export const ProtocolSelector: React.FC<ProtocolSelectorProps> = ({
  method,
  protocol,
  sexo,
  onMethodChange,
  onProtocolChange,
}) => {
  // Protocol card options configuration
  const protocolsData: {
    id: ProtocolType;
    method: MethodType;
    title: string;
    badge: string;
    badgeVariant: 'sky' | 'emerald' | 'indigo' | 'amber';
    foldCount: number;
    tagline: string;
    audience: string;
    equation: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'jp-3',
      method: 'jackon-pollock',
      title: 'Jackson-Pollock (3 Dobras)',
      badge: '3 Dobras',
      badgeVariant: 'sky',
      foldCount: 3,
      tagline: 'Ágil • Alta Correlação Clínica',
      audience: 'População adulta geral, triagem rápida em consulta clínica.',
      equation:
        sexo === 'masculino'
          ? 'Jackson & Pollock (1978): Peitoral, Abdômen e Coxa'
          : 'Jackson, Pollock & Ward (1980): Tríceps, Supra-ilíaca e Coxa',
      icon: <Zap className="w-4 h-4" />,
    },
    {
      id: 'jp-4',
      method: 'jackon-pollock',
      title: 'Jackson-Pollock (4 Dobras)',
      badge: '4 Dobras',
      badgeVariant: 'indigo',
      foldCount: 4,
      tagline: 'Equilibrado • Tronco & Membros',
      audience: 'Praticantes de musculação, adultos ativos e recomposição.',
      equation: 'Jackson & Pollock: Tríceps, Abdômen, Supra-ilíaca e Coxa',
      icon: <Layers className="w-4 h-4" />,
    },
    {
      id: 'jp-7',
      method: 'jackon-pollock',
      title: 'Jackson-Pollock (7 Dobras)',
      badge: '7 Dobras (Padrão Ouro)',
      badgeVariant: 'emerald',
      foldCount: 7,
      tagline: 'Completo • Máxima Fidelidade',
      audience: 'Atletas, esportistas e acompanhamento minucioso de alta precisão.',
      equation: 'Jackson & Pollock (1978/1980): 7 pontos anatômicos padronizados',
      icon: <Award className="w-4 h-4" />,
    },
    {
      id: 'dw-4',
      method: 'durnin-womersley',
      title: 'Durnin & Womersley',
      badge: '4 Dobras (Logarítmico)',
      badgeVariant: 'amber',
      foldCount: 4,
      tagline: 'Calibrado por Idade & Sexo',
      audience: 'Jovens a idosos (17 a 72+ anos). Modelo de densidade logarítmica.',
      equation: 'Durnin & Womersley (1974): Bíceps, Tríceps, Subescapular e Supra-ilíaca',
      icon: <Activity className="w-4 h-4" />,
    },
  ];

  const handleSelectProtocol = (targetMethod: MethodType, targetProtocol: ProtocolType) => {
    onMethodChange(targetMethod);
    onProtocolChange(targetProtocol);
  };

  const activeConfig =
    protocolsData.find((p) => p.id === protocol && p.method === method) || protocolsData[0];

  const activeRequiredFolds = getRequiredSkinfolds(method, protocol, sexo);
  const [showDetailsOnMobile, setShowDetailsOnMobile] = useState<boolean>(false);

  return (
    <div
      id="card-selecao-protocolo"
      className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs p-4 sm:p-6 transition-all"
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 sm:pb-4 mb-4 sm:mb-5 border-b border-slate-100 dark:border-slate-800 gap-3">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 flex items-center justify-center border border-sky-100 dark:border-sky-900/60 shadow-2xs shrink-0">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-bold tracking-tight text-slate-900 dark:text-white uppercase font-sans">
              Protocolo de Composição Corporal
            </h2>
            <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
              Alterne dinamicamente o método científico de predição de densidade e gordura.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-semibold bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
            <Sparkles className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>Adaptação Automática de Dobras</span>
          </span>
        </div>
      </div>

      {/* MOBILE-ONLY COMPACT SEGMENTED PICKER (< sm) */}
      <div className="block sm:hidden mb-4">
        <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Seletor mobile de protocolos">
          {protocolsData.map((item) => {
            const isSelected = item.id === protocol && item.method === method;
            const foldsForThisProtocol = getRequiredSkinfolds(item.method, item.id, sexo);

            return (
              <button
                key={item.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => handleSelectProtocol(item.method, item.id)}
                className={`min-h-[44px] p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between active:scale-98 ${
                  isSelected
                    ? 'bg-slate-900 dark:bg-sky-950 text-white border-slate-900 dark:border-sky-600 shadow-sm ring-2 ring-sky-500/30'
                    : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wide">
                    {item.badge}
                  </span>
                  {isSelected && (
                    <span className="w-4 h-4 rounded-full bg-sky-500 text-slate-950 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  )}
                </div>
                <div className="font-bold text-xs truncate">
                  {item.title}
                </div>
                <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-sky-300' : 'text-slate-500 dark:text-slate-400'}`}>
                  {foldsForThisProtocol.length} dobras
                </div>
              </button>
            );
          })}
        </div>

        {/* Mobile Toggle to see protocol details */}
        <button
          type="button"
          onClick={() => setShowDetailsOnMobile(!showDetailsOnMobile)}
          className="mt-2.5 w-full py-1.5 text-center text-[11px] font-semibold text-sky-700 dark:text-sky-400 hover:underline cursor-pointer flex items-center justify-center gap-1"
        >
          <span>{showDetailsOnMobile ? 'Ocultar detalhes dos protocolos' : 'Ver detalhes comparativos dos protocolos'}</span>
        </button>
      </div>

      {/* DESKTOP/TABLET GRID OR EXPANDED MOBILE DETAILS */}
      <div
        className={`${showDetailsOnMobile ? 'grid' : 'hidden'} sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5 mb-4 sm:mb-5`}
        role="radiogroup"
        aria-label="Seletor visual de protocolos antropométricos"
      >
        {protocolsData.map((item) => {
          const isSelected = item.id === protocol && item.method === method;
          const foldsForThisProtocol = getRequiredSkinfolds(item.method, item.id, sexo);

          return (
            <button
              key={item.id}
              id={`btn-protocolo-${item.id}`}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => handleSelectProtocol(item.method, item.id)}
              className={`p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border text-left transition-all cursor-pointer relative flex flex-col justify-between group focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                isSelected
                  ? 'bg-slate-900 dark:bg-sky-950/80 text-white border-slate-900 dark:border-sky-600 shadow-md ring-2 ring-sky-500/30'
                  : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50/70 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100'
              }`}
            >
              {/* Header inside card */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-sky-500 text-slate-950'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        isSelected
                          ? 'bg-sky-400/20 text-sky-300 border border-sky-400/30'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  </div>

                  {/* Radio / Check indicator */}
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-sky-500 text-slate-950 shadow-2xs scale-105'
                        : 'border border-slate-300 dark:border-slate-600 group-hover:border-slate-400'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>

                <h3
                  className={`text-sm font-bold tracking-tight font-sans mb-1 ${
                    isSelected ? 'text-white' : 'text-slate-900 dark:text-white'
                  }`}
                >
                  {item.title}
                </h3>

                <p
                  className={`text-[11px] leading-relaxed mb-3 ${
                    isSelected ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {item.tagline}
                </p>
              </div>

              {/* Skinfolds Required Pills preview */}
              <div className="pt-2 border-t border-slate-200/50 dark:border-slate-700/60 mt-auto">
                <span
                  className={`text-[10px] font-mono block mb-1.5 font-bold uppercase ${
                    isSelected ? 'text-sky-300' : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {foldsForThisProtocol.length} dobras necessárias:
                </span>

                <div className="flex flex-wrap gap-1">
                  {foldsForThisProtocol.map((k) => (
                    <span
                      key={k}
                      className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium ${
                        isSelected
                          ? 'bg-slate-800 dark:bg-slate-900/90 text-slate-200 border border-slate-700'
                          : 'bg-slate-100 dark:bg-slate-700/80 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {SKINFOLD_DEFINITIONS[k]?.shortName || k}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Dynamic Summary Callout Bar: Informs user that inputs are dynamically adjusted */}
      <div className="p-4 rounded-2xl bg-sky-50/70 dark:bg-sky-950/40 border border-sky-200/80 dark:border-sky-900/60 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-start sm:items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 shadow-2xs">
            <BookOpen className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <strong className="text-xs font-bold text-sky-950 dark:text-sky-200">
                {activeConfig.title}
              </strong>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-sky-200/70 dark:bg-sky-900 text-sky-900 dark:text-sky-200 border border-sky-300 dark:border-sky-800">
                {activeRequiredFolds.length} Campos Exibidos
              </span>
            </div>
            <p className="text-[11px] text-sky-800/90 dark:text-sky-300/80 mt-0.5">
              {activeConfig.equation}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 text-[11px] text-slate-600 dark:text-slate-300 font-medium bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-sky-100 dark:border-sky-900/60 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Campos de dobras ajustados dinamicamente</span>
        </div>
      </div>
    </div>
  );
};
