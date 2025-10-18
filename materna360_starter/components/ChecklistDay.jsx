"use client";

import { useEffect, useMemo, useState } from "react";
import { get } from "../lib/storage.js";
import { safeFormatDateFromKey, listHistoryKeysDesc, K_HISTORY } from "../lib/checklistHistory.js";

export default function ChecklistDay() {
  const [history, setHistory] = useState({});

  useEffect(() => {
    // lê o histórico inteiro do localStorage
    const h = get(K_HISTORY) || {};
    setHistory(h);
  }, []);

  const keys = useMemo(() => listHistoryKeysDesc(history).slice(0, 7), [history]); // últimos 7 dias

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

function inferProgress(entry) {
  if (!entry || !Array.isArray(entry.items) || entry.items.length === 0) return 0;
  const done = entry.items.filter((i) => i?.done).length;
  return Math.round((done / entry.items.length) * 100);
}
