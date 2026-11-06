import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = () => {
  if (supabaseInstance) return supabaseInstance;

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    'https://knaboygqfitmlhgogeqe.supabase.co';

  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtuYWJveWdxZml0bWxoZ29nZXFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM5NzE0NjQsImV4cCI6MjEwOTU0NzQ2NH0.5NCY6bRX8DdqVk_Eu6WwwkLP4hA70iygIeHTAaXhE2M';

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseInstance;
};