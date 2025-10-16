// lib/activities.js
// Catálogo local (v1). Em breve podemos trocar por Supabase sem quebrar a API.

export const activities = [
  {
    id: "color-hunt",
    title: "Caça ao Tesouro de Cores",
    subtitle: "Procure objetos pela casa",
    ages: ["2-3", "4-5"],
    places: ["casa", "escola"],
    tags: ["socioemocional", "linguagem", "coordenação"],
    duration: 10,
    emoji: "🎨",
  },
  {
    id: "bubble-paint",
    title: "Pintura com Bolhas de Sabão",
    subtitle: "Experiência sensorial divertida",
    ages: ["4-5", "6-7"],
    places: ["ao-ar-livre", "parque", "casa"],
    tags: ["coordenação", "criatividade"],
    duration: 15,
    emoji: "🫧",
  },
  {
    id: "shadow-theatre",
    title: "Teatro de Sombras",
    subtitle: "Crie histórias com lanternas",
    ages: ["6-7", "8+"],
    places: ["casa", "escola"],
    tags: ["linguagem", "imaginação"],
    duration: 12,
    emoji: "🎭",
  },
  {
    id: "sock-puppets",
    title: "Fantoches de Meia",
    subtitle: "Conte uma história curtinha",
    ages: ["2-3", "4-5"],
    places: ["casa", "escola"],
    tags: ["linguagem", "criatividade"],
    duration: 8,
    emoji: "🧦",
  },
  {
    id: "leaf-rubbing",
    title: "Textura de Folhas",
    subtitle: "Descubra as nervuras das folhas",
    ages: ["4-5", "6-7"],
    places: ["parque", "ao-ar-livre"],
    tags: ["coordenação", "natureza"],
    duration: 10,
    emoji: "🍃",
  },
  {
    id: "shape-hunt",
    title: "Caça às Formas",
    subtitle: "Ache círculos, quadrados e triângulos",
    ages: ["0-1", "2-3"],
    places: ["casa", "escola"],
    tags: ["cognição", "coordenação"],
    duration: 7,
    emoji: "🔶",
  },
];

// API estável que a página /brincar usa
export function listActivities({ age, place } = {}) {
  let list = activities;
  if (age)   list = list.filter(a => !a.ages   || a.ages.includes(age));
  if (place) list = list.filter(a => !a.places || a.places.includes(place));
  return list;
}

// export default compatível com fallback usado em /brincar/page.jsx
export default activities;

/* 
// Quando quiser ligar o Supabase, troque por algo assim:
import supabase from "./supabaseClient";
export async function listActivities({ age, place } = {}) {
  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .contains("ages", [age])
    .contains("places", [place])
    .limit(20);
  if (error) return [];
  return data;
}
*/
