// lib/awards.js
// Registro leve de conquistas locais baseado no evento global "m360:win".
// Formato salvo: { items: [{ id, ts, label, emoji, source? }], lastTs }
// Mantém compat e adiciona: initAwardsListener(), getLastFive(), sync best-effort com Supabase.

const K = "m360:awards_log";

// Mapa canônico de rótulos/emoji por ID ou por source
const LABELS = {
  respirar: { label: "Respiração concluída", emoji: "🌬️" },
  momento:  { label: "Momento com o filho",  emoji: "💛" },
  gratidao: { label: "Gratidão registrada",  emoji: "🌼" },
  mentoria: { label: "Mentoria realizada",    emoji: "🎯" },
  meditar:  { label: "Meditação concluída",   emoji: "🧘‍♀️" },
  checklist:{ label: "Checklist do dia",      emoji: "✅" },
  // fallback genérico
  _default: { label: "Conquista desbloqueada", emoji: "🏅" },
};

export function readAwards() {
  try {
    const raw = localStorage.getItem(K);
    return raw ? JSON.parse(raw) : { items: [], lastTs: 0 };
  } catch {
    return { items: [], lastTs: 0 };
  }
}

export function writeAwards(state) {
  try {
    localStorage.setItem(K, JSON.stringify(state));
    safeDispatch("m360:awards:changed");
  } catch {}
}

/**
 * Retorna os 5 mais recentes (para o componente BadgesLastFive).
 */
export function getLastFive() {
  const s = readAwards();
  return Array.isArray(s.items) ? s.items.slice(0, 5) : [];
}

/**
 * Normaliza metadados (label/emoji) a partir de id e/ou source.
 */
function resolveMeta({ id, source }) {
  // prioridade por id, depois por source, depois default
  const m =
    (id && LABELS[id]) ||
    (source && LABELS[source]) ||
    LABELS._default;
  const label = m.label || LABELS._default.label;
  const emoji = m.emoji || LABELS._default.emoji;
  return { label, emoji };
}

/**
 * Empurra uma conquista para o log local e tenta sincronizar com Supabase (best-effort).
 */
export function pushAward(id, ts = Date.now(), source) {
  const meta = resolveMeta({ id, source });
  const s = readAwards();
  s.items ||= [];
  s.items.unshift({ id, ts, label: meta.label, emoji: meta.emoji, source });
  s.items = dedupeKeepRecent(s.items).slice(0, 50);
  s.lastTs = ts;
  writeAwards(s);
  // tentativa de sync — não bloqueia UI
  syncAwardToSupabase({ id, ts, label: meta.label, emoji: meta.emoji, source }).catch(() => {});
}

/**
 * Manipula o evento "m360:win".
 * Espera detail: { id: string, ts?: number, source?: string, title?: string, points?: number }
 */
export function handleWinEvent(detail) {
  if (!detail || !detail.id) return;
  const ts = detail.ts || Date.now();
  pushAward(detail.id, ts, detail.source);
}

/**
 * Registra listener global para "m360:win".
 * Chame uma única vez, por exemplo no layout da aplicação.
 */
let _listenerBound = false;
export function initAwardsListener() {
  if (_listenerBound || typeof window === "undefined") return;
  _listenerBound = true;
  window.addEventListener("m360:win", (ev) => {
    try {
      const d = ev?.detail || {};
      handleWinEvent(d);
    } catch {}
  });
}

/* ===== helpers ===== */

function dedupeKeepRecent(arr) {
  const seen = new Set();
  const out = [];
  for (const it of arr) {
    // no máximo 1 entrada por (id, dia)
    const key = `${it.id}-${new Date(it.ts).toDateString()}`;
    if (!seen.has(key)) {
      seen.add(key);
      out.push(it);
    }
  }
  return out;
}

function safeDispatch(name) {
  try { window.dispatchEvent(new CustomEvent(name)); } catch {}
}

/**
 * Sincroniza no Supabase (tabela awards_log) se o client estiver configurado.
 * Campos sugeridos: id (text), label (text), emoji (text), ts (bigint/timestamp), source (text)
 * Não falha o app caso não haja ENV ou tabela.
 */
async function syncAwardToSupabase(payload) {
  // lazy import para não custar no bundle inicial
  try {
    const { getSupabase, supabase } = await import("./supaClient.js");
    const client = getSupabase?.() || supabase || null;
    if (!client) return; // sem SUPABASE_* -> apenas local

    // tenta inserir — ignore erros silenciosamente
    await client.from("awards_log").insert([
      {
        id: String(payload.id),
        label: String(payload.label || ""),
        emoji: String(payload.emoji || ""),
        ts: payload.ts || Date.now(),
        source: String(payload.source || ""),
      },
    ]);
  } catch {
    // sem efeito: mantemos apenas local
  }
}
