export type FoodCategory =
  | 'cereais_tuberculos'
  | 'carnes_aves'
  | 'peixes_frutos_mar'
  | 'ovos'
  | 'laticinios_derivados'
  | 'leguminosas'
  | 'verduras_legumes'
  | 'frutas'
  | 'oleaginosas_sementes'
  | 'oleos_gorduras'
  | 'paes_farinaceos'
  | 'suplementos_shakes'
  | 'bebidas_infusoes';

export type GlycemicIndex = 'baixo' | 'medio' | 'alto';

export type FoodRestriction =
  | 'sem_gluten'
  | 'sem_lactose'
  | 'vegano'
  | 'vegetariano'
  | 'low_fodmap'
  | 'hipossodico'
  | 'sem_acucar';

export interface FoodItemData {
  id: string;
  nome: string;
  categoria: FoodCategory;
  fonte: 'TACO/UNICAMP' | 'IBGE/POF' | 'USDA' | 'Rotulagem Clínica';
  porcaoPadraoGramas: number;
  medidaCaseiraPadrao: string;
  caloriasKcal: number; // por 100g
  proteinasG: number;   // por 100g
  carboidratosG: number;// por 100g
  gordurasTotaisG: number; // por 100g
  gordurasSaturadasG?: number; // por 100g
  fibrasG: number;      // por 100g
  sodioMg: number;      // por 100g
  calcioMg?: number;    // por 100g
  ferroMg?: number;     // por 100g
  potassioMg?: number;  // por 100g
  magnesioMg?: number;  // por 100g
  zincoMg?: number;     // por 100g
  vitaminaCMg?: number; // por 100g
  vitaminaAMcg?: number;// por 100g
  indiceGlicemico?: GlycemicIndex;
  restricoes: FoodRestriction[];
  alergenicos?: string[];
  dicaPreparo?: string;
}

export interface MealFoodItem {
  id: string;
  foodId: string;
  nome: string;
  quantidadeGramas: number;
  medidaCaseiraTexto: string;
  calorias: number;
  proteinas: number;
  carboidratos: number;
  gorduras: number;
  fibras: number;
  sodioMg: number;
  calcioMg?: number;
  ferroMg?: number;
  potassioMg?: number;
  vitaminaCMg?: number;
  substituicoesSugeridas?: FoodSubstitution[];
  observacao?: string;
}

export interface FoodSubstitution {
  id: string;
  foodId: string;
  nome: string;
  quantidadeGramas: number;
  medidaCaseiraTexto: string;
  calorias: number;
  proteinas: number;
  carboidratos: number;
  gorduras: number;
  diferencaCaloricaPercent: number;
  razaoClinica: string;
}

export interface MealSection {
  id: string;
  nome: string; // Ex: Café da Manhã, Colação, Almoço, Lanche da Tarde, Jantar, Ceia
  horarioSugerido: string; // Ex: "07:30"
  icone: string;
  metaCaloriasPercent: number; // Ex: 25% do VET
  alimentos: MealFoodItem[];
  orientacoesEspecificas?: string;
}

export interface MealPlanDay {
  id: string;
  nome: string; // Ex: "Plano Padrão (Seg a Sex)", "Dia de Treino Pesado", "Fim de Semana"
  descricao: string;
  refeicoes: MealSection[];
}

export interface MacroDistribution {
  caloriasAlvo: number;
  proteinasGramas: number;
  proteinasPercent: number;
  proteinasGKg: number;
  carboidratosGramas: number;
  carboidratosPercent: number;
  carboidratosGKg: number;
  gordurasGramas: number;
  gordurasPercent: number;
  gordurasGKg: number;
  fibrasGramas: number;
  aguaMl: number;
}

export interface MealPlan {
  id: string;
  pacienteId: string;
  pacienteNome: string;
  pacienteSexo: 'M' | 'F';
  pacienteIdade: number;
  pacientePesoKg: number;
  pacienteAlturaCm: number;
  tmbKcal: number;
  getKcal: number;
  objetivoClinico: 'hipertrofia' | 'emagrecimento' | 'recomposicao' | 'manutencao' | 'saude_metabolica' | 'cetogenica' | 'vegetariana';
  tituloPlano: string;
  estrategiaNutricional: string;
  dataCriacao: string;
  dataValidade?: string;
  profissionalNome: string;
  profissionalCrn: string;
  metas: MacroDistribution;
  dias: MealPlanDay[];
  orientacoesGerais: string[];
  listaSubstituicoesGeraisHabilitada: boolean;
  status: 'rascunho' | 'ativo' | 'arquivado';
  sincronizadoComAppPaciente: boolean;
}

export interface MealPlanAdvancedFeaturesState {
  calculoMicronutrientesAutomatico: boolean;
  alertasDeficitProteico: boolean;
  sistemaEquivalenciaIsocalorica: boolean;
  listaComprasAutomatica: boolean;
  exportacaoPdfClinico: boolean;
  sincronizacaoAppPaciente: boolean;
  alertasAlergenicosGlutenLactose: boolean;
  orientacaoHidratacaoPersonalizada: boolean;
  crononutricaoTimingNutrientes: boolean;
  assistenteCardapioClinico: boolean;
}

export interface GroceryCategoryGroup {
  categoriaNome: string;
  icone: string;
  itens: Array<{
    id: string;
    nome: string;
    quantidadeTotalGramas: number;
    medidaCaseiraResumo: string;
    comprado: boolean;
  }>;
}
