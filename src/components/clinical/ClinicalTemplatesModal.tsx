import React, { useState, useMemo } from 'react';
import {
  FileSpreadsheet,
  X,
  Check,
  Search,
  UserCheck,
  RotateCw,
  Flame,
  ShieldCheck,
  Heart,
  Activity,
  Layers,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Info,
  AlertTriangle,
  Copy,
  Zap
} from 'lucide-react';
import { useClinicalFocus } from '../../contexts/ClinicalFocusContext';
import { CLINICAL_SOAP_TEMPLATES, ClinicalSoapTemplate } from '../../data/clinicalTemplatesData';

export const ClinicalTemplatesModal: React.FC = () => {
  const {
    isTemplatesModalOpen,
    setTemplatesModalOpen,
    applySoapTemplate,
    activeSection,
    soapData
  } = useClinicalFocus();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('Todos');
  const [activeTemplateId, setActiveTemplateId] = useState<string>(CLINICAL_SOAP_TEMPLATES[0].id);
  const [applyMode, setApplyMode] = useState<'replace' | 'merge' | 'section'>('replace');
  const [confirmReplaceOpen, setConfirmReplaceOpen] = useState(false);
  const [pendingTemplate, setPendingTemplate] = useState<ClinicalSoapTemplate | null>(null);

  const tags = useMemo(() => {
    return ['Todos', 'Primeira Consulta', 'Retorno / Follow-up', 'Esportiva', 'Gastrointestinal', 'Saúde da Mulher', 'Metabólico'];
  }, []);

  const filteredTemplates = useMemo(() => {
    return CLINICAL_SOAP_TEMPLATES.filter(tpl => {
      const matchesTag = selectedTag === 'Todos' || tpl.tag === selectedTag;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        tpl.name.toLowerCase().includes(q) ||
        tpl.description.toLowerCase().includes(q) ||
        tpl.targetObjective.toLowerCase().includes(q) ||
        tpl.soap.a.diagnosis.toLowerCase().includes(q) ||
        tpl.soap.p.supplements.some(s => s.name.toLowerCase().includes(q));
      return matchesTag && matchesSearch;
    });
  }, [selectedTag, searchQuery]);

  const activeTemplate = useMemo(() => {
    return CLINICAL_SOAP_TEMPLATES.find(t => t.id === activeTemplateId) || CLINICAL_SOAP_TEMPLATES[0];
  }, [activeTemplateId]);

  if (!isTemplatesModalOpen) return null;

  const handleApplyClick = (template: ClinicalSoapTemplate, mode: 'replace' | 'merge' | 'section') => {
    // Se o usuário já preencheu anotações no Subjetivo ou Diagnóstico e quer substituir tudo, solicita confirmação para segurança
    const hasUnsavedCustomNotes =
      (soapData.s.trim().length > 30 || soapData.a.diagnosis.trim().length > 10) &&
      mode === 'replace';

    if (hasUnsavedCustomNotes) {
      setPendingTemplate(template);
      setApplyMode(mode);
      setConfirmReplaceOpen(true);
    } else {
      applySoapTemplate(template, mode, activeSection === 'R24' ? 'R24' : activeSection === 'S' || activeSection === 'O' || activeSection === 'A' || activeSection === 'P' ? activeSection : undefined);
      setTemplatesModalOpen(false);
    }
  };

  const handleConfirmReplace = () => {
    if (pendingTemplate) {
      applySoapTemplate(pendingTemplate, applyMode, activeSection === 'R24' ? 'R24' : activeSection === 'S' || activeSection === 'O' || activeSection === 'A' || activeSection === 'P' ? activeSection : undefined);
      setConfirmReplaceOpen(false);
      setPendingTemplate(null);
      setTemplatesModalOpen(false);
    }
  };

  const getTemplateIcon = (iconName: string, className = 'w-4 h-4') => {
    switch (iconName) {
      case 'UserCheck':
        return <UserCheck className={className} />;
      case 'RotateCw':
        return <RotateCw className={className} />;
      case 'Flame':
        return <Flame className={className} />;
      case 'ShieldCheck':
        return <ShieldCheck className={className} />;
      case 'Heart':
        return <Heart className={className} />;
      case 'Activity':
      default:
        return <Activity className={className} />;
    }
  };

  const getTagColorClass = (color: string) => {
    switch (color) {
      case 'emerald':
        return 'bg-emerald-950/70 text-emerald-300 border-emerald-800/80';
      case 'teal':
        return 'bg-teal-950/70 text-teal-300 border-teal-800/80';
      case 'amber':
        return 'bg-amber-950/70 text-amber-300 border-amber-800/80';
      case 'sky':
        return 'bg-sky-950/70 text-sky-300 border-sky-800/80';
      case 'rose':
        return 'bg-rose-950/70 text-rose-300 border-rose-800/80';
      case 'purple':
      default:
        return 'bg-purple-950/70 text-purple-300 border-purple-800/80';
    }
  };

  return (
    <div
      id="modal-templates-prontuario-foco"
      className="fixed inset-0 z-[140] flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        className="w-full max-w-5xl h-[90vh] max-h-[820px] bg-slate-900 border border-slate-700/90 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho do Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-white tracking-tight">
                  Templates de Prontuário Clínico (SOAP)
                </h2>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                  Alt+M
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Carregue estruturas pré-definidas completas com 1 clique para agilizar consultas presenciais.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setTemplatesModalOpen(false)}
            title="Fechar [Esc]"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barra de Filtros e Busca */}
        <div className="px-6 py-3 border-b border-slate-800/80 bg-slate-900/50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
          {/* Tag Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedTag === tag
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-800/70 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Campo de Busca */}
          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar template, queixa, suplemento..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-700/80 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Corpo Principal: Lista de Templates (Esquerda) + Preview Completo (Direita) */}
        <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Lista de Templates (5 Colunas) */}
          <div className="md:col-span-5 border-r border-slate-800/80 overflow-y-auto p-4 space-y-2.5 bg-slate-900/40">
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider px-1">
              Modelos Clínicos Disponíveis ({filteredTemplates.length})
            </div>

            {filteredTemplates.map((template) => {
              const isSelected = template.id === activeTemplateId;
              return (
                <div
                  key={template.id}
                  onClick={() => setActiveTemplateId(template.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative group ${
                    isSelected
                      ? 'bg-slate-800/95 border-emerald-500/80 shadow-lg ring-1 ring-emerald-500/30'
                      : 'bg-slate-950/60 hover:bg-slate-800/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <div
                        className={`p-1.5 rounded-lg border ${getTagColorClass(template.color)}`}
                      >
                        {getTemplateIcon(template.iconName, 'w-3.5 h-3.5')}
                      </div>
                      <span className="font-bold text-xs text-white leading-tight">
                        {template.name}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${getTagColorClass(
                        template.color
                      )}`}
                    >
                      {template.badge}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {template.description}
                  </p>

                  <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-slate-800/60 text-[10px] text-slate-400 font-mono">
                    <span>Meta: {template.soap.p.caloriesTarget} kcal</span>
                    <span>{template.soap.p.supplements.length} suplementos</span>
                    <span className="text-emerald-400 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                      Ver <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}

            {filteredTemplates.length === 0 && (
              <div className="py-12 text-center text-slate-500 space-y-2">
                <Info className="w-8 h-8 mx-auto text-slate-600" />
                <p className="text-xs">Nenhum template encontrado para a busca atual.</p>
              </div>
            )}
          </div>

          {/* Painel de Preview e Aplicação (7 Colunas) */}
          <div className="md:col-span-7 flex flex-col h-full overflow-hidden bg-slate-950/50">
            {/* Header do Preview */}
            <div className="p-5 border-b border-slate-800 bg-slate-900/60 shrink-0">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`p-2 rounded-xl border ${getTagColorClass(activeTemplate.color)}`}
                  >
                    {getTemplateIcon(activeTemplate.iconName, 'w-4 h-4')}
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-white">
                      {activeTemplate.name}
                    </h3>
                    <p className="text-xs text-slate-400">{activeTemplate.targetObjective}</p>
                  </div>
                </div>
              </div>

              {/* Badges de Destaque Clínico */}
              <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] font-mono">
                <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700">
                  Calorias: <strong className="text-emerald-400">{activeTemplate.soap.p.caloriesTarget} kcal</strong>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700">
                  Macros: P {activeTemplate.soap.p.proteinGrams}g • C {activeTemplate.soap.p.carbsGrams}g • G {activeTemplate.soap.p.fatGrams}g
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700">
                  Retorno: {activeTemplate.soap.p.followupDays} dias
                </span>
              </div>
            </div>

            {/* Conteúdo Rolável do Preview SOAP */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              {/* [S] Subjetivo */}
              <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sky-400 text-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-sky-400" />
                    [S] Subjetivo / Anamnese
                  </span>
                  <button
                    type="button"
                    onClick={() => handleApplyClick(activeTemplate, 'section')}
                    title="Aplicar apenas a seção Subjetivo"
                    className="text-[10px] font-mono text-slate-400 hover:text-sky-300 hover:underline cursor-pointer"
                  >
                    Carregar só este bloco
                  </button>
                </div>
                <p className="text-slate-300 text-[11px] whitespace-pre-line leading-relaxed font-mono bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 max-h-32 overflow-y-auto">
                  {activeTemplate.soap.s}
                </p>
              </div>

              {/* [O] Objetivo & Antropometria */}
              <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-400 text-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    [O] Objetivo / Antropometria Estimada
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[11px] font-mono">
                  <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
                    <span className="text-slate-400 text-[10px] block">Peso / Altura</span>
                    <strong className="text-white">{activeTemplate.soap.o.weight}kg / {activeTemplate.soap.o.height}m</strong>
                  </div>
                  <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
                    <span className="text-slate-400 text-[10px] block">IMC / RCQ</span>
                    <strong className="text-white">{activeTemplate.soap.o.bmi} / {activeTemplate.soap.o.rcq}</strong>
                  </div>
                  <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
                    <span className="text-slate-400 text-[10px] block">% Gordura</span>
                    <strong className="text-white">{activeTemplate.soap.o.bodyFatPercent}%</strong>
                  </div>
                  <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
                    <span className="text-slate-400 text-[10px] block">Cintura / Abdômen</span>
                    <strong className="text-white">{activeTemplate.soap.o.waist} / {activeTemplate.soap.o.abdomen}cm</strong>
                  </div>
                </div>
              </div>

              {/* [A] Avaliação */}
              <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-400 text-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-400" />
                    [A] Avaliação & Diagnóstico Nutricional
                  </span>
                </div>
                <p className="text-slate-200 text-[11px] leading-relaxed bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                  {activeTemplate.soap.a.diagnosis}
                </p>
                <div className="flex items-center gap-2 pt-1 text-[10px] font-mono text-slate-400">
                  <span>Bristol Tipo {activeTemplate.soap.a.bristolType}</span>
                  <span>•</span>
                  <span>MSQ: {activeTemplate.soap.a.msqScore} pts</span>
                  <span>•</span>
                  <span className="truncate">{activeTemplate.soap.a.digestiveSymptoms.join(', ')}</span>
                </div>
              </div>

              {/* [P] Plano & Suplementação */}
              <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-400 text-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    [P] Plano de Conduta & Suplementos ({activeTemplate.soap.p.supplements.length})
                  </span>
                </div>
                <div className="space-y-1.5">
                  {activeTemplate.soap.p.supplements.map((s, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-950/80 p-2 rounded-xl border border-slate-800/80 flex items-start justify-between gap-2 text-[11px]"
                    >
                      <div>
                        <strong className="text-emerald-300 block">{s.name}</strong>
                        <span className="text-slate-400 text-[10px]">{s.dosage} — {s.timing}</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {s.route}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Rodapé com Botões de Ação de 1 Clique */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/80 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-[11px] text-slate-400">
                <span>Aplicando no atendimento de: </span>
                <strong className="text-white">Camila Mendonça</strong>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {/* Opção Mesclar (Não-destrutivo) */}
                <button
                  type="button"
                  onClick={() => handleApplyClick(activeTemplate, 'merge')}
                  title="Mescla os dados deste template sem apagar notas já escritas"
                  className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5 text-sky-400" />
                  Mesclar c/ Existente
                </button>

                {/* Botão Principal: Carregar Template Completo */}
                <button
                  type="button"
                  onClick={() => handleApplyClick(activeTemplate, 'replace')}
                  title="Carrega a estrutura completa do template no prontuário"
                  className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold transition-all shadow-md shadow-emerald-950/50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  Carregar Template Completo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Confirmação de Sobrescrita de Segurança (Persona Segurança & Proteção de Dados) */}
      {confirmReplaceOpen && pendingTemplate && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-5 space-y-4 text-slate-200">
            <div className="flex items-center gap-3 text-amber-400">
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-white">Substituir Anotações Atuais?</h4>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Você possui anotações clínicas preenchidas neste prontuário. Deseja substituir a estrutura completa pelo template{' '}
              <strong className="text-white">"{pendingTemplate.name}"</strong> ou prefere mesclar os dados?
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmReplaceOpen(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (pendingTemplate) {
                    applySoapTemplate(pendingTemplate, 'merge');
                    setConfirmReplaceOpen(false);
                    setPendingTemplate(null);
                    setTemplatesModalOpen(false);
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-sky-700 hover:bg-sky-600 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5" />
                Mesclar sem Perder Notas
              </button>
              <button
                type="button"
                onClick={handleConfirmReplace}
                className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold cursor-pointer"
              >
                Sim, Substituir Tudo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
