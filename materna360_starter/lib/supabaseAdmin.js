// Stub mínimo para evitar erro de build nas rotas /api/admin/*.
// Quando for usar de verdade, substituímos por um client Supabase Admin real.

function mockQuery() {
  return {
    select: async () => ({ data: null, error: new Error("Admin desabilitado (stub).") }),
    insert: async () => ({ data: null, error: new Error("Admin desabilitado (stub).") }),
    upsert: async () => ({ data: null, error: new Error("Admin desabilitado (stub).") }),
    update: async () => ({ data: null, error: new Error("Admin desabilitado (stub).") }),
    delete: async () => ({ data: null, error: new Error("Admin desabilitado (stub).") }),
    eq: () => mockQuery(),
    ilike: () => mockQuery(),
    order: () => mockQuery(),
    limit: () => mockQuery(),
  };
}

export function getAdminClient() {
  // Interface básica compatível com supabase-js para não quebrar imports.
  return {
    from: () => mockQuery(),
    auth: { getUser: async () => ({ data: null, error: new Error("Admin desabilitado (stub).") }) },
  };
}

// alguns projetos importam default
const adminClient = getAdminClient();
export default adminClient;
