/**
 * ClinicSaaS — Banco Estruturado de Alertas Clínicos, Alergias e Interações Medicamentosas
 * Conformidade com Diretrizes do CFN, Farmacovigilância ANVISA e Segurança do Paciente (LGPD).
 */

export type AlertSeverity = 'critico' | 'alto' | 'moderado';
export type AlertCategory = 'alergia' | 'interacao' | 'medicamento' | 'patologia' | 'conduta';

export interface ClinicalRiskAlert {
  id: string;
  type: AlertCategory;
  severity: AlertSeverity;
  title: string;
  substanceOrDrug: string;
  description: string;
  recommendation: string;
  contraindications?: string[];
  crossReactivity?: string[];
  dateAdded: string;
  active: boolean;
}

export const PRESET_CLINICAL_RISK_TEMPLATES: Omit<ClinicalRiskAlert, 'id' | 'dateAdded' | 'active'>[] = [
  {
    type: 'alergia',
    severity: 'critico',
    title: 'Alergia a Frutos do Mar & Crustáceos (Tropomiosina)',
    substanceOrDrug: 'Camarão, Lagosta, Caranguejo, Mariscos e Moluscos',
    description: 'Histórico de reação anafilactóide com edema de glote e urticária aguda severa.',
    recommendation: 'Exclusão estrita da dieta. Bloquear prescrição de Quitosana, Cartilagem de Tubarão, Colágeno Marinho e Ômega-3 derivado de Krill ou pescados não certificados.',
    contraindications: ['Quitosana', 'Cartilagem de Tubarão', 'Colágeno Hidrolisado Marinho', 'Óleo de Krill (Astaxantina marinha)'],
    crossReactivity: ['Ácaros da poeira (tropomiosina cruzada)', 'Baratas']
  },
  {
    type: 'interacao',
    severity: 'alto',
    title: 'Interação: Anticoagulante (Varfarina) × Vitamina K & Fitoterápicos',
    substanceOrDrug: 'Varfarina Sódica (Marevan / Coumadin)',
    description: 'Risco de alteração drástica do RNI/TP (tempo de protrombina) com risco de trombose ou hemorragia grave.',
    recommendation: 'Manter aporte estável e regular de Vitamina K (não suprimir nem hiperdosar vegetais verde-escuros). Contraindicado Ginkgo Biloba, Ginseng, Alho concentrado, Salgueiro Branco, Vitamina E >400UI e Ômega-3 em altas doses (>3g/dia).',
    contraindications: ['Ginkgo Biloba', 'Panax Ginseng', 'Óleo de Alho concentrado', 'Vitamina E alta dose (>400 UI)', 'Ômega-3 > 3000mg/dia'],
    crossReactivity: ['Aspirina / AAS', 'Clopidogrel']
  },
  {
    type: 'alergia',
    severity: 'alto',
    title: 'Alergia à Proteína do Leite de Vaca (APLV / Caseína & Beta-lactoglobulina)',
    substanceOrDrug: 'Leite bovino, Derivados lácteos e Proteínas do Soro',
    description: 'Reação imune mediada por IgE/mista gerando dermatite atópica, enterite e cólicas severas.',
    recommendation: 'Excluir alimentos contendo leite e derivados. Proibido Whey Protein (mesmo isolado/hidrolisado sem certificação livre de caseína), Caseinato e Lactoalbumina.',
    contraindications: ['Whey Protein Concentrado/Isolado', 'Caseína Micelar', 'Caseinato de Cálcio', 'Colostro Bovino'],
    crossReactivity: ['Leite de cabra e ovelha (alta reatividade cruzada >90%)']
  },
  {
    type: 'alergia',
    severity: 'alto',
    title: 'Doença Celíaca / Intolerância Imunomediada ao Glúten',
    substanceOrDrug: 'Gliadina / Glúten (Trigo, Centeio, Cevada, Malte)',
    description: 'Atrofia de vilosidades intestinais (Marsh III) e má absorção crônica de micronutrientes.',
    recommendation: 'Dieta estritamente isenta de glúten (Gluten-Free) com atenção redobrada à contaminação cruzada. Suplementos devem ter laudo expresso "NÃO CONTÉM GLÚTEN".',
    contraindications: ['Levedura de Cerveja', 'Aveia não certificada', 'Malte / Extrato de malte', 'Glutamina de fonte não especificada'],
    crossReactivity: ['Aveia com contaminação em moagem']
  },
  {
    type: 'interacao',
    severity: 'moderado',
    title: 'Interação: Levotiroxina (T4) × Minerais Quelatos & Fibras Solúveis',
    substanceOrDrug: 'Levotiroxina Sódica (Puran T4 / Synthroid / Euthyrox)',
    description: 'Formação de quelatos insolúveis no trato gastrointestinal, reduzindo a absorção hormonal em até 50%.',
    recommendation: 'A levotiroxina deve ser tomada rigorosamente em jejum, com água pura, 60 minutos antes do café da manhã. Suplementos de Cálcio, Ferro, Magnésio, Zinco e Psyllium devem ser espaçados no mínimo 4 horas após a tomada.',
    contraindications: ['Carbonato de Cálcio em jejum', 'Sulfato Ferroso matinal', 'Psyllium pré-café'],
    crossReactivity: ['Café com cafeína imediatamente após tomada']
  },
  {
    type: 'patologia',
    severity: 'critico',
    title: 'Insuficiência Renal Crônica (TFG < 45 mL/min/1.73m²)',
    substanceOrDrug: 'Sobrecarga Proteica, Fósforo Inorgânico & Potássio',
    description: 'Risco de hiperpotassemia arritmogênica, hiperfosfatemia e progressão da esclerose glomerular.',
    recommendation: 'Limitar aporte proteico para 0.6 a 0.8 g/kg/dia conforme estágio. Contraindicado uso de Creatina Monohidratada sem liberação do Nefrologista. Evitar aditivos de fosfato inorgânico.',
    contraindications: ['Creatina Monohidratada', 'Proteína > 1.2g/kg', 'Suplementos de Potássio', 'Fosfatos aditivados'],
    crossReactivity: ['AINEs (anti-inflamatórios)']
  },
  {
    type: 'interacao',
    severity: 'alto',
    title: 'Interação: Antidepressivos ISRS / Ansiolíticos × 5-HTP & Erva-de-São-João',
    substanceOrDrug: 'Fluoxetina, Sertralina, Escitalopram, Venlafaxina',
    description: 'Risco de Síndrome Serotoninérgica potencialmente fatal (hipertermia, mioclonias, instabilidade autonômica).',
    recommendation: 'Contraindicado uso simultâneo de 5-Hidroxitriptofano (5-HTP), L-Triptofano em altas doses (>1g) e Hypericum perforatum (Erva-de-São-João).',
    contraindications: ['5-HTP (5-Hidroxitriptofano)', 'Hypericum perforatum (Erva-de-São-João)', 'L-Triptofano > 500mg'],
    crossReactivity: ['Triptanos para enxaqueca', 'Tramadol']
  }
];

export const DEFAULT_PATIENT_CLINICAL_ALERTS: ClinicalRiskAlert[] = [
  {
    id: 'alert-1',
    type: 'alergia',
    severity: 'critico',
    title: 'Alergia a Frutos do Mar & Crustáceos (Tropomiosina)',
    substanceOrDrug: 'Camarão, Mariscos e Moluscos',
    description: 'Histórico de anafilaxia com edema de glote e urticária aguda severa.',
    recommendation: 'Exclusão estrita da dieta. Bloquear prescrição de Quitosana, Cartilagem de Tubarão e Ômega-3 derivado de Krill.',
    contraindications: ['Quitosana', 'Cartilagem de Tubarão', 'Colágeno Marinho', 'Óleo de Krill'],
    crossReactivity: ['Tropomiosina'],
    dateAdded: '2026-08-12',
    active: true
  },
  {
    id: 'alert-2',
    type: 'interacao',
    severity: 'alto',
    title: 'Interação: Anticoagulante (Varfarina) × Vitamina K & Fitoterápicos',
    substanceOrDrug: 'Varfarina Sódica (Marevan 5mg)',
    description: 'Risco de oscilação do RNI/TP com risco hemorrágico ou trombótico.',
    recommendation: 'Manter consumo estável de folhas verdes. Contraindicado Ginkgo Biloba, Ginseng, Óleo de Alho e Vitamina E >400UI.',
    contraindications: ['Ginkgo Biloba', 'Panax Ginseng', 'Vitamina E alta dose', 'Óleo de Alho concentrado'],
    dateAdded: '2026-08-20',
    active: true
  },
  {
    id: 'alert-3',
    type: 'alergia',
    severity: 'moderado',
    title: 'Sensibilidade à Lactose & FODMAPs (Distensão Gástrica)',
    substanceOrDrug: 'Lactose / Leite e Derivados / Alimentos ricos em FODMAPs',
    description: 'Desconforto abdominal, flatulência e cólicas após consumo de lácteos e cebola/alho concentrados.',
    recommendation: 'Utilizar Whey Protein 100% Isolado/Zero Lactose ou Proteína Vegetal. Prescrever Enzima Lactase (10.000 FCC) para ocasiões sociais.',
    contraindications: ['Whey Concentrado com lactose', 'Leite integral em pó'],
    dateAdded: '2026-09-01',
    active: true
  }
];

export const getSeverityBadgeStyle = (severity: AlertSeverity) => {
  switch (severity) {
    case 'critico':
      return {
        badgeClass: 'bg-rose-950/90 text-rose-300 border-rose-500/70',
        textClass: 'text-rose-400',
        label: 'Risco Crítico / Anafilaxia',
        dotClass: 'bg-rose-500'
      };
    case 'alto':
      return {
        badgeClass: 'bg-amber-950/90 text-amber-300 border-amber-500/70',
        textClass: 'text-amber-400',
        label: 'Risco Alto / Interação',
        dotClass: 'bg-amber-500'
      };
    case 'moderado':
      return {
        badgeClass: 'bg-yellow-950/90 text-yellow-300 border-yellow-500/70',
        textClass: 'text-yellow-400',
        label: 'Atenção / Sensibilidade',
        dotClass: 'bg-yellow-500'
      };
  }
};
