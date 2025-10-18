// lib/activities/index.js
// Shim universal para evitar "not exported":
// - export default activities
// - export const activities
// - export const ACTIVITIES
// - export function getActivityById(id)
// - export function toActivityHref(activity)

// Catálogo mínimo (pode ampliar depois sem quebrar)
const activities = [
  {
    id: "bolhas",
    title: "Bolhas de sabão no quintal",
    desc: "Prepare a mistura e brinquem de estourar e perseguir bolhas. Coordenação e atenção.",
    age: "2-4",
    time: 10,
    place: "casa",
  },
  {
    id: "tesouro",
    title: "Caça ao tesouro em casa",
    desc: "Esconda 5 objetos simples e crie pistas em desenho. Curiosidade e resolução de problemas.",
    age: "3-6",
    time: 15,
    place: "casa",
  },
  {
    id: "cores",
    title: "Caixa das cores",
    desc: "Separem objetos por cor. Vocabulário e classificação.",
    age: "2-5",
    time: 8,
    place: "casa",
  },
];

export { activities };
export const ACTIVITIES = activities;

export function getActivityById(id) {
  if (!id) return null;
  return activities.find((a) => a.id === id) || null;
}

// Gera o href para a rota /brincar/[slug] levando dados por querystring
export function toActivityHref(activity) {
  if (!activity) return "/brincar";
  const { id, title, desc, age, time } = activity;
  const params = new URLSearchParams({
    title: String(title || ""),
    desc: String(desc || ""),
    age: String(age || ""),
    time: String(time || 10),
  });
  return `/brincar/${id}?${params.toString()}`;
}

export default activities;
