import { supabase } from './supabase';
import { Database } from '../types/supabase';

export type ExamRequisition = Database['public']['Tables']['exam_requisitions']['Row'];
export type NewExamRequisition = Database['public']['Tables']['exam_requisitions']['Insert'];

export const examService = {
  async getAllByPatient(patientId: string) {
    const { data, error } = await supabase
      .from('exam_requisitions')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return (data || []) as ExamRequisition[];
  },

  async create(requisition: NewExamRequisition) {
    const { data, error } = await supabase
      .from('exam_requisitions')
      .insert(requisition as any)
      .select()
      .single();
    
    if (error) throw error;
    if (!data) throw new Error('Failed to create exam requisition');
    return data as ExamRequisition;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('exam_requisitions')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
