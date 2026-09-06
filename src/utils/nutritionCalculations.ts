import {
  FoodItemData,
  MealFoodItem,
  MealSection,
  FoodSubstitution,
  GroceryCategoryGroup,
  MacroDistribution,
  MealPlan
} from '../types/mealPlan';
import { TACO_FOODS_DATABASE, FOOD_CATEGORIES_METADATA } from '../data/tacoFoodsData';

/**
 * Calcula de forma determinística os macro e micronutrientes exatos para uma quantidade em gramas.
 */
export function calculateFoodNutrients(
  food: FoodItemData,
  grams: number,
  customObservation?: string
): MealFoodItem {
  const factor = Math.max(0, grams) / 100;

  return {
    id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    foodId: food.id,
    nome: food.nome,
    quantidadeGramas: Math.round(grams),
    medidaCaseiraTexto:
      grams === food.porcaoPadraoGramas
        ? food.medidaCaseiraPadrao
        : `${grams}g (~${(grams / food.porcaoPadraoGramas).toFixed(1)}x porção padrão: ${food.medidaCaseiraPadrao})`,
    calorias: Math.round(food.caloriasKcal * factor),
    proteinas: Number((food.proteinasG * factor).toFixed(1)),
    carboidratos: Number((food.carboidratosG * factor).toFixed(1)),
    gorduras: Number((food.gordurasTotaisG * factor).toFixed(1)),
    fibras: Number((food.fibrasG * factor).toFixed(1)),
    sodioMg: Math.round(food.sodioMg * factor),
    calcioMg: food.calcioMg ? Math.round(food.calcioMg * factor) : undefined,
    ferroMg: food.ferroMg ? Number((food.ferroMg * factor).toFixed(1)) : undefined,
    potassioMg: food.potassioMg ? Math.round(food.potassioMg * factor) : undefined,
    vitaminaCMg: food.vitaminaCMg ? Number((food.vitaminaCMg * factor).toFixed(1)) : undefined,
    observacao: customObservation || food.dicaPreparo
  };
}

/**
 * Calcula os totais somados de uma refeição.
 */
export function calculateMealTotals(alimentos: MealFoodItem[]) {
  return alimentos.reduce(
    (acc, item) => ({
      calorias: acc.calorias + item.calorias,
      proteinas: Number((acc.proteinas + item.proteinas).toFixed(1)),
      carboidratos: Number((acc.carboidratos + item.carboidratos).toFixed(1)),
      gorduras: Number((acc.gorduras + item.gorduras).toFixed(1)),
      fibras: Number((acc.fibras + item.fibras).toFixed(1)),
      sodioMg: acc.sodioMg + item.sodioMg,
      calcioMg: acc.calcioMg + (item.calcioMg || 0),
      ferroMg: Number((acc.ferroMg + (item.ferroMg || 0)).toFixed(1)),
      potassioMg: acc.potassioMg + (item.potassioMg || 0),
      vitaminaCMg: Number((acc.vitaminaCMg + (item.vitaminaCMg || 0)).toFixed(1))
    }),
    {
      calorias: 0,
      proteinas: 0,
      carboidratos: 0,
      gorduras: 0,
      fibras: 0,
      sodioMg: 0,
      calcioMg: 0,
      ferroMg: 0,
      potassioMg: 0,
      vitaminaCMg: 0
    }
  );
}

/**
 * Calcula os totais somados de todas as refeições do dia e suas porcentagens calóricas.
 */
export function calculateDailyTotals(refeicoes: MealSection[]) {
  let totalKcal = 0;
  let totalProt = 0;
  let totalCarb = 0;
  let totalGord = 0;
  let totalFibras = 0;
  let totalSodio = 0;
  let totalCalcio = 0;
  let totalFerro = 0;
  let totalPotassio = 0;
  let totalVitC = 0;

  refeicoes.forEach(meal => {
    const mealTot = calculateMealTotals(meal.alimentos);
    totalKcal += mealTot.calorias;
    totalProt += mealTot.proteinas;
    totalCarb += mealTot.carboidratos;
    totalGord += mealTot.gorduras;
    totalFibras += mealTot.fibras;
    totalSodio += mealTot.sodioMg;
    totalCalcio += mealTot.calcioMg;
    totalFerro += mealTot.ferroMg;
    totalPotassio += mealTot.potassioMg;
    totalVitC += mealTot.vitaminaCMg;
  });

  totalProt = Number(totalProt.toFixed(1));
  totalCarb = Number(totalCarb.toFixed(1));
  totalGord = Number(totalGord.toFixed(1));
  totalFibras = Number(totalFibras.toFixed(1));
  totalFerro = Number(totalFerro.toFixed(1));
  totalVitC = Number(totalVitC.toFixed(1));

  // % do VET pelos 4-4-9 Atwater factors
  const protKcal = totalProt * 4;
  const carbKcal = totalCarb * 4;
  const gordKcal = totalGord * 9;
  const atwaterSum = Math.max(1, protKcal + carbKcal + gordKcal);

  const protPct = Math.round((protKcal / atwaterSum) * 100);
  const carbPct = Math.round((carbKcal / atwaterSum) * 100);
  const gordPct = Math.max(0, 100 - protPct - carbPct);

  return {
    totalKcal,
    totalProt,
    totalCarb,
    totalGord,
    totalFibras,
    totalSodio,
    totalCalcio,
    totalFerro,
    totalPotassio,
    totalVitC,
    protPct,
    carbPct,
    gordPct,
    protKcal,
    carbKcal,
    gordKcal
  };
}

/**
 * Busca alimentos equivalentes do mesmo grupo ou macronutriente dominante
 * e calcula a gramatura isocalórica equivalente.
 */
export function findSmartSubstitutions(
  sourceFoodId: string,
  sourceGrams: number,
  maxOptions: number = 4
): FoodSubstitution[] {
  const sourceFood = TACO_FOODS_DATABASE.find(f => f.id === sourceFoodId);
  if (!sourceFood) return [];

  const sourceNutrients = calculateFoodNutrients(sourceFood, sourceGrams);
  const targetKcal = Math.max(1, sourceNutrients.calorias);

  // Alimentos da mesma categoria ou categoria similar
  const candidates = TACO_FOODS_DATABASE.filter(f => {
    if (f.id === sourceFood.id) return false;
    if (f.categoria === sourceFood.categoria) return true;

    // Cross-categories úteis
    if (sourceFood.categoria === 'carnes_aves' && (f.categoria === 'peixes_frutos_mar' || f.categoria === 'ovos')) return true;
    if (sourceFood.categoria === 'peixes_frutos_mar' && (f.categoria === 'carnes_aves' || f.categoria === 'ovos')) return true;
    if (sourceFood.categoria === 'ovos' && (f.categoria === 'carnes_aves' || f.categoria === 'laticinios_derivados')) return true;
    if (sourceFood.categoria === 'cereais_tuberculos' && f.categoria === 'paes_farinaceos') return true;
    if (sourceFood.categoria === 'paes_farinaceos' && f.categoria === 'cereais_tuberculos') return true;

    return false;
  });

  const substitutions: FoodSubstitution[] = [];

  for (const cand of candidates) {
    if (cand.caloriasKcal <= 0) continue;

    // Gramatura para atingir as calorias alvo
    const requiredGrams = Math.round((targetKcal / cand.caloriasKcal) * 100);
    if (requiredGrams < 5 || requiredGrams > 500) continue;

    const candNutrients = calculateFoodNutrients(cand, requiredGrams);
    const diffPercent = Math.round(((candNutrients.calorias - targetKcal) / targetKcal) * 100);

    let razaoClinica = `Equivalência isocalórica do grupo ${FOOD_CATEGORIES_METADATA[cand.categoria]?.label || cand.categoria}.`;
    if (cand.proteinasG >= 20 && sourceFood.proteinasG >= 20) {
      razaoClinica = `Substituto isoproteico (${candNutrients.proteinas}g de proteína).`;
    } else if (cand.fibrasG >= 5) {
      razaoClinica = `Opção rica em fibras (${candNutrients.fibras}g de fibras alimentares).`;
    } else if (cand.restricoes.includes('sem_lactose')) {
      razaoClinica = 'Opção sem lactose e de fácil digestão gástrica.';
    }

    substitutions.push({
      id: `sub-${cand.id}-${Date.now()}`,
      foodId: cand.id,
      nome: cand.nome,
      quantidadeGramas: requiredGrams,
      medidaCaseiraTexto: candNutrients.medidaCaseiraTexto,
      calorias: candNutrients.calorias,
      proteinas: candNutrients.proteinas,
      carboidratos: candNutrients.carboidratos,
      gorduras: candNutrients.gorduras,
      diferencaCaloricaPercent: diffPercent,
      razaoClinica
    });

    if (substitutions.length >= maxOptions) break;
  }

  return substitutions;
}

/**
 * Gera lista de compras agrupada por setor de mercado para 7 dias ou N dias.
 */
export function generateGroceryListFromMealPlan(
  refeicoes: MealSection[],
  daysMultiplier: number = 7
): GroceryCategoryGroup[] {
  const aggregatedMap: Map<string, { food: FoodItemData; totalGrams: number }> = new Map();

  refeicoes.forEach(meal => {
    meal.alimentos.forEach(item => {
      const food = TACO_FOODS_DATABASE.find(f => f.id === item.foodId);
      if (!food) return;

      const current = aggregatedMap.get(food.id);
      const addGrams = item.quantidadeGramas * daysMultiplier;

      if (current) {
        current.totalGrams += addGrams;
      } else {
        aggregatedMap.set(food.id, { food, totalGrams: addGrams });
      }
    });
  });

  const categoryGroups: Record<string, GroceryCategoryGroup> = {};

  aggregatedMap.forEach(({ food, totalGrams }) => {
    const meta = FOOD_CATEGORIES_METADATA[food.categoria] || {
      label: 'Outros Alimentos',
      icon: '🛒'
    };

    if (!categoryGroups[food.categoria]) {
      categoryGroups[food.categoria] = {
        categoriaNome: meta.label,
        icone: meta.icon,
        itens: []
      };
    }

    let medidaResumo = `${totalGrams}g`;
    if (totalGrams >= 1000) {
      medidaResumo = `${(totalGrams / 1000).toFixed(2)} kg`;
    }

    categoryGroups[food.categoria].itens.push({
      id: `groc-${food.id}`,
      nome: food.nome,
      quantidadeTotalGramas: totalGrams,
      medidaCaseiraResumo: medidaResumo,
      comprado: false
    });
  });

  return Object.values(categoryGroups);
}

/**
 * Calcula a meta de hidratação clínica recomendada (35ml a 45ml por kg de peso).
 */
export function calculateIdealHydration(weightKg: number, isAthlete: boolean = false): number {
  const mlPerKg = isAthlete ? 45 : 35;
  return Math.round(weightKg * mlPerKg);
}

/**
 * Validação clínica de conformidade do plano alimentar.
 */
export interface ClinicalComplianceReport {
  scoreGeral: number; // 0 a 100
  proteinaGKg: number;
  statusProteico: 'adequado' | 'baixo' | 'elevado';
  mensagemProteina: string;
  fibrasStatus: 'adequado' | 'insuficiente';
  mensagemFibras: string;
  distribuicaoRefeicoesStatus: 'equilibrada' | 'desbalanceada';
  alertasCriticos: string[];
  pontosFortes: string[];
}

export function evaluateMealPlanCompliance(
  plan: MealPlan,
  currentTotals: ReturnType<typeof calculateDailyTotals>
): ClinicalComplianceReport {
  const peso = Math.max(30, plan.pacientePesoKg || 70);
  const protGKg = Number((currentTotals.totalProt / peso).toFixed(2));
  const alertas: string[] = [];
  const pontosFortes: string[] = [];

  let score = 85;

  // 1. Análise Proteica
  let statusProt: 'adequado' | 'baixo' | 'elevado' = 'adequado';
  let msgProt = `Aporte de ${protGKg} g/kg/dia encontra-se dentro da faixa recomendada para ${plan.objetivoClinico}.`;

  if (plan.objetivoClinico === 'hipertrofia' || plan.objetivoClinico === 'recomposicao') {
    if (protGKg < 1.6) {
      statusProt = 'baixo';
      score -= 15;
      msgProt = `Aporte de ${protGKg} g/kg está abaixo do ideal (1.6 a 2.2 g/kg) para hipertrofia/recomposição.`;
      alertas.push('Aporte proteico abaixo da meta recomendada para o estímulo hipertrófico.');
    } else {
      pontosFortes.push(`Proteínas em ${protGKg} g/kg otimizam a síntese proteica muscular (MPS).`);
    }
  } else if (plan.objetivoClinico === 'emagrecimento') {
    if (protGKg < 1.4) {
      statusProt = 'baixo';
      score -= 10;
      msgProt = `Recomenda-se elevar as proteínas para 1.5 - 2.0 g/kg para preservação de massa magra em déficit.`;
      alertas.push('Proteína pode ser ajustada para cima para aumentar o efeito térmico (TEF) e a saciedade.');
    } else {
      pontosFortes.push('Excelente suporte proteico para preservação da massa livre de gordura (FFM).');
    }
  }

  // 2. Fibras
  let statusFibras: 'adequado' | 'insuficiente' = 'adequado';
  let msgFibras = `${currentTotals.totalFibras}g de fibras alimentares ao dia (Meta OMS: ≥ 25g/dia).`;
  if (currentTotals.totalFibras < 20) {
    statusFibras = 'insuficiente';
    score -= 10;
    msgFibras = `Fibras em ${currentTotals.totalFibras}g/dia estão abaixo da recomendação mínima da OMS (25g/dia).`;
    alertas.push('Aumente leguminosas, aveia, frutas com casca e vegetais para atingir 25g de fibras.');
  } else {
    pontosFortes.push('Aporte de fibras robusto garantindo saciedade e saúde da microbiota intestinal.');
  }

  // 3. Distribuição Energética
  const diferencaMetaKcal = Math.abs(currentTotals.totalKcal - plan.metas.caloriasAlvo);
  if (diferencaMetaKcal > 250) {
    alertas.push(`Diferença de ${diferencaMetaKcal} kcal em relação à meta energética prescrita (${plan.metas.caloriasAlvo} kcal).`);
    score -= 8;
  } else {
    pontosFortes.push(`Aderência calórica precisa (±${diferencaMetaKcal} kcal da meta energética VET).`);
  }

  return {
    scoreGeral: Math.max(40, Math.min(100, score)),
    proteinaGKg: protGKg,
    statusProteico: statusProt,
    mensagemProteina: msgProt,
    fibrasStatus: statusFibras,
    mensagemFibras: msgFibras,
    distribuicaoRefeicoesStatus: alertas.length === 0 ? 'equilibrada' : 'desbalanceada',
    alertasCriticos: alertas,
    pontosFortes
  };
}
