export type Gender = 'masculino' | 'feminino';

export type ActivityLevel = 'sedentario' | 'leve' | 'moderado' | 'intenso' | 'atleta';

export type MethodType = 'jackon-pollock' | 'durnin-womersley';

export type ProtocolType = 'jp-3' | 'jp-4' | 'jp-7' | 'dw-4';

export type DensityEquation = 'siri' | 'brozek';

export type SkinfoldKey =
  | 'peitoral'
  | 'axilarMedia'
  | 'triceps'
  | 'subescapular'
  | 'abdomen'
  | 'supraIliaca'
  | 'coxa'
  | 'biceps'
  | 'panturrilhaMedial';

export interface SkinfoldSexReference {
  min: number;
  max: number;
  media: number;
  faixaTexto: string;
}

export interface SkinfoldNormativeRange {
  homens: SkinfoldSexReference;
  mulheres: SkinfoldSexReference;
  descricaoClinica: string;
  referencia: string;
}

export interface SkinfoldDefinition {
  key: SkinfoldKey;
  number: number;
  name: string;
  shortName: string;
  anatomicalLocation: string;
  orientation: 'vertical' | 'diagonal' | 'horizontal';
  view: 'anterior' | 'posterior' | 'lateral';
  instructions: string;
  pinchingTips: string;
  normas?: SkinfoldNormativeRange;
  cxFront?: number;
  cyFront?: number;
  cxBack?: number;
  cyBack?: number;
}

export type SkinfoldValues = Partial<Record<SkinfoldKey, number | null>>;

export type SkinfoldValidationSeverity = 'none' | 'warning' | 'error';

export type SkinfoldValidationType =
  | 'valid'
  | 'below_biological_min'      // < 1.5mm (abaixo do limite biológico da pele humana)
  | 'above_caliper_max'         // > 70.0mm (excede a abertura física e precisão dos adipômetros)
  | 'atypical_low'              // abaixo da faixa mínima usual para a dobra e sexo
  | 'atypical_high'             // acima da faixa máxima usual para a dobra e sexo
  | 'suspected_decimal_error'   // ex: digitou 150 em vez de 15.0 ou 240 em vez de 24.0
  | 'negative_value'            // valor menor que zero
  | 'empty';

export interface SkinfoldValidationResult {
  key: SkinfoldKey;
  value: number | null;
  status: 'valid' | 'warning' | 'error' | 'empty';
  severity: SkinfoldValidationSeverity;
  type: SkinfoldValidationType;
  title: string;
  message: string;
  clinicalExplanation: string;
  suggestion?: number | null;
  suggestionLabel?: string;
  normMin: number;
  normMax: number;
  warnMin: number;
  warnMax: number;
  absoluteMin: number;
  absoluteMax: number;
  referenceText: string;
}

export interface SkinfoldsIntegritySummary {
  totalChecked: number;
  validCount: number;
  warningCount: number;
  errorCount: number;
  hasErrors: boolean;
  hasWarnings: boolean;
  criticalFields: SkinfoldKey[];
  warningFields: SkinfoldKey[];
}

export interface PerimetryValues {
  ombro?: number | null;
  torax?: number | null;
  cintura?: number | null;
  abdomen?: number | null;
  quadril?: number | null;
  bracoDireito?: number | null;
  bracoEsquerdo?: number | null;
  antebracoDireito?: number | null;
  antebracoEsquerdo?: number | null;
  coxaDireita?: number | null;
  coxaEsquerda?: number | null;
  panturrilhaDireita?: number | null;
  panturrilhaEsquerda?: number | null;
}

export interface PatientInfo {
  id: string;
  nome: string;
  sexo: Gender;
  idade: number;
  peso: number; // kg
  altura: number; // cm
  dataNascimento?: string;
  nivelAtividade: ActivityLevel;
  avaliador: string;
  dataAvaliacao: string;
  observacoes?: string;
}

export interface CalculationResult {
  somaDobras: number;
  densidadeCorporal: number;
  percentualGordura: number;
  massaGordaKg: number;
  massaLivreGorduraKg: number;
  tmb: number;
  imc: number;
  imcClassificacao: string;
  rcq: number | null;
  rcqClassificacao: string | null;
  rcqRisco: 'baixo' | 'moderado' | 'alto' | 'muito_alto' | null;
  gorduraClassificacao: string;
  faixaReferencia: string;
  equacaoNome: string;
  equacaoFormula: string;
  conversaoFormula: string;
  dobrasUtilizadas: SkinfoldKey[];
  isValid: boolean;
  missingFields: string[];
}

export interface GoalSimulationInput {
  pesoAtualKg: number;
  percentualGorduraAtual: number;
  percentualGorduraAlvo: number;
  massaLivreGorduraAtualKg: number;
  alturaCm?: number;
  sexo: Gender;
  idade: number;
}

export interface GoalSimulationResult {
  percentualGorduraAlvo: number;
  percentualGorduraAtual: number;
  massaLivreGorduraPreservadaKg: number;
  massaGordaAtualKg: number;
  pesoAtualKg: number;
  pesoAlvoKg: number;
  massaGordaAlvoKg: number;
  gorduraDiferencaKg: number; // positivo: gordura a perder; negativo: gordura a ganhar
  pesoDiferencaKg: number;    // positivo: peso a perder; negativo: peso a ganhar
  tipoMeta: 'perda_gordura' | 'ganho_gordura' | 'manutencao';
  imcAtual: number;
  imcAlvo: number;
  semanasEstimadasSustentavel: number;
  mesesEstimadosSustentavel: number;
  semanasEstimadasModerado: number;
  mesesEstimadosModerado: number;
  limiteGorduraEssencial: number;
  isAbaixoGorduraEssencial: boolean;
  alertaClinico?: string;
  classificacaoAlvo: string;
  faixaReferencia: string;
}

export interface EvaluationRecord {
  id: string;
  titulo: string;
  patient: PatientInfo;
  method: MethodType;
  protocol: ProtocolType;
  densityEquation: DensityEquation;
  skinfolds: SkinfoldValues;
  perimetry: PerimetryValues;
  results: CalculationResult;
  createdAt: string;
}

export interface ConsistencyIssue {
  skinfoldKey?: SkinfoldKey | string;
  skinfoldName: string;
  severity: 'alta' | 'moderada' | 'leve';
  title: string;
  description: string;
  clinicalReason: string;
  suggestedAction: string;
}

export interface ConsistencyAnalysisResult {
  status: 'consistente' | 'atencao' | 'inconsistente';
  overallScore: number; // 0 a 100
  headline: string;
  summary: string;
  issues: ConsistencyIssue[];
  recommendations: string[];
  anatomicRatios?: {
    tricepsSubescapularRatio?: number;
    bicepsTricepsRatio?: number;
    abdomenSuprailiacaRatio?: number;
  };
  analyzedAt: string;
}

