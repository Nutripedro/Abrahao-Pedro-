import React, { useState } from 'react';
import { QrCode, Copy, Check, Share2, Shield, X, MessageCircle } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  patientToken: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  patientName,
  patientToken
}) => {
  const [copied, setCopied] = useState(false);
  const appUrl = `https://clinicsaas.app/p/${patientToken}`;

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `Olá, ${patientName}! Seu aplicativo de acompanhamento nutricional está pronto. Acesse seu plano alimentar, prescrições e evolução aqui: ${appUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                Acesso do Paciente ao Aplicativo
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Link individual protegido por token LGPD
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Code */}
        <div className="flex flex-col items-center justify-center p-4 bg-stone-50 dark:bg-stone-950 rounded-2xl border border-stone-200 dark:border-stone-800 text-center space-y-2">
          <div className="p-3 bg-white rounded-xl shadow-xs border border-stone-200">
            <QrCode className="w-36 h-36 text-stone-900" />
          </div>
          <span className="text-xs font-mono font-bold text-stone-700 dark:text-stone-300">
            {patientName}
          </span>
          <span className="text-[10px] text-stone-400">
            Aponte a câmera do celular para abrir sem precisar instalar nada pesado
          </span>
        </div>

        {/* Link Input + Copy */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-stone-700 dark:text-stone-300">
            Link direto individual:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={appUrl}
              className="flex-1 px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs font-mono text-stone-800 dark:text-stone-200"
            />
            <button
              type="button"
              onClick={handleCopy}
              className="px-3.5 py-2 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold hover:opacity-90 flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copiado' : 'Copiar'}</span>
            </button>
          </div>
        </div>

        {/* Botão de Envio WhatsApp */}
        <button
          type="button"
          onClick={handleWhatsAppShare}
          className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Enviar Acesso por WhatsApp para {patientName.split(' ')[0]}</span>
        </button>

        <div className="flex items-center gap-2 pt-2 border-t border-stone-100 dark:border-stone-800 text-[10px] text-stone-400">
          <Shield className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span>Conformidade com a LGPD (Art. 5º, II): o link expira em caso de desativação na Central.</span>
        </div>
      </div>
    </div>
  );
};
