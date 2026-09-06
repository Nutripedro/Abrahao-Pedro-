import React, { useState } from 'react';
import {
  Megaphone,
  Zap,
  CheckCircle2,
  Sparkles,
  MessageSquare,
  Users,
  Clock,
  TrendingUp,
  HeartHandshake,
  Send,
  Plus,
  ArrowRight,
  Filter,
  Search,
  Sliders,
  ShieldCheck,
  Smartphone,
  Calendar,
  Star,
  Check,
  RefreshCw,
  AlertCircle,
  Award,
  ChevronRight,
  UserCheck,
  ExternalLink,
  Info,
  PhoneCall,
  Mail,
  ChevronDown
} from 'lucide-react';
import { useCrm } from '../contexts/CrmContext';
import { useAuth } from '../contexts/AuthContext';
import { LeadPipelineStage, CrmPatientLead, CrmAutomationRule } from '../types/crm';

const PIPELINE_COLUMNS: { id: LeadPipelineStage; label: string; color: string; badgeBg: string }[] = [
  { id: 'novo_lead', label: '1. Novos Contatos & Leads', color: 'border-sky-500', badgeBg: 'bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300' },
  { id: 'consulta_agendada', label: '2. 1ª Consulta Agendada', color: 'border-indigo-500', badgeBg: 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300' },
  { id: 'plano_ativo', label: '3. Plano Alimentar Ativo', color: 'border-emerald-500', badgeBg: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' },
  { id: 'reavaliacao_pendente', label: '4. Reavaliação Antropométrica (30-45d)', color: 'border-amber-500', badgeBg: 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300' },
  { id: 'manutencao', label: '5. Manutenção & Metas Atingidas', color: 'border-teal-500', badgeBg: 'bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300' },
  { id: 'inativo_recuperacao', label: '6. Ausentes / Recuperação (60d+)', color: 'border-rose-500', badgeBg: 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300' }
];

export const CrmMarketingPage: React.FC = () => {
  const {
    features,
    allCrmFeaturesActive,
    activateAllCrmFeatures,
    toggleFeature,
    leads,
    moveLeadStage,
    addLead,
    automationRules,
    toggleAutomationRule,
    campaigns,
    sendSimulatedWhatsAppMessage,
    totalLeadsCount,
    activeAutomationsCount,
    npsScore,
    retentionRatePercent
  } = useCrm();

  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'pipeline' | 'automacoes' | 'campanhas' | 'recuperacao' | 'nps'>('pipeline');
  const [searchLeadQuery, setSearchLeadQuery] = useState('');
  const [selectedUnitFilter, setSelectedUnitFilter] = useState('todas');
  const [isActivatingAll, setIsActivatingAll] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // WhatsApp modal state
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [selectedLeadForWa, setSelectedLeadForWa] = useState<CrmPatientLead | null>(null);
  const [customWaMessage, setCustomWaMessage] = useState('');

  // Add Lead Modal
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadPhone, setNewLeadPhone] = useState('');
  const [newLeadEmail, setNewLeadEmail] = useState('');
  const [newLeadObjective, setNewLeadObjective] = useState('Emagrecimento & Reeducação Alimentar');
  const [newLeadSource, setNewLeadSource] = useState<'instagram' | 'whatsapp' | 'indicacao_paciente' | 'google' | 'medico_parceiro'>('whatsapp');
  const [newLeadStage, setNewLeadStage] = useState<LeadPipelineStage>('novo_lead');

  const handleActivateAll = () => {
    setIsActivatingAll(true);
    activateAllCrmFeatures();
    setTimeout(() => {
      setIsActivatingAll(false);
      setToastMessage('🎉 TODAS AS FUNÇÕES DE CRM & MARKETING FORAM ATIVADAS! 10/10 automações, funil de pacientes, recuperação e NPS liberados.');
      setTimeout(() => setToastMessage(null), 5000);
    }, 400);
  };

  const handleOpenWhatsAppModal = (lead: CrmPatientLead, defaultMsg?: string) => {
    setSelectedLeadForWa(lead);
    const msg = defaultMsg || `Olá ${lead.name.split(' ')[0]}! Tudo bem? Aqui é da equipe da ${user?.name || 'Dra. Vanessa Rios'}. Como estão seus hábitos alimentares e sua rotina nesta semana?`;
    setCustomWaMessage(msg);
    setIsWhatsAppModalOpen(true);
  };

  const handleSendWhatsApp = () => {
    if (!selectedLeadForWa) return;
    sendSimulatedWhatsAppMessage(selectedLeadForWa.phone, customWaMessage);
    setIsWhatsAppModalOpen(false);
    setToastMessage(`📱 Mensagem enviada com sucesso para ${selectedLeadForWa.name}!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName.trim()) return;

    addLead({
      name: newLeadName,
      phone: newLeadPhone || '(11) 99999-0000',
      email: newLeadEmail || 'contato@paciente.com',
      source: newLeadSource,
      stage: newLeadStage,
      objective: newLeadObjective,
      lastContactDate: 'Hoje, agora',
      daysInactive: 0,
      assignedProfessional: user?.name || 'Dra. Vanessa Rios',
      unit: 'Unidade 01 - Matriz Paulista',
      engagementScore: 90,
      whatsappHistoryCount: 1,
      notes: 'Lead cadastrado diretamente pelo painel do CRM.'
    });

    setIsAddLeadModalOpen(false);
    setNewLeadName('');
    setNewLeadPhone('');
    setNewLeadEmail('');
    setToastMessage('✅ Novo paciente/lead inserido no funil com sucesso!');
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchLeadQuery.toLowerCase()) ||
                          lead.objective.toLowerCase().includes(searchLeadQuery.toLowerCase()) ||
                          lead.phone.includes(searchLeadQuery);
    const matchesUnit = selectedUnitFilter === 'todas' || lead.unit.includes(selectedUnitFilter);
    return matchesSearch && matchesUnit;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in">
      {/* Toast feedback */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-sm font-semibold flex items-center justify-between gap-3 shadow-lg animate-in slide-in-from-top-4">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-xs text-emerald-700 hover:text-emerald-900 font-bold px-2 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/60"
          >
            Fechar
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Megaphone className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              CRM & Marketing Clínico Ético
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              10/10 Funções Ativas
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Funil de pacientes, automações via WhatsApp, recuperação inteligente de ausentes e métricas de satisfação (NPS) em conformidade com o CFN e LGPD.
          </p>
        </div>

        {/* Master Action Button */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            id="btn-ativar-todas-funcoes-crm"
            type="button"
            onClick={handleActivateAll}
            disabled={isActivatingAll}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
          >
            {isActivatingAll ? (
              <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <Zap className="w-4 h-4 text-amber-300" />
            )}
            <span>ATIVAR TODAS AS FUNÇÕES (CRM)</span>
            <Sparkles className="w-4 h-4 text-amber-200" />
          </button>
        </div>
      </div>

      {/* KPI STATS ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Taxa de Retenção (90d)</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">{retentionRatePercent}%</span>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">+5.4% este mês</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Pacientes que completam reavaliações</p>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">NPS Clínico Médio</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">{npsScore} / 100</span>
            <span className="text-[11px] font-semibold text-slate-500">Zona de Excelência</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Baseado em 290 avaliações pós-consulta</p>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Automações Ativas</span>
            <Smartphone className="w-4 h-4 text-sky-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-sky-600 dark:text-sky-400">{activeAutomationsCount} / 10</span>
            <span className="text-[11px] font-semibold text-emerald-600">100% Operacional</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Lembretes WhatsApp, NPS e Aniversários</p>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Redução de No-Show</span>
            <ShieldCheck className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400">-42.8%</span>
            <span className="text-[11px] font-semibold text-indigo-600">Faltas evitadas</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Com confirmações 24h e 2h antes</p>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto gap-2">
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('pipeline')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'pipeline'
                ? 'bg-slate-900 text-white dark:bg-sky-600 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Funil de Pacientes & Leads</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">{totalLeadsCount}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('automacoes')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'automacoes'
                ? 'bg-slate-900 text-white dark:bg-sky-600 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Automações WhatsApp (10)</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('recuperacao')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'recuperacao'
                ? 'bg-slate-900 text-white dark:bg-sky-600 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Recuperação de Inativos</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
              {leads.filter(l => l.stage === 'inativo_recuperacao' || l.daysInactive >= 45).length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('campanhas')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'campanhas'
                ? 'bg-slate-900 text-white dark:bg-sky-600 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>Campanhas & Retenção</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('nps')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'nps'
                ? 'bg-slate-900 text-white dark:bg-sky-600 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>Pesquisas NPS (94)</span>
          </button>
        </div>

        {activeTab === 'pipeline' && (
          <button
            type="button"
            onClick={() => setIsAddLeadModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition-opacity cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Novo Contato / Lead</span>
          </button>
        )}
      </div>

      {/* TAB CONTENT 1: PIPELINE / KANBAN */}
      {activeTab === 'pipeline' && (
        <div className="space-y-4 animate-in fade-in">
          {/* Filters Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchLeadQuery}
                onChange={(e) => setSearchLeadQuery(e.target.value)}
                placeholder="Buscar por nome, objetivo ou telefone..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-500 whitespace-nowrap">Filial:</span>
              <select
                value={selectedUnitFilter}
                onChange={(e) => setSelectedUnitFilter(e.target.value)}
                className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="todas">Todas as Unidades</option>
                <option value="Matriz Paulista">Unidade 01 - Matriz Paulista</option>
                <option value="Campinas">Unidade 02 - Campinas Taquaral</option>
                <option value="Moema">Unidade 03 - Moema Premium</option>
                <option value="Jardins">Unidade 04 - Jardins Oscar Freire</option>
              </select>
            </div>
          </div>

          {/* Kanban Board */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 overflow-x-auto pb-4">
            {PIPELINE_COLUMNS.map((col) => {
              const colLeads = filteredLeads.filter(l => l.stage === col.id);

              return (
                <div
                  key={col.id}
                  className="flex flex-col rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800 p-3 min-w-[260px] space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200/70 dark:border-slate-800">
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {col.label}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${col.badgeBg}`}>
                      {colLeads.length}
                    </span>
                  </div>

                  <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[600px] scrollbar-thin">
                    {colLeads.length === 0 ? (
                      <div className="p-4 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
                        Nenhum contato nesta etapa
                      </div>
                    ) : (
                      colLeads.map((lead) => (
                        <div
                          key={lead.id}
                          className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs hover:shadow-md transition-shadow space-y-2.5"
                        >
                          <div className="flex items-start justify-between gap-1.5">
                            <span className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                              {lead.name}
                            </span>
                            <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 shrink-0 uppercase">
                              {lead.source.replace('_', ' ')}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                            🎯 {lead.objective}
                          </p>

                          {lead.nextScheduledDate && (
                            <div className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.8 rounded-md">
                              <Calendar className="w-3 h-3" />
                              <span>{lead.nextScheduledDate}</span>
                            </div>
                          )}

                          {lead.daysInactive > 0 && (
                            <div className="text-[10px] text-slate-400 flex items-center justify-between">
                              <span>Sem consulta:</span>
                              <span className={`font-mono font-bold ${lead.daysInactive > 45 ? 'text-rose-500' : 'text-slate-500'}`}>
                                {lead.daysInactive} dias
                              </span>
                            </div>
                          )}

                          {/* Quick Actions inside Card */}
                          <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenWhatsAppModal(lead)}
                              className="px-2 py-1 rounded-lg text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 flex items-center gap-1 cursor-pointer"
                              title="Enviar WhatsApp"
                            >
                              <MessageSquare className="w-3 h-3" />
                              <span>WhatsApp</span>
                            </button>

                            {/* Move stage dropdown selector */}
                            <select
                              value={lead.stage}
                              onChange={(e) => moveLeadStage(lead.id, e.target.value as LeadPipelineStage)}
                              className="text-[10px] px-1.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                            >
                              <option value="novo_lead">1. Novo Lead</option>
                              <option value="consulta_agendada">2. Agendada</option>
                              <option value="plano_ativo">3. Plano Ativo</option>
                              <option value="reavaliacao_pendente">4. Reavaliação</option>
                              <option value="manutencao">5. Manutenção</option>
                              <option value="inativo_recuperacao">6. Inativo</option>
                            </select>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: AUTOMAÇÕES WHATSAPP (10 MÓDULOS) */}
      {activeTab === 'automacoes' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-200 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                <strong>Conformidade CFN Res. nº 599/2018 & LGPD:</strong> Todas as mensagens possuem finalidade estritamente assistencial, lembretes de saúde e instruções clínicas personalizadas com opção de cancelamento de envio (opt-out).
              </span>
            </div>
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-200/60 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-300 shrink-0">
              Taxa Abertura: 98.4%
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {automationRules.map((rule) => (
              <div
                key={rule.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {rule.title}
                      </span>
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase">
                        {rule.channel}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {rule.description}
                    </p>
                  </div>

                  {/* Toggle switch */}
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={rule.active}
                      onChange={() => toggleAutomationRule(rule.id)}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600" />
                  </label>
                </div>

                {/* Template Message Preview */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-700 dark:text-slate-300">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Modelo de Mensagem WhatsApp:</span>
                  <p className="whitespace-pre-line">{rule.templateMessage}</p>
                </div>

                {/* Automation Stats */}
                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100 dark:border-slate-800 text-slate-500">
                  <span>Gatilho: <strong>{rule.triggerEvent}</strong></span>
                  <div className="flex items-center gap-3">
                    <span>Enviados: <strong className="font-mono text-slate-900 dark:text-white">{rule.sentTotalCount}</strong></span>
                    <span>Conversão: <strong className="font-mono text-emerald-600">{rule.conversionRatePercent}%</strong></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: CAMPANHAS & RETENÇÃO ÉTICA */}
      {activeTab === 'campanhas' && (
        <div className="space-y-5 animate-in fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {campaigns.map((camp) => (
              <div
                key={camp.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      {camp.name}
                    </span>
                    <span className="text-[11px] text-slate-500">Iniciada em {camp.startDate}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 uppercase">
                    {camp.status}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                  <span className="text-[10px] text-slate-400 block font-bold">PÚBLICO-ALVO:</span>
                  <p className="text-slate-700 dark:text-slate-300">{camp.targetAudience}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <span className="text-[10px] text-slate-400 block">Disparos</span>
                    <span className="font-bold font-mono text-slate-900 dark:text-white">{camp.sentCount}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <span className="text-[10px] text-slate-400 block">Engajamento</span>
                    <span className="font-bold font-mono text-emerald-600">{camp.engagementPercent}%</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <span className="text-[10px] text-slate-400 block">Retornos</span>
                    <span className="font-bold font-mono text-indigo-600">{camp.returnedPatientsCount}</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 italic">
                  ⚖️ {camp.ethicalComplianceNotice}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: RECUPERAÇÃO DE INATIVOS */}
      {activeTab === 'recuperacao' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>
                <strong>Motor de Recuperação Empática:</strong> Identifica pacientes que não realizam consulta há mais de 45 dias para restabelecer o vínculo terapêutico e prevenir o abandono do plano alimentar.
              </span>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-rose-200 dark:bg-rose-900 text-rose-900 dark:text-rose-200 shrink-0">
              Taxa de Resposta: 52%
            </span>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Pacientes com Janela de Retorno Ultrapassada
            </h3>

            <div className="space-y-3">
              {leads
                .filter(l => l.daysInactive >= 30 || l.stage === 'inativo_recuperacao')
                .map((patient) => (
                  <div
                    key={patient.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {patient.name}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold">
                          {patient.daysInactive} dias sem consulta
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Objetivo Clínico: {patient.objective} • Responsável: {patient.assignedProfessional}
                      </p>
                      <p className="text-[11px] text-indigo-600 dark:text-indigo-400">
                        💡 Sugestão IA: Enviar convite de reavaliação física e bioimpedância com flexibilidade de horário.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          handleOpenWhatsAppModal(
                            patient,
                            `Olá ${patient.name.split(' ')[0]}! Aqui é a ${patient.assignedProfessional}. Senti sua falta na clínica para acompanharmos sua evolução em ${patient.objective}. Como estão seus hábitos? Vamos agendar uma reavaliação nesta semana?`
                          )
                        }
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Recuperar via WhatsApp</span>
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 5: PESQUISAS NPS */}
      {activeTab === 'nps' && (
        <div className="space-y-5 animate-in fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 text-center">
              <span className="text-xs font-bold uppercase text-slate-400">Índice Net Promoter Score</span>
              <div className="text-5xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                +94
              </div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                Zona de Excelência (75 a 100)
              </span>
              <div className="space-y-2 text-xs pt-4 border-t border-slate-100 dark:border-slate-800 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-600 font-bold">Promotores (Nota 9-10)</span>
                  <span className="font-mono font-bold">92.4%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-amber-600 font-bold">Neutros (Nota 7-8)</span>
                  <span className="font-mono font-bold">6.1%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-rose-600 font-bold">Detratores (Nota 0-6)</span>
                  <span className="font-mono font-bold">1.5%</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Depoimentos & Avaliações Recentes dos Pacientes
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">Mariana L. (Unidade Matriz)</span>
                    <div className="flex text-amber-400">
                      {'★'.repeat(5)}
                    </div>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">
                    "O atendimento da Dra. Vanessa e o aplicativo do paciente facilitaram demais meu dia a dia. Perdi 6kg em 2 meses sem passar fome!"
                  </p>
                  <span className="text-[10px] text-slate-400 block">Avaliação recebida há 2 dias • Nota 10</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">Carlos E. (Unidade Moema)</span>
                    <div className="flex text-amber-400">
                      {'★'.repeat(5)}
                    </div>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">
                    "A precisão da bioimpedância e a explicação das dobras cutâneas me deram total clareza dos meus ganhos de massa magra no triatlo."
                  </p>
                  <span className="text-[10px] text-slate-400 block">Avaliação recebida há 4 dias • Nota 10</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WHATSAPP MODAL SIMULATOR */}
      {isWhatsAppModalOpen && selectedLeadForWa && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-4 bg-emerald-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-5 h-5" />
                <div>
                  <h3 className="text-sm font-bold truncate">{selectedLeadForWa.name}</h3>
                  <span className="text-[11px] text-emerald-100">{selectedLeadForWa.phone} • WhatsApp Oficial</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsWhatsAppModalOpen(false)}
                className="text-emerald-100 hover:text-white text-xs font-bold"
              >
                Fechar
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 space-y-2">
                <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase">Mensagem a ser disparada:</span>
                <textarea
                  rows={4}
                  value={customWaMessage}
                  onChange={(e) => setCustomWaMessage(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-white dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Histórico: {selectedLeadForWa.whatsappHistoryCount} mensagens enviadas</span>
                <button
                  type="button"
                  onClick={handleSendWhatsApp}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Confirmar e Disparar Mensagem</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD LEAD MODAL */}
      {isAddLeadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Cadastrar Novo Contato no Funil
              </h3>
              <button
                type="button"
                onClick={() => setIsAddLeadModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nome do Paciente / Lead *
                </label>
                <input
                  type="text"
                  value={newLeadName}
                  onChange={(e) => setNewLeadName(e.target.value)}
                  placeholder="Ex: Letícia Albuquerque"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    WhatsApp *
                  </label>
                  <input
                    type="text"
                    value={newLeadPhone}
                    onChange={(e) => setNewLeadPhone(e.target.value)}
                    placeholder="(11) 98888-7777"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Origem do Lead
                  </label>
                  <select
                    value={newLeadSource}
                    onChange={(e) => setNewLeadSource(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="whatsapp">WhatsApp Direto</option>
                    <option value="instagram">Instagram Direct</option>
                    <option value="indicacao_paciente">Indicação de Paciente</option>
                    <option value="google">Google / Site</option>
                    <option value="medico_parceiro">Médico Parceiro</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Objetivo Clínico
                </label>
                <input
                  type="text"
                  value={newLeadObjective}
                  onChange={(e) => setNewLeadObjective(e.target.value)}
                  placeholder="Ex: Emagrecimento, Hipertrofia, SOP..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Etapa Inicial do Funil
                </label>
                <select
                  value={newLeadStage}
                  onChange={(e) => setNewLeadStage(e.target.value as LeadPipelineStage)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                >
                  <option value="novo_lead">1. Novo Lead (Primeiro Contato)</option>
                  <option value="consulta_agendada">2. 1ª Consulta Agendada</option>
                  <option value="plano_ativo">3. Plano Alimentar Ativo</option>
                  <option value="reavaliacao_pendente">4. Reavaliação Antropométrica</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddLeadModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-white font-bold bg-indigo-600 hover:bg-indigo-700 shadow-xs cursor-pointer"
                >
                  Salvar no Funil
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
