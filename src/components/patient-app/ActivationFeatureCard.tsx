import React from 'react';
import { 
  Utensils, Droplet, Pill, FileSpreadsheet, TrendingUp, 
  BookOpen, MessageSquare, Bell, ShoppingCart, WifiOff,
  CheckCircle2, Shield, Info, ArrowUpRight
} from 'lucide-react';
import { PatientAppFeaturesState } from '../../contexts/PatientAppContext';

export interface FeatureMeta {
  key: keyof PatientAppFeaturesState;
  title: string;
  category: 'nutricao' | 'clinico' | 'comunicacao' | 'sistema';
  categoryLabel: string;
  description: string;
  clinicalImpact: string;
  regulatoryInfo?: string;
  iconName: 'utensils' | 'droplet' | 'pill' | 'exam' | 'trend' | 'menu' | 'chat' | 'bell' | 'cart' | 'offline';
}

export const FEATURES_CATALOG: FeatureMeta[] = [
  {
    key: 'foodDiary',
    title: 'Diário Alimentar Fotográfico & Saciedade',
    category: 'nutricao',
    categoryLabel: 'Nutrição & Rotina',
    description: 'Permite ao paciente registrar fotos reais das refeições, avaliar a escala de fome pré e saciedade pós (1-10) e receber feedback pontual.',
    clinicalImpact: 'Aumenta a adesão alimentar em 42% e previne episódios de compulsão ou omissão de refeições.',
    regulatoryInfo: 'CFN Res. 600/2018',
    iconName: 'utensils'
  },
  {
    key: 'waterTracker',
    title: 'Rastreador Inteligente de Hidratação',
    category: 'nutricao',
    categoryLabel: 'Nutrição & Rotina',
    description: 'Cálculo metabólico automatizado (35 a 45 ml/kg de peso corporal). Botões rápidos (+150ml, +250ml, +500ml) e alerta sonoro de intervalos.',
    clinicalImpact: 'Mantém volemia, previne falsa fome por desidratação e potencializa filtração glomerular.',
    regulatoryInfo: 'Diretrizes DRI / IOM',
    iconName: 'droplet'
  },
  {
    key: 'supplementRoutine',
    title: 'Receituário Digital de Suplementos & Lembretes',
    category: 'clinico',
    categoryLabel: 'Clínico & Prescrição',
    description: 'Sincronização imediata da prescrição (Creatina, Ômega-3, Vitaminas, Fitoterápicos). Alertas posológicos e horários estratégicos de absorção.',
    clinicalImpact: 'Elimina esquecimentos e garante biodisponibilidade máxima com alimentos carreadores lipídicos.',
    regulatoryInfo: 'RDC ANVISA 243/2018',
    iconName: 'pill'
  },
  {
    key: 'examPanel',
    title: 'Requisições de Exames & Preparo Laboratorial',
    category: 'clinico',
    categoryLabel: 'Clínico & Prescrição',
    description: 'Acesso do paciente aos pedidos de exames com cálculo do tempo exato de jejum (ex: 8h glicemia, 12h lipídios) e upload de laudos laboratoriais.',
    clinicalImpact: 'Evita recoletas por erro de preparo do paciente e centraliza histórico bioquímico.',
    regulatoryInfo: 'Res. CFN 306 & RDC Anvisa 786',
    iconName: 'exam'
  },
  {
    key: 'evolutionCharts',
    title: 'Evolução Corporal & Dobras Cutâneas ISAK',
    category: 'clinico',
    categoryLabel: 'Clínico & Prescrição',
    description: 'Visualização intuitiva de curvas de %Gordura (Jackson-Pollock 7 dobras, Faulkner), massa muscular em kg, somatório de dobras e peso.',
    clinicalImpact: 'Foco na recomposição corporal e massa magra, desmistificando flutuações agudas de balança.',
    regulatoryInfo: 'Protocolos ISAK / ACSM',
    iconName: 'trend'
  },
  {
    key: 'mealPlanSubstitutions',
    title: 'Cardápio Completo com Lista de Substituições',
    category: 'nutricao',
    categoryLabel: 'Nutrição & Rotina',
    description: 'Visualização organizada de todas as refeições prescritas, gramaturas e tabela dinâmica de substitutos por grupo alimentar equivalente.',
    clinicalImpact: 'Autonomia alimentar ao paciente fora de casa (restaurantes, viagens) sem quebrar o balanço calórico.',
    regulatoryInfo: 'Tabela TACO / TBCA',
    iconName: 'menu'
  },
  {
    key: 'directChat',
    title: 'Chat Clínico Criptografado & Suporte Direto',
    category: 'comunicacao',
    categoryLabel: 'Comunicação & Segurança',
    description: 'Canal seguro para esclarecimento de dúvidas pontuais entre as consultas, envio de rótulos de alimentos e mensagens da nutricionista.',
    clinicalImpact: 'Reduz cancelamentos de retorno e estreita a relação terapêutica nutricionista-paciente.',
    regulatoryInfo: 'LGPD Art. 5º, II & Código de Ética',
    iconName: 'chat'
  },
  {
    key: 'pushReminders',
    title: 'Disparador & Agendamento de Notificações Push',
    category: 'comunicacao',
    categoryLabel: 'Comunicação & Segurança',
    description: 'Alertas automáticos no smartphone do paciente para beber água, tomar suplemento matinal/noturno e preparar refeições.',
    clinicalImpact: 'Construção de hábitos sustentáveis nos primeiros 21 dias do plano alimentar.',
    regulatoryInfo: 'Notificações PWA / WebPush',
    iconName: 'bell'
  },
  {
    key: 'smartGroceryList',
    title: 'Lista de Compras Inteligente do Cardápio',
    category: 'nutricao',
    categoryLabel: 'Nutrição & Rotina',
    description: 'Agrupamento semanal automatizado dos ingredientes prescritos por corredores de mercado (hortifrúti, açougue, despensa) com checkboxes.',
    clinicalImpact: 'Planejamento antecipado de compras, reduzindo desperdício e eliminando compras impulsivas ultraprocessadas.',
    regulatoryInfo: 'Guia Alimentar MS',
    iconName: 'cart'
  },
  {
    key: 'pwaOfflineMode',
    title: 'Modo Offline PWA & Armazenamento Seguro',
    category: 'sistema',
    categoryLabel: 'Infraestrutura & Segurança',
    description: 'Funcionamento completo mesmo em locais sem sinal de internet ou operadora. Criptografia local dos dados clínicos em conformidade com a LGPD.',
    clinicalImpact: 'Garante acesso ao plano alimentar e prescrições em academias, consultórios e voos.',
    regulatoryInfo: 'LGPD & ISO 27001',
    iconName: 'offline'
  }
];

interface ActivationFeatureCardProps {
  meta: FeatureMeta;
  active: boolean;
  onToggle: () => void;
}

export const ActivationFeatureCard: React.FC<ActivationFeatureCardProps> = ({
  meta,
  active,
  onToggle
}) => {
  const renderIcon = () => {
    switch (meta.iconName) {
      case 'utensils': return <Utensils className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'droplet': return <Droplet className="w-4 h-4 text-sky-600 dark:text-sky-400" />;
      case 'pill': return <Pill className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case 'exam': return <FileSpreadsheet className="w-4 h-4 text-violet-600 dark:text-violet-400" />;
      case 'trend': return <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'menu': return <BookOpen className="w-4 h-4 text-teal-600 dark:text-teal-400" />;
      case 'chat': return <MessageSquare className="w-4 h-4 text-sky-600 dark:text-sky-400" />;
      case 'bell': return <Bell className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case 'cart': return <ShoppingCart className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
      case 'offline': return <WifiOff className="w-4 h-4 text-stone-600 dark:text-stone-400" />;
    }
  };

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 p-4 sm:p-5 flex flex-col justify-between gap-3.5 ${
        active
          ? 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 shadow-2xs'
          : 'bg-stone-100/60 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800/80 opacity-75'
      }`}
    >
      <div className="space-y-2.5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl border ${
              active 
                ? 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700' 
                : 'bg-stone-200 dark:bg-stone-800 border-stone-300 dark:border-stone-700'
            }`}>
              {renderIcon()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300">
                  {meta.categoryLabel}
                </span>
                {meta.regulatoryInfo && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700">
                    {meta.regulatoryInfo}
                  </span>
                )}
              </div>
              <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100 leading-snug">
                {meta.title}
              </h3>
            </div>
          </div>

          {/* Switch Toggle */}
          <button
            type="button"
            onClick={onToggle}
            role="switch"
            aria-checked={active}
            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 focus:outline-hidden focus:ring-2 focus:ring-stone-400 ${
              active ? 'bg-emerald-600' : 'bg-stone-300 dark:bg-stone-700'
            }`}
            title={active ? 'Desativar este recurso' : 'Ativar este recurso'}
          >
            <span
              className={`w-4 h-4 rounded-full bg-white shadow-xs absolute top-1 transition-transform ${
                active ? 'left-6' : 'left-1'
              }`}
            />
          </button>
        </div>

        <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
          {meta.description}
        </p>
      </div>

      <div className="pt-2.5 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between gap-2 text-[11px]">
        <span className="text-stone-500 dark:text-stone-400 flex items-center gap-1.5 truncate">
          <Info className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <span className="truncate">{meta.clinicalImpact}</span>
        </span>
        <span className={`font-mono font-semibold shrink-0 ${active ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-400'}`}>
          {active ? '● Ativo' : '○ Pausado'}
        </span>
      </div>
    </div>
  );
};
