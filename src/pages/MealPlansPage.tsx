import React, { useState } from 'react';
import {
  Apple,
  Plus,
  Trash2,
  Printer,
  ShoppingCart,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRightLeft,
  Search,
  User,
  Flame,
  Droplet,
  HeartPulse,
  Info,
  ChevronDown,
  Layers,
  Smartphone,
  Share2,
  AlertTriangle,
  FileSpreadsheet,
  Check,
  Send,
  Zap
} from 'lucide-react';
import { useMealPlan } from '../contexts/MealPlanContext';
import { SYNTHETIC_PATIENTS } from '../data/syntheticPatientsData';
import { MacroProgressBar } from '../components/meal-plan/MacroProgressBar';
import { FoodSubstitutionModal } from '../components/meal-plan/FoodSubstitutionModal';
import { FoodDatabaseModal } from '../components/meal-plan/FoodDatabaseModal';
import { GroceryListModal } from '../components/meal-plan/GroceryListModal';
import { MealPlanPrintModal } from '../components/meal-plan/MealPlanPrintModal';
import { AdvancedFeaturesActivationBanner } from '../components/meal-plan/AdvancedFeaturesActivationBanner';
import { MealFoodItem, FoodItemData, FoodSubstitution } from '../types/mealPlan';
import { calculateMealTotals, evaluateMealPlanCompliance } from '../utils/nutritionCalculations';
import { CLINICAL_MEAL_PLAN_TEMPLATES } from '../data/mealPlanTemplatesData';

export const MealPlansPage: React.FC = () => {
  const {
    activePlan,
    features,
    allFeaturesActive,
    addMealSection,
    removeMealSection,
    updateMealSection,
    addFoodToMeal,
    removeFoodFromMeal,
    updateFoodQuantity,
    replaceFoodWithSubstitution,
    applyTemplate,
    selectPatientProfile,
    updatePlanMetadata,
    dailyTotals
  } = useMealPlan();

  // Modals state
  const [isFoodDbOpen, setIsFoodDbOpen] = useState(false);
  const [targetMealForFoodDb, setTargetMealForFoodDb] = useState<{ id: string; name: string } | null>(null);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [subModalData, setSubModalData] = useState<{ mealId: string; foodItem: MealFoodItem } | null>(null);
  const [isGroceryModalOpen, setIsGroceryModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // New Meal form state
  const [showAddMealForm, setShowAddMealForm] = useState(false);
  const [newMealName, setNewMealName] = useState('');
  const [newMealTime, setNewMealTime] = useState('15:00');
  const [newMealIcon, setNewMealIcon] = useState('🍎');

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const primaryMeals = activePlan.dias[0]?.refeicoes || [];
  const compliance = evaluateMealPlanCompliance(activePlan, dailyTotals);

  const handleOpenFoodDb = (mealId: string, mealName: string) => {
    setTargetMealForFoodDb({ id: mealId, name: mealName });
    setIsFoodDbOpen(true);
  };

  const handleOpenSubModal = (mealId: string, item: MealFoodItem) => {
    setSubModalData({ mealId, foodItem: item });
    setIsSubModalOpen(true);
  };

  const handleCreateMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMealName.trim()) return;
    addMealSection(newMealName.trim(), newMealTime, newMealIcon);
    setNewMealName('');
    setShowAddMealForm(false);
    showToast(`Refeição "${newMealName}" adicionada com sucesso!`);
  };

  const handleSyncWithPatientApp = () => {
    updatePlanMetadata({ sincronizadoComAppPaciente: true });
    showToast('✓ Plano alimentar sincronizado com sucesso com o Aplicativo do Paciente!');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      {/* 1. Header Clínico */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Apple className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Planos Alimentares
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Prescrição Dietoterápica
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Elaboração de cardápios com Tabela TACO, divisão de macros, substituições isocalóricas e sincronização clínica.
          </p>
        </div>

        {/* Global Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="btn-sync-app-paciente"
            onClick={handleSyncWithPatientApp}
            className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Smartphone className="w-4 h-4" />
            <span>Enviar ao App</span>
          </button>

          <button
            id="btn-lista-compras-plano"
            onClick={() => setIsGroceryModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/40 dark:hover:bg-teal-900/50 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Lista de Compras</span>
          </button>

          <button
            id="btn-imprimir-laudo-plano"
            onClick={() => setIsPrintModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Laudo PDF / Imprimir</span>
          </button>
        </div>
      </div>

      {/* 2. Toast Notification */}
      {toastMessage && (
        <div className="bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center justify-between text-xs font-semibold animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="opacity-80 hover:opacity-100">
            ✕
          </button>
        </div>
      )}

      {/* 3. Banner de Ativação Master (10/10) */}
      <AdvancedFeaturesActivationBanner />

      {/* 4. Paciente Ativo & Dados Metabólicos */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-bold text-lg flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
              {activePlan.pacienteNome.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">Paciente em Atendimento:</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  Prontuário Ativo
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {activePlan.pacienteNome}
              </h2>
              <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2 mt-0.5">
                <span>{activePlan.pacienteIdade} anos</span>
                <span>•</span>
                <span>{activePlan.pacienteSexo === 'F' ? 'Feminino' : 'Masculino'}</span>
                <span>•</span>
                <span>Peso: <strong className="text-slate-800 dark:text-slate-200">{activePlan.pacientePesoKg} kg</strong></span>
                <span>•</span>
                <span>Altura: <strong className="text-slate-800 dark:text-slate-200">{activePlan.pacienteAlturaCm} cm</strong></span>
              </div>
            </div>
          </div>

          {/* Trocar Paciente / Carregar Perfil */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Selecionar Paciente:</span>
            <select
              value={activePlan.pacienteId}
              onChange={(e) => selectPatientProfile(e.target.value)}
              className="text-xs font-semibold px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {SYNTHETIC_PATIENTS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome} ({p.peso}kg - {p.metaClinica})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Resumo Metabólico & Metas */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
            <div className="text-[11px] text-slate-500 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              TMB (Basal)
            </div>
            <div className="text-base font-mono font-bold text-slate-900 dark:text-white mt-0.5">
              {activePlan.tmbKcal} <span className="text-xs font-normal text-slate-400">kcal</span>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
            <div className="text-[11px] text-slate-500 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              GET (Gasto Total)
            </div>
            <div className="text-base font-mono font-bold text-slate-900 dark:text-white mt-0.5">
              {activePlan.getKcal} <span className="text-xs font-normal text-slate-400">kcal</span>
            </div>
          </div>

          <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
            <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" />
              Meta VET Prescrita
            </div>
            <div className="text-base font-mono font-bold text-emerald-800 dark:text-emerald-300 mt-0.5">
              {activePlan.metas.caloriasAlvo} <span className="text-xs font-normal">kcal/dia</span>
            </div>
          </div>

          <div className="bg-sky-50/50 dark:bg-sky-950/20 p-3 rounded-xl border border-sky-100 dark:border-sky-900/40">
            <div className="text-[11px] text-sky-700 dark:text-sky-400 font-semibold flex items-center gap-1">
              <Droplet className="w-3.5 h-3.5" />
              Meta Hídrica Diária
            </div>
            <div className="text-base font-mono font-bold text-sky-800 dark:text-sky-300 mt-0.5">
              {activePlan.metas.aguaMl} <span className="text-xs font-normal">ml/dia</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Seletor de Modelos Clínicos Pré-Configurados (Templates) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Modelos de Prescrição Rápida (Templates Clínicos)
            </h3>
          </div>
          <span className="text-xs text-slate-400">Clique para carregar a estrutura base</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {CLINICAL_MEAL_PLAN_TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => {
                applyTemplate(tpl.id);
                showToast(`Modelo "${tpl.tituloPlano}" aplicado!`);
              }}
              className={`p-3 rounded-xl border text-left transition-all ${
                activePlan.id === tpl.id
                  ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20 ring-1 ring-emerald-500'
                  : 'border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 bg-slate-50/50 dark:bg-slate-800/40'
              }`}
            >
              <div className="font-bold text-xs text-slate-900 dark:text-white">
                {tpl.tituloPlano}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                {tpl.estrategiaNutricional}
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] font-mono font-semibold text-emerald-700 dark:text-emerald-400">
                <span>{tpl.metas.caloriasAlvo} kcal</span>
                <span>{tpl.metas.proteinasGKg} g/kg P</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 6. Dashboard de Macronutrientes e Micronutrientes */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Balanço Energético & Macronutrientes do Dia</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-mono font-bold ${
                Math.abs(dailyTotals.totalKcal - activePlan.metas.caloriasAlvo) <= 150
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
              }`}>
                {dailyTotals.totalKcal} / {activePlan.metas.caloriasAlvo} kcal
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Cálculo somatório em tempo real de todas as {primaryMeals.length} refeições estruturadas
            </p>
          </div>

          {/* Compliance Badge */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Score Clínico:</span>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold text-xs font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{compliance.scoreGeral}/100</span>
            </div>
          </div>
        </div>

        {/* 4 Macro Progress Bars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <MacroProgressBar
            label="Proteínas (PAVB)"
            currentGrams={dailyTotals.totalProt}
            targetGrams={activePlan.metas.proteinasGramas}
            currentKcal={dailyTotals.protKcal}
            percentVet={dailyTotals.protPct}
            gKg={compliance.proteinaGKg}
            color="rose"
          />

          <MacroProgressBar
            label="Carboidratos Totais"
            currentGrams={dailyTotals.totalCarb}
            targetGrams={activePlan.metas.carboidratosGramas}
            currentKcal={dailyTotals.carbKcal}
            percentVet={dailyTotals.carbPct}
            color="amber"
          />

          <MacroProgressBar
            label="Gorduras / Lipídios"
            currentGrams={dailyTotals.totalGord}
            targetGrams={activePlan.metas.gordurasGramas}
            currentKcal={dailyTotals.gordKcal}
            percentVet={dailyTotals.gordPct}
            color="blue"
          />

          <MacroProgressBar
            label="Fibras Alimentares"
            currentGrams={dailyTotals.totalFibras}
            targetGrams={activePlan.metas.fibrasGramas}
            percentVet={Math.round((dailyTotals.totalFibras / 25) * 100)}
            color="emerald"
          />
        </div>

        {/* Painel de Micronutrientes (Se recurso ativo) */}
        {features.calculoMicronutrientesAutomatico && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-purple-700 dark:text-purple-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Painel de Micronutrientes Essenciais (Somatório TACO/IBGE)</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">Valores de Referência DRI/IOM</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono">
              <div className="bg-purple-50/50 dark:bg-purple-950/20 p-2 rounded-lg border border-purple-100 dark:border-purple-900/30">
                <span className="text-[10px] text-slate-500 block font-sans">Cálcio</span>
                <strong className="text-purple-900 dark:text-purple-200">{dailyTotals.totalCalcio} mg</strong>
                <span className="text-[10px] text-slate-400 block font-sans">Meta: ~1.000mg</span>
              </div>

              <div className="bg-purple-50/50 dark:bg-purple-950/20 p-2 rounded-lg border border-purple-100 dark:border-purple-900/30">
                <span className="text-[10px] text-slate-500 block font-sans">Ferro</span>
                <strong className="text-purple-900 dark:text-purple-200">{dailyTotals.totalFerro} mg</strong>
                <span className="text-[10px] text-slate-400 block font-sans">Meta: ~8-18mg</span>
              </div>

              <div className="bg-purple-50/50 dark:bg-purple-950/20 p-2 rounded-lg border border-purple-100 dark:border-purple-900/30">
                <span className="text-[10px] text-slate-500 block font-sans">Sódio</span>
                <strong className="text-purple-900 dark:text-purple-200">{dailyTotals.totalSodio} mg</strong>
                <span className="text-[10px] text-slate-400 block font-sans">Limite: &lt;2.000mg</span>
              </div>

              <div className="bg-purple-50/50 dark:bg-purple-950/20 p-2 rounded-lg border border-purple-100 dark:border-purple-900/30">
                <span className="text-[10px] text-slate-500 block font-sans">Potássio</span>
                <strong className="text-purple-900 dark:text-purple-200">{dailyTotals.totalPotassio} mg</strong>
                <span className="text-[10px] text-slate-400 block font-sans">Meta: ~3.500mg</span>
              </div>

              <div className="bg-purple-50/50 dark:bg-purple-950/20 p-2 rounded-lg border border-purple-100 dark:border-purple-900/30">
                <span className="text-[10px] text-slate-500 block font-sans">Vitamina C</span>
                <strong className="text-purple-900 dark:text-purple-200">{dailyTotals.totalVitC} mg</strong>
                <span className="text-[10px] text-slate-400 block font-sans">Meta: ~75-90mg</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 7. Lista de Refeições Interativas */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Refeições do Plano ({primaryMeals.length})</span>
          </h2>

          <button
            onClick={() => setShowAddMealForm(!showAddMealForm)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Refeição</span>
          </button>
        </div>

        {/* Modal / Inline form for new meal */}
        {showAddMealForm && (
          <form
            onSubmit={handleCreateMeal}
            className="bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl p-4 flex flex-wrap items-end gap-3 animate-in fade-in duration-200"
          >
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Nome da Refeição:
              </label>
              <input
                type="text"
                placeholder="Ex: Ceia Proteica, Pré-Treino Imediato..."
                value={newMealName}
                onChange={(e) => setNewMealName(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="w-28">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Horário:
              </label>
              <input
                type="time"
                value={newMealTime}
                onChange={(e) => setNewMealTime(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>

            <div className="w-20">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Ícone:
              </label>
              <select
                value={newMealIcon}
                onChange={(e) => setNewMealIcon(e.target.value)}
                className="w-full px-2 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              >
                <option value="☀️">☀️</option>
                <option value="🍎">🍎</option>
                <option value="🍲">🍲</option>
                <option value="⚡">⚡</option>
                <option value="🌙">🌙</option>
                <option value="🍵">🍵</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Salvar Refeição
              </button>
              <button
                type="button"
                onClick={() => setShowAddMealForm(false)}
                className="px-3 py-2 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs rounded-xl"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        {/* Meal Cards */}
        <div className="space-y-4">
          {primaryMeals.map((meal) => {
            const mealTotals = calculateMealTotals(meal.alimentos);
            const mealVetPct = dailyTotals.totalKcal > 0 ? Math.round((mealTotals.calorias / dailyTotals.totalKcal) * 100) : 0;

            return (
              <div
                key={meal.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs"
              >
                {/* Meal Header */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{meal.icone}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                          {meal.nome}
                        </h3>
                        <div className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          <Clock className="w-3 h-3" />
                          <span>{meal.horarioSugerido}</span>
                        </div>
                      </div>
                      <span className="text-xs text-slate-400 font-mono">
                        {meal.alimentos.length} alimentos cadastrados
                      </span>
                    </div>
                  </div>

                  {/* Meal Totals & Action */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="text-right font-mono text-xs">
                      <div className="font-bold text-amber-600 dark:text-amber-400 flex items-center justify-end gap-1">
                        <Flame className="w-3.5 h-3.5" />
                        <span>{mealTotals.calorias} kcal</span>
                        <span className="text-[10px] text-slate-400 font-sans">({mealVetPct}% VET)</span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        P: {mealTotals.proteinas}g | C: {mealTotals.carboidratos}g | G: {mealTotals.gorduras}g
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenFoodDb(meal.id, meal.nome)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1 shadow-xs transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Adicionar Alimento (TACO)
                    </button>

                    <button
                      onClick={() => removeMealSection(meal.id)}
                      title="Excluir esta refeição"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Foods List */}
                <div className="p-4 space-y-2.5">
                  {meal.alimentos.length === 0 ? (
                    <div className="text-center py-6 text-slate-400 text-xs">
                      Nenhum alimento adicionado nesta refeição. Clique em &quot;Adicionar Alimento (TACO)&quot;.
                    </div>
                  ) : (
                    meal.alimentos.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900 dark:text-white">
                              {item.nome}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                            {item.quantidadeGramas}g • <span className="text-slate-700 dark:text-slate-300 font-sans">{item.medidaCaseiraTexto}</span>
                          </div>
                          {item.observacao && (
                            <div className="text-[11px] text-emerald-700 dark:text-emerald-400 italic">
                              💡 {item.observacao}
                            </div>
                          )}
                        </div>

                        {/* Edit quantity, macros and substitutions */}
                        <div className="flex items-center gap-3 self-end sm:self-center">
                          <div className="flex items-center gap-1 bg-white dark:bg-slate-800 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                            <span className="text-[10px] text-slate-400">G:</span>
                            <input
                              type="number"
                              min="1"
                              max="2000"
                              value={item.quantidadeGramas}
                              onChange={(e) => updateFoodQuantity(meal.id, item.id, Number(e.target.value))}
                              className="w-14 text-xs font-mono font-bold text-center bg-transparent text-slate-900 dark:text-white focus:outline-none"
                            />
                            <span className="text-[10px] font-mono text-slate-400">g</span>
                          </div>

                          <div className="text-right font-mono text-xs">
                            <div className="font-bold text-amber-600 dark:text-amber-400">
                              {item.calorias} kcal
                            </div>
                            <div className="text-[10px] text-slate-400">
                              P: {item.proteinas}g | C: {item.carboidratos}g | G: {item.gorduras}g
                            </div>
                          </div>

                          {/* Substitutions trigger button */}
                          {features.sistemaEquivalenciaIsocalorica && (
                            <button
                              onClick={() => handleOpenSubModal(meal.id, item)}
                              title="Ver opções de substituições equivalentes isocalóricas"
                              className="px-2.5 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                            >
                              <ArrowRightLeft className="w-3 h-3" />
                              <span>Substitutos</span>
                            </button>
                          )}

                          <button
                            onClick={() => removeFoodFromMeal(meal.id, item.id)}
                            title="Remover alimento"
                            className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 8. Modais do Sistema */}
      {/* Modal de Banco de Alimentos TACO */}
      <FoodDatabaseModal
        isOpen={isFoodDbOpen}
        onClose={() => {
          setIsFoodDbOpen(false);
          setTargetMealForFoodDb(null);
        }}
        targetMealId={targetMealForFoodDb?.id || null}
        targetMealName={targetMealForFoodDb?.name || ''}
        onAddFood={addFoodToMeal}
      />

      {/* Modal de Substituições Inteligentes */}
      <FoodSubstitutionModal
        isOpen={isSubModalOpen}
        onClose={() => {
          setIsSubModalOpen(false);
          setSubModalData(null);
        }}
        mealId={subModalData?.mealId || ''}
        foodItem={subModalData?.foodItem || null}
        onSelectSubstitution={replaceFoodWithSubstitution}
      />

      {/* Modal de Lista de Compras */}
      <GroceryListModal
        isOpen={isGroceryModalOpen}
        onClose={() => setIsGroceryModalOpen(false)}
        refeicoes={primaryMeals}
        pacienteNome={activePlan.pacienteNome}
      />

      {/* Modal de Impressão Clínica em PDF */}
      <MealPlanPrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        plan={activePlan}
      />
    </div>
  );
};
