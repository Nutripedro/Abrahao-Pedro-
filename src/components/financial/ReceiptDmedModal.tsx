import React from 'react';
import {
  Printer,
  Download,
  FileCheck,
  X,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Share2
} from 'lucide-react';
import {
  FinancialTransaction,
  formatCurrencyBRL,
  formatDateBR
} from '../../data/financialData';

interface ReceiptDmedModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: FinancialTransaction | null;
}

export const ReceiptDmedModal: React.FC<ReceiptDmedModalProps> = ({
  isOpen,
  onClose,
  transaction
}) => {
  if (!isOpen || !transaction) return null;

  const receiptNumber = transaction.receiptNumber || `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const patientName = transaction.patientName || 'Paciente Beneficiário';
  const amountStr = formatCurrencyBRL(transaction.amount);
  const dateStr = formatDateBR(transaction.date);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="modal-recibo-dmed-irpf"
      className="fixed inset-0 z-[140] flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-150"
    >
      <div
        className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Topo do Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">
                Recibo de Prestação de Serviços Nutricionais (DMED / IRPF)
              </h3>
              <span className="text-[11px] text-slate-400">
                Padrão oficial CFN e Receita Federal do Brasil
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo do Recibo (Estilizado como documento oficial com fundo claro para impressão impecável) */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-950/40">
          <div
            id="recibo-imprimivel"
            className="bg-white text-slate-900 p-8 rounded-2xl shadow-md border border-slate-200 space-y-6 font-serif"
          >
            {/* Cabeçalho da Clínica */}
            <div className="text-center border-b-2 border-slate-800 pb-4 space-y-1">
              <h1 className="text-lg font-black tracking-wide uppercase font-sans text-slate-950">
                Clínica Vitall Nutrição Especializada Ltda.
              </h1>
              <p className="text-xs font-sans text-slate-600">
                CNPJ: 12.345.678/0001-90 • Inscrição Municipal: 9.876.543-2
              </p>
              <p className="text-xs font-sans text-slate-600">
                Av. Paulista, 1842 - 12º Andar - Bela Vista - São Paulo / SP • Tel: (11) 3289-4000
              </p>
            </div>

            {/* Número do Recibo e Valor */}
            <div className="flex items-center justify-between font-sans border-b border-slate-300 pb-3">
              <div>
                <span className="text-[11px] uppercase font-bold text-slate-500 block">Número do Recibo</span>
                <span className="text-sm font-black font-mono text-slate-900">{receiptNumber}</span>
              </div>
              <div className="text-right">
                <span className="text-[11px] uppercase font-bold text-slate-500 block">Valor Quitado</span>
                <span className="text-lg font-black font-mono text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-300">
                  {amountStr}
                </span>
              </div>
            </div>

            {/* Texto Declaratório Oficial */}
            <div className="text-justify text-sm leading-relaxed space-y-4 font-serif text-slate-800">
              <p>
                Recebi(emos) de <strong>{patientName}</strong>, inscrito(a) no CPF sob o nº{' '}
                <strong>***.***.***-**</strong>, a quantia líquida e certa de{' '}
                <strong>{amountStr}</strong> referente a serviços profissionais de{' '}
                <strong>{transaction.description}</strong> prestados em <strong>{dateStr}</strong>.
              </p>

              <p className="text-xs font-sans text-slate-600 italic">
                Declaro para os devidos fins de dedução no Imposto sobre a Renda da Pessoa Física (IRPF), em conformidade com a Instrução Normativa da Receita Federal do Brasil (DMED), que os serviços acima foram efetivamente prestados e quitados.
              </p>
            </div>

            {/* Assinatura Profissional */}
            <div className="pt-8 flex flex-col items-center justify-center font-sans space-y-1">
              <div className="w-64 border-b border-slate-800" />
              <strong className="text-xs text-slate-900">{transaction.professionalName}</strong>
              <span className="text-[11px] text-slate-600 font-mono">Nutricionista • CRN-3 48.912/SP</span>
              <span className="text-[10px] text-slate-400">Emissão Digital com Autenticação Criptográfica</span>
            </div>
          </div>
        </div>

        {/* Rodapé do Modal */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Válido para declaração anual de IRPF / DMED</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold cursor-pointer"
            >
              Fechar
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Imprimir / Salvar PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
