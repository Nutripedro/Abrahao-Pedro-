// ============================================================================
// FINANCIAL DATA & MASTER DOMAIN RULES — NUTRIÇÃO SAAS (10/10 ATIVO)
// ============================================================================

export interface FinancialMasterFeature {
  id: string;
  name: string;
  category: 'Fluxo & DRE' | 'Faturamento' | 'Custos & Despesas' | 'Bancário & Pix' | 'Fiscal & Compliance';
  description: string;
  impactLevel: 'Crítico' | 'Alto' | 'Estratégico';
  clinicalRule: string;
  isActive: boolean;
}

export const FINANCIAL_MASTER_FEATURES: FinancialMasterFeature[] = [
  {
    id: 'feat_cashflow_realtime',
    name: 'Fluxo de Caixa em Tempo Real & Projeção 90d',
    category: 'Fluxo & DRE',
    description: 'Acompanhamento instantâneo de entradas, saídas, saldo operacional consolidado e projeção preditiva para os próximos 90 dias.',
    impactLevel: 'Crítico',
    clinicalRule: 'Regra de competência e caixa isoladas; cálculo diário de saldo com conciliação automática.',
    isActive: true
  },
  {
    id: 'feat_dre_gerencial',
    name: 'DRE Gerencial Clínico Estruturado (EBITDA & Margem)',
    category: 'Fluxo & DRE',
    description: 'Demonstrativo do Resultado do Exercício com segregação de Receita Bruta (Consultas, Planos, Suplementos), Deduções, Custos Variáveis e Despesas Fixas.',
    impactLevel: 'Crítico',
    clinicalRule: 'Conformidade com padrões contábeis para clínicas de saúde; apuração de margem de contribuição real por atendimento.',
    isActive: true
  },
  {
    id: 'feat_revenue_management',
    name: 'Gestão Inteligente de Receitas & Planos Recorrentes',
    category: 'Faturamento',
    description: 'Faturamento unificado de consultas avulsas, pacotes trimestrais/semestrais, programas de acompanhamento e produtos/suplementos clínicos.',
    impactLevel: 'Alto',
    clinicalRule: 'Emissão de faturas vinculadas diretamente ao prontuário do paciente com rastreio de pagamento.',
    isActive: true
  },
  {
    id: 'feat_expense_categorization',
    name: 'Controle de Despesas, Custos Fixos & Fornecedores',
    category: 'Custos & Despesas',
    description: 'Classificação por centros de custo (Aluguel, Software, Laboratório, Estoque, Marketing, Impostos) com alertas de vencimento de boletos.',
    impactLevel: 'Alto',
    clinicalRule: 'Gestão de contas a pagar com histórico de comprovantes e prevenção de juros e multas.',
    isActive: true
  },
  {
    id: 'feat_bank_reconciliation',
    name: 'Multi-Contas Bancárias & Conciliação OFX/Pix',
    category: 'Bancário & Pix',
    description: 'Gestão integrada de contas correntes PJ (Itaú, Nubank, Cora, Asaas) e caixa físico com conciliação bancária assistida.',
    impactLevel: 'Crítico',
    clinicalRule: 'Validação de extratos bancários contra lançamentos internos para garantia de integridade fiscal.',
    isActive: true
  },
  {
    id: 'feat_commissions_splits',
    name: 'Repasses & Comissões de Nutricionistas Parceiros',
    category: 'Faturamento',
    description: 'Cálculo automático de honorários e splits de pagamento por profissional (% sobre consulta ou taxa fixa) com geração de extrato de repasse.',
    impactLevel: 'Estratégico',
    clinicalRule: 'Segregação de faturamento da clínica vs honorários médicos/nutricionais conforme contratos de parceria.',
    isActive: true
  },
  {
    id: 'feat_pix_smart_billing',
    name: 'Cobrança Pix Dinâmico & Régua de Notificações WhatsApp',
    category: 'Bancário & Pix',
    description: 'Geração de QR Code Pix dinâmico com chave copia-e-cola e lembretes amigáveis automatizados de faturas abertas para redução de inadimplência.',
    impactLevel: 'Alto',
    clinicalRule: 'Integração de pagamento instantâneo com baixa automática de status para "Pago" no momento da compensação.',
    isActive: true
  },
  {
    id: 'feat_subscriptions_mrr',
    name: 'Assinaturas do Clube de Nutrição & Gestão de MRR',
    category: 'Faturamento',
    description: 'Controle de planos de acompanhamento contínuo com métricas de MRR (Receita Recorrente Mensal), Churn e LTV do paciente.',
    impactLevel: 'Estratégico',
    clinicalRule: 'Monitoramento do ciclo de vida financeiro e fidelização de pacientes em programas de longo prazo.',
    isActive: true
  },
  {
    id: 'feat_cost_centers_units',
    name: 'Centros de Custo por Unidade / Consultório',
    category: 'Custos & Despesas',
    description: 'Acompanhamento comparativo de rentabilidade entre Unidade Jardins, Moema, Copacabana e Atendimentos Online.',
    impactLevel: 'Alto',
    clinicalRule: 'Rateio proporcional de custos fixos corporativos e análise de ponto de equilíbrio por sala/unidade.',
    isActive: true
  },
  {
    id: 'feat_receipts_dmed_export',
    name: 'Emissor de Recibos para IRPF (DMED / CFN) & Exportação Fiscal',
    category: 'Fiscal & Compliance',
    description: 'Geração com 1 clique de Recibo de Prestação de Serviços de Nutrição (com CRN, CPF, data, valor e código DMED) e exportação em Excel/PDF/CSV.',
    impactLevel: 'Crítico',
    clinicalRule: 'Conformidade estrita com normas da Receita Federal do Brasil (DMED / Carnê-Leão) e Código de Ética do Nutricionista (CFN).',
    isActive: true
  }
];

// Helper de armazenamento local para persistência de status das 10 funções
const STORAGE_KEY_PREFIX = 'nutricao_saas_financial_feature_';

export function getFinancialFeatureStatus(featureId: string): boolean {
  const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}${featureId}`);
  if (saved !== null) {
    return saved === 'true';
  }
  const feat = FINANCIAL_MASTER_FEATURES.find(f => f.id === featureId);
  return feat ? feat.isActive : true;
}

export function setFinancialFeatureStatus(featureId: string, isActive: boolean): void {
  localStorage.setItem(`${STORAGE_KEY_PREFIX}${featureId}`, String(isActive));
}

export function activateAllFinancialFeatures(): void {
  FINANCIAL_MASTER_FEATURES.forEach(f => {
    setFinancialFeatureStatus(f.id, true);
  });
}

// ============================================================================
// ESTRUTURAS DE DADOS DE TRANSAÇÕES E CONCILIAÇÃO
// ============================================================================

export type TransactionType = 'income' | 'expense';
export type TransactionStatus = 'paid' | 'pending' | 'overdue' | 'cancelled';
export type PaymentMethod = 'pix' | 'credit_card' | 'debit_card' | 'bank_transfer' | 'cash' | 'boleto';

export interface FinancialTransaction {
  id: string;
  date: string;
  dueDate: string;
  description: string;
  type: TransactionType;
  category: string;
  amount: number;
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
  patientName?: string;
  patientId?: string;
  professionalName: string;
  professionalId: string;
  unitId: string;
  unitName: string;
  bankAccountId: string;
  bankAccountName: string;
  receiptIssued: boolean;
  receiptNumber?: string;
  invoiceNumber?: string;
  pixQrCodePayload?: string;
  notes?: string;
}

export interface BankAccount {
  id: string;
  bankName: string;
  bankCode: string;
  accountType: 'Conta Corrente PJ' | 'Conta Corrente PF' | 'Carteira Pix' | 'Caixa Físico';
  accountNumber: string;
  agency: string;
  balance: number;
  pixKey: string;
  color: string;
  lastReconciliation: string;
  isDefault: boolean;
}

export interface ProfessionalCommission {
  id: string;
  professionalId: string;
  professionalName: string;
  crn: string;
  role: string;
  avatar: string;
  totalConsultations: number;
  grossRevenue: number;
  commissionRate: number; // e.g. 0.70 (70%)
  commissionAmount: number;
  clinicRetention: number;
  status: 'paid' | 'pending' | 'calculated';
  period: string;
  paymentDate?: string;
}

export interface RecurringSubscription {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  planName: string;
  frequency: 'Mensal' | 'Trimestral' | 'Semestral' | 'Anual';
  amount: number;
  status: 'active' | 'pending_payment' | 'suspended' | 'cancelled';
  startDate: string;
  nextBillingDate: string;
  paymentMethod: PaymentMethod;
  autoRenew: boolean;
  totalPaidMonths: number;
}

export interface DreItem {
  id: string;
  code: string;
  name: string;
  value: number;
  percentage: number; // % sobre a receita bruta
  type: 'header' | 'income' | 'deduction' | 'cost' | 'expense' | 'result';
  indent: number;
  children?: DreItem[];
}

// ============================================================================
// DADOS MOCKADOS ESTRUTURADOS PARA NUTRIÇÃO CLÍNICA
// ============================================================================

export const MOCK_BANK_ACCOUNTS: BankAccount[] = [
  {
    id: 'bank-itau-pj',
    bankName: 'Itaú Unibanco PJ',
    bankCode: '341',
    accountType: 'Conta Corrente PJ',
    accountNumber: '48920-4',
    agency: '0855',
    balance: 42850.00,
    pixKey: 'financeiro@clinicavitall.com.br',
    color: 'emerald',
    lastReconciliation: '2026-09-04',
    isDefault: true
  },
  {
    id: 'bank-nubank-pj',
    bankName: 'Nubank PJ / NuPay',
    bankCode: '260',
    accountType: 'Conta Corrente PJ',
    accountNumber: '190432-8',
    agency: '0001',
    balance: 18420.50,
    pixKey: '12.345.678/0001-90',
    color: 'purple',
    lastReconciliation: '2026-09-04',
    isDefault: false
  },
  {
    id: 'bank-asaas-pix',
    bankName: 'Asaas Gateway & Pix',
    bankCode: '197',
    accountType: 'Carteira Pix',
    accountNumber: '883912-0',
    agency: '0001',
    balance: 8750.00,
    pixKey: 'pix-gateway@clinicavitall.com.br',
    color: 'teal',
    lastReconciliation: '2026-09-05',
    isDefault: false
  },
  {
    id: 'bank-caixa-clinica',
    bankName: 'Caixa Físico / Espécie',
    bankCode: '000',
    accountType: 'Caixa Físico',
    accountNumber: 'CAIXA-01',
    agency: 'Jardins',
    balance: 1450.00,
    pixKey: 'Balcão Recepção',
    color: 'amber',
    lastReconciliation: '2026-09-04',
    isDefault: false
  }
];

export const MOCK_FINANCIAL_TRANSACTIONS: FinancialTransaction[] = [
  {
    id: 'tr-001',
    date: '2026-09-05',
    dueDate: '2026-09-05',
    description: 'Consulta de Avaliação Completa & Antropometria (SOAP)',
    type: 'income',
    category: 'Consultas Avulsas',
    amount: 380.00,
    paymentMethod: 'pix',
    status: 'paid',
    patientName: 'Camila Mendonça',
    patientId: 'pat-101',
    professionalName: 'Dra. Luiza Valente',
    professionalId: 'prof-01',
    unitId: 'unit-jardins',
    unitName: 'Matriz Jardins',
    bankAccountId: 'bank-asaas-pix',
    bankAccountName: 'Asaas Gateway & Pix',
    receiptIssued: true,
    receiptNumber: 'REC-2026-0891',
    notes: 'Pago via Pix instantâneo na recepção com emissão automática de recibo para IRPF.'
  },
  {
    id: 'tr-002',
    date: '2026-09-05',
    dueDate: '2026-09-05',
    description: 'Plano Acompanhamento Trimestral Performance (3 Consultas + App VIP)',
    type: 'income',
    category: 'Planos & Pacotes',
    amount: 1050.00,
    paymentMethod: 'credit_card',
    status: 'paid',
    patientName: 'Carlos Eduardo Mendes',
    patientId: 'pat-102',
    professionalName: 'Dr. Thiago Siqueira',
    professionalId: 'prof-02',
    unitId: 'unit-jardins',
    unitName: 'Matriz Jardins',
    bankAccountId: 'bank-itau-pj',
    bankAccountName: 'Itaú Unibanco PJ',
    receiptIssued: true,
    receiptNumber: 'REC-2026-0892',
    notes: 'Parcelado em 3x no cartão de crédito via maquininha sem juros.'
  },
  {
    id: 'tr-003',
    date: '2026-09-04',
    dueDate: '2026-09-04',
    description: 'Clube de Nutrição Mensalidade Recorrente - Setembro/2026',
    type: 'income',
    category: 'Assinaturas Recorrentes',
    amount: 199.90,
    paymentMethod: 'credit_card',
    status: 'paid',
    patientName: 'Mariana Lima Santos',
    patientId: 'pat-103',
    professionalName: 'Dra. Luiza Valente',
    professionalId: 'prof-01',
    unitId: 'unit-moema',
    unitName: 'Unidade Moema',
    bankAccountId: 'bank-nubank-pj',
    bankAccountName: 'Nubank PJ / NuPay',
    receiptIssued: true,
    receiptNumber: 'REC-2026-0885',
    notes: 'Débito automático recorrente mensal.'
  },
  {
    id: 'tr-004',
    date: '2026-09-04',
    dueDate: '2026-09-04',
    description: 'Venda de Suplemento Clínico: Creatina Creapure 300g (2 unid.)',
    type: 'income',
    category: 'Venda de Suplementos / Estoque',
    amount: 258.00,
    paymentMethod: 'pix',
    status: 'paid',
    patientName: 'Lucas Ferreira Guimarães',
    patientId: 'pat-104',
    professionalName: 'Dr. Thiago Siqueira',
    professionalId: 'prof-02',
    unitId: 'unit-jardins',
    unitName: 'Matriz Jardins',
    bankAccountId: 'bank-asaas-pix',
    bankAccountName: 'Asaas Gateway & Pix',
    receiptIssued: true,
    receiptNumber: 'REC-2026-0886',
    notes: 'Retirada de produto no balcão da clínica.'
  },
  {
    id: 'tr-005',
    date: '2026-09-03',
    dueDate: '2026-09-08',
    description: 'Consulta Retorno 30 Dias & Reavaliação Antropométrica',
    type: 'income',
    category: 'Consultas Avulsas',
    amount: 280.00,
    paymentMethod: 'boleto',
    status: 'pending',
    patientName: 'Beatriz Vasconcelos',
    patientId: 'pat-105',
    professionalName: 'Dra. Luiza Valente',
    professionalId: 'prof-01',
    unitId: 'unit-moema',
    unitName: 'Unidade Moema',
    bankAccountId: 'bank-itau-pj',
    bankAccountName: 'Itaú Unibanco PJ',
    receiptIssued: false,
    pixQrCodePayload: '00020126580014br.gov.bcb.pix0136pix-cobranca-recibos-vitall-0015204000053039865406280.005802BR5920Clinica Vitall Nutri6009Sao Paulo62070503***6304A1B2',
    notes: 'Boleto/Pix emitido com vencimento em 08/09. Lembrete WhatsApp agendado.'
  },
  {
    id: 'tr-006',
    date: '2026-09-02',
    dueDate: '2026-09-02',
    description: 'Aluguel & Condomínio Consultório Jardins - Competência 08/2026',
    type: 'expense',
    category: 'Infraestrutura & Aluguel',
    amount: 4500.00,
    paymentMethod: 'bank_transfer',
    status: 'paid',
    professionalName: 'Administração Geral',
    professionalId: 'adm-01',
    unitId: 'unit-jardins',
    unitName: 'Matriz Jardins',
    bankAccountId: 'bank-itau-pj',
    bankAccountName: 'Itaú Unibanco PJ',
    receiptIssued: false,
    invoiceNumber: 'NF-LOC-88210',
    notes: 'Transferência bancária TED quitada em dia.'
  },
  {
    id: 'tr-007',
    date: '2026-09-01',
    dueDate: '2026-09-01',
    description: 'Software de Nutrição SaaS & Licenças de Prontuário Eletrônico',
    type: 'expense',
    category: 'Softwares & Tecnologia',
    amount: 490.00,
    paymentMethod: 'credit_card',
    status: 'paid',
    professionalName: 'Administração Geral',
    professionalId: 'adm-01',
    unitId: 'unit-jardins',
    unitName: 'Matriz Jardins',
    bankAccountId: 'bank-nubank-pj',
    bankAccountName: 'Nubank PJ / NuPay',
    receiptIssued: false,
    invoiceNumber: 'NFS-99120',
    notes: 'Assinatura mensal de sistema com IA e simulador de paciente.'
  },
  {
    id: 'tr-008',
    date: '2026-09-01',
    dueDate: '2026-09-10',
    description: 'Simples Nacional (DAS) - Competência 08/2026',
    type: 'expense',
    category: 'Impostos & Tributos',
    amount: 2840.50,
    paymentMethod: 'bank_transfer',
    status: 'pending',
    professionalName: 'Contabilidade Externa',
    professionalId: 'cont-01',
    unitId: 'unit-jardins',
    unitName: 'Matriz Jardins',
    bankAccountId: 'bank-itau-pj',
    bankAccountName: 'Itaú Unibanco PJ',
    receiptIssued: false,
    invoiceNumber: 'DAS-2026-08',
    notes: 'Guia tributária Simples Nacional anexo III.'
  },
  {
    id: 'tr-009',
    date: '2026-08-31',
    dueDate: '2026-08-31',
    description: 'Repasse de Honorários Nutricionista - Dra. Luiza Valente (Agosto)',
    type: 'expense',
    category: 'Repasse de Comissões',
    amount: 8750.00,
    paymentMethod: 'pix',
    status: 'paid',
    professionalName: 'Dra. Luiza Valente',
    professionalId: 'prof-01',
    unitId: 'unit-jardins',
    unitName: 'Matriz Jardins',
    bankAccountId: 'bank-itau-pj',
    bankAccountName: 'Itaú Unibanco PJ',
    receiptIssued: true,
    receiptNumber: 'REP-2026-08-01',
    notes: 'Split de 70% sobre consultas e planos realizados no mês de Agosto.'
  },
  {
    id: 'tr-010',
    date: '2026-08-31',
    dueDate: '2026-08-31',
    description: 'Repasse de Honorários Nutricionista - Dr. Thiago Siqueira (Agosto)',
    type: 'expense',
    category: 'Repasse de Comissões',
    amount: 6860.00,
    paymentMethod: 'pix',
    status: 'paid',
    professionalName: 'Dr. Thiago Siqueira',
    professionalId: 'prof-02',
    unitId: 'unit-jardins',
    unitName: 'Matriz Jardins',
    bankAccountId: 'bank-itau-pj',
    bankAccountName: 'Itaú Unibanco PJ',
    receiptIssued: true,
    receiptNumber: 'REP-2026-08-02',
    notes: 'Split de 70% sobre atendimentos esportivos e bioimpedâncias.'
  },
  {
    id: 'tr-011',
    date: '2026-08-28',
    dueDate: '2026-08-28',
    description: 'Reposição de Estoque: Suplementos Essenciais (Whey & Creatina)',
    type: 'expense',
    category: 'Compra de Estoque & Insumos',
    amount: 2150.00,
    paymentMethod: 'boleto',
    status: 'paid',
    professionalName: 'Administração Geral',
    professionalId: 'adm-01',
    unitId: 'unit-jardins',
    unitName: 'Matriz Jardins',
    bankAccountId: 'bank-itau-pj',
    bankAccountName: 'Itaú Unibanco PJ',
    receiptIssued: false,
    invoiceNumber: 'NFE-39201',
    notes: 'Fornecedor NutriSupply Distribuidora Ltda.'
  },
  {
    id: 'tr-012',
    date: '2026-08-25',
    dueDate: '2026-08-25',
    description: 'Campanha de Tráfego Pago & Captação Instagram/Google Ads',
    type: 'expense',
    category: 'Marketing & Captação',
    amount: 1200.00,
    paymentMethod: 'credit_card',
    status: 'paid',
    professionalName: 'Equipe Marketing',
    professionalId: 'mkt-01',
    unitId: 'unit-jardins',
    unitName: 'Matriz Jardins',
    bankAccountId: 'bank-nubank-pj',
    bankAccountName: 'Nubank PJ / NuPay',
    receiptIssued: false,
    invoiceNumber: 'META-9942',
    notes: 'ROI de marketing calculado em 6.4x de retorno em novos pacientes.'
  }
];

export const MOCK_COMMISSIONS: ProfessionalCommission[] = [
  {
    id: 'com-01',
    professionalId: 'prof-01',
    professionalName: 'Dra. Luiza Valente',
    crn: 'CRN-3 48.912/SP',
    role: 'Nutricionista Clínica & Funcional',
    avatar: 'https://images.unsplash.com/photo-1594824813682-146b28515c0a?w=150&auto=format&fit=crop&q=80',
    totalConsultations: 38,
    grossRevenue: 13450.00,
    commissionRate: 0.70,
    commissionAmount: 9415.00,
    clinicRetention: 4035.00,
    status: 'calculated',
    period: 'Setembro / 2026'
  },
  {
    id: 'com-02',
    professionalId: 'prof-02',
    professionalName: 'Dr. Thiago Siqueira',
    crn: 'CRN-3 52.441/SP',
    role: 'Nutricionista Esportivo & Hipertrofia',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    totalConsultations: 29,
    grossRevenue: 10800.00,
    commissionRate: 0.70,
    commissionAmount: 7560.00,
    clinicRetention: 3240.00,
    status: 'calculated',
    period: 'Setembro / 2026'
  },
  {
    id: 'com-03',
    professionalId: 'prof-03',
    professionalName: 'Dra. Fernanda Albuquerque',
    crn: 'CRN-3 61.220/SP',
    role: 'Nutricionista Materno-Infantil',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
    totalConsultations: 18,
    grossRevenue: 6480.00,
    commissionRate: 0.65,
    commissionAmount: 4212.00,
    clinicRetention: 2268.00,
    status: 'calculated',
    period: 'Setembro / 2026'
  }
];

export const MOCK_RECURRING_SUBSCRIPTIONS: RecurringSubscription[] = [
  {
    id: 'sub-01',
    patientId: 'pat-103',
    patientName: 'Mariana Lima Santos',
    patientPhone: '(11) 98452-1109',
    planName: 'Clube de Nutrição Mensal VIP',
    frequency: 'Mensal',
    amount: 199.90,
    status: 'active',
    startDate: '2026-03-01',
    nextBillingDate: '2026-10-01',
    paymentMethod: 'credit_card',
    autoRenew: true,
    totalPaidMonths: 6
  },
  {
    id: 'sub-02',
    patientId: 'pat-102',
    patientName: 'Carlos Eduardo Mendes',
    patientPhone: '(11) 97312-9901',
    planName: 'Programa Performance Esportiva Trimestral',
    frequency: 'Trimestral',
    amount: 1050.00,
    status: 'active',
    startDate: '2026-06-15',
    nextBillingDate: '2026-09-15',
    paymentMethod: 'credit_card',
    autoRenew: true,
    totalPaidMonths: 3
  },
  {
    id: 'sub-03',
    patientId: 'pat-106',
    patientName: 'Juliana Paes Cavalcanti',
    patientPhone: '(11) 99182-4455',
    planName: 'Acompanhamento Gestacional & Pós-Parto',
    frequency: 'Mensal',
    amount: 249.00,
    status: 'active',
    startDate: '2026-05-10',
    nextBillingDate: '2026-09-10',
    paymentMethod: 'pix',
    autoRenew: true,
    totalPaidMonths: 4
  },
  {
    id: 'sub-04',
    patientId: 'pat-107',
    patientName: 'Rodrigo Brandão',
    patientPhone: '(11) 98231-7788',
    planName: 'Clube Nutrição Essencial',
    frequency: 'Mensal',
    amount: 149.00,
    status: 'pending_payment',
    startDate: '2026-07-01',
    nextBillingDate: '2026-09-02',
    paymentMethod: 'boleto',
    autoRenew: false,
    totalPaidMonths: 2
  }
];

export const MONTHLY_FINANCIAL_HISTORY = [
  { mes: 'Mar/26', receitas: 24800, despesas: 15400, lucro: 9400, margem: 37.9, consultas: 68 },
  { mes: 'Abr/26', receitas: 28400, despesas: 16800, lucro: 11600, margem: 40.8, consultas: 76 },
  { mes: 'Mai/26', receitas: 32900, despesas: 18200, lucro: 14700, margem: 44.6, consultas: 85 },
  { mes: 'Jun/26', receitas: 35600, despesas: 19100, lucro: 16500, margem: 46.3, consultas: 92 },
  { mes: 'Jul/26', receitas: 39800, despesas: 21400, lucro: 18400, margem: 46.2, consultas: 104 },
  { mes: 'Ago/26', receitas: 44250, despesas: 22800, lucro: 21450, margem: 48.4, consultas: 118 },
  { mes: 'Set/26 (Proj)', receitas: 48900, despesas: 23500, lucro: 25400, margem: 51.9, consultas: 128 }
];

// ============================================================================
// FUNÇÕES PURAS DE CÁLCULO E ANÁLISE FINANCEIRA
// ============================================================================

export interface FinancialSummaryMetrics {
  totalGrossIncome: number;
  totalPaidIncome: number;
  totalPendingIncome: number;
  totalExpenses: number;
  netProfit: number;
  netMarginPercentage: number;
  averageTicket: number;
  mrr: number;
  defaultRatePercentage: number; // Inadimplência
  totalConsolidatedBalance: number;
}

export function calculateFinancialSummary(
  transactions: FinancialTransaction[],
  bankAccounts: BankAccount[],
  subscriptions: RecurringSubscription[]
): FinancialSummaryMetrics {
  const incomes = transactions.filter(t => t.type === 'income');
  const paidIncomes = incomes.filter(t => t.status === 'paid');
  const pendingIncomes = incomes.filter(t => t.status === 'pending' || t.status === 'overdue');
  const expenses = transactions.filter(t => t.type === 'expense' && t.status === 'paid');

  const totalGrossIncome = incomes.reduce((sum, t) => sum + t.amount, 0);
  const totalPaidIncome = paidIncomes.reduce((sum, t) => sum + t.amount, 0);
  const totalPendingIncome = pendingIncomes.reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
  const netProfit = totalPaidIncome - totalExpenses;
  const netMarginPercentage = totalPaidIncome > 0 ? (netProfit / totalPaidIncome) * 100 : 0;

  const totalConsultations = paidIncomes.filter(t => t.category.includes('Consultas') || t.category.includes('Planos')).length;
  const averageTicket = totalConsultations > 0 ? totalPaidIncome / totalConsultations : 0;

  const mrr = subscriptions
    .filter(s => s.status === 'active')
    .reduce((sum, s) => {
      if (s.frequency === 'Mensal') return sum + s.amount;
      if (s.frequency === 'Trimestral') return sum + (s.amount / 3);
      if (s.frequency === 'Semestral') return sum + (s.amount / 6);
      if (s.frequency === 'Anual') return sum + (s.amount / 12);
      return sum + s.amount;
    }, 0);

  const defaultRatePercentage = totalGrossIncome > 0 ? (totalPendingIncome / totalGrossIncome) * 100 : 0;
  const totalConsolidatedBalance = bankAccounts.reduce((sum, b) => sum + b.balance, 0);

  return {
    totalGrossIncome,
    totalPaidIncome,
    totalPendingIncome,
    totalExpenses,
    netProfit,
    netMarginPercentage,
    averageTicket,
    mrr,
    defaultRatePercentage,
    totalConsolidatedBalance
  };
}

export function generateDreStructure(
  transactions: FinancialTransaction[]
): DreItem[] {
  const paidIncomes = transactions.filter(t => t.type === 'income' && t.status === 'paid');
  const paidExpenses = transactions.filter(t => t.type === 'expense' && t.status === 'paid');

  // Receitas por linha
  const consultIncome = paidIncomes.filter(t => t.category.includes('Consultas')).reduce((acc, t) => acc + t.amount, 0);
  const packagesIncome = paidIncomes.filter(t => t.category.includes('Planos')).reduce((acc, t) => acc + t.amount, 0);
  const subscriptionsIncome = paidIncomes.filter(t => t.category.includes('Assinaturas')).reduce((acc, t) => acc + t.amount, 0);
  const supplementsIncome = paidIncomes.filter(t => t.category.includes('Suplementos')).reduce((acc, t) => acc + t.amount, 0);
  
  const grossRevenue = consultIncome + packagesIncome + subscriptionsIncome + supplementsIncome;

  // Deduções e impostos (ex: taxas de cartão ~3.5% + Simples Nacional ~6.0%)
  const cardFees = grossRevenue * 0.032;
  const taxesSimples = grossRevenue * 0.060;
  const totalDeductions = cardFees + taxesSimples;
  const netRevenue = grossRevenue - totalDeductions;

  // Custos variáveis (repasses a profissionais ~50% das consultas/planos + custo do produto vendido)
  const commissions = paidExpenses.filter(t => t.category.includes('Repasse')).reduce((acc, t) => acc + t.amount, 0);
  const costOfGoods = paidExpenses.filter(t => t.category.includes('Estoque')).reduce((acc, t) => acc + t.amount, 0);
  const totalVariableCosts = commissions + costOfGoods;
  const contributionMargin = netRevenue - totalVariableCosts;

  // Despesas Operacionais Fixas
  const rentAndCondo = paidExpenses.filter(t => t.category.includes('Infraestrutura')).reduce((acc, t) => acc + t.amount, 0);
  const softwareAndTech = paidExpenses.filter(t => t.category.includes('Software')).reduce((acc, t) => acc + t.amount, 0);
  const marketingExpenses = paidExpenses.filter(t => t.category.includes('Marketing')).reduce((acc, t) => acc + t.amount, 0);
  const adminOther = 1200.00; // Outras despesas administrativas
  const totalFixedExpenses = rentAndCondo + softwareAndTech + marketingExpenses + adminOther;

  // Resultados
  const ebitda = contributionMargin - totalFixedExpenses;
  const netFinancialResult = ebitda;

  const pct = (val: number) => grossRevenue > 0 ? (val / grossRevenue) * 100 : 0;

  return [
    {
      id: 'dre-1',
      code: '1.0',
      name: '(=) RECEITA BRUTA OPERACIONAL',
      value: grossRevenue,
      percentage: 100,
      type: 'header',
      indent: 0,
      children: [
        { id: 'dre-1.1', code: '1.1', name: 'Consultas Avulsas & Avaliações', value: consultIncome, percentage: pct(consultIncome), type: 'income', indent: 1 },
        { id: 'dre-1.2', code: '1.2', name: 'Planos & Pacotes Trimestrais/Semestrais', value: packagesIncome, percentage: pct(packagesIncome), type: 'income', indent: 1 },
        { id: 'dre-1.3', code: '1.3', name: 'Assinaturas Recorrentes (Clube de Nutrição)', value: subscriptionsIncome, percentage: pct(subscriptionsIncome), type: 'income', indent: 1 },
        { id: 'dre-1.4', code: '1.4', name: 'Venda de Suplementos & Produtos Clínicos', value: supplementsIncome, percentage: pct(supplementsIncome), type: 'income', indent: 1 }
      ]
    },
    {
      id: 'dre-2',
      code: '2.0',
      name: '(-) DEDUÇÕES DA RECEITA & TRIBUTOS',
      value: totalDeductions,
      percentage: pct(totalDeductions),
      type: 'deduction',
      indent: 0,
      children: [
        { id: 'dre-2.1', code: '2.1', name: 'Impostos Diretos (Simples Nacional - Anexo III ~6%)', value: taxesSimples, percentage: pct(taxesSimples), type: 'deduction', indent: 1 },
        { id: 'dre-2.2', code: '2.2', name: 'Taxas de Meios de Pagamento & Gateway (Pix/Cartão)', value: cardFees, percentage: pct(cardFees), type: 'deduction', indent: 1 }
      ]
    },
    {
      id: 'dre-3',
      code: '3.0',
      name: '(=) RECEITA LÍQUIDA OPERACIONAL',
      value: netRevenue,
      percentage: pct(netRevenue),
      type: 'header',
      indent: 0
    },
    {
      id: 'dre-4',
      code: '4.0',
      name: '(-) CUSTOS DOS SERVIÇOS & PRODUTOS PRESTADOS (CSP)',
      value: totalVariableCosts,
      percentage: pct(totalVariableCosts),
      type: 'cost',
      indent: 0,
      children: [
        { id: 'dre-4.1', code: '4.1', name: 'Repasses & Comissões de Nutricionistas Parceiros', value: commissions, percentage: pct(commissions), type: 'cost', indent: 1 },
        { id: 'dre-4.2', code: '4.2', name: 'Custo das Mercadorias Vendidas (CMV Suplementos)', value: costOfGoods, percentage: pct(costOfGoods), type: 'cost', indent: 1 }
      ]
    },
    {
      id: 'dre-5',
      code: '5.0',
      name: '(=) MARGEM DE CONTRIBUIÇÃO BRUTA',
      value: contributionMargin,
      percentage: pct(contributionMargin),
      type: 'header',
      indent: 0
    },
    {
      id: 'dre-6',
      code: '6.0',
      name: '(-) DESPESAS OPERACIONAIS FIXAS (OPEX)',
      value: totalFixedExpenses,
      percentage: pct(totalFixedExpenses),
      type: 'expense',
      indent: 0,
      children: [
        { id: 'dre-6.1', code: '6.1', name: 'Aluguel, Condomínio & IPTU das Unidades', value: rentAndCondo, percentage: pct(rentAndCondo), type: 'expense', indent: 1 },
        { id: 'dre-6.2', code: '6.2', name: 'Softwares Clínicos, SaaS & Prontuário IA', value: softwareAndTech, percentage: pct(softwareAndTech), type: 'expense', indent: 1 },
        { id: 'dre-6.3', code: '6.3', name: 'Marketing, Tráfego Pago & Captação', value: marketingExpenses, percentage: pct(marketingExpenses), type: 'expense', indent: 1 },
        { id: 'dre-6.4', code: '6.4', name: 'Material de Escritório & Despesas Gerais', value: adminOther, percentage: pct(adminOther), type: 'expense', indent: 1 }
      ]
    },
    {
      id: 'dre-7',
      code: '7.0',
      name: '(=) RESULTADO OPERACIONAL LÍQUIDO / EBITDA CLÍNICO',
      value: ebitda,
      percentage: pct(ebitda),
      type: 'result',
      indent: 0
    }
  ];
}

// Formatador monetário brasileiro BRL oficial
export function formatCurrencyBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

// Formatador de data brasileira DD/MM/AAAA
export function formatDateBR(isoDateString: string): string {
  if (!isoDateString) return '-';
  const [year, month, day] = isoDateString.split('-');
  if (!year || !month || !day) return isoDateString;
  return `${day}/${month}/${year}`;
}
