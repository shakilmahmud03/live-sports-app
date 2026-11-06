import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://knaboygqfitmlhgogeqe.supabase.co';

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'আপনার_পুরো_anon_key_টোকেন';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);