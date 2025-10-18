// lib/supaClient.js
// Cliente Supabase com fallback seguro.
// - getSupabase(): retorna o client ou null (compat com uso existente).
// - supabase (named + default): client pronto quando há ENV; caso contrário, stub que lança erro claro ao usar.
//
// Requer (em produção):
//   - NEXT_PUBLIC_SUPABASE_URL
//   - NEXT_PUBLIC_SUPABASE_ANON_KEY

import { createClient } from "@supabase/supabase-js";

let _client = null;
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** Cria um stub que só lança erro SE for utilizado em runtime */
function createSupabaseStub() {
  const explain =
    "Supabase não configurado. Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY " +
    "ou use fallback local. (Origem: lib/supaClient.js)";
  // Proxy que lança para qualquer acesso (método ou propriedade)
  return new Proxy(
    {},
    {
      get() {
        throw new Error(explain);
      },
      apply() {
        throw new Error(explain);
      },
    }
  );
}

/**
 * Retorna o client do Supabase (ou null se não configurado).
 * Compatível com o comportamento anterior do projeto.
 */
export function getSupabase() {
  if (_client) return _client;
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

// Inicializa o client para export direto (quando houver ENV)
if (!_client && url && key) {
  try {
    _client = createClient(url, key, {
      auth: { persistSession: false },
    });
  } catch {
    _client = null;
  }
}

/**
 * Export direto (named + default)
 * - Se houver ENV: client real
 * - Se não houver: stub seguro (não quebra build)
 */
export const supabase = _client ?? createSupabaseStub();
export default supabase;
