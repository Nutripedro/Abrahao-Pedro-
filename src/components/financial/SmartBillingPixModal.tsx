import React, { useState } from 'react';
import {
  QrCode,
  Copy,
  CheckCircle2,
  X,
  Share2,
  MessageCircle,
  Clock,
  ShieldCheck,
  Send,
  Smartphone
} from 'lucide-react';
import {
  FinancialTransaction,
  formatCurrencyBRL
} from '../../data/financialData';
import { ResponsiveImage } from '../common/ResponsiveImage';

interface SmartBillingPixModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: FinancialTransaction | null;
  onMarkPaid?: (id: string) => void;
}

export const SmartBillingPixModal: React.FC<SmartBillingPixModalProps> = ({
  isOpen,
  onClose,
  transaction,
  onMarkPaid
}) => {
  const [copied, setCopied] = useState(false);
  const [sentWhatsapp, setSentWhatsapp] = useState(false);

  if (!isOpen || !transaction) return null;

  const pixPayload =
    transaction.pixQrCodePayload ||
    '00020126580014br.gov.bcb.pix0136pix-cobranca-recibos-vitall-0015204000053039865406280.005802BR5920Clinica Vitall Nutri6009Sao Paulo62070503***6304A1B2';

  const patientName = transaction.patientName || 'Paciente';
  const amountStr = formatCurrencyBRL(transaction.amount);

  const whatsappMessage = `Olá, ${patientName}! Tudo bem? 😊\n\nSegue o link e a chave Pix para pagamento da sua ${transaction.description} na Clínica Vitall Nutrição:\n\n💰 Valor: ${amountStr}\n📅 Vencimento: ${transaction.dueDate}\n\n🔑 Chave Pix Copia e Cola:\n${pixPayload}\n\nAssim que o pagamento for realizado, seu recibo oficial para Imposto de Renda (DMED) será emitido e disponibilizado no seu aplicativo. Qualquer dúvida estamos à disposição!`;

  const handleCopy = () => {
    navigator.clipboard.writeText(pixPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSendWhatsapp = () => {
    const encoded = encodeURIComponent(whatsappMessage);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
    setSentWhatsapp(true);
  };

  return (
    <div
      id="modal-cobranca-pix-dinamico"
      className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-150"
    >
      <div
        className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">Cobrança Pix & Régua Inteligente</h3>
              <span className="text-[11px] text-slate-400">QR Code dinâmico com baixa automática</span>
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

        {/* Conteúdo */}
        <div className="p-6 space-y-5 text-xs">
          {/* Informações da Fatura */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Paciente:</span>
              <strong className="text-white">{patientName}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Serviço:</span>
              <span className="text-slate-200 truncate max-w-[200px]">{transaction.description}</span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
              <span className="text-slate-300 font-bold">Valor Total:</span>
              <span className="text-base font-black text-emerald-400 font-mono">{amountStr}</span>
            </div>
          </div>

          {/* QR Code Simulado Visual */}
          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white text-slate-900 space-y-2">
            <ResponsiveImage
              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(pixPayload)}`}
              alt="QR Code Pix"
              widths={[180, 360, 540]}
              sizes="160px"
              className="w-40 h-40 rounded-xl"
            />
            <span className="text-[11px] font-mono text-slate-600 font-bold">
              Aponte a câmera do aplicativo do seu banco
            </span>
          </div>

          {/* Copia e Cola */}
          <div className="space-y-1.5">
            <label className="block text-slate-300 font-semibold text-[11px]">Pix Copia e Cola:</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={pixPayload}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-300 font-mono text-[10px] focus:outline-none select-all"
              />
              <button
                type="button"
                onClick={handleCopy}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copiado!' : 'Copiar'}
              </button>
            </div>
          </div>

          {/* Botão Enviar WhatsApp */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={handleSendWhatsapp}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              Enviar Cobrança Cordial via WhatsApp
            </button>
            {sentWhatsapp && (
              <span className="block text-center text-[11px] text-emerald-400 font-semibold">
                ✓ Mensagem encaminhada para o WhatsApp!
              </span>
            )}
          </div>
        </div>

        {/* Rodapé */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold cursor-pointer"
          >
            Fechar
          </button>
          {onMarkPaid && (
            <button
              type="button"
              onClick={() => {
                onMarkPaid(transaction.id);
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition-all cursor-pointer"
            >
              Dar Baixa Manual como Pago
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
