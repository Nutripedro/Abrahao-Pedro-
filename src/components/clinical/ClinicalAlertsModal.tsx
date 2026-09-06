import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  X,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Copy,
  Info,
  ShieldCheck,
  Zap,
  Sparkles,
  Search,
  ExternalLink,
  Pill,
  Apple
} from 'lucide-react';
import {
  ClinicalRiskAlert,
  PRESET_CLINICAL_RISK_TEMPLATES,
  getSeverityBadgeStyle,
  AlertSeverity,
  AlertCategory
} from '../../data/clinicalAlertsData';
import { useClinicalFocus } from '../../contexts/ClinicalFocusContext';

interface ClinicalAlertsModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const ClinicalAlertsModal: React.FC<ClinicalAlertsModalProps> = ({
  isOpen: explicitIsOpen,
  onClose: explicitOnClose
}) => {
  const {
    activePatient,
    clinicalAlerts,
    addClinicalAlert,
    removeClinicalAlert,
    toggleClinicalAlert,
    isAlertsModalOpen,
    setAlertsModalOpen,
    showToast
  } = useClinicalFocus();

  const isOpen = explicitIsOpen !== undefined ? explicitIsOpen : isAlertsModalOpen;
  const handleClose = explicitOnClose || (() => setAlertsModalOpen(false));

  const [activeFilter, setActiveFilter] = useState<'todos' | 'alergia' | 'interacao' | 'patologia'>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form state for custom alert
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<AlertCategory>('alergia');
  const [newSeverity, setNewSeverity] = useState<AlertSeverity>('alto');
  const [newSubstance, setNewSubstance] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newRecommendation, setNewRecommendation] = useState('');
  const [newContraindications, setNewContraindications] = useState('');

  if (!isOpen) return null;

  const filteredAlerts = clinicalAlerts.filter((alert) => {
    const matchesFilter = activeFilter === 'todos' || alert.type === activeFilter;
    const matchesSearch =
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.substanceOrDrug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.recommendation.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const activeCount = clinicalAlerts.filter((a) => a.active).length;
  const criticalCount = clinicalAlerts.filter((a) => a.active && a.severity === 'critico').length;
  const highCount = clinicalAlerts.filter((a) => a.active && a.severity === 'alto').length;

  const handleAddPreset = (preset: typeof PRESET_CLINICAL_RISK_TEMPLATES[0]) => {
    addClinicalAlert({
      type: preset.type,
      severity: preset.severity,
      title: preset.title,
      substanceOrDrug: preset.substanceOrDrug,
      description: preset.description,
      recommendation: preset.recommendation,
      contraindications: preset.contraindications,
      crossReactivity: preset.crossReactivity,
      active: true
    });
    showToast(`Alerta adicionado: ${preset.title}`);
  };

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showToast('Por favor, informe o título do risco.');
      return;
    }

    const contraindicationsList = newContraindications
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    addClinicalAlert({
      type: newType,
      severity: newSeverity,
      title: newTitle,
      substanceOrDrug: newSubstance || 'Não especificado',
      description: newDescription || 'Risco clínico registrado em consulta.',
      recommendation: newRecommendation || 'Observar conduta clínica individualizada.',
      contraindications: contraindicationsList.length > 0 ? contraindicationsList : undefined,
      active: true
    });

    setNewTitle('');
    setNewSubstance('');
    setNewDescription('');
    setNewRecommendation('');
    setNewContraindications('');
    setIsAddingNew(false);
    showToast('Novo alerta clínico cadastrado com sucesso!');
  };

  const handleCopyAlertsSummary = () => {
    const activeAlerts = clinicalAlerts.filter((a) => a.active);
    if (activeAlerts.length === 0) {
      showToast('Nenhum alerta ativo para copiar.');
      return;
    }

    const summary = `⚠️ ALERTAS CLÍNICOS & INTERAÇÕES — PACIENTE: ${activePatient.name}
Total de Riscos Registrados: ${activeAlerts.length}

${activeAlerts
  .map(
    (a, idx) =>
      `${idx + 1}. [${a.severity.toUpperCase()}] ${a.title}
   • Substância/Fármaco: ${a.substanceOrDrug}
   • Descrição do Risco: ${a.description}
   • Conduta/Recomendação: ${a.recommendation}
   ${a.contraindications ? `• Contraindicações: ${a.contraindications.join(', ')}` : ''}`
  )
  .join('\n\n')}

Aviso: Registro confidencial em conformidade com as Boas Práticas Nutricionais e LGPD.`;

    navigator.clipboard.writeText(summary);
    showToast('Resumo de alertas copiado para a Área de Transferência!');
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div
        id="modal-alertas-clinicos"
        className="bg-slate-900 border border-slate-700/90 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
      >
        {/* Cabeçalho */}
        <div className="p-5 sm:p-6 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-md ${
                  criticalCount > 0
                    ? 'bg-rose-600 ring-2 ring-rose-500/50'
                    : highCount > 0
                    ? 'bg-amber-600 ring-2 ring-amber-500/50'
                    : 'bg-emerald-600 ring-2 ring-emerald-500/50'
                }`}
              >
                <ShieldAlert className="w-6 h-6" />
              </div>
              {criticalCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500 border-2 border-slate-900" />
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Alertas Clínicos & Farmacovigilância
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-slate-800 border border-slate-700 text-slate-300">
                  {activePatient.name}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Rastreamento ativo de alergias graves, anafilaxia, intolerâncias e interações fármaco-nutriente.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyAlertsSummary}
              title="Copiar Resumo dos Alertas"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-bold border border-slate-700 transition-colors cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5 text-emerald-400" />
              <span>Copiar Resumo</span>
            </button>

            <button
              type="button"
              onClick={handleClose}
              title="Fechar [Esc]"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Barra de Status & Estatísticas Rápidas */}
        <div className="px-6 py-3 bg-slate-950/40 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-slate-400">Status dos Riscos:</span>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800/80 font-mono font-bold text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                {criticalCount} Crítico(s)
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800/80 font-mono font-bold text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                {highCount} Alto(s)
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-850 text-slate-300 border border-slate-750 font-mono font-bold text-[11px]">
                {activeCount} Ativo(s) no momento
              </span>
            </div>
          </div>

          {/* Filtro e Busca */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filtrar alertas..."
                className="pl-8 pr-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-36 sm:w-48"
              />
            </div>

            <div className="flex items-center rounded-lg bg-slate-950 p-0.5 border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveFilter('todos')}
                className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                  activeFilter === 'todos'
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Todos
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('alergia')}
                className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                  activeFilter === 'alergia'
                    ? 'bg-slate-800 text-rose-300 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Alergias
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('interacao')}
                className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                  activeFilter === 'interacao'
                    ? 'bg-slate-800 text-amber-300 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Interações
              </button>
            </div>
          </div>
        </div>

        {/* Conteúdo Principal (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Alertas Ativos da Paciente */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Alertas Cadastrados para este Paciente ({filteredAlerts.length})</span>
              </h3>

              <button
                type="button"
                onClick={() => setIsAddingNew(!isAddingNew)}
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isAddingNew ? 'Cancelar Cadastro' : '+ Cadastrar Novo Alerta'}</span>
              </button>
            </div>

            {/* Formulário de Novo Alerta (quando expandido) */}
            {isAddingNew && (
              <form
                onSubmit={handleCreateCustom}
                className="p-4 bg-slate-950/80 rounded-2xl border border-emerald-500/40 space-y-3.5 animate-in fade-in duration-150"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Cadastrar Novo Risco / Alergia / Interação
                  </span>
                  <span className="text-[11px] text-slate-500">Preenchimento rápido em consulta</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[11px] font-medium text-slate-300">Título do Risco / Alerta *</label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Ex: Alergia Severa a Amendoim / Oleaginosas"
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-slate-300">Gravidade do Risco</label>
                    <select
                      value={newSeverity}
                      onChange={(e) => setNewSeverity(e.target.value as AlertSeverity)}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="critico">Crítico (Anafilaxia / Risco Vital)</option>
                      <option value="alto">Alto (Interação Grave / Sintoma Agudo)</option>
                      <option value="moderado">Moderado (Intolerância / Sensibilidade)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-slate-300">Tipo de Alerta</label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as AlertCategory)}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="alergia">Alergia / Anafilaxia</option>
                      <option value="interacao">Interação Fármaco-Nutriente</option>
                      <option value="patologia">Condição Clínica / Renal / Hepática</option>
                      <option value="medicamento">Medicamento Contínuo</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-slate-300">Substância / Fármaco Envolvido</label>
                    <input
                      type="text"
                      value={newSubstance}
                      onChange={(e) => setNewSubstance(e.target.value)}
                      placeholder="Ex: Amendoim, Castanha de Caju, Avelã"
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-300">Conduta Nutricional & Recomendações *</label>
                  <textarea
                    rows={2}
                    value={newRecommendation}
                    onChange={(e) => setNewRecommendation(e.target.value)}
                    placeholder="Ex: Exclusão total de pastas de amendoim, barrinhas protéicas com oleaginosas e contaminação cruzada em fábricas."
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-300">
                    Contraindicações de Suplementos (separar por vírgula)
                  </label>
                  <input
                    type="text"
                    value={newContraindications}
                    onChange={(e) => setNewContraindications(e.target.value)}
                    placeholder="Ex: Pasta de Castanha, Barras proteicas mistas, Farinha de amêndoas"
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAddingNew(false)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                  >
                    Salvar Risco Clínico
                  </button>
                </div>
              </form>
            )}

            {/* Lista dos Alertas Cadastrados */}
            {filteredAlerts.length === 0 ? (
              <div className="p-8 text-center bg-slate-950/40 rounded-2xl border border-slate-800 space-y-2">
                <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="text-sm font-semibold text-slate-300">Nenhum alerta clínico encontrado com os filtros atuais.</p>
                <p className="text-xs text-slate-500">Você pode adicionar riscos a partir dos modelos clínicos abaixo.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {filteredAlerts.map((alert) => {
                  const style = getSeverityBadgeStyle(alert.severity);
                  return (
                    <div
                      key={alert.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        alert.active
                          ? alert.severity === 'critico'
                            ? 'bg-rose-950/30 border-rose-500/50 shadow-sm ring-1 ring-rose-500/20'
                            : alert.severity === 'alto'
                            ? 'bg-amber-950/20 border-amber-500/40 shadow-sm'
                            : 'bg-slate-950/60 border-slate-800'
                          : 'bg-slate-950/20 border-slate-800/40 opacity-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-mono font-bold ${style.badgeClass}`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${style.dotClass} ${
                                  alert.active && alert.severity === 'critico' ? 'animate-ping' : ''
                                }`}
                              />
                              {style.label}
                            </span>

                            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                              {alert.type}
                            </span>

                            <h4 className="text-sm font-bold text-white tracking-tight truncate">{alert.title}</h4>
                          </div>

                          <div className="text-xs text-slate-300 space-y-1 pt-1">
                            <p>
                              <strong className="text-slate-400">Substância/Fármaco:</strong>{' '}
                              <span className="text-white font-medium">{alert.substanceOrDrug}</span>
                            </p>
                            <p className="text-slate-300 leading-relaxed">{alert.description}</p>
                            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-200">
                              <strong className="text-emerald-400 block mb-0.5">Conduta / Diretriz Clínica:</strong>
                              {alert.recommendation}
                            </div>
                          </div>

                          {/* Contraindicações Tags */}
                          {alert.contraindications && alert.contraindications.length > 0 && (
                            <div className="pt-1.5 flex flex-wrap items-center gap-1.5">
                              <span className="text-[11px] font-semibold text-rose-300">Contraindicações:</span>
                              {alert.contraindications.map((item, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-0.5 rounded-md bg-rose-950/80 text-rose-300 border border-rose-800 text-[10px] font-mono font-bold"
                                >
                                  🚫 {item}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Ações: Ativar/Pausar e Excluir */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => toggleClinicalAlert(alert.id)}
                            title={alert.active ? 'Pausar monitoramento do alerta' : 'Reativar alerta'}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                              alert.active
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900'
                                : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
                            }`}
                          >
                            {alert.active ? 'Ativo' : 'Inativo'}
                          </button>

                          <button
                            type="button"
                            onClick={() => removeClinicalAlert(alert.id)}
                            title="Remover alerta"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Modelos / Presets Rápidos de Farmacovigilância */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Pill className="w-3.5 h-3.5 text-sky-400" />
                <span>Biblioteca de Riscos & Interações Clínicas Rápidas (1 Clique)</span>
              </h3>
              <span className="text-[11px] text-slate-500">Baseada em Diretrizes CFN/ANVISA</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {PRESET_CLINICAL_RISK_TEMPLATES.map((preset, index) => {
                const isAlreadyAdded = clinicalAlerts.some(
                  (a) => a.title.toLowerCase() === preset.title.toLowerCase()
                );
                const style = getSeverityBadgeStyle(preset.severity);

                return (
                  <div
                    key={index}
                    className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 hover:border-slate-700 flex items-start justify-between gap-2.5 transition-all"
                  >
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold border ${style.badgeClass}`}
                        >
                          {preset.severity.toUpperCase()}
                        </span>
                        <h5 className="text-xs font-bold text-white truncate">{preset.title}</h5>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{preset.substanceOrDrug}</p>
                      <p className="text-[10px] text-slate-500 line-clamp-1">{preset.recommendation}</p>
                    </div>

                    <button
                      type="button"
                      disabled={isAlreadyAdded}
                      onClick={() => handleAddPreset(preset)}
                      className={`px-2 py-1 rounded-lg text-[11px] font-bold shrink-0 transition-all cursor-pointer ${
                        isAlreadyAdded
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
                      }`}
                    >
                      {isAlreadyAdded ? 'Adicionado' : '+ Adicionar'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Rodapé do Modal com Informações LGPD e Fechar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-sky-400 shrink-0" />
            <span className="text-[11px]">
              Dados sensíveis de saúde protegidos pelo Art. 5º da LGPD. Notificações visíveis apenas para o prescritor.
            </span>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Concluir & Voltar ao Prontuário
          </button>
        </div>
      </div>
    </div>
  );
};
