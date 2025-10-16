// lib/gamification.js
import { get, set } from "./storage.js";

const EVENTS_KEY = "m360:badge_events";   // [{ name, ts }]
const BADGES_KEY = "m360:badges";         // ["Organizada", "Exploradora", ...]

export const CATALOG = {
  "Cuidar de Mim": {
    emoji: "🌷",
    desc: "Você se cuidou (pausas, respiração, gratidão).",
  },
  "Mãe Presente": {
    emoji: "💕",
    desc: "Registrou um momento com seu filho.",
  },
  "Exploradora": {
    emoji: "🧩",
    desc: "Salvou/fez uma sugestão do Brincar.",
  },
  "Organizada": {
    emoji: "🏠",
    desc: "Concluiu 5+ tarefas do Planner/Checklist.",
  },
  "Conectada": {
    emoji: "🤝",
    desc: "Falou com um profissional na Mentoria.",
  },
};

export function getBadgeEvents() {
  return get(EVENTS_KEY, []);
}

export function getUserBadges() {
  return get(BADGES_KEY, []);
}

export function addBadge(name, when = Date.now()) {
  if (!name) return;
  const events = get(EVENTS_KEY, []);
  const badges = new Set(get(BADGES_KEY, []));
  events.unshift({ name, ts: when });
  badges.add(name);
  set(EVENTS_KEY, events.slice(0, 200)); // limita histórico
  set(BADGES_KEY, Array.from(badges));
  return { name, ts: when };
}

// Listener global: ouve `window.dispatchEvent(new CustomEvent("m360:win",{detail:{type:'badge', name:'Organizada'}}))`
export function initBadgeListener() {
  if (typeof window === "undefined") return;
  if (window.__m360_badge_listener) return; // evita duplo bind

  const handler = (ev) => {
    const name = ev?.detail?.name;
    if (name) addBadge(name);
  };
  window.addEventListener("m360:win", handler);
  window.__m360_badge_listener = true;
}
