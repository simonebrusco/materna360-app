// materna360_starter/app/meu-dia/checklist/page.jsx
"use client";

import { useMemo } from "react";
import Link from "next/link";
import useChecklistProgress, { todayStr, tid } from "@/lib/hooks/useChecklistProgress.js";
import { get, set } from "@/lib/storage.js";
import { handleChecklistAward } from "@/lib/checklistAwards.js";
import ChecklistDay from "@/components/ChecklistDay.jsx";
import Button from "@/components/Button";

export default function ChecklistPage() {
  const { defs, done, percent, toggleToday } = useChecklistProgress();

  // se não houver defs ainda, cria um set inicial gentil
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

  const today = todayStr();

  return (
    <main className="max-w-5xl mx-auto px-5 py-6">
      {/* Cabeçalho */}
      <header className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--m360-navy)]">
            Checklist de {today}
          </h1>
          <p className="text-sm text-[color:var(--m360-navy)]/60">
            {percent}% do dia concluído
          </p>
        </div>
        <Link
          href="/meu-dia"
          className="rounded-[var(--r-lg)] bg-[var(--m360-white)] m360-card-border px-4 py-2 text-sm shadow-[var(--elev-1)] hover:shadow-[var(--elev-2)] transition-all duration-300 ease-[var(--ease-soft)]"
        >
          ← Voltar
        </Link>
      </header>

      {/* Barra de progresso */}
      <section className="rounded-[var(--r-lg)] bg-[var(--m360-white)] m360-card-border shadow-[var(--elev-1)] p-4 mb-4">
        <div className="h-2 rounded-full bg-black/5 overflow-hidden">
          <div
            className="h-full bg-[var(--m360-primary)] rounded-full transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
      </section>

      {/* Lista de itens */}
      <section className="space-y-2">
        {initialDefs.map((it) => {
          const checked = Array.isArray(done) && done.includes(it.id);
          return (
            <label
              key={it.id}
              className="flex items-center justify-between rounded-[var(--r-lg)] bg-[var(--m360-white)] m360-card-border px-4 py-3 shadow-[var(--elev-1)]"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => {
                    // 🔔 gamificação (respirar/momento) ANTES de alternar
                    handleChecklistAward({ id: it.id, willCheck: !checked });
                    toggleToday(it.id);
                  }}
                  className="h-5 w-5 rounded-md border-slate-300 text-[color:var(--m360-primary)] focus:ring-[color:var(--m360-primary)]"
                />
                <span className="text-[15px] text-[var(--m360-navy)]">{it.label}</span>
              </div>
              {checked ? <span className="text-sm text-green-600">feito</span> : null}
            </label>
          );
        })}
      </section>

      {/* Rodapé com ações rápidas */}
      <footer className="mt-6 flex items-center justify-between">
        <Button
          variant="secondary"
          onClick={() => {
            // limpa apenas o log de hoje
            set(tid(), []);
            try { window.dispatchEvent(new CustomEvent("m360:checklist:changed")); } catch {}
          }}
        >
          Limpar marcações de hoje
        </Button>

        <Link href="/meu-dia">
          <Button variant="primary">Concluir</Button>
        </Link>
      </footer>

      {/* v1.5: data no cabeçalho e histórico leve */}
      <section className="mt-10">
        <div className="mb-3 text-sm text-[color:var(--m360-navy)]/60">
          Versão nova do Checklist (v1.5) com data no cabeçalho e histórico leve:
        </div>
        <ChecklistDay />
      </section>
    </main>
  );
}
