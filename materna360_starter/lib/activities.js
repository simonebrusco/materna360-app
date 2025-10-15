import { supabase } from "@/lib/supabaseClient";

const DEFAULT_COLUMNS =
  "id, title, emoji, short_desc, tags, duration_min, zero_material, indoor, age_min, age_max";

function getClient(customClient) {
  return customClient ?? supabase;
}

export async function getSuggestedActivity({ supabase: customClient } = {}) {
  const client = getClient(customClient);

  const prioritized = await client
    .from("activities")
    .select(DEFAULT_COLUMNS)
    .eq("zero_material", true)
    .lte("duration_min", 10)
    .order("random")
    .limit(1)
    .maybeSingle();

  if (!prioritized.error && prioritized.data) {
    return { data: prioritized.data, error: null };
  }

  const fallback = await client
    .from("activities")
    .select(DEFAULT_COLUMNS)
    .order("random")
    .limit(1)
    .maybeSingle();

  if (fallback.error) {
    return { data: null, error: fallback.error };
  }

  return { data: fallback.data, error: null };
}

export async function listActivities({
  zeroMaterial = false,
  quick = false,
  indoor = false,
  supabase: customClient,
} = {}) {
  const client = getClient(customClient);

  let query = client.from("activities").select(DEFAULT_COLUMNS).order("title", { ascending: true });

  if (zeroMaterial) {
    query = query.eq("zero_material", true);
  }

  if (quick) {
    query = query.lte("duration_min", 10);
  }

  if (indoor) {
    query = query.eq("indoor", true);
  }

  const { data, error } = await query;
  return { data: data ?? [], error };
}
