// lib/checklistTools.js
// Funções utilitárias para exportar histórico do Checklist ao Planner e limpar histórico.

import { get, set } from "./storage.js";
import { formatFullDatePtBR } from "./date.js";

export const K_HISTORY = "m360:checklist_history";
export const K_NOTES   = "m360:planner_notes";

// Exporta TODO o histórico do checklist para o Planner, sem duplicar linhas já exportadas.
// Retorna a contagem de dias exportados/atualizados.
export function exportHistoryToPlanner() {
  const history = get(K_HISTORY) || {};
  const notes   = get(K_NOTES)   || {};

  const keys = Object.keys(history).filter(isDateKey).sort(); // asc/desc não importa para export
  let updatedCount = 0;

  for (const key of keys) {
    const entry = history[key] || {};
    const title = entry.weekdayTitle || safeFormatDateFromKey(key);

    const total = Array.isArray(entry.items) ? entry.items.length : 0;
    const done  = Array.isArray(entry.items) ? entry.items.filter(i => i?.done).length : 0;
    const progress = typeof entry.progress === "number"
      ? clamp(Math.round(entry.progress), 0, 100)
      : (total > 0 ? Math.round((done/total) * 100) : 0);

    const line = `• Checklist: ${done}/${total || 0} concluídos — ${title}`;
    const prev = notes[key] ? String(notes[key]) : "";

    // Evita duplicar a mesma linha do mesmo dia
    const alreadyHas = prev.split("\n").some(l => l.trim().startsWith("• Checklist:"));
    const nextText = alreadyHas
      ? prev.replace(/(^|\n)• Checklist:.*$/m, `\n${line}`).trim()
      : (prev ? prev + "\n" : "") + line;

    if (nextText !== prev) {
      notes[key] = nextText;
      updatedCount++;
    }
  }

  if (updatedCount > 0) {
    set(K_NOTES, notes);
    // dispara evento de atualização do Planner
    safeDispatch("m360:planner:changed");
  }
  return updatedCount;
}

// Limpa TODO o histórico do checklist com confirmação.
// Retorna true se apagou, false se cancelado.
export function clearChecklistHistory(confirmFn) {
  const ask = typeof confirmFn === "function" ? confirmFn : (msg) => window.confirm(msg);
  const ok = ask("Tem certeza que deseja limpar TODO o histórico do Checklist? Essa ação não pode ser desfeita.");
  if (!ok) return false;

  set(K_HISTORY, {});
  safeDispatch("m360:checklist:changed");
  return true;
}

/* ===== Helpers locais ===== */
function isDateKey(s) {
  return typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s);
}

function safeFormatDateFromKey(key) {
  if (!isDateKey(key)) return key;
  const [y, m, d] = key.split("-").map(v => parseInt(v, 10));
  const date = new Date(y, m - 1, d, 12, 0, 0, 0); // meio-dia evita offset
  return formatFullDatePtBR(date);
}

function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }

function safeDispatch(name) {
  try { if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent(name)); } catch {}
}
