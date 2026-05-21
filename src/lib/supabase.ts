import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabaseUrl = (rawUrl && rawUrl.trim()) ? rawUrl.trim() : 'https://placeholder.supabase.co';
const supabaseAnonKey = (rawKey && rawKey.trim()) ? rawKey.trim() : 'placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isDemoMode = supabaseUrl.includes('placeholder');

if (isDemoMode) {
  console.warn('⚠️ Running in Demo Mode: Supabase is not connected. Changes will be saved locally and won\'t sync across devices.');
}

