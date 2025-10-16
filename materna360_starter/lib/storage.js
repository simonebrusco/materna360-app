// materna360_starter/lib/storage.js
// Utilitários de storage com fallback seguro para SSR/Build

const isBrowser =
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

const NS = "m360:"; // namespace para evitar colisões

function k(key) {
  return `${NS}${key}`;
}

// --- Primitivos (string) ---
export function get(key, fallback = null) {
  if (!isBrowser) return fallback;
  const v = window.localStorage.getItem(k(key));
  return v ?? fallback;
}

export function set(key, value) {
  if (!isBrowser) return;
  window.localStorage.setItem(k(key), value);
}

export function remove(key) {
  if (!isBrowser) return;
  window.localStorage.removeItem(k(key));
}

// --- JSON helpers ---
export function getJSON(key, fallback = null) {
  const raw = get(key, null);
  if (raw == null) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function setJSON(key, obj) {
  try {
    set(key, JSON.stringify(obj));
  } catch {
    // silencia erros de quota
  }
}

/**
 * Empurra um item para um array salvo em JSON.
 * Retorna o array atualizado.
 */
export function pushJSON(key, item) {
  const arr = getJSON(key, []);
  arr.push(item);
  setJSON(key, arr);
  return arr;
}

/**
 * Lista chaves salvas, já sem o prefixo "m360:".
 * prefix opcional filtra por início.
 */
export function keys(prefix = "") {
  if (!isBrowser) return [];
  const out = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const full = window.localStorage.key(i);
    if (!full || !full.startsWith(NS)) continue;
    const short = full.slice(NS.length);
    if (prefix && !short.startsWith(prefix)) continue;
    out.push(short);
  }
  return out;
}

// Export default opcional para quem usa import default
export default {
  get,
  set,
  remove,
  getJSON,
  setJSON,
  pushJSON,
  keys,
};
