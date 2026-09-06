import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SyntheticPatientProfile, TrainingGuideTopic } from '../types/training';
import { SYNTHETIC_PATIENTS, TRAINING_GUIDE_TOPICS } from '../data/syntheticPatientsData';
import { maskCpf, maskPhone, maskEmail, maskName, maskDocumentId } from '../utils/maskSensitiveData';

interface TrainingModeContextType {
  isTrainingMode: boolean;
  toggleTrainingMode: () => void;
  setTrainingMode: (enabled: boolean) => void;
  syntheticPatients: SyntheticPatientProfile[];
  activePatient: SyntheticPatientProfile;
  setActivePatientId: (id: string) => void;
  
  // Sensitive Data Masking Controls
  maskSensitiveDataEnabled: boolean;
  toggleMaskSensitiveData: () => void;
  
  // Guide and Walkthrough State
  isGuideModalOpen: boolean;
  openGuideModal: (topicId?: string) => void;
  closeGuideModal: () => void;
  selectedGuideTopic: TrainingGuideTopic | null;
  setSelectedGuideTopic: (topic: TrainingGuideTopic | null) => void;
  guideTopics: TrainingGuideTopic[];

  // Quick Action: load synthetic profile into module
  loadPatientIntoStorage: (patientId: string) => void;

  // Masking helpers for convenience in child components
  formatName: (name: string) => string;
  formatCpf: (cpf: string) => string;
  formatPhone: (phone: string) => string;
  formatEmail: (email: string) => string;
  formatDocId: (id: string) => string;
}

const STORAGE_KEY_TRAINING_MODE = 'nutri_saas_training_mode_active';
const STORAGE_KEY_ACTIVE_PATIENT = 'nutri_saas_training_active_patient_id';
const STORAGE_KEY_MASKING = 'nutri_saas_training_mask_sensitive_data';

const TrainingModeContext = createContext<TrainingModeContextType | undefined>(undefined);

export const TrainingModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Check local storage for initial training state
  const [isTrainingMode, setIsTrainingModeState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TRAINING_MODE);
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const [activePatientId, setActivePatientIdState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACTIVE_PATIENT);
      return saved || SYNTHETIC_PATIENTS[0].id;
    } catch {
      return SYNTHETIC_PATIENTS[0].id;
    }
  });

  const [maskSensitiveDataEnabled, setMaskSensitiveDataEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MASKING);
      return saved !== 'false'; // Default to true for maximum LGPD safety
    } catch {
      return true;
    }
  });

  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [selectedGuideTopic, setSelectedGuideTopic] = useState<TrainingGuideTopic | null>(TRAINING_GUIDE_TOPICS[0]);

  // Sync with LocalStorage
  const setTrainingMode = useCallback((enabled: boolean) => {
    setIsTrainingModeState(enabled);
    try {
      localStorage.setItem(STORAGE_KEY_TRAINING_MODE, String(enabled));
      window.dispatchEvent(new CustomEvent('training-mode-changed', { detail: { enabled } }));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const toggleTrainingMode = useCallback(() => {
    setTrainingMode(!isTrainingMode);
  }, [isTrainingMode, setTrainingMode]);

  const setActivePatientId = useCallback((id: string) => {
    setActivePatientIdState(id);
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE_PATIENT, id);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const toggleMaskSensitiveData = useCallback(() => {
    setMaskSensitiveDataEnabled(prev => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY_MASKING, String(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  }, []);

  const openGuideModal = useCallback((topicId?: string) => {
    if (topicId) {
      const topic = TRAINING_GUIDE_TOPICS.find(t => t.id === topicId);
      if (topic) setSelectedGuideTopic(topic);
    }
    setIsGuideModalOpen(true);
  }, []);

  const closeGuideModal = useCallback(() => {
    setIsGuideModalOpen(false);
  }, []);

  const activePatient = SYNTHETIC_PATIENTS.find(p => p.id === activePatientId) || SYNTHETIC_PATIENTS[0];

  // Load selected synthetic patient's anthropometry into local storage for Anthropometry page
  const loadPatientIntoStorage = useCallback((patientId: string) => {
    const patient = SYNTHETIC_PATIENTS.find(p => p.id === patientId);
    if (!patient) return;

    setActivePatientId(patientId);

    try {
      // Anthropometry current state payload
      const anthropometryState = {
        patient: {
          id: patient.id,
          nome: patient.nomeOfuscado,
          sexo: patient.sexo === 'M' ? 'masculino' : 'feminino',
          idade: patient.idade,
          peso: patient.peso,
          altura: patient.altura,
          dataNascimento: `19${90 + (patient.idade % 10)}-01-15`,
          nivelAtividade: 'moderado',
          avaliador: 'Profissional em Treinamento (Demo)',
          dataAvaliacao: new Date().toISOString().split('T')[0],
          observacoes: `[CASO SINTÉTICO DIDÁTICO]: ${patient.metaClinica}. ${patient.focoPedagogico}`,
        },
        skinfolds: patient.dobras,
        perimetry: patient.perimetria,
        protocol: 'jp-7',
        method: 'jackon-pollock',
        densityEquation: 'siri'
      };

      localStorage.setItem('nutri_dobras_current_state_v1', JSON.stringify(anthropometryState));
      window.dispatchEvent(new CustomEvent('synthetic-patient-loaded', { detail: patient }));
    } catch (e) {
      console.error(e);
    }
  }, [setActivePatientId]);

  // Convenience formatters
  const formatName = useCallback((name: string) => {
    return isTrainingMode && maskSensitiveDataEnabled ? maskName(name, true) : name;
  }, [isTrainingMode, maskSensitiveDataEnabled]);

  const formatCpf = useCallback((cpf: string) => {
    return isTrainingMode && maskSensitiveDataEnabled ? maskCpf(cpf, true) : cpf;
  }, [isTrainingMode, maskSensitiveDataEnabled]);

  const formatPhone = useCallback((phone: string) => {
    return isTrainingMode && maskSensitiveDataEnabled ? maskPhone(phone, true) : phone;
  }, [isTrainingMode, maskSensitiveDataEnabled]);

  const formatEmail = useCallback((email: string) => {
    return isTrainingMode && maskSensitiveDataEnabled ? maskEmail(email, true) : email;
  }, [isTrainingMode, maskSensitiveDataEnabled]);

  const formatDocId = useCallback((id: string) => {
    return isTrainingMode && maskSensitiveDataEnabled ? maskDocumentId(id, true) : id;
  }, [isTrainingMode, maskSensitiveDataEnabled]);

  return (
    <TrainingModeContext.Provider
      value={{
        isTrainingMode,
        toggleTrainingMode,
        setTrainingMode,
        syntheticPatients: SYNTHETIC_PATIENTS,
        activePatient,
        setActivePatientId,
        maskSensitiveDataEnabled,
        toggleMaskSensitiveData,
        isGuideModalOpen,
        openGuideModal,
        closeGuideModal,
        selectedGuideTopic,
        setSelectedGuideTopic,
        guideTopics: TRAINING_GUIDE_TOPICS,
        loadPatientIntoStorage,
        formatName,
        formatCpf,
        formatPhone,
        formatEmail,
        formatDocId,
      }}
    >
      {children}
    </TrainingModeContext.Provider>
  );
};

export const useTrainingMode = (): TrainingModeContextType => {
  const context = useContext(TrainingModeContext);
  if (!context) {
    throw new Error('useTrainingMode must be used within a TrainingModeProvider');
  }
  return context;
};
