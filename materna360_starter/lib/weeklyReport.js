// lib/weeklyReport.js
// Gera o resumo semanal a partir do Planner (planner_notes) e Conquistas (awards_log).
// Depende de: getPlannerNotes, getAwardsLog (com Supabase + fallback local)

import { getPlannerNotes, getAwardsLog } from "@/lib/persistM360.js";

export function startOfWeek(d = new Date()) {
  // Segunda-feira como início (seg=1 ... dom=0)
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = x.getDay(); // 0..6 (dom..sáb)
  const diff = (day === 0 ? -6 : 1 - day); // ajusta para segunda
  x.setDate(x.getDate() + diff);
  x.setHours(0, 0, 0, 0);
  return x;
}
export function endOfWeek(d = new Date()) {
  const s = startOfWeek(d);
  const e = new Date(s);
  e.setDate(s.getDate() + 6);
  e.setHours(23, 59, 59, 999);
  return e;
}
export function dayKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
export function eachDayOfWeek(d = new Date()) {
  const s = startOfWeek(d);
  const out = [];
  for (let i = 0; i < 7; i++) {
    const dt = new Date(s);
    dt.setDate(s.getDate() + i);
    out.push(dt);
  }
  return out;
}

// Heurística simples: considera 60s por evento "respirar" na semana.
function inferBreathSeconds(awards) {
  if (!awards || !Array.isArray(awards.items)) return 0;
  const msInWeek = {};
  for (const it of awards.items) {
    if (it?.id !== "respirar" || !it.ts) continue;
    const d = new Date(it.ts);
    const k = dayKey(d);
    msInWeek[k] = (msInWeek[k] || 0) + 60; // 60s por conquista respirar
  }
  // soma total em segundos
  return Object.values(msInWeek).reduce((a, b) => a + b, 0);
}

function countMomento(awards) {
  if (!awards || !Array.isArray(awards.items)) return 0;
  return awards.items.filter((it) => it?.id === "momento").length;
}

export async function buildWeeklyReport({ userId, when = new Date() } = {}) {
  const days = eachDayOfWeek(when);
  const keys = days.map(dayKey);

  // Coleta datasets
  const [notesMap, awards] = await Promise.all([
    getPlannerNotes(userId),    // { 'yyyy-mm-dd': 'texto...' }
    getAwardsLog(userId),       // { items:[{id, ts, label, emoji}], lastTs }
  ]);

  // Seleciona só a semana atual
  const notesThisWeek = keys.map((k) => ({ key: k, text: (notesMap?.[k] || "").trim() }));

  // Métricas
  const totalDaysWithNotes = notesThisWeek.filter((d) => d.text).length;
  const totalBreathSec = inferBreathSeconds(awards); // em segundos
  const totalBreathMin = Math.round(totalBreathSec / 60);
  const totalMomento = countMomento(awards);

  // Destaques: primeiras linhas não vazias do planner na semana
  const highlights = notesThisWeek
    .map((d) => {
      const firstLine = d.text.split("\n").map((s) => s.trim()).find(Boolean) || "";
      return firstLine ? { day: d.key, line: firstLine } : null;
    })
    .filter(Boolean)
    .slice(0, 5);

  // intervalo formatado
  const beg = days[0];
  const end = days[6];
  const title = `Semana ${beg.getDate()}/${beg.getMonth()+1} – ${end.getDate()}/${end.getMonth()+1}`;

  return {
    title,
    range: { start: beg, end },
    metrics: {
      daysWithNotes: totalDaysWithNotes,
      breathMin: totalBreathMin,
      momentos: totalMomento,
    },
    highlights,
  };
}

export default { buildWeeklyReport };
