// materna360_starter/app/eu360/page.jsx
"use client";

import Link from "next/link";

export default function Eu360SafePage() {
  return (
    <main className="max-w-5xl mx-auto px-5 py-6">
      <div className="rounded-2xl bg-gradient-to-b from-rose-100 to-rose-50 ring-1 ring-black/5 p-5 mb-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Eu360</h1>
            <p className="text-slate-600">Área em manutenção rápida. Voltamos já 💛</p>
          </div>
          <Link href="/meu-dia" className="btn bg-white border border-slate-200">
            ← Meu Dia
          </Link>
        </div>
      </div>

      <section className="card">
        <p className="text-sm text-slate-600">
          Mantivemos o app inteiro estável enquanto ajustamos esta aba.
        </p>
      </section>
    </main>
  );
}
