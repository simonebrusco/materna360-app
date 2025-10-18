// lib/activities/index.js
// Shim universal de compatibilidade para importações diversas.
// Garante:
// - export default activities
// - export const activities
// - export const ACTIVITIES
// - export function getActivityById(id)
// - export function getActivityBySlug(slug)
// - export function toActivityHref(activity, base="/brincar")

/**
 * Campos padrão por atividade:
 *  - id: string (curto)
 *  - slug: string (para rotas dinâmicas)
 *  - title: string
 *  - desc: string
 *  - age: string (ex.: "2-4", "3-6")
 *  - time: number (minutos)
 *  - place: "casa" | "parque" | "rua" | ...
 *  - tags?: string[]
 */
const activities = [
  {
    id: "bolhas",
    slug: "bolhas",
    title: "Bolhas de sabão no quintal",
    desc: "Prepare a mistura e brinquem de estourar e perseguir bolhas. Coordenação e atenção.",
    age: "2-4",
    time: 10,
    place: "casa",
    tags: ["ar-livre", "movimento", "sensorial"],
  },
  {
    id: "tesouro",
    slug: "tesouro",
    title: "Caça ao tesouro em casa",
    desc: "Esconda 5 objetos simples e crie pistas em desenho. Curiosidade e resolução de problemas.",
    age: "3-6",
    time: 15,
    place: "casa",
    tags: ["lógico", "criatividade", "brincadeira-dirigida"],
  },
  {
    id: "cores",
    slug: "cores",
    title: "Caixa das cores",
    desc: "Separem objetos por cor. Vocabulário e classificação.",
    age: "2-5",
    time: 8,
    place: "casa",
    tags: ["classificação", "vocabulário", "rápida"],
  },
];

export { activities };
export const ACTIVITIES = activities;

/** Busca por ID (compat com códigos antigos) */
export function getActivityById(id) {
  if (!id) return null;
  return activities.find((a) => a.id === id) || null;
}

/** Busca por SLUG (para rotas dinâmicas [slug]) */
export function getActivityBySlug(slug) {
  if (!slug) return null;
  return activities.find((a) => a.slug === slug) || null;
}

/**
 * Gera o href para rota dinâmica com querystring amigável.
 * @param {object} activity - objeto da lista
 * @param {string} base - base da rota ("/brincar" ou "/activities")
 */
export function toActivityHref(activity, base = "/brincar") {
  if (!activity) return base;
  const { slug, title, desc, age, time, place } = activity;
  const params = new URLSearchParams({
    title: String(title ?? ""),
    desc: String(desc ?? ""),
    age: String(age ?? ""),
    time: String(time ?? 10),
    place: String(place ?? ""),
  });
  return `${base}/${encodeURIComponent(slug || activity.id)}?${params.toString()}`;
}

export default activities;
