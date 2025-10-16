// materna360_starter/lib/gratitudes.js
// CRUD simples de gratidões com storage seguro

import { getJSON, setJSON } from "./storage";

const KEY = "m360:gratitudes";

function coerceList(x) {
  return Array.isArray(x) ? x : [];
}

export function listGratitudes() {
  const arr = getJSON(KEY, []);
  return coerceList(arr);
}

export function addGratitude(text) {
  const t = (text || "").trim();
  if (!t) return listGratitudes(); // nada a fazer

  const now = Date.now();
  const item = { id: `${now}-${Math.random().toString(36).slice(2, 8)}`, text: t, ts: now };

  const prev = listGratitudes();
  const next = [item, ...prev].slice(0, 100); // limita tamanho
  setJSON(KEY, next);
  return next;
}
