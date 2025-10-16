// materna360_starter/lib/storage.js
// Utilidades seguras para localStorage (sem SSR e com try/catch)

export function hasWindow() {
  return typeof window !== "undefined";
}

export function get(key, fallback = null) {
  if (!hasWindow()) return fallback;
  try {
    const v = window.localStorage.getItem(key);
    return v ?? fallback;
  } catch {
    return fallback;
  }
}

export function set(key, value) {
  if (!hasWindow()) return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // ignora cota cheia/Modo Privado etc.
  }
}

export function getJSON(key, fallback = null) {
  const raw = get(key, null);
  if (raw == null) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    // se estiver corrompido, repara
    set(key, JSON.stringify(fallback));
    return fallback;
  }
}

export function setJSON(key, obj) {
  try {
    set(key, JSON.stringify(obj ?? null));
  } catch {
    // ignora
  }
}
