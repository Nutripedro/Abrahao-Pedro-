import React, { useState } from 'react';
import {
  Users,
  Award,
  DollarSign,
  CheckCircle2,
  Clock,
  Printer,
  FileCheck,
  Download,
  Share2,
  Calendar,
  Percent,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import {
  ProfessionalCommission,
  MOCK_COMMISSIONS,
  formatCurrencyBRL
} from '../../data/financialData';
import { ResponsiveImage } from '../common/ResponsiveImage';

interface CommissionsViewProps {
  commissions?: ProfessionalCommission[];
  onPayCommission?: (commissionId: string) => void;
}

export const CommissionsView: React.FC<CommissionsViewProps> = ({
  commissions = MOCK_COMMISSIONS,
  onPayCommission
}) => {
  const [commList, setCommList] = useState<ProfessionalCommission[]>(commissions);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handlePay = (id: string, name: string) => {
    setCommList(prev =>
      prev.map(c => (c.id === id ? { ...c, status: 'paid', paymentDate: new Date().toISOString().split('T')[0] } : c))
    );
    if (onPayCommission) onPayCommission(id);
    setToastMessage(`Repasse de honorários para ${name} registrado como Pago com sucesso!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const totalGross = commList.reduce((sum, c) => sum + c.grossRevenue, 0);
  const totalCommissions = commList.reduce((sum, c) => sum + c.commissionAmount, 0);
  const totalClinicRetention = commList.reduce((sum, c) => sum + c.clinicRetention, 0);

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/90 border border-emerald-500/80 text-emerald-200 text-xs font-bold flex items-center gap-2 shadow-lg animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* Header com Totais de Repasses */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Users className="w-5 h-5" />
            </div>
            <h2 className="text-base font-extrabold text-white">
              Repasses & Comissões de Nutricionistas Parceiros
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Competência Setembro / 2026 • Cálculo automático de split sobre consultas e procedimentos.
          </p>
        </div>

        {/* Mini Cards de Resumo */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-slate-950/80 px-3.5 py-2 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 font-mono block">Repasse Total Profissionais</span>
            <span className="text-sm font-black text-emerald-400 font-mono">
              {formatCurrencyBRL(totalCommissions)}
            </span>
          </div>
          <div className="bg-slate-950/80 px-3.5 py-2 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 font-mono block">Retenção da Clínica (Margem)</span>
            <span className="text-sm font-black text-sky-400 font-mono">
              {formatCurrencyBRL(totalClinicRetention)}
            </span>
          </div>
        </div>
      </div>

      {/* Lista de Cards de Profissionais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {commList.map((comm) => {
          const isPaid = comm.status === 'paid';

          return (
            <div
              key={comm.id}
              className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Perfil */}
                <div className="flex items-start gap-3">
                  <ResponsiveImage
                    src={comm.avatar}
                    alt={comm.professionalName}
                    widths={[64, 128, 256]}
                    sizes="48px"
                    className="w-12 h-12 rounded-2xl object-cover border border-slate-700 shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-white truncate">{comm.professionalName}</h3>
                    <span className="text-xs text-slate-400 block truncate">{comm.role}</span>
                    <span className="text-[11px] font-mono text-emerald-400">{comm.crn}</span>
                  </div>
                </div>

                {/* Métricas do Mês */}
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Atendimentos Realizados:</span>
                    <strong className="text-white">{comm.totalConsultations} consultas</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Faturamento Bruto Gerado:</span>
                    <strong className="text-white">{formatCurrencyBRL(comm.grossRevenue)}</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Taxa de Repasse / Split:</span>
                    <strong className="text-purple-300">{(comm.commissionRate * 100).toFixed(0)}%</strong>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <span className="font-bold text-slate-200">Valor Líquido a Pagar:</span>
                    <span className="text-base font-black text-emerald-400">
                      {formatCurrencyBRL(comm.commissionAmount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status & Ação */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span
                  className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${
                    isPaid
                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                  }`}
                >
                  {isPaid ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                  {isPaid ? 'Repasse Efetuado' : 'Aguardando Pagamento'}
                </span>

                {!isPaid ? (
                  <button
                    type="button"
                    onClick={() => handlePay(comm.id, comm.professionalName)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                  >
                    Efetuar Repasse Pix
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setToastMessage(`Extrato de repasse gerado para ${comm.professionalName}!`);
                      setTimeout(() => setToastMessage(null), 3000);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-bold transition-all border border-slate-700 flex items-center gap-1 cursor-pointer"
                  >
                    <FileCheck className="w-3.5 h-3.5 text-purple-400" />
                    Comprovante
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
