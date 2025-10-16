"use client";

import Link from "next/link";

export default function ProgramaDia({ params }) {
  const { slug, day } = params;

  return (
    <main className="mx-auto max-w-md px-4 py-6">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dia {day}</h1>
          <p className="text-sm text-slate-500">Programa: {slug}</p>
        </div>
        <Link href={`/programas/${slug}`} className="text-sm rounded-lg border px-3 py-1.5 bg-white">
          ← Voltar
        </Link>
      </header>

      <section className="rounded-2xl bg-white ring-1 ring-black/5 shadow-sm p-4 space-y-2">
        <h3 className="font-medium">Conteúdo do dia</h3>
        <p className="text-sm text-slate-600">
          (Placeholder) Aqui vai o áudio, a leitura rápida e a micro-tarefa do dia.
        </p>
      </section>
    </main>
  );
}
