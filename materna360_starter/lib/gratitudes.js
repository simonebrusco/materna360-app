// materna360_starter/lib/gratitudes.js
import { getJSON, setJSON } from "./storage";

const KEY = "m360:gratitudes";

export function listGratitudes() {
  const arr = getJSON(KEY, []);
  // mais recentes primeiro
  return Array.isArray(arr) ? [...arr].sort((a, b) => (b.ts || 0) - (a.ts || 0)) : [];
}

export function addGratitude(text) {
  const trimmed = (text || "").trim();
  if (!trimmed) return listGratitudes();

  const now = Date.now();
  const next = [{ id: now, text: trimmed, ts: now }, ...listGratitudes()].slice(0, 50);
  setJSON(KEY, next);

  // badge: Cuidar de Mim
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("m360:win", { detail: { type: "badge", name: "CuidarDeMim" } })
    );
  }
  return next;
}

export function clearGratitudes() {
  setJSON(KEY, []);
}
