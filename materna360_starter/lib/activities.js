// materna360_starter/lib/activities.js

// buckets de idade e locais (mock)
export const AGE_BUCKETS = [
  { id: "0-1", label: "0–1" },
  { id: "2-3", label: "2–3" },
  { id: "4-5", label: "4–5" },
  { id: "6-7", label: "6–7" },
  { id: "8+",  label: "8+"  },
];

export const PLACES = [
  { id: "casa",      label: "Casa" },
  { id: "parque",    label: "Parque" },
  { id: "escola",    label: "Escola" },
  { id: "ao-ar-livre", label: "Ao ar livre" },
];

// mock de atividades (mínimo para funcionar)
export const ACTIVITIES = [
  {
    slug: "caca-cores",
    title: "Caça ao Tesouro de Cores",
    subtitle: "Brincadeira de observar e nomear cores pela casa",
    ages: ["2-3", "4-5"],
    places: ["casa", "escola"],
  },
  {
    slug: "bolhas-sabao",
    title: "Pintura com Bolhas de Sabão",
    subtitle: "Mistura arte e ciência, com cuidado e diversão",
    ages: ["4-5", "6-7"],
    places: ["ao-ar-livre", "parque"],
  },
  {
    slug: "musicas-toque",
    title: "Músicas de Toque e Resposta",
    subtitle: "Batucar em objetos e repetir padrões simples",
    ages: ["0-1", "2-3"],
    places: ["casa", "escola"],
  },
];

// helper para saber se uma activity é compatível
function matchAge(act, age) {
  if (!age) return true;
  return Array.isArray(act.ages) ? act.ages.includes(age) : true;
}
function matchPlace(act, place) {
  if (!place) return true;
  return Array.isArray(act.places) ? act.places.includes(place) : true;
}

// ⚠️ DEFAULT PARAMS! Evita "Cannot destructure property 'age' of undefined"
export function filterActivities({ age, place } = {}) {
  // se vier vazio, usa primeiros valores como padrão
  const safeAge = age ?? AGE_BUCKETS[0]?.id ?? null;
  const safePlace = place ?? PLACES[0]?.id ?? null;

  return ACTIVITIES.filter((a) => matchAge(a, safeAge) && matchPlace(a, safePlace));
}
