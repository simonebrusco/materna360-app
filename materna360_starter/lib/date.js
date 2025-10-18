export const ptBRWeekdays = [
  "domingo","segunda","terça","quarta","quinta","sexta","sábado"
];
const ptBRMonths = [
  "janeiro","fevereiro","março","abril","maio","junho",
  "julho","agosto","setembro","outubro","novembro","dezembro"
];

export function capitalize(s){
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

export function formatFullDatePtBR(d){
  const wd = ptBRWeekdays[d.getDay()];
  const dia = String(d.getDate()).padStart(2,"0");
  const mes = ptBRMonths[d.getMonth()];
  return `${capitalize(wd)}, ${dia} de ${mes}`;
}

export function dateKey(d){
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,"0");
  const day = String(d.getDate()).padStart(2,"0");
  return `${y}-${m}-${day}`;
}
