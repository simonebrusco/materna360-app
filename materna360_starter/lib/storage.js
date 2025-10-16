// materna360_starter/lib/storage.js

// ✅ Chaves padrão usadas no app
export const keys = {
  planner: "m360:planner",
  checklist: "m360:checklist",
  badges: "m360:badges",
  badgeEvents: "m360:badge_events",
  moods: "m360:moods",
  gratitudes: "m360:gratitudes",
};

function isBrowser() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

// ✅ get/set STRING
export function get(key, fallback = null) {
  if (!isBrowser()) return fallback;
  try {
    const v = localStorage.getItem(key);
    return v ?? fallback;
  } catch {
    return fallback;
  }
}

export function set(key, value) {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(key, value);
  } catch {}
}

// ✅ get/set JSON
export function getJSON(key, fallback = null) {
  if (!isBrowser()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function setJSON(key, value) {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}
