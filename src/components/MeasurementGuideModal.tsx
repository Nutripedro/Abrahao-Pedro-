import React, { useState } from 'react';
import { X, HelpCircle, AlertTriangle, CheckCircle2, Bookmark, Compass, BookOpen } from 'lucide-react';
import { SKINFOLD_DEFINITIONS } from '../data/protocolData';
import { SkinfoldKey } from '../types';

interface MeasurementGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFold?: SkinfoldKey | null;
}

export const MeasurementGuideModal: React.FC<MeasurementGuideModalProps> = ({
  isOpen,
  onClose,
  selectedFold,
}) => {
  const [activeTab, setActiveTab] = useState<SkinfoldKey>(selectedFold || 'triceps');

  if (!isOpen) return null;

  const currentDef = SKINFOLD_DEFINITIONS[activeTab];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-800 text-sky-400 flex items-center justify-center shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight text-white font-sans">
                Guia Prático de Padronização Antropométrica
              </h3>
              <p className="text-xs text-slate-400">
                Técnicas de demarcação anatômica e aplicação de adipômetro (ISAK / Jackson & Pollock)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer active:scale-95"
            aria-label="Fechar guia"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Clinical Standardization Warning Box */}
        <div className="bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-800/60 px-5 sm:px-6 py-3 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
            <strong className="font-semibold block mb-0.5">Aviso Importante sobre Padronização Clínica:</strong>
            “Realize as medições seguindo o protocolo selecionado. A padronização da técnica influencia diretamente o resultado.”
            <span className="text-amber-800 dark:text-amber-300/90 block mt-0.5">
              Todas as dobras são tomadas no hemicorpo direito do paciente. Aguarde 1 a 2 segundos após soltar as hastes antes de realizar a leitura.
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 dark:text-slate-200">
          {/* Rules / Steps Checklist */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 bg-slate-50/80 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-700">
              <span className="w-7 h-7 rounded-full bg-slate-900 dark:bg-sky-600 text-white font-mono text-xs font-bold inline-flex items-center justify-center mb-2">
                1
              </span>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">Pinçamento Firme</h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Destaque a dobra entre polegar e indicador da mão esquerda, afastando a pele e gordura da massa muscular subjacente.
              </p>
            </div>

            <div className="p-4 bg-slate-50/80 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-700">
              <span className="w-7 h-7 rounded-full bg-slate-900 dark:bg-sky-600 text-white font-mono text-xs font-bold inline-flex items-center justify-center mb-2">
                2
              </span>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">1 cm de Distância</h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Aplique as hastes do adipômetro exatamente 1 cm abaixo dos dedos que seguram a dobra, perpendicularmente ao eixo da dobra.
              </p>
            </div>

            <div className="p-4 bg-slate-50/80 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-700">
              <span className="w-7 h-7 rounded-full bg-slate-900 dark:bg-sky-600 text-white font-mono text-xs font-bold inline-flex items-center justify-center mb-2">
                3
              </span>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">Tomada Tripla (2-3x)</h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Repita a tomada 2 a 3 vezes não consecutivas e utilize a média aritmética. Se houver diferença &gt; 1 mm, realize nova medida.
              </p>
            </div>
          </div>

          {/* Skinfold Navigation Tabs */}
          <div>
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-tight block mb-2.5 font-mono">
              Pontos Anatômicos Individuais
            </span>
            <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800 overflow-x-auto no-scrollbar">
              {(Object.keys(SKINFOLD_DEFINITIONS) as SkinfoldKey[]).map((key) => {
                const def = SKINFOLD_DEFINITIONS[key];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveTab(key)}
                    className={`px-3.5 py-2 min-h-[44px] text-xs rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap active:scale-95 shrink-0 ${
                      activeTab === key
                        ? 'bg-slate-900 dark:bg-sky-600 text-white shadow-2xs font-bold'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {def.number}. {def.shortName}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Tab Detail */}
          <div className="bg-slate-50/80 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-4 sm:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-full bg-sky-700 dark:bg-sky-600 text-white font-mono font-bold text-sm flex items-center justify-center shrink-0">
                  {currentDef.number}
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white font-sans">
                  Dobra Cutânea {currentDef.name}
                </h4>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                <span className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 uppercase font-bold text-[11px]">
                  Orientação: {currentDef.orientation}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 uppercase text-[11px]">
                  Vista: {currentDef.view}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <strong className="text-slate-900 dark:text-white font-semibold flex items-center gap-1.5">
                  <Bookmark className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                  Localização Anatômica Exata:
                </strong>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-800 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  {currentDef.anatomicalLocation}
                </p>
              </div>

              <div className="space-y-1.5">
                <strong className="text-slate-900 dark:text-white font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  Instruções de Posicionamento & Pinçamento:
                </strong>
                <div className="text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-800 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                  <p>{currentDef.instructions}</p>
                  <p className="text-slate-500 dark:text-slate-400 italic mt-1">{currentDef.pinchingTips}</p>
                </div>
              </div>
            </div>

            {/* Normative Reference Range Box */}
            {currentDef.normas && (
              <div className="p-3.5 bg-sky-50/70 dark:bg-sky-950/40 border border-sky-200/80 dark:border-sky-800 rounded-xl text-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sky-950 dark:text-sky-200 font-sans">
                    Variação Normal Esperada por Sexo (mm):
                  </span>
                  <span className="text-[11px] font-mono text-sky-700 dark:text-sky-400 font-medium">
                    Ref: {currentDef.normas.referencia}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="bg-white/90 dark:bg-slate-800/90 p-2.5 rounded-lg border border-sky-100 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-white block">Homens (♂)</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">Média: {currentDef.normas.homens.media} mm</span>
                    </div>
                    <span className="font-mono font-bold text-sky-800 dark:text-sky-300 text-sm">
                      {currentDef.normas.homens.faixaTexto}
                    </span>
                  </div>
                  <div className="bg-white/90 dark:bg-slate-800/90 p-2.5 rounded-lg border border-sky-100 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-white block">Mulheres (♀)</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">Média: {currentDef.normas.mulheres.media} mm</span>
                    </div>
                    <span className="font-mono font-bold text-sky-800 dark:text-sky-300 text-sm">
                      {currentDef.normas.mulheres.faixaTexto}
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-sky-900 dark:text-sky-300 mt-2 leading-relaxed">
                  {currentDef.normas.descricaoClinica}
                </p>
              </div>
            )}

            {/* Practical Caliper Application Notes */}
            <div className="p-3.5 bg-slate-900 dark:bg-slate-950 text-sky-200 rounded-xl text-xs leading-relaxed font-mono border border-slate-800">
              <span className="text-sky-400 font-bold block mb-1">Regra de Ouro da Leitura:</span>
              Mantenha o pinçamento com a mão esquerda durante toda a medição. Não solte a pele antes de registrar o valor. A unidade padrão é milímetros (mm).
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200/90 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Base científica: Harrison et al. (1988), Lohman et al. (1991) e ISAK.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 min-h-[44px] text-xs font-bold text-white bg-slate-900 dark:bg-sky-600 hover:bg-slate-800 dark:hover:bg-sky-500 rounded-xl transition-colors cursor-pointer active:scale-95 text-center"
          >
            Entendido, Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
