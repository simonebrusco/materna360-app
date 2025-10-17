// =======================================================
// Materna360 — utilitários de storage e datas (SSR-safe)
// =======================================================

export const keys = {
  profile: 'm360:profile',            // { motherName: string, kids: Array<{name:string, ageRange:string}> }
  planner: 'm360:planner',            // { [yyyy-mm-dd]: { items: string[], notes?: string } }
  checklist: 'm360:checklist',        // { [yyyy-mm-dd]: Array<{ id:string, label:string, done:boolean }> }
  history: 'm360:history',            // Array<{ date:string, completed:number }>
  badges: 'm360:badges',              // Array<{ id:string, type:'weekly'|'special'|'streak', earnedAt:string }>
  gratitudes: 'm360:gratitudes',      // Array<{ text:string, at:string }>
  mood: 'm360:mood'                   // { [yyyy-mm-dd]: number } // 1..5
};

export function isClient() {
  return typeof window !== 'undefined';
}

export function get(key, fallback) {
  if (!isClient()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function set(key, value) {
  if (!isClient()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function todayISO(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

export const weekDaysPt = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
export const fullWeekPt = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
