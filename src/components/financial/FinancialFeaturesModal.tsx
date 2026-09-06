import React from 'react';
import {
  Sparkles,
  Zap,
  CheckCircle2,
  X,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  PieChart,
  FileSpreadsheet,
  QrCode,
  Layers,
  Building2,
  Lock,
  ArrowRight,
  Sliders
} from 'lucide-react';
import {
  FinancialMasterFeature,
  FINANCIAL_MASTER_FEATURES
} from '../../data/financialData';

interface FinancialFeaturesModalProps {
  isOpen: boolean;
  onClose: () => void;
  features: FinancialMasterFeature[];
  onToggleFeature: (id: string) => void;
  onActivateAll: () => void;
}

export const FinancialFeaturesModal: React.FC<FinancialFeaturesModalProps> = ({
  isOpen,
  onClose,
  features,
  onToggleFeature,
  onActivateAll
}) => {
  if (!isOpen) return null;

  const activeCount = features.filter(f => f.isActive).length;
  const totalCount = features.length;
  const allActive = activeCount === totalCount;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Fluxo & DRE':
        return <TrendingUp className="w-4 h-4 text-emerald-400" />;
      case 'Faturamento':
        return <DollarSign className="w-4 h-4 text-emerald-400" />;
      case 'Custos & Despesas':
        return <Layers className="w-4 h-4 text-rose-400" />;
      case 'Bancário & Pix':
        return <QrCode className="w-4 h-4 text-sky-400" />;
      case 'Fiscal & Compliance':
      default:
        return <ShieldCheck className="w-4 h-4 text-purple-400" />;
    }
  };

  const getImpactBadge = (level: string) => {
    switch (level) {
      case 'Crítico':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Alto':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      default:
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    }
  };

  return (
    <div
      id="modal-ativacao-funcoes-financeiras"
      className="fixed inset-0 z-[140] flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        className="w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-700/90 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho do Modal */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                  Central Master: Recursos Financeiros & DRE
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                  {activeCount}/{totalCount} Ativos
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Ativação e conformidade de regras de fluxo de caixa, DRE gerencial, conciliação e recibos DMED/IRPF.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barra de Ação Master (Ativar Todas as Funções) */}
        <div className="px-6 py-4 border-b border-slate-800 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">
                {allActive ? 'Todas as 10 Funções Financeiras estão 100% Ativas!' : 'Ativação em Lote de Recursos Financeiros'}
              </span>
              <span className="text-[11px] text-slate-400">
                Garante precisão contábil, cálculos puros de EBITDA e emissão de recibos fiscais.
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onActivateAll}
            disabled={allActive}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
              allActive
                ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40 cursor-default'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40 hover:scale-[1.02]'
            }`}
          >
            {allActive ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Todas Ativadas (10/10)
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-current" />
                ATIVAR TODAS AS FUNÇÕES (10/10)
              </>
            )}
          </button>
        </div>

        {/* Lista de Recursos (10/10) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-slate-950/40">
          {features.map((feat, idx) => (
            <div
              key={feat.id}
              className={`p-4 rounded-2xl border transition-all ${
                feat.isActive
                  ? 'bg-slate-900/90 border-slate-700/80 shadow-sm'
                  : 'bg-slate-950/40 border-slate-800/60 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 mt-0.5">
                    {getCategoryIcon(feat.category)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono text-slate-400 font-semibold">
                        #{String(idx + 1).padStart(2, '0')}
                      </span>
                      <h3 className="text-sm font-bold text-white">
                        {feat.name}
                      </h3>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-slate-800 text-slate-300 border-slate-700">
                        {feat.category}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getImpactBadge(feat.impactLevel)}`}>
                        {feat.impactLevel}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {feat.description}
                    </p>

                    <div className="pt-1 flex items-center gap-1.5 text-[11px] font-mono text-emerald-400/90">
                      <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                      <span>Regra Clínica / Contábil: {feat.clinicalRule}</span>
                    </div>
                  </div>
                </div>

                {/* Switch de Ativação Individual */}
                <button
                  type="button"
                  onClick={() => onToggleFeature(feat.id)}
                  className={`w-12 h-6.5 rounded-full transition-colors relative cursor-pointer shrink-0 mt-1 ${
                    feat.isActive ? 'bg-emerald-600' : 'bg-slate-700'
                  }`}
                  title={feat.isActive ? 'Desativar recurso' : 'Ativar recurso'}
                >
                  <span
                    className={`absolute top-1 left-1 w-4.5 h-4.5 rounded-full bg-white transition-transform ${
                      feat.isActive ? 'translate-x-5.5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Rodapé do Modal */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-400">
            Conformidade com padrões contábeis de saúde e LGPD Fiscal.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer"
          >
            Concluir & Voltar
          </button>
        </div>
      </div>
    </div>
  );
};
