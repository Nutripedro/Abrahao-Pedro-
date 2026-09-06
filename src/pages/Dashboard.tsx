import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  Users,
  Calendar,
  Calculator,
  Smartphone,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Apple,
  Sparkles,
  PlusCircle,
  Scale,
  Building2,
  DollarSign
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Line,
  ComposedChart
} from 'recharts';

import { useAuth } from '../contexts/AuthContext';

const MONTHLY_STATS = [
  { mes: 'Mar', consultas: 28, avaliacoes: 22, mediaGordura: 23.4 },
  { mes: 'Abr', consultas: 34, avaliacoes: 29, mediaGordura: 22.8 },
  { mes: 'Mai', consultas: 41, avaliacoes: 35, mediaGordura: 22.1 },
  { mes: 'Jun', consultas: 39, avaliacoes: 32, mediaGordura: 21.6 },
  { mes: 'Jul', consultas: 46, avaliacoes: 38, mediaGordura: 21.0 },
  { mes: 'Ago', consultas: 52, avaliacoes: 44, mediaGordura: 20.4 },
];

const TODAY_APPOINTMENTS = [
  {
    id: 'apt-1',
    horario: '08:30',
    paciente: 'Mariana Lima Santos',
    tipo: 'Retorno & Dobras Cutâneas',
    status: 'confirmado',
    avatar: 'M',
    tag: 'Antropometria',
  },
  {
    id: 'apt-2',
    horario: '10:00',
    paciente: 'Carlos Eduardo Mendes',
    tipo: 'Primeira Consulta & Bioimpedância',
    status: 'confirmado',
    avatar: 'C',
    tag: 'Avaliação Inicial',
  },
  {
    id: 'apt-3',
    horario: '11:30',
    paciente: 'Beatriz Vasconcelos',
    tipo: 'Ajuste de Plano & Recomposição',
    status: 'em_atendimento',
    avatar: 'B',
    tag: 'Nutrição Clínica',
  },
  {
    id: 'apt-4',
    horario: '14:00',
    paciente: 'Lucas Gabriel Silveira',
    tipo: 'Acompanhamento do Atleta',
    status: 'pendente',
    avatar: 'L',
    tag: 'Nutrição Esportiva',
  },
  {
    id: 'apt-5',
    horario: '15:30',
    paciente: 'Juliana Costa e Silva',
    tipo: 'Dobras Cutâneas (7 Dobras JP)',
    status: 'confirmado',
    avatar: 'J',
    tag: 'Antropometria',
  },
];

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* 1. Header do Dashboard com Saudação & Ações Rápidas */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-sky-900 to-indigo-950 p-6 sm:p-8 rounded-3xl text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-200 border border-sky-400/30">
            <Sparkles className="w-3.5 h-3.5 text-sky-300" />
            <span>ClinicSaaS • Painel Clínico Ativo</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
            Olá, {user?.name || 'Dra. Vanessa Rios'}
          </h1>
          <p className="text-sky-200 text-sm max-w-xl">
            Sua central clínica está conectada com o aplicativo dos pacientes, agenda do dia e calculadoras antropométricas prontas para atendimento.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => navigate('/calculadoras/dobras-cutaneas')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <Calculator className="w-4 h-4 text-slate-950" />
            <span>Avaliação de Dobras</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/aplicativo')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 backdrop-blur-xs transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <Smartphone className="w-4 h-4 text-sky-300" />
            <span>Aplicativo do Paciente</span>
          </button>
        </div>
      </div>

      {/* 2. Cards de Métricas e KPIs do Consultório */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Pacientes Ativos</span>
            <div className="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-white">142</span>
            <span className="inline-flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              <ArrowUpRight className="w-3.5 h-3.5" /> +12%
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">18 novos cadastrados este mês</p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Avaliações de Dobras</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-white">44</span>
            <span className="inline-flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              <TrendingUp className="w-3.5 h-3.5" /> +8 este mês
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Média de %G: -1.8% de evolução</p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Consultas Hoje</span>
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-white">5</span>
            <span className="inline-flex items-center text-xs font-bold text-sky-600 dark:text-sky-400 font-mono">
              4 confirmadas
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Próxima às 10:00 (Carlos Eduardo)</p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Adesão ao Aplicativo</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-white">89%</span>
            <span className="inline-flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              <ArrowUpRight className="w-3.5 h-3.5" /> Ativo
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">112 pacientes registrando água e refeições</p>
        </div>
      </div>

      {/* 3. Atalhos Rápidos para os Módulos Clínicos Ativos */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>Acesso Rápido às Funções do Aplicativo</span>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            Pronto para uso
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {/* Card Gestão Financeira & DRE */}
          <div
            onClick={() => navigate('/financeiro')}
            className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-emerald-200 dark:border-emerald-900/60 shadow-xs hover:border-emerald-400 dark:hover:border-emerald-500 transition-all cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform">
              <DollarSign className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                Financeiro & DRE
              </h3>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                10/10 Ativo
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              Fluxo de caixa real-time, DRE clínico com EBITDA, cobrança Pix e recibos DMED/CFN.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span>Painel Financeiro</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
          {/* Card Dobras Cutâneas */}
          <div
            onClick={() => navigate('/calculadoras/dobras-cutaneas')}
            className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-sky-200 dark:border-sky-900/60 shadow-xs hover:border-sky-400 dark:hover:border-sky-500 transition-all cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-sky-500 text-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform">
              <Calculator className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
              Calculadora de Dobras
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              Protocolos Jackson-Pollock (3 e 7 dobras), Durnin-Womersley, perimetria e laudo PDF formatado.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-sky-600 dark:text-sky-400">
              <span>Abrir Avaliação</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card Aplicativo do Paciente */}
          <div
            onClick={() => navigate('/aplicativo')}
            className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-emerald-200 dark:border-emerald-900/60 shadow-xs hover:border-emerald-400 dark:hover:border-emerald-500 transition-all cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform">
              <Smartphone className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                App do Paciente
              </h3>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                10/10 Ativo
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              Central com 10 módulos liberados, simulador em tempo real, diário fotográfico, água e chat.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span>Central de Ativação</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card Unidades / Clínicas */}
          <div
            onClick={() => navigate('/unidades')}
            className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-teal-200 dark:border-teal-900/60 shadow-xs hover:border-teal-400 dark:hover:border-teal-500 transition-all cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-teal-600 text-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                Unidades & Clínicas
              </h3>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
                10/10 Ativo
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              Gestão de filiais, consultórios, calibração Inmetro de balanças/plicômetros e alvarás VISA.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-teal-600 dark:text-teal-400">
              <span>Gerenciar Unidades</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card Clientes & Prontuário */}
          <div
            onClick={() => navigate('/clientes')}
            className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-indigo-200 dark:border-indigo-900/60 shadow-xs hover:border-indigo-400 dark:hover:border-indigo-500 transition-all cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-indigo-500 text-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              Prontuário de Pacientes
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              Histórico clínico, evolução longitudinal, metas nutricionais e cadastro rápido de novos pacientes.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
              <span>Ver Pacientes</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card TMB & Calculadoras Clínicas */}
          <div
            onClick={() => navigate('/calculadoras/metabolismo')}
            className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-amber-200 dark:border-amber-900/60 shadow-xs hover:border-amber-400 dark:hover:border-amber-500 transition-all cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform">
              <Scale className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              TMB, GET & IMC
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              Equações de Harris-Benedict, Mifflin-St Jeor, Katch-McArdle, peso ideal e macronutrientes.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-amber-600 dark:text-amber-400">
              <span>Calcular Metabolismo</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Duas Colunas: Gráfico de Atendimentos vs Agenda de Hoje */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico Mensal Recharts (2 colunas) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Volume de Consultas & Média de Gordura Corporal
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Acompanhamento semestral de atendimentos e resposta clínica dos pacientes
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-sky-600 dark:text-sky-400">
                <span className="w-3 h-3 rounded bg-sky-500 inline-block" /> Consultas
              </span>
              <span className="flex items-center gap-1.5 text-amber-500">
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" /> % Gordura Médio
              </span>
            </div>
          </div>

          <div className="h-[280px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={MONTHLY_STATS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" className="opacity-30 dark:opacity-10" />
                <XAxis dataKey="mes" stroke="#94a3b8" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis yAxisId="left" stroke="#0284c7" tick={{ fontSize: 11, fill: '#0284c7' }} />
                <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" unit="%" domain={[18, 26]} tick={{ fontSize: 11, fill: '#f59e0b' }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg text-xs font-sans space-y-1">
                          <p className="font-bold text-slate-900 dark:text-white">{data.mes} de 2026</p>
                          <p className="text-sky-600 font-semibold">{data.consultas} Consultas realizadas</p>
                          <p className="text-amber-500 font-semibold">{data.mediaGordura}% %G corporal médio</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar yAxisId="left" dataKey="consultas" fill="#0284c7" radius={[8, 8, 0, 0]} maxBarSize={40} />
                <Line yAxisId="right" type="monotone" dataKey="mediaGordura" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: '#f59e0b' }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Agenda de Hoje (1 coluna) */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span>Agenda de Hoje</span>
              </h3>
              <button
                type="button"
                onClick={() => navigate('/agenda')}
                className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
              >
                Ver tudo
              </button>
            </div>

            <div className="space-y-3">
              {TODAY_APPOINTMENTS.map((apt) => (
                <div
                  key={apt.id}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300 w-12 shrink-0">
                      {apt.horario}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {apt.paciente}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {apt.tipo}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate('/calculadoras/dobras-cutaneas')}
                    className="p-2 rounded-xl bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300 hover:bg-sky-200 dark:hover:bg-sky-900 text-xs font-bold shrink-0 transition-colors cursor-pointer"
                    title="Iniciar avaliação antropométrica"
                  >
                    Atender
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => navigate('/agenda')}
              className="w-full py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all text-center cursor-pointer"
            >
              Abrir Calendário Completo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
