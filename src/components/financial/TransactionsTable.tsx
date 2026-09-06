import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  Printer,
  Download,
  FileCheck,
  QrCode,
  Edit,
  Trash2,
  X,
  Layers,
  Calendar,
  DollarSign,
  User,
  Building2,
  CreditCard,
  FileText
} from 'lucide-react';
import {
  FinancialTransaction,
  BankAccount,
  PaymentMethod,
  TransactionType,
  TransactionStatus,
  formatCurrencyBRL,
  formatDateBR
} from '../../data/financialData';

interface TransactionsTableProps {
  transactions: FinancialTransaction[];
  bankAccounts: BankAccount[];
  filterType?: 'all' | 'income' | 'expense';
  onAddTransaction: (newTx: Omit<FinancialTransaction, 'id'>) => void;
  onUpdateStatus: (id: string, status: TransactionStatus) => void;
  onOpenReceiptModal: (transaction: FinancialTransaction) => void;
  onOpenPixModal: (transaction: FinancialTransaction) => void;
}

export const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
  bankAccounts,
  filterType = 'all',
  onAddTransaction,
  onUpdateStatus,
  onOpenReceiptModal,
  onOpenPixModal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isNewTxModalOpen, setIsNewTxModalOpen] = useState(false);

  // Form State for New Transaction
  const [newTxType, setNewTxType] = useState<TransactionType>(filterType === 'expense' ? 'expense' : 'income');
  const [newTxDesc, setNewTxDesc] = useState('');
  const [newTxCategory, setNewTxCategory] = useState('Consultas Avulsas');
  const [newTxAmount, setNewTxAmount] = useState<number>(350);
  const [newTxDate, setNewTxDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTxDueDate, setNewTxDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTxPaymentMethod, setNewTxPaymentMethod] = useState<PaymentMethod>('pix');
  const [newTxStatus, setNewTxStatus] = useState<TransactionStatus>('paid');
  const [newTxPatientName, setNewTxPatientName] = useState('');
  const [newTxProfessionalName, setNewTxProfessionalName] = useState('Dra. Luiza Valente');
  const [newTxBankAccountId, setNewTxBankAccountId] = useState(bankAccounts[0]?.id || 'bank-itau-pj');
  const [newTxNotes, setNewTxNotes] = useState('');

  // Categories lists
  const incomeCategories = [
    'Consultas Avulsas',
    'Planos & Pacotes',
    'Assinaturas Recorrentes',
    'Venda de Suplementos / Estoque',
    'Consultoria & Cursos',
    'Outras Receitas'
  ];

  const expenseCategories = [
    'Infraestrutura & Aluguel',
    'Softwares & Tecnologia',
    'Impostos & Tributos',
    'Repasse de Comissões',
    'Compra de Estoque & Insumos',
    'Marketing & Captação',
    'Equipamentos & Manutenção',
    'Despesas Administrativas'
  ];

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesType = filterType === 'all' || t.type === filterType;
      const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !q ||
        t.description.toLowerCase().includes(q) ||
        (t.patientName && t.patientName.toLowerCase().includes(q)) ||
        t.professionalName.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q);

      return matchesType && matchesStatus && matchesCategory && matchesSearch;
    });
  }, [transactions, filterType, statusFilter, categoryFilter, searchTerm]);

  const handleCreateTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTxDesc.trim() || newTxAmount <= 0) return;

    const selectedBank = bankAccounts.find(b => b.id === newTxBankAccountId) || bankAccounts[0];

    onAddTransaction({
      date: newTxDate,
      dueDate: newTxDueDate,
      description: newTxDesc,
      type: newTxType,
      category: newTxCategory,
      amount: Number(newTxAmount),
      paymentMethod: newTxPaymentMethod,
      status: newTxStatus,
      patientName: newTxPatientName || undefined,
      professionalName: newTxProfessionalName,
      professionalId: 'prof-01',
      unitId: 'unit-jardins',
      unitName: 'Matriz Jardins',
      bankAccountId: selectedBank.id,
      bankAccountName: selectedBank.bankName,
      receiptIssued: newTxType === 'income' && newTxStatus === 'paid',
      receiptNumber: newTxType === 'income' ? `REC-2026-${Math.floor(1000 + Math.random() * 9000)}` : undefined,
      notes: newTxNotes
    });

    setIsNewTxModalOpen(false);
    // Reset Form
    setNewTxDesc('');
    setNewTxAmount(350);
    setNewTxPatientName('');
    setNewTxNotes('');
  };

  const getStatusBadge = (status: TransactionStatus) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Pago
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
            <Clock className="w-3 h-3 text-amber-400" /> Pendente
          </span>
        );
      case 'overdue':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-300 border border-rose-500/20">
            <AlertCircle className="w-3 h-3 text-rose-400" /> Vencido
          </span>
        );
      case 'cancelled':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
            Cancelado
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Barra de Filtros e Busca */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Campo de Busca */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar paciente, descrição, categoria..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-700/80 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          {/* Filtro de Status */}
          <select
            value={statusFilter}
            onChange={(e: any) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-950 border border-slate-700/80 rounded-xl text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="all">Todos os Status</option>
            <option value="paid">Pagos / Baixados</option>
            <option value="pending">Pendentes</option>
            <option value="overdue">Vencidos</option>
          </select>
        </div>

        {/* Botão Novo Lançamento */}
        <button
          type="button"
          onClick={() => {
            setNewTxType(filterType === 'expense' ? 'expense' : 'income');
            setNewTxCategory(filterType === 'expense' ? expenseCategories[0] : incomeCategories[0]);
            setIsNewTxModalOpen(true);
          }}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          {filterType === 'expense' ? 'Nova Despesa' : filterType === 'income' ? 'Nova Receita' : 'Novo Lançamento'}
        </button>
      </div>

      {/* Tabela de Lançamentos */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] tracking-wider">
                <th className="py-3 px-4">Data / Venc.</th>
                <th className="py-3 px-4">Descrição & Paciente</th>
                <th className="py-3 px-4">Categoria / Conta</th>
                <th className="py-3 px-4">Profissional</th>
                <th className="py-3 px-4">Forma</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Valor (R$)</th>
                <th className="py-3 px-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredTransactions.map((tx) => {
                const isIncome = tx.type === 'income';
                return (
                  <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Data */}
                    <td className="py-3.5 px-4 font-mono text-[11px] whitespace-nowrap">
                      <div className="text-white font-semibold">{formatDateBR(tx.date)}</div>
                      {tx.dueDate !== tx.date && (
                        <div className="text-[10px] text-slate-500">Venc: {formatDateBR(tx.dueDate)}</div>
                      )}
                    </td>

                    {/* Descrição & Paciente */}
                    <td className="py-3.5 px-4 max-w-[280px]">
                      <div className="flex items-center gap-2">
                        <div
                          className={`p-1.5 rounded-lg shrink-0 ${
                            isIncome
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {isIncome ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-white truncate" title={tx.description}>
                            {tx.description}
                          </div>
                          {tx.patientName && (
                            <div className="text-[11px] text-slate-400 flex items-center gap-1 truncate">
                              <User className="w-3 h-3 text-slate-500" />
                              <span>{tx.patientName}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Categoria & Conta */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-semibold text-slate-200 block truncate max-w-[160px]">
                        {tx.category}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-slate-500" />
                        {tx.bankAccountName}
                      </span>
                    </td>

                    {/* Profissional */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-300">
                      {tx.professionalName}
                    </td>

                    {/* Forma de Pagamento */}
                    <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px]">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {tx.paymentMethod.toUpperCase()}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getStatusBadge(tx.status)}
                    </td>

                    {/* Valor R$ (Alinhado à Direita) */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-right font-mono font-black text-sm">
                      <span className={isIncome ? 'text-emerald-400' : 'text-rose-400'}>
                        {isIncome ? '+' : '-'} {formatCurrencyBRL(tx.amount)}
                      </span>
                    </td>

                    {/* Ações */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* Baixar / Alternar Status */}
                        {tx.status !== 'paid' ? (
                          <button
                            type="button"
                            onClick={() => onUpdateStatus(tx.id, 'paid')}
                            title="Marcar como Pago"
                            className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 transition-colors cursor-pointer"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onUpdateStatus(tx.id, 'pending')}
                            title="Desfazer Baixa"
                            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                          >
                            <Clock className="w-4 h-4" />
                          </button>
                        )}

                        {/* Recibo IRPF / DMED */}
                        {isIncome && (
                          <button
                            type="button"
                            onClick={() => onOpenReceiptModal(tx)}
                            title="Emitir Recibo IRPF / DMED"
                            className="p-1.5 rounded-lg bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 transition-colors cursor-pointer"
                          >
                            <FileCheck className="w-4 h-4" />
                          </button>
                        )}

                        {/* Cobrança Pix */}
                        {isIncome && tx.status !== 'paid' && (
                          <button
                            type="button"
                            onClick={() => onOpenPixModal(tx)}
                            title="Gerar Cobrança Pix & WhatsApp"
                            className="p-1.5 rounded-lg bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 transition-colors cursor-pointer"
                          >
                            <QrCode className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    Nenhum lançamento financeiro encontrado com os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Novo Lançamento (Receita ou Despesa) */}
      {isNewTxModalOpen && (
        <div
          id="modal-novo-lancamento-financeiro"
          className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-150"
        >
          <div
            className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden text-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
              <div className="flex items-center gap-2.5">
                <div
                  className={`p-2 rounded-xl ${
                    newTxType === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                  }`}
                >
                  {newTxType === 'income' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                </div>
                <h3 className="text-base font-extrabold text-white">
                  {newTxType === 'income' ? 'Lançar Nova Receita' : 'Lançar Nova Despesa'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewTxModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTransaction} className="p-6 space-y-4 text-xs">
              {/* Seletor de Tipo (Receita vs Despesa) */}
              <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-950 border border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setNewTxType('income');
                    setNewTxCategory(incomeCategories[0]);
                  }}
                  className={`py-2 rounded-lg font-bold transition-all cursor-pointer ${
                    newTxType === 'income' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  + Receita / Entrada
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNewTxType('expense');
                    setNewTxCategory(expenseCategories[0]);
                  }}
                  className={`py-2 rounded-lg font-bold transition-all cursor-pointer ${
                    newTxType === 'expense' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  - Despesa / Saída
                </button>
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Descrição do Lançamento *</label>
                <input
                  type="text"
                  required
                  value={newTxDesc}
                  onChange={(e) => setNewTxDesc(e.target.value)}
                  placeholder="Ex: Consulta Nutricional, Compra de Suplementos, Aluguel..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Valor & Categoria */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Valor (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={newTxAmount}
                    onChange={(e) => setNewTxAmount(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Categoria *</label>
                  <select
                    value={newTxCategory}
                    onChange={(e) => setNewTxCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none cursor-pointer"
                  >
                    {(newTxType === 'income' ? incomeCategories : expenseCategories).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Paciente (Opcional se Receita) & Profissional */}
              <div className="grid grid-cols-2 gap-3">
                {newTxType === 'income' ? (
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Paciente (Opcional)</label>
                    <input
                      type="text"
                      value={newTxPatientName}
                      onChange={(e) => setNewTxPatientName(e.target.value)}
                      placeholder="Nome do paciente"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Fornecedor / Favorecido</label>
                    <input
                      type="text"
                      value={newTxPatientName}
                      onChange={(e) => setNewTxPatientName(e.target.value)}
                      placeholder="Ex: Imobiliária, Fornecedor..."
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Profissional / Responsável</label>
                  <select
                    value={newTxProfessionalName}
                    onChange={(e) => setNewTxProfessionalName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none cursor-pointer"
                  >
                    <option value="Dra. Luiza Valente">Dra. Luiza Valente</option>
                    <option value="Dr. Thiago Siqueira">Dr. Thiago Siqueira</option>
                    <option value="Dra. Fernanda Albuquerque">Dra. Fernanda Albuquerque</option>
                    <option value="Administração Geral">Administração Geral</option>
                  </select>
                </div>
              </div>

              {/* Forma de Pagamento & Conta Bancária */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Forma de Pagamento</label>
                  <select
                    value={newTxPaymentMethod}
                    onChange={(e: any) => setNewTxPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none cursor-pointer"
                  >
                    <option value="pix">Pix Instantâneo</option>
                    <option value="credit_card">Cartão de Crédito</option>
                    <option value="debit_card">Cartão de Débito</option>
                    <option value="boleto">Boleto Bancário</option>
                    <option value="bank_transfer">Transferência / TED</option>
                    <option value="cash">Dinheiro / Espécie</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Conta Bancária de Destino</label>
                  <select
                    value={newTxBankAccountId}
                    onChange={(e) => setNewTxBankAccountId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none cursor-pointer"
                  >
                    {bankAccounts.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.bankName} (Saldo: {formatCurrencyBRL(b.balance)})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Data & Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Data de Lançamento</label>
                  <input
                    type="date"
                    value={newTxDate}
                    onChange={(e) => setNewTxDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Status do Pagamento</label>
                  <select
                    value={newTxStatus}
                    onChange={(e: any) => setNewTxStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none cursor-pointer"
                  >
                    <option value="paid">Pago / Concluído</option>
                    <option value="pending">Pendente (A receber / A pagar)</option>
                  </select>
                </div>
              </div>

              {/* Rodapé do Form */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewTxModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold transition-all shadow-md cursor-pointer"
                >
                  Salvar Lançamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
