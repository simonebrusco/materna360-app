"use client";

import Link from "next/link";

const PROGRAMS = [
  { slug: "bem-estar-7d", name: "Bem-estar em 7 dias", desc: "Pausas curtas e cuidado diário." },
  { slug: "rotina-leve-14d", name: "Rotina Leve 14 dias", desc: "Casa, filhos e você — no seu ritmo." },
];

export default function ProgramasIndex() {
  return (
    <main className="mx-auto max-w-md px-4 py-6">
      <header className="mb-4">
        <h1 className="text-2xl font-semibold">Programas</h1>
        <p className="text-sm text-slate-500">Séries guiadas (7/14/21 dias).</p>
      </header>

      <div className="space-y-3">
        {PROGRAMS.map((p) => (
          <Link
            key={p.slug}
            href={`/programas/${p.slug}`}
            className="block rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-4 hover:shadow-md transition-shadow"
          >
            <div className="font-medium">{p.name}</div>
            <div className="text-sm text-slate-600">{p.desc}</div>
          </Link>
        ))}
      </div>
    </main>
  );
}
