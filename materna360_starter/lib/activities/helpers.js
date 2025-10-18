// lib/activities/helpers.js
// Utilitários que algumas páginas podem importar.
// Mantém compatibilidade com qualquer estilo de import.

export { default as activities, activities as ACTIVITIES, activities as ACTIVITY_LIST } from "./index.js";
export { getActivityById, toActivityHref } from "./index.js";

// Filtros simples por idade/local (caso alguma página use)
export function filterByAge(list, ageRange) {
  if (!ageRange) return list;
  return list.filter((a) => String(a.age || "").toLowerCase() === String(ageRange).toLowerCase());
}

export function filterByPlace(list, place) {
  if (!place) return list;
  return list.filter((a) => String(a.place || "").toLowerCase() === String(place).toLowerCase());
}
