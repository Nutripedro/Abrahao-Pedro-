import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  GraduationCap,
  Shield,
  Eye,
  EyeOff,
  BookOpen,
  X,
  ChevronDown,
  Sparkles,
  Users,
  Activity,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  FlaskConical
} from 'lucide-react';
import { useTrainingMode } from '../../contexts/TrainingModeContext';

export const TrainingModeBanner: React.FC = () => {
  const {
    isTrainingMode,
    toggleTrainingMode,
    activePatient,
    setActivePatientId,
    syntheticPatients,
    maskSensitiveDataEnabled,
    toggleMaskSensitiveData,
    openGuideModal,
    loadPatientIntoStorage
  } = useTrainingMode();

  const [isPatientDropdownOpen, setIsPatientDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  if (!isTrainingMode) {
    return null;
  }

  const handleSelectPatient = (id: string) => {
    setActivePatientId(id);
    loadPatientIntoStorage(id);
    setIsPatientDropdownOpen(false);
  };

  const handleGoToModule = (route: string) => {
    navigate(route);
  };

  return (
    <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white shadow-md border-b border-amber-900/40 relative z-30 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* 1. Status Indicator & Info */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/30 border border-amber-400/40 shrink-0">
              <FlaskConical className="w-4 h-4 text-amber-100 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider bg-amber-900/60 text-amber-200 px-2 py-0.5 rounded-md font-mono border border-amber-500/30">
                  Modo de Treinamento
                </span>
                <span className="text-[11px] text-amber-200/90 hidden md:inline-flex items-center gap-1 font-medium">
                  <Shield className="w-3 h-3 text-amber-300" />
                  Dados Sintéticos Pedagógicos (LGPD Art. 5º)
                </span>
              </div>
              <p className="text-[11px] text-amber-100 truncate max-w-md hidden sm:block">
                Navegue com segurança sem expor pacientes reais durante demonstrações ou aulas.
              </p>
            </div>
          </div>

          {/* 2. Central Patient Selector & Quick Actions */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* Active Synthetic Patient Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsPatientDropdownOpen(!isPatientDropdownOpen)}
                className="flex items-center gap-2 bg-amber-900/70 hover:bg-amber-900 text-amber-100 hover:text-white px-3 py-1.5 rounded-lg text-xs font-medium border border-amber-500/40 transition-colors shadow-xs"
              >
                <Users className="w-3.5 h-3.5 text-amber-300" />
                <span className="font-semibold max-w-[130px] sm:max-w-[160px] truncate">
                  Caso: {activePatient.nomeOfuscado}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-amber-300" />
              </button>

              {isPatientDropdownOpen && (
                <div className="absolute left-0 sm:right-0 sm:left-auto top-full mt-1.5 w-80 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-700 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1.5 border-b border-slate-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                      Selecione um Caso Clínico de Treinamento:
                    </span>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-800/60">
                    {syntheticPatients.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleSelectPatient(p.id)}
                        className={`w-full text-left px-3 py-2.5 hover:bg-slate-800 transition-colors flex items-start gap-2.5 ${
                          p.id === activePatient.id ? 'bg-slate-800/90 border-l-2 border-amber-400' : ''
                        }`}
                      >
                        <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                          {p.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-semibold text-white truncate">
                              {p.nomeOfuscado}
                            </span>
                            <span className="text-[10px] font-mono text-amber-300 font-bold">
                              {p.idade}a • {p.sexo === 'F' ? 'Fem' : 'Masc'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                            {p.metaClinica}
                          </p>
                          <span className="text-[10px] text-slate-500 block mt-0.5 font-mono">
                            IMC: {p.imc} • %G: {p.percentualGordura}% • TMB: {p.tmbKcal}kcal
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Toggle Masking Details */}
            <button
              type="button"
              onClick={toggleMaskSensitiveData}
              title={maskSensitiveDataEnabled ? "Ofuscação máxima ativada (LGPD)" : "Ofuscação flexível"}
              className="flex items-center gap-1.5 bg-amber-900/60 hover:bg-amber-900/90 text-amber-100 hover:text-white px-2.5 py-1.5 rounded-lg text-xs font-medium border border-amber-500/40 transition-colors"
            >
              {maskSensitiveDataEnabled ? (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-emerald-300" />
                  <span className="hidden lg:inline text-[11px]">LGPD Oculto</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5 text-amber-300" />
                  <span className="hidden lg:inline text-[11px]">Mostrar Sintético</span>
                </>
              )}
            </button>

            {/* Guia Didático Button */}
            <button
              type="button"
              onClick={() => openGuideModal()}
              className="flex items-center gap-1.5 bg-white text-amber-900 hover:bg-amber-50 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-700" />
              <span>Guia do Sistema</span>
            </button>

            {/* Exit Training Mode Button */}
            <button
              type="button"
              onClick={toggleTrainingMode}
              title="Sair do Modo de Treinamento e voltar aos dados normais"
              className="p-1.5 text-amber-200 hover:text-white hover:bg-amber-900/60 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
