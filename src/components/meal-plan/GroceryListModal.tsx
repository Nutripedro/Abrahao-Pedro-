import React, { useState } from 'react';
import {
  X,
  ShoppingCart,
  Check,
  Printer,
  Download,
  Share2,
  Calendar,
  Sparkles
} from 'lucide-react';
import { GroceryCategoryGroup, MealSection } from '../../types/mealPlan';
import { generateGroceryListFromMealPlan } from '../../utils/nutritionCalculations';

interface GroceryListModalProps {
  isOpen: boolean;
  onClose: () => void;
  refeicoes: MealSection[];
  pacienteNome: string;
}

export const GroceryListModal: React.FC<GroceryListModalProps> = ({
  isOpen,
  onClose,
  refeicoes,
  pacienteNome
}) => {
  const [daysMultiplier, setDaysMultiplier] = useState<number>(7);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const groceryGroups = generateGroceryListFromMealPlan(refeicoes, daysMultiplier);

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePrint = () => {
    window.print();
  };

  const totalItemsCount = groceryGroups.reduce((acc, g) => acc + g.itens.length, 0);
  const checkedCount = Object.values(checkedItems).filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Lista de Compras Inteligente do Cardápio
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Agrupamento automático por setor de supermercado para {pacienteNome}
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

        {/* Multiplier Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-teal-50/50 dark:bg-teal-950/20 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-medium text-teal-900 dark:text-teal-200">
            <Calendar className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Período da compra planejada:</span>
            <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-lg border border-teal-200 dark:border-teal-800">
              {[
                { days: 3, label: '3 dias' },
                { days: 7, label: '7 dias (1 sem)' },
                { days: 14, label: '14 dias (2 sem)' },
                { days: 30, label: '30 dias (Mês)' }
              ].map((opt) => (
                <button
                  key={opt.days}
                  onClick={() => setDaysMultiplier(opt.days)}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                    daysMultiplier === opt.days
                      ? 'bg-teal-600 text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs text-slate-600 dark:text-slate-400 font-mono">
            Progresso: <strong className="text-teal-700 dark:text-teal-300">{checkedCount}</strong> de {totalItemsCount} comprados
          </div>
        </div>

        {/* Categories and Items */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {groceryGroups.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <ShoppingCart className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nenhum item no plano alimentar para gerar a lista.</p>
            </div>
          ) : (
            groceryGroups.map((group) => (
              <div
                key={group.categoriaNome}
                className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3"
              >
                <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white pb-2 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-base">{group.icone}</span>
                  <span>{group.categoriaNome}</span>
                  <span className="text-xs font-normal text-slate-400">({group.itens.length} itens)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {group.itens.map((item) => {
                    const isChecked = !!checkedItems[item.id];
                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleCheck(item.id)}
                        className={`p-2.5 rounded-lg border cursor-pointer flex items-center justify-between text-xs transition-all ${
                          isChecked
                            ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 line-through opacity-75'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-4 h-4 rounded flex items-center justify-center border ${
                              isChecked
                                ? 'bg-emerald-600 border-emerald-600 text-white'
                                : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800'
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3" />}
                          </div>
                          <span className="font-medium">{item.nome}</span>
                        </div>
                        <span className="font-mono font-bold text-slate-700 dark:text-slate-300 ml-2">
                          {item.medidaCaseiraResumo}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-teal-500" />
            <span>As quantidades são sincronizadas automaticamente com o app do paciente.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium text-xs flex items-center gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Imprimir Lista
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
