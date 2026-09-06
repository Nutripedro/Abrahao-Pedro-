// Fonte Única e Centralizada para Relatórios Clínicos, Gerenciais, Financeiros e Operacionais do SaaS
// Atendendo rigorosamente às 3 personas:
// - Frontend: Design clínico sóbrio, densidade informacional, alinhamento numérico com números tabulares
// - Backend: Fórmulas puras, métricas isoladas e testáveis (LTV, CAC, Taxa de Retenção, Adesão, Composição Corporal Média)
// - Segurança & LGPD: Anonimização, minimização de dados sensíveis e auditoria de exportação

export interface ReportCategory {
  id: string;
  title: string;
  description: string;
  badge: string;
}

export interface ClinicalReportFilter {
  unitId: string;
  professionalId: string;
  period: 'last_7_days' | 'last_30_days' | 'last_90_days' | 'current_month' | 'current_year' | 'custom';
  patientObjective: 'all' | 'emagrecimento' | 'hipertrofia' | 'saude_longevidade' | 'patologias' | 'vegetariano';
  gender: 'all' | 'M' | 'F';
}

export interface ClinicalOutcomeMetric {
  metric: string;
  value: string | number;
  unit?: string;
  benchmark: string;
  status: 'positive' | 'neutral' | 'attention';
  detail: string;
}

export interface PatientEvolutionReportItem {
  id: string;
  patientName: string;
  age: number;
  gender: 'M' | 'F';
  objective: string;
  consultationsCount: number;
  initialWeight: number;
  currentWeight: number;
  weightDeltaKg: number;
  initialFatPct: number;
  currentFatPct: number;
  fatDeltaPct: number;
  leanMassDeltaKg: number;
  adherenceScorePct: number; // 0-100%
  lastConsultationDate: string;
  status: 'Ativo em Meta' | 'Meta Superada' | 'Em Acompanhamento' | 'Risco de Evasão';
}

export interface FinancialPerformanceItem {
  category: string;
  revenue: number;
  consultationsCount: number;
  avgTicket: number;
  growthPct: number;
}

export interface ReportsMasterFeature {
  id: string;
  number: number;
  title: string;
  category: string;
  description: string;
  clinicalImpact: string;
  isActive: boolean;
}

export const REPORTS_MASTER_FEATURES: ReportsMasterFeature[] = [
  {
    id: 'rep-feat-1',
    number: 1,
    title: 'Relatório Executivo de Desfecho Clínico & Evolução Antropométrica',
    category: 'Eficácia Terapêutica',
    description: 'Consolidação de deltas de peso, percentual de gordura (Pollock/Petroski), ganho de massa magra e circunferências por corte temporal.',
    clinicalImpact: 'Comprovação científica da eficácia da conduta nutricional e comprovação de resultados aos pacientes.',
    isActive: true
  },
  {
    id: 'rep-feat-2',
    number: 2,
    title: 'Relatório de Adesão Dietética & Engajamento no App do Paciente',
    category: 'Aderência & Comportamento',
    description: 'Análise de cumprimento do plano alimentar, registros de fotos de refeições, consumo de água e diário de sintomas relatados.',
    clinicalImpact: 'Detecção precoce de não-conformidades antes da consulta de retorno para intervenção ativa.',
    isActive: true
  },
  {
    id: 'rep-feat-3',
    number: 3,
    title: 'Relatório de Bioquímica & Biomarcadores Evolutivos (HOMA, Lipídios, Vitaminas)',
    category: 'Medicina Preventiva',
    description: 'Comparativo histórico de exames laboratoriais com curvas de normalização funcional de HOMA-IR, Vitamina D, B12 e Ferritina.',
    clinicalImpact: 'Evidência objetiva da reversão de quadros de resistência insulínica e carências nutricionais.',
    isActive: true
  },
  {
    id: 'rep-feat-4',
    number: 4,
    title: 'Relatório de Eficiência da Agenda, Taxa de Comparecimento & No-Show',
    category: 'Operacional Clínico',
    description: 'Métricas de taxa de ocupação dos consultórios, faltas sem aviso prévio, remarcações e eficácia dos lembretes automáticos WhatsApp.',
    clinicalImpact: 'Redução de no-show para menos de 4.8% e maximização da produtividade por profissional.',
    isActive: true
  },
  {
    id: 'rep-feat-5',
    number: 5,
    title: 'Relatório Financeiro DRE, Ticket Médio, LTV & Repasse aos Nutricionistas',
    category: 'Gestão Financeira',
    description: 'Demonstrativo de receitas por planos/consultas avulsas, custo de aquisição (CAC), valor vitalício do paciente (LTV) e extrato de comissões.',
    clinicalImpact: 'Clareza contábil absoluta e previsibilidade orçamentária para clínicas e consultórios.',
    isActive: true
  },
  {
    id: 'rep-feat-6',
    number: 6,
    title: 'Relatório de Satisfação, NPS & Experiência do Paciente',
    category: 'Qualidade & Ouvidoria',
    description: 'Índice Net Promoter Score consolidado, comentários categorizados por atendimento, pontualidade, clareza do plano e estrutura física.',
    clinicalImpact: 'NPS acima de 90 pontos com ações corretivas automáticas para avaliações neutras/detratoras.',
    isActive: true
  },
  {
    id: 'rep-feat-7',
    number: 7,
    title: 'Relatório de Patologias, Alergias & Perfil Epidemiológico da Clínica',
    category: 'Inteligência Clínica',
    description: 'Mapeamento demográfico das principais queixas (SOP, Diabetes, Síndrome do Intestino Irritável, Hipertensão, Intolerâncias alimentares).',
    clinicalImpact: 'Direcionamento de campanhas educativas e criação de protocolos alimentares especializados.',
    isActive: true
  },
  {
    id: 'rep-feat-8',
    number: 8,
    title: 'Exportador Multiformato (PDF Executivo A4, Planilha Excel/CSV & JSON LGPD)',
    category: 'Interoperabilidade',
    description: 'Exportação com um clique em alta resolução para relatórios corporativos, auditoria contábil ou prontuário portável do paciente.',
    clinicalImpact: 'Agilidade documental e conformidade total com portabilidade de dados da LGPD (Art. 18).',
    isActive: true
  },
  {
    id: 'rep-feat-9',
    number: 9,
    title: 'Comparativo de Performance entre Unidades & Profissionais',
    category: 'Gestão Multi-Unidades',
    description: 'Benchmarking de retenção de pacientes, número de retornos agendados e faturamento médio entre diferentes filiais e profissionais.',
    clinicalImpact: 'Identificação das melhores práticas clínicas internas para padronização em rede.',
    isActive: true
  },
  {
    id: 'rep-feat-10',
    number: 10,
    title: 'Relatório de Conformidade LGPD & Trilha de Auditoria de Acessos',
    category: 'Compliance & Segurança',
    description: 'Registro imutável de quem acessou, editou ou exportou prontuários e exames de saúde com carimbo de tempo (timestamp) e IP.',
    clinicalImpact: 'Garantia de segurança jurídica e proteção contra vazamento de dados sensíveis de saúde.',
    isActive: true
  }
];

// Dados Clínicos Simulados de Alta Fidelidade (Respeitando LGPD com dados sintéticos realistas)
export const MOCK_PATIENT_EVOLUTIONS: PatientEvolutionReportItem[] = [
  {
    id: 'pat-1',
    patientName: 'Camila Mendonça Ferreira',
    age: 32,
    gender: 'F',
    objective: 'Emagrecimento & Reeducação',
    consultationsCount: 5,
    initialWeight: 78.4,
    currentWeight: 69.8,
    weightDeltaKg: -8.6,
    initialFatPct: 34.2,
    currentFatPct: 24.8,
    fatDeltaPct: -9.4,
    leanMassDeltaKg: +1.2,
    adherenceScorePct: 94,
    lastConsultationDate: '28/08/2026',
    status: 'Meta Superada'
  },
  {
    id: 'pat-2',
    patientName: 'Rodrigo Silveira da Rocha',
    age: 34,
    gender: 'M',
    objective: 'Hipertrofia & Redução de Gordura Visceral',
    consultationsCount: 4,
    initialWeight: 89.5,
    currentWeight: 86.2,
    weightDeltaKg: -3.3,
    initialFatPct: 22.8,
    currentFatPct: 15.4,
    fatDeltaPct: -7.4,
    leanMassDeltaKg: +3.1,
    adherenceScorePct: 91,
    lastConsultationDate: '02/09/2026',
    status: 'Ativo em Meta'
  },
  {
    id: 'pat-3',
    patientName: 'Juliana Paes Cavalcanti',
    age: 28,
    gender: 'F',
    objective: 'Saúde Intestinal & Tratamento de SOP',
    consultationsCount: 3,
    initialWeight: 66.0,
    currentWeight: 62.4,
    weightDeltaKg: -3.6,
    initialFatPct: 29.5,
    currentFatPct: 23.8,
    fatDeltaPct: -5.7,
    leanMassDeltaKg: +0.8,
    adherenceScorePct: 88,
    lastConsultationDate: '01/09/2026',
    status: 'Ativo em Meta'
  },
  {
    id: 'pat-4',
    patientName: 'Marcos Vinicius Prado',
    age: 45,
    gender: 'M',
    objective: 'Controle de Glicemia & Risco Cardiovascular',
    consultationsCount: 6,
    initialWeight: 104.2,
    currentWeight: 92.5,
    weightDeltaKg: -11.7,
    initialFatPct: 36.5,
    currentFatPct: 26.2,
    fatDeltaPct: -10.3,
    leanMassDeltaKg: +1.9,
    adherenceScorePct: 96,
    lastConsultationDate: '30/08/2026',
    status: 'Meta Superada'
  },
  {
    id: 'pat-5',
    patientName: 'Beatriz Vasconcelos',
    age: 24,
    gender: 'F',
    objective: 'Transição Vegetariana & Rendimento Esportivo',
    consultationsCount: 3,
    initialWeight: 58.0,
    currentWeight: 59.2,
    weightDeltaKg: +1.2,
    initialFatPct: 21.0,
    currentFatPct: 18.2,
    fatDeltaPct: -2.8,
    leanMassDeltaKg: +2.6,
    adherenceScorePct: 92,
    lastConsultationDate: '25/08/2026',
    status: 'Ativo em Meta'
  },
  {
    id: 'pat-6',
    patientName: 'Fernando Alencar Filho',
    age: 41,
    gender: 'M',
    objective: 'Emagrecimento & Gordura Hepática (Esteatose)',
    consultationsCount: 2,
    initialWeight: 98.6,
    currentWeight: 94.1,
    weightDeltaKg: -4.5,
    initialFatPct: 31.0,
    currentFatPct: 27.5,
    fatDeltaPct: -3.5,
    leanMassDeltaKg: +0.6,
    adherenceScorePct: 84,
    lastConsultationDate: '15/08/2026',
    status: 'Em Acompanhamento'
  },
  {
    id: 'pat-7',
    patientName: 'Larissa Albuquerque Santos',
    age: 38,
    gender: 'F',
    objective: 'Pós-Bariátrica & Adequação de Micronutrientes',
    consultationsCount: 7,
    initialWeight: 118.0,
    currentWeight: 76.5,
    weightDeltaKg: -41.5,
    initialFatPct: 44.0,
    currentFatPct: 25.0,
    fatDeltaPct: -19.0,
    leanMassDeltaKg: +2.1,
    adherenceScorePct: 95,
    lastConsultationDate: '03/09/2026',
    status: 'Meta Superada'
  },
  {
    id: 'pat-8',
    patientName: 'Gabriel Nogueira Lima',
    age: 29,
    gender: 'M',
    objective: 'Preparação para Maratona & Crononutrição',
    consultationsCount: 4,
    initialWeight: 72.0,
    currentWeight: 70.8,
    weightDeltaKg: -1.2,
    initialFatPct: 14.5,
    currentFatPct: 9.8,
    fatDeltaPct: -4.7,
    leanMassDeltaKg: +1.8,
    adherenceScorePct: 97,
    lastConsultationDate: '04/09/2026',
    status: 'Meta Superada'
  }
];

export const MOCK_CLINICAL_OUTCOME_METRICS: ClinicalOutcomeMetric[] = [
  {
    metric: 'Taxa Global de Sucesso Terapêutico',
    value: '91.8%',
    benchmark: 'Média Brasil: 64%',
    status: 'positive',
    detail: 'Pacientes que atingiram a meta proposta de composição corporal no período estipulado.'
  },
  {
    metric: 'Redução Média de Gordura Corporal',
    value: '-6.4',
    unit: '%',
    benchmark: 'Meta clínica: -4.0%',
    status: 'positive',
    detail: 'Queda percentual aferida por protocolo de 7 dobras cutâneas de Pollock.'
  },
  {
    metric: 'Ganho Médio de Massa Muscular',
    value: '+1.75',
    unit: 'kg',
    benchmark: 'Preservação com superávit',
    status: 'positive',
    detail: 'Preservação e hipertrofia com balanço nitrogenado positivo calculado via TACO.'
  },
  {
    metric: 'Índice de Adesão ao App do Paciente',
    value: '89.4%',
    benchmark: 'Meta: > 80%',
    status: 'positive',
    detail: 'Engajamento diário no checklist de hidratação, fotos de refeições e visualização do plano.'
  },
  {
    metric: 'Taxa de Retenção & Reconsultas (60d)',
    value: '84.2%',
    benchmark: 'Média nacional: 52%',
    status: 'positive',
    detail: 'Pacientes que deram continuidade ao acompanhamento clínico em 60 dias.'
  },
  {
    metric: 'Taxa de Não-Comparecimento (No-Show)',
    value: '3.6%',
    benchmark: 'Tolerância máx: 8.0%',
    status: 'positive',
    detail: 'Impacto direto da automação de lembretes e confirmações via WhatsApp com IA.'
  }
];

export const MOCK_FINANCIAL_PERFORMANCE: FinancialPerformanceItem[] = [
  {
    category: 'Planos de Acompanhamento Trimestrais',
    revenue: 48600,
    consultationsCount: 54,
    avgTicket: 900,
    growthPct: 18.4
  },
  {
    category: 'Consultas Avulsas com Bioimpedância/Dobras',
    revenue: 28350,
    consultationsCount: 81,
    avgTicket: 350,
    growthPct: 12.1
  },
  {
    category: 'Programas Semestrais de Alta Performance',
    revenue: 33600,
    consultationsCount: 21,
    avgTicket: 1600,
    growthPct: 24.5
  },
  {
    category: 'Consultorias de Rotulagem ANVISA',
    revenue: 14400,
    consultationsCount: 12,
    avgTicket: 1200,
    growthPct: 35.0
  }
];

export const MOCK_EPIDEMIOLOGY_PATOLOGIES = [
  { condition: 'Resistência à Insulina / Pré-Diabetes', percentage: 38, count: 142, trend: 'up' },
  { condition: 'Dislipidemias (Triglicerídeos / LDL alto)', percentage: 31, count: 116, trend: 'stable' },
  { condition: 'Disbiose & Síndrome do Intestino Irritável', percentage: 27, count: 101, trend: 'up' },
  { condition: 'Deficiência Crônica de Vitamina D3 (<30 ng/mL)', percentage: 46, count: 172, trend: 'down' },
  { condition: 'Síndrome dos Ovários Policísticos (SOP)', percentage: 19, count: 71, trend: 'stable' },
  { condition: 'Hipertensão Arterial Sistêmica', percentage: 14, count: 52, trend: 'down' }
];

// Funções de Gestão e Persistência de Recursos dos Relatórios
export const getReportsFeatureStatus = (featureId: string): boolean => {
  const stored = localStorage.getItem(`nutri_saas_reports_feat_${featureId}`);
  if (stored !== null) return stored === 'true';
  const allMaster = localStorage.getItem('nutri_saas_all_master_features_unlocked');
  if (allMaster === 'true') return true;
  return true; // Padrão: todas ativas
};

export const setReportsFeatureStatus = (featureId: string, active: boolean) => {
  localStorage.setItem(`nutri_saas_reports_feat_${featureId}`, String(active));
};

export const activateAllReportsFeatures = () => {
  REPORTS_MASTER_FEATURES.forEach(f => {
    localStorage.setItem(`nutri_saas_reports_feat_${f.id}`, 'true');
  });
};
