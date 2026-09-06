import { supabase, isSupabaseConfigured } from './supabase';
import { Database } from '../types/supabase';

const checkConfig = () => {
  if (!isSupabaseConfigured) {
    throw new Error('Configuração do Supabase pendente. Por favor, adicione as chaves VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY nas configurações do projeto.');
  }
};

export type Professional = Database['public']['Tables']['professionals']['Row'];
export type NewProfessional = Database['public']['Tables']['professionals']['Insert'];
export type UpdateProfessional = Database['public']['Tables']['professionals']['Update'];

export const professionalService = {
  async getById(id: string) {
    checkConfig();
    const { data, error } = await supabase
      .from('professionals')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      if (error.code === 'PGRST205') {
        console.warn('Table "professionals" not found. Please run the SQL schema script.');
        return null; 
      }
      throw error;
    }
    return data as Professional;
  },

  async upsert(professional: NewProfessional) {
    checkConfig();
    const { data, error } = await supabase
      .from('professionals')
      .upsert(professional as any)
      .select()
      .single();
    
    if (error) {
      if (error.code === 'PGRST205') {
        console.warn('Cannot upsert: Table "professionals" not found.');
        return professional as unknown as Professional;
      }
      throw error;
    }
    return data as Professional;
  },

  async getAll() {
    checkConfig();
    const { data, error } = await supabase
      .from('professionals')
      .select('*')
      .order('name');
    
    if (error) {
      if (error.code === 'PGRST205') {
        console.warn('Table "professionals" not found.');
        return [];
      }
      throw error;
    }
    return (data || []) as Professional[];
  }
};
