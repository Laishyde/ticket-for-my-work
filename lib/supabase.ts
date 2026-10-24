import { createClient } from '@supabase/supabase-js';

// IMPORTANTE: Você precisa substituir essas chaves pelas suas chaves do Supabase
// 1. Crie uma conta em https://supabase.com
// 2. Crie um novo projeto
// 3. Vá em Settings > API
// 4. Copie as chaves abaixo

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
