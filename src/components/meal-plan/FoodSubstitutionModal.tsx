import React from 'react';
import { X, ArrowRightLeft, Sparkles, Check, Info, Flame } from 'lucide-react';
import { MealFoodItem, FoodSubstitution } from '../../types/mealPlan';

interface FoodSubstitutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  mealId: string;
  foodItem: MealFoodItem | null;
  onSelectSubstitution: (mealId: string, oldFoodItemId: string, sub: FoodSubstitution) => void;
}

export const FoodSubstitutionModal: React.FC<FoodSubstitutionModalProps> = ({
  isOpen,
  onClose,
  mealId,
  foodItem,
  onSelectSubstitution
}) => {
  if (!isOpen || !foodItem) return null;

  const substitutions = foodItem.substituicoesSugeridas || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Substituições Inteligentes
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Opções equivalentes isocalóricas e isoproteicas da Tabela TACO
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Food Target */}
        <div className="p-5 bg-purple-50/50 dark:bg-purple-950/20 border-b border-purple-100 dark:border-purple-900/30">
          <div className="text-[11px] font-semibold text-purple-700 dark:text-purple-300 uppercase tracking-wider mb-1">
            Item Original a ser Substituído
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {foodItem.nome}
              </span>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {foodItem.quantidadeGramas}g ({foodItem.medidaCaseiraTexto})
              </div>
            </div>
            <div className="flex items-center gap-3 font-mono text-xs">
              <span className="flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400">
                <Flame className="w-3.5 h-3.5" />
                {foodItem.calorias} kcal
              </span>
              <span className="text-slate-600 dark:text-slate-300">P: {foodItem.proteinas}g</span>
              <span className="text-slate-600 dark:text-slate-300">C: {foodItem.carboidratos}g</span>
              <span className="text-slate-600 dark:text-slate-300">G: {foodItem.gorduras}g</span>
            </div>
          </div>
        </div>

        {/* Substitution List */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {substitutions.length === 0 ? (
            <div className="text-center py-8 text-slate-400 dark:text-slate-500">
              <Info className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nenhuma substituição cadastrada para este item.</p>
              <p className="text-xs mt-1">Consulte o Banco de Alimentos TACO para adicionar manualmente.</p>
            </div>
          ) : (
            substitutions.map((sub) => {
              const isIsoCaloric = Math.abs(sub.diferencaCaloricaPercent) <= 5;
              return (
                <div
                  key={sub.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700 bg-white dark:bg-slate-900 transition-all group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                          {sub.nome}
                        </span>
                        {isIsoCaloric && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            Isocalórico
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 font-mono">
                        Quantidade recomendada: <strong className="text-slate-900 dark:text-white">{sub.quantidadeGramas}g</strong> ({sub.medidaCaseiraTexto})
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                        {sub.razaoClinica}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <div className="text-right font-mono text-xs">
                        <div className="font-bold text-amber-600 dark:text-amber-400">
                          {sub.calorias} kcal
                        </div>
                        <div className="text-[10px] text-slate-400">
                          P: {sub.proteinas}g | C: {sub.carboidratos}g | G: {sub.gorduras}g
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          onSelectSubstitution(mealId, foodItem.id, sub);
                          onClose();
                        }}
                        className="px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Substituir
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span>Gramaturas calculadas automaticamente para manter o balanço calórico da refeição.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
