import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ClinicalSoapTemplate, CLINICAL_SOAP_TEMPLATES } from '../data/clinicalTemplatesData';
import { ClinicalRiskAlert, DEFAULT_PATIENT_CLINICAL_ALERTS } from '../data/clinicalAlertsData';

export interface ClinicalPatientFocus {
  id: string;
  name: string;
  age: number;
  gender: 'Feminino' | 'Masculino';
  objective: string;
  councilInfo: string;
  allergies: string[];
  clinicalAlerts?: ClinicalRiskAlert[];
  lastWeight: number;
  targetWeight: number;
  phone: string;
}

export interface ClinicalSnippet {
  id: string;
  category: 'Subjetivo (Anamnese)' | 'Avaliação (Diagnóstico)' | 'Plano & Conduta' | 'Gastrointestinal';
  title: string;
  text: string;
  shortcutHint?: string;
}

export const DEFAULT_CLINICAL_SNIPPETS: ClinicalSnippet[] = [
  {
    id: 'snip-1',
    category: 'Subjetivo (Anamnese)',
    title: 'Boa adesão e saciedade estável',
    text: 'Paciente refere excelente adesão ao fracionamento dietético prescrito, sem episódios de compulsão alimentar ou fome noturna. Nível de energia constante ao longo do dia.',
    shortcutHint: 'Alt+1'
  },
  {
    id: 'snip-2',
    category: 'Subjetivo (Anamnese)',
    title: 'Distensão pós-prandial & intolerância',
    text: 'Relata sensação de plenitude gástrica, estufamento e distensão abdominal após as principais refeições, com piora ao ingerir carboidratos fermentáveis (FODMAPs).',
    shortcutHint: 'Alt+2'
  },
  {
    id: 'snip-3',
    category: 'Subjetivo (Anamnese)',
    title: 'Sono não reparador & estresse',
    text: 'Refere sono fragmentado com despertares noturnos (entre 02h e 04h) e sensação de cansaço matinal. Nível de estresse ocupacional moderado a elevado.',
    shortcutHint: 'Alt+3'
  },
  {
    id: 'snip-4',
    category: 'Avaliação (Diagnóstico)',
    title: 'Recomposição corporal favorável',
    text: 'Evolução clínica positiva com redução expressiva da adiposidade subcutânea (dobras tricipital e suprailíaca) e preservação de massa livre de gordura.',
    shortcutHint: 'Alt+4'
  },
  {
    id: 'snip-5',
    category: 'Avaliação (Diagnóstico)',
    title: 'Disbiose & Trânsito intestinal lento',
    text: 'Quadro clínico sugestivo de disbiose intestinal funcional com tempo de trânsito lentificado (Bristol Tipo 2) e escore de toxicidade metabólica moderado no MSQ.',
    shortcutHint: 'Alt+5'
  },
  {
    id: 'snip-6',
    category: 'Plano & Conduta',
    title: 'Conduta normocalórica hiperproteica',
    text: 'Prescrito plano alimentar normocalórico com aporte proteico de 1.8g/kg/dia, ênfase em alimentos in natura, fibras solúveis e hidratação mínima de 35ml/kg.',
    shortcutHint: 'Alt+6'
  },
  {
    id: 'snip-7',
    category: 'Plano & Conduta',
    title: 'Modulação mitocondrial & sono',
    text: 'Iniciada suplementação com Magnésio Quelato/Inositol (300mg à noite) + Coenzima Q10 (100mg com café da manhã) para suporte à função mitocondrial e higiene do sono.',
    shortcutHint: 'Alt+7'
  },
  {
    id: 'snip-8',
    category: 'Gastrointestinal',
    title: 'Protocolo de recuperação de barreira intestinal',
    text: 'Orientada fase inicial de 30 dias com L-Glutamina 5g em jejum, chá de espinheira-santa pré-prandial e exclusão temporária de ultraprocessados.',
    shortcutHint: 'Alt+8'
  }
];

export interface SoapFullData {
  s: string; // Subjetivo
  o: {
    weight: number;
    height: number;
    bmi: number;
    bloodPressure: string;
    waist: number;
    abdomen: number;
    hip: number;
    rcq: number;
    bodyFatPercent: number;
    muscleMass: number;
    skinfoldTriceps: number;
    skinfoldSubscapular: number;
    skinfoldSuprailiac: number;
    skinfoldAbdominal: number;
    notes: string;
  };
  a: {
    diagnosis: string;
    bristolType: number;
    msqScore: number;
    digestiveSymptoms: string[];
    clinicalNotes: string;
  };
  p: {
    caloriesTarget: number;
    proteinGrams: number;
    carbsGrams: number;
    fatGrams: number;
    smartGoals: string[];
    supplements: Array<{
      name: string;
      dosage: string;
      timing: string;
      route: string;
    }>;
    followupDays: number;
    dietaryGuidelines: string;
  };
  r24h: Array<{
    meal: string;
    time: string;
    items: string;
  }>;
}

const DEFAULT_PATIENT: ClinicalPatientFocus = {
  id: 'pat-camila',
  name: 'Camila Mendonça Ferreira',
  age: 32,
  gender: 'Feminino',
  objective: 'Emagrecimento com preservação de massa magra & Modulação de compulsão',
  councilInfo: 'Atendimento Clínico Nutricional Presencial',
  allergies: ['Sensibilidade à Lactose', 'Sensibilidade Moderada a Glúten'],
  clinicalAlerts: DEFAULT_PATIENT_CLINICAL_ALERTS,
  lastWeight: 69.8,
  targetWeight: 63.0,
  phone: '(11) 98765-4321'
};

const INITIAL_SOAP: SoapFullData = {
  s: 'Paciente refere excelente adesão ao fracionamento das 4 refeições diárias. Relata diminuição significativa na vontade de doces no final da tarde após introdução de ceia rica em triptofano. Nível de energia constante ao longo do dia. Sono com média de 7h/noite.',
  o: {
    weight: 69.8,
    height: 1.68,
    bmi: 24.7,
    bloodPressure: '118/76 mmHg',
    waist: 72,
    abdomen: 79,
    hip: 98,
    rcq: 0.73,
    bodyFatPercent: 24.8,
    muscleMass: 27.4,
    skinfoldTriceps: 14,
    skinfoldSubscapular: 16,
    skinfoldSuprailiac: 13,
    skinfoldAbdominal: 18,
    notes: 'Avaliação física realizada com Adipômetro Cescorf e Fita Antropométrica (Normas ISAK).'
  },
  a: {
    diagnosis: 'Eutrofia com recomposição corporal favorável. Redução de 1.4kg de tecido adiposo desde a última avaliação e aumento de massa magra. Padrão evacuatório fisiológico.',
    bristolType: 4,
    msqScore: 16,
    digestiveSymptoms: ['Sem refluxo', 'Evacuação diária sem esforço', 'Sem distensão gástrica'],
    clinicalNotes: 'Paciente motivada, sem queixas adversas. HOMA-IR recente em 1.5.'
  },
  p: {
    caloriesTarget: 1850,
    proteinGrams: 125,
    carbsGrams: 190,
    fatGrams: 55,
    smartGoals: [
      'Manter ingestão hídrica de 2.800 mL/dia distribuída ao longo da rotina',
      'Consumir 1 porção de proteína em todas as 4 refeições principais',
      'Treino de força resistido (musculação) 4x na semana com progressão de cargas'
    ],
    supplements: [
      {
        name: 'Creatina Monohidratada 100% Creapure®',
        dosage: '5g ao dia',
        timing: 'Pós-treino ou junto com o almoço',
        route: 'Via Oral (diluído em água)'
      },
      {
        name: 'Magnésio Inositol Quelato',
        dosage: '300mg + 2000mg',
        timing: '30 a 45 min antes de dormir',
        route: 'Via Oral (em água morna)'
      },
      {
        name: 'Ômega 3 TG 1000mg (Alta Concentração EPA/DHA)',
        dosage: '2 cápsulas ao dia',
        timing: 'Junto ao almoço ou jantar',
        route: 'Via Oral'
      }
    ],
    followupDays: 30,
    dietaryGuidelines: 'Focar no aumento de fibras prebióticas (aveia, semente de chia, biomassa de banana verde). Evitar refrigerantes e frituras em imersão.'
  },
  r24h: [
    { meal: 'Café da Manhã', time: '07:30', items: '2 ovos mexidos + 1 fatia pão artesanal s/ glúten + 1 fruta (mamão) com chia + Café puro' },
    { meal: 'Almoço', time: '12:30', items: '120g peito de frango grelhado + 100g arroz integral + 1 concha feijão + Salada verde crua à vontade com azeite' },
    { meal: 'Lanche da Tarde', time: '16:30', items: '1 dose de Whey Protein Isolado batido com 150ml leite vegetal e 1 banana + 15g castanhas' },
    { meal: 'Jantar', time: '20:00', items: 'Omelete de 2 ovos com espinafre e tomate + 80g batata doce assada + Chá de camomila' }
  ]
};

interface ClinicalFocusContextType {
  isClinicalFocusActive: boolean;
  activePatient: ClinicalPatientFocus;
  activeSection: 'S' | 'O' | 'A' | 'P' | 'R24' | 'SUP' | 'METAS';
  soapData: SoapFullData;
  consultationTimer: { seconds: number; isRunning: boolean };
  targetDurationMinutes: number;
  setTargetDurationMinutes: (minutes: number) => void;
  addTimerSeconds: (secondsToAdd: number) => void;
  saveStatus: 'saved' | 'saving' | 'unsaved';
  lastSavedTime: string;
  isShortcutsModalOpen: boolean;
  isSnippetsModalOpen: boolean;
  isBristolModalOpen: boolean;
  isTemplatesModalOpen: boolean;
  isAlertsModalOpen: boolean;
  clinicalAlerts: ClinicalRiskAlert[];
  activeAlertsCount: number;
  hasCriticalAlert: boolean;
  enableClinicalFocus: (patient?: Partial<ClinicalPatientFocus>) => void;
  disableClinicalFocus: () => void;
  toggleClinicalFocus: (patient?: Partial<ClinicalPatientFocus>) => void;
  setActiveSection: (sec: 'S' | 'O' | 'A' | 'P' | 'R24' | 'SUP' | 'METAS') => void;
  setSoapData: React.Dispatch<React.SetStateAction<SoapFullData>>;
  updateSoapSection: <K extends keyof SoapFullData>(section: K, value: SoapFullData[K]) => void;
  updateObjectiveField: <K extends keyof SoapFullData['o']>(field: K, value: SoapFullData['o'][K]) => void;
  updateAssessmentField: <K extends keyof SoapFullData['a']>(field: K, value: SoapFullData['a'][K]) => void;
  updatePlanField: <K extends keyof SoapFullData['p']>(field: K, value: SoapFullData['p'][K]) => void;
  insertSnippet: (snippetText: string, targetSection?: 'S' | 'A' | 'P') => void;
  applySoapTemplate: (
    template: ClinicalSoapTemplate,
    mode?: 'replace' | 'merge' | 'section',
    targetSection?: 'S' | 'O' | 'A' | 'P' | 'R24'
  ) => void;
  addClinicalAlert: (alert: Omit<ClinicalRiskAlert, 'id' | 'dateAdded'>) => void;
  removeClinicalAlert: (id: string) => void;
  toggleClinicalAlert: (id: string) => void;
  toggleTimer: () => void;
  resetTimer: () => void;
  triggerInstantSave: () => void;
  setShortcutsModalOpen: (open: boolean) => void;
  setSnippetsModalOpen: (open: boolean) => void;
  setBristolModalOpen: (open: boolean) => void;
  setTemplatesModalOpen: (open: boolean) => void;
  setAlertsModalOpen: (open: boolean) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const ClinicalFocusContext = createContext<ClinicalFocusContextType | undefined>(undefined);

export const ClinicalFocusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isClinicalFocusActive, setIsClinicalFocusActive] = useState<boolean>(() => {
    return localStorage.getItem('nutri_clinical_focus_active') === 'true';
  });

  const [activePatient, setActivePatient] = useState<ClinicalPatientFocus>(DEFAULT_PATIENT);
  const [activeSection, setActiveSection] = useState<'S' | 'O' | 'A' | 'P' | 'R24' | 'SUP' | 'METAS'>('S');
  const [soapData, setSoapData] = useState<SoapFullData>(() => {
    const saved = localStorage.getItem('nutri_clinical_focus_soap');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_SOAP;
      }
    }
    return INITIAL_SOAP;
  });

  const [consultationTimer, setConsultationTimer] = useState<{ seconds: number; isRunning: boolean }>({
    seconds: 1450, // ~24 min default
    isRunning: true
  });
  const [targetDurationMinutes, setTargetDurationMinutesState] = useState<number>(() => {
    const saved = localStorage.getItem('nutri_consultation_target_mins');
    return saved ? Number(saved) : 50;
  });

  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [lastSavedTime, setLastSavedTime] = useState<string>('Recém salvo');
  const [isShortcutsModalOpen, setShortcutsModalOpen] = useState(false);
  const [isSnippetsModalOpen, setSnippetsModalOpen] = useState(false);
  const [isBristolModalOpen, setBristolModalOpen] = useState(false);
  const [isTemplatesModalOpen, setTemplatesModalOpen] = useState(false);
  const [isAlertsModalOpen, setAlertsModalOpen] = useState(false);
  const [clinicalAlerts, setClinicalAlerts] = useState<ClinicalRiskAlert[]>(() => {
    const saved = localStorage.getItem('nutri_patient_clinical_alerts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_PATIENT_CLINICAL_ALERTS;
      }
    }
    return DEFAULT_PATIENT_CLINICAL_ALERTS;
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeAlertsCount = clinicalAlerts.filter(a => a.active).length;
  const hasCriticalAlert = clinicalAlerts.some(a => a.active && a.severity === 'critico');

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  }, []);

  const addClinicalAlert = useCallback((newAlert: Omit<ClinicalRiskAlert, 'id' | 'dateAdded'>) => {
    const alert: ClinicalRiskAlert = {
      ...newAlert,
      id: `alert-${Date.now()}`,
      dateAdded: new Date().toISOString().split('T')[0]
    };
    setClinicalAlerts(prev => {
      const updated = [alert, ...prev];
      localStorage.setItem('nutri_patient_clinical_alerts', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeClinicalAlert = useCallback((id: string) => {
    setClinicalAlerts(prev => {
      const updated = prev.filter(a => a.id !== id);
      localStorage.setItem('nutri_patient_clinical_alerts', JSON.stringify(updated));
      return updated;
    });
    showToast('Alerta clínico removido.');
  }, [showToast]);

  const toggleClinicalAlert = useCallback((id: string) => {
    setClinicalAlerts(prev => {
      const updated = prev.map(a => (a.id === id ? { ...a, active: !a.active } : a));
      localStorage.setItem('nutri_patient_clinical_alerts', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const setTargetDurationMinutes = useCallback((mins: number) => {
    setTargetDurationMinutesState(mins);
    localStorage.setItem('nutri_consultation_target_mins', String(mins));
    showToast(`Tempo alvo de consulta ajustado para ${mins} minutos.`);
  }, [showToast]);

  const addTimerSeconds = useCallback((secondsToAdd: number) => {
    setConsultationTimer(prev => ({
      ...prev,
      seconds: Math.max(0, prev.seconds + secondsToAdd)
    }));
    const mins = Math.round(secondsToAdd / 60);
    showToast(mins > 0 ? `+${mins} min adicionados ao cronômetro` : `${mins} min ajustados no cronômetro`);
  }, [showToast]);

  // Timer interval
  useEffect(() => {
    let interval: any = null;
    if (isClinicalFocusActive && consultationTimer.isRunning) {
      interval = setInterval(() => {
        setConsultationTimer(prev => ({ ...prev, seconds: prev.seconds + 1 }));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isClinicalFocusActive, consultationTimer.isRunning]);

  const enableClinicalFocus = useCallback((patient?: Partial<ClinicalPatientFocus>) => {
    if (patient) {
      setActivePatient(prev => ({ ...prev, ...patient }));
    }
    setIsClinicalFocusActive(true);
    localStorage.setItem('nutri_clinical_focus_active', 'true');
    setConsultationTimer(prev => ({ ...prev, isRunning: true }));
    showToast('Modo Foco Clínico Presencial Ativado. Pressione [Esc] para sair ou [Alt+K] para ver atalhos.');
  }, [showToast]);

  const disableClinicalFocus = useCallback(() => {
    setIsClinicalFocusActive(false);
    localStorage.setItem('nutri_clinical_focus_active', 'false');
    showToast('Retornando para a interface padrão do SaaS.');
  }, [showToast]);

  const toggleClinicalFocus = useCallback((patient?: Partial<ClinicalPatientFocus>) => {
    if (isClinicalFocusActive) {
      disableClinicalFocus();
    } else {
      enableClinicalFocus(patient);
    }
  }, [isClinicalFocusActive, disableClinicalFocus, enableClinicalFocus]);

  const toggleTimer = useCallback(() => {
    setConsultationTimer(prev => {
      const next = !prev.isRunning;
      showToast(next ? 'Cronômetro da consulta iniciado' : 'Cronômetro pausado');
      return { ...prev, isRunning: next };
    });
  }, [showToast]);

  const resetTimer = useCallback(() => {
    setConsultationTimer({ seconds: 0, isRunning: true });
    showToast('Cronômetro reiniciado.');
  }, [showToast]);

  const triggerInstantSave = useCallback(() => {
    setSaveStatus('saving');
    setTimeout(() => {
      localStorage.setItem('nutri_clinical_focus_soap', JSON.stringify(soapData));
      const now = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      setLastSavedTime(now);
      setSaveStatus('saved');
      showToast(`Prontuário salvo com sucesso às ${now} [Ctrl+S]`);
    }, 250);
  }, [soapData, showToast]);

  const updateSoapSection = useCallback(<K extends keyof SoapFullData>(section: K, value: SoapFullData[K]) => {
    setSoapData(prev => ({ ...prev, [section]: value }));
    setSaveStatus('unsaved');
  }, []);

  const updateObjectiveField = useCallback(<K extends keyof SoapFullData['o']>(field: K, value: SoapFullData['o'][K]) => {
    setSoapData(prev => {
      const updatedO = { ...prev.o, [field]: value };
      // Recalcular IMC automaticamente se peso ou altura mudarem
      if ((field === 'weight' || field === 'height') && updatedO.height > 0) {
        updatedO.bmi = Number((updatedO.weight / (updatedO.height * updatedO.height)).toFixed(1));
      }
      // Recalcular RCQ automaticamente se cintura e quadril mudarem
      if ((field === 'waist' || field === 'hip') && updatedO.hip > 0) {
        updatedO.rcq = Number((updatedO.waist / updatedO.hip).toFixed(2));
      }
      return {
        ...prev,
        o: updatedO
      };
    });
    setSaveStatus('unsaved');
  }, []);

  const updateAssessmentField = useCallback(<K extends keyof SoapFullData['a']>(field: K, value: SoapFullData['a'][K]) => {
    setSoapData(prev => ({
      ...prev,
      a: { ...prev.a, [field]: value }
    }));
    setSaveStatus('unsaved');
  }, []);

  const updatePlanField = useCallback(<K extends keyof SoapFullData['p']>(field: K, value: SoapFullData['p'][K]) => {
    setSoapData(prev => ({
      ...prev,
      p: { ...prev.p, [field]: value }
    }));
    setSaveStatus('unsaved');
  }, []);

  const insertSnippet = useCallback((snippetText: string, targetSection?: 'S' | 'A' | 'P') => {
    const sec = targetSection || (activeSection === 'O' ? 'A' : activeSection === 'P' ? 'P' : 'S');
    if (sec === 'S') {
      setSoapData(prev => ({
        ...prev,
        s: prev.s ? `${prev.s}\n${snippetText}` : snippetText
      }));
    } else if (sec === 'A') {
      setSoapData(prev => ({
        ...prev,
        a: {
          ...prev.a,
          diagnosis: prev.a.diagnosis ? `${prev.a.diagnosis}\n${snippetText}` : snippetText
        }
      }));
    } else if (sec === 'P') {
      setSoapData(prev => ({
        ...prev,
        p: {
          ...prev.p,
          dietaryGuidelines: prev.p.dietaryGuidelines ? `${prev.p.dietaryGuidelines}\n${snippetText}` : snippetText
        }
      }));
    }
    setSaveStatus('unsaved');
    showToast('Texto rápido inserido com sucesso!');
  }, [activeSection, showToast]);

  const applySoapTemplate = useCallback((
    template: ClinicalSoapTemplate,
    mode: 'replace' | 'merge' | 'section' = 'replace',
    targetSection?: 'S' | 'O' | 'A' | 'P' | 'R24'
  ) => {
    if (mode === 'replace') {
      // Substituição completa com cópia profunda
      setSoapData(JSON.parse(JSON.stringify(template.soap)));
      setActivePatient(prev => ({
        ...prev,
        objective: template.targetObjective || prev.objective
      }));
      setSaveStatus('unsaved');
      showToast(`Template "${template.name}" carregado com sucesso!`);
    } else if (mode === 'section' && targetSection) {
      // Aplica apenas na seção específica
      if (targetSection === 'S') {
        setSoapData(prev => ({ ...prev, s: template.soap.s }));
        showToast(`Seção Subjetivo (S) atualizada com o template "${template.name}".`);
      } else if (targetSection === 'O') {
        setSoapData(prev => ({ ...prev, o: JSON.parse(JSON.stringify(template.soap.o)) }));
        showToast(`Seção Objetivo (O) atualizada com o template "${template.name}".`);
      } else if (targetSection === 'A') {
        setSoapData(prev => ({ ...prev, a: JSON.parse(JSON.stringify(template.soap.a)) }));
        showToast(`Seção Avaliação (A) atualizada com o template "${template.name}".`);
      } else if (targetSection === 'P') {
        setSoapData(prev => ({ ...prev, p: JSON.parse(JSON.stringify(template.soap.p)) }));
        showToast(`Seção Plano (P) atualizada com o template "${template.name}".`);
      } else if (targetSection === 'R24') {
        setSoapData(prev => ({ ...prev, r24h: JSON.parse(JSON.stringify(template.soap.r24h)) }));
        showToast(`Recordatório 24h atualizado com o template "${template.name}".`);
      }
      setSaveStatus('unsaved');
    } else if (mode === 'merge') {
      // Mesclagem Inteligente: preserva anotações existentes e preenche o restante
      setSoapData(prev => {
        const merged: SoapFullData = {
          s: prev.s.trim() ? `${prev.s}\n\n[TEMPLATE: ${template.name}]\n${template.soap.s}` : template.soap.s,
          o: {
            ...template.soap.o,
            // Mantém valores antropométricos já preenchidos se não forem 0
            weight: prev.o.weight > 0 ? prev.o.weight : template.soap.o.weight,
            height: prev.o.height > 0 ? prev.o.height : template.soap.o.height,
            bmi: prev.o.bmi > 0 ? prev.o.bmi : template.soap.o.bmi,
            bloodPressure: prev.o.bloodPressure || template.soap.o.bloodPressure,
            waist: prev.o.waist > 0 ? prev.o.waist : template.soap.o.waist,
            abdomen: prev.o.abdomen > 0 ? prev.o.abdomen : template.soap.o.abdomen,
            hip: prev.o.hip > 0 ? prev.o.hip : template.soap.o.hip,
            rcq: prev.o.rcq > 0 ? prev.o.rcq : template.soap.o.rcq,
            bodyFatPercent: prev.o.bodyFatPercent > 0 ? prev.o.bodyFatPercent : template.soap.o.bodyFatPercent,
            muscleMass: prev.o.muscleMass > 0 ? prev.o.muscleMass : template.soap.o.muscleMass,
            skinfoldTriceps: prev.o.skinfoldTriceps > 0 ? prev.o.skinfoldTriceps : template.soap.o.skinfoldTriceps,
            skinfoldSubscapular: prev.o.skinfoldSubscapular > 0 ? prev.o.skinfoldSubscapular : template.soap.o.skinfoldSubscapular,
            skinfoldSuprailiac: prev.o.skinfoldSuprailiac > 0 ? prev.o.skinfoldSuprailiac : template.soap.o.skinfoldSuprailiac,
            skinfoldAbdominal: prev.o.skinfoldAbdominal > 0 ? prev.o.skinfoldAbdominal : template.soap.o.skinfoldAbdominal,
            notes: prev.o.notes ? `${prev.o.notes}; ${template.soap.o.notes}` : template.soap.o.notes
          },
          a: {
            diagnosis: prev.a.diagnosis.trim() ? `${prev.a.diagnosis} | ${template.soap.a.diagnosis}` : template.soap.a.diagnosis,
            bristolType: prev.a.bristolType || template.soap.a.bristolType,
            msqScore: prev.a.msqScore || template.soap.a.msqScore,
            digestiveSymptoms: Array.from(new Set([...prev.a.digestiveSymptoms, ...template.soap.a.digestiveSymptoms])),
            clinicalNotes: prev.a.clinicalNotes ? `${prev.a.clinicalNotes}\n${template.soap.a.clinicalNotes}` : template.soap.a.clinicalNotes
          },
          p: {
            caloriesTarget: prev.p.caloriesTarget || template.soap.p.caloriesTarget,
            proteinGrams: prev.p.proteinGrams || template.soap.p.proteinGrams,
            carbsGrams: prev.p.carbsGrams || template.soap.p.carbsGrams,
            fatGrams: prev.p.fatGrams || template.soap.p.fatGrams,
            smartGoals: Array.from(new Set([...prev.p.smartGoals, ...template.soap.p.smartGoals])),
            supplements: [
              ...prev.p.supplements,
              ...template.soap.p.supplements.filter(ts => !prev.p.supplements.some(ps => ps.name.toLowerCase() === ts.name.toLowerCase()))
            ],
            followupDays: prev.p.followupDays || template.soap.p.followupDays,
            dietaryGuidelines: prev.p.dietaryGuidelines ? `${prev.p.dietaryGuidelines}\n\n${template.soap.p.dietaryGuidelines}` : template.soap.p.dietaryGuidelines
          },
          r24h: prev.r24h.length > 0 ? prev.r24h : template.soap.r24h
        };
        return merged;
      });
      setSaveStatus('unsaved');
      showToast(`Template "${template.name}" mesclado com sucesso!`);
    }
  }, [showToast]);

  // Global Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore when inside input/textarea for normal typing, UNLESS modifier key (Alt or Ctrl/Cmd) is pressed
      const isInput = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement;

      // 1. Toggle Focus Mode with Alt+F
      if (e.altKey && (e.key === 'f' || e.key === 'F')) {
        e.preventDefault();
        toggleClinicalFocus();
        return;
      }

      // If clinical focus is not active, don't trap other shortcuts
      if (!isClinicalFocusActive) return;

      // 2. Escape: Close Modals or exit focus
      if (e.key === 'Escape') {
        if (isShortcutsModalOpen) {
          setShortcutsModalOpen(false);
          return;
        }
        if (isSnippetsModalOpen) {
          setSnippetsModalOpen(false);
          return;
        }
        if (isBristolModalOpen) {
          setBristolModalOpen(false);
          return;
        }
        if (isTemplatesModalOpen) {
          setTemplatesModalOpen(false);
          return;
        }
        if (isAlertsModalOpen) {
          setAlertsModalOpen(false);
          return;
        }
        disableClinicalFocus();
        return;
      }

      // 3. Save: Ctrl+S or Cmd+S
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        triggerInstantSave();
        return;
      }

      // 4. Section Navigation: Alt+S (Subjetivo), Alt+O (Objetivo), Alt+A (Avaliação), Alt+P (Plano)
      if (e.altKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        setActiveSection('S');
        showToast('Navegado para: Subjetivo (S)');
        return;
      }
      if (e.altKey && (e.key === 'o' || e.key === 'O')) {
        e.preventDefault();
        setActiveSection('O');
        showToast('Navegado para: Objetivo (O) - Antropometria');
        return;
      }
      if (e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setActiveSection('A');
        showToast('Navegado para: Avaliação (A) - Diagnóstico & Bristol');
        return;
      }
      if (e.altKey && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        setActiveSection('P');
        showToast('Navegado para: Plano & Conduta (P) - Metas');
        return;
      }

      // 5. Alt+R: Recordatório 24h
      if (e.altKey && (e.key === 'r' || e.key === 'R')) {
        e.preventDefault();
        setActiveSection('R24');
        showToast('Navegado para: Recordatório Alimentar 24h');
        return;
      }

      // 6. Alt+B: Escala de Bristol
      if (e.altKey && (e.key === 'b' || e.key === 'B')) {
        e.preventDefault();
        setBristolModalOpen(prev => !prev);
        return;
      }

      // 7. Alt+N: Textos Rápidos (Snippets)
      if (e.altKey && (e.key === 'n' || e.key === 'N')) {
        e.preventDefault();
        setSnippetsModalOpen(prev => !prev);
        return;
      }

      // 8. Alt+M: Templates / Modelos de Prontuário Clínico
      if (e.altKey && (e.key === 'm' || e.key === 'M')) {
        e.preventDefault();
        setTemplatesModalOpen(prev => !prev);
        return;
      }

      // 9. Alt+L or Alt+I: Alertas Clínicos & Riscos / Interações
      if (e.altKey && (e.key === 'l' || e.key === 'L' || e.key === 'i' || e.key === 'I')) {
        e.preventDefault();
        setAlertsModalOpen(prev => !prev);
        return;
      }

      // 10. Alt+T: Timer
      if (e.altKey && (e.key === 't' || e.key === 'T')) {
        e.preventDefault();
        toggleTimer();
        return;
      }

      // 11. Alt+K or ?: Ajuda de Atalhos
      if (e.altKey && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setShortcutsModalOpen(prev => !prev);
        return;
      }
      if (!isInput && e.key === '?') {
        e.preventDefault();
        setShortcutsModalOpen(prev => !prev);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    isClinicalFocusActive,
    isShortcutsModalOpen,
    isSnippetsModalOpen,
    isBristolModalOpen,
    isTemplatesModalOpen,
    isAlertsModalOpen,
    toggleClinicalFocus,
    disableClinicalFocus,
    triggerInstantSave,
    toggleTimer,
    showToast
  ]);

  return (
    <ClinicalFocusContext.Provider
      value={{
        isClinicalFocusActive,
        activePatient,
        activeSection,
        soapData,
        consultationTimer,
        targetDurationMinutes,
        setTargetDurationMinutes,
        addTimerSeconds,
        saveStatus,
        lastSavedTime,
        isShortcutsModalOpen,
        isSnippetsModalOpen,
        isBristolModalOpen,
        isTemplatesModalOpen,
        isAlertsModalOpen,
        clinicalAlerts,
        activeAlertsCount,
        hasCriticalAlert,
        enableClinicalFocus,
        disableClinicalFocus,
        toggleClinicalFocus,
        setActiveSection,
        setSoapData,
        updateSoapSection,
        updateObjectiveField,
        updateAssessmentField,
        updatePlanField,
        insertSnippet,
        applySoapTemplate,
        addClinicalAlert,
        removeClinicalAlert,
        toggleClinicalAlert,
        toggleTimer,
        resetTimer,
        triggerInstantSave,
        setShortcutsModalOpen,
        setSnippetsModalOpen,
        setBristolModalOpen,
        setTemplatesModalOpen,
        setAlertsModalOpen,
        toastMessage,
        showToast
      }}
    >
      {children}
    </ClinicalFocusContext.Provider>
  );
};

export const useClinicalFocus = (): ClinicalFocusContextType => {
  const context = useContext(ClinicalFocusContext);
  if (!context) {
    throw new Error('useClinicalFocus must be used within a ClinicalFocusProvider');
  }
  return context;
};
