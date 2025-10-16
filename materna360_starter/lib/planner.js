// materna360_starter/lib/planner.js
const KEY = "m360:planner";

export function getPlannerItems() {
  if (typeof window === "undefined") return { casa: [], filhos: [], eu: [] };
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : { casa: [], filhos: [], eu: [] };
  } catch {
    return { casa: [], filhos: [], eu: [] };
  }
}

export function addPlannerItem({ area = "casa", title = "", done = false, meta = {} }) {
  if (typeof window === "undefined") return;
  const data = getPlannerItems();
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const item = { id, title, done, meta };
  data[area] = [...(data[area] || []), item];
  localStorage.setItem(KEY, JSON.stringify(data));
  return item;
}

export function setPlannerItems(next) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(next));
}
