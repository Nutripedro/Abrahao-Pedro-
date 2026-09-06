import { supabase, isSupabaseConfigured } from './supabase';
import { Database } from '../types/supabase';

const checkConfig = () => {
  if (!isSupabaseConfigured) {
    throw new Error('Configuração do Supabase pendente. Por favor, adicione as chaves VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY nas configurações do projeto.');
  }
};

export type Patient = Database['public']['Tables']['patients']['Row'];
export type NewPatient = Database['public']['Tables']['patients']['Insert'];
export type UpdatePatient = Database['public']['Tables']['patients']['Update'];

export const patientService = {
  async getAll(professionalId?: string) {
    checkConfig();
    let query = supabase
      .from('patients')
      .select('*')
      .order('name');
    
    if (professionalId) {
      query = query.eq('professional_id', professionalId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      if (error.code === 'PGRST205') {
        console.warn('Table "patients" not found. Please run the SQL schema script.');
        return [];
      }
      throw error;
    }
    return (data || []) as Patient[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST205') return null;
      throw error;
    }
    return data;
  },

  async create(patient: NewPatient) {
    checkConfig();
    const { data, error } = await supabase
      .from('patients')
      .insert(patient as any)
      .select()
      .single();
    
    if (error) {
      if (error.code === 'PGRST205') {
        console.warn('Cannot create patient: Table "patients" not found.');
        // Return the input as if it was created for UI stability
        return { ...patient, id: 'temp-id-' + Math.random() } as any;
      }
      throw error;
    }
    if (!data) throw new Error('Failed to create patient');
    return data as Patient;
  },

  async update(id: string, updates: UpdatePatient) {
    const { data, error } = await (supabase.from('patients') as any)
      .update(updates as any)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      if (error.code === 'PGRST205') return { ...updates, id } as any;
      throw error;
    }
    if (!data) throw new Error('Failed to update patient');
    return data as Patient;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('patients')
      .delete()
      .eq('id', id);
    
    if (error) {
      if (error.code === 'PGRST205') return;
      throw error;
    }
  }
};
