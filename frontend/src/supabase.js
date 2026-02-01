import { createClient } from '@supabase/supabase-js';

// Usamos las variables con el prefijo VITE_ que ya corregimos
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Verificación de seguridad para que no vuelva a salir el error de "required"
if (!supabaseUrl || !supabaseAnonKey) {
    console.error("⚠️ Error: Faltan las variables de Supabase en el .env.local");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);