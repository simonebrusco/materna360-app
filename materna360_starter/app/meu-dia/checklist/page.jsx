"use client";

import { useMemo } from "react";
import Link from "next/link";
import useChecklistProgress, { todayStr, tid } from "../../../lib/hooks/useChecklistProgress.js";
import { get, set } from "../../../lib/storage.js";
import ChecklistDay from "../../../components/ChecklistDay.jsx";
import { formatFullDatePtBR } from "../../../lib/date.js";
import { handleChecklistAward } from "../../../lib/checklistAwards.js"; // ✅ integração gamificação

export default function ChecklistPage() {
  const { defs, done, percent, toggleToday } = useChecklistProgress();

  // garante itens padrões se não houver defs
  const hasDefaults = Array.isArray(defs) && defs.length > 0;
  const initialDefs = useMemo(() => {
    if (hasDefaults) return defs;
    const seed = [
      { id: "agua",      label: "Beber água" },
      { id: "arejar",    label: "Abrir as janelas" },
      { id: "respirar",  label: "1 min de respiração" },
      { id: "movimento", label: "3 min de movimento" },
      { id: "momento",   label: "Um momento com meu filho" },
    ];
    set("m360:checklist_defs", seed);
    return seed;
  }, [hasDefaults, defs]);

  const todayIso = todayStr(); // yyyy-mm-dd (hook existente)
  const titleNice = useMemo(() => formatFullDatePtBR(new Date()), []); // “Sexta, 17 de outubro”

  // salva resumo do checklist no Planner
  function saveToPlanner() {
    const NOTES_KEY = "m360:planner_notes";
    const notes = get(NOTES_KEY) || {};
    const total = initialDefs.length;
    const doneCount = Array.isArray(done) ? done.length : 0;
    const line = `• Checklist: ${doneCount}/${total} concluídos — ${titleNice}`;

    const prev = notes[todayIso] ? String(notes[todayIso]) : "";
    const alreadyHas = prev.split("\n").some(l => l.trim().startsWith("• Checklist:"));
    const nextText = alreadyHas
      ? prev.replace(/(^|\n)• Checklist:.*$/m, `\n${line}`).trim()
      : (prev ? prev + "\n" : "") + line;

    notes[todayIso] = nextText;
    set(NOTES_KEY, notes);
    alert("Checklist salvo no Planner!");
  }

  return (
    <main className="max-w-5xl mx-auto px-5 py-6">
      <header className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-semibold">Checklist de {titleNice}</h1>
          <p className="text-sm text-slate-500">{percent}% do dia concluído</p>
        </div>
        <Link href="/meu-dia" className="btn bg-white border border-slate-200">
          ← Voltar
        </Link>
      </header>

      {/* barra de progresso */}
      <div className="card mb-4">
        <div className="h-2 rounded-full bg-black/5 overflow-hidden">
          <div
            className="h-full bg-[#ff005e] rounded-full transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* lista de itens */}
      <section className="space-y-2">
        {initialDefs.map((it) => {
          const checked = Array.isArray(done) && done.includes(it.id);

          // handler com gamificação
          const onToggle = () => {
            const willCheck = !checked;
            toggleToday(it.id);
            handleChecklistAward({ id: it.id, willCheck }); // ✅ dispara “m360:win”
          };

          return (
            <label
              key={it.id}
              className="flex items-center justify-between rounded-xl bg-white ring-1 ring-black/5 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={onToggle}
                  className="h-5 w-5 rounded-md border-slate-300 text-[#ff005e] focus:ring-[#ff005e]"
                />
                <span className="text-[15px]">{it.label}</span>
              </div>
              {checked ? <span className="text-sm text-green-600">feito</span> : null}
            </label>
          );
        })}
      </section>

      {/* rodapé */}
      <footer className="mt-6 flex flex-wrap gap-3 items-center justify-between">
        <button
          onClick={() => {
            set(tid(), []); // limpa apenas o log de hoje
            window.dispatchEvent(new CustomEvent("m360:checklist:changed"));
          }}
          className="btn bg-white border border-slate-200"
        >
          Limpar marcações de hoje
        </button>

        <div className="flex gap-3">
          <button
            onClick={saveToPlanner}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200"
          >
            Salvar no Planner
          </button>

          <Link
            href="/meu-dia"
            className="px-4 py-2 rounded-xl bg-[#ff005e] text-white"
          >
            Concluir
          </Link>
        </div>
      </footer>

      {/* histórico */}
      <section className="mt-10">
        <div className="mb-3 text-sm text-slate-500">
          Versão nova do Checklist (v1.5) com data no cabeçalho e histórico leve:
        </div>
        <ChecklistDay />
      </section>
    </main>
  );
}
