// lib/supaClient.js
// Cliente Supabase com fallback: retorna null se variáveis não existirem.
import { createClient } from "@supabase/supabase-js";

let _client = null;

/**
 * Retorna o client do Supabase (ou null se não configurado).
 * Requer:
 *  - NEXT_PUBLIC_SUPABASE_URL
 *  - NEXT_PUBLIC_SUPABASE_ANON_KEY
 */
export function getSupabase() {
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  try {
    _client = createClient(url, key, {
      auth: { persistSession: false }, // sem sessão persistente por enquanto
    });
    return _client;
  } catch {
    return null;
  }
}
