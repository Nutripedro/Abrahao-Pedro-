import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Smartphone,
  CheckCircle2,
  Bell,
  Sparkles,
  Zap,
  ShieldCheck,
  Share2,
  QrCode,
  Check,
  Sliders,
  Send,
  RefreshCw,
  Lock,
  ArrowRight,
  Info,
  Layers,
  HeartPulse,
  Activity,
  UserCheck
} from 'lucide-react';
import { usePatientApp } from '../contexts/PatientAppContext';
import { FEATURES_CATALOG, ActivationFeatureCard } from '../components/patient-app/ActivationFeatureCard';
import { SmartphoneSimulator } from '../components/patient-app/SmartphoneSimulator';
import { ShareModal } from '../components/patient-app/ShareModal';

export const PatientAppPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    features,
    allFeaturesActive,
    activeFeaturesCount,
    totalFeaturesCount,
    toggleFeature,
    activateAllFeatures,
    deactivateAllFeatures,
    patientName,
    patientToken,
    syncTimestamp
  } = usePatientApp();

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'todas' | 'nutricao' | 'clinico' | 'comunicacao' | 'sistema'>('todas');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Push notification state for the simulator
  const [pushNotification, setPushNotification] = useState<{ title: string; body: string } | null>(null);
  const [customPushText, setCustomPushText] = useState('Lembrete clínico: hora de beber 250ml de água e registrar o almoço!');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Play subtle clinical chime via Web Audio API
  const playActivationChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch {
      // ignore audio context restrictions
    }
  };

  const handleActivateAll = () => {
    activateAllFeatures();
    playActivationChime();
    showToast('✓ TODAS AS FUNÇÕES ATIVADAS! Todos os 10 módulos do Aplicativo do Paciente estão 100% operacionais.');
  };

  const handleTriggerPush = () => {
    setPushNotification({
      title: 'Consultório Dra. Vanessa Rios',
      body: customPushText || 'Novo lembrete sobre o seu plano alimentar!'
    });
    showToast('Notificação push enviada ao smartphone do paciente.');
  };

  const filteredFeatures = FEATURES_CATALOG.filter(f => {
    if (activeCategoryFilter === 'todas') return true;
    return f.category === activeCategoryFilter;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto font-sans">
      {/* Toast de Feedback Clínico */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 px-5 py-3.5 rounded-2xl shadow-2xl border border-stone-700 dark:border-stone-200 flex items-center gap-3 animate-in slide-in-from-top-4 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        patientName={patientName}
        patientToken={patientToken}
      />

      {/* 1. Header do Módulo & Central de Ativação */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-stone-200 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-3 mb-1.5 flex-wrap">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Smartphone className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
              Aplicativo do Paciente • Central de Ativação
            </h1>
            <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
              allFeaturesActive
                ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                : 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800'
            }`}>
              <span className={`w-2 h-2 rounded-full ${allFeaturesActive ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              {allFeaturesActive ? '100% OPERACIONAL • TODAS AS 10 FUNÇÕES ATIVAS' : `${activeFeaturesCount} de ${totalFeaturesCount} Funções Ativas`}
            </span>
          </div>
          <p className="text-sm text-stone-600 dark:text-stone-400 max-w-3xl">
            Console central de ativação e sincronização do aplicativo do paciente. Controle o acesso ao cardápio, receituário de suplementos, requisições de exames, rastreador de hidratação e teste no simulador interativo em tempo real.
          </p>
        </div>

        {/* Master Actions */}
        <div className="flex items-center gap-3 flex-wrap shrink-0">
          <button
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-700 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors cursor-pointer border border-stone-200 dark:border-stone-700"
          >
            <Share2 className="w-4 h-4 text-emerald-600" />
            <span>Compartilhar App</span>
          </button>

          <button
            type="button"
            onClick={handleActivateAll}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm hover:shadow-md transition-all cursor-pointer hover:scale-[1.02]"
            title="Ativar todas as 10 funções do aplicativo do paciente de uma só vez"
          >
            <Zap className="w-4 h-4" />
            <span>ATIVAR TODAS AS FUNÇÕES (10/10)</span>
          </button>
        </div>
      </div>

      {/* 2. Banner de Status da Central & Compliance LGPD */}
      <div className="bg-stone-50 dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                Sincronização em Nuvem Criptografada
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                LGPD Art. 5º, II
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Paciente ativo: <strong className="text-stone-800 dark:text-stone-200">{patientName}</strong> • Token Seguro: <code className="font-mono text-emerald-600 dark:text-emerald-400">{patientToken}</code> • Última sincronização: <span className="font-mono">{syncTimestamp}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-stretch md:self-auto justify-end">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Status dos Módulos</span>
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
              {activeFeaturesCount} de {totalFeaturesCount} Operacionais (100%)
            </span>
          </div>

          <button
            type="button"
            onClick={handleActivateAll}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-800 dark:text-emerald-200 bg-emerald-100 dark:bg-emerald-950/80 hover:bg-emerald-200 dark:hover:bg-emerald-900 border border-emerald-300 dark:border-emerald-700 cursor-pointer flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Revalidar Todas</span>
          </button>
        </div>
      </div>

      {/* 3. Grid Principal: Console da Central de Ativação (7 colunas) + Smartphone Simulator (5 colunas) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* COLUNA ESQUERDA: Console de Ativação de Recursos */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card com as 10 Funções e Filtros de Categoria */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 shadow-2xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100 dark:border-stone-800">
              <div>
                <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Central de Módulos do Paciente ({activeFeaturesCount}/{totalFeaturesCount})</span>
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  Ligue ou desligue módulos individuais ou use o botão de ativação total.
                </p>
              </div>

              {/* Botão rápido para ativar todas se alguma estiver desativada */}
              {!allFeaturesActive && (
                <button
                  type="button"
                  onClick={handleActivateAll}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition-colors cursor-pointer self-start sm:self-auto"
                >
                  Ativar Todas
                </button>
              )}
            </div>

            {/* Filtros de Categoria */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <button
                type="button"
                onClick={() => setActiveCategoryFilter('todas')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer shrink-0 ${
                  activeCategoryFilter === 'todas'
                    ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                Todas as Funções ({totalFeaturesCount})
              </button>
              <button
                type="button"
                onClick={() => setActiveCategoryFilter('nutricao')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer shrink-0 ${
                  activeCategoryFilter === 'nutricao'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                Nutrição & Rotina (4)
              </button>
              <button
                type="button"
                onClick={() => setActiveCategoryFilter('clinico')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer shrink-0 ${
                  activeCategoryFilter === 'clinico'
                    ? 'bg-amber-600 text-white'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                Clínico & Prescrição (3)
              </button>
              <button
                type="button"
                onClick={() => setActiveCategoryFilter('comunicacao')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer shrink-0 ${
                  activeCategoryFilter === 'comunicacao'
                    ? 'bg-sky-600 text-white'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                Comunicação & Push (2)
              </button>
              <button
                type="button"
                onClick={() => setActiveCategoryFilter('sistema')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer shrink-0 ${
                  activeCategoryFilter === 'sistema'
                    ? 'bg-stone-700 text-white'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                Sistema & Offline (1)
              </button>
            </div>

            {/* Lista dos Cards de Funções */}
            <div className="grid grid-cols-1 gap-3.5">
              {filteredFeatures.map(meta => (
                <ActivationFeatureCard
                  key={meta.key}
                  meta={meta}
                  active={features[meta.key]}
                  onToggle={() => {
                    toggleFeature(meta.key);
                    showToast(`Recurso "${meta.title}" ${features[meta.key] ? 'desativado' : 'ativado'}.`);
                  }}
                />
              ))}
            </div>
          </div>

          {/* Card: Central de Notificações Push Instantâneas */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Disparo de Notificação Push para o Celular do Paciente</span>
              </h3>
              <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                WebPush & PWA Ativo
              </span>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-400">
              Digite uma mensagem personalizada ou selecione um modelo para ver o push aparecer em tempo real na tela do smartphone ao lado:
            </p>

            {/* Presets Rápidos */}
            <div className="flex flex-wrap gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => setCustomPushText('Lembrete: hora de beber 250ml de água e manter a meta de 2.500ml!')}
                className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 cursor-pointer"
              >
                💧 Beber Água
              </button>
              <button
                type="button"
                onClick={() => setCustomPushText('Atenção ao horário: tomar Creatina 5g pós-treino com 200ml de água.')}
                className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 cursor-pointer"
              >
                💊 Suplementação
              </button>
              <button
                type="button"
                onClick={() => setCustomPushText('Lembrete de exame: amanhã cedo realizar coleta com 12h de jejum!')}
                className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 cursor-pointer"
              >
                🔬 Exame de Sangue
              </button>
              <button
                type="button"
                onClick={() => setCustomPushText('Não esqueça de registrar a foto do seu almoço no diário alimentar!')}
                className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 cursor-pointer"
              >
                📸 Foto da Refeição
              </button>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={customPushText}
                onChange={e => setCustomPushText(e.target.value)}
                placeholder="Digite a notificação push..."
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs text-stone-800 dark:text-stone-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={handleTriggerPush}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Disparar Push</span>
              </button>
            </div>
          </div>

          {/* Links Rápidos Clínicos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => navigate('/nutricao/suplementos')}
              className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-emerald-500 dark:hover:border-emerald-600 transition-colors cursor-pointer space-y-1"
            >
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                Prescrição de Suplementos
              </span>
              <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                Ajustar Receituário da Mariana
              </h4>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                Alternar doses de Nutricionista vs Médico
              </p>
            </div>

            <div
              onClick={() => navigate('/clinico/exames')}
              className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-emerald-500 dark:hover:border-emerald-600 transition-colors cursor-pointer space-y-1"
            >
              <span className="text-[10px] font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider block">
                Exames Laboratoriais
              </span>
              <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                Emitir Nova Requisição
              </h4>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                Base centralizada de marcadores bioquímicos
              </p>
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA: SMARTPHONE MOCKUP INTERATIVO (5 colunas) */}
        <div className="lg:col-span-5 flex flex-col items-center sticky top-24 space-y-3">
          <div className="w-full flex items-center justify-between px-2 text-xs">
            <span className="text-stone-500 dark:text-stone-400 font-semibold flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Simulador do Aplicativo em Tempo Real
            </span>
            <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
              Sincronizado
            </span>
          </div>

          <SmartphoneSimulator
            pushNotification={pushNotification}
            onClearPush={() => setPushNotification(null)}
          />

          <p className="text-[11px] text-stone-400 text-center max-w-xs">
            Interaja com as abas inferiores, beba água, confira refeições e teste a rotina de suplementos diretamente no celular.
          </p>
        </div>
      </div>
    </div>
  );
};
