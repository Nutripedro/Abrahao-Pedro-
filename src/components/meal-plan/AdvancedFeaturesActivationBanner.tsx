import React from 'react';
import {
  Sparkles,
  CheckCircle2,
  Sliders,
  ShieldCheck,
  Zap,
  Flame,
  Apple,
  ShoppingCart,
  Printer,
  Smartphone,
  AlertTriangle,
  Droplet,
  Clock,
  Layers
} from 'lucide-react';
import { useMealPlan } from '../../contexts/MealPlanContext';

export const AdvancedFeaturesActivationBanner: React.FC = () => {
  const {
    features,
    allFeaturesActive,
    activeFeaturesCount,
    totalFeaturesCount,
    toggleFeature,
    activateAllFeatures,
    deactivateAllFeatures
  } = useMealPlan();

  const [expanded, setExpanded] = React.useState(false);

  const playChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(783.99, audioCtx.currentTime + 0.15); // G5
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch {
      // ignore
    }
  };

  const handleActivateAll = () => {
    activateAllFeatures();
    playChime();
  };

  const featuresList = [
    {
      key: 'calculoMicronutrientesAutomatico' as const,
      label: 'Cálculo de Micronutrientes (Cálcio, Ferro, Sódio, Potássio, Vit C, Zinco)',
      icon: <Sparkles className="w-4 h-4 text-purple-500" />
    },
    {
      key: 'alertasDeficitProteico' as const,
      label: 'Monitoramento Proteico g/kg em Tempo Real',
      icon: <Flame className="w-4 h-4 text-amber-500" />
    },
    {
      key: 'sistemaEquivalenciaIsocalorica' as const,
      label: 'Sistema de Substituições Isocalóricas da Tabela TACO',
      icon: <Apple className="w-4 h-4 text-emerald-500" />
    },
    {
      key: 'listaComprasAutomatica' as const,
      label: 'Gerador de Lista de Compras Semanal por Setor',
      icon: <ShoppingCart className="w-4 h-4 text-teal-500" />
    },
    {
      key: 'exportacaoPdfClinico' as const,
      label: 'Exportação em Laudo Oficial & Impressão A4',
      icon: <Printer className="w-4 h-4 text-blue-500" />
    },
    {
      key: 'sincronizacaoAppPaciente' as const,
      label: 'Sincronização em Tempo Real com App do Paciente',
      icon: <Smartphone className="w-4 h-4 text-indigo-500" />
    },
    {
      key: 'alertasAlergenicosGlutenLactose' as const,
      label: 'Detecção de Alergênicos, Glúten e Lactose',
      icon: <AlertTriangle className="w-4 h-4 text-orange-500" />
    },
    {
      key: 'orientacaoHidratacaoPersonalizada' as const,
      label: 'Meta Hídrica Individualizada (35 a 45ml/kg)',
      icon: <Droplet className="w-4 h-4 text-sky-500" />
    },
    {
      key: 'crononutricaoTimingNutrientes' as const,
      label: 'Crononutrição & Fracionamento % VET por Refeição',
      icon: <Clock className="w-4 h-4 text-rose-500" />
    },
    {
      key: 'assistenteCardapioClinico' as const,
      label: 'Modelos de Prescrição Clínica de Alta Performance',
      icon: <Layers className="w-4 h-4 text-emerald-600" />
    }
  ];

  return (
    <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 text-white rounded-2xl border border-emerald-500/30 p-5 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 fill-emerald-400" />
              Módulo Clínico Master
            </span>
            <span className="text-xs font-mono text-emerald-400 font-bold">
              {activeFeaturesCount}/{totalFeaturesCount} Funções Ativas
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
            Planos Alimentares & Prescrição Dietoterápica
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl">
            Tabela TACO/IBGE integrada, cálculo de micronutrientes, substituições isocalóricas, exportação em PDF e sincronização direta com o aplicativo do paciente.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            id="btn-ativar-todas-funcoes-planos"
            onClick={handleActivateAll}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-lg active:scale-95 ${
              allFeaturesActive
                ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 ring-2 ring-emerald-400/50'
                : 'bg-emerald-600 text-white hover:bg-emerald-500 ring-2 ring-emerald-500/30'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            {allFeaturesActive ? '✓ TODAS AS FUNÇÕES ATIVADAS (10/10)' : 'ATIVAR TODAS AS FUNÇÕES (10/10)'}
          </button>

          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Sliders className="w-4 h-4" />
            <span>{expanded ? 'Ocultar' : 'Configurar'}</span>
          </button>
        </div>
      </div>

      {/* Expanded Toggles */}
      {expanded && (
        <div className="pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {featuresList.map((item) => {
            const isActive = features[item.key];
            return (
              <div
                key={item.key}
                onClick={() => toggleFeature(item.key)}
                className={`p-2.5 rounded-xl border cursor-pointer flex items-center justify-between text-xs transition-all ${
                  isActive
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-white'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 pr-2">
                  {item.icon}
                  <span className="font-medium text-[11px] leading-tight">{item.label}</span>
                </div>
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${
                    isActive
                      ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                      : 'border-slate-700 bg-slate-800'
                  }`}
                >
                  {isActive && <CheckCircle2 className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
