// Stub mínimo para evitar erro de build nas rotas /api/admin/*.
// Quando for usar de verdade, trocamos por um client Supabase Admin real com service role.

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
  return {
    from: () => mockQuery(),
    auth: {
      getUser: async () => ({ data: null, error: new Error("Admin desabilitado (stub).") })
    },
  };
}

// Exportações compatíveis com ambos os estilos de import
export const supabaseAdmin = getAdminClient();
export default supabaseAdmin;
