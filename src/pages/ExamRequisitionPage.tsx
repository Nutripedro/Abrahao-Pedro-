import React, { useState, useEffect } from 'react';
import {
  ClipboardList,
  Search,
  CheckCircle2,
  Plus,
  Trash2,
  Printer,
  Sparkles,
  AlertCircle,
  FileCheck,
  User,
  Clock,
  Layers,
  Share2,
  Zap,
  ShieldCheck,
  Calculator,
  Activity,
  Flame,
  HeartPulse,
  Leaf,
  Sliders,
  ChevronRight,
  Download,
  QrCode,
  Building2,
  Tag,
  AlertTriangle,
  Info,
  Check,
  Stethoscope,
  RefreshCw,
  ExternalLink,
  BookOpen,
  HelpCircle
} from 'lucide-react';
import {
  CLINICAL_EXAMS_DATABASE,
  ClinicalExamItem,
  ExamCategory,
  PREDEFINED_CLINICAL_PANELS,
  CLINICAL_JUSTIFICATION_TEMPLATES,
  LAB_PARTNERS,
  EXAM_REQUISITION_MASTER_FEATURES,
  ExamRequisitionFeature,
  getExamFeatureStatus,
  setExamFeatureStatus,
  activateAllExamFeatures,
  calculateHomaIr,
  calculateHomaBeta,
  calculateTgHdlRatio,
  calculateNonHdlCholesterol,
  calculateCastelli1,
  calculateCastelli2,
  calculateDeRitisAstAltRatio
} from '../data/clinicalExamsData';
import { useAuth } from '../contexts/AuthContext';

export const ExamRequisitionPage: React.FC = () => {
  const { user } = useAuth();

  // Master Features State
  const [featuresList, setFeaturesList] = useState<ExamRequisitionFeature[]>(() =>
    EXAM_REQUISITION_MASTER_FEATURES.map(f => ({
      ...f,
      isActive: getExamFeatureStatus(f.id)
    }))
  );
  const [showFeaturesModal, setShowFeaturesModal] = useState(false);

  // Active View Tab
  const [activeTab, setActiveTab] = useState<'requisition' | 'protocols' | 'calculator' | 'results' | 'partners' | 'features'>('requisition');

  // Patient & Clinical Data
  const [patientName, setPatientName] = useState('Rodrigo Silveira da Rocha');
  const [patientAge, setPatientAge] = useState<number>(34);
  const [patientGender, setPatientGender] = useState<'M' | 'F'>('M');
  const [clinicalJustification, setClinicalJustification] = useState(
    'Investigação diagnóstica do metabolismo glicídico, perfil lipídico aterogênico e status de micronutrientes para adequação da conduta dietoterápica personalizada conforme Resolução CFN nº 656/2020.'
  );

  // Selected Exams List
  const [selectedExams, setSelectedExams] = useState<ClinicalExamItem[]>([
    CLINICAL_EXAMS_DATABASE[0].exams[0], // Glicemia de Jejum
    CLINICAL_EXAMS_DATABASE[0].exams[1], // Insulina Basal
    CLINICAL_EXAMS_DATABASE[0].exams[2], // HbA1c
    CLINICAL_EXAMS_DATABASE[1].exams[1], // HDL
    CLINICAL_EXAMS_DATABASE[1].exams[3], // Triglicerídeos
    CLINICAL_EXAMS_DATABASE[2].exams[0], // Vitamina D
    CLINICAL_EXAMS_DATABASE[2].exams[1], // Vitamina B12
  ]);

  // Catalog Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>('all');
  const [filterNutriOnly, setFilterNutriOnly] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Functional Calculator State
  const [calcGlucose, setCalcGlucose] = useState<number>(92);
  const [calcInsulin, setCalcInsulin] = useState<number>(14.5);
  const [calcTg, setCalcTg] = useState<number>(168);
  const [calcHdl, setCalcHdl] = useState<number>(42);
  const [calcTotalChol, setCalcTotalChol] = useState<number>(215);
  const [calcLdl, setCalcLdl] = useState<number>(139);
  const [calcAst, setCalcAst] = useState<number>(34);
  const [calcAlt, setCalcAlt] = useState<number>(46);

  // Results Entry State (Patient Received Values)
  const [enteredResults, setEnteredResults] = useState<Record<string, number>>({
    glicemia_jejum: 94,
    insulina_jejum: 15.2,
    hba1c: 5.6,
    hdl: 41,
    triglicerideos: 172,
    vitamina_d: 26,
    vitamina_b12: 380,
    ferritina: 140,
    creatinina: 0.95,
    tsh: 2.85
  });

  const notify = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleToggleFeature = (featId: string) => {
    setFeaturesList(prev =>
      prev.map(f => {
        if (f.id === featId) {
          const newState = !f.isActive;
          setExamFeatureStatus(featId, newState);
          return { ...f, isActive: newState };
        }
        return f;
      })
    );
    notify('Status da funcionalidade atualizado com sucesso!');
  };

  const handleActivateAll = () => {
    activateAllExamFeatures();
    setFeaturesList(prev =>
      prev.map(f => ({ ...f, isActive: true }))
    );
    notify('🎉 Todas as 10 Funções Avançadas foram ativadas com sucesso!');
  };

  const isExamSelected = (id: string) => selectedExams.some(e => e.id === id);

  const toggleExamSelection = (exam: ClinicalExamItem) => {
    if (isExamSelected(exam.id)) {
      setSelectedExams(prev => prev.filter(e => e.id !== exam.id));
      notify(`Removido: ${exam.name}`);
    } else {
      setSelectedExams(prev => [...prev, exam]);
      notify(`Adicionado: ${exam.name}`);
    }
  };

  const handleSelectPredefinedProtocol = (panelId: string) => {
    const protocol = PREDEFINED_CLINICAL_PANELS.find(p => p.id === panelId);
    if (!protocol) return;

    const allExamsFlat = CLINICAL_EXAMS_DATABASE.flatMap(c => c.exams);
    const foundExams = allExamsFlat.filter(ex => protocol.examIds.includes(ex.id));

    setSelectedExams(foundExams);
    setClinicalJustification(protocol.clinicalJustification);
    notify(`Protocolo "${protocol.title}" aplicado com ${foundExams.length} exames!`);
    setActiveTab('requisition');
  };

  const handleApplyJustificationTemplate = (text: string) => {
    setClinicalJustification(text);
    notify('Justificativa clínica padronizada aplicada!');
  };

  const handlePrint = () => {
    window.print();
  };

  // Exam Filtering
  const allFilteredCategories = CLINICAL_EXAMS_DATABASE.map(cat => {
    const exams = cat.exams.filter(ex => {
      const matchSearch =
        ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ex.clinicalIndication.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ex.synonyms && ex.synonyms.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())));
      const matchNutri = filterNutriOnly ? ex.isNutriAllowed : true;
      return matchSearch && matchNutri;
    });
    return { ...cat, exams };
  }).filter(cat => {
    if (activeCategoryTab !== 'all' && cat.id !== activeCategoryTab) return false;
    return cat.exams.length > 0;
  });

  // Calculate Fasting Window
  const maxFastHours = selectedExams.reduce((max, exam) => {
    return (exam.defaultFastHours || 0) > max ? exam.defaultFastHours || 0 : max;
  }, 0);

  // Fasting Prep Guidelines list
  const specificPrepGuidelines = Array.from(
    new Set(
      selectedExams
        .map(e => e.prepInstructions)
        .filter((p): p is string => Boolean(p))
    )
  );

  // Functional Indexes Calculations
  const calculatedHomaIr = calculateHomaIr(calcGlucose, calcInsulin);
  const calculatedHomaBeta = calculateHomaBeta(calcGlucose, calcInsulin);
  const calculatedTgHdl = calculateTgHdlRatio(calcTg, calcHdl);
  const calculatedNonHdl = calculateNonHdlCholesterol(calcTotalChol, calcHdl);
  const calculatedCastelli1 = calculateCastelli1(calcTotalChol, calcHdl);
  const calculatedCastelli2 = calculateCastelli2(calcLdl, calcHdl);
  const calculatedDeRitis = calculateDeRitisAstAltRatio(calcAst, calcAlt);

  const allActive = featuresList.every(f => f.isActive);
  const activeCount = featuresList.filter(f => f.isActive).length;

  return (
    <div id="pagina-requisicao-exames" className="space-y-6 max-w-7xl mx-auto pb-20">
      {/* Toast Notificação */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 dark:bg-white text-white dark:text-slate-900 border border-sky-500 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-sky-400 dark:text-sky-600 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* BANNER MASTER: 10 Funções Avançadas da Requisição de Exames */}
      <div className="bg-gradient-to-r from-sky-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-5 sm:p-6 border border-sky-700/50 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-300 font-mono text-[11px] font-extrabold uppercase tracking-wider border border-sky-400/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                Resolução CFN nº 656/2020 & Padrão SBPC/ML
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono text-[11px] font-bold border border-emerald-400/30">
                {activeCount}/10 Funções Ativas
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
              Requisição Inteligente & Bioquímica Funcional
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Prescrição de exames laboratoriais, protocolos clínicos em 1 clique, cálculo de índices funcionais (HOMA-IR, TG/HDL), comparativo de valores ótimos e integração com laboratórios parceiros.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
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
              <Sliders className="w-4 h-4 text-sky-400" />
              <span>Ver Recursos (10)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Principais de Navegação do Módulo */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('requisition')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all cursor-pointer shrink-0 ${
            activeTab === 'requisition'
              ? 'bg-sky-600 text-white shadow-sm font-extrabold'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>Requisição & Laudo Oficial</span>
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
            activeTab === 'requisition' ? 'bg-sky-700 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
          }`}>
            {selectedExams.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('protocols')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all cursor-pointer shrink-0 ${
            activeTab === 'protocols'
              ? 'bg-sky-600 text-white shadow-sm font-extrabold'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Protocolos Prontos (5)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('calculator')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all cursor-pointer shrink-0 ${
            activeTab === 'calculator'
              ? 'bg-sky-600 text-white shadow-sm font-extrabold'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
          }`}
        >
          <Calculator className="w-4 h-4 text-emerald-400" />
          <span>Calculadora de Índices Funcionais</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('results')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all cursor-pointer shrink-0 ${
            activeTab === 'results'
              ? 'bg-sky-600 text-white shadow-sm font-extrabold'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
          }`}
        >
          <Activity className="w-4 h-4 text-purple-400" />
          <span>Valores Ótimos vs. Convencionais</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('partners')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all cursor-pointer shrink-0 ${
            activeTab === 'partners'
              ? 'bg-sky-600 text-white shadow-sm font-extrabold'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4 text-blue-400" />
          <span>Laboratórios Parceiros & Descontos</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('features')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all cursor-pointer shrink-0 ${
            activeTab === 'features'
              ? 'bg-sky-600 text-white shadow-sm font-extrabold'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Gestão das 10 Funções</span>
        </button>
      </div>

      {/* ABA 1: REQUISIÇÃO & LAUDO OFICIAL */}
      {activeTab === 'requisition' && (
        <div className="space-y-6">
          {/* Identificação do Paciente, Conselho e Justificativas Rápidas */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-2xs space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs">
              <div>
                <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1">
                  Paciente
                </label>
                <div className="flex items-center gap-2 min-h-[44px] px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-white">
                  <User className="w-4 h-4 text-sky-500 shrink-0" />
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="bg-transparent w-full text-base sm:text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1">
                  Idade & Sexo Biológico
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    inputMode="numeric"
                    value={patientAge}
                    onChange={(e) => setPatientAge(Number(e.target.value))}
                    className="w-20 min-h-[44px] px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-center font-bold text-base sm:text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <select
                    value={patientGender}
                    onChange={(e) => setPatientGender(e.target.value as 'M' | 'F')}
                    className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-base sm:text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
                  >
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1">
                  Profissional Solicitante
                </label>
                <div className="min-h-[44px] flex items-center px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-slate-700 dark:text-slate-300 font-semibold truncate text-xs">
                  {user?.name || 'Dra. Vanessa Rios'} — {user?.councilInfo || 'CRN-3 14285'}
                </div>
              </div>

              <div>
                <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1">
                  Janela de Jejum Obrigatória
                </label>
                <div className="min-h-[44px] flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 font-mono text-amber-800 dark:text-amber-300 font-bold text-xs">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{maxFastHours > 0 ? `Jejum de ${maxFastHours} horas` : 'Sem jejum obrigatório'}</span>
                </div>
              </div>
            </div>

            {/* Presets de Justificativas Clínicas */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <label className="text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-sky-500" />
                  <span>Justificativa Clínica / Hipótese Diagnóstica (Resolução CFN nº 656/2020 & ANS)</span>
                </label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-slate-400 font-mono">Modelos rápidos:</span>
                  {CLINICAL_JUSTIFICATION_TEMPLATES.map(tmpl => (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => handleApplyJustificationTemplate(tmpl.text)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-sky-100 dark:hover:bg-sky-950 text-slate-700 dark:text-slate-300 hover:text-sky-700 dark:hover:text-sky-300 text-[10px] font-semibold transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
                    >
                      {tmpl.label}
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                rows={3}
                value={clinicalJustification}
                onChange={(e) => setClinicalJustification(e.target.value)}
                className="w-full p-3 text-base sm:text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-sans focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="Insira a justificativa clínica diagnóstica..."
              />
            </div>
          </div>

          {/* Grid Principal: Catálogo (Esquerda) vs. Requisição Formatada (Direita) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Catálogo de Exames */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-sky-500" />
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white font-sans">
                      Catálogo Centralizado de Biomarcadores
                    </h2>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                    Fonte Única JSON
                  </span>
                </div>

                {/* Filtros & Busca */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar por nome, sinônimo, indicação (ex: HOMA, B12, TSH)..."
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-sky-500 font-sans"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setFilterNutriOnly(!filterNutriOnly)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 border ${
                        filterNutriOnly
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                      title="Filtrar exames autorizados para nutricionistas"
                    >
                      Resolução CFN
                    </button>
                  </div>

                  {/* Pills de Categorias */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setActiveCategoryTab('all')}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold shrink-0 transition-colors cursor-pointer ${
                        activeCategoryTab === 'all'
                          ? 'bg-sky-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      Todos os Painéis
                    </button>
                    {CLINICAL_EXAMS_DATABASE.map(cat => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setActiveCategoryTab(cat.id)}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-bold shrink-0 transition-colors cursor-pointer ${
                          activeCategoryTab === cat.id
                            ? 'bg-sky-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {cat.title.split('&')[0]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Listagem de Exames com Detalhamento */}
                <div className="space-y-4 max-h-[640px] overflow-y-auto pr-1">
                  {allFilteredCategories.map(cat => (
                    <div key={cat.id} className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono px-1 border-b border-slate-100 dark:border-slate-800 pb-1">
                        <span>{cat.title}</span>
                        <span className="text-[10px] text-slate-400 lowercase font-normal">{cat.exams.length} exames</span>
                      </div>
                      <div className="space-y-2">
                        {cat.exams.map(exam => {
                          const selected = isExamSelected(exam.id);
                          return (
                            <div
                              key={exam.id}
                              onClick={() => toggleExamSelection(exam)}
                              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                                selected
                                  ? 'bg-sky-50/80 dark:bg-sky-950/40 border-sky-400 dark:border-sky-700 shadow-2xs'
                                  : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                              }`}
                            >
                              <div className="space-y-1.5 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                                    selected ? 'bg-sky-600 border-sky-600 text-white' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                                  }`}>
                                    {selected && <CheckCircle2 className="w-3 h-3" />}
                                  </span>
                                  <h4 className="text-xs font-bold text-slate-900 dark:text-white font-sans">
                                    {exam.name}
                                  </h4>
                                </div>

                                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug pl-6 font-sans">
                                  {exam.clinicalIndication}
                                </p>

                                <div className="pl-6 flex items-center gap-3 text-[10px] font-mono text-slate-500 dark:text-slate-400 flex-wrap">
                                  <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                                    Ref: {exam.referenceHealthy}
                                  </span>
                                  {exam.functionalOptimal && (
                                    <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded font-bold">
                                      Ótimo: {exam.functionalOptimal}
                                    </span>
                                  )}
                                  {exam.defaultFastHours !== undefined && (
                                    <span className="text-amber-600 dark:text-amber-400 font-semibold">
                                      • Jejum: {exam.defaultFastHours}h
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pedido de Exames Formatado / Laudo Executivo */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-2xs space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white font-sans flex items-center gap-2">
                      <FileCheck className="w-5 h-5 text-sky-500" />
                      <span>Laudo de Requisição Laboratorial</span>
                    </h2>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      {selectedExams.length} {selectedExams.length === 1 ? 'marcador selecionado' : 'marcadores selecionados'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handlePrint}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Imprimir / PDF A4</span>
                  </button>
                </div>

                {/* Folha Timbrada Oficial da Clínica */}
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 shadow-sm space-y-5 text-xs font-sans">
                  {/* Cabeçalho do Laudo */}
                  <div className="border-b border-slate-200 dark:border-slate-700 pb-4 flex items-start justify-between">
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider font-sans">
                        Requisição de Exames Bioquímicos
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                        Emissão Eletrônica • Resolução CFN nº 656/2020
                      </p>
                    </div>
                    <div className="text-right font-mono text-[10px] text-slate-400">
                      <div>Autenticador: {Math.random().toString(36).substring(2, 9).toUpperCase()}</div>
                      <div>{new Date().toLocaleDateString('pt-BR')}</div>
                    </div>
                  </div>

                  {/* Dados do Paciente */}
                  <div className="grid grid-cols-2 gap-2 text-slate-700 dark:text-slate-300 text-xs">
                    <div><strong className="text-slate-900 dark:text-white">Paciente:</strong> {patientName}</div>
                    <div><strong className="text-slate-900 dark:text-white">Idade / Sexo:</strong> {patientAge} anos ({patientGender === 'M' ? 'Masc' : 'Fem'})</div>
                    <div className="col-span-2">
                      <strong className="text-slate-900 dark:text-white">Hipótese / Justificativa Clínica:</strong> {clinicalJustification}
                    </div>
                  </div>

                  {/* Lista Numerada de Exames Solicitados */}
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-slate-900 dark:text-white">Exames Solicitados:</span>
                      <span className="text-[11px] font-mono text-slate-400">Total: {selectedExams.length}</span>
                    </div>

                    {selectedExams.length === 0 ? (
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-center text-slate-400 italic">
                        Nenhum exame selecionado ainda. Clique nos exames do catálogo ao lado ou escolha um protocolo pronto.
                      </div>
                    ) : (
                      <ol className="list-decimal pl-5 space-y-2">
                        {selectedExams.map((exam, idx) => (
                          <li key={idx} className="text-slate-800 dark:text-slate-200 font-medium">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <span className="font-bold">{exam.name}</span>
                                <span className="text-[10px] font-mono text-slate-400 block">
                                  Amostra: {exam.sampleType || 'Soro'} {exam.defaultFastHours ? `• Jejum: ${exam.defaultFastHours}h` : ''}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => toggleExamSelection(exam)}
                                className="text-slate-400 hover:text-red-500 p-1 cursor-pointer transition-colors"
                                title="Remover exame"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </li>
                        ))}
                      </ol>
                    )}
                  </div>

                  {/* Orientações ao Laboratório & Preparo do Paciente */}
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-3 text-[11px] text-slate-600 dark:text-slate-400 space-y-1.5 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                    <p className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span>Instruções de Coleta & Preparo:</span>
                    </p>
                    <p>• Apresentar-se com <strong>{maxFastHours} horas de jejum hídrico relativo</strong>.</p>
                    <p>• Abstenção de bebidas alcoólicas nas 48h prévias e evitar exercícios físicos extenuantes.</p>
                    {specificPrepGuidelines.map((guide, gIdx) => (
                      <p key={gIdx} className="text-slate-500 dark:text-slate-400">• {guide}</p>
                    ))}
                  </div>

                  {/* Assinatura Digital e Dados Profissionais */}
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-4 flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-extrabold text-slate-900 dark:text-white font-mono text-xs">
                        {user?.name || 'Dra. Vanessa Rios'}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                        {user?.councilInfo || 'CRN-3 14285'} • Nutricionista Clínica & Esportiva
                      </p>
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Assinatura Digital Certificada ICP-Brasil
                      </p>
                    </div>

                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400">
                      <QrCode className="w-8 h-8 text-slate-700 dark:text-slate-300" />
                      <span className="text-[8px] font-mono mt-0.5">Laudo Válido</span>
                    </div>
                  </div>
                </div>

                {/* Ações de Envio e Sincronização */}
                <div className="flex items-center justify-between gap-3 flex-wrap pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedExams([])}
                    className="text-xs font-bold text-slate-500 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    Limpar Todos os Exames
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => notify('Requisição sincronizada com o Aplicativo do Paciente!')}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Enviar ao App do Paciente</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => notify('Encaminhado para a rede de laboratórios conveniada com voucher de desconto!')}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                    >
                      <Building2 className="w-4 h-4" />
                      <span>Laboratório Conveniado</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ABA 2: PROTOCOLOS CLÍNICOS PRÉ-CONFIGURADOS */}
      {activeTab === 'protocols' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white font-sans flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <span>Protocolos Laboratoriais Estruturados por Objetivo Clínico</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Painéis validados cientificamente para aplicação em 1 clique na requisição com cálculo automático de jejum e justificativa padrão CFN.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {PREDEFINED_CLINICAL_PANELS.map(proto => (
                <div
                  key={proto.id}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 hover:border-sky-400 dark:hover:border-sky-600 transition-all flex flex-col justify-between space-y-4 shadow-2xs"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {proto.tags.map(t => (
                        <span key={t} className="px-2 py-0.5 rounded-md bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-mono text-[10px] font-bold">
                          {t}
                        </span>
                      ))}
                      <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-mono text-[10px] font-bold">
                        Jejum {proto.recommendedFasting}h
                      </span>
                    </div>

                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white font-sans">
                      {proto.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
                      {proto.objective}
                    </p>

                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                      <strong>Perfil:</strong> {proto.targetProfile}
                    </div>

                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      <strong>Exames inclusos ({proto.examIds.length}):</strong>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {proto.examIds.map(eid => {
                          const ex = CLINICAL_EXAMS_DATABASE.flatMap(c => c.exams).find(e => e.id === eid);
                          return (
                            <span key={eid} className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-[10px] text-slate-700 dark:text-slate-300">
                              {ex?.name.split('(')[0] || eid}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSelectPredefinedProtocol(proto.id)}
                    className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Aplicar Protocolo na Requisição</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ABA 3: CALCULADORA DE ÍNDICES LAB FUNCIONAIS */}
      {activeTab === 'calculator' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-2xs space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white font-sans flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-500" />
                <span>Calculadora e Motor de Índices Laboratoriais Funcionais</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Fórmulas puras, isoladas e rastreáveis para estimar sensibilidade insulínica, aterogênese e esteatose hepática.
              </p>
            </div>

            {/* Inputs de Biomarcadores */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">Glicemia Jejum (mg/dL)</label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={calcGlucose}
                  onChange={(e) => setCalcGlucose(Number(e.target.value))}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono font-bold text-base sm:text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">Insulina Basal (µUI/mL)</label>
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.1"
                  value={calcInsulin}
                  onChange={(e) => setCalcInsulin(Number(e.target.value))}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono font-bold text-base sm:text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">Triglicerídeos (mg/dL)</label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={calcTg}
                  onChange={(e) => setCalcTg(Number(e.target.value))}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono font-bold text-base sm:text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">HDL-Colesterol (mg/dL)</label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={calcHdl}
                  onChange={(e) => setCalcHdl(Number(e.target.value))}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono font-bold text-base sm:text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">Colesterol Total (mg/dL)</label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={calcTotalChol}
                  onChange={(e) => setCalcTotalChol(Number(e.target.value))}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono font-bold text-base sm:text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">LDL-Colesterol (mg/dL)</label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={calcLdl}
                  onChange={(e) => setCalcLdl(Number(e.target.value))}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono font-bold text-base sm:text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">TGO / AST (U/L)</label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={calcAst}
                  onChange={(e) => setCalcAst(Number(e.target.value))}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono font-bold text-base sm:text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">TGP / ALT (U/L)</label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={calcAlt}
                  onChange={(e) => setCalcAlt(Number(e.target.value))}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono font-bold text-base sm:text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            {/* Painel de Resultados Calculados com Interpretação Clínica */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Card HOMA-IR */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">Índice HOMA-IR</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                    calculatedHomaIr <= 1.4
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : calculatedHomaIr <= 2.15
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                  }`}>
                    {calculatedHomaIr <= 1.4 ? 'Ótimo Sensível' : calculatedHomaIr <= 2.15 ? 'Eutrófico Limítrofe' : 'Resistência à Insulina'}
                  </span>
                </div>
                <div className="text-3xl font-mono font-extrabold text-slate-900 dark:text-white">
                  {calculatedHomaIr}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                  Fórmula: (Glicemia x Insulina) / 405. Ponto de corte ótimo &lt; 1,40. Acima de 2,15 indica resistência periférica aumentada.
                </p>
              </div>

              {/* Card Relação TG / HDL */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">Relação Triglicerídeos / HDL</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                    calculatedTgHdl <= 2.0
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : calculatedTgHdl <= 3.0
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                  }`}>
                    {calculatedTgHdl <= 2.0 ? 'Baixo Risco' : calculatedTgHdl <= 3.0 ? 'Risco Moderado' : 'Aterogênico Elevado'}
                  </span>
                </div>
                <div className="text-3xl font-mono font-extrabold text-slate-900 dark:text-white">
                  {calculatedTgHdl}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                  Marcador substituto precoce de partículas pequenas e densas de LDL (sdLDL) e sobrecarga hepática. Ideal &lt; 2,0.
                </p>
              </div>

              {/* Card Colesterol Não-HDL */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">Colesterol Não-HDL</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                    calculatedNonHdl <= 130
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                  }`}>
                    {calculatedNonHdl <= 130 ? 'Meta Atingida' : 'Acima da Meta'}
                  </span>
                </div>
                <div className="text-3xl font-mono font-extrabold text-slate-900 dark:text-white">
                  {calculatedNonHdl} <span className="text-xs font-normal text-slate-400">mg/dL</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                  Colesterol Total menos HDL. Representa todas as lipoproteínas aterogênicas (VLDL, IDL, LDL).
                </p>
              </div>

              {/* Card Índice de Castelli I */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">Índice Castelli I (CT/HDL)</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                    calculatedCastelli1 <= 4.0
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                  }`}>
                    {calculatedCastelli1 <= 4.0 ? 'Favorável' : 'Elevado'}
                  </span>
                </div>
                <div className="text-3xl font-mono font-extrabold text-slate-900 dark:text-white">
                  {calculatedCastelli1}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                  Risco coronariano global. Valor de referência: &lt; 4,4 em mulheres e &lt; 5,0 em homens.
                </p>
              </div>

              {/* Card Índice de Castelli II */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">Índice Castelli II (LDL/HDL)</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                    calculatedCastelli2 <= 3.0
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                  }`}>
                    {calculatedCastelli2 <= 3.0 ? 'Adequado' : 'Elevado'}
                  </span>
                </div>
                <div className="text-3xl font-mono font-extrabold text-slate-900 dark:text-white">
                  {calculatedCastelli2}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                  Relação de partículas pró-aterogênicas versus anti-aterogênicas. Meta desejável &lt; 3,0.
                </p>
              </div>

              {/* Card Relação AST / ALT (De Ritis) */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">Relação AST / ALT (De Ritis)</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300">
                    Razão: {calculatedDeRitis}
                  </span>
                </div>
                <div className="text-3xl font-mono font-extrabold text-slate-900 dark:text-white">
                  {calculatedDeRitis}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                  Razão &lt; 1,0 com ALT elevada é compatível com Esteatose Hepática Não Alcoólica (MASLD/DHGNA).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ABA 4: VALORES ÓTIMOS VS. CONVENCIONAIS (TABELA COMPARATIVA) */}
      {activeTab === 'results' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-2xs space-y-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white font-sans flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-500" />
                <span>Faixas de Referência Laboratoriais: Convencionais vs. Ótimas Funcionais</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                A nutrição clínica funcional atua prevenindo desvios subclínicos antes do desenvolvimento de doenças crônicas.
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-3">Biomarcador</th>
                    <th className="p-3">Referência Convencional</th>
                    <th className="p-3">Faixa Ótima Funcional</th>
                    <th className="p-3">Resultado do Paciente</th>
                    <th className="p-3">Conduta Nutricional Sugerida</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                  {CLINICAL_EXAMS_DATABASE.flatMap(c => c.exams).slice(0, 10).map(exam => {
                    const currentVal = enteredResults[exam.id];
                    return (
                      <tr key={exam.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="p-3 font-bold text-slate-900 dark:text-white">
                          <div>{exam.name}</div>
                          <div className="text-[10px] font-mono text-slate-400">{exam.category}</div>
                        </td>
                        <td className="p-3 font-mono text-slate-500 dark:text-slate-400">
                          {exam.referenceHealthy}
                        </td>
                        <td className="p-3 font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50/40 dark:bg-emerald-950/20">
                          {exam.functionalOptimal || 'Faixa de normalidade'}
                        </td>
                        <td className="p-3">
                          <input
                            type="number"
                            inputMode="decimal"
                            value={currentVal || ''}
                            onChange={(e) => setEnteredResults({
                              ...enteredResults,
                              [exam.id]: Number(e.target.value)
                            })}
                            placeholder="Lançar valor"
                            className="w-28 min-h-[44px] px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 font-mono font-bold text-center text-base sm:text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                          />
                        </td>
                        <td className="p-3 text-[11px] text-slate-600 dark:text-slate-400">
                          {exam.clinicalIndication}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ABA 5: LABORATÓRIOS PARCEIROS & DESCONTOS */}
      {activeTab === 'partners' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-2xs space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white font-sans flex items-center gap-2">
                <Building2 className="w-5 h-5 text-sky-500" />
                <span>Redes de Laboratórios Conveniados & Descontos Exclusivos</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Parcerias integradas para exames particulares com tabela corporativa e coleta domiciliar para seus pacientes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {LAB_PARTNERS.map(lab => (
                <div
                  key={lab.id}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {lab.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono text-[10px] font-bold border border-emerald-300 dark:border-emerald-800">
                      {lab.discountBadge}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    <strong>Cobertura:</strong> {lab.coverage}
                  </p>

                  <p className="text-xs text-slate-600 dark:text-slate-300 font-sans">
                    {lab.instructions}
                  </p>

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-sky-600 dark:text-sky-400 font-bold">
                      Código Voucher: NUTRI-{user?.councilInfo ? user.councilInfo.replace(/\s+/g, '') : 'VIP'}
                    </span>
                    <button
                      type="button"
                      onClick={() => notify(`Voucher para ${lab.name} gerado e copiado!`)}
                      className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      Gerar Voucher Paciente
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ABA 6: GESTÃO DAS 10 FUNÇÕES AVANÇADAS */}
      {activeTab === 'features' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white font-sans flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  <span>Painel de Controle: 10 Funções Avançadas de Exames</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Ativação modular das ferramentas clínicas, cálculo de índices e conformidade com o CFN.
                </p>
              </div>

              <button
                type="button"
                onClick={handleActivateAll}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                <span>Ativar Todas as 10 Funções</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featuresList.map(feat => (
                <div
                  key={feat.id}
                  className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                    feat.isActive
                      ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
                      : 'bg-slate-100/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 opacity-60'
                  }`}
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-mono text-[10px] font-bold flex items-center justify-center">
                        {feat.number}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white font-sans">
                        {feat.title}
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      {feat.description}
                    </p>
                    <p className="text-[10px] text-emerald-700 dark:text-emerald-300 font-mono">
                      Impacto: {feat.clinicalImpact}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleFeature(feat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                      feat.isActive
                        ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {feat.isActive ? 'Ativo' : 'Ativar'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL / DRAWER DETALHADO DAS 10 FUNÇÕES AVANÇADAS */}
      {showFeaturesModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-sky-500" />
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    10 Recursos Master da Requisição Inteligente de Exames
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Conformidade com a Resolução CFN nº 656/2020 e Diretrizes SBPC/ML
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowFeaturesModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {featuresList.map(feat => (
                <div
                  key={feat.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-sky-600 text-white font-mono text-[10px] font-bold flex items-center justify-center">
                        {feat.number}
                      </span>
                      <strong className="text-slate-900 dark:text-white">{feat.title}</strong>
                      <span className="text-[10px] font-mono text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950 px-1.5 py-0.5 rounded">
                        {feat.category}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">{feat.description}</p>
                    <p className="text-emerald-600 dark:text-emerald-400 font-mono text-[10px]">
                      🎯 {feat.clinicalImpact}
                    </p>
                  </div>

                  <span className="px-2 py-1 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono text-[10px] font-bold shrink-0">
                    100% Liberado
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  handleActivateAll();
                  setShowFeaturesModal(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
              >
                Confirmar & Ativar Todos
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
