import { supabase, isSupabaseConfigured } from './supabase';
import { Database } from '../types/supabase';

const checkConfig = () => {
  if (!isSupabaseConfigured) {
    throw new Error('Configuração do Supabase pendente. Por favor, adicione as chaves VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY nas configurações do projeto.');
  }
};

export type Prescription = Database['public']['Tables']['prescriptions']['Row'];
export type NewPrescription = Database['public']['Tables']['prescriptions']['Insert'];

export const prescriptionService = {
  async getAllByPatient(patientId: string, professionalId?: string) {
    checkConfig();
    let query = supabase
      .from('prescriptions')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });
    
    if (professionalId) {
      query = query.eq('professional_id', professionalId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      if (error.code === 'PGRST205') return [];
      throw error;
    }
    return (data || []) as Prescription[];
  },

  async create(prescription: NewPrescription) {
    const { data, error } = await supabase
      .from('prescriptions')
      .insert(prescription as any)
      .select()
      .single();
    
    if (error) {
      if (error.code === 'PGRST205') {
        console.warn('Table "prescriptions" not found.');
        return prescription as unknown as Prescription;
      }
      throw error;
    }
    if (!data) throw new Error('Failed to create prescription');
    return data as Prescription;
  },

  async updateStatus(id: string, status: string) {
    const { error } = await (supabase.from('prescriptions') as any)
      .update({ status })
      .eq('id', id);
    
    if (error) {
      if (error.code === 'PGRST205') return;
      throw error;
    }
  }
};
