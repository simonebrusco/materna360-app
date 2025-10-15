const STORAGE_PREFIX = "m360_progress::";

function getStorageKey(slug) {
  return `${STORAGE_PREFIX}${slug}`;
}

function isSchemaError(error) {
  if (!error) return false;
  const message = `${error.message ?? ""} ${error.details ?? ""}`.toLowerCase();
  return (
    message.includes("relation") && message.includes("does not exist") ||
    message.includes("column") && message.includes("does not exist")
  );
}

function readLocalProgress(slug) {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(getStorageKey(slug));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const sanitized = parsed.filter((value) => Number.isInteger(value));
    sanitized.sort((a, b) => a - b);
    return sanitized;
  } catch (error) {
    console.warn("Unable to parse local progress", error);
    return [];
  }
}

function writeLocalProgress(slug, days) {
  if (typeof window === "undefined") return days;
  const unique = Array.from(new Set(days)).filter((value) => Number.isInteger(value));
  unique.sort((a, b) => a - b);
  window.localStorage.setItem(getStorageKey(slug), JSON.stringify(unique));
  return unique;
}

function fallbackProgress(slug) {
  return { offline: true, days: readLocalProgress(slug) };
}

function fallbackWithDay(slug, day) {
  const updated = writeLocalProgress(slug, [...readLocalProgress(slug), day]);
  return { offline: true, days: updated };
}

export async function fetchProgress({ supabase, clientId, slug }) {
  if (!supabase || !clientId) {
    return fallbackProgress(slug);
  }

  try {
    const { data, error } = await supabase
      .from("program_progress")
      .select("day")
      .eq("program_slug", slug)
      .eq("client_id", clientId)
      .order("day", { ascending: true });

    if (error) {
      if (isSchemaError(error)) {
        return fallbackProgress(slug);
      }
      console.error("fetchProgress error", error);
      return fallbackProgress(slug);
    }

    const days = Array.isArray(data)
      ? data
          .map((row) => row?.day)
          .filter((value) => Number.isInteger(value))
      : [];

    return { offline: false, days };
  } catch (error) {
    if (isSchemaError(error)) {
      return fallbackProgress(slug);
    }
    console.error("fetchProgress exception", error);
    return fallbackProgress(slug);
  }
}

export async function markDayComplete({ supabase, clientId, slug, day, offline }) {
  if (offline || !supabase || !clientId) {
    return fallbackWithDay(slug, day);
  }

  try {
    const { data: existing, error: selectError } = await supabase
      .from("program_progress")
      .select("day")
      .eq("program_slug", slug)
      .eq("client_id", clientId)
      .eq("day", day)
      .maybeSingle();

    if (selectError) {
      if (isSchemaError(selectError)) {
        return fallbackWithDay(slug, day);
      }
      console.error("markDayComplete select error", selectError);
      return fallbackWithDay(slug, day);
    }

    if (!existing) {
      const { error: insertError } = await supabase.from("program_progress").insert({
        client_id: clientId,
        program_slug: slug,
        day,
        completed_at: new Date().toISOString()
      });

      if (insertError) {
        if (isSchemaError(insertError)) {
          return fallbackWithDay(slug, day);
        }
        console.error("markDayComplete insert error", insertError);
        return fallbackWithDay(slug, day);
      }
    }

    return fetchProgress({ supabase, clientId, slug });
  } catch (error) {
    if (isSchemaError(error)) {
      return fallbackWithDay(slug, day);
    }
    console.error("markDayComplete exception", error);
    return fallbackWithDay(slug, day);
  }
}
