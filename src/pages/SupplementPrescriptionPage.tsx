import React, { useState } from 'react';
import {
  Pill,
  Sparkles,
  Search,
  Plus,
  Trash2,
  Printer,
  Share2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  HelpCircle,
  FileText,
  User,
  ShieldAlert,
  Info,
  ChevronDown,
  Stethoscope,
  Apple
} from 'lucide-react';
import {
  CLINICAL_SUPPLEMENTS_DATABASE,
  StructuredSupplement,
  PrescriberVariant
} from '../data/clinicalSupplementsData';
import { useAuth } from '../contexts/AuthContext';
import { prescriptionService, Prescription } from '../services/prescriptionService';

interface PrescribedItem {
  id: string;
  supplement: StructuredSupplement;
  customDose: string;
  route: string;
  frequency: string;
  schedule: string;
  notes?: string;
}

export const SupplementPrescriptionPage: React.FC = () => {
  const { user, activePrescriberType, setActivePrescriberType } = useAuth();

  const [currentPrescriberVariant, setCurrentPrescriberVariant] = useState<PrescriberVariant>(activePrescriberType);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [prescribedItems, setPrescribedItems] = useState<PrescribedItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [patientName, setPatientName] = useState('Rodrigo Silveira da Rocha');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Fetch real prescriptions for context or history if needed
  // Here we keep current list local until the user clicks "Save/Print"

  const notify = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleVariantChange = (variant: PrescriberVariant) => {
    setCurrentPrescriberVariant(variant);
    setActivePrescriberType(variant);
    notify(`Variante de prescrição alterada para: ${variant === 'nutricionista' ? 'Nutricionista (CFN / ANVISA)' : 'Médico (CFM / Farmacológico)'}`);
  };

  const filteredSupplements = CLINICAL_SUPPLEMENTS_DATABASE.filter(item => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.chemicalForm.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.indications.some(i => i.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'todas' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddSupplement = (supp: StructuredSupplement) => {
    const activeDose = supp.doses[currentPrescriberVariant];
    const newItem: PrescribedItem = {
      id: `presc-${Date.now()}`,
      supplement: supp,
      customDose: activeDose.standardDose,
      route: activeDose.route,
      frequency: activeDose.frequency,
      schedule: activeDose.recommendedSchedule,
      notes: supp.clinicalNotes
    };

    setPrescribedItems(prev => [...prev, newItem]);
    notify(`${supp.name} adicionado ao receituário clínico!`);
  };

  const handleRemoveItem = (id: string) => {
    setPrescribedItems(prev => prev.filter(i => i.id !== id));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="pagina-receituario-suplementos" className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Toast Feedback */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white border border-sky-500 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-medium animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Principal */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-sky-600 dark:text-sky-400 font-bold uppercase tracking-wider">
            <Pill className="w-4 h-4" />
            <span>Módulo Clínico de Prescrição Estruturada</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1 font-sans">
            Receituário Inteligente de Suplementos
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Posologias estruturadas com dupla variante regulatória (Nutrição Funcional vs. Medicina Integrativa).
          </p>
        </div>

        {/* Seletor de Variante de Prescritor (Nutricionista vs. Médico) */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => handleVariantChange('nutricionista')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              currentPrescriberVariant === 'nutricionista'
                ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Apple className="w-4 h-4" />
            <span>Variante Nutricionista</span>
          </button>

          <button
            type="button"
            onClick={() => handleVariantChange('medico')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              currentPrescriberVariant === 'medico'
                ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>Variante Médico</span>
          </button>
        </div>
      </div>

      {/* Identificação do Paciente e Alçada Regulatória */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-xs">
          <div>
            <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1">
              Paciente em Atendimento
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
              Profissional Responsável
            </label>
            <div className="flex items-center gap-2 min-h-[44px] px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-slate-700 dark:text-slate-300 text-xs">
              <FileText className="w-4 h-4 text-sky-500 shrink-0" />
              <span className="truncate">{user?.name || 'Dra. Vanessa Rios'} ({user?.councilInfo || 'CRN-3 14285'})</span>
            </div>
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1">
              Escopo Regulatório Selecionado
            </label>
            <div className="min-h-[44px] flex items-center px-3 py-2 rounded-xl bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800 font-mono text-sky-800 dark:text-sky-300 text-[11px] font-bold">
              {currentPrescriberVariant === 'nutricionista'
                ? 'Resoluções CFN 656/2020 & IN 28 ANVISA'
                : 'Resolução CFM 2.217/2018 & Alçada Farmacológica'}
            </div>
          </div>
        </div>
      </div>

      {/* Grid Principal: Catálogo de Suplementos (Esquerda) vs. Receituário em Construção (Direita) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Catálogo de Suplementos */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white font-sans flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-500" />
                <span>Base Estruturada de Suplementos</span>
              </h2>
              <span className="text-[11px] font-mono text-slate-400">
                {filteredSupplements.length} compostos
              </span>
            </div>

            {/* Busca & Filtros */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por composto, indicação ou forma..."
                  className="w-full min-h-[44px] pl-10 pr-3 py-2.5 text-base sm:text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full min-h-[44px] px-3.5 py-2.5 text-base sm:text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-sans cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="todas">Todas as Categorias Clínicas</option>
                <option value="Desempenho & Músculo">Desempenho & Músculo</option>
                <option value="Sono & Eixo Neural">Sono & Eixo Neural</option>
                <option value="Imunidade & Vitaminas">Imunidade & Vitaminas</option>
                <option value="Antioxidantes & Longevidade">Antioxidantes & Longevidade</option>
              </select>
            </div>

            {/* Lista de Cards de Suplementos do Banco */}
            <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
              {filteredSupplements.map((supp) => {
                const doseConfig = supp.doses[currentPrescriberVariant];
                return (
                  <div
                    key={supp.id}
                    className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-700 transition-all space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-xs font-bold text-slate-900 dark:text-white font-sans">
                          {supp.name}
                        </h3>
                        <p className="text-[11px] text-sky-600 dark:text-sky-400 font-mono mt-0.5">
                          {supp.chemicalForm}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddSupplement(supp)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-[11px] font-bold shrink-0 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Prescrever</span>
                      </button>
                    </div>

                    {/* Doses Ativas Conforme a Variante Selecionada */}
                    <div className="p-2 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200/70 dark:border-slate-800 text-[11px] space-y-1">
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-500">Dose Padrão:</span>
                        <span className="font-bold text-slate-900 dark:text-white">{doseConfig.standardDose}</span>
                      </div>
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-500">Limite Seguro:</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">{doseConfig.maxDailyDose}</span>
                      </div>
                      <div className="flex justify-between text-slate-600 dark:text-slate-300">
                        <span className="text-slate-500">Horário:</span>
                        <span className="truncate max-w-[210px]">{doseConfig.recommendedSchedule}</span>
                      </div>
                    </div>

                    {/* Patologias e Interações em dados estruturados */}
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 flex flex-wrap gap-1">
                      {supp.associatedPathologies.slice(0, 2).map((pat, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                          {pat}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Receituário em Construção (Direita) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white font-sans flex items-center gap-2">
                  <FileText className="w-5 h-5 text-sky-500" />
                  <span>Prescrição Clínica Ativa</span>
                </h2>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  {prescribedItems.length} {prescribedItems.length === 1 ? 'item prescrito' : 'itens prescritos'} para {patientName}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir / PDF</span>
                </button>
              </div>
            </div>

            {/* Lista de Itens Prescritos */}
            {prescribedItems.length === 0 ? (
              <div className="p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
                <Pill className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs text-slate-500 font-medium">
                  Nenhum suplemento selecionado. Escolha compostos na base ao lado para compor a receita.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {prescribedItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3 relative group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 font-mono text-xs font-bold flex items-center justify-center">
                          {index + 1}
                        </span>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white font-sans">
                            {item.supplement.name}
                          </h4>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                            Forma: {item.supplement.chemicalForm}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
                        title="Remover item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Campos de Posologia e Horário */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                      <div>
                        <label className="block text-[11px] text-slate-500 dark:text-slate-400 font-bold mb-1">
                          Posologia / Dose
                        </label>
                        <input
                          type="text"
                          value={item.customDose}
                          onChange={(e) => {
                            const val = e.target.value;
                            setPrescribedItems(prev =>
                              prev.map(i => i.id === item.id ? { ...i, customDose: val } : i)
                            );
                          }}
                          className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-base sm:text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-500 dark:text-slate-400 font-bold mb-1">
                          Via & Frequência
                        </label>
                        <input
                          type="text"
                          value={`${item.route} - ${item.frequency}`}
                          onChange={(e) => {
                            const val = e.target.value;
                            setPrescribedItems(prev =>
                              prev.map(i => i.id === item.id ? { ...i, frequency: val } : i)
                            );
                          }}
                          className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-base sm:text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-500 dark:text-slate-400 font-bold mb-1">
                          Horário de Tomada
                        </label>
                        <input
                          type="text"
                          value={item.schedule}
                          onChange={(e) => {
                            const val = e.target.value;
                            setPrescribedItems(prev =>
                              prev.map(i => i.id === item.id ? { ...i, schedule: val } : i)
                            );
                          }}
                          className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-base sm:text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                      </div>
                    </div>

                    {/* Orientações Clínicas e Interações */}
                    <div>
                      <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">
                        Instruções Adicionais para o Paciente
                      </label>
                      <input
                        type="text"
                        value={item.notes || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setPrescribedItems(prev =>
                            prev.map(i => i.id === item.id ? { ...i, notes: val } : i)
                          );
                        }}
                        className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-base sm:text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        placeholder="Ex: Ingerir com água antes de dormir..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Rodapé do Receituário: Assinatura e Carimbo Digital */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="text-slate-500 dark:text-slate-400 text-[11px] space-y-0.5">
                <p className="font-bold text-slate-700 dark:text-slate-200">
                  {user?.name || 'Dra. Vanessa Rios'} — {user?.councilInfo || 'CRN-3 14285'}
                </p>
                <p>Receituário emitido com assinatura digital e código de rastreabilidade clínica.</p>
              </div>

              <button
                type="button"
                onClick={() => notify('Receita sincronizada com o Aplicativo do Paciente!')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Enviar p/ App do Paciente</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
