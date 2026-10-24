import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
	process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://zqcolmspkrucybtavibr.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = supabaseAnonKey
	? createClient(supabaseUrl, supabaseAnonKey, {
		auth: {
			persistSession: false,
			autoRefreshToken: false,
			detectSessionInUrl: false,
		},
	})
	: null;

export function getSupabaseClient() {
	if (!supabase) {
		throw new Error(
			'Configure EXPO_PUBLIC_SUPABASE_ANON_KEY com a chave pública do Supabase para habilitar o login.',
		);
	}

	return supabase;
}
