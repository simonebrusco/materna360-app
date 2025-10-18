// app/brincar/page.jsx
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import activities, { toActivityHref } from "@/lib/activities/index.js";
import { filterByAge, filterByPlace } from "@/lib/activities/helpers.js";
import SaveToPlannerButton from "@/components/SaveToPlannerButton";

const AGE_OPTIONS = ["todas", "2-4", "3-6", "2-5", "livre"];
const PLACE_OPTIONS = ["todos", "casa", "fora"];

export default function BrincarPage() {
  const [age, setAge] = useState("todas");
  const [place, setPlace] = useState("todos");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    let list = activities;
    if (age !== "todas") list = filterByAge(list, age);
    if (place !== "todos") list = filterByPlace(list, place);
    if (q.trim()) {
      const term = q.toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(term) ||
          (a.desc || "").toLowerCase().includes(term)
      );
    }
    return list;
  }, [age, place, q]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-100 to-rose-50">
      <header className="mx-auto max-w-5xl px-5 pt-6 flex items-center justify-between">
        <Link
          href="/meu-dia"
          className="rounded-full bg-white px-4 py-1.5 text-sm ring-1 ring-black/5 shadow-sm"
        >
          ← Meu Dia
        </Link>
        <div className="text-sm md:text-base font-medium text-[#1A2240]/70">
          Brincar
        </div>
        <Link
          href="/"
          className="rounded-full bg-white px-4 py-1.5 text-sm ring-1 ring-black/5 shadow-sm"
        >
          Início
        </Link>
      </header>

      {/* Filtros */}
      <section className="mx-auto max-w-5xl px-5 pt-6">
        <div className="rounded-2xl bg-white ring-1 ring-black/5 shadow-sm p-4 md:p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-xs text-slate-600">Idade</span>
              <select
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="rounded-lg border p-2 bg-white"
              >
                {AGE_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-xs text-slate-600">Local</span>
              <select
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                className="rounded-lg border p-2 bg-white"
              >
                {PLACE_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1 md:col-span-1">
              <span className="text-xs text-slate-600">Buscar</span>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Ex.: bolhas, tesouro…"
                className="rounded-lg border p-2 bg-white"
              />
            </label>
          </div>
        </div>
      </section>

      {/* Lista */}
      <section className="mx-auto max-w-5xl px-5 pt-4 pb-28 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {filtered.map((a) => (
          <article
            key={a.id}
            className="rounded-2xl bg-white ring-1 ring-black/5 shadow-sm p-4 md:p-5 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-lg md:text-xl font-semibold text-[#1A2240]">
                {a.title}
              </h3>
              <p className="mt-2 text-sm text-[#1A2240]/70">{a.desc}</p>
            </div>

            <div className="mt-3 flex items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 text-rose-700 px-3 py-1 ring-1 ring-rose-200">
                ⏱️ {a.time} min
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 text-sky-700 px-3 py-1 ring-1 ring-sky-200">
                👶 {a.age} anos
              </span>
              {a.place ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 ring-1 ring-emerald-200">
                  📍 {a.place}
                </span>
              ) : null}
            </div>

            <div className="mt-4 flex gap-2">
              <Link
                href={toActivityHref(a)}
                className="px-4 py-2 rounded-xl bg-[#ff005e] text-white"
              >
                Abrir
              </Link>
              <SaveToPlannerButton
                title={a.title}
                label="Salvar"
                className="bg-white text-[#1A2240] border border-slate-200"
              />
              <Link
                href="/meu-dia/planner"
                className="px-4 py-2 rounded-xl bg-white border border-slate-200"
              >
                Planner
              </Link>
            </div>
          </article>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full rounded-2xl bg-white ring-1 ring-black/5 shadow-sm p-6 text-center text-slate-600">
            Nenhuma atividade encontrada com os filtros atuais.
          </div>
        )}
      </section>
    </main>
  );
}
