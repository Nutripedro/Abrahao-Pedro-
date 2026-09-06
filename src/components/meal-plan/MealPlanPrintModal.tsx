import React from 'react';
import {
  X,
  Printer,
  FileDown,
  ShieldCheck,
  Calendar,
  User,
  HeartPulse,
  Flame,
  Droplet,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { MealPlan } from '../../types/mealPlan';
import { calculateDailyTotals, calculateMealTotals } from '../../utils/nutritionCalculations';

interface MealPlanPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: MealPlan;
}

export const MealPlanPrintModal: React.FC<MealPlanPrintModalProps> = ({
  isOpen,
  onClose,
  plan
}) => {
  if (!isOpen) return null;

  const primaryMeals = plan.dias[0]?.refeicoes || [];
  const totals = calculateDailyTotals(primaryMeals);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Action Header (Hidden on Print) */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/80 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Visualização de Impressão Clínica (Laudo & Plano A4)
              </h3>
              <p className="text-xs text-slate-500">Documento formatado para entrega ao paciente e exportação em PDF</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              Imprimir / Salvar PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document A4 Container */}
        <div className="p-8 overflow-y-auto flex-1 bg-slate-100 dark:bg-slate-950/40 print:bg-white print:p-0">
          <div
            id="printable-meal-plan-doc"
            className="max-w-3xl mx-auto bg-white text-slate-900 p-8 sm:p-10 rounded-2xl shadow-xl border border-slate-200 print:border-none print:shadow-none print:p-0 print:m-0 space-y-6"
          >
            {/* Header Clínico */}
            <div className="flex items-start justify-between pb-6 border-b-2 border-emerald-600">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-lg">
                    N
                  </div>
                  <div>
                    <h1 className="text-xl font-black tracking-tight text-slate-900">
                      CLÍNICA DE NUTRIÇÃO INTEGRADA
                    </h1>
                    <p className="text-xs text-slate-500 font-medium">
                      Atendimento Nutricional Clínico e Esportivo de Alta Precisão
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-right text-xs text-slate-600 space-y-0.5">
                <div className="font-bold text-slate-900">{plan.profissionalNome}</div>
                <div className="text-emerald-700 font-semibold">{plan.profissionalCrn}</div>
                <div className="text-[11px] text-slate-400">Emissão: {new Date().toLocaleDateString('pt-BR')}</div>
              </div>
            </div>

            {/* Dados do Paciente & Metas Energéticas */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block">Paciente:</span>
                  <strong className="text-slate-900 font-semibold">{plan.pacienteNome}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Idade / Sexo:</span>
                  <strong className="text-slate-900 font-semibold">{plan.pacienteIdade} anos • {plan.pacienteSexo === 'F' ? 'Feminino' : 'Masculino'}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Peso / Altura:</span>
                  <strong className="text-slate-900 font-semibold">{plan.pacientePesoKg} kg • {plan.pacienteAlturaCm} cm</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Meta Hídrica:</span>
                  <strong className="text-emerald-700 font-bold">{plan.metas.aguaMl} ml/dia</strong>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div>
                  <span className="text-slate-500">Objetivo Clínico: </span>
                  <strong className="text-slate-900 uppercase font-bold tracking-wide">
                    {plan.objetivoClinico}
                  </strong>
                </div>
                <div className="flex items-center gap-3 font-mono">
                  <span>VET Planejado: <strong className="text-emerald-700 font-bold">{totals.totalKcal} kcal</strong></span>
                  <span>Proteína: <strong>{totals.totalProt}g ({(totals.totalProt / plan.pacientePesoKg).toFixed(1)} g/kg)</strong></span>
                  <span>Carboidratos: <strong>{totals.totalCarb}g</strong></span>
                  <span>Lipídios: <strong>{totals.totalGord}g</strong></span>
                </div>
              </div>
            </div>

            {/* Título e Estratégia */}
            <div>
              <h2 className="text-base font-bold text-slate-900">{plan.tituloPlano}</h2>
              <p className="text-xs text-slate-600 mt-0.5">{plan.estrategiaNutricional}</p>
            </div>

            {/* Refeições Estruturadas */}
            <div className="space-y-4">
              {primaryMeals.map((meal) => {
                const mealTot = calculateMealTotals(meal.alimentos);
                return (
                  <div key={meal.id} className="border border-slate-200 rounded-xl overflow-hidden">
                    {/* Meal Header */}
                    <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{meal.icone}</span>
                        <span className="font-bold text-xs uppercase tracking-wide text-slate-900">
                          {meal.nome}
                        </span>
                        <span className="text-xs font-mono font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          ⏰ {meal.horarioSugerido}
                        </span>
                      </div>
                      <div className="text-xs font-mono text-slate-600 font-medium">
                        {mealTot.calorias} kcal | P: {mealTot.proteinas}g | C: {mealTot.carboidratos}g | G: {mealTot.gorduras}g
                      </div>
                    </div>

                    {/* Meal Foods Table */}
                    <div className="divide-y divide-slate-100 p-2 text-xs">
                      {meal.alimentos.map((item) => (
                        <div key={item.id} className="py-1.5 px-2 flex items-center justify-between">
                          <div className="space-y-0.5">
                            <div className="font-semibold text-slate-900">
                              {item.nome}
                            </div>
                            <div className="text-slate-500 font-mono text-[11px]">
                              {item.quantidadeGramas}g • <span className="text-slate-700">{item.medidaCaseiraTexto}</span>
                            </div>
                            {item.observacao && (
                              <div className="text-[10px] text-emerald-700 italic">
                                ↳ {item.observacao}
                              </div>
                            )}
                          </div>
                          <div className="text-right font-mono text-[11px] text-slate-600">
                            <strong>{item.calorias} kcal</strong> (P: {item.proteinas}g | C: {item.carboidratos}g | G: {item.gorduras}g)
                          </div>
                        </div>
                      ))}
                    </div>

                    {meal.orientacoesEspecificas && (
                      <div className="bg-amber-50/60 px-4 py-1.5 border-t border-amber-100 text-[11px] text-amber-900">
                        📌 <strong>Dica da Refeição:</strong> {meal.orientacoesEspecificas}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Orientações Gerais */}
            {plan.orientacoesGerais.length > 0 && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
                <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Orientações Clínicas e Conduta Geral
                </h3>
                <ul className="space-y-1.5 text-slate-700 pl-4 list-disc">
                  {plan.orientacoesGerais.map((ori, i) => (
                    <li key={i}>{ori}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Assinatura e Rodapé Oficial */}
            <div className="pt-8 border-t border-slate-200 flex items-end justify-between text-xs text-slate-500">
              <div>
                <div className="font-semibold text-slate-700">Validade do Plano: 30 a 45 dias</div>
                <div className="text-[10px]">Acompanhamento clínico periódico recomendado.</div>
              </div>

              <div className="text-center space-y-1">
                <div className="w-48 border-b border-slate-400 pb-1" />
                <div className="font-bold text-slate-900">{plan.profissionalNome}</div>
                <div className="text-[10px] text-emerald-700 font-semibold">{plan.profissionalCrn}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
