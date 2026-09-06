import React, { useState, useRef, useEffect } from 'react';
import {
  Stethoscope,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Save,
  CheckCircle2,
  X,
  Keyboard,
  FileText,
  Apple,
  Scale,
  Activity,
  HeartPulse,
  Flame,
  ShieldCheck,
  ShieldAlert,
  Zap,
  Plus,
  Trash2,
  Copy,
  Printer,
  ChevronRight,
  HelpCircle,
  AlertTriangle,
  Layers,
  Sparkles,
  Award,
  Calendar,
  Check,
  Maximize2,
  Minimize2,
  ChevronDown,
  Sliders,
  Timer,
  FileSpreadsheet,
  Pill
} from 'lucide-react';
import {
  useClinicalFocus,
  DEFAULT_CLINICAL_SNIPPETS,
  ClinicalSnippet
} from '../../contexts/ClinicalFocusContext';
import { useAuth } from '../../contexts/AuthContext';
import { BRISTOL_SCALE_ITEMS } from '../../data/consultationsData';
import { CLINICAL_SOAP_TEMPLATES } from '../../data/clinicalTemplatesData';
import { ClinicalTemplatesModal } from './ClinicalTemplatesModal';
import { ClinicalAlertsModal } from './ClinicalAlertsModal';

export const ClinicalFocusWorkspace: React.FC = () => {
  const {
    activePatient,
    activeSection,
    soapData,
    consultationTimer,
    targetDurationMinutes,
    setTargetDurationMinutes,
    addTimerSeconds,
    saveStatus,
    lastSavedTime,
    isShortcutsModalOpen,
    isSnippetsModalOpen,
    isBristolModalOpen,
    isTemplatesModalOpen,
    isAlertsModalOpen,
    clinicalAlerts,
    activeAlertsCount,
    hasCriticalAlert,
    disableClinicalFocus,
    setActiveSection,
    updateSoapSection,
    updateObjectiveField,
    updateAssessmentField,
    updatePlanField,
    insertSnippet,
    applySoapTemplate,
    toggleTimer,
    resetTimer,
    triggerInstantSave,
    setShortcutsModalOpen,
    setSnippetsModalOpen,
    setBristolModalOpen,
    setTemplatesModalOpen,
    setAlertsModalOpen,
    toastMessage,
    showToast
  } = useClinicalFocus();

  const { user } = useAuth();

  // Focus ref for auto-focusing textareas on tab switch
  const subjectiveTextRef = useRef<HTMLTextAreaElement>(null);
  const weightInputRef = useRef<HTMLInputElement>(null);
  const diagnosisTextRef = useRef<HTMLTextAreaElement>(null);
  const planTextRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (activeSection === 'S' && subjectiveTextRef.current) {
      subjectiveTextRef.current.focus();
    } else if (activeSection === 'O' && weightInputRef.current) {
      weightInputRef.current.focus();
    } else if (activeSection === 'A' && diagnosisTextRef.current) {
      diagnosisTextRef.current.focus();
    } else if (activeSection === 'P' && planTextRef.current) {
      planTextRef.current.focus();
    }
  }, [activeSection]);

  // Fullscreen State & Listener
  const [isNativeFullscreen, setIsNativeFullscreen] = useState(false);

  // Timer Menu Popover State & Click-outside
  const [isTimerMenuOpen, setIsTimerMenuOpen] = useState(false);
  const timerMenuRef = useRef<HTMLDivElement>(null);

  // Quick Templates Dropdown State & Click-outside
  const [isQuickTemplatesOpen, setIsQuickTemplatesOpen] = useState(false);
  const quickTemplatesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (timerMenuRef.current && !timerMenuRef.current.contains(event.target as Node)) {
        setIsTimerMenuOpen(false);
      }
      if (quickTemplatesRef.current && !quickTemplatesRef.current.contains(event.target as Node)) {
        setIsQuickTemplatesOpen(false);
      }
    };
    if (isTimerMenuOpen || isQuickTemplatesOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isTimerMenuOpen, isQuickTemplatesOpen]);

  const targetMinutes = targetDurationMinutes || 50;
  const targetSeconds = targetMinutes * 60;
  const elapsedSeconds = consultationTimer.seconds;
  const elapsedMinutes = Math.floor(elapsedSeconds / 60);
  const progressPercent = Math.min(100, Math.round((elapsedSeconds / targetSeconds) * 100));
  const isOvertime = elapsedSeconds > targetSeconds;
  const isApproachingEnd = elapsedSeconds >= targetSeconds * 0.8 && !isOvertime;

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsNativeFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleNativeFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      showToast('Modo Tela Cheia Nativo ativado.');
    } else {
      document.exitFullscreen().catch(() => {});
      showToast('Modo Tela Cheia Nativo desativado.');
    }
  };

  const handleCopySoapToClipboard = () => {
    const text = `PRONTUÁRIO CLÍNICO NUTRICIONAL — ATENDIMENTO EM FOCO
Paciente: ${activePatient.name} | Idade: ${activePatient.age} anos | Sexo: ${activePatient.gender}
Data: ${new Date().toLocaleDateString('pt-BR')} | Duração: ${formatTimer(consultationTimer.seconds)}

[S] SUBJETIVO:
${soapData.s || 'Sem anotações subjetivas'}

[O] OBJETIVO:
- Peso: ${soapData.o.weight} kg | Altura: ${soapData.o.height} m | IMC: ${soapData.o.bmi} kg/m²
- Circunferências: Cintura ${soapData.o.waist} cm | Abdômen ${soapData.o.abdomen} cm | Quadril ${soapData.o.hip} cm | RCQ: ${soapData.o.rcq}
- % Gordura: ${soapData.o.bodyFatPercent}% | Massa Muscular: ${soapData.o.muscleMass} kg | PA: ${soapData.o.bloodPressure}
- Dobras (mm): TR ${soapData.o.skinfoldTriceps} | SE ${soapData.o.skinfoldSubscapular} | SI ${soapData.o.skinfoldSuprailiac} | AB ${soapData.o.skinfoldAbdominal}
${soapData.o.notes ? `- Notas Objetivas: ${soapData.o.notes}` : ''}

[A] AVALIAÇÃO:
- Diagnóstico Nutricional: ${soapData.a.diagnosis || 'Não informado'}
- Escala de Bristol: Tipo ${soapData.a.bristolType}
- Rastreamento Metabólico MSQ: ${soapData.a.msqScore} pts
- Sintomas Digestivos: ${soapData.a.digestiveSymptoms.join(', ') || 'Nenhum'}
${soapData.a.clinicalNotes ? `- Notas Clínicas: ${soapData.a.clinicalNotes}` : ''}

[P] PLANO DE CONDUTA:
- Meta Energética: ${soapData.p.caloriesTarget} kcal
- Distribuição de Macros: Proteína ${soapData.p.proteinGrams}g | Carboidrato ${soapData.p.carbsGrams}g | Gordura ${soapData.p.fatGrams}g
- Metas SMART: ${soapData.p.smartGoals.join('; ') || 'Manter metas'}
- Suplementação: ${soapData.p.supplements.map(s => `${s.name} (${s.dosage} - ${s.timing})`).join(', ') || 'Sem suplementos'}
- Próximo Retorno: ${soapData.p.followupDays} dias
- Diretrizes Dietéticas: ${soapData.p.dietaryGuidelines || 'Seguir plano alimentar prescrito'}

[R24H] RECORDATÓRIO ALIMENTAR:
${soapData.r24h.map(m => `• ${m.meal} (${m.time}): ${m.items || 'Não preenchido'}`).join('\n')}`;

    navigator.clipboard.writeText(text);
    showToast('Prontuário completo copiado para a Área de Transferência!');
  };

  // Format timer seconds into MM:SS
  const formatTimer = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handlePrintDocument = () => {
    window.print();
    showToast('Documento do atendimento enviado para impressão.');
  };

  return (
    <div
      id="workspace-foco-clinico-presencial"
      className="fixed inset-0 z-[100] bg-slate-950 text-slate-100 flex flex-col font-sans select-none overflow-hidden ring-2 ring-inset ring-emerald-500/25 shadow-[inset_0_0_40px_rgba(16,185,129,0.03)]"
    >
      {/* 4 Cantoneiras de Precisão Clínica (Indicador Perimetral Sutil) */}
      <div className="pointer-events-none fixed top-1.5 left-1.5 w-4 h-4 border-t-2 border-l-2 border-emerald-400/60 z-[110] rounded-tl-xs" />
      <div className="pointer-events-none fixed top-1.5 right-1.5 w-4 h-4 border-t-2 border-r-2 border-emerald-400/60 z-[110] rounded-tr-xs" />
      <div className="pointer-events-none fixed bottom-1.5 left-1.5 w-4 h-4 border-b-2 border-l-2 border-emerald-400/60 z-[110] rounded-bl-xs" />
      <div className="pointer-events-none fixed bottom-1.5 right-1.5 w-4 h-4 border-b-2 border-r-2 border-emerald-400/60 z-[110] rounded-br-xs" />

      {/* Indicador Visual Flutuante no Canto da Tela — Modo Inserção Rápida */}
      <div
        id="indicador-foco-insercao-rapida"
        className="fixed bottom-14 right-5 z-[110] flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/40 shadow-xl backdrop-blur-md text-slate-200 select-none transition-all hover:bg-slate-900 hover:border-emerald-400 pointer-events-none"
      >
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <div className="flex items-center gap-1.5 text-[11px] font-mono leading-none">
          <span className="font-bold text-emerald-400 tracking-wider">MODO FOCO</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-300 font-medium hidden sm:inline">INSERÇÃO RÁPIDA</span>
          <span className="text-[10px] text-emerald-300/90 bg-emerald-950/90 border border-emerald-800 px-1.5 py-0.5 rounded font-bold">
            SOAP
          </span>
        </div>
      </div>

      {/* Toast Notification Flutuante */}
      {toastMessage && (
        <div className="fixed top-16 right-8 z-[120] bg-slate-900 border border-emerald-500 text-white px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. TOP MINIMALIST CLINICAL BAR (PACIENTE + TIMER + AUTOSAVE + AÇÕES)     */}
      {/* ========================================================================= */}
      <header className="h-16 bg-slate-900/95 border-b border-slate-800 px-5 flex items-center justify-between shrink-0 backdrop-blur-md z-20">
        {/* Esquerda: Identificação do Paciente Ativo */}
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-700 flex items-center justify-center text-white font-bold text-sm shadow-md border border-emerald-400/30">
              {activePatient.name.charAt(0)}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-extrabold text-white truncate max-w-[240px] sm:max-w-xs">
                {activePatient.name}
              </h1>
              <span className="px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-400 border border-emerald-800/80 font-mono text-[10px] font-bold">
                {activePatient.age} anos • {activePatient.gender}
              </span>

              {/* Indicador Visual de Alertas Clínicos & Riscos (Alergias / Interações) */}
              {activeAlertsCount > 0 && (
                <button
                  type="button"
                  onClick={() => setAlertsModalOpen(true)}
                  title={`Atenção Clínica: Paciente possui ${activeAlertsCount} risco(s) cadastrado(s) (Alergias / Interações Medicamentosas). Clique para abrir [Alt+L]`}
                  className={`relative inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-mono font-bold transition-all cursor-pointer select-none group shadow-sm ${
                    hasCriticalAlert
                      ? 'bg-rose-950/80 hover:bg-rose-900 text-rose-300 border-rose-500/70 ring-1 ring-rose-500/30'
                      : 'bg-amber-950/80 hover:bg-amber-900 text-amber-300 border-amber-500/70 ring-1 ring-amber-500/30'
                  }`}
                >
                  {/* Ponto / Beacon pulsante discreto */}
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span
                      className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                        hasCriticalAlert ? 'bg-rose-400' : 'bg-amber-400'
                      }`}
                    />
                    <span
                      className={`relative inline-flex rounded-full h-2 w-2 ${
                        hasCriticalAlert ? 'bg-rose-500' : 'bg-amber-500'
                      }`}
                    />
                  </span>

                  <ShieldAlert className={`w-3.5 h-3.5 shrink-0 ${hasCriticalAlert ? 'text-rose-400' : 'text-amber-400'}`} />

                  <span className="font-semibold tracking-tight">
                    {hasCriticalAlert ? `${activeAlertsCount} Risco(s) Clínico(s)` : `${activeAlertsCount} Alerta(s)`}
                  </span>

                  <span className="text-[9px] px-1 py-0.2 rounded bg-black/40 text-slate-300 hidden 2xl:inline">
                    Alt+L
                  </span>
                </button>
              )}
            </div>
            <p className="text-[11px] text-slate-400 truncate max-w-sm sm:max-w-md mt-0.5">
              Objetivo: <strong className="text-slate-200">{activePatient.objective}</strong>
            </p>
          </div>
        </div>

        {/* Centro: Cronômetro de Atendimento Clínico Discreto + Autosave */}
        <div className="flex items-center gap-2.5 sm:gap-4 relative" ref={timerMenuRef}>
          {/* Cronômetro Discreto Integrado */}
          <div
            id="cronometro-atendimento-foco"
            className={`relative flex items-center gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-2xl bg-slate-950/90 border transition-all shadow-md select-none ${
              isOvertime
                ? 'border-rose-500/60 text-rose-300 ring-1 ring-rose-500/20'
                : isApproachingEnd
                ? 'border-amber-500/60 text-amber-300 ring-1 ring-amber-500/20'
                : 'border-slate-800 hover:border-slate-700 text-slate-200'
            }`}
          >
            {/* Micro Barra de Progresso do Tempo da Consulta no fundo inferior do pill */}
            <div className="absolute bottom-0 left-2.5 right-2.5 h-[2px] bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  isOvertime ? 'bg-rose-500' : isApproachingEnd ? 'bg-amber-400' : 'bg-emerald-400'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Ícone de Relógio com Beacon */}
            <div className="relative flex items-center justify-center shrink-0">
              <Clock
                className={`w-3.5 h-3.5 ${
                  consultationTimer.isRunning
                    ? isOvertime
                      ? 'text-rose-400 animate-pulse'
                      : isApproachingEnd
                      ? 'text-amber-400 animate-pulse'
                      : 'text-emerald-400 animate-pulse'
                    : 'text-slate-500'
                }`}
              />
              {consultationTimer.isRunning && (
                <span
                  className={`absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full ${
                    isOvertime ? 'bg-rose-400' : isApproachingEnd ? 'bg-amber-400' : 'bg-emerald-400'
                  }`}
                />
              )}
            </div>

            {/* Display de Tempo Monospace */}
            <div className="flex items-baseline gap-1 font-mono">
              <span className="text-xs sm:text-sm font-extrabold tracking-wider text-white">
                {formatTimer(consultationTimer.seconds)}
              </span>
              <span className="text-[10px] text-slate-400 hidden sm:inline font-normal">
                /{targetMinutes}m
              </span>
            </div>

            {/* Controles Rápidos: Play/Pause */}
            <button
              type="button"
              onClick={toggleTimer}
              title={consultationTimer.isRunning ? 'Pausar Consulta [Alt+T]' : 'Retomar Consulta [Alt+T]'}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              {consultationTimer.isRunning ? (
                <Pause className="w-3 h-3 text-amber-400" />
              ) : (
                <Play className="w-3 h-3 text-emerald-400" />
              )}
            </button>

            {/* Botão +5m Rápido */}
            <button
              type="button"
              onClick={() => addTimerSeconds(300)}
              title="Adicionar +5 minutos ao tempo decorrido"
              className="hidden lg:inline-flex text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-emerald-300 border border-slate-800 transition-colors cursor-pointer"
            >
              +5m
            </button>

            {/* Dropdown de Configuração de Tempo & Pacing Clínico */}
            <button
              type="button"
              onClick={() => setIsTimerMenuOpen(!isTimerMenuOpen)}
              title="Opções de Tempo & Pacing da Consulta"
              className={`p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer ${
                isTimerMenuOpen ? 'text-emerald-400 bg-slate-800' : 'text-slate-400 hover:text-white'
              }`}
            >
              <ChevronDown className={`w-3 h-3 transition-transform ${isTimerMenuOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Menu Flutuante / Popover de Tempo da Consulta */}
          {isTimerMenuOpen && (
            <div
              id="popover-controle-tempo-consulta"
              className="absolute top-12 left-0 sm:left-1/2 sm:-translate-x-1/2 w-80 bg-slate-900/98 border border-slate-700/80 rounded-2xl shadow-2xl p-4 z-[130] backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 space-y-3.5 text-xs select-none"
            >
              {/* Cabeçalho do Popover */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <Timer className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-white text-xs">Controle de Tempo Clínico</span>
                </div>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                    isOvertime
                      ? 'bg-rose-950 text-rose-300 border-rose-800'
                      : isApproachingEnd
                      ? 'bg-amber-950 text-amber-300 border-amber-800'
                      : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                  }`}
                >
                  {isOvertime ? 'Tempo excedido' : `${progressPercent}% decorrido`}
                </span>
              </div>

              {/* Tempo Digital + Barra de Progresso */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-[11px] text-slate-400">Tempo de Consulta:</span>
                  <div className="flex items-baseline gap-1.5 font-mono">
                    <strong className="text-base text-white font-extrabold tracking-wider">
                      {formatTimer(consultationTimer.seconds)}
                    </strong>
                    <span className="text-slate-500 text-xs">/ {targetMinutes} min</span>
                  </div>
                </div>

                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isOvertime ? 'bg-rose-500' : isApproachingEnd ? 'bg-amber-400' : 'bg-emerald-400'
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {/* Fase Clínica Estimada */}
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                  <span>Pacing Sugerido:</span>
                  <span className="font-semibold text-emerald-300">
                    {elapsedMinutes < 20
                      ? '1. Anamnese & Queixas (S)'
                      : elapsedMinutes < 35
                      ? '2. Avaliação & Métricas (O/A)'
                      : '3. Conduta & Prescrição (P)'}
                  </span>
                </div>
              </div>

              {/* Seletor de Duração Alvo da Consulta */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-slate-300 block">
                  Duração Planejada da Consulta:
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[30, 45, 50, 60].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setTargetDurationMinutes(mins)}
                      className={`py-1.5 px-2 rounded-lg text-center font-mono text-xs font-bold transition-all cursor-pointer ${
                        targetMinutes === mins
                          ? 'bg-emerald-600 text-white shadow-sm border border-emerald-500'
                          : 'bg-slate-800/90 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
                      }`}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
              </div>

              {/* Ajustes Rápidos (+5m, +10m, -5m, Reset) */}
              <div className="space-y-1.5 pt-1 border-t border-slate-800">
                <div className="flex items-center justify-between gap-1.5">
                  <button
                    type="button"
                    onClick={() => addTimerSeconds(-300)}
                    className="flex-1 py-1 px-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-[11px] font-mono font-semibold transition-colors cursor-pointer"
                  >
                    -5 min
                  </button>
                  <button
                    type="button"
                    onClick={() => addTimerSeconds(300)}
                    className="flex-1 py-1 px-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-[11px] font-mono font-semibold transition-colors cursor-pointer"
                  >
                    +5 min
                  </button>
                  <button
                    type="button"
                    onClick={() => addTimerSeconds(600)}
                    className="flex-1 py-1 px-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-[11px] font-mono font-semibold transition-colors cursor-pointer"
                  >
                    +10 min
                  </button>
                  <button
                    type="button"
                    onClick={resetTimer}
                    title="Zerar cronômetro da consulta"
                    className="p-1 rounded-lg bg-slate-800 hover:bg-rose-950/80 hover:text-rose-300 text-slate-400 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Status do Autosave integrado */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  Autosave ativo
                </span>
                <span>Último: {lastSavedTime}</span>
              </div>
            </div>
          )}

          {/* Autosave Indicator (Desktop) */}
          <div className="hidden xl:flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
            {saveStatus === 'saving' ? (
              <span className="text-sky-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
                Salvando...
              </span>
            ) : saveStatus === 'saved' ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                Salvo ({lastSavedTime})
              </span>
            ) : (
              <span className="text-amber-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                Alterações pendentes
              </span>
            )}
          </div>
        </div>

        {/* Direita: Botões Rápidos e Sair do Foco */}
        <div className="flex items-center gap-2">
          {/* Botão Salvar Imediatamente */}
          <button
            type="button"
            onClick={triggerInstantSave}
            title="Salvar Prontuário Imediatamente [Ctrl+S]"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Salvar</span>
            <span className="text-[10px] font-mono opacity-70 bg-emerald-800/80 px-1 rounded">Ctrl+S</span>
          </button>

          {/* Seletor Rápido de Templates de Prontuário Clínico */}
          <div className="relative" ref={quickTemplatesRef}>
            <div className="inline-flex items-center rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700/80 transition-all shadow-sm">
              <button
                type="button"
                onClick={() => setTemplatesModalOpen(true)}
                title="Abrir Catálogo de Templates de Prontuário [Alt+M]"
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-slate-200 hover:text-emerald-300 text-xs font-bold transition-colors cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden md:inline">Templates</span>
                <span className="text-[10px] font-mono text-emerald-400 hidden lg:inline">Alt+M</span>
              </button>
              <button
                type="button"
                onClick={() => setIsQuickTemplatesOpen(!isQuickTemplatesOpen)}
                title="Menu rápido de modelos pré-definidos de 1 clique"
                className={`p-1.5 border-l border-slate-700/80 text-slate-400 hover:text-white transition-colors cursor-pointer rounded-r-xl ${
                  isQuickTemplatesOpen ? 'bg-slate-700 text-emerald-400' : ''
                }`}
              >
                <ChevronDown className={`w-3 h-3 transition-transform ${isQuickTemplatesOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Dropdown de 1-clique para Templates mais comuns */}
            {isQuickTemplatesOpen && (
              <div
                id="dropdown-templates-prontuario-rapido"
                className="absolute right-0 top-11 w-72 bg-slate-900/98 border border-slate-700 rounded-2xl shadow-2xl p-2 z-[130] backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 space-y-1 text-xs select-none"
              >
                <div className="px-2.5 py-1.5 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                  <span>Carga Rápida (1 Clique)</span>
                  <span className="text-[10px] font-mono text-emerald-400">Alt+M</span>
                </div>

                <div className="space-y-0.5 pt-1">
                  {CLINICAL_SOAP_TEMPLATES.map((tpl) => (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => {
                        applySoapTemplate(tpl, 'replace');
                        setIsQuickTemplatesOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-between group cursor-pointer"
                    >
                      <div className="min-w-0 pr-2">
                        <span className="text-xs font-bold text-slate-200 group-hover:text-emerald-300 block truncate">
                          {tpl.name}
                        </span>
                        <span className="text-[10px] text-slate-400 truncate block">
                          {tpl.badge} • {tpl.soap.p.caloriesTarget} kcal
                        </span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>
                  ))}
                </div>

                <div className="pt-1.5 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setIsQuickTemplatesOpen(false);
                      setTemplatesModalOpen(true);
                    }}
                    className="w-full py-1.5 px-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-center font-bold text-[11px] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    Abrir Catálogo Completo com Preview
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Alertas Clínicos & Riscos / Interações */}
          <button
            type="button"
            onClick={() => setAlertsModalOpen(true)}
            title="Abrir Central de Alertas Clínicos, Alergias e Farmacovigilância [Alt+L]"
            className={`relative inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-sm ${
              activeAlertsCount > 0
                ? hasCriticalAlert
                  ? 'bg-rose-950/70 hover:bg-rose-900/90 text-rose-200 border-rose-500/70 ring-1 ring-rose-500/20'
                  : 'bg-amber-950/70 hover:bg-amber-900/90 text-amber-200 border-amber-500/70 ring-1 ring-amber-500/20'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700/80'
            }`}
          >
            {activeAlertsCount > 0 && (
              <span className="relative flex h-2 w-2">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    hasCriticalAlert ? 'bg-rose-400' : 'bg-amber-400'
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    hasCriticalAlert ? 'bg-rose-500' : 'bg-amber-500'
                  }`}
                />
              </span>
            )}
            <ShieldAlert
              className={`w-3.5 h-3.5 ${
                activeAlertsCount > 0
                  ? hasCriticalAlert
                    ? 'text-rose-400'
                    : 'text-amber-400'
                  : 'text-slate-400'
              }`}
            />
            <span className="hidden md:inline">Alertas</span>
            {activeAlertsCount > 0 && (
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                  hasCriticalAlert
                    ? 'bg-rose-900 text-rose-200 border border-rose-700'
                    : 'bg-amber-900 text-amber-200 border border-amber-700'
                }`}
              >
                {activeAlertsCount}
              </span>
            )}
            <span className="text-[10px] font-mono text-slate-400 hidden lg:inline">Alt+L</span>
          </button>

          {/* Textos Rápidos Snippets */}
          <button
            type="button"
            onClick={() => setSnippetsModalOpen(true)}
            title="Modelos de Textos Rápidos [Alt+N]"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden lg:inline">Textos Rápidos</span>
            <span className="text-[10px] font-mono text-amber-400 hidden sm:inline">Alt+N</span>
          </button>

          {/* Bristol */}
          <button
            type="button"
            onClick={() => setBristolModalOpen(true)}
            title="Escala de Bristol Rápida [Alt+B]"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer"
          >
            <Activity className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden lg:inline">Bristol ({soapData.a.bristolType})</span>
            <span className="text-[10px] font-mono text-sky-400 hidden sm:inline">Alt+B</span>
          </button>

          {/* Copiar Prontuário Formatado */}
          <button
            type="button"
            onClick={handleCopySoapToClipboard}
            title="Copiar Prontuário Estruturado SOAP para Área de Transferência"
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 transition-all cursor-pointer"
          >
            <Copy className="w-4 h-4" />
          </button>

          {/* Alternar Tela Cheia do Navegador */}
          <button
            type="button"
            onClick={toggleNativeFullscreen}
            title={isNativeFullscreen ? 'Sair da Tela Cheia [F11]' : 'Maximizar Tela Cheia [F11]'}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-sky-400 transition-all cursor-pointer"
          >
            {isNativeFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Atalhos Ajuda */}
          <button
            type="button"
            onClick={() => setShortcutsModalOpen(true)}
            title="Guia de Atalhos de Teclado [Alt+K ou ?]"
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <Keyboard className="w-4 h-4 text-emerald-400" />
          </button>

          {/* Imprimir / Laudo */}
          <button
            type="button"
            onClick={handlePrintDocument}
            title="Imprimir / Exportar Laudo da Consulta"
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4 text-purple-400" />
          </button>

          {/* Sair do Modo Foco */}
          <button
            type="button"
            onClick={disableClinicalFocus}
            title="Sair do Modo Foco Presencial [Esc]"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-800/80 text-rose-200 text-xs font-bold transition-all cursor-pointer"
          >
            <X className="w-4 h-4 text-rose-400" />
            <span className="hidden sm:inline">Sair do Foco</span>
            <span className="text-[10px] font-mono opacity-80 bg-rose-900 px-1 rounded">Esc</span>
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. BARRA DE NAVEGAÇÃO DE SEÇÕES SOAP (ATALHOS ALT+S, O, A, P, R)        */}
      {/* ========================================================================= */}
      <div className="bg-slate-900 border-b border-slate-800/80 px-5 py-2 flex items-center justify-between overflow-x-auto shrink-0 scrollbar-none">
        <div className="flex items-center gap-2">
          {/* S - Subjetivo */}
          <button
            type="button"
            onClick={() => setActiveSection('S')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSection === 'S'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-800/70 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-slate-950 text-white font-mono text-[10px] flex items-center justify-center font-extrabold">
              S
            </span>
            <span>Subjetivo (Anamnese)</span>
            <span className="text-[10px] font-mono opacity-70">Alt+S</span>
          </button>

          {/* O - Objetivo */}
          <button
            type="button"
            onClick={() => setActiveSection('O')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSection === 'O'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-800/70 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-slate-950 text-white font-mono text-[10px] flex items-center justify-center font-extrabold">
              O
            </span>
            <span>Objetivo (Antropometria)</span>
            <span className="text-[10px] font-mono opacity-70">Alt+O</span>
          </button>

          {/* A - Avaliação */}
          <button
            type="button"
            onClick={() => setActiveSection('A')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSection === 'A'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-800/70 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-slate-950 text-white font-mono text-[10px] flex items-center justify-center font-extrabold">
              A
            </span>
            <span>Avaliação (Diagnóstico & Bristol)</span>
            <span className="text-[10px] font-mono opacity-70">Alt+A</span>
          </button>

          {/* P - Plano & Conduta */}
          <button
            type="button"
            onClick={() => setActiveSection('P')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSection === 'P'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-800/70 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-slate-950 text-white font-mono text-[10px] flex items-center justify-center font-extrabold">
              P
            </span>
            <span>Plano Terapêutico & Prescrição</span>
            <span className="text-[10px] font-mono opacity-70">Alt+P</span>
          </button>

          {/* R24h - Recordatório 24h */}
          <button
            type="button"
            onClick={() => setActiveSection('R24')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSection === 'R24'
                ? 'bg-sky-600 text-white shadow-md'
                : 'bg-slate-800/70 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-sky-400" />
            <span>R24h Expresso</span>
            <span className="text-[10px] font-mono opacity-70">Alt+R</span>
          </button>
        </div>

        {/* Resumo Rápido de Métricas em Tempo Real */}
        <div className="hidden xl:flex items-center gap-4 text-xs font-mono text-slate-300">
          <div>Peso: <strong className="text-white">{soapData.o.weight} kg</strong></div>
          <div>IMC: <strong className="text-emerald-400">{soapData.o.bmi}</strong></div>
          <div>Gordura: <strong className="text-amber-400">{soapData.o.bodyFatPercent}%</strong></div>
          <div>Calorias Meta: <strong className="text-sky-400">{soapData.p.caloriesTarget} kcal</strong></div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. WORKSPACE PRINCIPAL: CORPO DO PRONTUÁRIO EM TELA CHEIA                */}
      {/* ========================================================================= */}
      <main className="flex-1 overflow-y-auto p-5 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto w-full">
        {/* Banner de Segurança do Paciente & Alertas Clínicos Ativos */}
        {activeAlertsCount > 0 && (
          <div
            id="banner-risco-clinico-foco"
            className={`p-3 sm:p-4 rounded-2xl border transition-all select-none ${
              hasCriticalAlert
                ? 'bg-rose-950/40 border-rose-500/50 shadow-sm ring-1 ring-rose-500/20'
                : 'bg-amber-950/30 border-amber-500/50 shadow-sm ring-1 ring-amber-500/20'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start sm:items-center gap-3 min-w-0">
                <div
                  className={`p-2 rounded-xl shrink-0 flex items-center justify-center ${
                    hasCriticalAlert ? 'bg-rose-900/80 text-rose-300' : 'bg-amber-900/80 text-amber-300'
                  }`}
                >
                  <ShieldAlert className="w-5 h-5 animate-pulse" />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
                      <span className="relative flex h-2 w-2 shrink-0">
                        <span
                          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                            hasCriticalAlert ? 'bg-rose-400' : 'bg-amber-400'
                          }`}
                        />
                        <span
                          className={`relative inline-flex rounded-full h-2 w-2 ${
                            hasCriticalAlert ? 'bg-rose-500' : 'bg-amber-500'
                          }`}
                        />
                      </span>
                      {hasCriticalAlert
                        ? 'Alerta Clínico de Segurança: Risco Crítico / Alergia Severa Cadastrada'
                        : 'Alertas Clínicos & Farmacovigilância Ativos'}
                    </span>
                    <span
                      className={`px-2 py-0.2 rounded-full font-mono text-[10px] font-bold border ${
                        hasCriticalAlert
                          ? 'bg-rose-900/90 text-rose-200 border-rose-700'
                          : 'bg-amber-900/90 text-amber-200 border-amber-700'
                      }`}
                    >
                      {activeAlertsCount} Ativo(s)
                    </span>
                  </div>

                  {/* Pills dos Riscos Ativos */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                    {clinicalAlerts
                      .filter((a) => a.active)
                      .slice(0, 3)
                      .map((alert) => (
                        <span
                          key={alert.id}
                          className={`px-2 py-0.5 rounded-lg text-[11px] font-medium border flex items-center gap-1 ${
                            alert.severity === 'critico'
                              ? 'bg-rose-950/80 text-rose-200 border-rose-800'
                              : 'bg-amber-950/80 text-amber-200 border-amber-800'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              alert.severity === 'critico' ? 'bg-rose-400 animate-pulse' : 'bg-amber-400'
                            }`}
                          />
                          <strong className="font-bold">{alert.title.split('(')[0].trim()}</strong>
                        </span>
                      ))}
                    {clinicalAlerts.filter((a) => a.active).length > 3 && (
                      <span className="text-[11px] text-slate-400 font-mono">
                        +{clinicalAlerts.filter((a) => a.active).length - 3} mais
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => setAlertsModalOpen(true)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                    hasCriticalAlert
                      ? 'bg-rose-600 hover:bg-rose-500 text-white'
                      : 'bg-amber-600 hover:bg-amber-500 text-white'
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Ver Detalhes & Contraindicações</span>
                  <span className="text-[10px] font-mono opacity-80 bg-black/30 px-1 rounded">Alt+L</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SEÇÃO S: SUBJETIVO (QUEIXAS, HMA, ROTINA, SONO, HISTÓRICO) */}
        {activeSection === 'S' && (
          <div className="space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-mono text-xs font-extrabold flex items-center justify-center">
                    S
                  </span>
                  <span>Subjetivo — Anamnese, Queixa Principal & Rotina</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Relato do paciente, percepção de sintomas, adesão dietética, qualidade do sono, níveis de estresse e treinos.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSnippetsModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-bold flex items-center gap-1.5 hover:bg-amber-500/30 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Inserir Texto Modelo [Alt+N]</span>
              </button>
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-300">
                Registro Livre / Evolução Clínica Subjetiva
              </label>
              <textarea
                ref={subjectiveTextRef}
                rows={10}
                value={soapData.s}
                onChange={(e) => updateSoapSection('s', e.target.value)}
                placeholder="Descreva a queixa principal, evolução dos sintomas, hábitos e adesão ao plano..."
                className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:border-emerald-500 focus:outline-hidden leading-relaxed font-sans placeholder:text-slate-600"
              />
            </div>

            {/* Chips de Inserção Rápida de Sintomas com 1 Clique */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-400 block">
                Snippets Rápidos de Anamnese (Clique para inserir ao final):
              </span>
              <div className="flex flex-wrap gap-2">
                {DEFAULT_CLINICAL_SNIPPETS.filter(s => s.category.includes('Subjetivo')).map((snip) => (
                  <button
                    key={snip.id}
                    type="button"
                    onClick={() => insertSnippet(snip.text, 'S')}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-medium transition-all text-left flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{snip.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SEÇÃO O: OBJETIVO (ANTROPOMETRIA, SINAIS VITAIS, DOBRAS, CIRCUNFERÊNCIAS) */}
        {activeSection === 'O' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-mono text-xs font-extrabold flex items-center justify-center">
                    O
                  </span>
                  <span>Objetivo — Avaliação Antropométrica & Sinais Vitais</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Inserção rápida de peso, estatura, IMC automatizado, circunferências (RCQ) e 4 dobras cutâneas com %Gordura.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                <span>IMC: <strong className="text-emerald-400">{soapData.o.bmi}</strong></span>
                <span>•</span>
                <span>RCQ: <strong className="text-sky-400">{soapData.o.rcq}</strong></span>
                <span>•</span>
                <span>Gordura: <strong className="text-amber-400">{soapData.o.bodyFatPercent}%</strong></span>
              </div>
            </div>

            {/* Grid 1: Peso, Estatura, Pressão Arterial */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <label className="text-xs font-bold text-slate-400 block">Peso Atual (kg)</label>
                <input
                  ref={weightInputRef}
                  type="number"
                  step="0.1"
                  value={soapData.o.weight}
                  onChange={(e) => updateObjectiveField('weight', Number(e.target.value))}
                  className="w-full text-xl font-mono font-extrabold text-white bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <label className="text-xs font-bold text-slate-400 block">Estatura (m)</label>
                <input
                  type="number"
                  step="0.01"
                  value={soapData.o.height}
                  onChange={(e) => updateObjectiveField('height', Number(e.target.value))}
                  className="w-full text-xl font-mono font-extrabold text-white bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <label className="text-xs font-bold text-slate-400 block">Pressão Arterial</label>
                <input
                  type="text"
                  value={soapData.o.bloodPressure}
                  onChange={(e) => updateObjectiveField('bloodPressure', e.target.value)}
                  placeholder="Ex.: 120/80 mmHg"
                  className="w-full text-base font-mono font-bold text-white bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <label className="text-xs font-bold text-slate-400 block">% Gordura (Pollock)</label>
                <input
                  type="number"
                  step="0.1"
                  value={soapData.o.bodyFatPercent}
                  onChange={(e) => updateObjectiveField('bodyFatPercent', Number(e.target.value))}
                  className="w-full text-xl font-mono font-extrabold text-amber-400 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Grid 2: Circunferências Corporais (cm) */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-slate-300 uppercase font-mono block">
                Circunferências & Perimetria (cm)
              </span>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">Cintura (menor curvatura)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={soapData.o.waist}
                    onChange={(e) => updateObjectiveField('waist', Number(e.target.value))}
                    className="w-full text-sm font-mono font-bold text-white bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">Abdômen (cicatriz umbilical)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={soapData.o.abdomen}
                    onChange={(e) => updateObjectiveField('abdomen', Number(e.target.value))}
                    className="w-full text-sm font-mono font-bold text-white bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">Quadril (maior proeminência)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={soapData.o.hip}
                    onChange={(e) => updateObjectiveField('hip', Number(e.target.value))}
                    className="w-full text-sm font-mono font-bold text-white bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Grid 3: Dobras Cutâneas Principais (mm) */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-slate-300 uppercase font-mono block">
                Dobras Cutâneas Rápidas (mm) — Protocolo Jackson & Pollock
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">Tríceps (TR)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={soapData.o.skinfoldTriceps}
                    onChange={(e) => updateObjectiveField('skinfoldTriceps', Number(e.target.value))}
                    className="w-full text-sm font-mono font-bold text-white bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">Subescapular (SE)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={soapData.o.skinfoldSubscapular}
                    onChange={(e) => updateObjectiveField('skinfoldSubscapular', Number(e.target.value))}
                    className="w-full text-sm font-mono font-bold text-white bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">Suprailíaca (SI)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={soapData.o.skinfoldSuprailiac}
                    onChange={(e) => updateObjectiveField('skinfoldSuprailiac', Number(e.target.value))}
                    className="w-full text-sm font-mono font-bold text-white bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">Abdominal (AB)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={soapData.o.skinfoldAbdominal}
                    onChange={(e) => updateObjectiveField('skinfoldAbdominal', Number(e.target.value))}
                    className="w-full text-sm font-mono font-bold text-white bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SEÇÃO A: AVALIAÇÃO (DIAGNÓSTICO NUTRICIONAL, BRISTOL, MSQ) */}
        {activeSection === 'A' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-mono text-xs font-extrabold flex items-center justify-center">
                    A
                  </span>
                  <span>Avaliação — Diagnóstico Clínico & Saúde Funcional</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Síntese diagnóstica, tipagem de fezes pela Escala de Bristol e questionário de rastreamento metabólico (MSQ).
                </p>
              </div>

              <button
                type="button"
                onClick={() => setBristolModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-400/30 text-xs font-bold flex items-center gap-1.5 hover:bg-sky-500/30 transition-all cursor-pointer"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Selecionar Bristol ({soapData.a.bristolType}) [Alt+B]</span>
              </button>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300">
                Diagnóstico Nutricional Estruturado (Resolução CFN)
              </label>
              <textarea
                ref={diagnosisTextRef}
                rows={5}
                value={soapData.a.diagnosis}
                onChange={(e) => updateAssessmentField('diagnosis', e.target.value)}
                placeholder="Ex.: Eutrofia com recomposição corporal favorável. Redução de adiposidade visceral..."
                className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:border-emerald-500 focus:outline-hidden leading-relaxed font-sans"
              />
            </div>

            {/* Seletor Visual Rápido da Escala de Bristol (1 a 7) */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase font-mono">
                  Escala de Bristol de Consistência Fecal (Pressione o número ou clique)
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  Tipo Selecionado: {soapData.a.bristolType}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-7 gap-2">
                {BRISTOL_SCALE_ITEMS.map((b) => (
                  <button
                    key={b.type}
                    type="button"
                    onClick={() => {
                      updateAssessmentField('bristolType', b.type);
                      showToast(`Bristol Tipo ${b.type} selecionado.`);
                    }}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col justify-between ${
                      soapData.a.bristolType === b.type
                        ? 'bg-emerald-600 text-white border-emerald-400 shadow-lg scale-102'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    <div className="text-base font-mono font-extrabold mb-1">
                      Tipo {b.type}
                    </div>
                    <div className="text-[10px] leading-tight opacity-80">
                      {b.status}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SEÇÃO P: PLANO & CONDUTA (METAS SMART, SUPLEMENTAÇÃO, CONDUTA) */}
        {activeSection === 'P' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-mono text-xs font-extrabold flex items-center justify-center">
                    P
                  </span>
                  <span>Plano Terapêutico, Metas SMART & Prescrição Expressa</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Meta calórica, divisão de macronutrientes, suplementos estruturados e metas enviadas ao app do paciente.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                <span>{soapData.p.caloriesTarget} kcal</span>
                <span>•</span>
                <span>P: {soapData.p.proteinGrams}g</span>
                <span>•</span>
                <span>C: {soapData.p.carbsGrams}g</span>
                <span>•</span>
                <span>G: {soapData.p.fatGrams}g</span>
              </div>
            </div>

            {/* Grid 1: Metas de Macronutrientes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <label className="text-xs font-bold text-slate-400 block">Meta Calórica (kcal/dia)</label>
                <input
                  type="number"
                  step="50"
                  value={soapData.p.caloriesTarget}
                  onChange={(e) => updatePlanField('caloriesTarget', Number(e.target.value))}
                  className="w-full text-xl font-mono font-extrabold text-sky-400 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <label className="text-xs font-bold text-slate-400 block">Proteínas (g/dia)</label>
                <input
                  type="number"
                  step="5"
                  value={soapData.p.proteinGrams}
                  onChange={(e) => updatePlanField('proteinGrams', Number(e.target.value))}
                  className="w-full text-xl font-mono font-extrabold text-white bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <label className="text-xs font-bold text-slate-400 block">Carboidratos (g/dia)</label>
                <input
                  type="number"
                  step="5"
                  value={soapData.p.carbsGrams}
                  onChange={(e) => updatePlanField('carbsGrams', Number(e.target.value))}
                  className="w-full text-xl font-mono font-extrabold text-white bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <label className="text-xs font-bold text-slate-400 block">Gorduras (g/dia)</label>
                <input
                  type="number"
                  step="5"
                  value={soapData.p.fatGrams}
                  onChange={(e) => updatePlanField('fatGrams', Number(e.target.value))}
                  className="w-full text-xl font-mono font-extrabold text-white bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Suplementação Estruturada Prescrita */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase font-mono flex items-center gap-2">
                  <Apple className="w-4 h-4 text-emerald-400" />
                  <span>Suplementação Prescrita na Consulta</span>
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {soapData.p.supplements.length} itens ativos
                </span>
              </div>

              <div className="space-y-2">
                {soapData.p.supplements.map((sup, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="font-bold text-xs text-white flex items-center gap-2">
                        <span>{sup.name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                          {sup.dosage}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Horário: <strong className="text-slate-200">{sup.timing}</strong> • Via: {sup.route}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Orientações Dietéticas Gerais */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300">
                Orientações Gerais, Conduta & Lembretes para o Paciente
              </label>
              <textarea
                ref={planTextRef}
                rows={5}
                value={soapData.p.dietaryGuidelines}
                onChange={(e) => updatePlanField('dietaryGuidelines', e.target.value)}
                placeholder="Orientações de consumo hídrico, trocas de alimentos e recomendações de treino..."
                className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:border-emerald-500 focus:outline-hidden leading-relaxed font-sans"
              />
            </div>
          </div>
        )}

        {/* SEÇÃO R24H: RECORDATÓRIO ALIMENTAR 24 HORAS */}
        {activeSection === 'R24' && (
          <div className="space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-sky-400" />
                  <span>Recordatório Alimentar 24 Horas (R24h) Expresso</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Inquérito dietético detalhado por horários, refeições e quantidades habituais.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {soapData.r24h.map((meal, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-white">{meal.meal}</span>
                      <span className="text-xs font-mono text-sky-400 bg-sky-950 px-2 py-0.5 rounded border border-sky-800">
                        {meal.time}
                      </span>
                    </div>
                  </div>
                  <textarea
                    rows={2}
                    value={meal.items}
                    onChange={(e) => {
                      const updated = [...soapData.r24h];
                      updated[idx].items = e.target.value;
                      updateSoapSection('r24h', updated);
                    }}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:border-sky-500 focus:outline-hidden font-sans"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* 4. FLOATING FOOTER BAR WITH KEYBOARD SHORTCUTS CHEATSHEET                */}
      {/* ========================================================================= */}
      <footer className="h-11 bg-slate-900/90 border-t border-slate-800 px-5 flex items-center justify-between text-[11px] font-mono text-slate-400 shrink-0 z-20">
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-none">
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 font-bold">Alt+S</kbd>
            <span>Subjetivo</span>
          </span>
          <span className="text-slate-700">•</span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 font-bold">Alt+O</kbd>
            <span>Objetivo</span>
          </span>
          <span className="text-slate-700">•</span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 font-bold">Alt+A</kbd>
            <span>Avaliação</span>
          </span>
          <span className="text-slate-700">•</span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 font-bold">Alt+P</kbd>
            <span>Plano</span>
          </span>
          <span className="text-slate-700">•</span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-400 font-bold">Alt+N</kbd>
            <span>Textos Rápidos</span>
          </span>
          <span className="text-slate-700">•</span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-sky-400 font-bold">Alt+B</kbd>
            <span>Bristol</span>
          </span>
          <span className="text-slate-700">•</span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-white font-bold">Ctrl+S</kbd>
            <span>Salvar</span>
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <span>Pressione <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-rose-400 font-bold">Esc</kbd> para sair do modo foco</span>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* 5. MODAL FLUTUANTE DE ATALHOS DE TECLADO ([Alt+K] ou [?])                */}
      {/* ========================================================================= */}
      {isShortcutsModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 max-w-lg w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Keyboard className="w-5 h-5 text-emerald-400" />
                <h3 className="font-extrabold text-sm text-white">
                  Atalhos de Teclado do Modo Foco Presencial
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShortcutsModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-slate-300">Alternar Modo Foco / Tela Cheia</span>
                <kbd className="px-2 py-1 rounded bg-slate-800 text-emerald-400 font-mono font-bold">Alt + F</kbd>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-slate-300">Salvar Prontuário Imediatamente</span>
                <kbd className="px-2 py-1 rounded bg-slate-800 text-emerald-400 font-mono font-bold">Ctrl + S</kbd>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-slate-300">Ir para Subjetivo (Anamnese)</span>
                <kbd className="px-2 py-1 rounded bg-slate-800 text-emerald-400 font-mono font-bold">Alt + S</kbd>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-slate-300">Ir para Objetivo (Antropometria)</span>
                <kbd className="px-2 py-1 rounded bg-slate-800 text-emerald-400 font-mono font-bold">Alt + O</kbd>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-slate-300">Ir para Avaliação (Diagnóstico)</span>
                <kbd className="px-2 py-1 rounded bg-slate-800 text-emerald-400 font-mono font-bold">Alt + A</kbd>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-slate-300">Ir para Plano & Metas</span>
                <kbd className="px-2 py-1 rounded bg-slate-800 text-emerald-400 font-mono font-bold">Alt + P</kbd>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-slate-300">Abrir Recordatório 24h</span>
                <kbd className="px-2 py-1 rounded bg-slate-800 text-sky-400 font-mono font-bold">Alt + R</kbd>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-slate-300">Inserir Textos Rápidos (Snippets)</span>
                <kbd className="px-2 py-1 rounded bg-slate-800 text-amber-400 font-mono font-bold">Alt + N</kbd>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-slate-300">Templates / Modelos de Prontuário</span>
                <kbd className="px-2 py-1 rounded bg-slate-800 text-emerald-400 font-mono font-bold">Alt + M</kbd>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-slate-300">Alertas Clínicos & Farmacovigilância</span>
                <kbd className="px-2 py-1 rounded bg-slate-800 text-rose-400 font-mono font-bold">Alt + L</kbd>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-slate-300">Selecionar Escala de Bristol</span>
                <kbd className="px-2 py-1 rounded bg-slate-800 text-sky-400 font-mono font-bold">Alt + B</kbd>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-slate-300">Iniciar / Pausar Cronômetro</span>
                <kbd className="px-2 py-1 rounded bg-slate-800 text-purple-400 font-mono font-bold">Alt + T</kbd>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-slate-300">Sair do Modo Foco</span>
                <kbd className="px-2 py-1 rounded bg-slate-800 text-rose-400 font-mono font-bold">Esc</kbd>
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setShortcutsModalOpen(false)}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MODAL DE TEXTOS RÁPIDOS / MODELOS CLÍNICOS ([Alt+N])                  */}
      {/* ========================================================================= */}
      {isSnippetsModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="font-extrabold text-sm text-white">
                  Modelos de Textos Rápidos Clínicos
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSnippetsModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {DEFAULT_CLINICAL_SNIPPETS.map((snip) => (
                <div
                  key={snip.id}
                  onClick={() => {
                    insertSnippet(snip.text);
                    setSnippetsModalOpen(false);
                  }}
                  className="p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer space-y-1.5 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white group-hover:text-emerald-400 transition-colors">
                      {snip.title}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {snip.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {snip.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. MODAL DEDICADO DA ESCALA DE BRISTOL ([Alt+B])                         */}
      {/* ========================================================================= */}
      {isBristolModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 max-w-3xl w-full max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-sky-400" />
                <h3 className="font-extrabold text-sm text-white">
                  Tipagem da Escala de Bristol (1 a 7)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setBristolModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {BRISTOL_SCALE_ITEMS.map((b) => (
                <div
                  key={b.type}
                  onClick={() => {
                    updateAssessmentField('bristolType', b.type);
                    setBristolModalOpen(false);
                    showToast(`Bristol Tipo ${b.type} registrado.`);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    soapData.a.bristolType === b.type
                      ? 'bg-emerald-950/60 border-emerald-500 shadow-md'
                      : 'bg-slate-950 border-slate-800 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white">
                      {b.title}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      b.color === 'emerald' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                      b.color === 'amber' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                      'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}>
                      {b.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. MODAL DE TEMPLATES DE PRONTUÁRIO CLÍNICO ([Alt+M])                    */}
      {/* ========================================================================= */}
      <ClinicalTemplatesModal />

      {/* ========================================================================= */}
      {/* 9. MODAL DE ALERTAS CLÍNICOS & FARMACOVIGILÂNCIA ([Alt+L])               */}
      {/* ========================================================================= */}
      <ClinicalAlertsModal />
    </div>
  );
};
