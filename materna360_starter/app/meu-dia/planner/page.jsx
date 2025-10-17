// materna360_starter/app/meu-dia/planner/page.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { get, set } from "../../../lib/storage";
import { toast } from "../../../lib/toast";

const K = "m360:planner"; // { casa: Item[], filhos: Item[], eu: Item[] }
const K_COUNT = "m360:planner_done_count"; // número acumulado de conclusões

function ensurePlannerShape(p) {
  return {
    casa: Array.isArray(p?.casa) ? p.casa : [],
    filhos: Array.isArray(p?.filhos) ? p.filhos : [],
    eu: Array.isArray(p?.eu) ? p.eu : [],
  };
}

function Progress({ done, total }) {
  const pct = total ? Math.round((done / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-32 bg-slate-200 rounded-full overflow-hidden">
        <div className="h-2 bg-[--brand] rounded-full" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-slate-600">{pct}%</span>
      <style jsx>{`
        :root { --brand: #ff005e; }
      `}</style>
    </div>
  );
}

function Section({ name, items, onToggle }) {
  const done = items.filter((i) => i.done).length;
  const total = items.length;

  return (
    <section className="rounded-2xl bg-white ring-1 ring-black/5 shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-brand-navy">{name}</h3>
        <Progress done={done} total={total} />
      </div>
      <ul className="space-y-2">
        {items.length === 0 && (
          <li className="text-sm text-slate-500">Sem itens ainda.</li>
        )}
        {items.map((it) => (
          <li key={it.id} className="flex items-start gap-3">
            <input
              type="checkbox"
              className="mt-1 h-5 w-5 rounded border-slate-300 text-[--brand] focus:ring-[--brand]"
              checked={!!it.done}
              onChange={() => onToggle(it.id)}
            />
            <div>
              <div className={`text-sm ${it.done ? "line-through text-slate-400" : "text-brand-navy"}`}>
                {it.title}
              </div>
              {it.meta?.source === "brincar" && (
                <div className="text-[11px] text-slate-500">Salvo do Descobrir</div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function PlannerPage() {
  const [data, setData] = useState(() => ensurePlannerShape(get(K, null)));

  // contagem acumulada para badge “Organizada” a cada 5 conclusões
  const [doneCount, setDoneCount] = useState(() => Number(get(K_COUNT, 0)) || 0);

  useEffect(() => set(K, data), [data]);
  useEffect(() => set(K_COUNT, doneCount), [doneCount]);

  function toggleIn(sec, id) {
    setData((prev) => {
      const nextSec = prev[sec].map((i) => (i.id === id ? { ...i, done: !i.done } : i));
      const next = { ...prev, [sec]: nextSec };

      // toast + contagem quando marca como feito
      const was = prev[sec].find((i) => i.id === id)?.done;
      const now = !was;

      if (now) {
        const secDone = nextSec.filter((i) => i.done).length;
        const secTotal = nextSec.length;
        const pct = secTotal ? Math.round((secDone / secTotal) * 100) : 0;
        toast(`Tarefa concluída • ${sec}: ${pct}%`);

        const updatedCount = doneCount + 1;
        setDoneCount(updatedCount);
        if (updatedCount % 5 === 0 && typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("m360:win", { detail: { type: "badge", name: "Organizada" } })
          );
        }
      } else {
        toast("Tarefa desmarcada");
      }

      return next;
    });
  }

  const tabs = useMemo(
    () => [
      { id: "casa",   title: "Casa"   },
      { id: "filhos", title: "Filhos" },
      { id: "eu",     title: "Eu"     },
    ],
    []
  );

  const [active, setActive] = useState("casa");

  return (
    <main className="min-h-screen bg-gradient-to-b from-brand-soft to-white pb-28">
      <header className="mx-auto max-w-5xl px-5 pt-6 flex items-center justify-between">
        <h1 className="text-[28px] md:text-[32px] font-semibold text-brand-navy">Planner da Família</h1>
        <Link href="/meu-dia" className="rounded-full bg-white px-4 py-1.5 text-sm ring-1 ring-black/5 shadow-sm">
          ← Meu Dia
        </Link>
      </header>

      <section className="mx-auto max-w-5xl px-5 pt-5">
        {/* Tabs */}
        <div className="bg-white rounded-2xl ring-1 ring-black/5 inline-flex p-1 shadow-sm">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`px-4 py-2 text-sm rounded-xl ${
                active === t.id ? "bg-[--brand] text-white" : "text-brand-navy"
              }`}
              style={{ "--brand": "#ff005e" }}
            >
              {t.title}
            </button>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4">
          {active === "casa"   && <Section name="Casa"   items={data.casa}   onToggle={(id) => toggleIn("casa", id)} />}
          {active === "filhos" && <Section name="Filhos" items={data.filhos} onToggle={(id) => toggleIn("filhos", id)} />}
          {active === "eu"     && <Section name="Eu"     items={data.eu}     onToggle={(id) => toggleIn("eu", id)} />}
        </div>
      </section>
    </main>
  );
}
