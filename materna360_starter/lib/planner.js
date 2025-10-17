// materna360_starter/lib/planner.js

// Importa da storage com aliases para não conflitar
import { get as storageGet, set as storageSet, keys as storageKeys } from "./storage";

// Reexporta para compat com imports antigos: `import { get, set, keys } from "@/lib/planner"`
export const get = storageGet;
export const set = storageSet;
export const keys = storageKeys;

// Estado vazio seguro
const EMPTY = { casa: [], filhos: [], eu: [] };

/**
 * Lê todo o planner do storage.
 * Retorna sempre um objeto seguro { casa:[], filhos:[], eu:[] }.
 */
export function getPlanner() {
  const p = storageGet(storageKeys.planner, EMPTY) || EMPTY;
  return {
    casa: Array.isArray(p.casa) ? p.casa : [],
    filhos: Array.isArray(p.filhos) ? p.filhos : [],
    eu: Array.isArray(p.eu) ? p.eu : [],
  };
}

/**
 * Persiste o planner inteiro (normalizando listas).
 */
export function setPlanner(next) {
  const safe = {
    casa: Array.isArray(next?.casa) ? next.casa : [],
    filhos: Array.isArray(next?.filhos) ? next.filhos : [],
    eu: Array.isArray(next?.eu) ? next.eu : [],
  };
  storageSet(storageKeys.planner, safe);
  return safe;
}

/**
 * Adiciona um item em uma lista do planner.
 * kind: "casa" | "filhos" | "eu"
 */
export function addPlannerItem(kind, title, extra = {}) {
  const data = getPlanner();
  const id = `${kind}_${Date.now()}`;
  const item = {
    id,
    title: title || "Tarefa",
    done: false,
    meta: extra, // ex.: { source: "brincar", activityId: "..." }
  };
  data[kind] = [item, ...(data[kind] || [])];
  setPlanner(data);
  return item;
}

/**
 * Alterna o status (done) de um item pelo id.
 */
export function togglePlannerItem(kind, id) {
  const data = getPlanner();
  data[kind] = (data[kind] || []).map((i) =>
    i.id === id ? { ...i, done: !i.done } : i
  );
  setPlanner(data);
  return data[kind].find((i) => i.id === id);
}

/**
 * Remove um item do planner.
 */
export function removePlannerItem(kind, id) {
  const data = getPlanner();
  data[kind] = (data[kind] || []).filter((i) => i.id !== id);
  setPlanner(data);
  return true;
}

/**
 * Calcula progresso de uma lista.
 */
export function calcProgress(list) {
  const total = Array.isArray(list) ? list.length : 0;
  const done = Array.isArray(list) ? list.filter((i) => i.done).length : 0;
  const percent = total ? Math.round((done / total) * 100) : 0;
  return { total, done, percent };
}
