import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  MealPlan,
  MealPlanAdvancedFeaturesState,
  MealSection,
  MealFoodItem,
  FoodItemData,
  FoodSubstitution
} from '../types/mealPlan';
import {
  TEMPLATE_HIPERTROFIA,
  CLINICAL_MEAL_PLAN_TEMPLATES
} from '../data/mealPlanTemplatesData';
import { TACO_FOODS_DATABASE } from '../data/tacoFoodsData';
import {
  calculateFoodNutrients,
  calculateDailyTotals,
  findSmartSubstitutions,
  calculateIdealHydration
} from '../utils/nutritionCalculations';
import { SYNTHETIC_PATIENTS } from '../data/syntheticPatientsData';

export const DEFAULT_MEAL_PLAN_FEATURES: MealPlanAdvancedFeaturesState = {
  calculoMicronutrientesAutomatico: true,
  alertasDeficitProteico: true,
  sistemaEquivalenciaIsocalorica: true,
  listaComprasAutomatica: true,
  exportacaoPdfClinico: true,
  sincronizacaoAppPaciente: true,
  alertasAlergenicosGlutenLactose: true,
  orientacaoHidratacaoPersonalizada: true,
  crononutricaoTimingNutrientes: true,
  assistenteCardapioClinico: true
};

interface MealPlanContextType {
  activePlan: MealPlan;
  features: MealPlanAdvancedFeaturesState;
  allFeaturesActive: boolean;
  activeFeaturesCount: number;
  totalFeaturesCount: number;
  toggleFeature: (key: keyof MealPlanAdvancedFeaturesState) => void;
  activateAllFeatures: () => void;
  deactivateAllFeatures: () => void;
  
  // Ações no plano
  updatePlanMetadata: (fields: Partial<MealPlan>) => void;
  addMealSection: (nome: string, horario: string, icone: string) => void;
  removeMealSection: (mealId: string) => void;
  updateMealSection: (mealId: string, fields: Partial<MealSection>) => void;
  addFoodToMeal: (mealId: string, food: FoodItemData, grams: number, customObs?: string) => void;
  removeFoodFromMeal: (mealId: string, foodItemId: string) => void;
  updateFoodQuantity: (mealId: string, foodItemId: string, newGrams: number) => void;
  replaceFoodWithSubstitution: (mealId: string, oldFoodItemId: string, sub: FoodSubstitution) => void;
  
  // Templates & Pacientes
  applyTemplate: (templateId: string) => void;
  selectPatientProfile: (patientId: string) => void;
  resetToDefault: () => void;
  
  // Totais calculados
  dailyTotals: ReturnType<typeof calculateDailyTotals>;
}

const MealPlanContext = createContext<MealPlanContextType | undefined>(undefined);

const STORAGE_FEATURES_KEY = 'nutri_saas_meal_plan_features';
const STORAGE_ACTIVE_PLAN_KEY = 'nutri_saas_active_meal_plan';

export const MealPlanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [features, setFeatures] = useState<MealPlanAdvancedFeaturesState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_FEATURES_KEY);
      if (saved) {
        return { ...DEFAULT_MEAL_PLAN_FEATURES, ...JSON.parse(saved) };
      }
    } catch {
      // fallback
    }
    return DEFAULT_MEAL_PLAN_FEATURES;
  });

  const [activePlan, setActivePlan] = useState<MealPlan>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ACTIVE_PLAN_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return TEMPLATE_HIPERTROFIA;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_FEATURES_KEY, JSON.stringify(features));
    } catch {
      // ignore
    }
  }, [features]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ACTIVE_PLAN_KEY, JSON.stringify(activePlan));
    } catch {
      // ignore
    }
  }, [activePlan]);

  const activeFeaturesCount = Object.values(features).filter(Boolean).length;
  const totalFeaturesCount = Object.keys(DEFAULT_MEAL_PLAN_FEATURES).length;
  const allFeaturesActive = activeFeaturesCount === totalFeaturesCount;

  const toggleFeature = (key: keyof MealPlanAdvancedFeaturesState) => {
    setFeatures(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const activateAllFeatures = () => {
    setFeatures({
      calculoMicronutrientesAutomatico: true,
      alertasDeficitProteico: true,
      sistemaEquivalenciaIsocalorica: true,
      listaComprasAutomatica: true,
      exportacaoPdfClinico: true,
      sincronizacaoAppPaciente: true,
      alertasAlergenicosGlutenLactose: true,
      orientacaoHidratacaoPersonalizada: true,
      crononutricaoTimingNutrientes: true,
      assistenteCardapioClinico: true
    });
  };

  const deactivateAllFeatures = () => {
    const turnedOff = Object.keys(DEFAULT_MEAL_PLAN_FEATURES).reduce((acc, k) => {
      acc[k as keyof MealPlanAdvancedFeaturesState] = false;
      return acc;
    }, {} as MealPlanAdvancedFeaturesState);
    setFeatures(turnedOff);
  };

  const updatePlanMetadata = (fields: Partial<MealPlan>) => {
    setActivePlan(prev => ({ ...prev, ...fields }));
  };

  const addMealSection = (nome: string, horario: string, icone: string) => {
    const newMeal: MealSection = {
      id: `meal-${Date.now()}`,
      nome,
      horarioSugerido: horario,
      icone,
      metaCaloriasPercent: 15,
      alimentos: []
    };

    setActivePlan(prev => {
      const updatedDays = [...prev.dias];
      if (updatedDays.length > 0) {
        updatedDays[0] = {
          ...updatedDays[0],
          refeicoes: [...updatedDays[0].refeicoes, newMeal]
        };
      }
      return { ...prev, dias: updatedDays };
    });
  };

  const removeMealSection = (mealId: string) => {
    setActivePlan(prev => {
      const updatedDays = [...prev.dias];
      if (updatedDays.length > 0) {
        updatedDays[0] = {
          ...updatedDays[0],
          refeicoes: updatedDays[0].refeicoes.filter(m => m.id !== mealId)
        };
      }
      return { ...prev, dias: updatedDays };
    });
  };

  const updateMealSection = (mealId: string, fields: Partial<MealSection>) => {
    setActivePlan(prev => {
      const updatedDays = [...prev.dias];
      if (updatedDays.length > 0) {
        updatedDays[0] = {
          ...updatedDays[0],
          refeicoes: updatedDays[0].refeicoes.map(m => (m.id === mealId ? { ...m, ...fields } : m))
        };
      }
      return { ...prev, dias: updatedDays };
    });
  };

  const addFoodToMeal = (mealId: string, food: FoodItemData, grams: number, customObs?: string) => {
    const newItem = calculateFoodNutrients(food, grams, customObs);

    // Adiciona substituições inteligentes se o recurso estiver ativo
    if (features.sistemaEquivalenciaIsocalorica) {
      newItem.substituicoesSugeridas = findSmartSubstitutions(food.id, grams, 4);
    }

    setActivePlan(prev => {
      const updatedDays = [...prev.dias];
      if (updatedDays.length > 0) {
        updatedDays[0] = {
          ...updatedDays[0],
          refeicoes: updatedDays[0].refeicoes.map(m => {
            if (m.id === mealId) {
              return { ...m, alimentos: [...m.alimentos, newItem] };
            }
            return m;
          })
        };
      }
      return { ...prev, dias: updatedDays };
    });
  };

  const removeFoodFromMeal = (mealId: string, foodItemId: string) => {
    setActivePlan(prev => {
      const updatedDays = [...prev.dias];
      if (updatedDays.length > 0) {
        updatedDays[0] = {
          ...updatedDays[0],
          refeicoes: updatedDays[0].refeicoes.map(m => {
            if (m.id === mealId) {
              return { ...m, alimentos: m.alimentos.filter(f => f.id !== foodItemId) };
            }
            return m;
          })
        };
      }
      return { ...prev, dias: updatedDays };
    });
  };

  const updateFoodQuantity = (mealId: string, foodItemId: string, newGrams: number) => {
    setActivePlan(prev => {
      const updatedDays = [...prev.dias];
      if (updatedDays.length > 0) {
        updatedDays[0] = {
          ...updatedDays[0],
          refeicoes: updatedDays[0].refeicoes.map(m => {
            if (m.id === mealId) {
              return {
                ...m,
                alimentos: m.alimentos.map(item => {
                  if (item.id === foodItemId) {
                    const originalFood = TACO_FOODS_DATABASE.find(f => f.id === item.foodId);
                    if (!originalFood) return item;
                    const recalculated = calculateFoodNutrients(originalFood, newGrams, item.observacao);
                    if (features.sistemaEquivalenciaIsocalorica) {
                      recalculated.substituicoesSugeridas = findSmartSubstitutions(originalFood.id, newGrams, 4);
                    }
                    return recalculated;
                  }
                  return item;
                })
              };
            }
            return m;
          })
        };
      }
      return { ...prev, dias: updatedDays };
    });
  };

  const replaceFoodWithSubstitution = (
    mealId: string,
    oldFoodItemId: string,
    sub: FoodSubstitution
  ) => {
    const subFood = TACO_FOODS_DATABASE.find(f => f.id === sub.foodId);
    if (!subFood) return;

    const newItem = calculateFoodNutrients(subFood, sub.quantidadeGramas, `Substituição: ${sub.razaoClinica}`);
    if (features.sistemaEquivalenciaIsocalorica) {
      newItem.substituicoesSugeridas = findSmartSubstitutions(subFood.id, sub.quantidadeGramas, 4);
    }

    setActivePlan(prev => {
      const updatedDays = [...prev.dias];
      if (updatedDays.length > 0) {
        updatedDays[0] = {
          ...updatedDays[0],
          refeicoes: updatedDays[0].refeicoes.map(m => {
            if (m.id === mealId) {
              return {
                ...m,
                alimentos: m.alimentos.map(f => (f.id === oldFoodItemId ? newItem : f))
              };
            }
            return m;
          })
        };
      }
      return { ...prev, dias: updatedDays };
    });
  };

  const applyTemplate = (templateId: string) => {
    const tpl = CLINICAL_MEAL_PLAN_TEMPLATES.find(t => t.id === templateId);
    if (tpl) {
      setActivePlan(tpl);
    }
  };

  const selectPatientProfile = (patientId: string) => {
    const p = SYNTHETIC_PATIENTS.find(item => item.id === patientId);
    if (!p) return;

    const idealWater = calculateIdealHydration(p.peso, p.categoriaClinica === 'esportiva');

    setActivePlan(prev => ({
      ...prev,
      pacienteId: p.id,
      pacienteNome: p.nome,
      pacienteSexo: p.sexo as 'M' | 'F',
      pacienteIdade: p.idade,
      pacientePesoKg: p.peso,
      pacienteAlturaCm: p.altura,
      tmbKcal: p.tmbKcal,
      getKcal: p.getKcal,
      metas: {
        ...prev.metas,
        aguaMl: idealWater
      }
    }));
  };

  const resetToDefault = () => {
    setActivePlan(TEMPLATE_HIPERTROFIA);
  };

  const primaryMeals = activePlan.dias[0]?.refeicoes || [];
  const dailyTotals = calculateDailyTotals(primaryMeals);

  return (
    <MealPlanContext.Provider
      value={{
        activePlan,
        features,
        allFeaturesActive,
        activeFeaturesCount,
        totalFeaturesCount,
        toggleFeature,
        activateAllFeatures,
        deactivateAllFeatures,
        updatePlanMetadata,
        addMealSection,
        removeMealSection,
        updateMealSection,
        addFoodToMeal,
        removeFoodFromMeal,
        updateFoodQuantity,
        replaceFoodWithSubstitution,
        applyTemplate,
        selectPatientProfile,
        resetToDefault,
        dailyTotals
      }}
    >
      {children}
    </MealPlanContext.Provider>
  );
};

export const useMealPlan = () => {
  const context = useContext(MealPlanContext);
  if (!context) {
    throw new Error('useMealPlan must be used within a MealPlanProvider');
  }
  return context;
};
