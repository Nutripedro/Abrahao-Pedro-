import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Search,
  Plus,
  Filter,
  Calculator,
  Calendar,
  Activity,
  FileText,
  ChevronRight,
  MoreVertical,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  Scale,
  FlaskConical,
  GraduationCap,
  Shield,
  Eye,
  EyeOff,
  Maximize2
} from 'lucide-react';
import { useTrainingMode } from '../contexts/TrainingModeContext';
import { useClinicalFocus } from '../contexts/ClinicalFocusContext';
import { patientService, Patient } from '../services/patientService';
import { useAuth } from '../contexts/AuthContext';

interface PatientItem {
  id: string;
  nome: string;
  idade: number;
  sexo: 'M' | 'F';
  peso: number;
  altura: number;
  percentualGordura: number;
  ultimaConsulta: string;
  status: 'Ativo' | 'Em Acompanhamento' | 'Alta';
  telefone: string;
  email: string;
  avatar: string;
  cpf?: string;
  categoriaClinica?: string;
  isSynthetic?: boolean;
}

export const PatientsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { enableClinicalFocus } = useClinicalFocus();
  const {
    isTrainingMode,
    activePatient,
    setActivePatientId,
    syntheticPatients,
    loadPatientIntoStorage,
    openGuideModal,
    formatName,
    formatCpf,
    formatPhone,
    formatEmail
  } = useTrainingMode();

  const [realPatients, setRealPatients] = useState<PatientItem[]>([]);
  const [loading, setLoading] = useState(!isTrainingMode);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // Fetch real patients from Supabase
  React.useEffect(() => {
    if (!isTrainingMode && user) {
      setLoading(true);
      patientService.getAll(user.id)
        .then(data => {
          const mapped: PatientItem[] = data.map(p => ({
            id: p.id,
            nome: p.name,
            idade: p.birth_date ? new Date().getFullYear() - new Date(p.birth_date).getFullYear() : 30,
            sexo: (p.gender as 'M' | 'F') || 'F',
            peso: 0, // In a real app, we'd fetch this from anthropometry table
            altura: 0,
            percentualGordura: 0,
            ultimaConsulta: p.last_consultation || p.created_at,
            status: (p.status as any) || 'Ativo',
            telefone: p.phone || '',
            email: p.email || '',
            avatar: p.name.charAt(0),
          }));
          setRealPatients(mapped);
          setError(null);
        })
        .catch(err => {
          console.error('Error fetching patients:', err);
          setError(err instanceof Error ? err.message : 'Erro ao carregar pacientes do banco de dados.');
        })
        .finally(() => setLoading(false));
    }
  }, [isTrainingMode, user]);

  // New patient form fields
  const [newNome, setNewNome] = useState('');
  const [newIdade, setNewIdade] = useState('30');
  const [newSexo, setNewSexo] = useState<'M' | 'F'>('F');
  const [newPeso, setNewPeso] = useState('65');
  const [newAltura, setNewAltura] = useState('165');

  // Convert synthetic patients to PatientItem interface when training mode is active
  const activeDataset: PatientItem[] = isTrainingMode
    ? syntheticPatients.map((sp) => ({
        id: sp.id,
        nome: sp.nome,
        idade: sp.idade,
        sexo: sp.sexo,
        peso: sp.peso,
        altura: sp.altura,
        percentualGordura: sp.percentualGordura,
        ultimaConsulta: sp.ultimaConsulta || '2026-08-28',
        status: sp.status || 'Ativo',
        telefone: sp.telefoneOfuscado,
        email: sp.emailOfuscado,
        avatar: sp.avatar,
        cpf: sp.cpfOfuscado,
        categoriaClinica: sp.categoriaClinica,
        isSynthetic: true
      }))
    : realPatients;

  const filteredPatients = activeDataset.filter((p) => {
    const displayName = formatName(p.nome);
    const displayEmail = formatEmail(p.email);
    const matchesSearch =
      displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      displayEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.categoriaClinica && p.categoriaClinica.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus =
      statusFilter === 'todos' || p.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNome.trim() || !user) return;

    try {
      setLoading(true);
      const newPatientData = {
        professional_id: user.id,
        name: newNome.trim(),
        gender: newSexo,
        status: 'Ativo',
        phone: '(11) 99999-9999',
        email: `${newNome.toLowerCase().replace(/\s+/g, '.')}@email.com`,
      };

      const created = await patientService.create(newPatientData);
      
      const mapped: PatientItem = {
        id: created.id,
        nome: created.name,
        idade: Number(newIdade) || 30,
        sexo: created.gender as 'M' | 'F',
        peso: Number(newPeso) || 70,
        altura: Number(newAltura) || 170,
        percentualGordura: 22.0,
        ultimaConsulta: created.created_at,
        status: 'Ativo',
        telefone: created.phone || '',
        email: created.email || '',
        avatar: created.name.charAt(0).toUpperCase(),
      };

      setRealPatients([mapped, ...realPatients]);
      setIsNewModalOpen(false);
      setNewNome('');
    } catch (err) {
      console.error('Error creating patient:', err);
      setError(err instanceof Error ? err.message : 'Erro ao salvar novo paciente.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartEvaluation = (patient: PatientItem) => {
    if (patient.isSynthetic) {
      setActivePatientId(patient.id);
      loadPatientIntoStorage(patient.id);
    }
    navigate('/calculadoras/dobras-cutaneas');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-xs ${
              isTrainingMode ? 'bg-amber-600 text-white' : 'bg-indigo-500 text-white'
            }`}>
              {isTrainingMode ? <FlaskConical className="w-5 h-5" /> : <Users className="w-5 h-5" />}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {isTrainingMode ? 'Prontuário Simulado (Modo de Treinamento)' : 'Prontuário de Pacientes'}
            </h1>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono ${
              isTrainingMode
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
            }`}>
              {filteredPatients.length} {isTrainingMode ? 'Casos Sintéticos' : 'Cadastrados'}
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {isTrainingMode
              ? 'Ambiente de testes com pacientes sintéticos e dados sensíveis protegidos conforme LGPD.'
              : 'Acompanhe o histórico clínico, status antropométrico e inicie avaliações diretamente.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          <button
            id="btn-iniciar-foco-patients-header"
            type="button"
            onClick={() => enableClinicalFocus({ name: activePatient?.nome || 'Novo Paciente' })}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold text-xs shadow-xs transition-all cursor-pointer hover:scale-[1.02]"
            title="Abrir Prontuário em Tela Cheia e Modo Foco Presencial [Alt+F]"
          >
            <Maximize2 className="w-4 h-4" />
            <span className="hidden sm:inline">Modo Foco Presencial</span>
            <span className="sm:hidden">Modo Foco</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-600/30 text-slate-950 font-extrabold">Alt+F</span>
          </button>

          {isTrainingMode ? (
            <button
              type="button"
              onClick={openGuideModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer hover:scale-[1.02]"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Ver Roteiros de Treinamento</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsNewModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              <span>Cadastrar Paciente</span>
            </button>
          )}
        </div>
      </div>

      {/* Notice in Training Mode */}
      {isTrainingMode && (
        <div className="p-4 bg-amber-500/10 dark:bg-amber-950/40 border border-amber-300/80 dark:border-amber-700/60 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-amber-900 dark:text-amber-200">
                Visualizando Prontuários Sintéticos • Proteção de Dados LGPD Ativa
              </p>
              <p className="text-amber-800/80 dark:text-amber-300/80">
                Você pode selecionar qualquer paciente fictício abaixo para praticar cálculos energéticos, dobras ISAK, prescrição de suplementos e requisições.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={openGuideModal}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shrink-0 transition-colors cursor-pointer"
          >
            Abrir Roteiro Clínico
          </button>
        </div>
      )}

      {/* 2. Barra de Busca e Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={isTrainingMode ? "Buscar por perfil sintético..." : "Buscar por nome ou e-mail..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
            <button
              type="button"
              onClick={() => setStatusFilter('todos')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                statusFilter === 'todos'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Todos
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('ativo')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                statusFilter === 'ativo'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Ativos
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('em acompanhamento')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                statusFilter === 'em acompanhamento'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Acompanhamento
            </button>
          </div>
        </div>
      </div>

      {/* 3. Lista e Tabela de Pacientes */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="p-4 sm:px-6">Paciente</th>
                <th className="p-4">CPF / Contato</th>
                <th className="p-4">Idade / Sexo</th>
                <th className="p-4">Peso & Altura</th>
                <th className="p-4">% Gordura Atual</th>
                <th className="p-4">Perfil Clínico</th>
                <th className="p-4 text-right pr-6">Ação de Prática</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredPatients.map((p) => {
                const isSelected = isTrainingMode && p.id === activePatient.id;
                return (
                  <tr
                    key={p.id}
                    className={`transition-colors ${
                      isSelected
                        ? 'bg-amber-500/10 dark:bg-amber-950/40'
                        : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <td className="p-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full font-bold flex items-center justify-center text-xs shrink-0 ${
                          isTrainingMode
                            ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                            : 'bg-slate-700 text-white'
                        }`}>
                          {p.avatar}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-slate-900 dark:text-white text-sm">
                              {formatName(p.nome)}
                            </p>
                            {p.isSynthetic && (
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300">
                                Sintético
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 font-mono">{formatEmail(p.email)}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                      <div>{p.cpf ? formatCpf(p.cpf) : '***.***.***-**'}</div>
                      <div className="text-[10px] text-slate-400">{formatPhone(p.telefone)}</div>
                    </td>

                    <td className="p-4 text-slate-700 dark:text-slate-300 font-medium">
                      {p.idade} anos ({p.sexo === 'M' ? 'Masc' : 'Fem'})
                    </td>
                    <td className="p-4 font-mono text-slate-700 dark:text-slate-300">
                      <span className="font-bold">{p.peso} kg</span> • {p.altura} cm
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold font-mono bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/60">
                        <Activity className="w-3 h-3 text-amber-500" />
                        {p.percentualGordura}% G
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                      >
                        {p.categoriaClinica || p.status}
                      </span>
                    </td>
                    <td className="p-4 text-right pr-6">
                      <div className="inline-flex items-center gap-2">
                        {isTrainingMode && (
                          <button
                            type="button"
                            onClick={() => {
                              setActivePatientId(p.id);
                              loadPatientIntoStorage(p.id);
                            }}
                            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-amber-600 text-white shadow-xs'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                            }`}
                          >
                            {isSelected ? 'Em Foco' : 'Selecionar'}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => enableClinicalFocus({ name: p.nome, age: p.idade, gender: p.sexo === 'M' ? 'Masculino' : 'Feminino', lastWeight: p.peso })}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-all cursor-pointer hover:scale-105"
                          title="Iniciar Atendimento em Tela Cheia no Modo Foco Presencial (Alt+F)"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                          <span>Atender em Foco</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStartEvaluation(p)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-xs transition-all cursor-pointer hover:scale-105"
                          title="Abrir Calculadora de Dobras para este paciente"
                        >
                          <Calculator className="w-3.5 h-3.5" />
                          <span>{isTrainingMode ? 'Simular Dobras' : 'Avaliar'}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Novo Paciente */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-7 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 my-auto">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-sky-500 shrink-0" />
              <span>Cadastrar Novo Paciente</span>
            </h2>

            <form onSubmit={handleAddPatient} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nome Completo <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newNome}
                  onChange={(e) => setNewNome(e.target.value)}
                  placeholder="Ex: Rodrigo Albuquerque"
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-base sm:text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Idade (anos)
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={newIdade}
                    onChange={(e) => setNewIdade(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-base sm:text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Sexo Biológico
                  </label>
                  <select
                    value={newSexo}
                    onChange={(e) => setNewSexo(e.target.value as 'M' | 'F')}
                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-base sm:text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
                  >
                    <option value="F">Feminino</option>
                    <option value="M">Masculino</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Peso (kg)
                  </label>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.1"
                    value={newPeso}
                    onChange={(e) => setNewPeso(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-base sm:text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Altura (cm)
                  </label>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={newAltura}
                    onChange={(e) => setNewAltura(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-base sm:text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold cursor-pointer text-center hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold shadow-xs cursor-pointer text-center"
                >
                  Salvar Paciente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
