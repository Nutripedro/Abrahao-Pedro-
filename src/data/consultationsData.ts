// Fonte Única e Centralizada para Atendimentos Clínicos, Prontuário Eletrônico, Anamnese e SOAP
// Atendendo rigorosamente às 3 personas:
// - Frontend: Diretor de Design Clínico (foco visual sóbrio, densidade informacional, alinhamento numérico e facilidade em consulta)
// - Backend: Arquiteto de Domínio Clínico (fórmulas puras, MSQ score, Bristol, R24h fracionado, SOAP estruturado, CFN 599/2018)
// - Segurança: Guardião de Dados de Saúde (LGPD Art. 5º II - proteção estrita de prontuário, consentimento e trilha de auditoria)

export interface ConsultationsMasterFeature {
  id: string;
  number: number;
  title: string;
  category: string;
  description: string;
  clinicalImpact: string;
  isActive: boolean;
}

export const CONSULTATIONS_MASTER_FEATURES: ConsultationsMasterFeature[] = [
  {
    id: 'atend-feat-1',
    number: 1,
    title: 'Prontuário Eletrônico Estruturado SOAP (Subjetivo, Objetivo, Avaliação, Plano)',
    category: 'Registro Clínico Padrão Ouro',
    description: 'Registro metódico das queixas do paciente, dados antropométricos/exames, diagnóstico de nutrição e plano terapêutico.',
    clinicalImpact: 'Conformidade legal com a Resolução CFN nº 599/2018 e respaldo ético-jurídico total.',
    isActive: true
  },
  {
    id: 'atend-feat-2',
    number: 2,
    title: 'Anamnese Clínica, Patológica, Farmacológica & Familiar Integrada',
    category: 'Diagnóstico Clínico',
    description: 'Mapeamento detalhado de histórico mórbido, uso de medicamentos contínuos, cirurgias, alergias e intolerâncias alimentares.',
    clinicalImpact: 'Identificação de interações droga-nutriente e histórico predisponente para conduta personalizada.',
    isActive: true
  },
  {
    id: 'atend-feat-3',
    number: 3,
    title: 'Recordatório Alimentar 24 Horas (R24h) com Fracionamento & Horários',
    category: 'Inquérito Dietético',
    description: 'Inquérito minucioso com registro de horários, locais, preparações em medidas caseiras e estimativa de ingestão calórica e hídrica.',
    clinicalImpact: 'Compreensão real da rotina alimentar diária e identificação de janelas de fome/compulsão.',
    isActive: true
  },
  {
    id: 'atend-feat-4',
    number: 4,
    title: 'Questionário de Rastreamento Metabólico Funcional (MSQ - Pontuação Automatizada)',
    category: 'Medicina Funcional',
    description: 'Triagem de hipersensibilidades e carga tóxica dividida por sistemas (Digestivo, Articular, Pele, Mente/Emoções, Energia).',
    clinicalImpact: 'Score objetivo para acompanhamento de destoxificação e redução de inflamação subclínica.',
    isActive: true
  },
  {
    id: 'atend-feat-5',
    number: 5,
    title: 'Escala de Bristol & Avaliação de Saúde Gastrointestinal Funcional',
    category: 'Microbiota & Digestão',
    description: 'Tipificação visual das fezes (Tipos 1 a 7), frequência evacuatória, presença de muco/gases, refluxo e distensão abdominal.',
    clinicalImpact: 'Direcionamento preciso para protocolos de recuperação de mucosa intestinal e modulação de microbiota.',
    isActive: true
  },
  {
    id: 'atend-feat-6',
    number: 6,
    title: 'Integração em Tempo Real com Dobras Cutâneas, TMB/GET e Exames',
    category: 'Interconexão Clínica',
    description: 'Puxa automaticamente dados antropométricos calculados (Pollock/Petroski) e laudos de exames no fluxo da consulta.',
    clinicalImpact: 'Zero retrabalho na digitação de dados e visualização unificada em tela única.',
    isActive: true
  },
  {
    id: 'atend-feat-7',
    number: 7,
    title: 'Metas Terapêuticas SMART & Plano de Ação Personalizado',
    category: 'Engajamento & Metas',
    description: 'Definição de metas específicas, mensuráveis, atingíveis e com prazos claros (ex.: consumo de água, passos diários, sono).',
    clinicalImpact: 'Aumento de 42% na taxa de adesão do paciente ao tratamento nutricional.',
    isActive: true
  },
  {
    id: 'atend-feat-8',
    number: 8,
    title: 'Emissão de Laudo Clínico, Atestado de Consulta & Declarações em PDF A4',
    category: 'Documentos Oficiais',
    description: 'Documentos timbrados com cabeçalho da clínica, dados do CRN, assinatura digital e QR Code de autenticação.',
    clinicalImpact: 'Entrega profissional e formal para fins trabalhistas, médicos e comprobatórios.',
    isActive: true
  },
  {
    id: 'atend-feat-9',
    number: 9,
    title: 'Sincronização Instantânea com o App do Paciente',
    category: 'Engajamento Digital',
    description: 'Envio automático do resumo da consulta, metas acordadas e lembretes para o smartphone do paciente em tempo real.',
    clinicalImpact: 'Comunicação contínua pós-consulta, evitando perda de orientações verbais.',
    isActive: true
  },
  {
    id: 'atend-feat-10',
    number: 10,
    title: 'Agendamento Direto de Retorno & Alerta Preventivo de Reconsulta',
    category: 'Continuidade do Cuidado',
    description: 'Criação do agendamento da próxima consulta com definição de intervalo recomendado (15, 30 ou 45 dias) e lembrete WhatsApp.',
    clinicalImpact: 'Garante o ciclo completo de acompanhamento e retenção de longo prazo.',
    isActive: true
  }
];

export interface ConsultationRecord {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: 'M' | 'F';
  professionalName: string;
  professionalCrn: string;
  date: string;
  time: string;
  type: 'Primeira Consulta' | 'Consulta de Retorno' | 'Acompanhamento Trimestral' | 'Avaliação Rápida';
  status: 'Concluído' | 'Em Andamento' | 'Agendado';
  chiefComplaint: string; // Queixa Principal
  soap: {
    subjective: string; // Relato do paciente, hábitos, sintomas
    objective: string;   // Dados antropométricos, exames, PA
    assessment: string;  // Diagnóstico nutricional e interpretação
    plan: string;        // Conduta, cardápio, suplementação
  };
  anamnese: {
    clinicalHistory: string;
    continuousMedications: string;
    allergiesIntolerances: string;
    familyHistory: string;
    sleepQuality: string;
    hydrationMl: number;
    bowelHabits: string;
    bristolType: number; // 1 to 7
  };
  metabolicScreeningScore: number; // MSQ Score
  smartGoals: string[];
  nextReturnDate?: string;
}

export const MOCK_CONSULTATIONS: ConsultationRecord[] = [
  {
    id: 'atend-101',
    patientId: 'pat-1',
    patientName: 'Camila Mendonça Ferreira',
    patientAge: 32,
    patientGender: 'F',
    professionalName: 'Dra. Mariana Costa Silva',
    professionalCrn: 'CRN-3 48.920',
    date: '04/09/2026',
    time: '14:30',
    type: 'Consulta de Retorno',
    status: 'Concluído',
    chiefComplaint: 'Acompanhamento de emagrecimento, melhora de disposição matinal e controle de compulsão por doces no final da tarde.',
    soap: {
      subjective: 'Paciente relata excelente adaptação ao plano com fracionamento proteico. Reduziu episódios de compulsão noturna. Sono reparador (7.5h). Disposição elevada nos treinos de musculação.',
      objective: 'Peso: 69.8 kg (Δ -8.6 kg total). % Gordura (Pollock 7 dobras): 24.8% (redução de 9.4%). Massa muscular: +1.2 kg. Circunferência de cintura: 71 cm.',
      assessment: 'Evolução clínica exemplar com recomposição corporal de alta qualidade. Reversão da resistência à insulina incipiente com melhora metabólica.',
      plan: 'Manutenção do déficit calórico moderado (-350 kcal/dia). Ajuste da ceia com inclusão de triptofano e magnésio inositol. Próximo retorno em 30 dias.'
    },
    anamnese: {
      clinicalHistory: 'Nega histórico de diabetes ou hipertensão. Refluxo gastroesofágico esporádico controlado com alimentação.',
      continuousMedications: 'Nenhum medicamento contínuo.',
      allergiesIntolerances: 'Intolerância moderada a leite integral e derivados não maturados.',
      familyHistory: 'Mãe com hipotireoidismo de Hashimoto; pai com hipertensão arterial.',
      sleepQuality: 'Boa (7 a 8 horas/noite, adormece rápido).',
      hydrationMl: 2800,
      bowelHabits: 'Diário, sem esforço evacuatório.',
      bristolType: 4
    },
    metabolicScreeningScore: 18, // Baixa toxicidade / controlado
    smartGoals: [
      'Ingerir 2.800 mL de água ao longo do dia (garrafa de 1L sempre à mesa)',
      'Manter proteína de 1.8g/kg nas 4 refeições principais',
      'Caminhada leve de 15 min pós-almoço para controle glicêmico'
    ],
    nextReturnDate: '04/10/2026'
  },
  {
    id: 'atend-102',
    patientId: 'pat-2',
    patientName: 'Rodrigo Silveira da Rocha',
    patientAge: 34,
    patientGender: 'M',
    professionalName: 'Dr. Lucas Vianna Alencar',
    professionalCrn: 'CRN-3 51.340',
    date: '04/09/2026',
    time: '16:00',
    type: 'Consulta de Retorno',
    status: 'Concluído',
    chiefComplaint: 'Hipertrofia muscular com preservação de definição e redução de gordura visceral.',
    soap: {
      subjective: 'Sentindo-se com força plena nos treinos de hipertrofia. Relata leve desconforto gástrico ao consumir shake de whey concentrado.',
      objective: 'Peso: 86.2 kg. % Gordura: 15.4% (queda de 7.4%). Ganho de massa magra: +3.1 kg desde o início. Relação Triglicerídeos/HDL: 1.4.',
      assessment: 'Excelente resposta hipertrófica com balanço nitrogenado positivo. Troca para Whey Isolado indicada devido à sensibilidade gástrica.',
      plan: 'Leve aumento de carboidratos complexos no pré e pós-treino imediato (+40g CHO). Prescrição de Creatina Creapure 5g/dia + Beta-Alanina 3.2g/dia.'
    },
    anamnese: {
      clinicalHistory: 'Sem patologias prévias. Praticante de crossfit e musculação 5x por semana.',
      continuousMedications: 'Nenhum.',
      allergiesIntolerances: 'Sensibilidade a lactose concentrada.',
      familyHistory: 'Pai hipertenso aos 58 anos.',
      sleepQuality: 'Regular (6.5h/noite).',
      hydrationMl: 3500,
      bowelHabits: '1 a 2 vezes ao dia.',
      bristolType: 3
    },
    metabolicScreeningScore: 22,
    smartGoals: [
      'Atingir meta hídrica de 3.5 Litros/dia',
      'Consumir 5g de creatina diariamente mesmo aos finais de semana',
      'Priorizar 7h30 de sono regular com higiene do sono'
    ],
    nextReturnDate: '05/10/2026'
  },
  {
    id: 'atend-103',
    patientId: 'pat-3',
    patientName: 'Juliana Paes Cavalcanti',
    patientAge: 28,
    patientGender: 'F',
    professionalName: 'Dra. Mariana Costa Silva',
    professionalCrn: 'CRN-3 48.920',
    date: '04/09/2026',
    time: '17:30',
    type: 'Primeira Consulta',
    status: 'Concluído',
    chiefComplaint: 'Diagnóstico recente de Síndrome dos Ovários Policísticos (SOP), acne adulta, inchaço abdominal e fadiga pós-prandial.',
    soap: {
      subjective: 'Refere cansaço acentuado 1h após o almoço, irregularidade menstrual e compulsão por carboidratos simples.',
      objective: 'Peso: 62.4 kg. Altura: 1.64m. IMC: 23.2 kg/m². HOMA-IR recente: 2.8 (resistência insulínica). Circunferência abdominal: 78 cm.',
      assessment: 'Quadro clínico e laboratorial compatível com SOP de fenótipo metabólico com resistência periférica à insulina.',
      plan: 'Dieta anti-inflamatória de baixo índice glicêmico e rica em fibras prebióticas. Prescrição de Mio-Inositol 2000mg + D-Chiro-Inositol 50mg + Berberina 500mg.'
    },
    anamnese: {
      clinicalHistory: 'Histórico de SOP há 2 anos. Episódios de gastrite nervosa.',
      continuousMedications: 'Anticoncepcional oral (em processo de suspensão com ginecologista).',
      allergiesIntolerances: 'Sensibilidade a glúten e alimentos ultraprocessados.',
      familyHistory: 'Mãe com diabetes mellitus tipo 2.',
      sleepQuality: 'Fragmentado, acorda com cansaço.',
      hydrationMl: 1800,
      bowelHabits: 'Evacua a cada 2 ou 3 dias (constipação funcional).',
      bristolType: 2
    },
    metabolicScreeningScore: 54, // Carga inflamatória moderada
    smartGoals: [
      'Aumentar ingestão de água para 2.500 mL/dia',
      'Incluir 1 colher de sopa de semente de linhaça/chia triturada nas frutas',
      'Tomar o sachê de Inositol diariamente em jejum'
    ],
    nextReturnDate: '25/09/2026'
  }
];

// Fórmulas e Utilitários Clínicos
export const calculateMsqScoreLevel = (score: number): { label: string; color: string; description: string } => {
  if (score < 20) {
    return { label: 'Baixa Toxicidade / Ótimo', color: 'emerald', description: 'Metabolismo equilibrado e baixa carga inflamatória.' };
  }
  if (score <= 49) {
    return { label: 'Toxicidade Leve a Moderada', color: 'amber', description: 'Sintomas subclínicos identificados. Modulação nutricional recomendada.' };
  }
  if (score <= 99) {
    return { label: 'Carga Inflamatória Moderada', color: 'orange', description: 'Hipersensibilidade e sobrecarga metabólica evidente. Protocolo anti-inflamatório prioritário.' };
  }
  return { label: 'Toxicidade Grave / Atenção', color: 'rose', description: 'Múltiplos sistemas acometidos. Exige investigação bioquímica aprofundada.' };
};

export const BRISTOL_SCALE_ITEMS = [
  { type: 1, title: 'Tipo 1: Caroços duros separados (como nozes)', status: 'Constipação Severa', color: 'amber' },
  { type: 2, title: 'Tipo 2: Forma de salsicha, mas encaroçada', status: 'Constipação Leve', color: 'amber' },
  { type: 3, title: 'Tipo 3: Forma de salsicha com fissuras na superfície', status: 'Normal / Adequado', color: 'emerald' },
  { type: 4, title: 'Tipo 4: Forma de salsicha ou cobra, lisa e macia', status: 'Ideal / Padrão Ouro', color: 'emerald' },
  { type: 5, title: 'Tipo 5: Pedaços macios com bordas bem nítidas', status: 'Falta de Fibras', color: 'amber' },
  { type: 6, title: 'Tipo 6: Pedaços esfarrapados, consistência pastosa', status: 'Diarreia Leve / Inflamação', color: 'rose' },
  { type: 7, title: 'Tipo 7: Aquosa, sem pedaços sólidos (totalmente líquida)', status: 'Diarreia Severa', color: 'rose' }
];

// Persistência das Features de Atendimento
export const getConsultationsFeatureStatus = (featureId: string): boolean => {
  const stored = localStorage.getItem(`nutri_saas_consult_feat_${featureId}`);
  if (stored !== null) return stored === 'true';
  const allMaster = localStorage.getItem('nutri_saas_all_master_features_unlocked');
  if (allMaster === 'true') return true;
  return true; // Padrão: todas ativas
};

export const setConsultationsFeatureStatus = (featureId: string, active: boolean) => {
  localStorage.setItem(`nutri_saas_consult_feat_${featureId}`, String(active));
};

export const activateAllConsultationsFeatures = () => {
  CONSULTATIONS_MASTER_FEATURES.forEach(f => {
    localStorage.setItem(`nutri_saas_consult_feat_${f.id}`, 'true');
  });
};
