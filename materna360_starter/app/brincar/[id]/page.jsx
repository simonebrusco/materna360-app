"use client";

import Link from "next/link";
import { useMemo } from "react";
import SaveToPlannerButton from "@/components/SaveToPlannerButton";

/**
 * Página de detalhes da atividade.
 * Não depende de lib/activities: usa catálogo interno mínimo e aceita query params (?title=&desc=&age=&time=)
 * Ex.: /brincar/bolhas?title=Bolhas de sabão&desc=Brincar no quintal&age=2-4&time=10
 */

const CATALOG_MIN = {
  // catálogo mínimo para fallback (adicione conforme usar)
  bolhas: {
    title: "Bolhas de sabão no quintal",
    desc: "Prepare uma mistura simples e brinquem de estourar e perseguir bolhas. Trabalha coordenação e atenção.",
    age: "2-4",
    time: 10,
  },
  tesouro: {
    title: "Caça ao tesouro em casa",
    desc: "Esconda 5 objetos simples e crie pistas em desenho. Estimula curiosidade e resolução de problemas.",
    age: "3-6",
    time: 15,
  },
};

function getParam(searchParams, key, fallback = "") {
  const v = searchParams.get(key);
  return v !== null ? v : fallback;
}

export default function ActivityDetail({ params, searchParams }) {
  const id = params?.id || "atividade";
  // next 14+ passa URLSearchParams em props; se não, reconstruímos
  const sp = useMemo(() => {
    try {
      if (searchParams && typeof searchParams.get === "function") return searchParams;
      // compat: cria a partir de window.location (client)
      const url = typeof window !== "undefined" ? new URL(window.location.href) : null;
      return url ? url.searchParams : new URLSearchParams();
    } catch {
      return new URLSearchParams();
    }
  }, [searchParams]);

  const fallback = CATALOG_MIN[id] || {
    title: `Atividade: ${id}`,
    desc: "Descrição breve da atividade.",
    age: "livre",
    time: 10,
  };

  const title = getParam(sp, "title", fallback.title);
  const desc = getParam(sp, "desc", fallback.desc);
  const age = getParam(sp, "age", fallback.age);
  const time = parseInt(getParam(sp, "time", String(fallback.time)), 10) || fallback.time;

  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-100 to-rose-50">
      <header className="mx-auto max-w-4xl px-5 pt-6 flex items-center justify-between">
        <Link href="/meu-dia" className="rounded-full bg-white px-4 py-1.5 text-sm ring-1 ring-black/5 shadow-sm">
          ← Meu Dia
        </Link>
        <Link href="/brincar" className="rounded-full bg-white px-4 py-1.5 text-sm ring-1 ring-black/5 shadow-sm">
          Brincar
        </Link>
      </header>

      <section className="mx-auto max-w-4xl px-5 pt-6 pb-24">
        <div className="rounded-2xl bg-white ring-1 ring-black/5 shadow-sm p-5 md:p-6">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1A2240]">{title}</h1>

          <div className="mt-2 flex flex-wrap gap-2 text-sm">
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 text-rose-700 px-3 py-1 ring-1 ring-rose-200">
              ⏱️ {time} min
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 text-sky-700 px-3 py-1 ring-1 ring-sky-200">
              👶 {age} anos
            </span>
          </div>

          <p className="mt-4 text-[#1A2240]/80">{desc}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <SaveToPlannerButton title={title} />
            <Link
              href="/meu-dia/planner"
              className="px-4 py-2 rounded-xl bg-white border border-slate-200"
            >
              Abrir Planner
            </Link>
          </div>

          <hr className="my-6 border-black/10" />

          <div className="text-sm text-slate-600 space-y-2">
            <p><strong>Dicas rápidas:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Separe materiais antes de chamar a criança.</li>
              <li>Mantenha a atividade em blocos curtos (5–10 min) e observe o interesse.</li>
              <li>Feche com um elogio específico (o que a criança fez bem).</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
