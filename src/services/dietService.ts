import { supabase, isSupabaseConfigured } from './supabase';
import { Database } from '../types/supabase';

const checkConfig = () => {
  if (!isSupabaseConfigured) {
    throw new Error('Configuração do Supabase pendente. Por favor, adicione as chaves VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY nas configurações do projeto.');
  }
};

export type MealPlan = Database['public']['Tables']['meal_plans']['Row'];
export type NewMealPlan = Database['public']['Tables']['meal_plans']['Insert'];

export const dietService = {
  async getAllByPatient(patientId: string, professionalId?: string) {
    checkConfig();
    let query = supabase
      .from('meal_plans')
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
    return (data || []) as MealPlan[];
  },

  async create(plan: NewMealPlan) {
    const { data, error } = await supabase
      .from('meal_plans')
      .insert(plan as any)
      .select()
      .single();
    
    if (error) {
      if (error.code === 'PGRST205') {
        console.warn('Table "meal_plans" not found.');
        return plan as unknown as MealPlan;
      }
      throw error;
    }
    if (!data) throw new Error('Failed to create meal plan');
    return data as MealPlan;
  },

  async toggleActive(id: string, isActive: boolean) {
    const { error } = await (supabase.from('meal_plans') as any)
      .update({ is_active: isActive })
      .eq('id', id);
    
    if (error) {
      if (error.code === 'PGRST205') return;
      throw error;
    }
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('meal_plans')
      .delete()
      .eq('id', id);
    
    if (error) {
      if (error.code === 'PGRST205') return;
      throw error;
    }
  }
};
