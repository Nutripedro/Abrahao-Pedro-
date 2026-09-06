import { supabase } from './supabase';
import { Database } from '../types/supabase';

export type Patient = Database['public']['Tables']['patients']['Row'];
export type NewPatient = Database['public']['Tables']['patients']['Insert'];
export type UpdatePatient = Database['public']['Tables']['patients']['Update'];

export const patientService = {
  async getAll() {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return (data || []) as Patient[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(patient: NewPatient) {
    const { data, error } = await supabase
      .from('patients')
      .insert(patient as any)
      .select()
      .single();
    
    if (error) throw error;
    if (!data) throw new Error('Failed to create patient');
    return data as Patient;
  },

  async update(id: string, updates: UpdatePatient) {
    const { data, error } = await (supabase.from('patients') as any)
      .update(updates as any)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    if (!data) throw new Error('Failed to update patient');
    return data as Patient;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('patients')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
