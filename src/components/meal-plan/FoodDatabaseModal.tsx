import React, { useState } from 'react';
import {
  X,
  Search,
  Plus,
  Filter,
  Check,
  Flame,
  Info,
  Apple,
  ShieldCheck
} from 'lucide-react';
import { FoodItemData, FoodCategory, FoodRestriction } from '../../types/mealPlan';
import { TACO_FOODS_DATABASE, FOOD_CATEGORIES_METADATA } from '../../data/tacoFoodsData';

interface FoodDatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetMealId: string | null;
  targetMealName: string;
  onAddFood: (mealId: string, food: FoodItemData, grams: number) => void;
}

export const FoodDatabaseModal: React.FC<FoodDatabaseModalProps> = ({
  isOpen,
  onClose,
  targetMealId,
  targetMealName,
  onAddFood
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [selectedRestriction, setSelectedRestriction] = useState<string>('todas');
  const [customGrams, setCustomGrams] = useState<Record<string, number>>({});
  const [addedAnimation, setAddedAnimation] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredFoods = TACO_FOODS_DATABASE.filter((food) => {
    const matchesSearch =
      food.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (food.dicaPreparo && food.dicaPreparo.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'todas' || food.categoria === selectedCategory;
    const matchesRestriction =
      selectedRestriction === 'todas' ||
      food.restricoes.includes(selectedRestriction as FoodRestriction);

    return matchesSearch && matchesCategory && matchesRestriction;
  });

  const handleQuantityChange = (foodId: string, val: number) => {
    setCustomGrams((prev) => ({ ...prev, [foodId]: Math.max(1, val) }));
  };

  const handleAdd = (food: FoodItemData) => {
    if (!targetMealId) return;
    const grams = customGrams[food.id] || food.porcaoPadraoGramas;
    onAddFood(targetMealId, food, grams);
    setAddedAnimation(food.id);
    setTimeout(() => setAddedAnimation(null), 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Apple className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Banco de Alimentos Oficial (TACO / UNICAMP & IBGE)
                </h3>
                {targetMealName && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-medium">
                    Adicionando em: {targetMealName}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tabela Brasileira de Composição de Alimentos com dados centesimais por 100g e porção caseira
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

        {/* Filters and Search */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nome do alimento (ex: arroz integral, tilápia, aveia, whey, feijão)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-medium mr-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Categorias:</span>
            </div>

            <button
              onClick={() => setSelectedCategory('todas')}
              className={`px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                selectedCategory === 'todas'
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              Todas ({TACO_FOODS_DATABASE.length})
            </button>

            {Object.entries(FOOD_CATEGORIES_METADATA).map(([key, meta]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1 transition-colors ${
                  selectedCategory === key
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <span>{meta.icon}</span>
                <span>{meta.label}</span>
              </button>
            ))}
          </div>

          {/* Restriction Tags */}
          <div className="flex flex-wrap items-center gap-2 text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 dark:text-slate-500 font-medium">Restrições / Selos:</span>
            {[
              { id: 'todas', label: 'Todas' },
              { id: 'sem_gluten', label: 'Sem Glúten' },
              { id: 'sem_lactose', label: 'Sem Lactose' },
              { id: 'vegano', label: 'Vegano' },
              { id: 'vegetariano', label: 'Vegetariano' },
              { id: 'low_fodmap', label: 'Low FODMAP' }
            ].map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedRestriction(r.id)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  selectedRestriction === r.id
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Food Table / Grid */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 bg-slate-50/50 dark:bg-slate-950/20">
          {filteredFoods.length === 0 ? (
            <div className="text-center py-12 text-slate-400 dark:text-slate-500">
              <Info className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium">Nenhum alimento encontrado para os filtros selecionados.</p>
              <p className="text-xs mt-1">Tente pesquisar por outro termo ou limpar os filtros de categoria.</p>
            </div>
          ) : (
            filteredFoods.map((food) => {
              const currentG = customGrams[food.id] || food.porcaoPadraoGramas;
              const factor = currentG / 100;
              const calcKcal = Math.round(food.caloriasKcal * factor);
              const calcProt = (food.proteinasG * factor).toFixed(1);
              const calcCarb = (food.carboidratosG * factor).toFixed(1);
              const calcGord = (food.gordurasTotaisG * factor).toFixed(1);
              const calcFibras = (food.fibrasG * factor).toFixed(1);
              const isAdded = addedAnimation === food.id;

              return (
                <div
                  key={food.id}
                  className={`p-3.5 rounded-xl border bg-white dark:bg-slate-900 transition-all ${
                    isAdded
                      ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/30'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                          {food.nome}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                          {food.fonte}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Porção padrão: <span className="font-medium text-slate-700 dark:text-slate-300">{food.medidaCaseiraPadrao}</span> ({food.porcaoPadraoGramas}g)
                      </div>
                      {food.dicaPreparo && (
                        <div className="text-[11px] text-emerald-700 dark:text-emerald-400 italic">
                          💡 {food.dicaPreparo}
                        </div>
                      )}
                    </div>

                    {/* Quantity Selector & Macros */}
                    <div className="flex flex-wrap items-center gap-3 self-end sm:self-center">
                      <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                        <span className="text-xs text-slate-500">Qtd:</span>
                        <input
                          type="number"
                          min="1"
                          max="2000"
                          value={currentG}
                          onChange={(e) => handleQuantityChange(food.id, Number(e.target.value))}
                          className="w-16 px-1.5 py-0.5 text-xs font-mono font-bold text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                        <span className="text-xs font-mono text-slate-500">g</span>
                      </div>

                      <div className="text-right font-mono text-xs">
                        <div className="font-bold text-amber-600 dark:text-amber-400 flex items-center justify-end gap-1">
                          <Flame className="w-3.5 h-3.5" />
                          {calcKcal} kcal
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">
                          P: {calcProt}g | C: {calcCarb}g | G: {calcGord}g | Fib: {calcFibras}g
                        </div>
                      </div>

                      <button
                        onClick={() => handleAdd(food)}
                        className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
                          isAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            Adicionado!
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            Adicionar
                          </>
                        )}
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
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Dados certificados conforme TACO 4ª Edição / Tabela de Composição de Alimentos IBGE.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors"
          >
            Concluir Seleção
          </button>
        </div>
      </div>
    </div>
  );
};
