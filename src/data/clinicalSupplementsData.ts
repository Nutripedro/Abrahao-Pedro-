// Fonte de Dados Única e Estruturada para Receituário de Suplementos Clínicos
// Contempla duas variantes explícitas de dose: 'nutricionista' (doses suplementares / fitoterápicas / RDC Anvisa)
// e 'medico' (doses terapêuticas / farmacológicas ampliadas / CFM).

export type PrescriberVariant = 'nutricionista' | 'medico';

export interface DoseVariantConfig {
  standardDose: string;
  maxDailyDose: string;
  unit: string;
  route: 'Oral' | 'Sublingual' | 'Tópica' | 'Intramuscular';
  frequency: string;
  recommendedSchedule: string;
  regulatoryScope: string;
}

export interface StructuredSupplement {
  id: string;
  name: string;
  commercialName?: string;
  chemicalForm: string; // Ex: Quelato bisglicinato, Monohidratada creapure, Metilcobalamina
  category: 'Desempenho & Músculo' | 'Metabolismo & Glicemia' | 'Imunidade & Vitaminas' | 'Sono & Eixo Neural' | 'Saúde Digestiva & Barreira' | 'Antioxidantes & Longevidade';
  indications: string[];
  contraindications: string[];
  interactions: string[];
  associatedPathologies: string[];
  doses: {
    nutricionista: DoseVariantConfig;
    medico: DoseVariantConfig;
  };
  clinicalNotes: string;
}

export const CLINICAL_SUPPLEMENTS_DATABASE: StructuredSupplement[] = [
  {
    id: 'creatina_monohidratada',
    name: 'Creatina Monohidratada (100% Pura)',
    chemicalForm: 'Monohidratada Micronizada (Padrão Creapure)',
    category: 'Desempenho & Músculo',
    indications: [
      'Aumento de força e potência muscular via ressíntese rápida de ATP-CP',
      'Hipertrofia muscular e retenção hídrica intracelular',
      'Neuroproteção cognitiva e redução da fadiga mental'
    ],
    contraindications: [
      'Insuficiência renal crônica pré-existente (sem acompanhamento nefrológico)'
    ],
    interactions: [
      'Potencializada com carboidratos de alto índice glicêmico ou proteínas insulotrópicas'
    ],
    associatedPathologies: [
      'Sarcopenia no idoso',
      'Distrofias musculares',
      'Fadiga pós-esforço',
      'Veganos/vegetarianos com baixa reserva muscular'
    ],
    doses: {
      nutricionista: {
        standardDose: '3 a 5g',
        maxDailyDose: '5g/dia (ou 0,07g/kg)',
        unit: 'g',
        route: 'Oral',
        frequency: '1x ao dia',
        recommendedSchedule: 'Todos os dias, preferencialmente pós-treino com refeição rica em carboidratos',
        regulatoryScope: 'Conforme IN 28/2018 ANVISA e Resoluções CFN para nutrição clínica/esportiva'
      },
      medico: {
        standardDose: '5g a 20g (Fase de Saturação: 0,3g/kg/dia por 5-7 dias)',
        maxDailyDose: '20g/dia (fracionado em 4 tomadas de 5g)',
        unit: 'g',
        route: 'Oral',
        frequency: '4x ao dia na saturação, depois 1x ao dia para manutenção',
        recommendedSchedule: 'Protocolo de saturação rápida hospitalar/clínica ou manutenção com monitoramento de TFG',
        regulatoryScope: 'Indicação clínica médica para doenças neuromusculares e sarcopenia severa'
      }
    },
    clinicalNotes: 'Uso contínuo e cumulativo; não necessita de ciclos de interrupção. Orientar ingestão hídrica de 35 a 45 mL/kg/dia.'
  },
  {
    id: 'vitamina_d3',
    name: 'Colecalciferol (Vitamina D3)',
    chemicalForm: 'Colecalciferol lipossolúvel em gotas (veículo MCT) ou cápsulas oleosas',
    category: 'Imunidade & Vitaminas',
    indications: [
      'Otimização do status sérico de 25(OH)D',
      'Homeostase do cálcio e remodelamento ósseo',
      'Modulação do sistema imune e proliferação de células T regulatórias',
      'Expressão de receptores nucleares de insulina (VDR)'
    ],
    contraindications: [
      'Hipercalcemia',
      'Hipervitaminose D',
      'Litíase renal calcária ativa'
    ],
    interactions: [
      'Melhor absorção com refeição contendo lipídios saudáveis; sinergia com Magnésio e Vitamina K2 (MK-7)'
    ],
    associatedPathologies: [
      'Osteopenia e Osteoporose',
      'Doenças autoimunes (Hashimoto, Psoríase)',
      'Resistência à insulina e Obesidade'
    ],
    doses: {
      nutricionista: {
        standardDose: '1.000 UI a 2.000 UI',
        maxDailyDose: '2.000 UI/dia (Limite seguro suplementar padrão ANVISA)',
        unit: 'UI',
        route: 'Oral',
        frequency: '1x ao dia',
        recommendedSchedule: 'Junto com a maior refeição gordurosa do dia (almoço ou jantar)',
        regulatoryScope: 'Faixa regulatória de suplemento alimentar da ANVISA (RDC 243/2018)'
      },
      medico: {
        standardDose: '5.000 UI a 50.000 UI',
        maxDailyDose: '50.000 UI/semana (Tratamento de insuficiência severa com 25(OH)D < 20 ng/mL)',
        unit: 'UI',
        route: 'Oral',
        frequency: '1x por semana por 8 semanas, ou 5.000 UI/dia em manutenção terapêutica',
        recommendedSchedule: 'Em jejum matinal ou refeição principal, monitorando cálcio sérico e calciúria',
        regulatoryScope: 'Dose medicamentosa/terapêutica sob prescrição médica (RDC Medicamentos)'
      }
    },
    clinicalNotes: 'A resposta individual varia conforme adiposidade (sequestro no tecido adiposo) e polimorfismos no VDR.'
  },
  {
    id: 'omega3_epa_dha',
    name: 'Ômega-3 Triglicerídeos (TG) Concentrado',
    chemicalForm: 'Forma Reesterificada (TG) com alta concentração de EPA e DHA (Livre de metais pesados - Selo IFOS)',
    category: 'Antioxidantes & Longevidade',
    indications: [
      'Redução de triglicerídeos séricos e suporte endotelial',
      'Anti-inflamatório celular (resolvinas e protectinas)',
      'Atenuação da dor muscular tardia (DOMS) pós-treino',
      'Plasticidade sináptica e suporte neurofuncional'
    ],
    contraindications: [
      'Distúrbios de coagulação graves sem acompanhamento',
      'Alergia a frutos do mar/peixes (avaliar fonte vegetal de algas)'
    ],
    interactions: [
      'Uso concomitante com anticoagulantes orais (varfarina, NOACs) requer acompanhamento de coagulograma'
    ],
    associatedPathologies: [
      'Hipertrigliceridemia',
      'Doença arterial coronariana',
      'Artrite e processos inflamatórios articulares',
      'Declínio cognitivo'
    ],
    doses: {
      nutricionista: {
        standardDose: '1.000mg a 2.000mg (sendo mín. 600mg EPA + 400mg DHA)',
        maxDailyDose: '3.000mg de EPA+DHA/dia',
        unit: 'mg',
        route: 'Oral',
        frequency: '1 a 2x ao dia',
        recommendedSchedule: 'Imediatamente antes ou durante as principais refeições para evitar refluxo',
        regulatoryScope: 'Conforme rotulagem nutricional de ácidos graxos essenciais da ANVISA'
      },
      medico: {
        standardDose: '2.000mg a 4.000mg (com ênfase em EPA puro para redução de eventos aterotrombóticos)',
        maxDailyDose: '4.000mg de EPA puro/dia (conforme protocolo REDUCE-IT)',
        unit: 'mg',
        route: 'Oral',
        frequency: '2x ao dia (2g pela manhã e 2g à noite)',
        recommendedSchedule: 'Com refeições principais, visando redução potente de triglicerídeos > 500 mg/dL',
        regulatoryScope: 'Indicação clínica de cardioproteção secundária e dislipidemia mista refratária'
      }
    },
    clinicalNotes: 'Preferir fórmulas com vitamina E adicionada como antioxidante lipídico para evitar peroxidação.'
  },
  {
    id: 'magnesio_bisglicinato',
    name: 'Magnésio Bisglicinato (Quelato)',
    chemicalForm: 'Magnésio 100% Quelado com 2 moléculas de Glicina (Alta biodisponibilidade, não laxativo)',
    category: 'Sono & Eixo Neural',
    indications: [
      'Relaxamento muscular e alívio de cãibras noturnas',
      'Melhora da arquitetura do sono e ativação de receptores GABAérgicos',
      'Cofator de enzimas glicolíticas e transporte de glicose celular',
      'Atenuação de sintomas de enxaqueca e tensão pré-menstrual'
    ],
    contraindications: [
      'Insuficiência renal grave (ClCr < 30 mL/min com risco de hipermagnesemia)'
    ],
    interactions: [
      'Espaçar de bifosfonatos e antibióticos da classe das fluoroquinolonas por 2 horas'
    ],
    associatedPathologies: [
      'Insônia e sono não-restaurador',
      'Ansiedade leve a moderada',
      'Espasmos e cãibras musculares',
      'Hipertensão arterial e síndrome metabólica'
    ],
    doses: {
      nutricionista: {
        standardDose: '200mg a 350mg de Magnésio Elementar',
        maxDailyDose: '350mg de Magnésio Elementar/dia',
        unit: 'mg',
        route: 'Oral',
        frequency: '1x ao dia (ou fracionado em 2 tomadas)',
        recommendedSchedule: '1 a 2 horas antes de dormir para potencializar a indução ao sono',
        regulatoryScope: 'Valores Diários de Referência e limites máximos da ANVISA para suplementos'
      },
      medico: {
        standardDose: '350mg a 600mg de Magnésio Elementar (ou associações com Inositol / Taurato)',
        maxDailyDose: '600mg de Magnésio Elementar/dia (monitorado em pacientes com função renal normal)',
        unit: 'mg',
        route: 'Oral',
        frequency: 'Fracionado 2 a 3 vezes ao dia',
        recommendedSchedule: 'Manhã e noite, com ênfase em controle de arritmias ventriculares benignas e enxaqueca crônica',
        regulatoryScope: 'Conduta clínica médica em quadros de hipomagnesemia refratária e estresse adrenérgico crônico'
      }
    },
    clinicalNotes: 'Apresenta excelente tolerabilidade gastrointestinal comparada ao óxido de magnésio.'
  },
  {
    id: 'coenzima_q10',
    name: 'Coenzima Q10 (Ubiquinona / Ubiquinol)',
    chemicalForm: 'Ubiquinona lipossolúvel ou Ubiquinol (Forma reduzida biologicamente ativa)',
    category: 'Antioxidantes & Longevidade',
    indications: [
      'Transporte de elétrons na cadeia respiratória mitocondrial (Complexos I, II e III)',
      'Bioenergética do miocárdio e músculo esquelético',
      'Neutralização de radicais livres lipídicos de membrana',
      'Mitigação de mialgias induzidas por uso contínuo de estatinas'
    ],
    contraindications: [
      'Hipersensibilidade à substância',
      'Uso de varfarina sem monitoramento frequente de RNI (pode antagonizar levemente)'
    ],
    interactions: [
      'Absorção multiplicada por 3 a 5x quando ingerida com lipídios da dieta (abacate, azeite de oliva, ovos)'
    ],
    associatedPathologies: [
      'Insuficiência cardíaca compensada',
      'Fadiga mitocondrial crônica',
      'Miometabolopatia por estatinas',
      'Resistência à insulina e envelhecimento celular precoce'
    ],
    doses: {
      nutricionista: {
        standardDose: '100mg a 200mg',
        maxDailyDose: '200mg/dia',
        unit: 'mg',
        route: 'Oral',
        frequency: '1x ao dia',
        recommendedSchedule: 'Pela manhã ou almoço, junto com refeição com gorduras boas',
        regulatoryScope: 'Anexo de constituintes autorizados da ANVISA para suplementos alimentares'
      },
      medico: {
        standardDose: '200mg a 400mg',
        maxDailyDose: '600mg/dia (em protocolos para miopatia ou suporte cardiológico severo)',
        unit: 'mg',
        route: 'Oral',
        frequency: 'Fracionado em 2 tomadas (100mg a 200mg almoço e jantar)',
        recommendedSchedule: 'Acompanhado de perfil lipídico e enzimas hepáticas/musculares (CK)',
        regulatoryScope: 'Protocolo médico coadjuvante em disfunção endotelial e miopatia'
      }
    },
    clinicalNotes: 'A síntese endógena de CoQ10 cai expressivamente a partir dos 35 anos e com inibidores da HMG-CoA redutase.'
  }
];
