"use client";

import { useEffect, useMemo, useState } from "react";

/** ===== Helpers locais (evitam imports cruzados em client) ===== */
const K_HISTORY = "m360:checklist_history";

function isBrowser() { return typeof window !== "undefined"; }

function readHistory() {
  if (!isBrowser()) return {};
  try {
    const raw = window.localStorage.getItem(K_HISTORY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

// valida formato yyyy-mm-dd
function isDateKey(s) {
  return typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s);
}

// ordena chaves "yyyy-mm-dd" em desc
function listHistoryKeysDesc(historyObj) {
  if (!historyObj || typeof historyObj !== "object") return [];
  return Object.keys(historyObj)
    .filter(isDateKey)
    .sort((a, b) => (a < b ? 1 : a > b ? -1 : 0));
}

// formata "yyyy-mm-dd" -> "Sexta, 17 de outubro"
function safeFormatDateFromKey(key) {
  if (!isDateKey(key)) return key;
  const [y, m, d] = key.split("-").map((v) => parseInt(v, 10));
  const date = new Date(y, m - 1, d, 12, 0, 0, 0); // meio-dia evita offset
  return formatFullDatePtBR(date);
}
const ptBRWeekdays = ["domingo","segunda","terça","quarta","quinta","sexta","sábado"];
const ptBRMonths   = ["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];
function cap(s){ return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
function formatFullDatePtBR(d){
  const wd = ptBRWeekdays[d.getDay()];
  const dia = String(d.getDate()).padStart(2,"0");
  const mes = ptBRMonths[d.getMonth()];
  return `${cap(wd)}, ${dia} de ${mes}`;
}

function inferProgress(entry) {
  if (!entry || !Array.isArray(entry.items) || entry.items.length === 0) return 0;
  const done = entry.items.filter((i) => i?.done).length;
  return Math.round((done / entry.items.length) * 100);
}
/** ============================================================= */

export default function ChecklistDay() {
  const [history, setHistory] = useState({});

  useEffect(() => {
    setHistory(readHistory());
    // escuta mudanças do checklist (caso outra parte da tela salve)
    const onChange = () => setHistory(readHistory());
    window.addEventListener("m360:checklist:changed", onChange);
    return () => window.removeEventListener("m360:checklist:changed", onChange);
  }, []);

  const keys = useMemo(() => listHistoryKeysDesc(history).slice(0, 7), [history]);

  if (!keys.length) {
    return (
      <div className="rounded-xl border bg-white p-4">
        <div className="text-sm text-slate-500">
          Nenhum histórico encontrado ainda. Salve o checklist de hoje para começar a acompanhar aqui.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {keys.map((key) => {
        const entry = history[key] || {};
        const title = entry.weekdayTitle || safeFormatDateFromKey(key);
        const progress = typeof entry.progress === "number"
          ? Math.max(0, Math.min(100, Math.round(entry.progress)))
          : inferProgress(entry);

        return (
          <div key={key} className="rounded-xl border bg-white p-4">
            <div className="flex items-center justify-between">
              <div className="font-medium">{title}</div>
              <div className="text-sm text-slate-500">{progress}%</div>
            </div>
            <div className="mt-2 h-2 w-full rounded-full bg-black/5 overflow-hidden">
              <div
                className="h-full bg-[#ff005e] rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            {Array.isArray(entry.items) && entry.items.length ? (
              <ul className="mt-3 grid grid-cols-1 gap-1 text-sm text-slate-600">
                {entry.items.map((it) => (
                  <li key={it.id} className="flex items-center gap-2">
                    <span className={`inline-block h-2 w-2 rounded-full ${it.done ? "bg-green-500" : "bg-slate-300"}`} />
                    <span className={it.done ? "line-through text-slate-400" : ""}>{it.label}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
