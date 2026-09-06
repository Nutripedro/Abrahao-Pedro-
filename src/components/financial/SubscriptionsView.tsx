import React, { useState } from 'react';
import {
  Award,
  RefreshCw,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  Phone,
  Calendar,
  Sparkles,
  CreditCard,
  QrCode,
  DollarSign,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import {
  RecurringSubscription,
  MOCK_RECURRING_SUBSCRIPTIONS,
  formatCurrencyBRL,
  formatDateBR
} from '../../data/financialData';

interface SubscriptionsViewProps {
  subscriptions?: RecurringSubscription[];
}

export const SubscriptionsView: React.FC<SubscriptionsViewProps> = ({
  subscriptions = MOCK_RECURRING_SUBSCRIPTIONS
}) => {
  const [subList, setSubList] = useState<RecurringSubscription[]>(subscriptions);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeSubs = subList.filter(s => s.status === 'active');
  const pendingSubs = subList.filter(s => s.status === 'pending_payment');

  const totalMrr = activeSubs.reduce((sum, s) => {
    if (s.frequency === 'Mensal') return sum + s.amount;
    if (s.frequency === 'Trimestral') return sum + s.amount / 3;
    if (s.frequency === 'Semestral') return sum + s.amount / 6;
    if (s.frequency === 'Anual') return sum + s.amount / 12;
    return sum + s.amount;
  }, 0);

  const handleToggleRenew = (id: string) => {
    setSubList(prev =>
      prev.map(s => (s.id === id ? { ...s, autoRenew: !s.autoRenew } : s))
    );
    setToastMessage('Preferência de renovação automática atualizada!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/90 border border-emerald-500/80 text-emerald-200 text-xs font-bold flex items-center gap-2 shadow-lg animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* Header com MRR e Métricas */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Award className="w-5 h-5" />
            </div>
            <h2 className="text-base font-extrabold text-white">
              Clube de Nutrição & Assinaturas Recorrentes (MRR)
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Acompanhamentos continuados com cobrança automática no cartão ou Pix recorrente.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-950/80 px-4 py-2.5 rounded-2xl border border-slate-800">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono block">MRR Mensal Consolidado</span>
            <span className="text-lg font-black text-purple-400 font-mono">
              {formatCurrencyBRL(totalMrr)}
            </span>
          </div>
        </div>
      </div>

      {/* Grid de Assinaturas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subList.map((sub) => {
          const isActive = sub.status === 'active';

          return (
            <div
              key={sub.id}
              className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-sm hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 uppercase">
                      {sub.planName}
                    </span>
                    <h3 className="text-sm font-bold text-white mt-1">{sub.patientName}</h3>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-500" />
                      {sub.patientPhone}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-black text-emerald-400 font-mono">
                      {formatCurrencyBRL(sub.amount)}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-mono">/ {sub.frequency}</span>
                  </div>
                </div>

                {/* Métricas e Datas */}
                <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 grid grid-cols-2 gap-2 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Próxima Cobrança</span>
                    <span className="text-slate-200 font-semibold">{formatDateBR(sub.nextBillingDate)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Meses Consecutivos</span>
                    <span className="text-purple-300 font-semibold">{sub.totalPaidMonths} meses ativos</span>
                  </div>
                </div>
              </div>

              {/* Rodapé do Card */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span
                  className={`inline-flex items-center gap-1 font-bold px-2.5 py-0.5 rounded-full text-[11px] border ${
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                  }`}
                >
                  {isActive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                  {isActive ? 'Ativa & Recorrente' : 'Pagamento Pendente'}
                </span>

                <button
                  type="button"
                  onClick={() => handleToggleRenew(sub.id)}
                  className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  {sub.autoRenew ? '✓ Renovação Automática' : 'Renovação Manual'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
