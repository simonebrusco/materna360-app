"use client";

import Link from "next/link";

const PROGRAM_META = {
  "bem-estar-7d": { days: 7, title: "Bem-estar em 7 dias" },
  "rotina-leve-14d": { days: 14, title: "Rotina Leve 14 dias" },
};

export default function ProgramaDetalhe({ params }) {
  const { slug } = params;
  const meta = PROGRAM_META[slug] || { days: 7, title: "Programa" };

  const days = Array.from({ length: meta.days }, (_, i) => i + 1);

  return (
    <main className="mx-auto max-w-md px-4 py-6">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{meta.title}</h1>
          <p className="text-sm text-slate-500">{meta.days} dias</p>
        </div>
        <Link href="/programas" className="text-sm rounded-lg border px-3 py-1.5 bg-white">
          ← Voltar
        </Link>
      </header>

      <div className="grid grid-cols-3 gap-3">
        {days.map((d) => (
          <Link
            key={d}
            href={`/programas/${slug}/dia/${d}`}
            className="rounded-xl bg-white shadow-sm ring-1 ring-black/5 p-4 text-center hover:shadow-md"
          >
            <div className="text-xs text-slate-500">Dia</div>
            <div className="text-lg font-semibold">{d}</div>
          </Link>
        ))}
      </div>
    </main>
  );
}
