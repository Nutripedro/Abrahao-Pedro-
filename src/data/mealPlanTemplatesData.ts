import { MealPlan, MealPlanDay, MealSection } from '../types/mealPlan';
import { TACO_FOODS_DATABASE } from './tacoFoodsData';
import { calculateFoodNutrients } from '../utils/nutritionCalculations';

function getFood(id: string) {
  const f = TACO_FOODS_DATABASE.find(item => item.id === id);
  if (!f) throw new Error(`Food not found: ${id}`);
  return f;
}

// 1. TEMPLATE: Hipertrofia & Ganho Muscular Avançado (2.400 kcal)
export const TEMPLATE_HIPERTROFIA: MealPlan = {
  id: 'tpl-hipertrofia',
  pacienteId: 'syn-1',
  pacienteNome: 'Mariana Lima Santos',
  pacienteSexo: 'F',
  pacienteIdade: 28,
  pacientePesoKg: 62.8,
  pacienteAlturaCm: 165,
  tmbKcal: 1420,
  getKcal: 2130,
  objetivoClinico: 'hipertrofia',
  tituloPlano: 'Plano Hipertrófico com Timing Proteico Avançado',
  estrategiaNutricional: 'Superávit calórico controlado (+270 kcal) com 2.1g/kg de proteína e fracionamento em 5 refeições anabólicas.',
  dataCriacao: '2026-09-04',
  profissionalNome: 'Dra. Vanessa Mendonça',
  profissionalCrn: 'CRN-3 48.912/SP',
  metas: {
    caloriasAlvo: 2400,
    proteinasGramas: 132,
    proteinasPercent: 22,
    proteinasGKg: 2.1,
    carboidratosGramas: 330,
    carboidratosPercent: 55,
    carboidratosGKg: 5.25,
    gordurasGramas: 61,
    gordurasPercent: 23,
    gordurasGKg: 0.97,
    fibrasGramas: 32,
    aguaMl: 2800
  },
  dias: [
    {
      id: 'dia-1',
      nome: 'Plano Semanal (Segunda a Sábado)',
      descricao: 'Cardápio base com alto aporte proteico e reposição de glicogênio muscular.',
      refeicoes: [
        {
          id: 'meal-1',
          nome: 'Café da Manhã Anabólico',
          horarioSugerido: '07:30',
          icone: '☀️',
          metaCaloriasPercent: 22,
          orientacoesEspecificas: 'Consumir até 45 minutos após acordar.',
          alimentos: [
            calculateFoodNutrients(getFood('taco-20'), 100, '2 ovos inteiros mexidos com fio de azeite'),
            calculateFoodNutrients(getFood('taco-51'), 50, '2 fatias de pão integral tostado'),
            calculateFoodNutrients(getFood('taco-39'), 90, '1 banana média fatiada'),
            calculateFoodNutrients(getFood('taco-6'), 30, '2 colheres de sopa de aveia por cima da banana'),
            calculateFoodNutrients(getFood('taco-59'), 100, 'Café preto coado sem açúcar')
          ]
        },
        {
          id: 'meal-2',
          nome: 'Colação / Lanche Matutino',
          horarioSugerido: '10:30',
          icone: '🍎',
          metaCaloriasPercent: 12,
          orientacoesEspecificas: 'Opção prática no consultório/trabalho.',
          alimentos: [
            calculateFoodNutrients(getFood('taco-21'), 170, '1 pote de iogurte natural desnatado'),
            calculateFoodNutrients(getFood('taco-42'), 150, '8 morangos frescos picados'),
            calculateFoodNutrients(getFood('taco-45'), 10, '2 castanhas-do-pará (fonte de selênio)')
          ]
        },
        {
          id: 'meal-3',
          nome: 'Almoço Completo',
          horarioSugerido: '13:00',
          icone: '🍲',
          metaCaloriasPercent: 32,
          orientacoesEspecificas: 'Prato colorido com vegetais à vontade.',
          alimentos: [
            calculateFoodNutrients(getFood('taco-9'), 130, 'Filé de peito de frango grelhado bem temperado'),
            calculateFoodNutrients(getFood('taco-1'), 150, '1 concha média cheia de arroz branco'),
            calculateFoodNutrients(getFood('taco-28'), 130, '1 concha de feijão carioca'),
            calculateFoodNutrients(getFood('taco-35'), 100, 'Brócolis no vapor à vontade'),
            calculateFoodNutrients(getFood('taco-34'), 80, 'Salada de tomate com alface'),
            calculateFoodNutrients(getFood('taco-49'), 10, '1 colher de sopa rasa de azeite extravirgem cru')
          ]
        },
        {
          id: 'meal-4',
          nome: 'Lanche da Tarde / Pré-Treino',
          horarioSugerido: '16:30',
          icone: '⚡',
          metaCaloriasPercent: 16,
          orientacoesEspecificas: 'Consumir 60-90 minutos antes do treino de força.',
          alimentos: [
            calculateFoodNutrients(getFood('taco-3'), 150, '1 batata-doce média cozida'),
            calculateFoodNutrients(getFood('taco-55'), 30, '1 dosador de Whey Protein Isolado batido com 200ml de água gelada')
          ]
        },
        {
          id: 'meal-5',
          nome: 'Jantar & Recuperação Noturna',
          horarioSugerido: '20:00',
          icone: '🌙',
          metaCaloriasPercent: 18,
          orientacoesEspecificas: 'Refeição de fácil digestão para indução de sono reparador.',
          alimentos: [
            calculateFoodNutrients(getFood('taco-14'), 140, 'Filé de tilápia grelhado com ervas finas'),
            calculateFoodNutrients(getFood('taco-2'), 120, 'Arroz integral cozido'),
            calculateFoodNutrients(getFood('taco-37'), 100, 'Abobrinha refogada com cebola'),
            calculateFoodNutrients(getFood('taco-49'), 8, 'Fio de azeite extravirgem')
          ]
        }
      ]
    }
  ],
  orientacoesGerais: [
    'Manter a ingestão hídrica fracionada ao longo do dia (mínimo de 2.800ml/dia).',
    'Consumir creatina (5g) diariamente no pós-treino ou junto ao almoço.',
    'Utilizar temperos naturais: cúrcuma, orégano, alecrim, alho e cebola.',
    'Evitar líquidos durante as grandes refeições (aguardar 30 minutos após).'
  ],
  listaSubstituicoesGeraisHabilitada: true,
  status: 'ativo',
  sincronizadoComAppPaciente: true
};

// 2. TEMPLATE: Emagrecimento & Déficit Inteligente (1.650 kcal)
export const TEMPLATE_EMAGRECIMENTO: MealPlan = {
  id: 'tpl-emagrecimento',
  pacienteId: 'syn-2',
  pacienteNome: 'Lucas Mendonça',
  pacienteSexo: 'M',
  pacienteIdade: 34,
  pacientePesoKg: 88.5,
  pacienteAlturaCm: 178,
  tmbKcal: 1860,
  getKcal: 2350,
  objetivoClinico: 'emagrecimento',
  tituloPlano: 'Plano de Déficit Calórico Controlado com Alta Densidade Nutricional',
  estrategiaNutricional: 'Déficit calórico de -700 kcal com aporte proteico de 1.8g/kg para máxima preservação de massa magra.',
  dataCriacao: '2026-09-04',
  profissionalNome: 'Dra. Vanessa Mendonça',
  profissionalCrn: 'CRN-3 48.912/SP',
  metas: {
    caloriasAlvo: 1650,
    proteinasGramas: 160,
    proteinasPercent: 39,
    proteinasGKg: 1.8,
    carboidratosGramas: 140,
    carboidratosPercent: 34,
    carboidratosGKg: 1.58,
    gordurasGramas: 50,
    gordurasPercent: 27,
    gordurasGKg: 0.56,
    fibrasGramas: 34,
    aguaMl: 3200
  },
  dias: [
    {
      id: 'dia-emagr-1',
      nome: 'Cardápio Diário - Foco Saciedade',
      descricao: 'Alimentos volumosos, baixos em calorias e ricos em fibras solúveis e insolúveis.',
      refeicoes: [
        {
          id: 'm-em-1',
          nome: 'Desjejum Proteico',
          horarioSugerido: '07:30',
          icone: '☀️',
          metaCaloriasPercent: 20,
          alimentos: [
            calculateFoodNutrients(getFood('taco-18'), 50, '1 ovo cozido'),
            calculateFoodNutrients(getFood('taco-19'), 70, '2 claras de ovos mexidas'),
            calculateFoodNutrients(getFood('taco-42'), 150, 'Morangos frescos'),
            calculateFoodNutrients(getFood('taco-6'), 20, '1 colher de sopa de farelo de aveia'),
            calculateFoodNutrients(getFood('taco-59'), 100, 'Café preto sem açúcar')
          ]
        },
        {
          id: 'm-em-2',
          nome: 'Almoço Sacietogênico',
          horarioSugerido: '12:30',
          icone: '🍲',
          metaCaloriasPercent: 38,
          alimentos: [
            calculateFoodNutrients(getFood('taco-10'), 150, 'Patinho moído grelhado sem gordura'),
            calculateFoodNutrients(getFood('taco-1'), 100, 'Arroz branco cozido (3 colheres de sopa)'),
            calculateFoodNutrients(getFood('taco-28'), 100, 'Feijão carioca'),
            calculateFoodNutrients(getFood('taco-33'), 80, 'Mix de folhas verdes (alface, rúcula)'),
            calculateFoodNutrients(getFood('taco-35'), 120, 'Brócolis no vapor'),
            calculateFoodNutrients(getFood('taco-49'), 8, 'Azeite extravirgem cru')
          ]
        },
        {
          id: 'm-em-3',
          nome: 'Lanche da Tarde Proteico',
          horarioSugerido: '16:00',
          icone: '⚡',
          metaCaloriasPercent: 18,
          alimentos: [
            calculateFoodNutrients(getFood('taco-22'), 150, 'Iogurte grego proteico sem açúcar'),
            calculateFoodNutrients(getFood('taco-48'), 15, '1 colher de chia hidratada'),
            calculateFoodNutrients(getFood('taco-40'), 130, '1 maçã com casca')
          ]
        },
        {
          id: 'm-em-4',
          nome: 'Jantar Low Energy Density',
          horarioSugerido: '19:30',
          icone: '🌙',
          metaCaloriasPercent: 24,
          alimentos: [
            calculateFoodNutrients(getFood('taco-9'), 150, 'Peito de frango grelhado em tiras'),
            calculateFoodNutrients(getFood('taco-3'), 100, 'Batata-doce cozida'),
            calculateFoodNutrients(getFood('taco-37'), 120, 'Abobrinha grelhada'),
            calculateFoodNutrients(getFood('taco-34'), 80, 'Tomates frescos')
          ]
        }
      ]
    }
  ],
  orientacoesGerais: [
    'Priorizar o consumo de vegetais no início das refeições para ativar hormônios de saciedade (CCK e GLP-1).',
    'Ingerir 500ml de água 30 minutos antes do almoço e do jantar.',
    'Substituir o açúcar por adoçantes naturais como estévia pura ou eritritol quando estritamente necessário.'
  ],
  listaSubstituicoesGeraisHabilitada: true,
  status: 'ativo',
  sincronizadoComAppPaciente: true
};

// 3. TEMPLATE: Dieta Mediterrânea Cardioprotetora (2.000 kcal)
export const TEMPLATE_MEDITERRANEA: MealPlan = {
  id: 'tpl-mediterranea',
  pacienteId: 'syn-3',
  pacienteNome: 'Camila Duarte',
  pacienteSexo: 'F',
  pacienteIdade: 42,
  pacientePesoKg: 68.0,
  pacienteAlturaCm: 168,
  tmbKcal: 1450,
  getKcal: 2050,
  objetivoClinico: 'saude_metabolica',
  tituloPlano: 'Plano Padrão Mediterrâneo Cardioprotetor & Longevidade',
  estrategiaNutricional: 'Rica em polifenóis, ácidos graxos mono e poli-insaturados (azeite, salmão, nozes) e antioxidantes naturais.',
  dataCriacao: '2026-09-04',
  profissionalNome: 'Dra. Vanessa Mendonça',
  profissionalCrn: 'CRN-3 48.912/SP',
  metas: {
    caloriasAlvo: 2000,
    proteinasGramas: 110,
    proteinasPercent: 22,
    proteinasGKg: 1.62,
    carboidratosGramas: 235,
    carboidratosPercent: 47,
    carboidratosGKg: 3.45,
    gordurasGramas: 69,
    gordurasPercent: 31,
    gordurasGKg: 1.01,
    fibrasGramas: 36,
    aguaMl: 2600
  },
  dias: [
    {
      id: 'dia-med-1',
      nome: 'Cardápio Padrão Mediterrâneo',
      descricao: 'Harmonia entre peixes nobres, grãos integrais, azeite de oliva e frutas variadas.',
      refeicoes: [
        {
          id: 'm-med-1',
          nome: 'Café da Manhã',
          horarioSugerido: '08:00',
          icone: '☀️',
          metaCaloriasPercent: 20,
          alimentos: [
            calculateFoodNutrients(getFood('taco-51'), 50, 'Pão integral'),
            calculateFoodNutrients(getFood('taco-43'), 60, 'Pasta de abacate com limão'),
            calculateFoodNutrients(getFood('taco-18'), 50, '1 ovo poché'),
            calculateFoodNutrients(getFood('taco-41'), 150, 'Mamão papaia com sementes de chia')
          ]
        },
        {
          id: 'm-med-2',
          nome: 'Almoço Mediterrâneo',
          horarioSugerido: '12:30',
          icone: '🍲',
          metaCaloriasPercent: 35,
          alimentos: [
            calculateFoodNutrients(getFood('taco-15'), 130, 'Salmão grelhado ao molho de ervas e alho'),
            calculateFoodNutrients(getFood('taco-7'), 120, 'Quinoa cozida em grãos'),
            calculateFoodNutrients(getFood('taco-38'), 80, 'Espinafre refogado'),
            calculateFoodNutrients(getFood('taco-34'), 80, 'Tomates frescos'),
            calculateFoodNutrients(getFood('taco-49'), 15, '1 colher de sopa de azeite de oliva extravirgem')
          ]
        },
        {
          id: 'm-med-3',
          nome: 'Lanche da Tarde',
          horarioSugerido: '16:00',
          icone: '🍎',
          metaCaloriasPercent: 15,
          alimentos: [
            calculateFoodNutrients(getFood('taco-21'), 170, 'Iogurte natural'),
            calculateFoodNutrients(getFood('taco-46'), 15, 'Nozes selecionadas'),
            calculateFoodNutrients(getFood('taco-40'), 130, '1 maçã')
          ]
        },
        {
          id: 'm-med-4',
          nome: 'Jantar',
          horarioSugerido: '20:00',
          icone: '🌙',
          metaCaloriasPercent: 30,
          alimentos: [
            calculateFoodNutrients(getFood('taco-14'), 130, 'Filé de tilápia com legumes grelhados'),
            calculateFoodNutrients(getFood('taco-30'), 100, 'Grão-de-bico cozido'),
            calculateFoodNutrients(getFood('taco-35'), 100, 'Brócolis no vapor'),
            calculateFoodNutrients(getFood('taco-49'), 10, 'Azeite extravirgem')
          ]
        }
      ]
    }
  ],
  orientacoesGerais: [
    'O azeite de oliva extravirgem é o principal carreador lipídico cardioprotetor deste plano.',
    'Evitar frituras em imersão e alimentos ultraprocessados ricos em gordura vegetal hidrogenada.',
    'Incentivar a variedade de cores nos pratos para garantir ampla gama de bioflavonoides.'
  ],
  listaSubstituicoesGeraisHabilitada: true,
  status: 'ativo',
  sincronizadoComAppPaciente: true
};

export const CLINICAL_MEAL_PLAN_TEMPLATES = [
  TEMPLATE_HIPERTROFIA,
  TEMPLATE_EMAGRECIMENTO,
  TEMPLATE_MEDITERRANEA
];
