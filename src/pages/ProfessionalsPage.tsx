import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Plus,
  Stethoscope,
  Apple,
  Award,
  ToggleLeft,
  ToggleRight,
  Mail,
  Phone,
  Search,
  Filter,
  Sliders,
  FileBadge,
  UserCheck,
  Zap,
  ArrowRight,
  Pencil,
  X
} from 'lucide-react';
import { useAuth, ClinicalProfessional } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const ProfessionalsPage: React.FC = () => {
  const {
    professionals,
    allProfessionalFeaturesActive,
    setAllProfessionalFeaturesActive,
    toggleProfessionalFeatures,
    updateProfessional,
    addProfessional,
    activateAllTeamFeatures
  } = useAuth();

  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('todos');
  const [editingProf, setEditingProf] = useState<ClinicalProfessional | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [toastFeedback, setToastFeedback] = useState<string | null>(null);

  const [newForm, setNewForm] = useState<Omit<ClinicalProfessional, 'id'>>({
    name: '',
    role: 'Nutricionista',
    councilType: 'CRN',
    councilNumber: '',
    councilState: 'SP',
    specialty: '',
    email: '',
    phone: '',
    status: 'ativo',
    allFeaturesEnabled: true,
    prescriberType: 'nutricionista',
    signatureText: ''
  });

  const showToast = (msg: string) => {
    setToastFeedback(msg);
    setTimeout(() => setToastFeedback(null), 3500);
  };

  const handleActivateAll = () => {
    activateAllTeamFeatures();
    showToast('Todas as funções profissionais foram ativadas para toda a equipe!');
  };

  const filteredProfessionals = professionals.filter(prof => {
    const matchesSearch =
      prof.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prof.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prof.councilNumber.includes(searchTerm);

    const matchesRole =
      roleFilter === 'todos' ||
      (roleFilter === 'nutri' && prof.councilType === 'CRN') ||
      (roleFilter === 'med' && prof.councilType === 'CRM') ||
      (roleFilter === 'cref' && prof.councilType === 'CREF');

    return matchesSearch && matchesRole;
  });

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProf) return;
    updateProfessional(editingProf);
    setEditingProf(null);
    showToast(`Cadastro de ${editingProf.name} atualizado com sucesso.`);
  };

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForm.name || !newForm.councilNumber) return;
    addProfessional({
      ...newForm,
      signatureText: `${newForm.name} - ${newForm.councilType}-${newForm.councilState} ${newForm.councilNumber}`
    });
    setIsNewModalOpen(false);
    setNewForm({
      name: '',
      role: 'Nutricionista',
      councilType: 'CRN',
      councilNumber: '',
      councilState: 'SP',
      specialty: '',
      email: '',
      phone: '',
      status: 'ativo',
      allFeaturesEnabled: true,
      prescriberType: 'nutricionista',
      signatureText: ''
    });
    showToast('Novo profissional cadastrado com todas as funções liberadas!');
  };

  return (
    <div id="pagina-profissionais" className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast Notificação */}
      {toastFeedback && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white border border-sky-500 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 text-xs font-medium">
          <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
          <span>{toastFeedback}</span>
        </div>
      )}

      {/* Cabeçalho Principal da Página */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-sky-600 dark:text-sky-400 font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Corpo Clínico & Licenciamento Profissional</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1 font-sans">
            Profissionais & Ativação de Funções
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gerenciamento de conselhos de classe (CRN, CRM, CREF), alçada prescritiva e ativação de módulos avançados.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleActivateAll}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
          >
            <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
            <span>Ativar Todas as Funções</span>
          </button>

          <button
            type="button"
            onClick={() => setIsNewModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-sky-400" />
            <span>Novo Profissional</span>
          </button>
        </div>
      </div>

      {/* Banner de Status de Ativação Master */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-sky-900/60 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-bold font-mono">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>Plano Multi-Profissional & Clínico Ativo</span>
            </div>
            <h2 className="text-xl font-bold font-sans tracking-tight text-white">
              Status Operacional: Todas as Funções Profissionais Habilitadas
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Todos os módulos regulatórios e clínicos estão liberados para prescrição e diagnóstico:
              cálculos de TMB/GET validados, RDC 429 ANVISA, receituário de suplementos (doses nutricionais e médicas) e requisição de exames laboratoriais.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-[10px] uppercase font-mono text-slate-400 block font-bold">
                Profissionais Ativos
              </span>
              <span className="text-2xl font-bold font-mono text-sky-400 tabular-nums">
                {professionals.length}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-[10px] uppercase font-mono text-slate-400 block font-bold">
                Módulos Ativados
              </span>
              <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
                100%
              </span>
            </div>
          </div>
        </div>

        {/* Grade de Atalhos Rápidos para os Módulos Profissionais */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            type="button"
            onClick={() => navigate('/nutricao/suplementos')}
            className="p-3 rounded-2xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between text-sky-400 text-xs font-bold mb-1">
              <span>Suplementos</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <span className="text-[11px] text-slate-300 block">Doses Nutri vs. Médico</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/clinico/exames')}
            className="p-3 rounded-2xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between text-sky-400 text-xs font-bold mb-1">
              <span>Requisição Exames</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <span className="text-[11px] text-slate-300 block">Painéis Laboratoriais</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/nutricao/tabela-anvisa')}
            className="p-3 rounded-2xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between text-sky-400 text-xs font-bold mb-1">
              <span>Tabela ANVISA</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <span className="text-[11px] text-slate-300 block">RDC 429 & IN 75/2020</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/calculadoras/dobras-cutaneas')}
            className="p-3 rounded-2xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between text-sky-400 text-xs font-bold mb-1">
              <span>Antropometria IA</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <span className="text-[11px] text-slate-300 block">Auditoria & Composição</span>
          </button>
        </div>
      </div>

      {/* Filtros e Barra de Busca */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome, especialidade ou registro..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          <button
            type="button"
            onClick={() => setRoleFilter('todos')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              roleFilter === 'todos'
                ? 'bg-slate-900 text-white dark:bg-sky-600'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Todos ({professionals.length})
          </button>
          <button
            type="button"
            onClick={() => setRoleFilter('nutri')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              roleFilter === 'nutri'
                ? 'bg-slate-900 text-white dark:bg-sky-600'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Nutricionistas (CRN)
          </button>
          <button
            type="button"
            onClick={() => setRoleFilter('med')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              roleFilter === 'med'
                ? 'bg-slate-900 text-white dark:bg-sky-600'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Médicos (CRM)
          </button>
          <button
            type="button"
            onClick={() => setRoleFilter('cref')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              roleFilter === 'cref'
                ? 'bg-slate-900 text-white dark:bg-sky-600'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Educadores Físicos (CREF)
          </button>
        </div>
      </div>

      {/* Lista de Profissionais da Equipe */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProfessionals.map((prof) => (
          <div
            key={prof.id}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs p-6 flex flex-col justify-between space-y-5 transition-all hover:border-sky-300 dark:hover:border-sky-800"
          >
            <div>
              {/* Header do Card com Nome e Badges */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/70 border border-sky-100 dark:border-sky-900 text-sky-700 dark:text-sky-300 flex items-center justify-center font-bold text-base shrink-0">
                    {prof.councilType === 'CRN' ? <Apple className="w-6 h-6" /> : <Stethoscope className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white font-sans">
                      {prof.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-mono font-bold text-sky-700 dark:text-sky-400">
                        {prof.councilType}-{prof.councilState} {prof.councilNumber}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        {prof.role}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setEditingProf(prof)}
                  className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                  title="Editar profissional"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </div>

              {/* Especialidade e Contato */}
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 font-sans leading-relaxed">
                {prof.specialty}
              </p>

              <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{prof.email}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{prof.phone}</span>
                </span>
              </div>
            </div>

            {/* Painel Inferior de Funções e Permissões */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono">
                  Funções Profissionais:
                </span>
                <button
                  type="button"
                  onClick={() => toggleProfessionalFeatures(prof.id)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold font-mono transition-colors cursor-pointer text-emerald-700 dark:text-emerald-400"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>100% Ativadas</span>
                </button>
              </div>

              {/* Badges de Módulos Habilitados */}
              <div className="flex flex-wrap gap-1.5">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-sky-50 dark:bg-sky-950/70 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800 font-medium">
                  {prof.prescriberType === 'medico' ? 'Doses Médicas (CFM)' : 'Doses Nutricionais (CFN)'}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-medium">
                  Exames Laboratoriais
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-medium">
                  Tabela ANVISA RDC 429
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-medium">
                  Cineantropometria ISAK
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Editar Profissional */}
      {editingProf && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-sans">
                Editar Cadastro Profissional
              </h3>
              <button
                type="button"
                onClick={() => setEditingProf(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={editingProf.name}
                  onChange={(e) => setEditingProf({ ...editingProf, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Conselho
                  </label>
                  <select
                    value={editingProf.councilType}
                    onChange={(e) => setEditingProf({ ...editingProf, councilType: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="CRN">CRN</option>
                    <option value="CRM">CRM</option>
                    <option value="CREF">CREF</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    UF
                  </label>
                  <input
                    type="text"
                    value={editingProf.councilState}
                    onChange={(e) => setEditingProf({ ...editingProf, councilState: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Número
                  </label>
                  <input
                    type="text"
                    value={editingProf.councilNumber}
                    onChange={(e) => setEditingProf({ ...editingProf, councilNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Especialidade / Linha de Atuação
                </label>
                <input
                  type="text"
                  value={editingProf.specialty}
                  onChange={(e) => setEditingProf({ ...editingProf, specialty: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Alçada de Prescrição no SaaS
                </label>
                <select
                  value={editingProf.prescriberType}
                  onChange={(e) => setEditingProf({ ...editingProf, prescriberType: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                >
                  <option value="nutricionista">Nutricionista (Doses Suplementares & Fitoterápicos)</option>
                  <option value="medico">Médico (Doses Farmacológicas / Terapêuticas Ampliadas)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingProf(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-sky-600 text-white font-bold hover:bg-sky-500 shadow-xs"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Novo Profissional */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-sans">
                Cadastrar Novo Profissional de Saúde
              </h3>
              <button
                type="button"
                onClick={() => setIsNewModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNew} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Nome do Profissional
                </label>
                <input
                  type="text"
                  value={newForm.name}
                  onChange={(e) => setNewForm({ ...newForm, name: e.target.value })}
                  placeholder="Ex: Dra. Juliana Silveira"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Conselho
                  </label>
                  <select
                    value={newForm.councilType}
                    onChange={(e) => setNewForm({ ...newForm, councilType: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="CRN">CRN</option>
                    <option value="CRM">CRM</option>
                    <option value="CREF">CREF</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    UF
                  </label>
                  <input
                    type="text"
                    value={newForm.councilState}
                    onChange={(e) => setNewForm({ ...newForm, councilState: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Número
                  </label>
                  <input
                    type="text"
                    value={newForm.councilNumber}
                    onChange={(e) => setNewForm({ ...newForm, councilNumber: e.target.value })}
                    placeholder="Ex: 38210"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Especialidade
                </label>
                <input
                  type="text"
                  value={newForm.specialty}
                  onChange={(e) => setNewForm({ ...newForm, specialty: e.target.value })}
                  placeholder="Ex: Nutrição Esportiva & Fisiologia Metabólica"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    E-mail Profissional
                  </label>
                  <input
                    type="email"
                    value={newForm.email}
                    onChange={(e) => setNewForm({ ...newForm, email: e.target.value })}
                    placeholder="juliana@clinica.com"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Telefone / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={newForm.phone}
                    onChange={(e) => setNewForm({ ...newForm, phone: e.target.value })}
                    placeholder="(11) 98888-7777"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Variante de Prescrição Inicial
                </label>
                <select
                  value={newForm.prescriberType}
                  onChange={(e) => setNewForm({ ...newForm, prescriberType: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                >
                  <option value="nutricionista">Nutricionista (Limites RDC ANVISA / CFN)</option>
                  <option value="medico">Médico (Doses Farmacológicas / CFM)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-sky-600 text-white font-bold hover:bg-sky-500 shadow-xs"
                >
                  Cadastrar com Acesso Total
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
