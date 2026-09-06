// Fonte de Dados Única e Centralizada para Requisição Inteligente de Exames Clínicos
// Conforme diretrizes da persona de Arquiteto Clínico: centralizado em JSON único, testável e reutilizável.
// Resolução CFN nº 656/2020 e Diretrizes Laboratoriais Brasileiras (SBPC/ML)

export interface ClinicalExamItem {
  id: string;
  name: string;
  synonyms?: string[];
  category: string;
  defaultFastHours?: number;
  clinicalIndication: string;
  referenceHealthy: string;
  functionalOptimal?: string; // Faixa Ótima da Nutrição Funcional
  unit?: string;
  isNutriAllowed: boolean; // Permitido para Nutricionistas (Resolução CFN nº 656/2020)
  isDoctorOnly?: boolean;  // Específico para prescrição médica complementar
  prepInstructions?: string;
  sampleType?: string; // Soro, Plasma, Urina, Fezes, Saliva
}

export interface ExamCategory {
  id: string;
  title: string;
  description: string;
  iconName?: string;
  exams: ClinicalExamItem[];
}

export interface PredefinedClinicalPanel {
  id: string;
  title: string;
  objective: string;
  targetProfile: string;
  recommendedFasting: number;
  clinicalJustification: string;
  examIds: string[];
  tags: string[];
}

export interface FunctionalIndexResult {
  name: string;
  formulaDescription: string;
  value: number;
  unit: string;
  clinicalClassification: 'optimal' | 'moderate_risk' | 'high_risk';
  interpretation: string;
  therapeuticSuggestion: string;
}

export const CLINICAL_EXAMS_DATABASE: ExamCategory[] = [
  {
    id: 'metabolic_glucose',
    title: 'Painel Metabólico & Glicêmico',
    description: 'Avaliação de homeostase glicêmica, resistência insulínica e risco de síndrome metabólica.',
    exams: [
      {
        id: 'glicemia_jejum',
        name: 'Glicemia de Jejum',
        category: 'Metabólico & Glicêmico',
        defaultFastHours: 8,
        clinicalIndication: 'Rastreio de diabetes mellitus tipo 2, intolerância à glicose e hipoglicemia reativa.',
        referenceHealthy: '70 a 99 mg/dL',
        functionalOptimal: '75 a 88 mg/dL',
        unit: 'mg/dL',
        sampleType: 'Plasma Fluoretado',
        prepInstructions: 'Jejum obrigatório de 8 a 12 horas. Não ingerir bebidas alcoólicas 24h antes.',
        isNutriAllowed: true
      },
      {
        id: 'insulina_jejum',
        name: 'Insulina Basal de Jejum',
        category: 'Metabólico & Glicêmico',
        defaultFastHours: 8,
        clinicalIndication: 'Cálculo do índice HOMA-IR, identificação precoce de hiperinsulinemia e resistência à insulina.',
        referenceHealthy: '2,6 a 24,9 µUI/mL',
        functionalOptimal: '2,0 a 6,0 µUI/mL',
        unit: 'µUI/mL',
        sampleType: 'Soro',
        prepInstructions: 'Jejum obrigatório de 8 a 12h. Evitar treino extenuante no dia anterior.',
        isNutriAllowed: true
      },
      {
        id: 'hba1c',
        name: 'Hemoglobina Glicada (HbA1c)',
        category: 'Metabólico & Glicêmico',
        defaultFastHours: 0,
        clinicalIndication: 'Média ponderada da glicemia dos últimos 90 a 120 dias; monitoramento do controle dietoterápico.',
        referenceHealthy: '< 5,7% (Controle: < 7,0%)',
        functionalOptimal: '4,6% a 5,2%',
        unit: '%',
        sampleType: 'Sangue Total com EDTA',
        prepInstructions: 'Não exige jejum obrigatório. Coleta padrão.',
        isNutriAllowed: true
      },
      {
        id: 'homa_ir',
        name: 'Índice HOMA-IR & HOMA-BETA',
        category: 'Metabólico & Glicêmico',
        defaultFastHours: 8,
        clinicalIndication: 'Avaliação da sensibilidade periférica à insulina e função secretora das células beta pancreáticas.',
        referenceHealthy: 'HOMA-IR < 2,15 (Adultos eutróficos)',
        functionalOptimal: '< 1,40 (Excelente sensibilidade)',
        unit: 'índice',
        sampleType: 'Cálculo Matemático Soro',
        prepInstructions: 'Calculado a partir de Glicemia e Insulina em jejum de 8 a 12h.',
        isNutriAllowed: true
      },
      {
        id: 'acido_urico',
        name: 'Ácido Úrico Sérico',
        category: 'Metabólico & Glicêmico',
        defaultFastHours: 8,
        clinicalIndication: 'Hiperuricemia, sobrecarga metabólica por frutose refinada, gota e risco cardiovascular.',
        referenceHealthy: 'Homens: 3,4 a 7,0 mg/dL | Mulheres: 2,4 a 5,7 mg/dL',
        functionalOptimal: '3,0 a 5,0 mg/dL',
        unit: 'mg/dL',
        sampleType: 'Soro',
        prepInstructions: 'Jejum de 8h. Evitar frutos do mar, carnes vermelhas em excesso e álcool 24h antes.',
        isNutriAllowed: true
      }
    ]
  },
  {
    id: 'lipid_cardio',
    title: 'Painel Lipídico & Cardiovascular',
    description: 'Perfil aterogênico completo para direcionamento da ingestão lipídica e antioxidantes.',
    exams: [
      {
        id: 'colesterol_total',
        name: 'Colesterol Total',
        category: 'Lipídico & Cardiovascular',
        defaultFastHours: 12,
        clinicalIndication: 'Avaliação lipídica global e cálculo de frações não-HDL.',
        referenceHealthy: '< 190 mg/dL',
        functionalOptimal: '150 a 190 mg/dL',
        unit: 'mg/dL',
        sampleType: 'Soro',
        prepInstructions: 'Jejum de 12 horas. Manter dieta habitual nos 5 dias prévios.',
        isNutriAllowed: true
      },
      {
        id: 'hdl',
        name: 'HDL-Colesterol (Lipoproteína de Alta Densidade)',
        category: 'Lipídico & Cardiovascular',
        defaultFastHours: 12,
        clinicalIndication: 'Transporte reverso do colesterol; fator de proteção endotelial.',
        referenceHealthy: '> 40 mg/dL (Desejável funcional: > 50 mg/dL)',
        functionalOptimal: '> 55 mg/dL (Homens) | > 65 mg/dL (Mulheres)',
        unit: 'mg/dL',
        sampleType: 'Soro',
        prepInstructions: 'Jejum de 12 horas.',
        isNutriAllowed: true
      },
      {
        id: 'ldl',
        name: 'LDL-Colesterol (Calculado / Direto)',
        category: 'Lipídico & Cardiovascular',
        defaultFastHours: 12,
        clinicalIndication: 'Partícula aterogênica primária; ajuste de gorduras saturadas vs. mono/poliinsaturadas.',
        referenceHealthy: '< 130 mg/dL (Risco baixo: < 100 mg/dL)',
        functionalOptimal: '< 90 mg/dL',
        unit: 'mg/dL',
        sampleType: 'Soro',
        prepInstructions: 'Jejum de 12 horas.',
        isNutriAllowed: true
      },
      {
        id: 'triglicerideos',
        name: 'Triglicerídeos',
        category: 'Lipídico & Cardiovascular',
        defaultFastHours: 12,
        clinicalIndication: 'Depuração de lipídios exógenos/endógenos; correlacionado a carboidratos simples e álcool.',
        referenceHealthy: '< 150 mg/dL (Jejum)',
        functionalOptimal: '< 90 mg/dL (Excelente metabolismo)',
        unit: 'mg/dL',
        sampleType: 'Soro',
        prepInstructions: 'Jejum de 12 horas. Não ingerir álcool nas 72h prévias.',
        isNutriAllowed: true
      },
      {
        id: 'apob',
        name: 'Apolipoproteína B (ApoB)',
        category: 'Lipídico & Cardiovascular',
        defaultFastHours: 12,
        clinicalIndication: 'Contagem direta do número de partículas aterogênicas circulantes no plasma.',
        referenceHealthy: '< 90 mg/dL',
        functionalOptimal: '< 75 mg/dL',
        unit: 'mg/dL',
        sampleType: 'Soro',
        prepInstructions: 'Jejum de 8 a 12 horas.',
        isNutriAllowed: true
      },
      {
        id: 'pcr_us',
        name: 'Proteína C-Reativa Ultrassensível (PCR-us)',
        category: 'Lipídico & Cardiovascular',
        defaultFastHours: 0,
        clinicalIndication: 'Marcador de microinflamação subclínica crônica endotelial e tecido adiposo.',
        referenceHealthy: '< 1,0 mg/L (Baixo risco inflamatório)',
        functionalOptimal: '< 0,5 mg/L',
        unit: 'mg/L',
        sampleType: 'Soro',
        prepInstructions: 'Não exige jejum obrigatório. Adiar coleta se houver infecção aguda/resfriado.',
        isNutriAllowed: true
      },
      {
        id: 'homocisteina',
        name: 'Homocisteína Plasmática',
        category: 'Lipídico & Cardiovascular',
        defaultFastHours: 8,
        clinicalIndication: 'Risco trombótico vascular, integridade do ciclo de metilação e status de B6, B9 e B12.',
        referenceHealthy: '5 a 15 µmol/L',
        functionalOptimal: '6 a 9 µmol/L',
        unit: 'µmol/L',
        sampleType: 'Plasma com EDTA / Heparina',
        prepInstructions: 'Jejum de 8 horas. Repouso de 15 min antes da coleta.',
        isNutriAllowed: true
      }
    ]
  },
  {
    id: 'vitamins_minerals',
    title: 'Vitaminas, Minerais & Micronutrientes',
    description: 'Status nutricional de coenzimas vitais para mitocôndrias, síntese proteica e imunidade.',
    exams: [
      {
        id: 'vitamina_d',
        name: '25-Hidroxivitamina D [25(OH)D]',
        category: 'Vitaminas & Minerais',
        defaultFastHours: 0,
        clinicalIndication: 'Saúde óssea, modulação imunológica, força muscular e síntese de adipocinas.',
        referenceHealthy: '20 a 60 ng/mL',
        functionalOptimal: '40 a 60 ng/mL (Otimização metabólica e imunológica)',
        unit: 'ng/mL',
        sampleType: 'Soro',
        prepInstructions: 'Sem necessidade de jejum alimentar estrito.',
        isNutriAllowed: true
      },
      {
        id: 'vitamina_b12',
        name: 'Vitamina B12 (Cobalamina)',
        category: 'Vitaminas & Minerais',
        defaultFastHours: 8,
        clinicalIndication: 'Hematopoiese, mielinização neural e metilação; essencial em vegetarianos e bariátricos.',
        referenceHealthy: '200 a 900 pg/mL',
        functionalOptimal: '450 a 850 pg/mL',
        unit: 'pg/mL',
        sampleType: 'Soro',
        prepInstructions: 'Jejum de 8 horas. Evitar suplementação de alta dose nas 48h prévias.',
        isNutriAllowed: true
      },
      {
        id: 'acido_folico',
        name: 'Ácido Fólico Sérico / Folato Eritrocitário',
        category: 'Vitaminas & Minerais',
        defaultFastHours: 8,
        clinicalIndication: 'Síntese de DNA, ciclo de um carbono e reciclagem de homocisteína.',
        referenceHealthy: '> 4,0 ng/mL',
        functionalOptimal: '> 8,0 ng/mL',
        unit: 'ng/mL',
        sampleType: 'Soro',
        prepInstructions: 'Jejum de 8 horas.',
        isNutriAllowed: true
      },
      {
        id: 'ferritina',
        name: 'Ferritina Sérica',
        category: 'Vitaminas & Minerais',
        defaultFastHours: 8,
        clinicalIndication: 'Reserva tecidual de ferro; também reativo de fase aguda positiva em inflamação crônica.',
        referenceHealthy: 'Homens: 30 a 400 ng/mL | Mulheres: 15 a 150 ng/mL',
        functionalOptimal: '50 a 150 ng/mL (sem sobrecarga nem carência)',
        unit: 'ng/mL',
        sampleType: 'Soro',
        prepInstructions: 'Jejum de 8 horas.',
        isNutriAllowed: true
      },
      {
        id: 'ferro_serico',
        name: 'Ferro Sérico & Saturação de Transferrina (TIBC)',
        category: 'Vitaminas & Minerais',
        defaultFastHours: 8,
        clinicalIndication: 'Diagnóstico diferencial de anemias microcíticas e saturação da transferrina.',
        referenceHealthy: 'Saturação da Transferrina: 20% a 50%',
        functionalOptimal: '30% a 45%',
        unit: '% saturação',
        sampleType: 'Soro',
        prepInstructions: 'Jejum de 8 horas. Coleta matinal preferencial.',
        isNutriAllowed: true
      },
      {
        id: 'zinco_serico',
        name: 'Zinco Sérico',
        category: 'Vitaminas & Minerais',
        defaultFastHours: 8,
        clinicalIndication: 'Cofator de mais de 300 enzimas, cicatrização, paladar e eixo hormonal.',
        referenceHealthy: '70 a 120 µg/dL',
        functionalOptimal: '90 a 115 µg/dL',
        unit: 'µg/dL',
        sampleType: 'Soro em tubo livre de metais (Trace Elements)',
        prepInstructions: 'Jejum de 8 horas. Tubo especial livre de contaminação.',
        isNutriAllowed: true
      },
      {
        id: 'magnesio_serico',
        name: 'Magnésio Sérico / Eritrocitário',
        category: 'Vitaminas & Minerais',
        defaultFastHours: 8,
        clinicalIndication: 'Relaxamento neuromuscular, síntese de ATP, regulação de sono e receptores de insulina.',
        referenceHealthy: '1,6 a 2,6 mg/dL (Eritrocitário: 4,0 a 6,0 mg/dL)',
        functionalOptimal: '2,2 a 2,5 mg/dL (Sérico) | > 5,0 mg/dL (Eritrocitário)',
        unit: 'mg/dL',
        sampleType: 'Soro ou Eritrócitos lavados',
        prepInstructions: 'Jejum de 8 horas.',
        isNutriAllowed: true
      },
      {
        id: 'calcio_ionico',
        name: 'Cálcio Iônico e Cálcio Total',
        category: 'Vitaminas & Minerais',
        defaultFastHours: 8,
        clinicalIndication: 'Homeostase mineral óssea, contração muscular e excitabilidade neuronal.',
        referenceHealthy: '1,12 a 1,32 mmol/L (Iônico)',
        functionalOptimal: '1,20 a 1,28 mmol/L',
        unit: 'mmol/L',
        sampleType: 'Soro / Sangue Total heparinizado',
        prepInstructions: 'Jejum de 8 horas. Evitar garroteamento prolongado.',
        isNutriAllowed: true
      }
    ]
  },
  {
    id: 'hepatic_renal',
    title: 'Função Hepática, Renal & Proteica',
    description: 'Monitoramento da tolerância a dietas hiperproteicas e integridade hepatobiliar.',
    exams: [
      {
        id: 'creatinina',
        name: 'Creatinina Sérica & Taxa de Filtração Glomerular (eTFG CKD-EPI)',
        category: 'Hepático & Renal',
        defaultFastHours: 8,
        clinicalIndication: 'Segurança na prescrição proteica, acompanhamento de atletas e uso de creatina monohidratada.',
        referenceHealthy: '0,7 a 1,3 mg/dL | eTFG > 90 mL/min/1,73m²',
        functionalOptimal: '0,8 a 1,1 mg/dL | eTFG > 95 mL/min/1,73m²',
        unit: 'mg/dL',
        sampleType: 'Soro',
        prepInstructions: 'Jejum de 8 horas. Informar no laboratório se utiliza suplemento de creatina.',
        isNutriAllowed: true
      },
      {
        id: 'ureia',
        name: 'Ureia Sérica',
        category: 'Hepático & Renal',
        defaultFastHours: 8,
        clinicalIndication: 'Balanço nitrogenado, catabolismo muscular e hidratação sistêmica.',
        referenceHealthy: '15 a 45 mg/dL',
        functionalOptimal: '20 a 35 mg/dL',
        unit: 'mg/dL',
        sampleType: 'Soro',
        prepInstructions: 'Jejum de 8 horas.',
        isNutriAllowed: true
      },
      {
        id: 'tgo_ast',
        name: 'TGO / AST (Aspartato Aminotransferase)',
        category: 'Hepático & Renal',
        defaultFastHours: 8,
        clinicalIndication: 'Integridade hepatocelular e muscular esquelética (eleva pós-treino extenuante).',
        referenceHealthy: '< 35 U/L',
        functionalOptimal: '15 a 25 U/L',
        unit: 'U/L',
        sampleType: 'Soro',
        prepInstructions: 'Jejum de 8 horas. Evitar treinos intensos nas 24h a 48h prévias.',
        isNutriAllowed: true
      },
      {
        id: 'tgp_alt',
        name: 'TGP / ALT (Alanina Aminotransferase)',
        category: 'Hepático & Renal',
        defaultFastHours: 8,
        clinicalIndication: 'Marcador mais específico de esteatose hepática não alcoólica (MASLD/DHGNA).',
        referenceHealthy: '< 35 U/L (Homens < 30 U/L | Mulheres < 19 U/L para esteatose)',
        functionalOptimal: '15 a 25 U/L (Homens) | 12 a 20 U/L (Mulheres)',
        unit: 'U/L',
        sampleType: 'Soro',
        prepInstructions: 'Jejum de 8 horas.',
        isNutriAllowed: true
      },
      {
        id: 'gama_gt',
        name: 'Gama-Glutamil Transferase (GGT)',
        category: 'Hepático & Renal',
        defaultFastHours: 8,
        clinicalIndication: 'Colestase biliar, estresse oxidativo hepático e consumo de xenobióticos/álcool.',
        referenceHealthy: 'Homens: 10 a 71 U/L | Mulheres: 6 a 42 U/L',
        functionalOptimal: '12 a 28 U/L',
        unit: 'U/L',
        sampleType: 'Soro',
        prepInstructions: 'Jejum de 8 horas. Abstenção alcoólica de 72 horas.',
        isNutriAllowed: true
      },
      {
        id: 'albumina_serica',
        name: 'Proteínas Totais e Frações (Albumina / Globulina)',
        category: 'Hepático & Renal',
        defaultFastHours: 8,
        clinicalIndication: 'Pressão oncótica, reserva proteica visceral e estado nutricional crônico.',
        referenceHealthy: 'Albumina: 3,5 a 5,2 g/dL',
        functionalOptimal: '4,2 a 4,8 g/dL',
        unit: 'g/dL',
        sampleType: 'Soro',
        prepInstructions: 'Jejum de 8 horas.',
        isNutriAllowed: true
      }
    ]
  },
  {
    id: 'thyroid_hormonal',
    title: 'Eixo Hormonal & Tireoidiano',
    description: 'Equilíbrio endócrino associado a gasto calórico basal, lípides e composição corporal.',
    exams: [
      {
        id: 'tsh',
        name: 'TSH (Hormônio Tireoestimulante Ultrassensível)',
        category: 'Hormonal & Tireoide',
        defaultFastHours: 8,
        clinicalIndication: 'Rastreio de hipotireoidismo clínico/subclínico com impacto direto no metabolismo basal.',
        referenceHealthy: '0,4 a 4,5 µUI/mL',
        functionalOptimal: '1,0 a 2,2 µUI/mL (Excelente função metabólica)',
        unit: 'µUI/mL',
        sampleType: 'Soro',
        prepInstructions: 'Jejum de 8h. Suspender biotina/vitamina B7 72h antes da coleta.',
        isNutriAllowed: true
      },
      {
        id: 't4_livre',
        name: 'T4 Livre (Tiroxina Livre)',
        category: 'Hormonal & Tireoide',
        defaultFastHours: 8,
        clinicalIndication: 'Disponibilidade periférica de pró-hormônio tireoidiano para conversão em T3.',
        referenceHealthy: '0,8 a 1,8 ng/dL',
        functionalOptimal: '1,1 a 1,5 ng/dL',
        unit: 'ng/dL',
        sampleType: 'Soro',
        prepInstructions: 'Jejum de 8 horas.',
        isNutriAllowed: true
      },
      {
        id: 't3_livre',
        name: 'T3 Livre (Tri-iodotironina Livre)',
        category: 'Hormonal & Tireoide',
        defaultFastHours: 8,
        clinicalIndication: 'Hormônio ativo celular; sensível a restrições calóricas severas e carência de selênio/zinco.',
        referenceHealthy: '2,3 a 4,2 pg/mL',
        functionalOptimal: '2,8 a 3,6 pg/mL',
        unit: 'pg/mL',
        sampleType: 'Soro',
        prepInstructions: 'Jejum de 8 horas.',
        isNutriAllowed: true
      },
      {
        id: 'testosterona_total',
        name: 'Testosterona Total & Livre Calculada (SHBG + Albumina)',
        category: 'Hormonal & Tireoide',
        defaultFastHours: 8,
        clinicalIndication: 'Anabolismo muscular, densidade mineral óssea, libido e recuperação pós-esforço.',
        referenceHealthy: 'Homens: 300 a 1000 ng/dL | Mulheres: 15 a 70 ng/dL',
        functionalOptimal: 'Homens: 550 a 850 ng/dL | Mulheres: 30 a 55 ng/dL',
        unit: 'ng/dL',
        sampleType: 'Soro',
        prepInstructions: 'Jejum de 8h. Coleta matinal obrigatória entre 7h e 9h.',
        isNutriAllowed: true
      },
      {
        id: 'cortisol_basal',
        name: 'Cortisol Sérico Basal (8h da manhã)',
        category: 'Hormonal & Tireoide',
        defaultFastHours: 8,
        clinicalIndication: 'Eixo HPA, estresse crônico, catabolismo muscular e distúrbios do ritmo circadiano.',
        referenceHealthy: '5 a 25 µg/dL',
        functionalOptimal: '10 a 16 µg/dL (Coleta às 8h)',
        unit: 'µg/dL',
        sampleType: 'Soro',
        prepInstructions: 'Jejum de 8h. Repouso de 20 min no laboratório antes da punção. Coletar até as 9h.',
        isNutriAllowed: true
      }
    ]
  },
  {
    id: 'sports_performance',
    title: 'Painel Esportivo, Muscular & Sobrecarga',
    description: 'Monitoramento de dano muscular, estresse adaptativo e overreaching em atletas.',
    exams: [
      {
        id: 'ck_total',
        name: 'Creatina Quinase Total (CK / CPK)',
        category: 'Esportivo & Muscular',
        defaultFastHours: 8,
        clinicalIndication: 'Microlesão muscular, monitoramento de carga de treino e prevenção de rabdomiólise.',
        referenceHealthy: 'Homens: 39 a 308 U/L | Mulheres: 26 a 192 U/L',
        functionalOptimal: '< 200 U/L em repouso basal',
        unit: 'U/L',
        sampleType: 'Soro',
        prepInstructions: 'Jejum de 8h. Anotar tempo decorrido desde a última sessão de treino resistido.',
        isNutriAllowed: true
      },
      {
        id: 'ldh',
        name: 'Lactato Desidrogenase (LDH)',
        category: 'Esportivo & Muscular',
        defaultFastHours: 8,
        clinicalIndication: 'Turnover celular, glicólise anaeróbia e dano tecidual.',
        referenceHealthy: '120 a 246 U/L',
        functionalOptimal: '140 a 200 U/L',
        unit: 'U/L',
        sampleType: 'Soro',
        prepInstructions: 'Jejum de 8 horas.',
        isNutriAllowed: true
      }
    ]
  }
];

// Painéis Clínicos Pré-Configurados por Protocolo
export const PREDEFINED_CLINICAL_PANELS: PredefinedClinicalPanel[] = [
  {
    id: 'metabolico_emagrecimento',
    title: '🔥 Protocolo Emagrecimento & Resistência à Insulina',
    objective: 'Avaliação metabólica de pacientes com sobrepeso, gordura visceral ou dificuldade de perda ponderal.',
    targetProfile: 'Adultos com IMC > 25 ou circunferência abdominal elevada',
    recommendedFasting: 12,
    clinicalJustification: 'Investigação de resistência insulínica, dislipidemia aterogênica e esteatose hepática para prescrição de plano alimentar hipoglicídico personalizado e cálculo de índices funcionais.',
    examIds: ['glicemia_jejum', 'insulina_jejum', 'hba1c', 'homa_ir', 'colesterol_total', 'hdl', 'ldl', 'triglicerideos', 'tgp_alt', 'acido_urico', 'pcr_us'],
    tags: ['Metabolismo', 'HOMA-IR', 'Emagrecimento']
  },
  {
    id: 'hipertrofia_performance',
    title: '💪 Protocolo Hipertrofia & Rendimento Esportivo',
    objective: 'Acompanhamento da segurança de dietas hiperproteicas e equilíbrio neuromuscular.',
    targetProfile: 'Praticantes de musculação, crossfit e atletas de alto rendimento',
    recommendedFasting: 8,
    clinicalJustification: 'Avaliação de integridade muscular, função renal (depuração de ureia/creatinina) e status hormonal anabólico para prescrição dietoterápica hiperproteica e suplementação ergogênica.',
    examIds: ['creatinina', 'ureia', 'tgo_ast', 'tgp_alt', 'albumina_serica', 'ck_total', 'testosterona_total', 'cortisol_basal', 'vitamina_d', 'magnesio_serico'],
    tags: ['Esporte', 'Hipertrofia', 'Proteína']
  },
  {
    id: 'longevidade_cardio',
    title: '🫀 Protocolo Longevidade & Risco Cardiovascular',
    objective: 'Rastreio aterosclerótico aprofundado com foco em microinflamação e proteção endotelial.',
    targetProfile: 'Histórico familiar de DCV, hipertensão ou dislipidemias',
    recommendedFasting: 12,
    clinicalJustification: 'Investigação detalhada do risco aterogênico e inflamatório vascular para adequação da proporção de ácidos graxos (ômega-3, monoinsaturados) e aporte de fitoquímicos antioxidantes.',
    examIds: ['colesterol_total', 'hdl', 'ldl', 'triglicerideos', 'apob', 'pcr_us', 'homocisteina', 'glicemia_jejum', 'hba1c'],
    tags: ['Cardiovascular', 'Longevidade', 'Anti-inflamatório']
  },
  {
    id: 'vegano_vegetariano_bariatrico',
    title: '🌱 Protocolo Vegano, Vegetariano & Pós-Bariátrica',
    objective: 'Rastreio de deficiências de absorção de micronutrientes essenciais.',
    targetProfile: 'Vegetarianos estritos, veganos ou pacientes pós-cirurgia bariátrica',
    recommendedFasting: 8,
    clinicalJustification: 'Rastreio minucioso de carências nutricionais de vitaminas do complexo B, ferro, zinco e vitamina D para prescrição de suplementação manipulada individualizada e plano dietético compensatório.',
    examIds: ['vitamina_b12', 'acido_folico', 'ferritina', 'ferro_serico', 'zinco_serico', 'vitamina_d', 'calcio_ionico', 'homocisteina', 'albumina_serica'],
    tags: ['Vegetariano', 'Bariátrica', 'Micronutrientes']
  },
  {
    id: 'saude_da_mulher_tireoide',
    title: '🌸 Protocolo Saúde Feminina & Eixo Tireoidiano',
    objective: 'Avaliação de fadiga crônica, retenção hídrica, SOP e metabolismo basal.',
    targetProfile: 'Mulheres com sintomas de fadiga, queda capilar ou ciclo irregular',
    recommendedFasting: 8,
    clinicalJustification: 'Avaliação do eixo tireoidiano e homeostase hormonal para adequação calórico-proteica, suporte à conversão periférica de T4 em T3 e modulação do cortisol circadiano.',
    examIds: ['tsh', 't4_livre', 't3_livre', 'cortisol_basal', 'vitamina_d', 'ferritina', 'insulina_jejum', 'magnesio_serico', 'zinco_serico'],
    tags: ['Tireoide', 'SOP', 'Fadiga']
  }
];

// Presets de Justificativas Clínicas Estruturadas (Padrão CFN nº 656/2020 e ANS)
export const CLINICAL_JUSTIFICATION_TEMPLATES = [
  {
    id: 'just_dietoterapia',
    label: 'Adequação Dietoterápica Geral',
    text: 'Solicitação de exames bioquímicos para avaliação do estado nutricional, diagnóstico de carências de micronutrientes e adequação da conduta dietoterápica individualizada, em conformidade com a Resolução CFN nº 656/2020.'
  },
  {
    id: 'just_metabolica',
    label: 'Resistência Insulínica & Síndrome Metabólica',
    text: 'Investigação laboratorial do metabolismo glicídico e perfil lipídico aterogênico para cálculo de índices de sensibilidade insulínica (HOMA-IR) e estruturação de intervenção nutricional de baixo índice glicêmico.'
  },
  {
    id: 'just_suplementacao',
    label: 'Avaliação Pré-Prescrição de Suplementos',
    text: 'Determinação sérica prévia de níveis basais de micronutrientes e marcadores hepatorrenais para estabelecimento de posologia segura em prescrição de suplementação nutricional personalizada.'
  },
  {
    id: 'just_esportiva',
    label: 'Acompanhamento Nutricional Esportivo',
    text: 'Monitoramento da tolerância metabólica ao plano alimentar hiperproteico, avaliação de microlesão tecidual e equilíbrio hidroeletrolítico em praticante de exercício físico resistido.'
  },
  {
    id: 'just_vegetariano',
    label: 'Transição e Acompanhamento Vegetariano / Vegano',
    text: 'Monitoramento preventivo e diagnóstico de possíveis carências de cobalamina (B12), folato, ferro sérico, reserva de ferritina e zinco para orientação dietética vegetal balanceada.'
  }
];

// Redes de Laboratórios Parceiros com Vouchers e Parcerias
export const LAB_PARTNERS = [
  {
    id: 'lab_dasa',
    name: 'Rede DASA (Delboni / Salomão Zoppi / Alta)',
    coverage: 'Nacional (SP, RJ, DF, PR, BA, PE)',
    discountBadge: '15% de Desconto p/ Pacientes',
    instructions: 'Apresentar requisição assinada em qualquer unidade física ou agendar coleta domiciliar.'
  },
  {
    id: 'lab_fleury',
    name: 'Grupo Fleury / A+ Medicina Diagnóstica',
    coverage: 'Nacional',
    discountBadge: 'Coleta Domiciliar Gratuita',
    instructions: 'Código de autorização clínica integrado diretamente no QR Code do laudo.'
  },
  {
    id: 'lab_sabin',
    name: 'Laboratório Sabin',
    coverage: 'DF, GO, MG, BA, AM, PR, SC',
    discountBadge: 'Tabela Parceria Clínica',
    instructions: 'Reconhecimento automático da assinatura digital com emissão de laudo direto no app.'
  },
  {
    id: 'lab_labi',
    name: 'Labi Exames & Saúde Acessível',
    coverage: 'SP, RJ e Grande BH',
    discountBadge: 'Preços Populares a partir de R$ 9',
    instructions: 'Ideal para pacientes sem plano de saúde (coleta rápida sem necessidade de guia de convênio).'
  }
];

// Fórmulas Puras de Índices Laboratoriais Funcionais (Testáveis e Isoladas)
export function calculateHomaIr(glucoseMgDl: number, insulinMicroUiMl: number): number {
  if (!glucoseMgDl || !insulinMicroUiMl) return 0;
  return Number(((glucoseMgDl * insulinMicroUiMl) / 405).toFixed(2));
}

export function calculateHomaBeta(glucoseMgDl: number, insulinMicroUiMl: number): number {
  if (!glucoseMgDl || !insulinMicroUiMl || glucoseMgDl <= 63) return 0;
  return Number(((20 * insulinMicroUiMl) / ((glucoseMgDl * 0.0555) - 3.5)).toFixed(1));
}

export function calculateTgHdlRatio(triglycerides: number, hdl: number): number {
  if (!triglycerides || !hdl) return 0;
  return Number((triglycerides / hdl).toFixed(2));
}

export function calculateNonHdlCholesterol(totalCholesterol: number, hdl: number): number {
  if (!totalCholesterol || !hdl) return 0;
  return Number((totalCholesterol - hdl).toFixed(1));
}

export function calculateCastelli1(totalCholesterol: number, hdl: number): number {
  if (!totalCholesterol || !hdl) return 0;
  return Number((totalCholesterol / hdl).toFixed(2));
}

export function calculateCastelli2(ldl: number, hdl: number): number {
  if (!ldl || !hdl) return 0;
  return Number((ldl / hdl).toFixed(2));
}

export function calculateDeRitisAstAltRatio(ast: number, alt: number): number {
  if (!ast || !alt) return 0;
  return Number((ast / alt).toFixed(2));
}

// 10 Master Features do Módulo de Requisição Inteligente de Exames
export interface ExamRequisitionFeature {
  id: string;
  number: number;
  title: string;
  category: string;
  description: string;
  clinicalImpact: string;
  isActive: boolean;
}

export const EXAM_REQUISITION_MASTER_FEATURES: ExamRequisitionFeature[] = [
  {
    id: 'feat-1',
    number: 1,
    title: 'Protocolos Clínicos Especializados por Objetivo',
    category: 'Diagnóstico Nutricional',
    description: 'Painéis pré-configurados para Emagrecimento, Hipertrofia, Longevidade, Vegano/Bariátrica e Saúde Feminina.',
    clinicalImpact: 'Agilidade na consulta com seleção em 1 clique e fundamentação técnica comprovada.',
    isActive: true
  },
  {
    id: 'feat-2',
    number: 2,
    title: 'Calculadora e Motor de Índices Laboratoriais Funcionais',
    category: 'Bioquímica Funcional',
    description: 'Cálculo automatizado de HOMA-IR, HOMA-BETA, Relação TG/HDL, Colesterol Não-HDL, Índices de Castelli I/II e Razão AST/ALT.',
    clinicalImpact: 'Detecção precoce de resistência insulínica e aterogênese antes das alterações em exames isolados.',
    isActive: true
  },
  {
    id: 'feat-3',
    number: 3,
    title: 'Valores de Referência Funcionais vs. Convencionais',
    category: 'Interpretação Clínica',
    description: 'Faixas ótimas da Nutrição Funcional (ex: Vitamina D 40-60 ng/mL, Ferritina 50-150 ng/mL, Insulina < 6 µUI/mL) comparadas aos laudos laboratoriais.',
    clinicalImpact: 'Tratamento de desvios subclínicos para máxima disposição, energia e prevenção de patologias.',
    isActive: true
  },
  {
    id: 'feat-4',
    number: 4,
    title: 'Cálculo Automático de Jejum e Instruções de Coleta',
    category: 'Preparo Laboratorial',
    description: 'Identificação inteligente da maior janela de jejum (ex: 12h para lipídios) e orientações personalizadas de preparo hídrico e suspensão de biotina.',
    clinicalImpact: 'Eliminação de recoletas e garantia da precisão das amostras biológicas coletadas.',
    isActive: true
  },
  {
    id: 'feat-5',
    number: 5,
    title: 'Gerador de Justificativas Clínicas Padrão CFN nº 656/2020',
    category: 'Compliance & Convênios',
    description: 'Modelos textuais padronizados com fundamentação diagnóstica para atendimento da ANS e aprovação em operadoras de saúde.',
    clinicalImpact: 'Zero glosas em convênios e total conformidade com o Conselho Federal de Nutricionistas.',
    isActive: true
  },
  {
    id: 'feat-6',
    number: 6,
    title: 'Diferenciação Regulatória & Filtro de Autonomia CFN',
    category: 'Segurança Profissional',
    description: 'Sinalização clara de exames de solicitação autônoma do nutricionista e exames complementares multidisciplinares.',
    clinicalImpact: 'Segurança jurídica e clínica absoluta durante o exercício profissional.',
    isActive: true
  },
  {
    id: 'feat-7',
    number: 7,
    title: 'Integração e Vouchers com Redes Laboratoriais Parceiras',
    category: 'Rede de Benefícios',
    description: 'Parcerias com Dasa, Fleury, Sabin e Labi Exames com até 20% de desconto e coleta domiciliar para pacientes particulares.',
    clinicalImpact: 'Acessibilidade financeira aos exames e fidelização imediata do paciente.',
    isActive: true
  },
  {
    id: 'feat-8',
    number: 8,
    title: 'Laudo Timbrado Executivo & PDF A4 com Assinatura Digital',
    category: 'Exportação & Impressão',
    description: 'Documento oficial timbrado contendo cabeçalho clínico, QR Code de autenticação, dados do paciente e layout profissional.',
    clinicalImpact: 'Apresentação visual elegante que transmite credibilidade e autoridade médica.',
    isActive: true
  },
  {
    id: 'feat-9',
    number: 9,
    title: 'Sincronização em Tempo Real com o App do Paciente',
    category: 'Engajamento Digital',
    description: 'Envio direto para o smartphone do paciente com alerta de jejum na véspera e área para upload de laudos digitalizados.',
    clinicalImpact: 'Adesão de 95% do paciente à realização dos exames prescritos na consulta.',
    isActive: true
  },
  {
    id: 'feat-10',
    number: 10,
    title: 'Central de Digitação & Comparativo Evolutivo de Resultados',
    category: 'Acompanhamento Clínico',
    description: 'Área interativa para registrar os resultados recebidos, comparar valores com consultas anteriores e gerar diagnósticos automáticos.',
    clinicalImpact: 'Visualização gráfica da evolução dos biomarcadores do paciente consulta a consulta.',
    isActive: true
  }
];

export const getExamFeatureStatus = (featureId: string): boolean => {
  const stored = localStorage.getItem(`nutri_saas_exam_feat_${featureId}`);
  if (stored !== null) return stored === 'true';
  const allMaster = localStorage.getItem('nutri_saas_all_master_features_unlocked');
  if (allMaster === 'true') return true;
  return true; // Default all active
};

export const setExamFeatureStatus = (featureId: string, active: boolean) => {
  localStorage.setItem(`nutri_saas_exam_feat_${featureId}`, String(active));
};

export const activateAllExamFeatures = () => {
  EXAM_REQUISITION_MASTER_FEATURES.forEach(f => {
    localStorage.setItem(`nutri_saas_exam_feat_${f.id}`, 'true');
  });
};

