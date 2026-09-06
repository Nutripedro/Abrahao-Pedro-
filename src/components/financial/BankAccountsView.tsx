import React, { useState } from 'react';
import {
  Building2,
  Wallet,
  QrCode,
  CheckCircle2,
  RefreshCw,
  Plus,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Layers,
  Sparkles,
  Upload,
  FileSpreadsheet
} from 'lucide-react';
import {
  BankAccount,
  formatCurrencyBRL,
  formatDateBR
} from '../../data/financialData';

interface BankAccountsViewProps {
  bankAccounts: BankAccount[];
  onReconcile: (accountId: string) => void;
}

export const BankAccountsView: React.FC<BankAccountsViewProps> = ({
  bankAccounts,
  onReconcile
}) => {
  const [reconcilingId, setReconcilingId] = useState<string | null>(null);
  const [reconciledAccounts, setReconciledAccounts] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSimulateReconciliation = (id: string, bankName: string) => {
    setReconcilingId(id);
    setTimeout(() => {
      setReconcilingId(null);
      setReconciledAccounts(prev => [...prev, id]);
      onReconcile(id);
      setToastMessage(`Conta ${bankName} conciliada com 100% de precisão fiscal!`);
      setTimeout(() => setToastMessage(null), 3500);
    }, 1200);
  };

  const totalBalance = bankAccounts.reduce((sum, b) => sum + b.balance, 0);

  return (
    <div className="space-y-6">
      {/* Toast de Notificação */}
      {toastMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/90 border border-emerald-500/80 text-emerald-200 text-xs font-bold flex items-center gap-2 shadow-lg animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* Header com Saldo Total Consolidado */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Building2 className="w-5 h-5" />
            </div>
            <h2 className="text-base font-extrabold text-white">
              Gestão de Contas Bancárias & Conciliação
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Acompanhamento integrado de saldo real, chaves Pix e conciliação de extratos bancários.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-950/80 px-4 py-2.5 rounded-2xl border border-slate-800">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Saldo Total em Caixa & Bancos</span>
            <span className="text-lg font-black text-emerald-400 font-mono">
              {formatCurrencyBRL(totalBalance)}
            </span>
          </div>
        </div>
      </div>

      {/* Grid de Contas Bancárias */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bankAccounts.map((acc) => {
          const isReconciled = reconciledAccounts.includes(acc.id);
          const isProcessing = reconcilingId === acc.id;

          return (
            <div
              key={acc.id}
              className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-sm hover:border-slate-700 transition-all relative overflow-hidden"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-slate-800 border border-slate-700 text-slate-200">
                    <Wallet className="w-5 h-5 text-sky-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white">{acc.bankName}</h3>
                      {acc.isDefault && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                          Principal
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400">{acc.accountType}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Saldo Atual</span>
                  <span className="text-lg font-black text-white font-mono">
                    {formatCurrencyBRL(acc.balance)}
                  </span>
                </div>
              </div>

              {/* Detalhes de Agência, Conta e Chave Pix */}
              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 grid grid-cols-2 gap-2 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-500 block">Agência / Conta</span>
                  <span className="text-slate-200 font-semibold">{acc.agency} / {acc.accountNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Chave Pix</span>
                  <span className="text-sky-300 truncate block font-sans text-[11px]" title={acc.pixKey}>
                    {acc.pixKey}
                  </span>
                </div>
              </div>

              {/* Status de Conciliação e Ação */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Última Conciliação: {formatDateBR(acc.lastReconciliation)}
                </span>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleSimulateReconciliation(acc.id, acc.bankName)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                    isReconciled
                      ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  }`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin text-sky-400' : ''}`} />
                  {isProcessing ? 'Conciliando...' : isReconciled ? 'Conciliado 100%' : 'Conciliar Extrato'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Caixa de Importação OFX / Extrato CSV */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mx-auto">
          <Upload className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-white">Importar Extrato Bancário (OFX / CSV)</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Faça o upload do extrato fornecido pelo seu Internet Banking para conciliação automática com cruzamento de pagamentos.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setToastMessage('Importador OFX preparado! Selecione o arquivo do seu banco.');
            setTimeout(() => setToastMessage(null), 3000);
          }}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-bold transition-all border border-slate-700 inline-flex items-center gap-2 cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          Selecionar Arquivo .OFX ou .CSV
        </button>
      </div>
    </div>
  );
};
