import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  CreditCard,
  QrCode,
  Users,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Wallet,
  Clock,
  FileSpreadsheet,
  FileCheck
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  FinancialSummaryMetrics,
  MONTHLY_FINANCIAL_HISTORY,
  FinancialTransaction,
  BankAccount,
  formatCurrencyBRL
} from '../../data/financialData';

interface CashflowDashboardProps {
  metrics: FinancialSummaryMetrics;
  transactions: FinancialTransaction[];
  bankAccounts: BankAccount[];
  onOpenNewTransaction: (type: 'income' | 'expense') => void;
  onNavigateTab: (tab: any) => void;
}

const CATEGORY_COLORS = ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b', '#ec4899', '#6366f1'];

export const CashflowDashboard: React.FC<CashflowDashboardProps> = ({
  metrics,
  transactions,
  bankAccounts,
  onOpenNewTransaction,
  onNavigateTab
}) => {
  // Distribuição de Receitas por Categoria
  const incomeCategoryData = React.useMemo(() => {
    const paidIncomes = transactions.filter(t => t.type === 'income' && t.status === 'paid');
    const categoryMap: { [key: string]: number } = {};
    paidIncomes.forEach(t => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
    });
    return Object.keys(categoryMap).map(cat => ({
      name: cat,
      value: categoryMap[cat]
    }));
  }, [transactions]);

  // Contas a Receber Próximos 7 dias
  const pendingIncomes = transactions
    .filter(t => t.type === 'income' && (t.status === 'pending' || t.status === 'overdue'))
    .slice(0, 4);

  return (
    <div className="space-y-6">
      {/* 1. KPIs Consolidados de Alta Fidelidade Clínica */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Faturamento Bruto */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4.5 space-y-2 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Receita Realizada (Mês)</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="text-2xl font-black text-white font-mono tracking-tight">
              {formatCurrencyBRL(metrics.totalPaidIncome)}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+18.4% vs mês anterior</span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>A Receber: {formatCurrencyBRL(metrics.totalPendingIncome)}</span>
            <span className="text-emerald-400 font-semibold cursor-pointer hover:underline" onClick={() => onNavigateTab('receitas')}>
              Ver todas →
            </span>
          </div>
        </div>

        {/* KPI 2: Lucro Líquido & Margem */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4.5 space-y-2 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Lucro Operacional Líquido</span>
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="text-2xl font-black text-white font-mono tracking-tight">
              {formatCurrencyBRL(metrics.netProfit)}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-teal-400">
              <span>Margem Líquida: <strong>{metrics.netMarginPercentage.toFixed(1)}%</strong></span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Despesas: {formatCurrencyBRL(metrics.totalExpenses)}</span>
            <span className="text-teal-400 font-semibold cursor-pointer hover:underline" onClick={() => onNavigateTab('dre')}>
              DRE Gerencial →
            </span>
          </div>
        </div>

        {/* KPI 3: Saldo Bancário Consolidado */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4.5 space-y-2 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Saldo Consolidado (Contas)</span>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="text-2xl font-black text-white font-mono tracking-tight">
              {formatCurrencyBRL(metrics.totalConsolidatedBalance)}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-sky-400">
              <Building2 className="w-3.5 h-3.5" />
              <span>{bankAccounts.length} contas bancárias ativas</span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Itaú PJ + Nubank + Asaas</span>
            <span className="text-sky-400 font-semibold cursor-pointer hover:underline" onClick={() => onNavigateTab('contas')}>
              Conciliação →
            </span>
          </div>
        </div>

        {/* KPI 4: Recorrência MRR & Ticket Médio */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4.5 space-y-2 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">MRR (Clubes & Planos)</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="text-2xl font-black text-white font-mono tracking-tight">
              {formatCurrencyBRL(metrics.mrr)}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-purple-400">
              <span>Ticket Médio: <strong>{formatCurrencyBRL(metrics.averageTicket)}</strong></span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Inadimplência: {metrics.defaultRatePercentage.toFixed(1)}%</span>
            <span className="text-purple-400 font-semibold cursor-pointer hover:underline" onClick={() => onNavigateTab('assinaturas')}>
              Assinaturas →
            </span>
          </div>
        </div>
      </div>

      {/* 2. Atalhos de Ação Rápida Financeira */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-300">Ações Rápidas:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onOpenNewTransaction('income')}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            + Nova Receita
          </button>
          <button
            type="button"
            onClick={() => onOpenNewTransaction('expense')}
            className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <TrendingDown className="w-3.5 h-3.5" />
            + Nova Despesa
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab('cobranca')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 flex items-center gap-1.5 cursor-pointer"
          >
            <QrCode className="w-3.5 h-3.5 text-sky-400" />
            Cobrança Pix & WhatsApp
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab('recibos')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 flex items-center gap-1.5 cursor-pointer"
          >
            <FileCheck className="w-3.5 h-3.5 text-purple-400" />
            Emitir Recibo IRPF / DMED
          </button>
        </div>
      </div>

      {/* 3. Gráficos de Evolução Financeira & Projeção */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Gráfico 1: Histórico de Receitas x Despesas x Lucro (8 Colunas) */}
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Fluxo de Caixa Mensal & Lucratividade (R$)
              </h3>
              <p className="text-xs text-slate-400">
                Comparativo de Entradas, Saídas e Lucro Operacional Líquido por mês.
              </p>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-mono">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Receitas
              </span>
              <span className="flex items-center gap-1.5 text-rose-400">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Despesas
              </span>
              <span className="flex items-center gap-1.5 text-teal-300">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-400" /> Lucro
              </span>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={MONTHLY_FINANCIAL_HISTORY} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="mes" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis
                  stroke="#64748b"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(val) => `R$${val / 1000}k`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  formatter={(value: any) => [formatCurrencyBRL(Number(value)), '']}
                />
                <Bar dataKey="receitas" name="Receitas" fill="#10b981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="despesas" name="Despesas" fill="#f43f5e" radius={[6, 6, 0, 0]} />
                <Line type="monotone" dataKey="lucro" name="Lucro Líquido" stroke="#2dd4bf" strokeWidth={3} dot={{ r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico 2: Composição da Receita por Categoria (4 Colunas) */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-purple-400" />
              Fontes de Faturamento
            </h3>
            <p className="text-xs text-slate-400">
              Distribuição percentual por tipo de serviço.
            </p>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={incomeCategoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {incomeCategoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  formatter={(value: any) => [formatCurrencyBRL(Number(value)), 'Total']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legenda Estruturada */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800/80 text-[11px]">
            {incomeCategoryData.map((cat, idx) => (
              <div key={cat.name} className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5 truncate">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: CATEGORY_COLORS[idx % CATEGORY_COLORS.length] }}
                  />
                  <span className="truncate">{cat.name}</span>
                </span>
                <strong className="font-mono text-white shrink-0">
                  {formatCurrencyBRL(cat.value)}
                </strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Previsão de Entradas & Contas a Receber (Próximos Vencimentos) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-extrabold text-white">
              Próximos Vencimentos & Faturas Pendentes
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('cobranca')}
            className="text-xs font-semibold text-emerald-400 hover:underline cursor-pointer"
          >
            Abrir Régua de Cobrança →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {pendingIncomes.map((t) => (
            <div
              key={t.id}
              className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2 hover:border-slate-700 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-bold text-white truncate">
                  {t.patientName || t.description}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  Pendente
                </span>
              </div>
              <div className="text-base font-black text-emerald-400 font-mono">
                {formatCurrencyBRL(t.amount)}
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/60 font-mono">
                <span>Vence: {t.dueDate}</span>
                <span>{t.paymentMethod.toUpperCase()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
