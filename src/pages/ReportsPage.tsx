import React, { useState } from 'react';
import {
  BarChart2,
  TrendingUp,
  Users,
  Activity,
  Award,
  Calendar,
  DollarSign,
  Download,
  Filter,
  FileSpreadsheet,
  FileText,
  Printer,
  Sparkles,
  Zap,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Building2,
  HeartPulse,
  Flame,
  PieChart as PieChartIcon,
  ChevronRight,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  FileCheck,
  Share2,
  Lock,
  Search,
  Layers,
  Database
} from 'lucide-react';
import {
  REPORTS_MASTER_FEATURES,
  ReportsMasterFeature,
  MOCK_PATIENT_EVOLUTIONS,
  MOCK_CLINICAL_OUTCOME_METRICS,
  MOCK_FINANCIAL_PERFORMANCE,
  MOCK_EPIDEMIOLOGY_PATOLOGIES,
  getReportsFeatureStatus,
  setReportsFeatureStatus,
  activateAllReportsFeatures,
  PatientEvolutionReportItem
} from '../data/reportsClinicalData';
import { useAuth } from '../contexts/AuthContext';
import { useClinic } from '../contexts/ClinicContext';

export const ReportsPage: React.FC = () => {
  const { user } = useAuth();
  const { selectedClinic, clinicList } = useClinic();

  // Master Features State (10/10)
  const [featuresList, setFeaturesList] = useState<ReportsMasterFeature[]>(() =>
    REPORTS_MASTER_FEATURES.map(f => ({
      ...f,
      isActive: getReportsFeatureStatus(f.id)
    }))
  );
  const [showFeaturesModal, setShowFeaturesModal] = useState(false);

  // Active View Tab
  const [activeTab, setActiveTab] = useState<'clinical_outcomes' | 'patient_evolution' | 'adherence_app' | 'financial_dre' | 'epidemiology' | 'export_audit' | 'features'>('clinical_outcomes');

  // Filters State
  const [periodFilter, setPeriodFilter] = useState<'30d' | '90d' | '180d' | 'year'>('90d');
  const [objectiveFilter, setObjectiveFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const notify = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleToggleFeature = (featId: string) => {
    setFeaturesList(prev =>
      prev.map(f => {
        if (f.id === featId) {
          const newState = !f.isActive;
          setReportsFeatureStatus(featId, newState);
          return { ...f, isActive: newState };
        }
        return f;
      })
    );
    notify('Status da funcionalidade do relatório atualizado!');
  };

  const handleActivateAll = () => {
    activateAllReportsFeatures();
    setFeaturesList(prev =>
      prev.map(f => ({ ...f, isActive: true }))
    );
    notify('🎉 Todas as 10 Funções e Atividades de Relatórios foram ativadas com sucesso!');
  };

  const handlePrint = () => {
    window.print();
  };

  // Filter patient list
  const filteredPatients = MOCK_PATIENT_EVOLUTIONS.filter(p => {
    const matchSearch = p.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.objective.toLowerCase().includes(searchTerm.toLowerCase());
    const matchObj = objectiveFilter === 'all' || p.objective.toLowerCase().includes(objectiveFilter.toLowerCase());
    return matchSearch && matchObj;
  });

  // Calculate Aggregated Metrics
  const totalPatientsEvaluated = MOCK_PATIENT_EVOLUTIONS.length;
  const avgWeightLoss = (
    MOCK_PATIENT_EVOLUTIONS.reduce((acc, p) => acc + p.weightDeltaKg, 0) / totalPatientsEvaluated
  ).toFixed(1);
  const avgFatLoss = (
    MOCK_PATIENT_EVOLUTIONS.reduce((acc, p) => acc + p.fatDeltaPct, 0) / totalPatientsEvaluated
  ).toFixed(1);
  const avgLeanGain = (
    MOCK_PATIENT_EVOLUTIONS.reduce((acc, p) => acc + p.leanMassDeltaKg, 0) / totalPatientsEvaluated
  ).toFixed(2);
  const avgAdherence = Math.round(
    MOCK_PATIENT_EVOLUTIONS.reduce((acc, p) => acc + p.adherenceScorePct, 0) / totalPatientsEvaluated
  );

  const allActive = featuresList.every(f => f.isActive);
  const activeCount = featuresList.filter(f => f.isActive).length;

  return (
    <div id="pagina-relatorios-clinicos" className="space-y-6 max-w-7xl mx-auto pb-20 font-sans">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 dark:bg-white text-white dark:text-slate-900 border border-emerald-500 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* BANNER MASTER: 10 Atividades & Funções de Relatórios Clínicos */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-5 sm:p-6 border border-emerald-700/50 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono text-[11px] font-extrabold uppercase tracking-wider border border-emerald-400/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Inteligência Clínica & Desfechos Nutricionais
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-300 font-mono text-[11px] font-bold border border-sky-400/30">
                {activeCount}/10 Atividades Ativas
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
              Central de Relatórios Clínicos, Gerenciais & DRE
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Consolidação de eficácia terapêutica, evolução de dobras cutâneas, aderência ao aplicativo, taxa de no-show, epidemiologia de patologias e exportações em PDF A4 executivo.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
            <button
              type="button"
              onClick={handleActivateAll}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer shrink-0"
            >
              <Zap className="w-4 h-4" />
              <span>{allActive ? 'Todas as 10 Atividades Ativadas' : 'Ativar Todas as 10 Atividades'}</span>
            </button>
            <button
              type="button"
              onClick={() => setShowFeaturesModal(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/20 transition-all cursor-pointer shrink-0"
            >
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>Ver Atividades (10)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Principais de Relatórios */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('clinical_outcomes')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all cursor-pointer shrink-0 ${
            activeTab === 'clinical_outcomes'
              ? 'bg-emerald-600 text-white shadow-sm font-extrabold'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
          }`}
        >
          <Award className="w-4 h-4 text-emerald-300" />
          <span>Eficácia & Desfechos Clínicos</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('patient_evolution')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all cursor-pointer shrink-0 ${
            activeTab === 'patient_evolution'
              ? 'bg-emerald-600 text-white shadow-sm font-extrabold'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-sky-400" />
          <span>Evolução Antropométrica (Pacientes)</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
            {MOCK_PATIENT_EVOLUTIONS.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('adherence_app')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all cursor-pointer shrink-0 ${
            activeTab === 'adherence_app'
              ? 'bg-emerald-600 text-white shadow-sm font-extrabold'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
          }`}
        >
          <Activity className="w-4 h-4 text-purple-400" />
          <span>Adesão & Engajamento no App</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('financial_dre')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all cursor-pointer shrink-0 ${
            activeTab === 'financial_dre'
              ? 'bg-emerald-600 text-white shadow-sm font-extrabold'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
          }`}
        >
          <DollarSign className="w-4 h-4 text-amber-400" />
          <span>Financeiro DRE & LTV / CAC</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('epidemiology')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all cursor-pointer shrink-0 ${
            activeTab === 'epidemiology'
              ? 'bg-emerald-600 text-white shadow-sm font-extrabold'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
          }`}
        >
          <HeartPulse className="w-4 h-4 text-rose-400" />
          <span>Epidemiologia & Patologias</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('export_audit')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all cursor-pointer shrink-0 ${
            activeTab === 'export_audit'
              ? 'bg-emerald-600 text-white shadow-sm font-extrabold'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
          }`}
        >
          <FileText className="w-4 h-4 text-blue-400" />
          <span>Exportação & Auditoria LGPD</span>
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
          <span>Gestão das 10 Atividades</span>
        </button>
      </div>

      {/* Barra de Filtros Clínicos e Ações de Exportação */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold">
            <Building2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>Unidade: {selectedClinic?.name || 'Todas as Unidades'}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold">
            <Calendar className="w-3.5 h-3.5 text-sky-500 shrink-0" />
            <select
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value as any)}
              className="bg-transparent focus:outline-hidden font-bold cursor-pointer"
            >
              <option value="30d">Últimos 30 dias</option>
              <option value="90d">Últimos 90 dias (Trimestre)</option>
              <option value="180d">Últimos 6 meses</option>
              <option value="year">Ano Corrente (2026)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir A4</span>
          </button>
          <button
            type="button"
            onClick={() => notify('Relatório consolidado exportado em Excel (.XLSX) com sucesso!')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 font-bold text-xs transition-colors cursor-pointer border border-emerald-200 dark:border-emerald-800"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Exportar XLSX</span>
          </button>
          <button
            type="button"
            onClick={() => notify('Relatório executivo gerado em PDF de Alta Resolução!')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PDF Executivo</span>
          </button>
        </div>
      </div>

      {/* ABA 1: EFICÁCIA & DESFECHOS CLÍNICOS */}
      {activeTab === 'clinical_outcomes' && (
        <div className="space-y-6">
          {/* Métricas Principais em Destaque */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                <span>Perda Média de Gordura</span>
                <Flame className="w-4 h-4 text-amber-500" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                  {avgFatLoss}
                </span>
                <span className="text-xs text-slate-500 font-bold font-mono">% corporal</span>
              </div>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono font-semibold flex items-center gap-1">
                <ArrowDownRight className="w-3.5 h-3.5" /> +58% vs. Meta Padrão
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                <span>Ganho Médio Massa Magra</span>
                <Award className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                  +{avgLeanGain}
                </span>
                <span className="text-xs text-slate-500 font-bold font-mono">kg muscular</span>
              </div>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono font-semibold flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> Balanço Nitrogenado Positivo
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                <span>Aderência Média ao App</span>
                <Activity className="w-4 h-4 text-purple-500" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                  {avgAdherence}%
                </span>
                <span className="text-xs text-slate-500 font-bold font-mono">cumprimento</span>
              </div>
              <p className="text-[11px] text-purple-600 dark:text-purple-400 font-mono font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Check-in & Fotos Diárias
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                <span>Taxa de Sucesso Clínico</span>
                <ShieldCheck className="w-4 h-4 text-sky-500" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                  91.8%
                </span>
                <span className="text-xs text-slate-500 font-bold font-mono">em meta</span>
              </div>
              <p className="text-[11px] text-sky-600 dark:text-sky-400 font-mono font-semibold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> Benchmark Brasil: 64%
              </p>
            </div>
          </div>

          {/* Tabela Estruturada de Indicadores de Qualidade Clínica */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white font-sans flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-emerald-500" />
                  <span>Matriz de Desfechos & Eficácia Terapêutica da Clínica</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Indicadores científicos consolidados com base em dados antropométricos, registros do diário e consultas de retorno.
                </p>
              </div>
              <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                Aprovado CFN & SBAN
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {MOCK_CLINICAL_OUTCOME_METRICS.map((metric, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {metric.metric}
                    </span>
                    <div className="flex items-baseline gap-1.5 pt-1">
                      <span className="text-2xl font-black text-slate-900 dark:text-white font-mono tabular-nums">
                        {metric.value}
                      </span>
                      {metric.unit && (
                        <span className="text-xs font-bold text-slate-500 font-mono">{metric.unit}</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-slate-200/60 dark:border-slate-700">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-400">Benchmark:</span>
                      <span className="text-slate-700 dark:text-slate-300 font-semibold">{metric.benchmark}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                      {metric.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ABA 2: EVOLUÇÃO ANTROPOMÉTRICA DOS PACIENTES */}
      {activeTab === 'patient_evolution' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white font-sans flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-sky-500" />
                  <span>Consolidação Individual de Evolução & Deltas de Composição</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Acompanhamento de peso, percentual de gordura (Pollock/Petroski) e ganho de massa magra consulta a consulta.
                </p>
              </div>

              {/* Busca e Filtro de Objetivo */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Filtrar por paciente..."
                    className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-hidden font-sans w-44 sm:w-56"
                  />
                </div>

                <select
                  value={objectiveFilter}
                  onChange={(e) => setObjectiveFilter(e.target.value)}
                  className="px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-bold focus:outline-hidden cursor-pointer"
                >
                  <option value="all">Todos os Objetivos</option>
                  <option value="emagrecimento">Emagrecimento</option>
                  <option value="hipertrofia">Hipertrofia</option>
                  <option value="saude">Saúde / SOP / Intestinal</option>
                </select>
              </div>
            </div>

            {/* Tabela Clínica com Números Tabulares Alinhados à Direita */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-mono uppercase text-[10px] tracking-wider border-y border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-3 px-3 font-bold">Paciente</th>
                    <th className="py-3 px-2 font-bold">Objetivo Principal</th>
                    <th className="py-3 px-2 font-bold text-center">Consultas</th>
                    <th className="py-3 px-3 font-bold text-right">Peso Inicial / Atual</th>
                    <th className="py-3 px-3 font-bold text-right">Δ Peso</th>
                    <th className="py-3 px-3 font-bold text-right">% Gordura (Δ)</th>
                    <th className="py-3 px-3 font-bold text-right">Massa Magra</th>
                    <th className="py-3 px-2 font-bold text-center">Adesão App</th>
                    <th className="py-3 px-3 font-bold text-center">Status Clínico</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredPatients.map((pat) => (
                    <tr key={pat.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900 dark:text-white">{pat.patientName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {pat.age} anos • {pat.gender === 'M' ? 'Masc' : 'Fem'} • Última: {pat.lastConsultationDate}
                        </div>
                      </td>

                      <td className="py-3 px-2 font-medium text-slate-600 dark:text-slate-300">
                        {pat.objective}
                      </td>

                      <td className="py-3 px-2 text-center font-mono font-bold text-slate-800 dark:text-slate-200">
                        {pat.consultationsCount}
                      </td>

                      <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-800 dark:text-slate-200">
                        <span className="text-slate-400">{pat.initialWeight}kg</span> → <strong className="font-bold text-slate-900 dark:text-white">{pat.currentWeight}kg</strong>
                      </td>

                      <td className="py-3 px-3 text-right font-mono tabular-nums font-extrabold">
                        <span className={pat.weightDeltaKg < 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}>
                          {pat.weightDeltaKg > 0 ? `+${pat.weightDeltaKg}` : pat.weightDeltaKg} kg
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right font-mono tabular-nums">
                        <div className="text-slate-700 dark:text-slate-300">
                          {pat.initialFatPct}% → {pat.currentFatPct}%
                        </div>
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                          ({pat.fatDeltaPct > 0 ? `+${pat.fatDeltaPct}` : pat.fatDeltaPct}%)
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right font-mono tabular-nums font-bold text-emerald-600 dark:text-emerald-400">
                        {pat.leanMassDeltaKg > 0 ? `+${pat.leanMassDeltaKg}` : pat.leanMassDeltaKg} kg
                      </td>

                      <td className="py-3 px-2 text-center">
                        <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                          pat.adherenceScorePct >= 90
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                        }`}>
                          {pat.adherenceScorePct}%
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold font-sans ${
                          pat.status === 'Meta Superada'
                            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                            : pat.status === 'Ativo em Meta'
                            ? 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/30'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}>
                          {pat.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ABA 3: ADESÃO & ENGAJAMENTO NO APP */}
      {activeTab === 'adherence_app' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-2xs space-y-4">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white font-sans flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-500" />
                <span>Monitoramento de Comportamento & Aderência ao Plano Alimentar</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Taxas de preenchimento do diário de refeições com fotos, consumo de água e registro de sintomas digestivos.
              </p>

              <div className="space-y-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                    <span>Adesão ao Checklist de Hidratação Diária (Meta: 35ml/kg)</span>
                    <span className="font-mono text-purple-600 dark:text-purple-400">92.4%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-purple-600 h-full rounded-full" style={{ width: '92.4%' }} />
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono">Consumo médio diário aferido: 2.850 mL por paciente.</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                    <span>Envio de Fotos e Registro de Refeições no Diário</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400">86.1%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full" style={{ width: '86.1%' }} />
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono">842 refeições registradas e analisadas no período.</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                    <span>Visualização do Cardápio & Substituições no Aplicativo</span>
                    <span className="font-mono text-sky-600 dark:text-sky-400">95.8%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-sky-600 h-full rounded-full" style={{ width: '95.8%' }} />
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono">Média de 4.2 aberturas do app por paciente ao dia.</p>
                </div>
              </div>
            </div>

            {/* Eficiência da Agenda & Redução de No-Show */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-2xs space-y-4">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white font-sans flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-500" />
                <span>Eficiência da Agenda & No-Show</span>
              </h2>

              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-1">
                <span className="text-xs font-mono text-emerald-800 dark:text-emerald-300 font-bold uppercase">Taxa de No-Show Atual</span>
                <div className="text-3xl font-black text-emerald-900 dark:text-emerald-100 font-mono">3.6%</div>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-300 font-medium">Redução de 78% após automação de confirmações via WhatsApp</p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                  <span>Consultas Realizadas:</span>
                  <strong className="font-mono text-slate-900 dark:text-white">168 atendimentos</strong>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                  <span>Remarcações Antecipadas:</span>
                  <strong className="font-mono text-slate-900 dark:text-white">9 (remanejadas)</strong>
                </div>
                <div className="flex justify-between py-1.5 text-slate-600 dark:text-slate-400">
                  <span>Faltas sem Aviso:</span>
                  <strong className="font-mono text-emerald-600 dark:text-emerald-400">6 (apenas 3.6%)</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ABA 4: FINANCEIRO DRE & LTV / CAC */}
      {activeTab === 'financial_dre' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-2xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white font-sans flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-500" />
                  <span>Demonstrativo de Resultados do Exercício (DRE Clínico)</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Faturamento bruto por tipo de atendimento, ticket médio e métricas de sustentabilidade financeira.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-xl">
                Faturamento Total: R$ 124.950,00
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {MOCK_FINANCIAL_PERFORMANCE.map((item, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-3">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-tight block">
                    {item.category}
                  </span>
                  <div className="text-xl font-black text-slate-900 dark:text-white font-mono tabular-nums">
                    R$ {item.revenue.toLocaleString('pt-BR')}
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 space-y-0.5 border-t border-slate-200 dark:border-slate-700 pt-2">
                    <div>Atendimentos: <strong className="text-slate-700 dark:text-slate-300">{item.consultationsCount}</strong></div>
                    <div>Ticket Médio: <strong className="text-slate-700 dark:text-slate-300">R$ {item.avgTicket}</strong></div>
                    <div className="text-emerald-600 dark:text-emerald-400 font-bold">Crescimento: +{item.growthPct}%</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Indicadores de LTV, CAC e Margem Operacional */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-xs text-slate-500 font-bold uppercase font-mono">LTV (Valor Vitalício do Paciente)</span>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">R$ 2.450,00</div>
                <p className="text-[10px] text-slate-500">Média de 4.8 renovações por paciente</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-xs text-slate-500 font-bold uppercase font-mono">CAC (Custo de Aquisição)</span>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">R$ 84,00</div>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Relação LTV / CAC = 29.1x (Excelente)</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-xs text-slate-500 font-bold uppercase font-mono">NPS & Satisfação Média</span>
                <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">94 pts</div>
                <p className="text-[10px] text-slate-500">Zona de Excelência (142 avaliações)</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ABA 5: EPIDEMIOLOGIA & PATOLOGIAS */}
      {activeTab === 'epidemiology' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-2xs space-y-5">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white font-sans flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-rose-500" />
                <span>Perfil Epidemiológico & Prevalência de Condições Clínicas</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Mapeamento das principais queixas metabólicas, intestinais e hormonais atendidas na clínica para direcionamento de protocolos.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {MOCK_EPIDEMIOLOGY_PATOLOGIES.map((pat, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                      {pat.condition}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 shrink-0">
                      {pat.percentage}%
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full rounded-full" style={{ width: `${pat.percentage}%` }} />
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1">
                    <span>Pacientes acometidos: <strong className="text-slate-700 dark:text-slate-300">{pat.count}</strong></span>
                    <span className={pat.trend === 'up' ? 'text-amber-500' : 'text-emerald-500'}>
                      {pat.trend === 'up' ? '↗ Tendência de Alta' : '↘ Controlado'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ABA 6: EXPORTAÇÃO & AUDITORIA LGPD */}
      {activeTab === 'export_audit' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-2xs space-y-5">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white font-sans flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Central de Exportações Seguras & Conformidade LGPD (Art. 18)</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Emissão de relatórios gerenciais com anonimização de dados pessoais e trilha de auditoria completa de acessos.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">Relatório Consolidado Excel (XLSX)</h3>
                  <p className="text-[11px] text-slate-500">
                    Planilha completa com dados brutos de dobras, cálculos de TMB, adesão e financeiro para análises estatísticas.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => notify('Exportação em formato XLSX concluída com sucesso!')}
                  className="w-full py-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Baixar Planilha XLSX
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 flex items-center justify-center font-bold">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">Laudo Executivo PDF A4</h3>
                  <p className="text-[11px] text-slate-500">
                    Documento diagramado para apresentação institucional a sócios, auditorias ou congressos de nutrição.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => notify('PDF Executivo A4 gerado e pronto para impressão!')}
                  className="w-full py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Gerar PDF A4
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">Portabilidade de Dados JSON LGPD</h3>
                  <p className="text-[11px] text-slate-500">
                    Arquivo criptografado estruturado conforme normas da ANPD para transferência segura de prontuários.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => notify('Pacote de portabilidade JSON gerado com hash de integridade SHA-256!')}
                  className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Exportar Pacote LGPD
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ABA 7: GESTÃO DAS 10 ATIVIDADES & RECURSOS */}
      {activeTab === 'features' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-2xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white font-sans flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  <span>Painel de Ativação das 10 Atividades & Relatórios Clínicos</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Ative ou desative individualmente os módulos de inteligência analítica e relatórios executivos.
                </p>
              </div>

              <button
                type="button"
                onClick={handleActivateAll}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2 shrink-0"
              >
                <Zap className="w-4 h-4" />
                <span>Ativar Todas as 10 Atividades</span>
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
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                        {feat.number}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-300 uppercase">
                        {feat.category}
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-slate-900 dark:text-white font-sans">
                      {feat.title}
                    </h3>

                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                      {feat.description}
                    </p>

                    <div className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 pt-1">
                      <strong>Impacto:</strong> {feat.clinicalImpact}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleFeature(feat.id)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                      feat.isActive ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        feat.isActive ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal Resumo das 10 Atividades */}
      {showFeaturesModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Matriz das 10 Atividades de Relatórios Clínicos
                </h3>
                <p className="text-xs text-slate-400 font-mono">100% dos relatórios analíticos integrados</p>
              </div>
              <button
                type="button"
                onClick={() => setShowFeaturesModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 cursor-pointer text-xs font-bold"
              >
                Fechar
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {featuresList.map(f => (
                <div key={f.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">{f.number}. {f.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
                      {f.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px]">{f.description}</p>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowFeaturesModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold cursor-pointer"
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
