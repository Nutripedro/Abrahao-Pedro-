import {
  DensityEquation,
  Gender,
  MethodType,
  PerimetryValues,
  ProtocolType,
  SkinfoldKey,
  SkinfoldValues,
  CalculationResult,
  GoalSimulationInput,
  GoalSimulationResult,
} from '../types';

/**
 * =====================================================================
 * MOTOR DE CÁLCULO CLÍNICO DE ANTROPOMETRIA
 * Isole cada fórmula em uma função pura e testável isoladamente.
 * Fontes científicas originais documentadas em cada protocolo.
 * =====================================================================
 */

/**
 * Retorna a lista de chaves de dobras requeridas por protocolo e sexo
 */
export function getRequiredSkinfolds(
  method: MethodType,
  protocol: ProtocolType,
  sexo: Gender
): SkinfoldKey[] {
  if (method === 'durnin-womersley' || protocol === 'dw-4') {
    return ['biceps', 'triceps', 'subescapular', 'supraIliaca'];
  }

  if (protocol === 'jp-3') {
    if (sexo === 'masculino') {
      return ['peitoral', 'abdomen', 'coxa'];
    } else {
      return ['triceps', 'supraIliaca', 'coxa'];
    }
  }

  if (protocol === 'jp-4') {
    return ['triceps', 'abdomen', 'supraIliaca', 'coxa'];
  }

  // jp-7
  return [
    'peitoral',
    'axilarMedia',
    'triceps',
    'subescapular',
    'abdomen',
    'supraIliaca',
    'coxa',
  ];
}

/**
 * Calcula a Taxa Metabólica Basal (TMB) usando a equação de Harris-Benedict revisada (Roza & Shizgal, 1984)
 */
export function calculateBMR(pesoKg: number, alturaCm: number, idade: number, sexo: Gender): number {
  if (!pesoKg || !alturaCm || !idade) return 0;
  
  if (sexo === 'masculino') {
    return 88.362 + (13.397 * pesoKg) + (4.799 * alturaCm) - (5.677 * idade);
  } else {
    return 447.593 + (9.247 * pesoKg) + (3.098 * alturaCm) - (4.330 * idade);
  }
}

/**
 * Calcula o IMC (Índice de Massa Corporal) em kg/m²
 * Fonte: OMS (Organização Mundial da Saúde)
 */
export function calculateBMI(pesoKg: number, alturaCm: number): {
  imc: number;
  classificacao: string;
} {
  if (!pesoKg || !alturaCm || alturaCm <= 0 || pesoKg <= 0) {
    return { imc: 0, classificacao: 'Não informado' };
  }

  const alturaM = alturaCm / 100;
  const imc = Number((pesoKg / (alturaM * alturaM)).toFixed(2));

  let classificacao = 'Eutrofia';
  if (imc < 18.5) {
    classificacao = 'Baixo peso';
  } else if (imc < 25.0) {
    classificacao = 'Eutrofia';
  } else if (imc < 30.0) {
    classificacao = 'Sobrepeso';
  } else if (imc < 35.0) {
    classificacao = 'Obesidade grau I';
  } else if (imc < 40.0) {
    classificacao = 'Obesidade grau II';
  } else {
    classificacao = 'Obesidade grau III';
  }

  return { imc, classificacao };
}

/**
 * Calcula a Relação Cintura-Quadril (RCQ)
 * e classifica o risco coronariano/metabólico com base na tabela exata:
 * "Applied body composition assessment, pág. 82 Ed. Human Kinetics 1996" / Bray & Gray
 */
export function calculateWHR(
  cinturaCm: number | null | undefined,
  quadrilCm: number | null | undefined,
  sexo: Gender,
  idade: number
): {
  rcq: number | null;
  classificacao: string | null;
  risco: 'baixo' | 'moderado' | 'alto' | 'muito_alto' | null;
} {
  if (!cinturaCm || !quadrilCm || cinturaCm <= 0 || quadrilCm <= 0) {
    return { rcq: null, classificacao: null, risco: null };
  }

  const rcq = Number((cinturaCm / quadrilCm).toFixed(3));

  if (sexo === 'masculino') {
    if (idade < 30) {
      if (rcq < 0.83) return { rcq, classificacao: 'Risco Baixo (< 0,83)', risco: 'baixo' };
      if (rcq <= 0.88) return { rcq, classificacao: 'Risco Moderado (0,83 - 0,88)', risco: 'moderado' };
      if (rcq <= 0.94) return { rcq, classificacao: 'Risco Alto (0,89 - 0,94)', risco: 'alto' };
      return { rcq, classificacao: 'Risco Muito Alto (> 0,94)', risco: 'muito_alto' };
    } else if (idade <= 39) {
      if (rcq < 0.84) return { rcq, classificacao: 'Risco Baixo (< 0,84)', risco: 'baixo' };
      if (rcq <= 0.91) return { rcq, classificacao: 'Risco Moderado (0,84 - 0,91)', risco: 'moderado' };
      if (rcq <= 0.96) return { rcq, classificacao: 'Risco Alto (0,92 - 0,96)', risco: 'alto' };
      return { rcq, classificacao: 'Risco Muito Alto (> 0,96)', risco: 'muito_alto' };
    } else if (idade <= 49) {
      if (rcq < 0.88) return { rcq, classificacao: 'Risco Baixo (< 0,88)', risco: 'baixo' };
      if (rcq <= 0.95) return { rcq, classificacao: 'Risco Moderado (0,88 - 0,95)', risco: 'moderado' };
      if (rcq <= 1.00) return { rcq, classificacao: 'Risco Alto (0,96 - 1,00)', risco: 'alto' };
      return { rcq, classificacao: 'Risco Muito Alto (> 1,00)', risco: 'muito_alto' };
    } else if (idade <= 59) {
      if (rcq < 0.90) return { rcq, classificacao: 'Risco Baixo (< 0,90)', risco: 'baixo' };
      if (rcq <= 0.96) return { rcq, classificacao: 'Risco Moderado (0,90 - 0,96)', risco: 'moderado' };
      if (rcq <= 1.02) return { rcq, classificacao: 'Risco Alto (0,97 - 1,02)', risco: 'alto' };
      return { rcq, classificacao: 'Risco Muito Alto (> 1,02)', risco: 'muito_alto' };
    } else {
      if (rcq < 0.91) return { rcq, classificacao: 'Risco Baixo (< 0,91)', risco: 'baixo' };
      if (rcq <= 0.98) return { rcq, classificacao: 'Risco Moderado (0,91 - 0,98)', risco: 'moderado' };
      if (rcq <= 1.03) return { rcq, classificacao: 'Risco Alto (0,99 - 1,03)', risco: 'alto' };
      return { rcq, classificacao: 'Risco Muito Alto (> 1,03)', risco: 'muito_alto' };
    }
  } else {
    // Feminino
    if (idade < 30) {
      if (rcq < 0.71) return { rcq, classificacao: 'Risco Baixo (< 0,71)', risco: 'baixo' };
      if (rcq <= 0.77) return { rcq, classificacao: 'Risco Moderado (0,71 - 0,77)', risco: 'moderado' };
      if (rcq <= 0.82) return { rcq, classificacao: 'Risco Alto (0,78 - 0,82)', risco: 'alto' };
      return { rcq, classificacao: 'Risco Muito Alto (> 0,82)', risco: 'muito_alto' };
    } else if (idade <= 39) {
      if (rcq < 0.72) return { rcq, classificacao: 'Risco Baixo (< 0,72)', risco: 'baixo' };
      if (rcq <= 0.78) return { rcq, classificacao: 'Risco Moderado (0,72 - 0,78)', risco: 'moderado' };
      if (rcq <= 0.84) return { rcq, classificacao: 'Risco Alto (0,79 - 0,84)', risco: 'alto' };
      return { rcq, classificacao: 'Risco Muito Alto (> 0,84)', risco: 'muito_alto' };
    } else if (idade <= 49) {
      if (rcq < 0.73) return { rcq, classificacao: 'Risco Baixo (< 0,73)', risco: 'baixo' };
      if (rcq <= 0.79) return { rcq, classificacao: 'Risco Moderado (0,73 - 0,79)', risco: 'moderado' };
      if (rcq <= 0.87) return { rcq, classificacao: 'Risco Alto (0,80 - 0,87)', risco: 'alto' };
      return { rcq, classificacao: 'Risco Muito Alto (> 0,87)', risco: 'muito_alto' };
    } else if (idade <= 59) {
      if (rcq < 0.74) return { rcq, classificacao: 'Risco Baixo (< 0,74)', risco: 'baixo' };
      if (rcq <= 0.81) return { rcq, classificacao: 'Risco Moderado (0,74 - 0,81)', risco: 'moderado' };
      if (rcq <= 0.88) return { rcq, classificacao: 'Risco Alto (0,82 - 0,88)', risco: 'alto' };
      return { rcq, classificacao: 'Risco Muito Alto (> 0,88)', risco: 'muito_alto' };
    } else {
      if (rcq < 0.76) return { rcq, classificacao: 'Risco Baixo (< 0,76)', risco: 'baixo' };
      if (rcq <= 0.83) return { rcq, classificacao: 'Risco Moderado (0,76 - 0,83)', risco: 'moderado' };
      if (rcq <= 0.90) return { rcq, classificacao: 'Risco Alto (0,84 - 0,90)', risco: 'alto' };
      return { rcq, classificacao: 'Risco Muito Alto (> 0,90)', risco: 'muito_alto' };
    }
  }
}

/**
 * Calcula a densidade corporal (DC em g/cm³)
 */
export function calculateBodyDensity(
  method: MethodType,
  protocol: ProtocolType,
  skinfolds: SkinfoldValues,
  sexo: Gender,
  idade: number
): {
  dc: number;
  soma: number;
  equacaoNome: string;
  equacaoFormula: string;
  usedFolds: SkinfoldKey[];
  isValid: boolean;
  missing: string[];
} {
  const required = getRequiredSkinfolds(method, protocol, sexo);
  const missing: string[] = [];
  let soma = 0;

  for (const key of required) {
    const val = skinfolds[key];
    if (val === undefined || val === null || isNaN(val) || val <= 0 || val < 1.5 || val > 70.0) {
      missing.push(key);
    } else {
      soma += Number(val);
    }
  }

  if (missing.length > 0) {
    return {
      dc: 0,
      soma: Number(soma.toFixed(1)),
      equacaoNome: '',
      equacaoFormula: '',
      usedFolds: required,
      isValid: false,
      missing,
    };
  }

  soma = Number(soma.toFixed(1));
  let dc = 0;
  let equacaoNome = '';
  let equacaoFormula = '';

  if (method === 'durnin-womersley' || protocol === 'dw-4') {
    equacaoNome = 'Durnin & Womersley (1974) - 4 Dobras';
    // Dobras: Bíceps + Tríceps + Subescapular + Supra-ilíaca
    // DC = c - m * log10(Soma)
    const logSoma = Math.log10(soma);
    let c = 1.1631;
    let m = 0.0632;

    if (sexo === 'masculino') {
      if (idade < 17) {
        c = 1.1533;
        m = 0.0643;
      } else if (idade <= 19) {
        c = 1.1620;
        m = 0.0630;
      } else if (idade <= 29) {
        c = 1.1631;
        m = 0.0632;
      } else if (idade <= 39) {
        c = 1.1422;
        m = 0.0544;
      } else if (idade <= 49) {
        c = 1.1620;
        m = 0.0700;
      } else {
        c = 1.1715;
        m = 0.0779;
      }
    } else {
      if (idade < 17) {
        c = 1.1369;
        m = 0.0598;
      } else if (idade <= 19) {
        c = 1.1549;
        m = 0.0678;
      } else if (idade <= 29) {
        c = 1.1599;
        m = 0.0717;
      } else if (idade <= 39) {
        c = 1.1423;
        m = 0.0632;
      } else if (idade <= 49) {
        c = 1.1333;
        m = 0.0612;
      } else {
        c = 1.1339;
        m = 0.0645;
      }
    }

    dc = c - m * logSoma;
    equacaoFormula = `DC = ${c.toFixed(4)} - (${m.toFixed(4)} × log₁₀(Σ4)) [c=${c.toFixed(4)}, m=${m.toFixed(4)}]`;
  } else if (protocol === 'jp-3') {
    if (sexo === 'masculino') {
      equacaoNome = 'Jackson & Pollock (1978) - 3 Dobras (Homens)';
      // DC = 1.10938 - 0.0008267(Σ3) + 0.00000055(Σ3)² - 0.0002574(Idade)
      dc =
        1.10938 -
        0.0008267 * soma +
        0.00000055 * Math.pow(soma, 2) -
        0.0002574 * idade;
      equacaoFormula = `DC = 1.10938 - (0.0008267 × Σ3) + (0.00000055 × Σ3²) - (0.0002574 × Idade)`;
    } else {
      equacaoNome = 'Jackson, Pollock & Ward (1980) - 3 Dobras (Mulheres)';
      // DC = 1.0994921 - 0.0009929(Σ3) + 0.0000023(Σ3)² - 0.0001392(Idade)
      dc =
        1.0994921 -
        0.0009929 * soma +
        0.0000023 * Math.pow(soma, 2) -
        0.0001392 * idade;
      equacaoFormula = `DC = 1.0994921 - (0.0009929 × Σ3) + (0.0000023 × Σ3²) - (0.0001392 × Idade)`;
    }
  } else if (protocol === 'jp-4') {
    // Jackson & Pollock 4 dobras (Tríceps, Abdômen, Supra-ilíaca, Coxa)
    if (sexo === 'masculino') {
      equacaoNome = 'Jackson & Pollock - 4 Dobras (Homens)';
      dc =
        1.1074 -
        0.000787 * soma +
        0.00000103 * Math.pow(soma, 2) -
        0.000302 * idade;
      equacaoFormula = `DC = 1.1074 - (0.000787 × Σ4) + (0.00000103 × Σ4²) - (0.000302 × Idade)`;
    } else {
      equacaoNome = 'Jackson, Pollock & Ward - 4 Dobras (Mulheres)';
      dc =
        1.0988 -
        0.000796 * soma +
        0.00000108 * Math.pow(soma, 2) -
        0.000158 * idade;
      equacaoFormula = `DC = 1.0988 - (0.000796 × Σ4) + (0.00000108 × Σ4²) - (0.000158 × Idade)`;
    }
  } else {
    // jp-7
    if (sexo === 'masculino') {
      equacaoNome = 'Jackson & Pollock (1978) - 7 Dobras (Homens)';
      // DC = 1.112 - 0.00043499(Σ7) + 0.00000055(Σ7)² - 0.00028826(Idade)
      dc =
        1.112 -
        0.00043499 * soma +
        0.00000055 * Math.pow(soma, 2) -
        0.00028826 * idade;
      equacaoFormula = `DC = 1.11200 - (0.00043499 × Σ7) + (0.00000055 × Σ7²) - (0.00028826 × Idade)`;
    } else {
      equacaoNome = 'Jackson, Pollock & Ward (1980) - 7 Dobras (Mulheres)';
      // DC = 1.097 - 0.00046971(Σ7) + 0.00000056(Σ7)² - 0.00012828(Idade)
      dc =
        1.097 -
        0.00046971 * soma +
        0.00000056 * Math.pow(soma, 2) -
        0.00012828 * idade;
      equacaoFormula = `DC = 1.09700 - (0.00046971 × Σ7) + (0.00000056 × Σ7²) - (0.00012828 × Idade)`;
    }
  }

  return {
    dc: Number(dc.toFixed(5)),
    soma,
    equacaoNome,
    equacaoFormula,
    usedFolds: required,
    isValid: true,
    missing: [],
  };
}

/**
 * Converte Densidade Corporal em % Gordura usando equação de Siri (1961) ou Brozek (1963)
 */
export function calculateBodyFat(
  dc: number,
  equation: DensityEquation = 'siri'
): {
  percentual: number;
  conversaoFormula: string;
} {
  if (dc <= 0 || isNaN(dc)) {
    return { percentual: 0, conversaoFormula: '' };
  }

  let percentual = 0;
  let conversaoFormula = '';

  if (equation === 'brozek') {
    // Brozek et al. (1963): %G = ((4.57 / DC) - 4.142) * 100
    percentual = (4.57 / dc - 4.142) * 100;
    conversaoFormula = `%G = [(4.570 / DC) - 4.142] × 100 (Brozek et al., 1963)`;
  } else {
    // Siri (1961): %G = ((4.95 / DC) - 4.50) * 100
    percentual = (4.95 / dc - 4.5) * 100;
    conversaoFormula = `%G = [(4.950 / DC) - 4.500] × 100 (Siri, 1961)`;
  }

  // Clamped physiologically between 2% and 75%
  percentual = Math.max(2, Math.min(75, percentual));

  return {
    percentual: Number(percentual.toFixed(1)),
    conversaoFormula,
  };
}

/**
 * Calcula Massa Gorda (kg) e Massa Livre de Gordura (kg)
 */
export function calculateFatMass(pesoKg: number, percentualGordura: number): number {
  if (!pesoKg || pesoKg <= 0 || !percentualGordura || percentualGordura <= 0) return 0;
  return Number((pesoKg * (percentualGordura / 100)).toFixed(2));
}

export function calculateLeanMass(pesoKg: number, massaGordaKg: number): number {
  if (!pesoKg || pesoKg <= 0) return 0;
  return Number((Math.max(0, pesoKg - massaGordaKg)).toFixed(2));
}

/**
 * Classificação de % Gordura Corporal segundo Pollock & Wilmore / ACSM
 * Estratificada rigorosamente por sexo e faixa etária
 */
export function classifyBodyFat(
  percentual: number,
  sexo: Gender,
  idade: number
): {
  classificacao: string;
  faixaReferencia: string;
  nivel: 'excelente' | 'bom' | 'medio' | 'acima_media' | 'elevado' | 'muito_elevado';
} {
  if (sexo === 'masculino') {
    if (idade < 30) {
      if (percentual < 6) return { classificacao: 'Atleta (< 6%)', faixaReferencia: '11% - 15%', nivel: 'excelente' };
      if (percentual <= 10) return { classificacao: 'Excelente (6% - 10%)', faixaReferencia: '11% - 15%', nivel: 'excelente' };
      if (percentual <= 14) return { classificacao: 'Bom (11% - 14%)', faixaReferencia: '11% - 15%', nivel: 'bom' };
      if (percentual <= 17) return { classificacao: 'Dentro da Média (15% - 17%)', faixaReferencia: '11% - 15%', nivel: 'medio' };
      if (percentual <= 20) return { classificacao: 'Acima da Média (18% - 20%)', faixaReferencia: '11% - 15%', nivel: 'acima_media' };
      if (percentual <= 25) return { classificacao: 'Elevada (21% - 25%)', faixaReferencia: '11% - 15%', nivel: 'elevado' };
      return { classificacao: 'Muito Elevada (> 25%)', faixaReferencia: '11% - 15%', nivel: 'muito_elevado' };
    } else if (idade <= 39) {
      if (percentual <= 11) return { classificacao: 'Excelente (≤ 11%)', faixaReferencia: '12% - 17%', nivel: 'excelente' };
      if (percentual <= 15) return { classificacao: 'Bom (12% - 15%)', faixaReferencia: '12% - 17%', nivel: 'bom' };
      if (percentual <= 19) return { classificacao: 'Dentro da Média (16% - 19%)', faixaReferencia: '12% - 17%', nivel: 'medio' };
      if (percentual <= 22) return { classificacao: 'Acima da Média (20% - 22%)', faixaReferencia: '12% - 17%', nivel: 'acima_media' };
      if (percentual <= 27) return { classificacao: 'Elevada (23% - 27%)', faixaReferencia: '12% - 17%', nivel: 'elevado' };
      return { classificacao: 'Muito Elevada (> 27%)', faixaReferencia: '12% - 17%', nivel: 'muito_elevado' };
    } else if (idade <= 49) {
      if (percentual <= 13) return { classificacao: 'Excelente (≤ 13%)', faixaReferencia: '14% - 19%', nivel: 'excelente' };
      if (percentual <= 17) return { classificacao: 'Bom (14% - 17%)', faixaReferencia: '14% - 19%', nivel: 'bom' };
      if (percentual <= 21) return { classificacao: 'Dentro da Média (18% - 21%)', faixaReferencia: '14% - 19%', nivel: 'medio' };
      if (percentual <= 24) return { classificacao: 'Acima da Média (22% - 24%)', faixaReferencia: '14% - 19%', nivel: 'acima_media' };
      if (percentual <= 29) return { classificacao: 'Elevada (25% - 29%)', faixaReferencia: '14% - 19%', nivel: 'elevado' };
      return { classificacao: 'Muito Elevada (> 29%)', faixaReferencia: '14% - 19%', nivel: 'muito_elevado' };
    } else {
      if (percentual <= 15) return { classificacao: 'Excelente (≤ 15%)', faixaReferencia: '16% - 21%', nivel: 'excelente' };
      if (percentual <= 19) return { classificacao: 'Bom (16% - 19%)', faixaReferencia: '16% - 21%', nivel: 'bom' };
      if (percentual <= 23) return { classificacao: 'Dentro da Média (20% - 23%)', faixaReferencia: '16% - 21%', nivel: 'medio' };
      if (percentual <= 26) return { classificacao: 'Acima da Média (24% - 26%)', faixaReferencia: '16% - 21%', nivel: 'acima_media' };
      if (percentual <= 30) return { classificacao: 'Elevada (27% - 30%)', faixaReferencia: '16% - 21%', nivel: 'elevado' };
      return { classificacao: 'Muito Elevada (> 30%)', faixaReferencia: '16% - 21%', nivel: 'muito_elevado' };
    }
  } else {
    // Feminino
    if (idade < 30) {
      if (percentual < 14) return { classificacao: 'Atleta (< 14%)', faixaReferencia: '16% - 23%', nivel: 'excelente' };
      if (percentual <= 17) return { classificacao: 'Excelente (14% - 17%)', faixaReferencia: '16% - 23%', nivel: 'excelente' };
      if (percentual <= 21) return { classificacao: 'Bom (18% - 21%)', faixaReferencia: '16% - 23%', nivel: 'bom' };
      if (percentual <= 24) return { classificacao: 'Dentro da Média (22% - 24%)', faixaReferencia: '16% - 23%', nivel: 'medio' };
      if (percentual <= 27) return { classificacao: 'Acima da Média (25% - 27%)', faixaReferencia: '16% - 23%', nivel: 'acima_media' };
      if (percentual <= 32) return { classificacao: 'Elevada (28% - 32%)', faixaReferencia: '16% - 23%', nivel: 'elevado' };
      return { classificacao: 'Muito Elevada (> 32%)', faixaReferencia: '16% - 23%', nivel: 'muito_elevado' };
    } else if (idade <= 39) {
      if (percentual <= 18) return { classificacao: 'Excelente (≤ 18%)', faixaReferencia: '17% - 24%', nivel: 'excelente' };
      if (percentual <= 22) return { classificacao: 'Bom (19% - 22%)', faixaReferencia: '17% - 24%', nivel: 'bom' };
      if (percentual <= 25) return { classificacao: 'Dentro da Média (23% - 25%)', faixaReferencia: '17% - 24%', nivel: 'medio' };
      if (percentual <= 29) return { classificacao: 'Acima da Média (26% - 29%)', faixaReferencia: '17% - 24%', nivel: 'acima_media' };
      if (percentual <= 34) return { classificacao: 'Elevada (30% - 34%)', faixaReferencia: '17% - 24%', nivel: 'elevado' };
      return { classificacao: 'Muito Elevada (> 34%)', faixaReferencia: '17% - 24%', nivel: 'muito_elevado' };
    } else if (idade <= 49) {
      if (percentual <= 20) return { classificacao: 'Excelente (≤ 20%)', faixaReferencia: '19% - 26%', nivel: 'excelente' };
      if (percentual <= 24) return { classificacao: 'Bom (21% - 24%)', faixaReferencia: '19% - 26%', nivel: 'bom' };
      if (percentual <= 28) return { classificacao: 'Dentro da Média (25% - 28%)', faixaReferencia: '19% - 26%', nivel: 'medio' };
      if (percentual <= 32) return { classificacao: 'Acima da Média (29% - 32%)', faixaReferencia: '19% - 26%', nivel: 'acima_media' };
      if (percentual <= 36) return { classificacao: 'Elevada (33% - 36%)', faixaReferencia: '19% - 26%', nivel: 'elevado' };
      return { classificacao: 'Muito Elevada (> 36%)', faixaReferencia: '19% - 26%', nivel: 'muito_elevado' };
    } else {
      if (percentual <= 22) return { classificacao: 'Excelente (≤ 22%)', faixaReferencia: '21% - 28%', nivel: 'excelente' };
      if (percentual <= 26) return { classificacao: 'Bom (23% - 26%)', faixaReferencia: '21% - 28%', nivel: 'bom' };
      if (percentual <= 30) return { classificacao: 'Dentro da Média (27% - 30%)', faixaReferencia: '21% - 28%', nivel: 'medio' };
      if (percentual <= 34) return { classificacao: 'Acima da Média (31% - 34%)', faixaReferencia: '21% - 28%', nivel: 'acima_media' };
      if (percentual <= 38) return { classificacao: 'Elevada (35% - 38%)', faixaReferencia: '21% - 28%', nivel: 'elevado' };
      return { classificacao: 'Muito Elevada (> 38%)', faixaReferencia: '21% - 28%', nivel: 'muito_elevado' };
    }
  }
}

/**
 * Função agregadora: executa o fluxo antropométrico completo
 */
export function runAnthropometricAssessment(
  pesoKg: number,
  alturaCm: number,
  idade: number,
  sexo: Gender,
  method: MethodType,
  protocol: ProtocolType,
  equation: DensityEquation,
  skinfolds: SkinfoldValues,
  perimetry: PerimetryValues
): CalculationResult {
  const { imc, classificacao: imcClassificacao } = calculateBMI(pesoKg, alturaCm);
  const { rcq, classificacao: rcqClassificacao, risco: rcqRisco } = calculateWHR(
    perimetry.cintura,
    perimetry.quadril,
    sexo,
    idade
  );

  const densityRes = calculateBodyDensity(method, protocol, skinfolds, sexo, idade);
  
  const tmb = calculateBMR(pesoKg, alturaCm, idade, sexo);

  if (!densityRes.isValid) {
    return {
      somaDobras: densityRes.soma,
      densidadeCorporal: 0,
      percentualGordura: 0,
      massaGordaKg: 0,
      massaLivreGorduraKg: 0,
      tmb,
      imc,
      imcClassificacao,
      rcq,
      rcqClassificacao,
      rcqRisco,
      gorduraClassificacao: 'Pendente',
      faixaReferencia: '—',
      equacaoNome: densityRes.equacaoNome,
      equacaoFormula: densityRes.equacaoFormula,
      conversaoFormula: '',
      dobrasUtilizadas: densityRes.usedFolds,
      isValid: false,
      missingFields: densityRes.missing,
    };
  }

  const { percentual, conversaoFormula } = calculateBodyFat(densityRes.dc, equation);
  const massaGordaKg = calculateFatMass(pesoKg, percentual);
  const massaLivreGorduraKg = calculateLeanMass(pesoKg, massaGordaKg);
  const { classificacao: gorduraClassificacao, faixaReferencia } = classifyBodyFat(
    percentual,
    sexo,
    idade
  );

  return {
    somaDobras: densityRes.soma,
    densidadeCorporal: densityRes.dc,
    percentualGordura: percentual,
    massaGordaKg,
    massaLivreGorduraKg,
    tmb,
    imc,
    imcClassificacao,
    rcq,
    rcqClassificacao,
    rcqRisco,
    gorduraClassificacao,
    faixaReferencia,
    equacaoNome: densityRes.equacaoNome,
    equacaoFormula: densityRes.equacaoFormula,
    conversaoFormula,
    dobrasUtilizadas: densityRes.usedFolds,
    isValid: true,
    missingFields: [],
  };
}

/**
 * =====================================================================
 * SIMULADOR DE METAS DE COMPOSIÇÃO CORPORAL
 * Isole cada fórmula em uma função pura e testável isoladamente.
 * 
 * Premissa Clínica Central: Manutenção de 100% da Massa Livre de Gordura (MLG)
 * W_alvo = MLG_atual / (1 - (%G_alvo / 100))
 * Massa Gorda Alvo = W_alvo - MLG_atual
 * Gordura a Perder (kg) = MG_atual - MG_alvo
 * 
 * Fontes Científicas:
 * 1. Heymsfield SB, et al. Human Body Composition. 2nd ed. Human Kinetics; 2005.
 * 2. American College of Sports Medicine (ACSM). ACSM's Guidelines for Exercise Testing and Prescription. 11th ed. 2021.
 * 3. Lohman TG, Going SB. Assessment of body composition and energy expenditure. Human Kinetics; 1993.
 * =====================================================================
 */
export function calculateGoalSimulation(input: GoalSimulationInput): GoalSimulationResult {
  const {
    pesoAtualKg,
    percentualGorduraAtual,
    percentualGorduraAlvo,
    massaLivreGorduraAtualKg,
    alturaCm,
    sexo,
    idade,
  } = input;

  // Sanitização estrita e limites biológicos
  const limiteGorduraEssencial = sexo === 'masculino' ? 5.0 : 12.0;
  const clampedTargetFat = Math.min(Math.max(Number(percentualGorduraAlvo) || 0, 3.0), 65.0);

  const mlg = Math.max(massaLivreGorduraAtualKg, 0);
  const pesoAtual = Math.max(pesoAtualKg, 0);
  const mgAtual = (pesoAtual * percentualGorduraAtual) / 100;

  // Evitar divisão por zero ou negativa se alvo >= 100%
  const divisor = Math.max(1 - clampedTargetFat / 100, 0.05);
  const pesoAlvoKg = Number((mlg / divisor).toFixed(2));
  const massaGordaAlvoKg = Number((pesoAlvoKg - mlg).toFixed(2));

  // Gordura a perder em kg (positivo se perda, negativo se ganho necessário)
  const gorduraDiferencaKg = Number((mgAtual - massaGordaAlvoKg).toFixed(2));
  const pesoDiferencaKg = Number((pesoAtual - pesoAlvoKg).toFixed(2));

  let tipoMeta: 'perda_gordura' | 'ganho_gordura' | 'manutencao' = 'manutencao';
  if (gorduraDiferencaKg > 0.15) {
    tipoMeta = 'perda_gordura';
  } else if (gorduraDiferencaKg < -0.15) {
    tipoMeta = 'ganho_gordura';
  }

  // IMC atual e alvo
  let imcAtual = 0;
  let imcAlvo = 0;
  if (alturaCm && alturaCm > 0) {
    const altM = alturaCm / 100;
    imcAtual = Number((pesoAtual / (altM * altM)).toFixed(2));
    imcAlvo = Number((pesoAlvoKg / (altM * altM)).toFixed(2));
  }

  // Estimativa de tempo clínico saudável (ACSM / NIH / ABESO)
  // Ritmo Sustentável: 0.5 kg de gordura pura / semana (preserva massa muscular)
  // Ritmo Moderado: 0.75 kg de gordura pura / semana
  const absGordura = Math.abs(gorduraDiferencaKg);
  const semanasEstimadasSustentavel = absGordura > 0.1 ? Math.max(1, Math.round(absGordura / 0.5)) : 0;
  const mesesEstimadosSustentavel = Number((semanasEstimadasSustentavel / 4.33).toFixed(1));

  const semanasEstimadasModerado = absGordura > 0.1 ? Math.max(1, Math.round(absGordura / 0.75)) : 0;
  const mesesEstimadosModerado = Number((semanasEstimadasModerado / 4.33).toFixed(1));

  // Alerta de segurança clínica
  const isAbaixoGorduraEssencial = clampedTargetFat < limiteGorduraEssencial;
  let alertaClinico: string | undefined;

  if (isAbaixoGorduraEssencial) {
    if (sexo === 'masculino') {
      alertaClinico = 'Aviso de Segurança Clínica: O percentual alvo (< 5%) está abaixo do limite de gordura essencial masculina. Há risco de disfunção hormonal (supressão do eixo HPT e testosterona), imunossupressão, letargia crônica e perda de rendimento esportivo.';
    } else {
      alertaClinico = 'Aviso de Segurança Clínica: O percentual alvo (< 12%) está abaixo do limite de gordura essencial feminina. Há risco iminente de Tríade da Mulher Atleta / RED-S, amenorreia hipotalâmica funcional, disfunção endotelial e osteopenia.';
    }
  }

  // Classificação normativa do percentual alvo
  const { classificacao: classificacaoAlvo, faixaReferencia } = classifyBodyFat(
    clampedTargetFat,
    sexo,
    idade
  );

  return {
    percentualGorduraAlvo: clampedTargetFat,
    percentualGorduraAtual,
    massaLivreGorduraPreservadaKg: Number(mlg.toFixed(2)),
    massaGordaAtualKg: Number(mgAtual.toFixed(2)),
    pesoAtualKg: Number(pesoAtual.toFixed(2)),
    pesoAlvoKg,
    massaGordaAlvoKg,
    gorduraDiferencaKg,
    pesoDiferencaKg,
    tipoMeta,
    imcAtual,
    imcAlvo,
    semanasEstimadasSustentavel,
    mesesEstimadosSustentavel,
    semanasEstimadasModerado,
    mesesEstimadosModerado,
    limiteGorduraEssencial,
    isAbaixoGorduraEssencial,
    alertaClinico,
    classificacaoAlvo,
    faixaReferencia,
  };
}

