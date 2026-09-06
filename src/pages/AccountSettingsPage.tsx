import React, { useState, useEffect } from 'react';
import { AccessControlManager } from '../components/AccessControlManager';
import {
  UserCircle,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Sparkles,
  Settings,
  Lock,
  Building,
  Smartphone,
  Calculator,
  Stethoscope,
  Apple,
  ClipboardList,
  Table2,
  Calendar,
  Users,
  FileCheck,
  Save,
  Key,
  Database,
  Eye,
  RefreshCw,
  AlertTriangle,
  Award,
  Layers,
  Activity,
  Check,
  ArrowRight,
  ShieldAlert,
  Info,
  Megaphone,
  BarChart2,
  DollarSign,
  Palette,
  Sliders
} from 'lucide-react';
import { useAuth, ClinicalProfessional } from '../contexts/AuthContext';
import { useTheme, PALETTE_OPTIONS, LightPaletteId } from '../contexts/ThemeContext';
import { professionalService } from '../services/professionalService';
import { useClinic } from '../contexts/ClinicContext';
import { usePatientApp } from '../contexts/PatientAppContext';
import { useCrm } from '../contexts/CrmContext';
import { useMealPlan } from '../contexts/MealPlanContext';
import { activateAllExamFeatures } from '../data/clinicalExamsData';
import { activateAllReportsFeatures } from '../data/reportsClinicalData';
import { activateAllConsultationsFeatures } from '../data/consultationsData';
import { activateAllInventoryFeatures } from '../data/productsInventoryData';
import { activateAllFinancialFeatures } from '../data/financialData';

export const AccountSettingsPage: React.FC = () => {
  const {
    user,
    setUser,
    profile,
    setProfile,
    allProfessionalFeaturesActive,
    setAllProfessionalFeaturesActive,
    activePrescriberType,
    setActivePrescriberType,
    activateAllTeamFeatures,
    professionals
  } = useAuth();

  const { palette, setPalette, setPaletteModalOpen } = useTheme();

  const {
    activateAllUnitsFeatures,
    features: clinicFeatures,
    units
  } = useClinic();

  const {
    activateAllFeatures: activateAllPatientAppFeatures,
    features: patientAppFeatures,
    totalFeaturesCount: totalPatientAppFeatures,
    activeFeaturesCount: activePatientAppFeatures
  } = usePatientApp();

  const {
    activateAllCrmFeatures,
    features: crmFeatures
  } = useCrm();

  const {
    activateAllFeatures: activateAllMealPlanFeatures,
    features: mealPlanFeatures,
    activeFeaturesCount: activeMealPlanFeaturesCount,
    totalFeaturesCount: totalMealPlanFeaturesCount
  } = useMealPlan();

  // Local form state for user profile
  const [profileName, setProfileName] = useState(profile?.name || 'Dra. Vanessa Rios');
  const [profileEmail, setProfileEmail] = useState(profile?.email || 'vanessa.rios@clinica.com');
  const [profileRole, setProfileRole] = useState(profile?.role || 'Nutricionista');
  const [councilType, setCouncilType] = useState<'CRN' | 'CRM' | 'CREF' | 'COREN' | 'CRP'>((profile?.council_type as any) || 'CRN');
  const [councilNumber, setCouncilNumber] = useState(profile?.council_number || '14285');
  const [councilState, setCouncilState] = useState(profile?.council_state || 'SP');
  const [specialty, setSpecialty] = useState(profile?.specialty || 'Nutrição Clínica Funcional & Esportiva de Alto Rendimento');
  const [phone, setPhone] = useState('(11) 98765-4321');
  const [signatureText, setSignatureText] = useState('Assinatura Padrão');

  // Clinical preferences
  const [defaultProtocol, setDefaultProtocol] = useState<'jp-7' | 'jp-3' | 'jp-4' | 'dw-4'>('jp-7');
  const [defaultTmbFormula, setDefaultTmbFormula] = useState<'mifflin' | 'harris' | 'katch' | 'oms'>('mifflin');
  const [defaultAnvisaFormat, setDefaultAnvisaFormat] = useState<'vertical' | 'linear' | 'simplificada'>('vertical');
  const [autoAuditIa, setAutoAuditIa] = useState<boolean>(true);
  const [strictIsakValidation, setStrictIsakValidation] = useState<boolean>(true);

  // Success toast feedback
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isActivatingAll, setIsActivatingAll] = useState<boolean>(false);

  useEffect(() => {
    if (profile) {
      setProfileName(profile.name);
      setProfileEmail(profile.email);
      setProfileRole(profile.role);
      setCouncilType((profile.council_type as any) || 'CRN');
      setCouncilNumber(profile.council_number);
      setCouncilState(profile.council_state);
      setSpecialty(profile.specialty);
    }
  }, [profile]);

  // Handle Master 1-Click Activation of ALL functions
  const handleActivateAllFunctions = () => {
    setIsActivatingAll(true);

    // 1. Activate all professional features in AuthContext
    activateAllTeamFeatures();
    setAllProfessionalFeaturesActive(true);

    // 2. Activate all 10 clinic units & network features
    activateAllUnitsFeatures();

    // 3. Activate all 10 Patient App modules
    activateAllPatientAppFeatures();

    // 4. Activate all 10 CRM & Marketing modules & automations
    activateAllCrmFeatures();

    // 5. Activate all 10 Meal Plan & Nutrition TACO features
    activateAllMealPlanFeatures();

    // 6. Activate all 10 Exam Requisition & Functional Biomarkers features
    activateAllExamFeatures();

    // 7. Activate all 10 Clinical & Management Reports (10/10 Atividades Ativas)
    activateAllReportsFeatures();

    // 8. Activate all 10 Consultations & Clinical SOAP Features (10/10 Atividades Ativas)
    activateAllConsultationsFeatures();

    // 9. Activate all 10 Products, Supplements & Inventory Features (10/10 Funções Ativas)
    activateAllInventoryFeatures();

    // 10. Activate all 10 Financial & Clinical DRE Features (10/10 Funções Ativas)
    activateAllFinancialFeatures();

    // 11. Save to localStorage flags
    localStorage.setItem('nutri_saas_all_master_features_unlocked', 'true');

    setTimeout(() => {
      setIsActivatingAll(false);
      setFeedbackMessage('🎉 TODAS AS FUNÇÕES E ATIVIDADES FORAM ATIVADAS COM SUCESSO! 100% da Visão Financeira & DRE (10/10), Produtos & Estoque (10/10), Relatórios Clínicos (10/10), Atendimentos & SOAP, Requisição de Exames, Planos Alimentares (TACO), CRM/Marketing, calculadoras, app do paciente e gestão multi-unidades liberados.');
      setTimeout(() => setFeedbackMessage(null), 6000);
    }, 400);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const updatedProfile = await professionalService.upsert({
        id: user.id,
        name: profileName,
        email: profileEmail,
        role: profileRole,
        council_type: councilType,
        council_number: councilNumber,
        council_state: councilState,
        specialty: specialty,
        status: 'ativo',
        prescriber_type: activePrescriberType
      });

      if (setProfile) setProfile(updatedProfile);
      
      if (setUser) {
        setUser({
          ...user,
          name: profileName,
          email: profileEmail,
          role: profileRole as any,
          councilInfo: `${councilType}-${councilState} ${councilNumber}`
        });
      }

      setFeedbackMessage('✅ Perfil profissional e dados do conselho salvos com sucesso no banco de dados!');
      setTimeout(() => setFeedbackMessage(null), 4000);
    } catch (err) {
      console.error('Error saving profile:', err);
      setFeedbackMessage('❌ Erro ao salvar dados no Supabase. Verifique sua conexão.');
    }
  };

  // Modules Catalog for visual status
  const systemModules = [
    {
      id: 'antropometria',
      title: 'Antropometria, Dobras & IA',
      icon: <Calculator className="w-4 h-4 text-sky-600" />,
      desc: 'Validação em tempo real ISAK, 9 dobras, auditoria de consistência e bioimpedância.',
      status: 'Ativo (100%)',
      badge: 'IA Integrada'
    },
    {
      id: 'anvisa',
      title: 'Tabela Nutricional ANVISA (RDC 429/2020)',
      icon: <Table2 className="w-4 h-4 text-emerald-600" />,
      desc: 'Gerador oficial com lupa de rotulagem frontal (Alto em Açúcar, Gordura, Sódio).',
      status: 'Ativo (Oficial)',
      badge: 'IN 75/2020'
    },
    {
      id: 'suplementos',
      title: 'Receituário de Suplementos',
      icon: <Apple className="w-4 h-4 text-amber-600" />,
      desc: 'Banco estruturado com posologia, fitoterapia e diferenciação Nutricionista vs Médico.',
      status: 'Ativo',
      badge: activePrescriberType === 'medico' ? 'Doses Médicas' : 'Doses Nutricionista'
    },
    {
      id: 'exames',
      title: 'Requisição de Exames Laboratoriais',
      icon: <ClipboardList className="w-4 h-4 text-indigo-600" />,
      desc: '9 painéis diagnósticos com orientações de jejum e justificativas clínicas estruturadas.',
      status: 'Ativo',
      badge: '9 Painéis'
    },
    {
      id: 'calculadoras',
      title: 'Calculadoras Metabólicas (TMB & GET)',
      icon: <Activity className="w-4 h-4 text-rose-600" />,
      desc: 'Fórmulas puras: Mifflin-St Jeor, Harris-Benedict, Katch-McArdle, FAO/OMS e macros.',
      status: 'Ativo (Puro)',
      badge: 'Precisão'
    },
    {
      id: 'app-paciente',
      title: 'Aplicativo do Paciente (10 Módulos)',
      icon: <Smartphone className="w-4 h-4 text-emerald-600" />,
      desc: 'Diário fotográfico, rastreador de água, cardápio substitutivo e modo PWA offline.',
      status: `${activePatientAppFeatures}/${totalPatientAppFeatures} Ativos`,
      badge: 'PWA & Push'
    },
    {
      id: 'unidades',
      title: 'Unidades & Gestão de Clínicas',
      icon: <Building className="w-4 h-4 text-sky-600" />,
      desc: 'Multi-filiais (Matriz Paulista + Filiais), controle de salas, CNES e conformidade VISA.',
      status: '10/10 Recursos Ativos',
      badge: 'Multi-Tenant'
    },
    {
      id: 'prontuario',
      title: 'Prontuário & Agenda de Atendimentos',
      icon: <Users className="w-4 h-4 text-purple-600" />,
      desc: 'Gestão completa de pacientes, histórico de consultas, WhatsApp bot e relatórios em PDF.',
      status: 'Ativo',
      badge: 'LGPD Art. 5º'
    },
    {
      id: 'crm',
      title: 'CRM & Marketing Clínico Ético (10/10)',
      icon: <Megaphone className="w-4 h-4 text-indigo-600" />,
      desc: 'Funil de pacientes, 10 automações WhatsApp, recuperação de inativos e pesquisas NPS.',
      status: '10/10 Ativo',
      badge: 'CFN Res. 599'
    },
    {
      id: 'relatorios',
      title: 'Relatórios Clínicos, Gerenciais & DRE (10/10)',
      icon: <BarChart2 className="w-4 h-4 text-emerald-600" />,
      desc: 'Eficácia terapêutica, evolução antropométrica, no-show, epidemiologia e DRE financeiro.',
      status: '10/10 Atividades Ativas',
      badge: '100% Liberado'
    },
    {
      id: 'estoque',
      title: 'Produtos, Suplementos & Estoque (10/10)',
      icon: <Layers className="w-4 h-4 text-amber-600" />,
      desc: 'Catálogo com SKU, Custo Médio, Markup, rastreabilidade de lotes, validade ANVISA e PDV na consulta.',
      status: '10/10 Funções Ativas',
      badge: 'RDC 243/2018'
    },
    {
      id: 'financeiro',
      title: 'Visão Financeira & DRE Clínico (10/10)',
      icon: <DollarSign className="w-4 h-4 text-emerald-600" />,
      desc: 'Fluxo de caixa real-time, DRE gerencial com EBITDA, cobrança Pix dinâmico e recibos DMED/IRPF.',
      status: '10/10 Funções Ativas',
      badge: 'DMED & CFN'
    }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in">
      {/* Toast Feedback Notification */}
      {feedbackMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-sm font-semibold flex items-center justify-between gap-3 shadow-lg animate-in slide-in-from-top-4">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{feedbackMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackMessage(null)}
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
            <div className="w-9 h-9 rounded-2xl bg-slate-900 dark:bg-sky-600 text-white flex items-center justify-center font-bold shadow-xs">
              <UserCircle className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Minha Conta & Central de Funções
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              Plano Enterprise Ativo
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Gerenciamento do perfil profissional, dados do conselho de classe, preferências clínicas e ativação master de todos os módulos.
          </p>
        </div>

        {/* Master Activation Action Button */}
        <button
          id="btn-ativar-todas-funcoes-master"
          type="button"
          onClick={handleActivateAllFunctions}
          disabled={isActivatingAll}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md hover:shadow-lg transition-all cursor-pointer shrink-0 disabled:opacity-50"
        >
          {isActivatingAll ? (
            <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
          ) : (
            <Zap className="w-4 h-4 text-amber-300" />
          )}
          <span>ATIVAR TODAS AS FUNÇÕES</span>
          <Sparkles className="w-4 h-4 text-amber-200" />
        </button>
      </div>

      {/* MASTER STATUS CARD: Panorama Global de Ativação */}
      <div
        id="card-status-master"
        className="p-5 sm:p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 translate-x-12 -translate-y-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -translate-x-12 translate-y-12 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                100% DOS RECURSOS DESBLOQUEADOS
              </span>
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                Licença: Ilimitada
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold">
              Todos os Módulos do Sistema Estão Habilitados
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Sua conta possui acesso irrestrito às calculadoras antropométricas com IA, gerador ANVISA oficial, prescritor inteligente de suplementos, requisições de exames laboratoriais, aplicativo do paciente e central multi-unidades.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700 text-center min-w-[100px]">
              <span className="text-[11px] text-slate-400 block font-medium">Módulos</span>
              <span className="text-lg font-bold font-mono text-emerald-400">9 / 9</span>
            </div>
            <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700 text-center min-w-[100px]">
              <span className="text-[11px] text-slate-400 block font-medium">App Paciente</span>
              <span className="text-lg font-bold font-mono text-sky-400">10 / 10</span>
            </div>
            <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700 text-center min-w-[100px]">
              <span className="text-[11px] text-slate-400 block font-medium">CRM / Mkt</span>
              <span className="text-lg font-bold font-mono text-indigo-400">10 / 10</span>
            </div>
          </div>
        </div>
      </div>

      {/* GRID PRINCIPAL: 2 Colunas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUNA 1 & 2: Formulário do Perfil Profissional & Preferências Clínicas */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card 1: Dados Profissionais & Registro no Conselho */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-sky-100 dark:border-sky-900/60">
                  <UserCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Dados do Profissional & Conselho de Classe
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Informações exibidas no cabeçalho e rodapé dos laudos, receituários e tabelas ANVISA.
                  </p>
                </div>
              </div>

              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {councilType}-{councilState} {councilNumber}
              </span>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nome Completo com Titulação
                  </label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    E-mail Institucional / Profissional
                  </label>
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 font-medium"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Conselho de Classe
                  </label>
                  <select
                    value={councilType}
                    onChange={(e) => setCouncilType(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 font-medium"
                  >
                    <option value="CRN">CRN (Nutrição)</option>
                    <option value="CRM">CRM (Medicina / Nutrologia)</option>
                    <option value="CREF">CREF (Ed. Física / Antropometria)</option>
                    <option value="COREN">COREN (Enfermagem)</option>
                    <option value="CRP">CRP (Psicologia)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Número de Registro
                  </label>
                  <input
                    type="text"
                    value={councilNumber}
                    onChange={(e) => setCouncilNumber(e.target.value)}
                    placeholder="Ex: 14285"
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 font-mono font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    UF do Conselho
                  </label>
                  <select
                    value={councilState}
                    onChange={(e) => setCouncilState(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 font-medium"
                  >
                    <option value="SP">SP (São Paulo)</option>
                    <option value="RJ">RJ (Rio de Janeiro)</option>
                    <option value="MG">MG (Minas Gerais)</option>
                    <option value="PR">PR (Paraná)</option>
                    <option value="RS">RS (Rio Grande do Sul)</option>
                    <option value="SC">SC (Santa Catarina)</option>
                    <option value="BA">BA (Bahia)</option>
                    <option value="DF">DF (Distrito Federal)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Especialidade Clínica Principal
                  </label>
                  <input
                    type="text"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Telefone de Contato / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 font-medium"
                  />
                </div>
              </div>

              {/* Tipo de Prescritor (Nutri vs Médico) */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  Perfil de Prescrição no Receituário de Suplementos
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setActivePrescriberType('nutricionista')}
                    className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                      activePrescriberType === 'nutricionista'
                        ? 'bg-white dark:bg-slate-900 border-sky-500 ring-2 ring-sky-500/20 shadow-xs'
                        : 'bg-white/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <Apple className={`w-4 h-4 mt-0.5 ${activePrescriberType === 'nutricionista' ? 'text-sky-600' : 'text-slate-400'}`} />
                    <div>
                      <span className="text-xs font-bold block text-slate-900 dark:text-white">
                        Nutricionista (CFN / Res. 656)
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        Doses dentro dos limites de segurança da ANVISA e fitoterapia magistral.
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActivePrescriberType('medico')}
                    className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                      activePrescriberType === 'medico'
                        ? 'bg-white dark:bg-slate-900 border-indigo-500 ring-2 ring-indigo-500/20 shadow-xs'
                        : 'bg-white/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <Stethoscope className={`w-4 h-4 mt-0.5 ${activePrescriberType === 'medico' ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <div>
                      <span className="text-xs font-bold block text-slate-900 dark:text-white">
                        Médico / Nutrólogo (CFM / RQE)
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        Doses farmacológicas elevadas, injetáveis e reposição hormonal.
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Assinatura Digital / Carimbo Eletrônico */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Texto do Carimbo Eletrônico para Documentos e PDFs
                </label>
                <textarea
                  rows={2}
                  value={signatureText}
                  onChange={(e) => setSignatureText(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 shadow-xs transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Salvar Dados da Conta</span>
                </button>
              </div>
            </form>
          </div>

          {/* Card 2: Preferências Clínicas & Padrões Metrológicos */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-100 dark:border-amber-900/60">
                <Settings className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Padrões Clínicos & Metrológicos
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Defina as fórmulas matemáticas e diretrizes de cálculo padrão para suas consultas.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Protocolo de Dobras Padrão
                </label>
                <select
                  value={defaultProtocol}
                  onChange={(e) => setDefaultProtocol(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                >
                  <option value="jp-7">Jackson & Pollock (7 Dobras)</option>
                  <option value="jp-3">Jackson & Pollock (3 Dobras)</option>
                  <option value="jp-4">Jackson & Pollock (4 Dobras)</option>
                  <option value="dw-4">Durnin & Womersley (4 Dobras)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Fórmula de TMB Padrão
                </label>
                <select
                  value={defaultTmbFormula}
                  onChange={(e) => setDefaultTmbFormula(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                >
                  <option value="mifflin">Mifflin-St Jeor (1990 - Padrão ADA)</option>
                  <option value="harris">Harris-Benedict (1984 - Revisada)</option>
                  <option value="katch">Katch-McArdle (Massa Magra)</option>
                  <option value="oms">FAO / OMS / UNU (2004)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Padrão Tabela ANVISA
                </label>
                <select
                  value={defaultAnvisaFormat}
                  onChange={(e) => setDefaultAnvisaFormat(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                >
                  <option value="vertical">Modelo Vertical Oficial</option>
                  <option value="linear">Modelo Linear / Horizontal</option>
                  <option value="simplificada">Modelo Simplificado</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <label className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={strictIsakValidation}
                  onChange={(e) => setStrictIsakValidation(e.target.checked)}
                  className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
                />
                <span className="font-medium">
                  Ativar validação em tempo real de limites fisiológicos (1.5mm - 70mm) e Erro Técnico ISAK (máx 5%).
                </span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoAuditIa}
                  onChange={(e) => setAutoAuditIa(e.target.checked)}
                  className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
                />
                <span className="font-medium">
                  Auditoria automática de consistência anatômica por IA em todas as avaliações antropométricas.
                </span>
              </label>
            </div>
          </div>

          {/* Card: Gerenciamento de Dados e Sincronização Offline */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-sky-100 dark:border-sky-900/60">
                <RefreshCw className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Gerenciamento de Dados e Sincronização
                </h3>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Status da Conexão:</span>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${navigator.onLine ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                  {navigator.onLine ? 'Online' : 'Offline'}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="w-full px-3 py-2.5 rounded-xl bg-sky-600 text-white text-xs font-bold cursor-pointer hover:bg-sky-700 transition-colors active:scale-95"
                  onClick={async () => {
                    const { syncService } = await import('../services/syncService');
                    await syncService.syncPendingEvaluations();
                    setFeedbackMessage('Sincronização iniciada...');
                    setTimeout(() => setFeedbackMessage(null), 3000);
                  }}
                >
                  Sincronizar Agora
                </button>
              </div>
            </div>
          </div>

          <AccessControlManager />

          {/* Card 3: Identidade Visual & Paletas Clínicas do Tema Claro */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-100 dark:border-teal-900/60">
                  <Palette className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Identidade Visual & Paleta de Cores (Tema Claro)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Selecione a tonalidade clara que melhor traduz o posicionamento da sua clínica.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPaletteModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                title="Abrir Comparativo Detalhado (Alt+P)"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Comparar (Alt+P)</span>
              </button>
            </div>

            <div className="space-y-3">
              {PALETTE_OPTIONS.map((pal) => {
                const isSelected = palette === pal.id;

                return (
                  <div
                    key={pal.id}
                    onClick={() => setPalette(pal.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-emerald-600 dark:border-emerald-500 bg-slate-50 dark:bg-slate-800/80 shadow-xs ring-1 ring-emerald-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl mt-0.5">{pal.icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                            Opção {pal.optionNumber}: {pal.name}
                          </h4>
                          <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                            ({pal.subtitle})
                          </span>
                          {isSelected && (
                            <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-emerald-600 text-white font-mono">
                              Ativa
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-1">
                          {pal.focus}
                        </p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                          <strong className="text-slate-600 dark:text-slate-400">Público:</strong> {pal.targetNiche}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      {/* Swatches */}
                      <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
                        <span
                          className="w-3.5 h-3.5 rounded-md border border-slate-300"
                          style={{ backgroundColor: pal.colors.background }}
                          title={`Fundo: ${pal.colors.background}`}
                        />
                        <span
                          className="w-3.5 h-3.5 rounded-md border border-slate-300"
                          style={{ backgroundColor: pal.colors.accent }}
                          title={`Destaque: ${pal.colors.accent}`}
                        />
                        <span
                          className="w-3.5 h-3.5 rounded-md border border-slate-300"
                          style={{ backgroundColor: pal.colors.textPrimary }}
                          title={`Texto: ${pal.colors.textPrimary}`}
                        />
                        {pal.colors.secondaryElement && (
                          <span
                            className="w-3.5 h-3.5 rounded-md border border-slate-300"
                            style={{ backgroundColor: pal.colors.secondaryElement.bg }}
                            title={`Secundário: ${pal.colors.secondaryElement.bg}`}
                          />
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPalette(pal.id);
                        }}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-600 text-white shadow-2xs'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {isSelected ? 'Em Uso' : 'Aplicar'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* COLUNA 3: Catálogo de Módulos do Sistema & Segurança LGPD */}
        <div className="space-y-6">
          
          {/* Card: Catálogo dos 8 Módulos do SaaS */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Módulos do Sistema (8/8 Ativos)
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                100% Liberado
              </span>
            </div>

            <div className="space-y-2.5">
              {systemModules.map((mod) => (
                <div
                  key={mod.id}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 flex items-start gap-3"
                >
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
                    {mod.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {mod.title}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 shrink-0">
                        {mod.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                      {mod.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card: Segurança & Conformidade LGPD (Persona 3) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Segurança & Proteção LGPD
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-300 flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Art. 5º, II da LGPD (Dados Sensíveis)</span>
                  <span className="text-[11px]">
                    Prontuários antropométricos, exames e suplementações protegidos por criptografia em repouso e isolamento de acesso profissional.
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Trilha de Auditoria:</span>
                  <span className="font-mono font-bold text-emerald-600">Ativa (Inviolável)</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Criptografia em Trânsito:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">TLS 1.3 / HTTPS</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Backups Automáticos:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">Diário (Nuvem)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
