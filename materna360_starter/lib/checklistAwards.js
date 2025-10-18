// lib/awards.js
// Registro leve de conquistas locais baseado no evento global "m360:win".
// Formato salvo: { items: [{ id, ts, label, emoji }], lastTs }

const K = "m360:awards_log";

const LABELS = {
  respirar: { label: "Respiração concluída", emoji: "🌬️" },
  momento:  { label: "Momento com o filho",  emoji: "💛" },
  gratidao: { label: "Gratidão registrada",  emoji: "🌼" },
  mentoria: { label: "Mentoria realizada",    emoji: "🎯" },
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

export function pushAward(id, ts = Date.now()) {
  const meta = LABELS[id] || { label: `Conquista: ${id}`, emoji: "🏅" };
  const s = readAwards();
  s.items.unshift({ id, ts, label: meta.label, emoji: meta.emoji });
  s.items = dedupeKeepRecent(s.items).slice(0, 50);
  s.lastTs = ts;
  writeAwards(s);
}

export function handleWinEvent(detail) {
  // detail: { source?: string, id: string, ts?: number }
  if (!detail || !detail.id) return;
  pushAward(detail.id, detail.ts || Date.now());
}

/* ===== helpers ===== */
function dedupeKeepRecent(arr) {
  const seen = new Set();
  const out = [];
  for (const it of arr) {
    const key = `${it.id}-${new Date(it.ts).toDateString()}`; // 1 por dia/ID
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
