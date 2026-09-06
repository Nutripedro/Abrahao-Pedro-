import { supabase, isSupabaseConfigured } from './supabase';
import { Database } from '../types/supabase';

const checkConfig = () => {
  if (!isSupabaseConfigured) {
    throw new Error('Configuração do Supabase pendente. Por favor, adicione as chaves VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY nas configurações do projeto.');
  }
};

export type ExamRequisition = Database['public']['Tables']['exam_requisitions']['Row'];
export type NewExamRequisition = Database['public']['Tables']['exam_requisitions']['Insert'];

export const examService = {
  async getAllByPatient(patientId: string, professionalId?: string) {
    checkConfig();
    let query = supabase
      .from('exam_requisitions')
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
    return (data || []) as ExamRequisition[];
  },

  async create(requisition: NewExamRequisition) {
    const { data, error } = await supabase
      .from('exam_requisitions')
      .insert(requisition as any)
      .select()
      .single();
    
    if (error) {
      if (error.code === 'PGRST205') {
        console.warn('Table "exam_requisitions" not found.');
        return requisition as unknown as ExamRequisition;
      }
      throw error;
    }
    if (!data) throw new Error('Failed to create exam requisition');
    return data as ExamRequisition;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('exam_requisitions')
      .delete()
      .eq('id', id);
    
    if (error) {
      if (error.code === 'PGRST205') return;
      throw error;
    }
  }
};
