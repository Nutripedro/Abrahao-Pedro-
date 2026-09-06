import { supabase } from './supabase';
import { Database } from '../types/supabase';

export type MealPlan = Database['public']['Tables']['meal_plans']['Row'];
export type NewMealPlan = Database['public']['Tables']['meal_plans']['Insert'];

export const dietService = {
  async getAllByPatient(patientId: string) {
    const { data, error } = await supabase
      .from('meal_plans')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return (data || []) as MealPlan[];
  },

  async create(plan: NewMealPlan) {
    const { data, error } = await supabase
      .from('meal_plans')
      .insert(plan as any)
      .select()
      .single();
    
    if (error) throw error;
    if (!data) throw new Error('Failed to create meal plan');
    return data as MealPlan;
  },

  async toggleActive(id: string, isActive: boolean) {
    const { error } = await (supabase.from('meal_plans') as any)
      .update({ is_active: isActive })
      .eq('id', id);
    
    if (error) throw error;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('meal_plans')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
