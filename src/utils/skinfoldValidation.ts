import {
  Gender,
  SkinfoldKey,
  SkinfoldValues,
  SkinfoldValidationResult,
  SkinfoldsIntegritySummary,
  SkinfoldValidationSeverity,
  SkinfoldValidationType,
} from '../types';
import { SKINFOLD_DEFINITIONS, SKINFOLD_NORMATIVE_RANGES } from '../data/protocolData';

/**
 * =====================================================================
 * SISTEMA CLÍNICO DE VALIDAÇÃO FISIOLÓGICA DE DOBRAS CUTÂNEAS
 * =====================================================================
 * Baseado nas diretrizes e limites da ISAK (International Society for the
 * Advancement of Kinanthropometry), Lohman (1991), Harrison et al. (1988)
 * e Jackson & Pollock (1978/1980).
 *
 * Previne erros de digitação (ex: omissão da vírgula decimal, valores
 * negativos, valores abaixo da espessura biológica mínima da pele ou
 * acima da abertura mecânica funcional do adipômetro).
 * =====================================================================
 */

/**
 * Limite biológico absoluto inferior da dupla camada cutânea humana (derme + epiderme).
 * Uma dobra < 1.5 mm é fisicamente impossível no ser humano vivo.
 */
export const ABSOLUTE_BIOLOGICAL_MIN_MM = 1.5;

/**
 * Limite físico superior de abertura dos adipômetros científicos calibrados (10 g/mm²).
 * Acima de 70.0 mm, a compressão da mola perde calibração e indica erro de digitação.
 */
export const ABSOLUTE_CALIPER_MAX_MM = 70.0;

/**
 * Matriz de limites fisiológicos e de alerta clínico por dobra e sexo biológico.
 * Fontes: ISAK (2001), Lohman (1991), Harrison et al. (1988) & ACSM Guidelines.
 */
export interface PhysiologicalThreshold {
  homens: {
    normMin: number;
    normMax: number;
    warnMin: number;
    warnMax: number;
    faixaNormaTexto: string;
  };
  mulheres: {
    normMin: number;
    normMax: number;
    warnMin: number;
    warnMax: number;
    faixaNormaTexto: string;
  };
  descricaoFisiologica: string;
}

export const SKINFOLD_PHYSIOLOGICAL_THRESHOLDS: Record<SkinfoldKey, PhysiologicalThreshold> = {
  peitoral: {
    homens: { normMin: 4.0, normMax: 12.0, warnMin: 2.5, warnMax: 26.0, faixaNormaTexto: '4 a 12 mm' },
    mulheres: { normMin: 8.0, normMax: 18.0, warnMin: 3.5, warnMax: 35.0, faixaNormaTexto: '8 a 18 mm' },
    descricaoFisiologica: 'Dobra torácica superior; em homens atletas costuma ser muito delgada (< 5 mm), e em mulheres varia conforme densidade do quadrante peitoral.',
  },
  axilarMedia: {
    homens: { normMin: 6.0, normMax: 15.0, warnMin: 3.0, warnMax: 32.0, faixaNormaTexto: '6 a 15 mm' },
    mulheres: { normMin: 8.0, normMax: 18.0, warnMin: 4.0, warnMax: 38.0, faixaNormaTexto: '8 a 18 mm' },
    descricaoFisiologica: 'Parede lateral do gradil costal; reflete tecido adiposo subcutâneo troncular.',
  },
  triceps: {
    homens: { normMin: 6.0, normMax: 14.0, warnMin: 3.0, warnMax: 32.0, faixaNormaTexto: '6 a 14 mm' },
    mulheres: { normMin: 12.0, normMax: 24.0, warnMin: 5.0, warnMax: 45.0, faixaNormaTexto: '12 a 24 mm' },
    descricaoFisiologica: 'Principal indicador de reserva energética periférica; apresenta acentuado dimorfismo sexual.',
  },
  subescapular: {
    homens: { normMin: 8.0, normMax: 16.0, warnMin: 4.0, warnMax: 36.0, faixaNormaTexto: '8 a 16 mm' },
    mulheres: { normMin: 10.0, normMax: 20.0, warnMin: 5.0, warnMax: 45.0, faixaNormaTexto: '10 a 20 mm' },
    descricaoFisiologica: 'Adiposidade troncular central posterior; correlaciona-se com perfil metabólico e risco cardiovascular.',
  },
  abdomen: {
    homens: { normMin: 10.0, normMax: 22.0, warnMin: 4.0, warnMax: 48.0, faixaNormaTexto: '10 a 22 mm' },
    mulheres: { normMin: 14.0, normMax: 28.0, warnMin: 5.0, warnMax: 55.0, faixaNormaTexto: '14 a 28 mm' },
    descricaoFisiologica: 'Depósito periumbilical androide; sensível a alterações energéticas agudas e estilo de vida.',
  },
  supraIliaca: {
    homens: { normMin: 6.0, normMax: 16.0, warnMin: 3.0, warnMax: 36.0, faixaNormaTexto: '6 a 16 mm' },
    mulheres: { normMin: 10.0, normMax: 24.0, warnMin: 4.5, warnMax: 48.0, faixaNormaTexto: '10 a 24 mm' },
    descricaoFisiologica: 'Dobra de transição tóraco-abdominal sobre a crista ilíaca anterior.',
  },
  coxa: {
    homens: { normMin: 8.0, normMax: 18.0, warnMin: 4.0, warnMax: 40.0, faixaNormaTexto: '8 a 18 mm' },
    mulheres: { normMin: 16.0, normMax: 30.0, warnMin: 6.0, warnMax: 55.0, faixaNormaTexto: '16 a 30 mm' },
    descricaoFisiologica: 'Membro inferior anterior (reto femoral); depósito ginoide característico em mulheres.',
  },
  biceps: {
    homens: { normMin: 3.0, normMax: 8.0, warnMin: 2.0, warnMax: 18.0, faixaNormaTexto: '3 a 8 mm' },
    mulheres: { normMin: 5.0, normMax: 14.0, warnMin: 2.5, warnMax: 26.0, faixaNormaTexto: '5 a 14 mm' },
    descricaoFisiologica: 'Face anterior braquial; espessura naturalmente delgada na grande maioria dos indivíduos.',
  },
  panturrilhaMedial: {
    homens: { normMin: 6.0, normMax: 14.0, warnMin: 3.0, warnMax: 30.0, faixaNormaTexto: '6 a 14 mm' },
    mulheres: { normMin: 10.0, normMax: 20.0, warnMin: 4.5, warnMax: 40.0, faixaNormaTexto: '10 a 20 mm' },
    descricaoFisiologica: 'Ponto de maior perímetro do gastrocnêmio medial; dobra periférica de extremidade.',
  },
};

/**
 * Valida um valor individual de dobra cutânea em tempo real
 */
export function validateSkinfold(
  key: SkinfoldKey,
  rawVal: number | string | null | undefined,
  sexo: Gender = 'masculino'
): SkinfoldValidationResult {
  const def = SKINFOLD_DEFINITIONS[key] || { name: key, shortName: key };
  const threshold = SKINFOLD_PHYSIOLOGICAL_THRESHOLDS[key];
  const activeSexThreshold = sexo === 'feminino' ? threshold.mulheres : threshold.homens;

  // 1. Campo vazio ou nulo
  if (rawVal === null || rawVal === undefined || rawVal === '' || (typeof rawVal === 'number' && isNaN(rawVal))) {
    return {
      key,
      value: null,
      status: 'empty',
      severity: 'none',
      type: 'empty',
      title: 'Não preenchido',
      message: 'Campo em branco.',
      clinicalExplanation: 'Aguardando inserção de valor aferido com adipômetro.',
      normMin: activeSexThreshold.normMin,
      normMax: activeSexThreshold.normMax,
      warnMin: activeSexThreshold.warnMin,
      warnMax: activeSexThreshold.warnMax,
      absoluteMin: ABSOLUTE_BIOLOGICAL_MIN_MM,
      absoluteMax: ABSOLUTE_CALIPER_MAX_MM,
      referenceText: `Faixa esperada: ${activeSexThreshold.faixaNormaTexto} (Lohman / ACSM)`,
    };
  }

  const val = typeof rawVal === 'string' ? parseFloat(rawVal.replace(',', '.')) : Number(rawVal);

  // 2. Valor negativo
  if (val < 0) {
    return {
      key,
      value: val,
      status: 'error',
      severity: 'error',
      type: 'negative_value',
      title: 'Valor Negativo Inadmissível',
      message: 'Dobra cutânea não pode ser negativa.',
      clinicalExplanation: 'Erro de digitação: medidas de espessura de tecido subcutâneo são estritamente positivas.',
      suggestion: Math.abs(val),
      suggestionLabel: `Usar valor positivo (${Math.abs(val).toFixed(1)} mm)`,
      normMin: activeSexThreshold.normMin,
      normMax: activeSexThreshold.normMax,
      warnMin: activeSexThreshold.warnMin,
      warnMax: activeSexThreshold.warnMax,
      absoluteMin: ABSOLUTE_BIOLOGICAL_MIN_MM,
      absoluteMax: ABSOLUTE_CALIPER_MAX_MM,
      referenceText: `Faixa esperada: ${activeSexThreshold.faixaNormaTexto}`,
    };
  }

  // 3. Valor menor que o mínimo biológico (1.5 mm)
  if (val < ABSOLUTE_BIOLOGICAL_MIN_MM) {
    const isZero = val === 0;
    return {
      key,
      value: val,
      status: 'error',
      severity: 'error',
      type: 'below_biological_min',
      title: isZero ? 'Valor Zero Detectado' : 'Abaixo do Limite Biológico Humano',
      message: isZero
        ? 'Dobra igual a 0.0 mm é biologicamente impossível.'
        : `${val.toFixed(1)} mm está abaixo da espessura mínima da pele humana (${ABSOLUTE_BIOLOGICAL_MIN_MM} mm).`,
      clinicalExplanation:
        'A dupla camada de derme e epiderme humana isolada, mesmo sem tecido adiposo subcutâneo, mede no mínimo 1.5 mm (ISAK / Lohman). Verifique a leitura do adipômetro.',
      suggestion: val > 0 && val < 1.5 ? val * 10 : null,
      suggestionLabel: val > 0 && val < 1.5 ? `Você quis dizer ${(val * 10).toFixed(1)} mm?` : undefined,
      normMin: activeSexThreshold.normMin,
      normMax: activeSexThreshold.normMax,
      warnMin: activeSexThreshold.warnMin,
      warnMax: activeSexThreshold.warnMax,
      absoluteMin: ABSOLUTE_BIOLOGICAL_MIN_MM,
      absoluteMax: ABSOLUTE_CALIPER_MAX_MM,
      referenceText: `Mínimo biológico: ${ABSOLUTE_BIOLOGICAL_MIN_MM} mm | Faixa normal: ${activeSexThreshold.faixaNormaTexto}`,
    };
  }

  // 4. Suspeita de erro de casa decimal (ex: digitou 150 em vez de 15.0 ou 225 em vez de 22.5)
  if (val > ABSOLUTE_CALIPER_MAX_MM && val <= 700.0) {
    const suggested = Number((val / 10).toFixed(1));
    return {
      key,
      value: val,
      status: 'error',
      severity: 'error',
      type: 'suspected_decimal_error',
      title: 'Provável Erro de Casa Decimal',
      message: `${val.toFixed(1)} mm excede a abertura funcional do adipômetro (máx ${ABSOLUTE_CALIPER_MAX_MM} mm).`,
      clinicalExplanation: `Você provavelmente digitou sem o ponto/vírgula decimal. Um valor de ${suggested.toFixed(1)} mm é altamente coerente para a dobra ${def.name}.`,
      suggestion: suggested,
      suggestionLabel: `Corrigir para ${suggested.toFixed(1)} mm`,
      normMin: activeSexThreshold.normMin,
      normMax: activeSexThreshold.normMax,
      warnMin: activeSexThreshold.warnMin,
      warnMax: activeSexThreshold.warnMax,
      absoluteMin: ABSOLUTE_BIOLOGICAL_MIN_MM,
      absoluteMax: ABSOLUTE_CALIPER_MAX_MM,
      referenceText: `Abertura máxima padrão: ${ABSOLUTE_CALIPER_MAX_MM} mm | Sugestão: ${suggested.toFixed(1)} mm`,
    };
  }

  // 5. Acima da abertura mecânica absoluta do adipômetro (> 700 mm)
  if (val > 700.0) {
    return {
      key,
      value: val,
      status: 'error',
      severity: 'error',
      type: 'above_caliper_max',
      title: 'Valor Excessivo Inadmissível',
      message: `${val.toFixed(1)} mm é incompatível com antropometria por dobras.`,
      clinicalExplanation:
        'Medida excede qualquer escala clínica de adipometria. Recomenda-se apagar e redigitar a medida correta.',
      normMin: activeSexThreshold.normMin,
      normMax: activeSexThreshold.normMax,
      warnMin: activeSexThreshold.warnMin,
      warnMax: activeSexThreshold.warnMax,
      absoluteMin: ABSOLUTE_BIOLOGICAL_MIN_MM,
      absoluteMax: ABSOLUTE_CALIPER_MAX_MM,
      referenceText: `Abertura máxima: ${ABSOLUTE_CALIPER_MAX_MM} mm`,
    };
  }

  // 6. Alerta de desvio fisiológico atípico elevado (Warning)
  if (val > activeSexThreshold.warnMax) {
    return {
      key,
      value: val,
      status: 'warning',
      severity: 'warning',
      type: 'atypical_high',
      title: 'Valor Fisiologicamente Incomum (Elevado)',
      message: `${val.toFixed(1)} mm é muito superior à média para ${def.shortName || def.name} (${sexo === 'feminino' ? 'mulheres' : 'homens'}).`,
      clinicalExplanation: `A faixa de normalidade clínica é ${activeSexThreshold.faixaNormaTexto}. Valores acima de ${activeSexThreshold.warnMax} mm são raros e podem distorcer equações de densidade corporal (Jackson & Pollock / Durnin). Confirme se a prega foi destacada corretamente sem pinçar o músculo subjacente.`,
      normMin: activeSexThreshold.normMin,
      normMax: activeSexThreshold.normMax,
      warnMin: activeSexThreshold.warnMin,
      warnMax: activeSexThreshold.warnMax,
      absoluteMin: ABSOLUTE_BIOLOGICAL_MIN_MM,
      absoluteMax: ABSOLUTE_CALIPER_MAX_MM,
      referenceText: `Faixa normal esperada: ${activeSexThreshold.faixaNormaTexto} | Alerta > ${activeSexThreshold.warnMax} mm`,
    };
  }

  // 7. Alerta de desvio fisiológico atípico reduzido (Warning)
  if (val < activeSexThreshold.warnMin) {
    return {
      key,
      value: val,
      status: 'warning',
      severity: 'warning',
      type: 'atypical_low',
      title: 'Valor Fisiologicamente Incomum (Muito Delgado)',
      message: `${val.toFixed(1)} mm é incomumente baixo para ${def.shortName || def.name}.`,
      clinicalExplanation: `A faixa típica é ${activeSexThreshold.faixaNormaTexto}. Medidas abaixo de ${activeSexThreshold.warnMin} mm são encontradas apenas em atletas de elite de modalidades com restrição de peso extrema (fisiculturismo pré-competição, maratona) ou em casos de desnutrição severa.`,
      normMin: activeSexThreshold.normMin,
      normMax: activeSexThreshold.normMax,
      warnMin: activeSexThreshold.warnMin,
      warnMax: activeSexThreshold.warnMax,
      absoluteMin: ABSOLUTE_BIOLOGICAL_MIN_MM,
      absoluteMax: ABSOLUTE_CALIPER_MAX_MM,
      referenceText: `Faixa normal esperada: ${activeSexThreshold.faixaNormaTexto} | Alerta < ${activeSexThreshold.warnMin} mm`,
    };
  }

  // 8. Valor válido dentro dos limites clínicos normais
  return {
    key,
    value: val,
    status: 'valid',
    severity: 'none',
    type: 'valid',
    title: 'Valor Consistente',
    message: `${val.toFixed(1)} mm está dentro dos limites fisiológicos aceitáveis.`,
    clinicalExplanation:
      val >= activeSexThreshold.normMin && val <= activeSexThreshold.normMax
        ? `Perfeitamente alinhado à faixa normativa esperada (${activeSexThreshold.faixaNormaTexto}).`
        : `Dentro do intervalo fisiológico aceitável para o sítio anatômico.`,
    normMin: activeSexThreshold.normMin,
    normMax: activeSexThreshold.normMax,
    warnMin: activeSexThreshold.warnMin,
    warnMax: activeSexThreshold.warnMax,
    absoluteMin: ABSOLUTE_BIOLOGICAL_MIN_MM,
    absoluteMax: ABSOLUTE_CALIPER_MAX_MM,
    referenceText: `Faixa de referência: ${activeSexThreshold.faixaNormaTexto}`,
  };
}

/**
 * Valida todas as dobras cutâneas ativas de uma só vez
 */
export function validateAllSkinfolds(
  values: SkinfoldValues,
  activeKeys: SkinfoldKey[],
  sexo: Gender = 'masculino'
): Record<SkinfoldKey, SkinfoldValidationResult> {
  const result = {} as Record<SkinfoldKey, SkinfoldValidationResult>;

  for (const key of activeKeys) {
    result[key] = validateSkinfold(key, values[key], sexo);
  }

  return result;
}

/**
 * Produz um resumo global de integridade das dobras para exibição em banners/alertas
 */
export function getSkinfoldsIntegritySummary(
  validationMap: Record<SkinfoldKey, SkinfoldValidationResult>,
  activeKeys: SkinfoldKey[]
): SkinfoldsIntegritySummary {
  let validCount = 0;
  let warningCount = 0;
  let errorCount = 0;
  const criticalFields: SkinfoldKey[] = [];
  const warningFields: SkinfoldKey[] = [];

  for (const key of activeKeys) {
    const valResult = validationMap[key];
    if (!valResult) continue;

    if (valResult.status === 'error') {
      errorCount++;
      criticalFields.push(key);
    } else if (valResult.status === 'warning') {
      warningCount++;
      warningFields.push(key);
    } else if (valResult.status === 'valid') {
      validCount++;
    }
  }

  return {
    totalChecked: activeKeys.length,
    validCount,
    warningCount,
    errorCount,
    hasErrors: errorCount > 0,
    hasWarnings: warningCount > 0,
    criticalFields,
    warningFields,
  };
}

/**
 * Validação de consistência entre tomadas repetidas (2 a 3 medições)
 * de acordo com o Erro Técnico de Medição (TEM) do protocolo ISAK.
 * A variação entre tomadas no mesmo sítio deve ser <= 5% (ou <= 1.5mm em dobras finas).
 */
export interface TrialConsistencyResult {
  isConsistent: boolean;
  average: number | null;
  maxDiffMm: number;
  maxDiffPercent: number;
  warning?: string;
  hasErrors: boolean;
  errorsList: string[];
}

export function validateTrialMeasurements(
  t1Str: string,
  t2Str: string,
  t3Str?: string,
  key?: SkinfoldKey,
  sexo: Gender = 'masculino'
): TrialConsistencyResult {
  const v1 = t1Str.trim() !== '' ? parseFloat(t1Str.replace(',', '.')) : null;
  const v2 = t2Str.trim() !== '' ? parseFloat(t2Str.replace(',', '.')) : null;
  const v3 = t3Str && t3Str.trim() !== '' ? parseFloat(t3Str.replace(',', '.')) : null;

  const validNumbers = [v1, v2, v3].filter((n): n is number => n !== null && !isNaN(n));
  const errorsList: string[] = [];

  // Checar erros individuais de cada tomada
  validNumbers.forEach((val, idx) => {
    if (val < ABSOLUTE_BIOLOGICAL_MIN_MM) {
      errorsList.push(`${idx + 1}ª tomada (${val} mm) está abaixo do mínimo biológico (1.5 mm).`);
    } else if (val > ABSOLUTE_CALIPER_MAX_MM) {
      errorsList.push(`${idx + 1}ª tomada (${val} mm) excede o limite máximo físico (70 mm).`);
    }
  });

  if (validNumbers.length < 2) {
    return {
      isConsistent: true,
      average: validNumbers.length === 1 ? validNumbers[0] : null,
      maxDiffMm: 0,
      maxDiffPercent: 0,
      hasErrors: errorsList.length > 0,
      errorsList,
    };
  }

  const min = Math.min(...validNumbers);
  const max = Math.max(...validNumbers);
  const avg = validNumbers.reduce((a, b) => a + b, 0) / validNumbers.length;
  const maxDiffMm = Number((max - min).toFixed(1));
  const maxDiffPercent = avg > 0 ? Number(((maxDiffMm / avg) * 100).toFixed(1)) : 0;

  // Critério ISAK: Discrepância > 5% entre duplicatas requer 3ª medição e atenção
  let isConsistent = true;
  let warning: string | undefined;

  if (maxDiffPercent > 7.5 || maxDiffMm > 2.0) {
    isConsistent = false;
    warning = `Discrepância de ${maxDiffMm} mm (${maxDiffPercent}%) entre as tomadas excede o Erro Técnico aceitável da ISAK (máx 5% ou 1.5 mm). Recomenda-se realizar uma 3ª tomada ou repetir a aferição.`;
  }

  return {
    isConsistent,
    average: Number(avg.toFixed(1)),
    maxDiffMm,
    maxDiffPercent,
    warning,
    hasErrors: errorsList.length > 0,
    errorsList,
  };
}
