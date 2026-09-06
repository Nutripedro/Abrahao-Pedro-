import { Gender, PerimetryValues, SkinfoldKey, SkinfoldValues } from '../types';

export interface BioimpedanceData {
  percentualGordura?: number;
  massaMuscularKg?: number;
  massaMagraKg?: number;
  massaGordaKg?: number;
  aguaCorporalPerc?: number;
  gorduraVisceral?: number;
  tmbKcal?: number;
  impedanciaOhm?: number;
}

export interface ParsedClinicalData {
  patient?: {
    peso?: number;
    altura?: number;
    idade?: number;
    sexo?: Gender;
  };
  bioimpedance?: BioimpedanceData;
  perimetry?: PerimetryValues;
  skinfolds?: SkinfoldValues;
  sourceType: 'bluetooth_scale' | 'bluetooth_tape' | 'text_file' | 'manual_paste' | 'simulation';
  deviceName?: string;
  recognizedFieldsCount: number;
  rawSnippet?: string;
  warnings: string[];
}

/**
 * Normaliza strings para busca insensível a acentos e maiúsculas
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Converte valor numérico sanitizado (suporta vírgula e ponto)
 */
function parseNumber(rawVal: string): number | null {
  if (!rawVal) return null;
  const clean = rawVal.replace(/[^\d.,]/g, '').replace(',', '.');
  const num = parseFloat(clean);
  return isNaN(num) ? null : Number(num.toFixed(2));
}

/**
 * Validação de plausibilidade biológica para segurança clínica
 */
function isPhysiologicallyPlausible(field: string, value: number): boolean {
  if (value <= 0) return false;

  switch (field) {
    case 'peso':
      return value >= 20 && value <= 350; // kg
    case 'altura':
      return value >= 50 && value <= 250; // cm
    case 'idade':
      return value >= 1 && value <= 120; // anos
    case 'percentualGordura':
    case 'aguaCorporalPerc':
      return value >= 3 && value <= 75; // %
    case 'gorduraVisceral':
      return value >= 1 && value <= 60; // escala
    case 'tmbKcal':
      return value >= 500 && value <= 5000; // kcal
    default:
      // Perimetrias e Dobras
      if (field.startsWith('dobra_')) {
        return value >= 1 && value <= 90; // mm
      }
      return value >= 10 && value <= 220; // cm perimetrias
  }
}

/**
 * Parser inteligente de arquivos de texto, relatórios de balanças e fitas digitais
 */
export function parseClinicalText(rawContent: string): ParsedClinicalData {
  const lines = rawContent.split(/\r?\n/);
  const result: ParsedClinicalData = {
    patient: {},
    bioimpedance: {},
    perimetry: {},
    skinfolds: {},
    sourceType: 'text_file',
    recognizedFieldsCount: 0,
    warnings: [],
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('//')) continue;

    // Divide em chave e valor considerando dois-pontos, igual, tabulação ou ponto-e-vírgula/vírgula
    let keyPart = '';
    let valPart = '';

    if (trimmed.includes(':')) {
      const parts = trimmed.split(':');
      keyPart = parts[0];
      valPart = parts.slice(1).join(':');
    } else if (trimmed.includes('=')) {
      const parts = trimmed.split('=');
      keyPart = parts[0];
      valPart = parts.slice(1).join('=');
    } else if (trimmed.includes('\t')) {
      const parts = trimmed.split('\t');
      keyPart = parts[0];
      valPart = parts.slice(1).join(' ');
    } else if (trimmed.includes(';') || trimmed.includes(',')) {
      const delimiter = trimmed.includes(';') ? ';' : ',';
      const parts = trimmed.split(delimiter);
      if (parts.length >= 2) {
        keyPart = parts[0];
        valPart = parts[1];
      }
    }

    if (!keyPart || !valPart) {
      // Tentativa de regex para formatos tipo "Peso 74.5 kg" ou "Cintura 82.0cm"
      const match = trimmed.match(/^([a-zA-ZÀ-ÿ\s_-]+)[\s]+([0-9.,]+)(.*)$/);
      if (match) {
        keyPart = match[1];
        valPart = match[2];
      }
    }

    const normKey = normalizeText(keyPart);
    const numVal = parseNumber(valPart);

    if (numVal === null) continue;

    // --- Mapeamento de Dados do Paciente e Bioimpedância ---
    if (normKey.includes('peso') || normKey === 'weight' || normKey === 'peso corporal' || normKey === 'wt') {
      if (isPhysiologicallyPlausible('peso', numVal)) {
        result.patient!.peso = numVal;
        result.recognizedFieldsCount++;
      } else {
        result.warnings.push(`Peso (${numVal} kg) fora do intervalo clínico plausível.`);
      }
    } else if (normKey.includes('altura') || normKey === 'height' || normKey === 'estatura' || normKey === 'ht') {
      // Caso altura venha em metros (ex: 1.75m), converte para cm
      const alturaCm = numVal < 3 ? Number((numVal * 100).toFixed(1)) : numVal;
      if (isPhysiologicallyPlausible('altura', alturaCm)) {
        result.patient!.altura = alturaCm;
        result.recognizedFieldsCount++;
      } else {
        result.warnings.push(`Altura (${numVal}) fora do intervalo clínico plausível.`);
      }
    } else if (normKey.includes('idade') || normKey === 'age') {
      if (isPhysiologicallyPlausible('idade', numVal)) {
        result.patient!.idade = Math.round(numVal);
        result.recognizedFieldsCount++;
      }
    } else if (
      normKey.includes('gordura') ||
      normKey.includes('percentual gordura') ||
      normKey.includes('% gordura') ||
      normKey.includes('fat') ||
      normKey.includes('bf%') ||
      normKey === 'bf' ||
      normKey.includes('% fat') ||
      normKey.includes('body fat')
    ) {
      if (isPhysiologicallyPlausible('percentualGordura', numVal)) {
        result.bioimpedance!.percentualGordura = numVal;
        result.recognizedFieldsCount++;
      }
    } else if (
      normKey.includes('massa muscular') ||
      normKey.includes('muscle mass') ||
      normKey.includes('massa magra') ||
      normKey.includes('lean mass') ||
      normKey.includes('smm')
    ) {
      if (isPhysiologicallyPlausible('peso', numVal)) {
        result.bioimpedance!.massaMuscularKg = numVal;
        result.bioimpedance!.massaMagraKg = numVal;
        result.recognizedFieldsCount++;
      }
    } else if (normKey.includes('massa gorda') || normKey.includes('fat mass') || normKey === 'fm') {
      if (isPhysiologicallyPlausible('peso', numVal)) {
        result.bioimpedance!.massaGordaKg = numVal;
        result.recognizedFieldsCount++;
      }
    } else if (normKey.includes('agua') || normKey.includes('water') || normKey.includes('tbw')) {
      if (isPhysiologicallyPlausible('aguaCorporalPerc', numVal)) {
        result.bioimpedance!.aguaCorporalPerc = numVal;
        result.recognizedFieldsCount++;
      }
    } else if (normKey.includes('visceral') || normKey.includes('gordura visceral') || normKey === 'vfl') {
      if (isPhysiologicallyPlausible('gorduraVisceral', numVal)) {
        result.bioimpedance!.gorduraVisceral = Math.round(numVal);
        result.recognizedFieldsCount++;
      }
    } else if (normKey.includes('tmb') || normKey.includes('bmr') || normKey.includes('metabolismo basal')) {
      if (isPhysiologicallyPlausible('tmbKcal', numVal)) {
        result.bioimpedance!.tmbKcal = Math.round(numVal);
        result.recognizedFieldsCount++;
      }
    } else if (normKey.includes('impedancia') || normKey.includes('impedance') || normKey.includes('resistencia')) {
      result.bioimpedance!.impedanciaOhm = numVal;
      result.recognizedFieldsCount++;
    }

    // --- Mapeamento de Perimetrias (Sensores / Fita métrica digital) ---
    else if (normKey.includes('cintura') || normKey === 'waist') {
      if (isPhysiologicallyPlausible('cintura', numVal)) {
        result.perimetry!.cintura = numVal;
        result.recognizedFieldsCount++;
      }
    } else if (normKey.includes('quadril') || normKey === 'hip') {
      if (isPhysiologicallyPlausible('quadril', numVal)) {
        result.perimetry!.quadril = numVal;
        result.recognizedFieldsCount++;
      }
    } else if (normKey.includes('abdomen') || normKey.includes('abdominal') || normKey === 'belly') {
      if (isPhysiologicallyPlausible('abdomen', numVal)) {
        result.perimetry!.abdomen = numVal;
        result.recognizedFieldsCount++;
      }
    } else if (normKey.includes('torax') || normKey.includes('peito') || normKey === 'chest') {
      if (isPhysiologicallyPlausible('torax', numVal)) {
        result.perimetry!.torax = numVal;
        result.recognizedFieldsCount++;
      }
    } else if (normKey.includes('ombro') || normKey === 'shoulder') {
      if (isPhysiologicallyPlausible('ombro', numVal)) {
        result.perimetry!.ombro = numVal;
        result.recognizedFieldsCount++;
      }
    } else if (
      (normKey.includes('braco') && (normKey.includes('direito') || normKey.includes('dir') || normKey.includes('d'))) ||
      normKey === 'arm_r' || normKey === 'right_arm'
    ) {
      if (isPhysiologicallyPlausible('bracoDireito', numVal)) {
        result.perimetry!.bracoDireito = numVal;
        result.recognizedFieldsCount++;
      }
    } else if (
      (normKey.includes('braco') && (normKey.includes('esquerdo') || normKey.includes('esq') || normKey.includes('e'))) ||
      normKey === 'arm_l' || normKey === 'left_arm'
    ) {
      if (isPhysiologicallyPlausible('bracoEsquerdo', numVal)) {
        result.perimetry!.bracoEsquerdo = numVal;
        result.recognizedFieldsCount++;
      }
    } else if (normKey.includes('braco') || normKey === 'arm') {
      // Se não especificou o lado, atribui a ambos
      if (isPhysiologicallyPlausible('bracoDireito', numVal)) {
        result.perimetry!.bracoDireito = numVal;
        result.perimetry!.bracoEsquerdo = numVal;
        result.recognizedFieldsCount++;
      }
    } else if (
      (normKey.includes('coxa') && (normKey.includes('direita') || normKey.includes('dir') || normKey.includes('d'))) ||
      normKey === 'thigh_r' || normKey === 'right_thigh'
    ) {
      if (isPhysiologicallyPlausible('coxaDireita', numVal)) {
        result.perimetry!.coxaDireita = numVal;
        result.recognizedFieldsCount++;
      }
    } else if (
      (normKey.includes('coxa') && (normKey.includes('esquerda') || normKey.includes('esq') || normKey.includes('e'))) ||
      normKey === 'thigh_l' || normKey === 'left_thigh'
    ) {
      if (isPhysiologicallyPlausible('coxaEsquerda', numVal)) {
        result.perimetry!.coxaEsquerda = numVal;
        result.recognizedFieldsCount++;
      }
    } else if (normKey.includes('coxa') || normKey === 'thigh') {
      if (isPhysiologicallyPlausible('coxaDireita', numVal)) {
        result.perimetry!.coxaDireita = numVal;
        result.perimetry!.coxaEsquerda = numVal;
        result.recognizedFieldsCount++;
      }
    } else if (
      (normKey.includes('panturrilha') && (normKey.includes('direita') || normKey.includes('dir') || normKey.includes('d'))) ||
      normKey === 'calf_r' || normKey === 'right_calf'
    ) {
      if (isPhysiologicallyPlausible('panturrilhaDireita', numVal)) {
        result.perimetry!.panturrilhaDireita = numVal;
        result.recognizedFieldsCount++;
      }
    } else if (
      (normKey.includes('panturrilha') && (normKey.includes('esquerda') || normKey.includes('esq') || normKey.includes('e'))) ||
      normKey === 'calf_l' || normKey === 'left_calf'
    ) {
      if (isPhysiologicallyPlausible('panturrilhaEsquerda', numVal)) {
        result.perimetry!.panturrilhaEsquerda = numVal;
        result.recognizedFieldsCount++;
      }
    } else if (normKey.includes('panturrilha') || normKey === 'calf') {
      if (isPhysiologicallyPlausible('panturrilhaDireita', numVal)) {
        result.perimetry!.panturrilhaDireita = numVal;
        result.perimetry!.panturrilhaEsquerda = numVal;
        result.recognizedFieldsCount++;
      }
    }

    // --- Mapeamento de Dobras Cutâneas (Plicômetro digital / exportação) ---
    else if (normKey.includes('triceps') || normKey === 'tr') {
      if (isPhysiologicallyPlausible('dobra_triceps', numVal)) {
        result.skinfolds!.triceps = numVal;
        result.recognizedFieldsCount++;
      }
    } else if (normKey.includes('subescapular') || normKey === 'sb' || normKey === 'se') {
      if (isPhysiologicallyPlausible('dobra_subescapular', numVal)) {
        result.skinfolds!.subescapular = numVal;
        result.recognizedFieldsCount++;
      }
    } else if (normKey.includes('suprailiaca') || normKey.includes('supra-iliaca') || normKey === 'si') {
      if (isPhysiologicallyPlausible('dobra_supraIliaca', numVal)) {
        result.skinfolds!.supraIliaca = numVal;
        result.recognizedFieldsCount++;
      }
    } else if (normKey.includes('peitoral') || normKey === 'peit' || normKey === 'pt') {
      if (isPhysiologicallyPlausible('dobra_peitoral', numVal)) {
        result.skinfolds!.peitoral = numVal;
        result.recognizedFieldsCount++;
      }
    } else if (normKey.includes('axilar') || normKey.includes('axilar media') || normKey === 'ax') {
      if (isPhysiologicallyPlausible('dobra_axilarMedia', numVal)) {
        result.skinfolds!.axilarMedia = numVal;
        result.recognizedFieldsCount++;
      }
    } else if (normKey.includes('biceps') || normKey === 'bi') {
      if (isPhysiologicallyPlausible('dobra_biceps', numVal)) {
        result.skinfolds!.biceps = numVal;
        result.recognizedFieldsCount++;
      }
    }
  }

  return result;
}

/**
 * Decodifica pacotes Bluetooth SIG Weight Measurement (GATT 0x2A9D)
 */
export function parseBluetoothWeightMeasurement(dataView: DataView): { pesoKg: number; unit: 'kg' | 'lb' } {
  const flags = dataView.getUint8(0);
  const isImperial = (flags & 0x01) !== 0; // Bit 0: 0 = SI (kg), 1 = Imperial (lb)
  
  // Resolução: se SI, Uint16 com fator 0.005 kg ou 0.01 kg conforme dispositivo
  const rawWeight = dataView.getUint16(1, true); // Little endian
  let pesoKg = isImperial ? (rawWeight * 0.01) * 0.453592 : rawWeight * 0.005;

  // Algumas balanças genéricas usam fator 0.1 ou 0.01
  if (pesoKg > 400) {
    pesoKg = pesoKg / 10;
  } else if (pesoKg < 5 && rawWeight > 100) {
    pesoKg = rawWeight * 0.1;
  }

  return {
    pesoKg: Number(pesoKg.toFixed(2)),
    unit: isImperial ? 'lb' : 'kg',
  };
}

/**
 * Decodifica pacotes Bluetooth SIG Body Composition (GATT 0x2A9C)
 */
export function parseBluetoothBodyComposition(dataView: DataView): { percentualGordura: number; impedancia?: number } {
  const flags = dataView.getUint16(0, true);
  const rawBodyFat = dataView.getUint16(2, true);
  const percentualGordura = Number((rawBodyFat * 0.1).toFixed(1));

  let impedancia: number | undefined;
  // Se flag indica campo de impedância presente (ex: bit 9)
  if (dataView.byteLength >= 12) {
    impedancia = dataView.getUint16(dataView.byteLength - 2, true);
  }

  return {
    percentualGordura,
    impedancia,
  };
}

/**
 * Amostras clínicas para teste rápido / demonstração de importação
 */
export const CLINICAL_IMPORT_EXAMPLES = {
  bioimpedanceScale: `# EXPORTAÇÃO BALANÇA DE BIOIMPEDÂNCIA CLÍNICA (InBody / Tanita)
Data: 2026-09-04
Paciente: Camila Mendonça Rodrigues
Peso: 63.8 kg
Altura: 165 cm
Idade: 28
Gordura Corporal: 22.4 %
Massa Muscular: 46.8 kg
Massa Magra: 49.5 kg
Massa Gorda: 14.3 kg
Agua Corporal: 56.8 %
Gordura Visceral: 3
TMB: 1410 kcal
Impedancia: 524 ohm`,

  digitalTape: `# EXPORTAÇÃO FITA MÉTRICA DIGITAL BLUETOOTH (SmartTape)
Data: 2026-09-04
Cintura: 71.0 cm
Quadril: 99.5 cm
Abdomen: 79.0 cm
Torax: 88.0 cm
Ombro: 102.0 cm
Braco Direito: 28.5 cm
Braco Esquerdo: 28.2 cm
Coxa Direita: 57.0 cm
Coxa Esquerda: 56.8 cm
Panturrilha Direita: 36.5 cm
Panturrilha Esquerda: 36.4 cm`,

  integratedCsv: `# PLANILHA CSV DE AVALIAÇÃO INTEGRADA
medida,valor,unidade
peso,64.2,kg
altura,165,cm
cintura,70.5,cm
quadril,99.0,cm
abdomen,78.0,cm
triceps,19.0,mm
subescapular,17.5,mm
suprailiaca,20.5,mm
coxa,27.0,mm
peitoral,13.5,mm`,
};
