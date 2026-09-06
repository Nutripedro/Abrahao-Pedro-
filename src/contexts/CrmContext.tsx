import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CrmPatientLead,
  CrmAutomationRule,
  CrmCampaign,
  CrmFeaturesState,
  LeadPipelineStage
} from '../types/crm';

const DEFAULT_CRM_FEATURES: CrmFeaturesState = {
  whatsappAutoReminders: true,
  postConsultationNps: true,
  birthdayGreetings: true,
  anthropometryRecallAlerts: true,
  inactivePatientRecovery: true,
  leadPipelineKanban: true,
  ethicalCampaignBroadcast: true,
  weeklyHydrationCheckin: true,
  doctorPartnerReferrals: true,
  lgpdOptInOutControl: true,
};

const INITIAL_AUTOMATION_RULES: CrmAutomationRule[] = [
  {
    id: 'auto-1',
    title: 'Lembrete de Consulta & Preparo de Jejum (24h antes)',
    description: 'Envia mensagem automática com instruções para bioimpedância e preparo com 24 horas de antecedência.',
    category: 'agendamento',
    triggerEvent: '24 horas antes do horário marcado',
    channel: 'whatsapp',
    active: true,
    sentTotalCount: 384,
    openRatePercent: 98.4,
    conversionRatePercent: 94.2,
    templateMessage: 'Olá {nome_paciente}! Lembramos da sua consulta amanhã às {horario} com {nome_nutricionista}. Lembre-se: jejum de 2h para bioimpedância e evitar cafeína. Confirme respondendo 1 (Sim) ou 2 (Reagendar).'
  },
  {
    id: 'auto-2',
    title: 'Lembrete Imediato com Localização Waze/Maps (2h antes)',
    description: 'Envia lembrete de proximidade com link do endereço e vaga de estacionamento da unidade.',
    category: 'agendamento',
    triggerEvent: '2 horas antes da consulta',
    channel: 'whatsapp',
    active: true,
    sentTotalCount: 352,
    openRatePercent: 99.1,
    conversionRatePercent: 98.0,
    templateMessage: 'Olá {nome_paciente}! Sua consulta será em 2h na unidade {unidade}. Link do mapa e estacionamento: {link_mapa}. Estamos te aguardando!'
  },
  {
    id: 'auto-3',
    title: 'Pesquisa NPS & Avaliação de Experiência (24h pós)',
    description: 'Coleta nota de 0 a 10 e feedback da consulta para monitorar a qualidade do atendimento.',
    category: 'pos_consulta',
    triggerEvent: '24 horas após conclusão da consulta',
    channel: 'whatsapp',
    active: true,
    sentTotalCount: 290,
    openRatePercent: 88.5,
    conversionRatePercent: 76.2,
    templateMessage: 'Olá {nome_paciente}! Como foi sua experiência na consulta com {nome_nutricionista}? De 0 a 10, que nota você daria ao nosso atendimento?'
  },
  {
    id: 'auto-4',
    title: 'Felicitações de Aniversário com Mensagem Saudável',
    description: 'Mensagem carinhosa no dia do aniversário do paciente sem foco em promoções comerciais agressivas.',
    category: 'aniversario',
    triggerEvent: 'Às 09:00 no dia do aniversário',
    channel: 'whatsapp',
    active: true,
    sentTotalCount: 142,
    openRatePercent: 96.0,
    conversionRatePercent: 82.5,
    templateMessage: 'Parabéns pelo seu dia, {nome_paciente}! 🎂 Toda a equipe da clínica e {nome_nutricionista} desejam muita saúde, vitalidade e realizações!'
  },
  {
    id: 'auto-5',
    title: 'Alerta de Reavaliação Antropométrica (45 dias)',
    description: 'Convite para medir evolução física de dobras cutâneas e bioimpedância na janela ideal.',
    category: 'retencao',
    triggerEvent: '45 dias após última avaliação',
    channel: 'whatsapp',
    active: true,
    sentTotalCount: 215,
    openRatePercent: 91.2,
    conversionRatePercent: 68.4,
    templateMessage: 'Olá {nome_paciente}! Já faz 45 dias desde seu plano alimentar. É o momento perfeito para sua reavaliação antropométrica e ajuste de metas. Vamos agendar seu retorno?'
  },
  {
    id: 'auto-6',
    title: 'Recuperação de Pacientes Ausentes / Inativos (60+ dias)',
    description: 'Abordagem empática para pacientes que pausaram o acompanhamento e precisam de suporte.',
    category: 'retencao',
    triggerEvent: '60 dias sem consulta ou contato',
    channel: 'whatsapp',
    active: true,
    sentTotalCount: 178,
    openRatePercent: 84.0,
    conversionRatePercent: 46.8,
    templateMessage: 'Olá {nome_paciente}, {nome_nutricionista} aqui! Senti sua falta na clínica. Como estão seus hábitos e sua rotina alimentar? Gostaria de retomar seu acompanhamento?'
  },
  {
    id: 'auto-7',
    title: 'Check-in Semanal de Adesão & Hidratação (App)',
    description: 'Notificação push para incentivar o registro do diário alimentar e consumo hídrico de 35ml/kg.',
    category: 'engajamento',
    triggerEvent: 'Toda segunda-feira às 08:30',
    channel: 'push',
    active: true,
    sentTotalCount: 890,
    openRatePercent: 78.3,
    conversionRatePercent: 65.0,
    templateMessage: 'Bom dia {nome_paciente}! Nova semana começando. Registre suas refeições e acompanhe sua meta de água no aplicativo!'
  },
  {
    id: 'auto-8',
    title: 'Boas-Vindas & Instruções de Instalação do App',
    description: 'Envia link do PWA e dados de primeiro acesso assim que o plano alimentar é liberado.',
    category: 'pos_consulta',
    triggerEvent: 'Imediatamente após publicação do cardápio',
    channel: 'whatsapp',
    active: true,
    sentTotalCount: 310,
    openRatePercent: 99.4,
    conversionRatePercent: 92.1,
    templateMessage: 'Olá {nome_paciente}! Seu novo plano alimentar e receituário já estão prontos no seu aplicativo: {link_app}. Acesse com seu e-mail!'
  },
  {
    id: 'auto-9',
    title: 'Agradecimento & Relatório para Médico Parceiro',
    description: 'Envia confirmação e resumo de acolhimento ao médico ou preparador que indicou o paciente.',
    category: 'engajamento',
    triggerEvent: 'Após 1ª consulta de paciente indicado',
    channel: 'email',
    active: true,
    sentTotalCount: 84,
    openRatePercent: 92.0,
    conversionRatePercent: 88.0,
    templateMessage: 'Prezado(a) Dr(a). {nome_medico}, informamos que o(a) paciente {nome_paciente} foi atendido(a) na clínica. Obrigado pela confiança na conduta multidisciplinar!'
  },
  {
    id: 'auto-10',
    title: 'Aviso de Atualização de Exames Laboratoriais (180 dias)',
    description: 'Alerta sobre validade de exames de rotina (perfil lipídico, glicemia, vitamina D) após 6 meses.',
    category: 'retencao',
    triggerEvent: '180 dias após última requisição',
    channel: 'whatsapp',
    active: true,
    sentTotalCount: 126,
    openRatePercent: 87.1,
    conversionRatePercent: 54.3,
    templateMessage: 'Olá {nome_paciente}! Já se passaram 6 meses desde seus últimos exames de sangue. É recomendável atualizar seus marcadores na próxima consulta.'
  }
];

const INITIAL_LEADS: CrmPatientLead[] = [
  {
    id: 'lead-1',
    name: 'Camila Mendonça de Souza',
    phone: '(11) 98123-4567',
    email: 'camila.mendonca@gmail.com',
    source: 'instagram',
    stage: 'novo_lead',
    objective: 'Emagrecimento & Reeducação Alimentar',
    lastContactDate: 'Hoje, às 10:15',
    daysInactive: 0,
    assignedProfessional: 'Dra. Vanessa Rios',
    unit: 'Unidade 01 - Matriz Paulista',
    engagementScore: 92,
    notes: 'Viu o post sobre composição corporal e quer agendar avaliação com bioimpedância.',
    whatsappHistoryCount: 3
  },
  {
    id: 'lead-2',
    name: 'Thiago Bernardes Castro',
    phone: '(11) 97234-5678',
    email: 'thiago.castro@empresa.com.br',
    source: 'medico_parceiro',
    stage: 'consulta_agendada',
    objective: 'Hipertrofia & Nutrição Esportiva',
    lastContactDate: 'Ontem',
    daysInactive: 1,
    assignedProfessional: 'Dra. Vanessa Rios',
    unit: 'Unidade 01 - Matriz Paulista',
    engagementScore: 88,
    nextScheduledDate: 'Amanhã às 14:00',
    notes: 'Encaminhado pelo Dr. Carlos Mendes (Endocrinologista). Preparo de jejum enviado.',
    whatsappHistoryCount: 5
  },
  {
    id: 'lead-3',
    name: 'Beatriz Vasconcelos',
    phone: '(19) 98345-6789',
    email: 'beatriz.vasc@outlook.com',
    source: 'whatsapp',
    stage: 'plano_ativo',
    objective: 'Saúde da Mulher & Manejo de SOP',
    lastContactDate: 'Há 5 dias',
    daysInactive: 5,
    assignedProfessional: 'Dra. Mariana Takahashi',
    unit: 'Unidade 02 - Campinas Taquaral',
    engagementScore: 96,
    notes: 'Plano com foco em baixo índice glicêmico e suplementação de mio-inositol.',
    whatsappHistoryCount: 12
  },
  {
    id: 'lead-4',
    name: 'Rodrigo Paes de Almeida',
    phone: '(11) 99456-7890',
    email: 'rodrigo.paes@terra.com.br',
    source: 'indicacao_paciente',
    stage: 'reavaliacao_pendente',
    objective: 'Performance em Corrida de Rua',
    lastContactDate: 'Há 38 dias',
    daysInactive: 38,
    assignedProfessional: 'Prof. Lucas Alencar',
    unit: 'Unidade 03 - Moema Premium',
    engagementScore: 78,
    notes: 'Completou 45 dias de periodização. Necessário medir novas dobras cutâneas.',
    whatsappHistoryCount: 8
  },
  {
    id: 'lead-5',
    name: 'Juliana Fagundes Nogueira',
    phone: '(11) 98567-8901',
    email: 'ju.fagundes@uol.com.br',
    source: 'google',
    stage: 'inativo_recuperacao',
    objective: 'Controle de Colesterol & Esteatose',
    lastContactDate: 'Há 64 dias',
    daysInactive: 64,
    assignedProfessional: 'Dra. Vanessa Rios',
    unit: 'Unidade 01 - Matriz Paulista',
    engagementScore: 45,
    notes: 'Faltou à consulta de retorno em janeiro. Enviar mensagem de recuperação empática.',
    whatsappHistoryCount: 6
  },
  {
    id: 'lead-6',
    name: 'Marcelo Siqueira Pinto',
    phone: '(11) 97678-9012',
    email: 'marcelo.siqueira@adv.com.br',
    source: 'instagram',
    stage: 'manutencao',
    objective: 'Manutenção de Peso (-14kg atingidos)',
    lastContactDate: 'Há 12 dias',
    daysInactive: 12,
    assignedProfessional: 'Dra. Vanessa Rios',
    unit: 'Unidade 04 - Jardins Oscar Freire',
    engagementScore: 94,
    notes: 'Meta batida! Consultas trimestrais de manutenção preventiva.',
    whatsappHistoryCount: 18
  },
  {
    id: 'lead-7',
    name: 'Fernanda Leite Bueno',
    phone: '(11) 98789-0123',
    email: 'fernanda.bueno@globo.com',
    source: 'whatsapp',
    stage: 'novo_lead',
    objective: 'Adequação Nutricional Vegetariana',
    lastContactDate: 'Hoje, às 09:00',
    daysInactive: 0,
    assignedProfessional: 'Dra. Mariana Takahashi',
    unit: 'Unidade 01 - Matriz Paulista',
    engagementScore: 85,
    notes: 'Interesse em suplementação segura de B12 e proteínas vegetais.',
    whatsappHistoryCount: 2
  },
  {
    id: 'lead-8',
    name: 'Gabriel Arantes Moreira',
    phone: '(19) 97890-1234',
    email: 'gabriel.arantes@gmail.com',
    source: 'indicacao_paciente',
    stage: 'reavaliacao_pendente',
    objective: 'Ganho de Massa Muscular (Triatlo)',
    lastContactDate: 'Há 42 dias',
    daysInactive: 42,
    assignedProfessional: 'Prof. Lucas Alencar',
    unit: 'Unidade 02 - Campinas Taquaral',
    engagementScore: 82,
    notes: 'Disparar lembrete de reavaliação de 45 dias via WhatsApp.',
    whatsappHistoryCount: 9
  }
];

const INITIAL_CAMPAIGNS: CrmCampaign[] = [
  {
    id: 'camp-1',
    name: 'Campanha de Reavaliação Antropométrica de Primavera',
    targetAudience: 'Pacientes com plano ativo há mais de 45 dias sem consulta recente',
    status: 'ativa',
    channel: 'whatsapp',
    sentCount: 142,
    engagementPercent: 78.5,
    returnedPatientsCount: 38,
    startDate: '01/09/2026',
    ethicalComplianceNotice: 'Em conformidade com a Resolução CFN nº 599/2018 (Foco educativo e de saúde contínua, sem apelo comercial enganoso).'
  },
  {
    id: 'camp-2',
    name: 'Informativo: Guia de Hidratação & Alimentos da Estação',
    targetAudience: 'Todos os pacientes ativos no App',
    status: 'concluida',
    channel: 'email',
    sentCount: 385,
    engagementPercent: 64.2,
    returnedPatientsCount: 22,
    startDate: '15/08/2026',
    ethicalComplianceNotice: 'Conteúdo puramente informativo e educacional sobre valor nutricional e consumo hídrico.'
  },
  {
    id: 'camp-3',
    name: 'Recuperação Ativa de Inativos do 1º Semestre',
    targetAudience: 'Pacientes com mais de 60 dias sem contato',
    status: 'ativa',
    channel: 'whatsapp',
    sentCount: 96,
    engagementPercent: 52.0,
    returnedPatientsCount: 19,
    startDate: '28/08/2026',
    ethicalComplianceNotice: 'Abordagem humanizada respeitando a opção de descadastramento imediato (LGPD Art. 18).'
  }
];

interface CrmContextType {
  features: CrmFeaturesState;
  allCrmFeaturesActive: boolean;
  activateAllCrmFeatures: () => void;
  deactivateAllCrmFeatures: () => void;
  toggleFeature: (key: keyof CrmFeaturesState) => void;
  leads: CrmPatientLead[];
  moveLeadStage: (leadId: string, newStage: LeadPipelineStage) => void;
  addLead: (lead: Omit<CrmPatientLead, 'id'>) => void;
  updateLead: (lead: CrmPatientLead) => void;
  deleteLead: (leadId: string) => void;
  automationRules: CrmAutomationRule[];
  toggleAutomationRule: (ruleId: string) => void;
  updateAutomationRule: (rule: CrmAutomationRule) => void;
  campaigns: CrmCampaign[];
  sendSimulatedWhatsAppMessage: (leadPhone: string, message: string) => boolean;
  totalLeadsCount: number;
  activeAutomationsCount: number;
  npsScore: number;
  retentionRatePercent: number;
}

const CrmContext = createContext<CrmContextType | undefined>(undefined);

const STORAGE_FEATURES_KEY = 'nutri_saas_crm_features';
const STORAGE_LEADS_KEY = 'nutri_saas_crm_leads';
const STORAGE_RULES_KEY = 'nutri_saas_crm_rules';
const STORAGE_CAMPAIGNS_KEY = 'nutri_saas_crm_campaigns';

export const CrmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [features, setFeatures] = useState<CrmFeaturesState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_FEATURES_KEY);
      return saved ? { ...DEFAULT_CRM_FEATURES, ...JSON.parse(saved) } : DEFAULT_CRM_FEATURES;
    } catch {
      return DEFAULT_CRM_FEATURES;
    }
  });

  const [leads, setLeads] = useState<CrmPatientLead[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LEADS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_LEADS;
    } catch {
      return INITIAL_LEADS;
    }
  });

  const [automationRules, setAutomationRules] = useState<CrmAutomationRule[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_RULES_KEY);
      return saved ? JSON.parse(saved) : INITIAL_AUTOMATION_RULES;
    } catch {
      return INITIAL_AUTOMATION_RULES;
    }
  });

  const [campaigns, setCampaigns] = useState<CrmCampaign[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CAMPAIGNS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_CAMPAIGNS;
    } catch {
      return INITIAL_CAMPAIGNS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_FEATURES_KEY, JSON.stringify(features));
    } catch {
      // ignore
    }
  }, [features]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_LEADS_KEY, JSON.stringify(leads));
    } catch {
      // ignore
    }
  }, [leads]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_RULES_KEY, JSON.stringify(automationRules));
    } catch {
      // ignore
    }
  }, [automationRules]);

  const allCrmFeaturesActive = Object.values(features).every(Boolean);

  const activateAllCrmFeatures = () => {
    const allActive: CrmFeaturesState = {
      whatsappAutoReminders: true,
      postConsultationNps: true,
      birthdayGreetings: true,
      anthropometryRecallAlerts: true,
      inactivePatientRecovery: true,
      leadPipelineKanban: true,
      ethicalCampaignBroadcast: true,
      weeklyHydrationCheckin: true,
      doctorPartnerReferrals: true,
      lgpdOptInOutControl: true,
    };
    setFeatures(allActive);
    setAutomationRules(prev => prev.map(r => ({ ...r, active: true })));
  };

  const deactivateAllCrmFeatures = () => {
    const allInactive: CrmFeaturesState = {
      whatsappAutoReminders: false,
      postConsultationNps: false,
      birthdayGreetings: false,
      anthropometryRecallAlerts: false,
      inactivePatientRecovery: false,
      leadPipelineKanban: false,
      ethicalCampaignBroadcast: false,
      weeklyHydrationCheckin: false,
      doctorPartnerReferrals: false,
      lgpdOptInOutControl: false,
    };
    setFeatures(allInactive);
  };

  const toggleFeature = (key: keyof CrmFeaturesState) => {
    setFeatures(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const moveLeadStage = (leadId: string, newStage: LeadPipelineStage) => {
    setLeads(prev =>
      prev.map(lead =>
        lead.id === leadId
          ? {
              ...lead,
              stage: newStage,
              lastContactDate: 'Agora há pouco',
              daysInactive: newStage === 'inativo_recuperacao' ? Math.max(lead.daysInactive, 45) : 0
            }
          : lead
      )
    );
  };

  const addLead = (leadData: Omit<CrmPatientLead, 'id'>) => {
    const newLead: CrmPatientLead = {
      ...leadData,
      id: `lead-${Date.now()}`
    };
    setLeads(prev => [newLead, ...prev]);
  };

  const updateLead = (lead: CrmPatientLead) => {
    setLeads(prev => prev.map(l => (l.id === lead.id ? lead : l)));
  };

  const deleteLead = (leadId: string) => {
    setLeads(prev => prev.filter(l => l.id !== leadId));
  };

  const toggleAutomationRule = (ruleId: string) => {
    setAutomationRules(prev =>
      prev.map(r => (r.id === ruleId ? { ...r, active: !r.active } : r))
    );
  };

  const updateAutomationRule = (rule: CrmAutomationRule) => {
    setAutomationRules(prev => prev.map(r => (r.id === rule.id ? rule : r)));
  };

  const sendSimulatedWhatsAppMessage = (leadPhone: string, message: string): boolean => {
    setLeads(prev =>
      prev.map(lead => {
        if (lead.phone === leadPhone) {
          return {
            ...lead,
            lastContactDate: 'Hoje, às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            whatsappHistoryCount: lead.whatsappHistoryCount + 1,
            daysInactive: 0
          };
        }
        return lead;
      })
    );
    return true;
  };

  const activeAutomationsCount = automationRules.filter(r => r.active).length;
  const npsScore = 94; // NPS de Excelência
  const retentionRatePercent = 89.2;

  return (
    <CrmContext.Provider
      value={{
        features,
        allCrmFeaturesActive,
        activateAllCrmFeatures,
        deactivateAllCrmFeatures,
        toggleFeature,
        leads,
        moveLeadStage,
        addLead,
        updateLead,
        deleteLead,
        automationRules,
        toggleAutomationRule,
        updateAutomationRule,
        campaigns,
        sendSimulatedWhatsAppMessage,
        totalLeadsCount: leads.length,
        activeAutomationsCount,
        npsScore,
        retentionRatePercent
      }}
    >
      {children}
    </CrmContext.Provider>
  );
};

export const useCrm = () => {
  const context = useContext(CrmContext);
  if (!context) {
    throw new Error('useCrm must be used within a CrmProvider');
  }
  return context;
};
