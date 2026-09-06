import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  FileSpreadsheet,
  Building2,
  Users,
  QrCode,
  Award,
  FileCheck,
  Sparkles,
  Zap,
  CheckCircle2,
  Sliders,
  Plus,
  RefreshCw,
  ShieldCheck,
  ArrowRight,
  Filter
} from 'lucide-react';
import {
  FINANCIAL_MASTER_FEATURES,
  FinancialMasterFeature,
  MOCK_FINANCIAL_TRANSACTIONS,
  MOCK_BANK_ACCOUNTS,
  MOCK_RECURRING_SUBSCRIPTIONS,
  MOCK_COMMISSIONS,
  FinancialTransaction,
  BankAccount,
  RecurringSubscription,
  ProfessionalCommission,
  TransactionStatus,
  calculateFinancialSummary,
  getFinancialFeatureStatus,
  setFinancialFeatureStatus,
  activateAllFinancialFeatures,
  formatCurrencyBRL
} from '../data/financialData';

import { CashflowDashboard } from '../components/financial/CashflowDashboard';
import { TransactionsTable } from '../components/financial/TransactionsTable';
import { DreStatementView } from '../components/financial/DreStatementView';
import { BankAccountsView } from '../components/financial/BankAccountsView';
import { CommissionsView } from '../components/financial/CommissionsView';
import { SubscriptionsView } from '../components/financial/SubscriptionsView';
import { SmartBillingPixModal } from '../components/financial/SmartBillingPixModal';
import { ReceiptDmedModal } from '../components/financial/ReceiptDmedModal';
import { FinancialFeaturesModal } from '../components/financial/FinancialFeaturesModal';

export type FinancialTab =
  | 'visao'
  | 'receitas'
  | 'despesas'
  | 'dre'
  | 'contas'
  | 'comissoes'
  | 'cobranca'
  | 'assinaturas'
  | 'recibos';

interface FinancialPageProps {
  initialTab?: FinancialTab;
}

export const FinancialPage: React.FC<FinancialPageProps> = ({ initialTab = 'visao' }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Determina aba a partir da URL se aplicável
  const currentTabFromUrl = useMemo((): FinancialTab => {
    const pathname = location.pathname.toLowerCase();
    if (pathname.includes('/receitas')) return 'receitas';
    if (pathname.includes('/despesas')) return 'despesas';
    if (pathname.includes('/dre')) return 'dre';
    if (pathname.includes('/contas')) return 'contas';
    if (pathname.includes('/comissoes')) return 'comissoes';
    if (pathname.includes('/cobranca')) return 'cobranca';
    if (pathname.includes('/assinaturas')) return 'assinaturas';
    if (pathname.includes('/recibos')) return 'recibos';
    if (pathname.includes('/visao')) return 'visao';
    return (initialTab as FinancialTab) || 'visao';
  }, [location.pathname, initialTab]);

  const [activeTab, setActiveTab] = useState<FinancialTab>(currentTabFromUrl);

  useEffect(() => {
    setActiveTab(currentTabFromUrl);
  }, [currentTabFromUrl]);

  // Estados dos Dados Financeiros
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(MOCK_FINANCIAL_TRANSACTIONS);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(MOCK_BANK_ACCOUNTS);
  const [subscriptions, setSubscriptions] = useState<RecurringSubscription[]>(MOCK_RECURRING_SUBSCRIPTIONS);
  const [commissions, setCommissions] = useState<ProfessionalCommission[]>(MOCK_COMMISSIONS);

  // Estados dos Recursos Master (10/10)
  const [features, setFeatures] = useState<FinancialMasterFeature[]>(() => {
    return FINANCIAL_MASTER_FEATURES.map(f => ({
      ...f,
      isActive: getFinancialFeatureStatus(f.id)
    }));
  });

  const [isFeaturesModalOpen, setIsFeaturesModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modais de Ação Específica
  const [selectedTxForReceipt, setSelectedTxForReceipt] = useState<FinancialTransaction | null>(null);
  const [selectedTxForPix, setSelectedTxForPix] = useState<FinancialTransaction | null>(null);

  // Cálculos consolidados do resumo
  const summaryMetrics = useMemo(() => {
    return calculateFinancialSummary(transactions, bankAccounts, subscriptions);
  }, [transactions, bankAccounts, subscriptions]);

  const activeFeaturesCount = features.filter(f => f.isActive).length;
  const totalFeaturesCount = features.length;
  const allFeaturesActive = activeFeaturesCount === totalFeaturesCount;

  // Handlers
  const handleToggleFeature = (id: string) => {
    setFeatures(prev => {
      const updated = prev.map(f => (f.id === id ? { ...f, isActive: !f.isActive } : f));
      const target = updated.find(f => f.id === id);
      if (target) {
        setFinancialFeatureStatus(id, target.isActive);
      }
      return updated;
    });
  };

  const handleActivateAll = () => {
    activateAllFinancialFeatures();
    setFeatures(prev => prev.map(f => ({ ...f, isActive: true })));
    setToastMessage('Sucesso! Todas as 10 Funções Financeiras e de DRE foram ativadas com 100% de conformidade!');
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleAddTransaction = (newTx: Omit<FinancialTransaction, 'id'>) => {
    const created: FinancialTransaction = {
      ...newTx,
      id: `tr-${Date.now()}`
    };
    setTransactions(prev => [created, ...prev]);

    // Atualiza saldo bancário se pago
    if (created.status === 'paid') {
      setBankAccounts(prev =>
        prev.map(b => {
          if (b.id === created.bankAccountId) {
            const diff = created.type === 'income' ? created.amount : -created.amount;
            return { ...b, balance: b.balance + diff };
          }
          return b;
        })
      );
    }

    setToastMessage(
      `${created.type === 'income' ? 'Receita' : 'Despesa'} de ${formatCurrencyBRL(created.amount)} lançada com sucesso!`
    );
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleUpdateStatus = (id: string, newStatus: TransactionStatus) => {
    setTransactions(prev => {
      return prev.map(t => {
        if (t.id === id) {
          const oldStatus = t.status;
          // Se mudou de pending para paid, atualiza conta
          if (oldStatus !== 'paid' && newStatus === 'paid') {
            setBankAccounts(banks =>
              banks.map(b => (b.id === t.bankAccountId ? { ...b, balance: b.balance + (t.type === 'income' ? t.amount : -t.amount) } : b))
            );
          }
          return { ...t, status: newStatus };
        }
        return t;
      });
    });
    setToastMessage(`Status do lançamento atualizado para ${newStatus === 'paid' ? 'Pago' : 'Pendente'}!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleReconcileAccount = (accountId: string) => {
    setBankAccounts(prev =>
      prev.map(b => (b.id === accountId ? { ...b, lastReconciliation: new Date().toISOString().split('T')[0] } : b))
    );
  };

  const tabsConfig = [
    { id: 'visao', label: 'Visão Geral & Fluxo', icon: TrendingUp },
    { id: 'receitas', label: 'Receitas & Faturamento', icon: DollarSign, badge: transactions.filter(t => t.type === 'income').length },
    { id: 'despesas', label: 'Despesas & Custos', icon: TrendingDown, badge: transactions.filter(t => t.type === 'expense').length },
    { id: 'dre', label: 'DRE Gerencial', icon: FileSpreadsheet },
    { id: 'contas', label: 'Contas & Conciliação', icon: Building2 },
    { id: 'comissoes', label: 'Comissões & Repasses', icon: Users },
    { id: 'cobranca', label: 'Cobrança Pix & Régua', icon: QrCode },
    { id: 'assinaturas', label: 'Assinaturas (MRR)', icon: Award },
    { id: 'recibos', label: 'Recibos IRPF / DMED', icon: FileCheck }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Toast Notifier */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-[150] p-4 rounded-2xl bg-emerald-950/95 border border-emerald-500/80 text-emerald-200 text-xs font-bold flex items-center gap-2.5 shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header Principal com Status das Funções Master */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/90">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Gestão Financeira & DRE Clínico
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-extrabold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              {activeFeaturesCount}/{totalFeaturesCount} Funções Ativas
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Fluxo de caixa em tempo real, demonstrativo DRE, cobrança Pix automatizada e emissão de recibos DMED/CFN.
          </p>
        </div>

        {/* Botão Master: ATIVAR TODAS AS FUNÇÕES (10/10) */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsFeaturesModalOpen(true)}
            className="px-3.5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sliders className="w-4 h-4 text-slate-400" />
            Configurar Funções
          </button>

          <button
            type="button"
            onClick={handleActivateAll}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all shadow-lg cursor-pointer ${
              allFeaturesActive
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-600/60'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40 hover:scale-[1.02]'
            }`}
          >
            {allFeaturesActive ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                100% Ativado (10/10)
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-current" />
                ATIVAR TODAS AS FUNÇÕES
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Barra de Navegação por Abas Especializadas */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800/80">
        {tabsConfig.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id as FinancialTab);
                navigate(`/financeiro/${tab.id === 'visao' ? '' : tab.id}`, { replace: true });
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                  : 'bg-slate-900/60 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                    isActive ? 'bg-emerald-800 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 3. Conteúdo da Aba Ativa */}
      <div className="animate-in fade-in duration-150">
        {activeTab === 'visao' && (
          <CashflowDashboard
            metrics={summaryMetrics}
            transactions={transactions}
            bankAccounts={bankAccounts}
            onOpenNewTransaction={(type) => {
              setActiveTab(type === 'income' ? 'receitas' : 'despesas');
            }}
            onNavigateTab={(tab) => {
              setActiveTab(tab);
              navigate(`/financeiro/${tab === 'visao' ? '' : tab}`, { replace: true });
            }}
          />
        )}

        {activeTab === 'receitas' && (
          <div className="space-y-4">
            <div className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                  Receitas & Faturamento Clínico
                </h2>
                <p className="text-xs text-slate-400">
                  Total Realizado: <strong className="text-emerald-400 font-mono">{formatCurrencyBRL(summaryMetrics.totalPaidIncome)}</strong> • A Receber: <strong className="text-amber-400 font-mono">{formatCurrencyBRL(summaryMetrics.totalPendingIncome)}</strong>
                </p>
              </div>
            </div>

            <TransactionsTable
              transactions={transactions}
              bankAccounts={bankAccounts}
              filterType="income"
              onAddTransaction={handleAddTransaction}
              onUpdateStatus={handleUpdateStatus}
              onOpenReceiptModal={(tx) => setSelectedTxForReceipt(tx)}
              onOpenPixModal={(tx) => setSelectedTxForPix(tx)}
            />
          </div>
        )}

        {activeTab === 'despesas' && (
          <div className="space-y-4">
            <div className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-rose-400" />
                  Despesas, Custos Fixos & Fornecedores
                </h2>
                <p className="text-xs text-slate-400">
                  Total Pago: <strong className="text-rose-400 font-mono">{formatCurrencyBRL(summaryMetrics.totalExpenses)}</strong>
                </p>
              </div>
            </div>

            <TransactionsTable
              transactions={transactions}
              bankAccounts={bankAccounts}
              filterType="expense"
              onAddTransaction={handleAddTransaction}
              onUpdateStatus={handleUpdateStatus}
              onOpenReceiptModal={(tx) => setSelectedTxForReceipt(tx)}
              onOpenPixModal={(tx) => setSelectedTxForPix(tx)}
            />
          </div>
        )}

        {activeTab === 'dre' && (
          <DreStatementView transactions={transactions} />
        )}

        {activeTab === 'contas' && (
          <BankAccountsView
            bankAccounts={bankAccounts}
            onReconcile={handleReconcileAccount}
          />
        )}

        {activeTab === 'comissoes' && (
          <CommissionsView commissions={commissions} />
        )}

        {activeTab === 'cobranca' && (
          <div className="space-y-4">
            <div className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800">
              <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                <QrCode className="w-5 h-5 text-sky-400" />
                Régua de Cobrança Inteligente & Pix Dinâmico
              </h2>
              <p className="text-xs text-slate-400">
                Selecione qualquer fatura pendente abaixo para gerar o QR Code Pix com notificação via WhatsApp.
              </p>
            </div>

            <TransactionsTable
              transactions={transactions.filter(t => t.type === 'income' && t.status !== 'paid')}
              bankAccounts={bankAccounts}
              filterType="income"
              onAddTransaction={handleAddTransaction}
              onUpdateStatus={handleUpdateStatus}
              onOpenReceiptModal={(tx) => setSelectedTxForReceipt(tx)}
              onOpenPixModal={(tx) => setSelectedTxForPix(tx)}
            />
          </div>
        )}

        {activeTab === 'assinaturas' && (
          <SubscriptionsView subscriptions={subscriptions} />
        )}

        {activeTab === 'recibos' && (
          <div className="space-y-4">
            <div className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800">
              <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-purple-400" />
                Emissor de Recibos para IRPF (DMED / CFN)
              </h2>
              <p className="text-xs text-slate-400">
                Clique no ícone de recibo em qualquer atendimento pago para pré-visualizar e imprimir o documento fiscal oficial.
              </p>
            </div>

            <TransactionsTable
              transactions={transactions.filter(t => t.type === 'income' && t.status === 'paid')}
              bankAccounts={bankAccounts}
              filterType="income"
              onAddTransaction={handleAddTransaction}
              onUpdateStatus={handleUpdateStatus}
              onOpenReceiptModal={(tx) => setSelectedTxForReceipt(tx)}
              onOpenPixModal={(tx) => setSelectedTxForPix(tx)}
            />
          </div>
        )}
      </div>

      {/* 4. Modais Integrados */}
      <FinancialFeaturesModal
        isOpen={isFeaturesModalOpen}
        onClose={() => setIsFeaturesModalOpen(false)}
        features={features}
        onToggleFeature={handleToggleFeature}
        onActivateAll={handleActivateAll}
      />

      <SmartBillingPixModal
        isOpen={!!selectedTxForPix}
        onClose={() => setSelectedTxForPix(null)}
        transaction={selectedTxForPix}
        onMarkPaid={(id) => handleUpdateStatus(id, 'paid')}
      />

      <ReceiptDmedModal
        isOpen={!!selectedTxForReceipt}
        onClose={() => setSelectedTxForReceipt(null)}
        transaction={selectedTxForReceipt}
      />
    </div>
  );
};
