import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'your-anon-key';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY) {
  console.warn('Supabase credentials missing. The app will not function correctly until VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY are configured in the environment.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
