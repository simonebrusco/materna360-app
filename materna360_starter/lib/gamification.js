// lib/gamification.js
import { get, set, keys } from "./storage.js";
import { todayKey } from "./day.js";

export function grantBadge(name, detail = "") {
  if (typeof window === "undefined") return;
  const day = todayKey();
  const list = get(keys.badges, []);
  // evita duplicado do mesmo selo no mesmo dia
  const already = list.find((b) => b.name === name && b.day === day);
  if (already) return false;
  const entry = { name, day, detail, at: Date.now() };
  set(keys.badges, [entry, ...list]);

  window.dispatchEvent(new CustomEvent("m360:win", {
    detail: { type: "badge", name, day, detail }
  }));
  return true;
}
