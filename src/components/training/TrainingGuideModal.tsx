import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  Shield,
  GraduationCap,
  FlaskConical,
  Scale,
  Table2,
  Pill,
  FileSpreadsheet,
  Megaphone,
  Smartphone,
  Sparkles,
  Info,
  Lightbulb,
  ExternalLink
} from 'lucide-react';
import { useTrainingMode } from '../../contexts/TrainingModeContext';

export const TrainingGuideModal: React.FC = () => {
  const {
    isGuideModalOpen,
    closeGuideModal,
    guideTopics,
    selectedGuideTopic,
    setSelectedGuideTopic,
    syntheticPatients,
    activePatient,
    setActivePatientId,
    loadPatientIntoStorage
  } = useTrainingMode();

  const [activeTab, setActiveTab] = useState<'guia' | 'casos' | 'lgpd'>('guia');
  const navigate = useNavigate();

  if (!isGuideModalOpen) return null;

  const currentTopic = selectedGuideTopic || guideTopics[0];

  const handleOpenModule = (route: string, patientId?: string) => {
    if (patientId) {
      setActivePatientId(patientId);
      loadPatientIntoStorage(patientId);
    }
    closeGuideModal();
    navigate(route);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-700/50 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Central de Treinamento & Simulação Clínica
                </h3>
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                  Dados Sintéticos
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Aprenda a operar os recursos avançados do sistema com casos fictícios seguros para LGPD.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeGuideModal}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 px-6 bg-white dark:bg-slate-900">
          <button
            type="button"
            onClick={() => setActiveTab('guia')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'guia'
                ? 'border-amber-600 text-amber-700 dark:text-amber-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Roteiros de Aprendizado ({guideTopics.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('casos')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'casos'
                ? 'border-amber-600 text-amber-700 dark:text-amber-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Casos Clínicos Sintéticos ({syntheticPatients.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('lgpd')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'lgpd'
                ? 'border-amber-600 text-amber-700 dark:text-amber-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Segurança & LGPD (Art. 5º)</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* TAB 1: ROTEIROS DE APRENDIZADO */}
          {activeTab === 'guia' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Left Column: Topics List */}
              <div className="md:col-span-4 space-y-2 border-r border-slate-100 dark:border-slate-800 pr-0 md:pr-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono block mb-1">
                  Selecione um Módulo:
                </span>
                {guideTopics.map((topic) => {
                  const isSelected = topic.id === currentTopic.id;
                  return (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => setSelectedGuideTopic(topic)}
                      className={`w-full text-left p-3 rounded-2xl border transition-all flex items-start justify-between gap-2 cursor-pointer ${
                        isSelected
                          ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700/60 shadow-xs'
                          : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white block">
                          {topic.titulo}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                          {topic.subtitulo}
                        </span>
                      </div>
                      <ChevronRightIcon className={`w-4 h-4 shrink-0 mt-1 ${isSelected ? 'text-amber-600' : 'text-slate-400'}`} />
                    </button>
                  );
                })}
              </div>

              {/* Right Column: Active Topic Guide Details */}
              <div className="md:col-span-8 space-y-5">
                <div className="p-4 bg-amber-50/60 dark:bg-amber-950/20 rounded-2xl border border-amber-200/80 dark:border-amber-800/50">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 font-mono block">
                    Objetivo do Módulo
                  </span>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                    {currentTopic.titulo} — {currentTopic.subtitulo}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    {currentTopic.resumo}
                  </p>
                </div>

                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono mb-2.5">
                    Passo a Passo Recomendado para Praticar:
                  </h5>
                  <div className="space-y-2">
                    {currentTopic.passos.map((step, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800"
                      >
                        <div className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 flex items-center justify-center text-xs font-bold font-mono shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300">
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-start gap-2.5">
                  <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      Dica Clínica & Regulatória:
                    </span>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                      {currentTopic.dicaClinica}
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between gap-3">
                  <span className="text-xs text-slate-500 font-medium">
                    Caso recomendado: <strong className="text-slate-700 dark:text-slate-200">Mariana Lima (Atleta)</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleOpenModule(currentTopic.rotaSugerida, currentTopic.casoIdRecomendado)}
                    className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    <span>Praticar neste Módulo Agora</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: CASOS CLÍNICOS SINTÉTICOS */}
          {activeTab === 'casos' && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                Estes 6 pacientes foram criados com dados antropométricos, laboratoriais e anamneses consistentes para simular atendimentos reais sem violar a privacidade de nenhum paciente.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {syntheticPatients.map((p) => {
                  const isCurrent = p.id === activePatient.id;
                  return (
                    <div
                      key={p.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                        isCurrent
                          ? 'bg-amber-50/50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700 shadow-xs'
                          : 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold uppercase font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                            {p.categoriaClinica}
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1 font-mono">
                              <CheckCircle2 className="w-3 h-3" />
                              Ativo
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2.5 mb-2">
                          <div className="w-9 h-9 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 font-bold flex items-center justify-center text-sm">
                            {p.avatar}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                              {p.nomeOfuscado}
                            </h4>
                            <span className="text-[11px] text-slate-500 font-mono">
                              {p.idade} anos • {p.sexo === 'F' ? 'Feminino' : 'Masculino'}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-2">
                          {p.metaClinica}
                        </p>

                        <div className="grid grid-cols-3 gap-1.5 p-2 bg-slate-50 dark:bg-slate-900/60 rounded-xl text-center text-[10px] font-mono border border-slate-100 dark:border-slate-800">
                          <div>
                            <span className="text-slate-400 block">Peso</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">{p.peso}kg</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">% Gord</span>
                            <span className="font-bold text-amber-700 dark:text-amber-400">{p.percentualGordura}%</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">TMB</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">{p.tmbKcal}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setActivePatientId(p.id);
                            loadPatientIntoStorage(p.id);
                          }}
                          className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-center ${
                            isCurrent
                              ? 'bg-amber-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          {isCurrent ? 'Caso em Uso' : 'Carregar Caso'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenModule('/calculadoras/dobras-cutaneas', p.id)}
                          title="Avaliar Dobras Deste Caso"
                          className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer"
                        >
                          <Scale className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: SEGURANÇA & LGPD */}
          {activeTab === 'lgpd' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm mb-1">
                  <Shield className="w-4 h-4" />
                  <span>Conformidade com a LGPD (Lei nº 13.709/2018)</span>
                </div>
                <p className="text-xs text-emerald-900/80 dark:text-emerald-300/80 leading-relaxed">
                  O Modo de Treinamento garante o cumprimento rigoroso dos princípios da <strong>Anonimização</strong> e <strong>Finalidade</strong> (Art. 5º, II e Art. 13 da LGPD). Durante aulas, lives, gravações ou capacitações de equipe clínica, nenhum dado real de paciente trafega na tela.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white mb-2">
                    🛡️ Mascaramento Dinâmico de Identificadores
                  </h5>
                  <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-disc list-inside">
                    <li>CPFs são exibidos como <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded font-mono">***.***.892-04</code>.</li>
                    <li>Telefones ofuscados como <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded font-mono">(11) 98***-**41</code>.</li>
                    <li>E-mails e endereços substituídos por domínios pedagógicos.</li>
                    <li>Prontuários recebem prefixo de simulação clínica.</li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white mb-2">
                    🔒 Isolamento de Persistência Local
                  </h5>
                  <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-disc list-inside">
                    <li>Alterações feitas no modo de treino não sobrescrevem pacientes reais.</li>
                    <li>Permite testar limites extremos de dobras e cálculos com total liberdade.</li>
                    <li>Emissão de laudos com marca d'água de "Documento de Treinamento / Sem Valor Médico".</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/40">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Info className="w-4 h-4 text-slate-400" />
            <span>Você pode ativar ou desativar o Modo de Treinamento a qualquer momento pelo topo da tela.</span>
          </div>
          <button
            type="button"
            onClick={closeGuideModal}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Fechar Guia
          </button>
        </div>

      </div>
    </div>
  );
};

function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}
