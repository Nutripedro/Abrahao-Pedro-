export type LeadPipelineStage = 
  | 'novo_lead'
  | 'consulta_agendada'
  | 'plano_ativo'
  | 'reavaliacao_pendente'
  | 'manutencao'
  | 'inativo_recuperacao';

export type LeadSource = 
  | 'instagram'
  | 'whatsapp'
  | 'indicacao_paciente'
  | 'google'
  | 'medico_parceiro'
  | 'unidade_paulista'
  | 'unidade_campinas'
  | 'outro';

export interface CrmPatientLead {
  id: string;
  name: string;
  phone: string;
  email: string;
  source: LeadSource;
  stage: LeadPipelineStage;
  objective: string;
  lastContactDate: string;
  daysInactive: number;
  assignedProfessional: string;
  unit: string;
  engagementScore: number; // 0 - 100
  notes?: string;
  whatsappHistoryCount: number;
  nextScheduledDate?: string;
}

export interface CrmAutomationRule {
  id: string;
  title: string;
  description: string;
  category: 'retencao' | 'agendamento' | 'engajamento' | 'pos_consulta' | 'aniversario';
  triggerEvent: string;
  channel: 'whatsapp' | 'email' | 'push' | 'hibrido';
  active: boolean;
  sentTotalCount: number;
  openRatePercent: number;
  conversionRatePercent: number;
  templateMessage: string;
}

export interface CrmCampaign {
  id: string;
  name: string;
  targetAudience: string;
  status: 'ativa' | 'concluida' | 'pausada' | 'agendada';
  channel: 'whatsapp' | 'email';
  sentCount: number;
  engagementPercent: number;
  returnedPatientsCount: number;
  startDate: string;
  ethicalComplianceNotice: string;
}

export interface CrmFeaturesState {
  whatsappAutoReminders: boolean;      // 1. Lembretes automáticos 24h/2h via WhatsApp
  postConsultationNps: boolean;        // 2. Pesquisa de satisfação NPS pós-consulta
  birthdayGreetings: boolean;          // 3. Felicitações automáticas de aniversário
  anthropometryRecallAlerts: boolean;  // 4. Alerta de reavaliação física 30/60 dias
  inactivePatientRecovery: boolean;    // 5. Motor de recuperação de inativos com IA
  leadPipelineKanban: boolean;         // 6. Funil de captação e conversão de leads
  ethicalCampaignBroadcast: boolean;   // 7. Disparador de campanhas e comunicados CFN
  weeklyHydrationCheckin: boolean;     // 8. Check-in semanal de adesão e água
  doctorPartnerReferrals: boolean;     // 9. Gestão de indicações de médicos parceiros
  lgpdOptInOutControl: boolean;        // 10. Gestão de consentimento e opt-out LGPD
}
