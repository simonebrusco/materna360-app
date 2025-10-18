// lib/supabaseAdmin.js
// Stub mínimo para as rotas /api/admin/* compilarem sem credenciais.
// Quando for usar de verdade, trocamos por createClient com a service role.

function mockQuery() {
  const api = {
    select: async () => ({ data: null, error: new Error("Admin desabilitado (stub).") }),
    insert: async () => ({ data: null, error: new Error("Admin desabilitado (stub).") }),
    upsert: async () => ({ data: null, error: new Error("Admin desabilitado (stub).") }),
    update: async () => ({ data: null, error: new Error("Admin desabilitado (stub).") }),
    delete: async () => ({ data: null, error: new Error("Admin desabilitado (stub).") }),
    eq: () => api,
    ilike: () => api,
    order: () => api,
    limit: () => api,
  };
  return api;
}

function buildClient() {
  return {
    from: () => mockQuery(),
    rpc: () => mockQuery(),
    storage: { from: () => mockQuery() },
    auth: {
      getUser: async () => ({ data: null, error: new Error("Admin desabilitado (stub).") }),
      getSession: async () => ({ data: null, error: new Error("Admin desabilitado (stub).") }),
    },
  };
}

export function getAdminClient() { return buildClient(); }
export const supabaseAdmin = buildClient();
export const supabase = supabaseAdmin; // compat extra
export default supabaseAdmin;
