// materna360_starter/lib/storage.js
// Storage universal (browser + SSR). Em SSR usa memória em vez de localStorage.

// -------------------------------
// Ambiente
// -------------------------------
const isBrowser =
  typeof window !== "undefined" &&
  typeof window.localStorage !== "undefined";

// fallback em memória quando não há localStorage (SSR/build)
const memory = new Map();

// Helpers para ler/gravar no backend escolhido
function _read(key) {
  if (isBrowser) return window.localStorage.getItem(key);
  return memory.get(key) ?? null;
}
function _write(key, value) {
  if (isBrowser) {
    window.localStorage.setItem(key, value);
  } else {
    memory.set(key, value);
  }
}
function _remove(key) {
  if (isBrowser) {
    window.localStorage.removeItem(key);
  } else {
    memory.delete(key);
  }
}

// -------------------------------
// API: chaves padrão do app
// -------------------------------
export const keys = {
  // Planner & Checklist
  planner: "m360:planner",
  checklist: "m360:checklist",
  checklistDef: "m360:checklist_def",

  // Bem-estar / Eu360
  moods: "m360:moods",                 // [{date:'YYYY-MM-DD', score:1..5}]
  gratitudes: "m360:gratitudes",       // [{date, text}]
  badges: "m360:badges",               // ['Organizada','Exploradora',...]

  // Telemetria de minutos (para “Meu Tempo”)
  audioMinutes: "m360:audio_minutes",  // { '2025-10-16': totalMin }
  breathMinutes: "m360:breath_minutes",

  // Mensagem do dia
  messageOfDay: "m360:message_of_day",     // { text, id }
  messageOfDayTS: "m360:message_of_day_ts",// timestamp (ms) da última rotação

  // Descobrir / semente de sugestões
  suggestionSeed: "m360:suggestion_seed",

  // Outras ações/eventos leves
  actions: "m360:actions",
};

// -------------------------------
// API: alto nível (auto-JSON)
// -------------------------------
/**
 * get(key, fallback): tenta fazer JSON.parse se possível.
 * - Se não houver valor, retorna `fallback` (default: null).
 */
export function get(key, fallback = null) {
  try {
    const raw = _read(key);
    if (raw === null || raw === undefined) return fallback;
    // tenta parsear JSON; se falhar, retorna string crua
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  } catch {
    return fallback;
  }
}

/**
 * set(key, value): serializa objetos/arrays como JSON automaticamente.
 */
export function set(key, value) {
  try {
    const toStore =
      typeof value === "string" ? value : JSON.stringify(value ?? null);
    _write(key, toStore);
  } catch {
    // silencia em SSR
  }
}

/**
 * remove(key): apaga a chave.
 */
export function remove(key) {
  try {
    _remove(key);
  } catch {
    // silencia
  }
}

// -------------------------------
// API: explícita JSON (retrocompatível)
// -------------------------------
export function getJSON(key, fallback = null) {
  const v = get(key, fallback);
  // garante objeto/array ou fallback
  if (v === null || v === undefined) return fallback;
  return v;
}
export function setJSON(key, value) {
  set(key, value);
}

// -------------------------------
// Utilidades extras (opcional)
// -------------------------------

/**
 * listKeys(prefix = 'm360:'): lista chaves do namespace.
 * Em SSR lista o que estiver no Map.
 */
export function listKeys(prefix = "m360:") {
  if (isBrowser) {
    const out = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k && k.startsWith(prefix)) out.push(k);
    }
    return out.sort();
  }
  return Array.from(memory.keys()).filter((k) => k.startsWith(prefix)).sort();
}

/**
 * clearNamespace(prefix = 'm360:'): remove todas as chaves do namespace.
 */
export function clearNamespace(prefix = "m360:") {
  if (isBrowser) {
    const toRemove = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k && k.startsWith(prefix)) toRemove.push(k);
    }
    toRemove.forEach((k) => window.localStorage.removeItem(k));
  } else {
    for (const k of memory.keys()) {
      if (k.startsWith(prefix)) memory.delete(k);
    }
  }
}

// -------------------------------
// Compat: aliases leves (se alguém importou como default)
// -------------------------------
const StorageAPI = { get, set, remove, keys, getJSON, setJSON, listKeys, clearNamespace };
export default StorageAPI;
