import React, { useState } from 'react';
import {
  Stethoscope,
  Sparkles,
  Zap,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Clock,
  Calendar,
  User,
  FileText,
  Activity,
  Plus,
  Search,
  Printer,
  Download,
  Share2,
  ShieldCheck,
  HeartPulse,
  Flame,
  Apple,
  Pill,
  ChevronRight,
  ClipboardList,
  Eye,
  Check,
  Save,
  Trash2,
  BookOpen,
  ArrowRight,
  ListOrdered,
  Layers,
  Send,
  Lock,
  Building2,
  Award,
  Maximize2
} from 'lucide-react';
import {
  CONSULTATIONS_MASTER_FEATURES,
  ConsultationsMasterFeature,
  MOCK_CONSULTATIONS,
  ConsultationRecord,
  BRISTOL_SCALE_ITEMS,
  calculateMsqScoreLevel,
  getConsultationsFeatureStatus,
  setConsultationsFeatureStatus,
  activateAllConsultationsFeatures
} from '../data/consultationsData';
import { useAuth } from '../contexts/AuthContext';
import { useClinic } from '../contexts/ClinicContext';
import { useClinicalFocus } from '../contexts/ClinicalFocusContext';

export const ConsultationsPage: React.FC = () => {
  const { user } = useAuth();
  const { selectedClinic } = useClinic();
  const { enableClinicalFocus } = useClinicalFocus();

  // Features Master (10/10)
  const [featuresList, setFeaturesList] = useState<ConsultationsMasterFeature[]>(() =>
    CONSULTATIONS_MASTER_FEATURES.map(f => ({
      ...f,
      isActive: getConsultationsFeatureStatus(f.id)
    }))
  );
  const [showFeaturesModal, setShowFeaturesModal] = useState(false);

  // Tabs
  const [activeTab, setActiveTab] = useState<'lista' | 'novo_atendimento' | 'prontuario' | 'protocolos' | 'features'>('lista');

  // Consultations state
  const [consultations, setConsultations] = useState<ConsultationRecord[]>(MOCK_CONSULTATIONS);
  const [selectedConsultation, setSelectedConsultation] = useState<ConsultationRecord | null>(MOCK_CONSULTATIONS[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Concluído' | 'Em Andamento' | 'Agendado'>('all');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Modal de Laudo / Atestado Oficial
  const [showLaudoModal, setShowLaudoModal] = useState(false);
  const [laudoType, setLaudoType] = useState<'laudo_clinico' | 'atestado_comparecimento' | 'declaracao_nutricional'>('laudo_clinico');

  // Form State for "Novo Atendimento / Sala Clínica em Tempo Real"
  const [newPatientName, setNewPatientName] = useState('Camila Mendonça Ferreira');
  const [newConsultType, setNewConsultType] = useState<'Primeira Consulta' | 'Consulta de Retorno' | 'Acompanhamento Trimestral'>('Consulta de Retorno');
  const [newChiefComplaint, setNewChiefComplaint] = useState('Acompanhamento evolutivo de composição corporal e modulação de compulsão por doces.');
  
  // SOAP
  const [soapS, setSoapS] = useState('Paciente relata excelente adesão ao fracionamento das refeições. Nível de energia constante ao longo da tarde.');
  const [soapO, setSoapO] = useState('Peso: 69.8 kg. Gordura Corporal (Pollock): 24.8%. Massa Magra: +1.2 kg. HOMA-IR recente: 1.6.');
  const [soapA, setSoapA] = useState('Recomposição corporal favorável com reversão de resistência insulínica e aumento de massa magra funcional.');
  const [soapP, setSoapP] = useState('Manter dieta normocalórica hiperproteica (1.8g/kg). Suplementação de Magnésio Inositol + Creatina Creapure 5g/dia.');

  // Anamnese & Rastreamento
  const [hydration, setHydration] = useState(2800);
  const [bristolSelected, setBristolSelected] = useState<number>(4);
  const [msqScore, setMsqScore] = useState<number>(18);
  const [smartGoals, setSmartGoals] = useState<string[]>([
    'Consumir 2.800 mL de água pura diariamente',
    'Manter consumo proteico nas 4 refeições principais',
    '30 minutos de caminhada rápida 4x por semana'
  ]);
  const [newGoalInput, setNewGoalInput] = useState('');

  const notify = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleToggleFeature = (featId: string) => {
    setFeaturesList(prev =>
      prev.map(f => {
        if (f.id === featId) {
          const newState = !f.isActive;
          setConsultationsFeatureStatus(featId, newState);
          return { ...f, isActive: newState };
        }
        return f;
      })
    );
    notify('Status da funcionalidade de atendimento atualizado!');
  };

  const handleActivateAll = () => {
    activateAllConsultationsFeatures();
    setFeaturesList(prev =>
      prev.map(f => ({ ...f, isActive: true }))
    );
    notify('🎉 Todas as 10 Funções e Atividades de Atendimento foram ativadas com sucesso!');
  };

  const handleAddGoal = () => {
    if (!newGoalInput.trim()) return;
    setSmartGoals(prev => [...prev, newGoalInput.trim()]);
    setNewGoalInput('');
    notify('Meta SMART adicionada ao plano do atendimento!');
  };

  const handleRemoveGoal = (idx: number) => {
    setSmartGoals(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSaveConsultation = () => {
    const newRecord: ConsultationRecord = {
      id: `atend-${Date.now().toString().slice(-4)}`,
      patientId: 'pat-novo',
      patientName: newPatientName,
      patientAge: 32,
      patientGender: 'F',
      professionalName: user?.name || 'Dra. Mariana Costa Silva',
      professionalCrn: user?.crn || 'CRN-3 48.920',
      date: new Date().toLocaleDateString('pt-BR'),
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      type: newConsultType,
      status: 'Concluído',
      chiefComplaint: newChiefComplaint,
      soap: {
        subjective: soapS,
        objective: soapO,
        assessment: soapA,
        plan: soapP
      },
      anamnese: {
        clinicalHistory: 'Acompanhamento nutricional contínuo sem intercorrências agudas.',
        continuousMedications: 'Nenhum.',
        allergiesIntolerances: 'Intolerância moderada a leite integral.',
        familyHistory: 'Pai hipertenso.',
        sleepQuality: 'Boa (7.5h/noite)',
        hydrationMl: hydration,
        bowelHabits: 'Diário regular',
        bristolType: bristolSelected
      },
      metabolicScreeningScore: msqScore,
      smartGoals: smartGoals,
      nextReturnDate: '04/10/2026'
    };

    setConsultations(prev => [newRecord, ...prev]);
    setSelectedConsultation(newRecord);
    notify('Atendimento e Prontuário SOAP salvos com sucesso e sincronizados com o App do Paciente!');
    setActiveTab('lista');
  };

  const filteredConsultations = consultations.filter(c => {
    const matchSearch = c.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.chiefComplaint.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const allActive = featuresList.every(f => f.isActive);
  const activeCount = featuresList.filter(f => f.isActive).length;
  const msqStatus = calculateMsqScoreLevel(msqScore);

  return (
    <div id="modulo-atendimentos-clinicos" className="space-y-6 max-w-7xl mx-auto pb-20 font-sans">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 dark:bg-white text-white dark:text-slate-900 border border-emerald-500 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* BANNER MASTER: 10 Funções de Atendimentos & Prontuário Clínico */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-5 sm:p-6 border border-emerald-700/50 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono text-[11px] font-extrabold uppercase tracking-wider border border-emerald-400/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Prontuário SOAP & Consulta em Tempo Real
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-300 font-mono text-[11px] font-bold border border-sky-400/30">
                {activeCount}/10 Funções Ativas
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
              Atendimentos Clínicos, Prontuário & Laudos Oficiais
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Atendimento médico-nutricional estruturado (SOAP), Anamnese funcional, Recordatório 24h, Escala de Bristol, Rastreamento Metabólico (MSQ), Metas SMART e emissão de laudos em PDF A4.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
            <button
              id="btn-iniciar-foco-presencial-banner"
              type="button"
              onClick={() => enableClinicalFocus({ name: selectedConsultation?.patientName || newPatientName })}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold text-xs shadow-md transition-all cursor-pointer shrink-0"
              title="Iniciar Atendimento Presencial em Tela Cheia (Foco Zen) [Alt+F]"
            >
              <Maximize2 className="w-4 h-4" />
              <span>Modo Foco Presencial</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-600/30 text-slate-950 font-mono text-[10px]">Alt+F</span>
            </button>
            <button
              type="button"
              onClick={handleActivateAll}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer shrink-0"
            >
              <Zap className="w-4 h-4" />
              <span>{allActive ? 'Todas as 10 Funções Ativadas' : 'Ativar Todas as 10 Funções'}</span>
            </button>
            <button
              type="button"
              onClick={() => setShowFeaturesModal(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/20 transition-all cursor-pointer shrink-0"
            >
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>Ver Funções (10)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Principais de Atendimento */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('lista')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all cursor-pointer shrink-0 ${
            activeTab === 'lista'
              ? 'bg-emerald-600 text-white shadow-sm font-extrabold'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
          }`}
        >
          <ClipboardList className="w-4 h-4 text-emerald-300" />
          <span>Histórico de Atendimentos</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
            {consultations.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('novo_atendimento')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all cursor-pointer shrink-0 ${
            activeTab === 'novo_atendimento'
              ? 'bg-emerald-600 text-white shadow-sm font-extrabold'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
          }`}
        >
          <Plus className="w-4 h-4 text-emerald-400" />
          <span>Novo Atendimento (Sala Clínica)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('prontuario')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all cursor-pointer shrink-0 ${
            activeTab === 'prontuario'
              ? 'bg-emerald-600 text-white shadow-sm font-extrabold'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
          }`}
        >
          <FileText className="w-4 h-4 text-sky-400" />
          <span>Prontuário & Laudo SOAP</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('protocolos')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all cursor-pointer shrink-0 ${
            activeTab === 'protocolos'
              ? 'bg-emerald-600 text-white shadow-sm font-extrabold'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4 text-purple-400" />
          <span>Modelos & Protocolos de Anamnese</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('features')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all cursor-pointer shrink-0 ${
            activeTab === 'features'
              ? 'bg-emerald-600 text-white shadow-sm font-extrabold'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Gestão das 10 Funções</span>
        </button>

        <button
          id="btn-iniciar-foco-presencial-tabs"
          type="button"
          onClick={() => enableClinicalFocus({ name: selectedConsultation?.patientName || newPatientName })}
          className="ml-auto flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-sm cursor-pointer shrink-0"
        >
          <Maximize2 className="w-4 h-4" />
          <span className="hidden sm:inline">Prontuário em Tela Cheia</span>
          <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-emerald-800">Alt+F</span>
        </button>
      </div>

      {/* ABA 1: LISTA DE ATENDIMENTOS */}
      {activeTab === 'lista' && (
        <div className="space-y-6">
          {/* Barra de Filtros & Ações Rápidas */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por paciente ou queixa..."
                  className="w-full min-h-[44px] pl-10 pr-3 py-2 text-base sm:text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full sm:w-auto min-h-[44px] px-3.5 py-2 text-base sm:text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="all">Todos os Status</option>
                <option value="Concluído">Concluídos</option>
                <option value="Em Andamento">Em Andamento</option>
                <option value="Agendado">Agendados</option>
              </select>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={() => setActiveTab('novo_atendimento')}
                className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer shadow-2xs"
              >
                <Plus className="w-4 h-4" />
                <span>Iniciar Novo Atendimento</span>
              </button>
            </div>
          </div>

          {/* Grid de Atendimentos Realizados */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lista de Atendimentos */}
            <div className="lg:col-span-2 space-y-3">
              {filteredConsultations.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedConsultation(c)}
                  className={`p-4 rounded-3xl border transition-all cursor-pointer ${
                    selectedConsultation?.id === c.id
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-400 dark:border-emerald-700 shadow-xs'
                      : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                          {c.patientName}
                        </span>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {c.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-medium line-clamp-1">
                        {c.chiefComplaint}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-[11px] font-mono font-bold text-slate-900 dark:text-white">
                        {c.date} • {c.time}
                      </div>
                      <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                        {c.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-mono text-slate-500">
                    <div>MSQ: <strong className="text-slate-700 dark:text-slate-300">{c.metabolicScreeningScore} pts</strong></div>
                    <div>Bristol: <strong className="text-slate-700 dark:text-slate-300">Tipo {c.anamnese.bristolType}</strong></div>
                    <div>Retorno: <strong className="text-emerald-600 dark:text-emerald-400">{c.nextReturnDate || 'A definir'}</strong></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Painel Lateral: Detalhes Rápidos do Atendimento Selecionado */}
            {selectedConsultation && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Prontuário Ativo</span>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">{selectedConsultation.patientName}</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowLaudoModal(true);
                    }}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 cursor-pointer text-xs font-bold flex items-center gap-1"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Laudo</span>
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">Subjetivo (S)</span>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-0.5">{selectedConsultation.soap.subjective}</p>
                  </div>

                  <div>
                    <span className="font-mono text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase">Objetivo (O)</span>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-0.5">{selectedConsultation.soap.objective}</p>
                  </div>

                  <div>
                    <span className="font-mono text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase">Avaliação (A)</span>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-0.5">{selectedConsultation.soap.assessment}</p>
                  </div>

                  <div>
                    <span className="font-mono text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase">Plano (P)</span>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-0.5">{selectedConsultation.soap.plan}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-slate-900 dark:text-white block">Metas SMART Acordadas:</span>
                    <ul className="space-y-1">
                      {selectedConsultation.smartGoals.map((g, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{g}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('prontuario');
                    }}
                    className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Abrir Prontuário Completo</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ABA 2: NOVO ATENDIMENTO / SALA CLÍNICA EM TEMPO REAL */}
      {activeTab === 'novo_atendimento' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono text-[10px] font-bold uppercase">
                    Sala Clínica em Tempo Real
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Res. CFN nº 599/2018</span>
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                  Atendimento Clínico & Prontuário SOAP Estruturado
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => notify('Prescrição de suplementos e cálculo de TMB integrados ao atendimento!')}
                  className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Pill className="w-3.5 h-3.5" />
                  <span>Puxar Suplementos</span>
                </button>
                <button
                  type="button"
                  onClick={() => notify('Exames laboratoriais sincronizados com o prontuário!')}
                  className="px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Puxar Exames</span>
                </button>
              </div>
            </div>

            {/* Cabeçalho do Atendimento: Paciente, Tipo e Queixa */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Paciente
                </label>
                <select
                  value={newPatientName}
                  onChange={(e) => setNewPatientName(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 text-base sm:text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="Camila Mendonça Ferreira">Camila Mendonça Ferreira (32 anos)</option>
                  <option value="Rodrigo Silveira da Rocha">Rodrigo Silveira da Rocha (34 anos)</option>
                  <option value="Juliana Paes Cavalcanti">Juliana Paes Cavalcanti (28 anos)</option>
                  <option value="Marcos Vinicius Prado">Marcos Vinicius Prado (45 anos)</option>
                  <option value="Larissa Albuquerque Santos">Larissa Albuquerque Santos (38 anos)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tipo de Atendimento
                </label>
                <select
                  value={newConsultType}
                  onChange={(e) => setNewConsultType(e.target.value as any)}
                  className="w-full min-h-[44px] px-3.5 py-2 text-base sm:text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="Primeira Consulta">Primeira Consulta (Anamnese Completa)</option>
                  <option value="Consulta de Retorno">Consulta de Retorno (Evolução & Ajuste)</option>
                  <option value="Acompanhamento Trimestral">Acompanhamento Trimestral / Checkup</option>
                </select>
              </div>

              <div className="sm:col-span-2 lg:col-span-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Queixa Principal / Motivo da Consulta
                </label>
                <input
                  type="text"
                  value={newChiefComplaint}
                  onChange={(e) => setNewChiefComplaint(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 text-base sm:text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Ex.: Emagrecimento, melhora do sono e digestão..."
                />
              </div>
            </div>

            {/* BLOCO SOAP: SUBJETIVO, OBJETIVO, AVALIAÇÃO E PLANO */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-mono uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-500" />
                <span>Registro Estruturado Padrão SOAP</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* S - Subjetivo */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 font-mono">
                      (S) SUBJETIVO — Relato do Paciente & Hábitos
                    </span>
                    <span className="text-[10px] text-slate-400">Sintomas e Rotina</span>
                  </div>
                  <textarea
                    rows={4}
                    value={soapS}
                    onChange={(e) => setSoapS(e.target.value)}
                    className="w-full p-3 text-base sm:text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none font-sans min-h-[100px]"
                    placeholder="Relato do paciente, percepção de fome, energia, adesão..."
                  />
                </div>

                {/* O - Objetivo */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sky-700 dark:text-sky-400 font-mono">
                      (O) OBJETIVO — Dados Antropométricos & Exames
                    </span>
                    <span className="text-[10px] text-slate-400">Medições e Biomarcadores</span>
                  </div>
                  <textarea
                    rows={4}
                    value={soapO}
                    onChange={(e) => setSoapO(e.target.value)}
                    className="w-full p-3 text-base sm:text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none font-sans min-h-[100px]"
                    placeholder="Peso, dobras cutâneas, % gordura, glicemia, HOMA-IR..."
                  />
                </div>

                {/* A - Avaliação */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-700 dark:text-purple-400 font-mono">
                      (A) AVALIAÇÃO — Diagnóstico Nutricional
                    </span>
                    <span className="text-[10px] text-slate-400">Interpretação Clínica</span>
                  </div>
                  <textarea
                    rows={4}
                    value={soapA}
                    onChange={(e) => setSoapA(e.target.value)}
                    className="w-full p-3 text-base sm:text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none font-sans min-h-[100px]"
                    placeholder="Diagnóstico nutricional conclusivo, evolução clínica..."
                  />
                </div>

                {/* P - Plano */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-700 dark:text-amber-400 font-mono">
                      (P) PLANO — Conduta, Cardápio & Suplementação
                    </span>
                    <span className="text-[10px] text-slate-400">Prescrição Terapêutica</span>
                  </div>
                  <textarea
                    rows={4}
                    value={soapP}
                    onChange={(e) => setSoapP(e.target.value)}
                    className="w-full p-3 text-base sm:text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none font-sans min-h-[100px]"
                    placeholder="Conduta calórica, micronutrientes, suplementos, orientações..."
                  />
                </div>
              </div>
            </div>

            {/* SELETORES CLÍNICOS ESPECÍFICOS: BRISTOL E RASTREAMENTO METABÓLICO */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
              {/* Escala de Bristol */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <HeartPulse className="w-4 h-4 text-emerald-500" />
                    Escala de Bristol (Saúde Gastrointestinal)
                  </span>
                  <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    Tipo Selecionado: {bristolSelected}
                  </span>
                </div>

                <div className="space-y-1.5">
                  {BRISTOL_SCALE_ITEMS.map((item) => (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() => setBristolSelected(item.type)}
                      className={`w-full p-2 rounded-xl text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                        bristolSelected === item.type
                          ? 'bg-emerald-600 text-white font-bold shadow-xs'
                          : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{item.title}</span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                        bristolSelected === item.type ? 'bg-emerald-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}>
                        {item.status}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Rastreamento Metabólico (MSQ) & Metas SMART */}
              <div className="space-y-4">
                {/* Score MSQ */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-amber-500" />
                      Rastreamento Metabólico Funcional (MSQ)
                    </span>
                    <span className="text-xs font-mono font-extrabold text-slate-900 dark:text-white">
                      {msqScore} Pontos
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        {msqStatus.label}
                      </div>
                      <p className="text-[11px] text-slate-500">{msqStatus.description}</p>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={120}
                      value={msqScore}
                      onChange={(e) => setMsqScore(Number(e.target.value))}
                      className="w-28 accent-emerald-600 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Metas SMART */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
                  <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-sky-500" />
                    Metas SMART para o Paciente (App)
                  </span>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={newGoalInput}
                      onChange={(e) => setNewGoalInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddGoal()}
                      placeholder="Adicionar nova meta clara e mensurável..."
                      className="flex-1 min-h-[44px] px-3.5 py-2 text-base sm:text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddGoal}
                      className="min-h-[44px] px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shrink-0"
                    >
                      Adicionar Meta
                    </button>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    {smartGoals.map((g, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs">
                        <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          {g}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveGoal(idx)}
                          className="text-slate-400 hover:text-rose-500 cursor-pointer p-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Ações de Finalização do Atendimento */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Salvo e criptografado em conformidade com a LGPD e CFN nº 599/2018</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setShowLaudoModal(true)}
                  className="px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Gerar Laudo / Atestado</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveConsultation}
                  className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-colors cursor-pointer flex items-center gap-2 shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar Atendimento & Sincronizar App</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ABA 3: PRONTUÁRIO & LAUDO SOAP */}
      {activeTab === 'prontuario' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-2xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-500" />
                  <span>Prontuário Eletrônico & Registro Histórico</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Paciente: <strong>{selectedConsultation?.patientName || 'Camila Mendonça Ferreira'}</strong> • Nutricionista: <strong>{selectedConsultation?.professionalName || 'Dra. Mariana Costa Silva'}</strong>
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowLaudoModal(true)}
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Printer className="w-3.5 h-3.5 text-emerald-400" />
                <span>Imprimir Laudo A4</span>
              </button>
            </div>

            {/* Visualização Completa do SOAP */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                  (S) Subjetivo — Histórico do Paciente
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {selectedConsultation?.soap.subjective}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400 uppercase">
                  (O) Objetivo — Métricas & Exames
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {selectedConsultation?.soap.objective}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 uppercase">
                  (A) Avaliação — Diagnóstico Nutricional
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {selectedConsultation?.soap.assessment}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase">
                  (P) Plano — Conduta & Metas
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {selectedConsultation?.soap.plan}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ABA 4: MODELOS & PROTOCOLOS DE ANAMNESE */}
      {activeTab === 'protocolos' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-2xs space-y-5">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-500" />
                <span>Protocolos & Modelos Rápidos de Anamnese</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Modelos clínicos estruturados para preenchimento ágil durante a consulta conforme o perfil do paciente.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono text-[10px] font-bold">
                    Protocolo 1
                  </span>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">Emagrecimento & Recomposição</h3>
                  <p className="text-[11px] text-slate-500">
                    Foco em hábitos noturnos, gatilhos de compulsão, histórico de dietas e padrão do sono.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('novo_atendimento');
                    notify('Modelo de Emagrecimento aplicado na Sala Clínica!');
                  }}
                  className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Usar Protocolo
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 font-mono text-[10px] font-bold">
                    Protocolo 2
                  </span>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">Hipertrofia & Nutrição Esportiva</h3>
                  <p className="text-[11px] text-slate-500">
                    Mapeamento de timing de nutrientes no pré/intra/pós treino, suplementação e recuperação muscular.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('novo_atendimento');
                    notify('Modelo de Hipertrofia Esportiva aplicado na Sala Clínica!');
                  }}
                  className="w-full py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Usar Protocolo
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 font-mono text-[10px] font-bold">
                    Protocolo 3
                  </span>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">Saúde Intestinal & Low FODMAP</h3>
                  <p className="text-[11px] text-slate-500">
                    Triagem aprofundada de sintomas digestivos, distensão pós-prandial e intolerâncias fermentáveis.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('novo_atendimento');
                    notify('Modelo de Saúde Intestinal & FODMAP aplicado na Sala Clínica!');
                  }}
                  className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Usar Protocolo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ABA 5: GESTÃO DAS 10 FUNÇÕES & ATIVIDADES */}
      {activeTab === 'features' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-2xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  <span>Painel de Ativação das 10 Funções de Atendimento</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Ative ou desative individualmente as ferramentas clínicas e recursos de atendimento.
                </p>
              </div>

              <button
                type="button"
                onClick={handleActivateAll}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2 shrink-0"
              >
                <Zap className="w-4 h-4" />
                <span>Ativar Todas as 10 Funções</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featuresList.map((feat) => (
                <div
                  key={feat.id}
                  className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                    feat.isActive
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-70'
                  }`}
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-mono text-[10px] font-bold shrink-0">
                        {feat.number}
                      </span>
                      <h3 className="font-bold text-xs text-slate-900 dark:text-white">
                        {feat.title}
                      </h3>
                    </div>
                    <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                      {feat.category}
                    </span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleFeature(feat.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition-all cursor-pointer shrink-0 ${
                      feat.isActive
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {feat.isActive ? 'Ativo' : 'Inativo'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE LAUDO / ATESTADO CLÍNICO OFICIAL EM PDF A4 */}
      {showLaudoModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Documento Clínico Oficial Padrão CFN
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowLaudoModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Seleção do Tipo de Documento */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setLaudoType('laudo_clinico')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  laudoType === 'laudo_clinico'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                Laudo de Consulta
              </button>
              <button
                type="button"
                onClick={() => setLaudoType('atestado_comparecimento')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  laudoType === 'atestado_comparecimento'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                Atestado de Comparecimento
              </button>
              <button
                type="button"
                onClick={() => setLaudoType('declaracao_nutricional')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  laudoType === 'declaracao_nutricional'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                Declaração de Acompanhamento
              </button>
            </div>

            {/* Pré-visualização do Documento Timbrado */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-4 font-sans text-xs">
              <div className="text-center border-b border-slate-200 dark:border-slate-700 pb-3">
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                  {selectedClinic?.name || 'Clínica Nutrição Clínica & Metabólica Integrada'}
                </h4>
                <p className="text-[11px] text-slate-500">
                  {selectedConsultation?.professionalName || 'Dra. Mariana Costa Silva'} • {selectedConsultation?.professionalCrn || 'CRN-3 48.920'}
                </p>
              </div>

              <div className="space-y-2 text-slate-800 dark:text-slate-200">
                <p>
                  <strong>Paciente:</strong> {selectedConsultation?.patientName || 'Camila Mendonça Ferreira'}
                </p>
                <p>
                  <strong>Data do Atendimento:</strong> {selectedConsultation?.date || new Date().toLocaleDateString('pt-BR')} às {selectedConsultation?.time || '14:30'}
                </p>
                <p>
                  <strong>Queixa Principal:</strong> {selectedConsultation?.chiefComplaint}
                </p>

                {laudoType === 'laudo_clinico' && (
                  <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                    <p><strong>Diagnóstico e Conduta:</strong> {selectedConsultation?.soap.assessment}</p>
                    <p><strong>Orientações Terapêuticas:</strong> {selectedConsultation?.soap.plan}</p>
                  </div>
                )}

                {laudoType === 'atestado_comparecimento' && (
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                    <p className="leading-relaxed">
                      Atesto para os devidos fins que o(a) paciente acima identificado(a) esteve presente em consulta nutricional individualizada nesta data, no período compreendido entre 14:00 e 15:30.
                    </p>
                  </div>
                )}
              </div>

              <div className="text-center pt-4 border-t border-slate-200 dark:border-slate-700 text-slate-500 text-[10px]">
                Documento assinado digitalmente • Autenticidade verificável via QR Code
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowLaudoModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
              >
                Fechar
              </button>
              <button
                type="button"
                onClick={() => {
                  window.print();
                  notify('Laudo enviado para impressão / PDF A4!');
                  setShowLaudoModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir / Salvar PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL MASTER DE FUNÇÕES (10/10) */}
      {showFeaturesModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Todas as 10 Funções de Atendimento Clínico
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowFeaturesModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {featuresList.map((f) => (
                <div key={f.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-start justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center font-mono">
                        {f.number}
                      </span>
                      <strong className="text-slate-900 dark:text-white">{f.title}</strong>
                    </div>
                    <p className="text-[11px] text-slate-500">{f.description}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono text-[10px] font-bold shrink-0">
                    Ativo
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleActivateAll}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs cursor-pointer flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Ativar Todas</span>
              </button>
              <button
                type="button"
                onClick={() => setShowFeaturesModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
              >
                Concluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
