import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

const rawUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
let sanitizedUrl = 'https://your-project.supabase.co';

if (rawUrl && rawUrl.startsWith('http')) {
  try {
    // This will strip trailing slashes and normalize the URL
    const urlObj = new URL(rawUrl);
    sanitizedUrl = urlObj.origin;
  } catch (e) {
    console.error('Invalid VITE_SUPABASE_URL:', rawUrl);
  }
}

const supabaseUrl = sanitizedUrl;
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '').trim() || 'your-anon-key';

export const isSupabaseConfigured = Boolean(
  rawUrl && 
  rawUrl !== 'https://your-project.supabase.co' &&
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY &&
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY !== 'your-anon-key'
);

if (!isSupabaseConfigured) {
  console.warn('Supabase credentials missing or using placeholders. The app will not function correctly until VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY are configured in the environment.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
