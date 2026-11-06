import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://knaboygqfitmlhgogeqe.supabase.co';

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOi...আপনার_legacy_anon_key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);