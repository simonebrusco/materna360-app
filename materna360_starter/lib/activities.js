// materna360_starter/lib/activities.js
// Catálogo base e helpers para a aba /brincar

export const AGE_BUCKETS = [
  { value: "0-1", label: "0–1" },
  { value: "2-3", label: "2–3" },
  { value: "4-5", label: "4–5" },
  { value: "6-7", label: "6–7" },
  { value: "8+", label: "8+" },
];

export const PLACES = [
  { value: "casa", label: "Casa" },
  { value: "parque", label: "Parque" },
  { value: "escola", label: "Escola" },
  { value: "arLivre", label: "Ao ar livre" },
];

const ageLabel = (v) => AGE_BUCKETS.find((b) => b.value === v)?.label ?? v;
const placeLabel = (v) => PLACES.find((p) => p.value === v)?.label ?? v;

export const ACTIVITIES = [
  {
    id: "cores-tesouro",
    emoji: "🎨",
    title: "Caça ao Tesouro de Cores",
    desc: "Procurem objetos pela casa de uma cor escolhida.",
    ages: ["2-3", "4-5"],
    places: ["casa", "escola"],
    tags: ["socioemocional", "linguagem", "atenção"],
  },
  {
    id: "bolhas-pintura",
    emoji: "🫧",
    title: "Pintura com Bolhas",
    desc: "Misture água com sabão + corante e estoure bolhas sobre o papel.",
    ages: ["4-5", "6-7"],
    places: ["casa", "escola"],
    tags: ["coordenação", "criatividade"],
  },
  {
    id: "historia-objetos",
    emoji: "📚",
    title: "História com Objetos",
    desc: "Escolham 3 objetos aleatórios e inventem uma história.",
    ages: ["2-3", "4-5", "6-7", "8+"],
    places: ["casa", "escola"],
    tags: ["linguagem", "imaginação"],
  },
  {
    id: "corrida-colher",
    emoji: "🥄",
    title: "Corrida da Colher",
    desc: "Equilibre uma bolinha numa colher e façam mini corridas.",
    ages: ["4-5", "6-7", "8+"],
    places: ["parque", "arLivre", "escola"],
    tags: ["coordenação", "equilíbrio"],
  },
  {
    id: "natureza-texturas",
    emoji: "🍃",
    title: "Texturas da Natureza",
    desc: "Folhas, pedras, gravetos — observar e comparar as texturas.",
    ages: ["2-3", "4-5", "6-7"],
    places: ["parque", "arLivre"],
    tags: ["atenção", "curiosidade", "sensorial"],
  },
  {
    id: "cabana-lencol",
    emoji: "⛺️",
    title: "Cabana de Lençol",
    desc: "Montem uma cabaninha com lençóis e cadeiras e contem histórias.",
    ages: ["2-3", "4-5", "6-7"],
    places: ["casa"],
    tags: ["vínculo", "imaginação"],
  },
].map((a) => ({
  ...a,
  ageLabel: a.ages.map(ageLabel).join(" / "),
  placeLabel: a.places.map(placeLabel).join(" / "),
}));

export function filterActivities(list, { age, place }, limit = 6) {
  const filtered = list.filter(
    (a) => a.ages.includes(age) && a.places.includes(place)
  );
  return shuffle(filtered).slice(0, limit);
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
