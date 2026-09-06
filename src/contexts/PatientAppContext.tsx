import React, { createContext, useContext, useState, useEffect } from 'react';

export interface PatientAppFeature {
  id: string;
  name: string;
  shortDesc: string;
  category: 'nutricao' | 'clinico' | 'comunicacao' | 'sistema';
  icon: string;
  active: boolean;
  lgpdSensitive: boolean;
  clinicalImpact: string;
}

export interface PatientAppFeaturesState {
  foodDiary: boolean;          // 1. Diário Alimentar Fotográfico & Fome/Saciedade
  waterTracker: boolean;       // 2. Rastreador Inteligente de Água (35-45ml/kg)
  supplementRoutine: boolean;  // 3. Receituário Digital de Suplementos & Lembretes
  examPanel: boolean;          // 4. Requisições de Exames & Preparo Laboratorial
  evolutionCharts: boolean;    // 5. Evolução Corporal, Dobras ISAK & Bioimpedância
  mealPlanSubstitutions: boolean; // 6. Cardápio Completo com Lista de Substituições
  directChat: boolean;         // 7. Chat Clínico Criptografado com Nutricionista
  pushReminders: boolean;      // 8. Notificações Push & Alertas de Adesão
  smartGroceryList: boolean;   // 9. Lista de Compras Inteligente do Cardápio
  pwaOfflineMode: boolean;     // 10. Modo Offline PWA & Criptografia Local
}

export const DEFAULT_PATIENT_FEATURES: PatientAppFeaturesState = {
  foodDiary: true,
  waterTracker: true,
  supplementRoutine: true,
  examPanel: true,
  evolutionCharts: true,
  mealPlanSubstitutions: true,
  directChat: true,
  pushReminders: true,
  smartGroceryList: true,
  pwaOfflineMode: true,
};

interface PatientAppContextType {
  features: PatientAppFeaturesState;
  allFeaturesActive: boolean;
  activeFeaturesCount: number;
  totalFeaturesCount: number;
  toggleFeature: (key: keyof PatientAppFeaturesState) => void;
  activateAllFeatures: () => void;
  deactivateAllFeatures: () => void;
  setFeature: (key: keyof PatientAppFeaturesState, value: boolean) => void;
  patientToken: string;
  patientName: string;
  syncTimestamp: string;
}

const PatientAppContext = createContext<PatientAppContextType | undefined>(undefined);

const STORAGE_KEY = 'nutri_saas_patient_app_features';

export const PatientAppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [features, setFeatures] = useState<PatientAppFeaturesState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure all 10 keys exist and default to true
        return { ...DEFAULT_PATIENT_FEATURES, ...parsed };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_PATIENT_FEATURES;
  });

  const [syncTimestamp, setSyncTimestamp] = useState<string>(() => 
    new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  );

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(features));
    } catch {
      // ignore
    }
  }, [features]);

  const toggleFeature = (key: keyof PatientAppFeaturesState) => {
    setFeatures(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      setSyncTimestamp(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
      return updated;
    });
  };

  const setFeature = (key: keyof PatientAppFeaturesState, value: boolean) => {
    setFeatures(prev => {
      const updated = { ...prev, [key]: value };
      setSyncTimestamp(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
      return updated;
    });
  };

  const activateAllFeatures = () => {
    setFeatures({
      foodDiary: true,
      waterTracker: true,
      supplementRoutine: true,
      examPanel: true,
      evolutionCharts: true,
      mealPlanSubstitutions: true,
      directChat: true,
      pushReminders: true,
      smartGroceryList: true,
      pwaOfflineMode: true,
    });
    setSyncTimestamp(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
  };

  const deactivateAllFeatures = () => {
    setFeatures({
      foodDiary: false,
      waterTracker: false,
      supplementRoutine: false,
      examPanel: false,
      evolutionCharts: false,
      mealPlanSubstitutions: false,
      directChat: false,
      pushReminders: false,
      smartGroceryList: false,
      pwaOfflineMode: false,
    });
    setSyncTimestamp(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
  };

  const activeFeaturesCount = Object.values(features).filter(Boolean).length;
  const totalFeaturesCount = Object.keys(features).length;
  const allFeaturesActive = activeFeaturesCount === totalFeaturesCount;

  return (
    <PatientAppContext.Provider
      value={{
        features,
        allFeaturesActive,
        activeFeaturesCount,
        totalFeaturesCount,
        toggleFeature,
        activateAllFeatures,
        deactivateAllFeatures,
        setFeature,
        patientToken: 'cli-pat-mariana-8419',
        patientName: 'Mariana Lima Santos',
        syncTimestamp,
      }}
    >
      {children}
    </PatientAppContext.Provider>
  );
};

export const usePatientApp = () => {
  const context = useContext(PatientAppContext);
  if (!context) {
    throw new Error('usePatientApp must be used within a PatientAppProvider');
  }
  return context;
};
