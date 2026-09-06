import { supabase } from './supabase';
import { Database } from '../types/supabase';

export type Prescription = Database['public']['Tables']['prescriptions']['Row'];
export type NewPrescription = Database['public']['Tables']['prescriptions']['Insert'];

export const prescriptionService = {
  async getAllByPatient(patientId: string) {
    const { data, error } = await supabase
      .from('prescriptions')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return (data || []) as Prescription[];
  },

  async create(prescription: NewPrescription) {
    const { data, error } = await supabase
      .from('prescriptions')
      .insert(prescription as any)
      .select()
      .single();
    
    if (error) throw error;
    if (!data) throw new Error('Failed to create prescription');
    return data as Prescription;
  },

  async updateStatus(id: string, status: string) {
    const { error } = await (supabase.from('prescriptions') as any)
      .update({ status })
      .eq('id', id);
    
    if (error) throw error;
  }
};
