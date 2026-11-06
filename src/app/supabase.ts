import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://knaboygqfitmlhgogeqe.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtuYWJveWdxZml0bWxoZ29nZXFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM5NzE0NjQsImV4cCI6MjEwOTU0NzQ2NH0.5NCY6bRX8DdqVk_Eu6WwwkLP4hA70iygIeHTAaXhE2M';

let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = () => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return supabaseInstance;
};