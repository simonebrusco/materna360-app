// materna360_starter/lib/wellbeing.js
import { get, set } from "./storage";

const K_MINUTES = "m360:minutes"; // { [weekISO]: { meditate: number, breathe: number } }

function weekKey(d = new Date()) {
  const tmp = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = tmp.getUTCDay() || 7;
  tmp.setUTCDate(tmp.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((tmp - yearStart) / 86400000 + 1) / 7);
  return `${tmp.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

/**
 * Soma minutos ao contador semanal.
 * kind: "meditate" | "breathe"
 */
export function addMinutes(kind, minutes) {
  const wk = weekKey();
  const data = get(K_MINUTES, {});
  const prev = data[wk] || { meditate: 0, breathe: 0 };
  const next = {
    ...data,
    [wk]: {
      ...prev,
      [kind]: (prev[kind] || 0) + (minutes || 0),
    },
  };
  set(K_MINUTES, next);
  return next[wk];
}
