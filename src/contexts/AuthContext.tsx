import React, { createContext, useContext, useState, useEffect } from 'react';

import { authService } from '../services/authService';
import { supabase } from '../services/supabase';

export type UserRole = 
  | 'Administrador'
  | 'Gestor'
  | 'Profissional'
  | 'Nutricionista'
  | 'Recepcionista'
  | 'Financeiro'
  | 'Vendedor';

export interface ClinicalProfessional {
  id: string;
  name: string;
  role: UserRole;
  councilType: 'CRN' | 'CRM' | 'CREF' | 'COREN' | 'CRP';
  councilNumber: string;
  councilState: string;
  specialty: string;
  email: string;
  phone: string;
  avatar?: string;
  status: 'ativo' | 'inativo';
  allFeaturesEnabled: boolean;
  prescriberType: 'nutricionista' | 'medico';
  signatureText?: string;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
  status: 'online' | 'offline' | 'busy';
  email: string;
  councilInfo?: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  hasPermission: (allowedRoles?: UserRole[]) => boolean;
  allProfessionalFeaturesActive: boolean;
  setAllProfessionalFeaturesActive: (active: boolean) => void;
  activePrescriberType: 'nutricionista' | 'medico';
  setActivePrescriberType: (type: 'nutricionista' | 'medico') => void;
  professionals: ClinicalProfessional[];
  toggleProfessionalFeatures: (id: string) => void;
  updateProfessional: (prof: ClinicalProfessional) => void;
  addProfessional: (prof: Omit<ClinicalProfessional, 'id'>) => void;
  activateAllTeamFeatures: () => void;
}

const DEFAULT_PROFESSIONALS: ClinicalProfessional[] = [
  {
    id: 'prof-1',
    name: 'Dra. Vanessa Rios',
    role: 'Nutricionista',
    councilType: 'CRN',
    councilNumber: '14285',
    councilState: 'SP',
    specialty: 'Nutrição Clínica Funcional & Esportiva de Alto Rendimento',
    email: 'vanessa.rios@clinica.com',
    phone: '(11) 98765-4321',
    status: 'ativo',
    allFeaturesEnabled: true,
    prescriberType: 'nutricionista',
    signatureText: 'Dra. Vanessa Rios - CRN-3 14285'
  },
  {
    id: 'prof-2',
    name: 'Dr. Carlos Eduardo Mendes',
    role: 'Profissional',
    councilType: 'CRM',
    councilNumber: '198420',
    councilState: 'SP',
    specialty: 'Endocrinologia, Metabologia & Medicina do Esporte',
    email: 'carlos.mendes@clinica.com',
    phone: '(11) 97654-3210',
    status: 'ativo',
    allFeaturesEnabled: true,
    prescriberType: 'medico',
    signatureText: 'Dr. Carlos Eduardo Mendes - CRM-SP 198420 - RQE 82194'
  },
  {
    id: 'prof-3',
    name: 'Dra. Mariana Takahashi',
    role: 'Nutricionista',
    councilType: 'CRN',
    councilNumber: '28410',
    councilState: 'SP',
    specialty: 'Nutrição Comportamental & Saúde da Mulher / SOP',
    email: 'mariana.takahashi@clinica.com',
    phone: '(11) 96543-2109',
    status: 'ativo',
    allFeaturesEnabled: true,
    prescriberType: 'nutricionista',
    signatureText: 'Dra. Mariana Takahashi - CRN-3 28410'
  },
  {
    id: 'prof-4',
    name: 'Prof. Lucas Alencar',
    role: 'Profissional',
    councilType: 'CREF',
    councilNumber: '084192-G',
    councilState: 'SP',
    specialty: 'Fisiologia do Exercício & Cineantropometria ISAK II',
    email: 'lucas.alencar@clinica.com',
    phone: '(11) 95432-1098',
    status: 'ativo',
    allFeaturesEnabled: true,
    prescriberType: 'nutricionista',
    signatureText: 'Prof. Lucas Alencar - CREF-SP 084192-G / ISAK Nível 2'
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Master switch for all professional features
  const [allProfessionalFeaturesActive, setAllProfessionalFeaturesActive] = useState<boolean>(() => {
    const saved = localStorage.getItem('nutri_saas_all_pro_features');
    return saved !== null ? JSON.parse(saved) : true; // DEFAULT: ATIVO
  });

  const [activePrescriberType, setActivePrescriberType] = useState<'nutricionista' | 'medico'>('nutricionista');

  const [professionals, setProfessionals] = useState<ClinicalProfessional[]>(() => {
    const saved = localStorage.getItem('nutri_saas_professionals_list');
    return saved ? JSON.parse(saved) : DEFAULT_PROFESSIONALS;
  });

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    authService.getSession().then(session => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          name: session.user.user_metadata?.name || 'Nutricionista',
          role: session.user.user_metadata?.role || 'Nutricionista',
          email: session.user.email || '',
          avatar: session.user.user_metadata?.avatar_url,
          status: 'online'
        });
      }
      setLoading(false);
    });

    // Listen for changes on auth state (sign in, sign out, etc.)
    const { data: { subscription } } = authService.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          name: session.user.user_metadata?.name || 'Nutricionista',
          role: session.user.user_metadata?.role || 'Nutricionista',
          email: session.user.email || '',
          avatar: session.user.user_metadata?.avatar_url,
          status: 'online'
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('nutri_saas_all_pro_features', JSON.stringify(allProfessionalFeaturesActive));
  }, [allProfessionalFeaturesActive]);

  useEffect(() => {
    localStorage.setItem('nutri_saas_professionals_list', JSON.stringify(professionals));
  }, [professionals]);

  const hasPermission = (allowedRoles?: UserRole[]) => {
    // Quando todas as funções profissionais estão ativadas, concede acesso a todos os módulos
    if (allProfessionalFeaturesActive) return true;
    if (!allowedRoles || allowedRoles.length === 0) return true;
    if (!user) return false;
    if (user.role === 'Administrador') return true;
    return allowedRoles.includes(user.role);
  };

  const toggleProfessionalFeatures = (id: string) => {
    setProfessionals(prev =>
      prev.map(p => p.id === id ? { ...p, allFeaturesEnabled: !p.allFeaturesEnabled } : p)
    );
  };

  const updateProfessional = (prof: ClinicalProfessional) => {
    setProfessionals(prev =>
      prev.map(p => p.id === prof.id ? prof : p)
    );
  };

  const addProfessional = (profData: Omit<ClinicalProfessional, 'id'>) => {
    const newProf: ClinicalProfessional = {
      ...profData,
      id: `prof-${Date.now()}`
    };
    setProfessionals(prev => [...prev, newProf]);
  };

  const activateAllTeamFeatures = () => {
    setAllProfessionalFeaturesActive(true);
    setProfessionals(prev =>
      prev.map(p => ({ ...p, allFeaturesEnabled: true }))
    );
  };

  const logout = async () => {
    await authService.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        logout,
        hasPermission,
        allProfessionalFeaturesActive,
        setAllProfessionalFeaturesActive,
        activePrescriberType,
        setActivePrescriberType,
        professionals,
        toggleProfessionalFeatures,
        updateProfessional,
        addProfessional,
        activateAllTeamFeatures
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
