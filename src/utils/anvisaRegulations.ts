// Implementação rigorosa das regras da RDC 429/2020 e IN 75/2020 da ANVISA
// Arredondamentos, unidades, %VD obrigatórios e regras de Rotulagem Nutricional Frontal (Lupa).

export interface AnvisaNutrientValues {
  valorEnergeticoKcal: number;
  carboidratosG: number;
  acucaresTotaisG: number;
  acucaresAdicionadosG: number;
  proteinasG: number;
  gordurasTotaisG: number;
  gordurasSaturadasG: number;
  gordurasTransG: number;
  fibraAlimentarG: number;
  sodioMg: number;
}

export interface AnvisaFoodItem {
  nomeProduto: string;
  tipoAlimento: 'solido' | 'liquido';
  pesoTotalEmbalagemG: number;
  tamanhoPorcaoG: number;
  medidaCaseira: string;
  valoresPor100g: AnvisaNutrientValues;
}

// Valores Diários de Referência oficiais da IN 75/2020 (Anexo V) baseados em 2.000 kcal
export const ANVISA_VDR = {
  valorEnergeticoKcal: 2000,
  carboidratosG: 300,
  acucaresTotaisG: null, // Não estabelecido na norma
  acucaresAdicionadosG: 50,
  proteinasG: 50,
  gordurasTotaisG: 65,
  gordurasSaturadasG: 20,
  gordurasTransG: null, // Não estabelecido na norma
  fibraAlimentarG: 25,
  sodioMg: 2000
};

// Limites da Rotulagem Frontal (Lupa FOP - Anexo XVIII da IN 75/2020)
export const ANVISA_FRONTAL_LIMITS = {
  solido: {
    acucaresAdicionadosG: 15, // >= 15g por 100g
    gordurasSaturadasG: 6,    // >= 6g por 100g
    sodioMg: 600              // >= 600mg por 100g
  },
  liquido: {
    acucaresAdicionadosG: 7.5, // >= 7.5g por 100ml
    gordurasSaturadasG: 3,     // >= 3g por 100ml
    sodioMg: 300               // >= 300mg por 100ml
  }
};

/**
 * Arredondamento oficial de macro e micronutrientes conforme IN 75/2020 (Anexo III)
 */
export function formatAnvisaNutrient(
  nutrientKey: keyof AnvisaNutrientValues,
  value: number
): { formattedValue: string; isZero: boolean } {
  if (value === undefined || value === null || isNaN(value)) {
    return { formattedValue: '0', isZero: true };
  }

  switch (nutrientKey) {
    case 'valorEnergeticoKcal': {
      // < 4 kcal pode ser declarado como "0"
      if (value < 4) return { formattedValue: '0', isZero: true };
      const rounded = Math.round(value);
      return { formattedValue: rounded.toString(), isZero: false };
    }

    case 'carboidratosG':
    case 'proteinasG':
    case 'gordurasTotaisG':
    case 'fibraAlimentarG': {
      if (value < 0.5) return { formattedValue: '0', isZero: true };
      if (value >= 10) {
        return { formattedValue: Math.round(value).toString(), isZero: false };
      }
      return { formattedValue: value.toFixed(1).replace('.', ','), isZero: false };
    }

    case 'acucaresTotaisG':
    case 'acucaresAdicionadosG': {
      if (value < 0.5) return { formattedValue: '0', isZero: true };
      if (value >= 10) {
        return { formattedValue: Math.round(value).toString(), isZero: false };
      }
      return { formattedValue: value.toFixed(1).replace('.', ','), isZero: false };
    }

    case 'gordurasSaturadasG': {
      if (value < 0.5) return { formattedValue: '0', isZero: true };
      if (value >= 10) {
        return { formattedValue: Math.round(value).toString(), isZero: false };
      }
      return { formattedValue: value.toFixed(1).replace('.', ','), isZero: false };
    }

    case 'gordurasTransG': {
      // < 0,2g pode ser declarado como "0"
      if (value < 0.2) return { formattedValue: '0', isZero: true };
      return { formattedValue: value.toFixed(1).replace('.', ','), isZero: false };
    }

    case 'sodioMg': {
      if (value < 5) return { formattedValue: '0', isZero: true };
      return { formattedValue: Math.round(value).toString(), isZero: false };
    }

    default:
      return { formattedValue: value.toFixed(1).replace('.', ','), isZero: value === 0 };
  }
}

/**
 * Calcula o %VD conforme normas da IN 75/2020
 */
export function calculateAnvisaVD(nutrientKey: keyof AnvisaNutrientValues, valueInPortion: number): string {
  const vdr = ANVISA_VDR[nutrientKey];
  if (vdr === null || vdr === undefined) {
    return ''; // Gorduras trans e açúcares totais não possuem %VD
  }

  if (!valueInPortion || valueInPortion <= 0) {
    return '0';
  }

  const rawPercent = (valueInPortion / vdr) * 100;
  if (rawPercent < 1) {
    return '< 1';
  }

  return Math.round(rawPercent).toString();
}

/**
 * Avalia a obrigatoriedade da Lupa Frontal (FOP) conforme Anexo XVIII da IN 75/2020
 */
export function checkFrontalWarningLupa(food: AnvisaFoodItem): {
  hasAnyWarning: boolean;
  highSugar: boolean;
  highSatFat: boolean;
  highSodium: boolean;
} {
  const limits = ANVISA_FRONTAL_LIMITS[food.tipoAlimento];
  const vals = food.valoresPor100g;

  const highSugar = vals.acucaresAdicionadosG >= limits.acucaresAdicionadosG;
  const highSatFat = vals.gordurasSaturadasG >= limits.gordurasSaturadasG;
  const highSodium = vals.sodioMg >= limits.sodioMg;

  return {
    hasAnyWarning: highSugar || highSatFat || highSodium,
    highSugar,
    highSatFat,
    highSodium
  };
}
