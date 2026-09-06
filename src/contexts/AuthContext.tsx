import React, { createContext, useContext, useState, useEffect } from 'react';

import { authService } from '../services/authService';
import { supabase } from '../services/supabase';
import { professionalService, Professional } from '../services/professionalService';

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
  phone?: string;
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
  profile: Professional | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setProfile: (profile: Professional | null) => void;
  logout: () => void;
  hasPermission: (allowedRoles?: UserRole[]) => boolean;
  allProfessionalFeaturesActive: boolean;
  setAllProfessionalFeaturesActive: (active: boolean) => void;
  activePrescriberType: 'nutricionista' | 'medico';
  setActivePrescriberType: (type: 'nutricionista' | 'medico') => void;
  schemaError: boolean;
  professionals: ClinicalProfessional[];
  toggleProfessionalFeatures: (id: string) => void;
  updateProfessional: (prof: ClinicalProfessional) => void;
  addProfessional: (prof: Omit<ClinicalProfessional, 'id'>) => void;
  activateAllTeamFeatures: () => void;
  signInWithPassword: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
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

  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Professional | null>(null);
  const [loading, setLoading] = useState(true);
  const [schemaError, setSchemaError] = useState(false);
  const [professionals, setProfessionals] = useState<ClinicalProfessional[]>([]);

  const loadProfessionals = async () => {
    try {
      const data = await professionalService.getAll();
      const clinicalProfs: ClinicalProfessional[] = data.map(p => ({
        id: p.id,
        name: p.name,
        role: p.role as UserRole,
        councilType: p.council_type as any,
        councilNumber: p.council_number,
        councilState: p.council_state,
        specialty: p.specialty,
        email: p.email,
        status: p.status as any,
        allFeaturesEnabled: true,
        prescriberType: p.prescriber_type as any,
        signatureText: `${p.name} - ${p.council_type}-${p.council_state} ${p.council_number}`
      }));
      setProfessionals(clinicalProfs);
    } catch (err) {
      console.error('Error loading professionals:', err);
    }
  };

  useEffect(() => {
    const loadUserAndProfile = async (sessionUser: any) => {
      if (!sessionUser) {
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        // Fetch or create clinical profile
        let profileData = await professionalService.getById(sessionUser.id);
        
        if (!profileData) {
          // Create default profile if it doesn't exist
          profileData = await professionalService.upsert({
            id: sessionUser.id,
            name: sessionUser.user_metadata?.name || 'Nutricionista',
            email: sessionUser.email || '',
            role: sessionUser.user_metadata?.role || 'Nutricionista',
            council_type: 'CRN',
            council_number: 'PENDENTE',
            council_state: 'SP',
            specialty: 'Nutrição Geral',
            status: 'ativo',
            prescriber_type: 'nutricionista'
          });
        }

        setProfile(profileData);

        setUser({
          id: sessionUser.id,
          name: profileData.name,
          role: profileData.role as UserRole,
          email: profileData.email,
          avatar: profileData.avatar_url || sessionUser.user_metadata?.avatar_url,
          status: 'online',
          councilInfo: `${profileData.council_type}-${profileData.council_state} ${profileData.council_number}`
        });

        if (profileData.prescriber_type === 'medico' || profileData.prescriber_type === 'nutricionista') {
          setActivePrescriberType(profileData.prescriber_type);
        }

        // Also load the team
        await loadProfessionals();

      } catch (err: any) {
        if (err.code === 'PGRST205') {
          console.warn('Database schema not initialized (PGRST205). Instructions shown on UI.');
          setSchemaError(true);
        } else {
          console.error('Error loading professional profile:', err);
        }
        // Fallback to basic metadata if DB fails
        setUser({
          id: sessionUser.id,
          name: sessionUser.user_metadata?.name || 'Nutricionista',
          role: sessionUser.user_metadata?.role || 'Nutricionista',
          email: sessionUser.email || '',
          avatar: sessionUser.user_metadata?.avatar_url,
          status: 'online'
        });
      } finally {
        setLoading(false);
      }
    };

    // Check active sessions
    authService.getSession().then(session => {
      loadUserAndProfile(session?.user);
    });

    // Listen for changes
    const { data: { subscription } } = authService.onAuthStateChange((_event, session) => {
      loadUserAndProfile(session?.user);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('nutri_saas_all_pro_features', JSON.stringify(allProfessionalFeaturesActive));
  }, [allProfessionalFeaturesActive]);

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

  const signInWithPassword = async (email: string, password: string) => {
    await authService.signIn(email, password);
  };

  const signUp = async (email: string, password: string, name: string) => {
    await authService.signUp(email, password, name);
  };

  const logout = async () => {
    await authService.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        setUser,
        setProfile,
        logout,
        hasPermission,
        allProfessionalFeaturesActive,
        setAllProfessionalFeaturesActive,
        activePrescriberType,
        setActivePrescriberType,
        schemaError,
        professionals,
        toggleProfessionalFeatures,
        updateProfessional,
        addProfessional,
        activateAllTeamFeatures,
        signInWithPassword,
        signUp
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
