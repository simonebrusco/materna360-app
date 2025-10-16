"use client";

import { useState } from "react";
import Link from "next/link";
import { getJSON, setJSON } from "../../../lib/storage";
import { toast } from "../../../lib/toast";

const PHRASES = [
  "Eu me acolho com gentileza.",
  "Estou aprendendo e isso é lindamente suficiente.",
  "Respiro, desacelero e sigo no meu ritmo.",
  "Meu cuidado também é prioridade.",
  "Hoje, celebro minhas pequenas vitórias.",
];

export default function AlegrarPage() {
  const [text, setText] = useState(PHRASES[Math.floor(Math.random() * PHRASES.length)]);

  function saveGratitude() {
    const list = getJSON("m360:gratitudes") ?? [];
    const next = [{ id: crypto.randomUUID(), text, date: new Date().toISOString() }, ...list].slice(0, 50);
    setJSON("m360:gratitudes", next);
    window.dispatchEvent(new CustomEvent("m360:win", { detail: { type: "badge", name: "CuidarDeMim" } }));
    toast("Salvo no Eu360 💛");
  }

  return (
    <main className="max-w-3xl mx-auto px-5 py-6">
      <header className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-semibold">Alegrar</h1>
        <Link href="/cuidar" className="btn bg-white border border-slate-200">← Voltar</Link>
      </header>

      <div className="rounded-2xl bg-white ring-1 ring-black/5 p-5">
        <div className="text-lg">{text}</div>
        <div className="mt-4 flex gap-2">
          <button onClick={() => setText(PHRASES[Math.floor(Math.random() * PHRASES.length)])}
                  className="rounded-xl bg-white ring-1 ring-black/5 px-4 py-2">Outra</button>
          <button onClick={saveGratitude} className="rounded-xl bg-[#F15A2E] text-white px-4 py-2">
            Salvar no Eu360
          </button>
        </div>
      </div>
    </main>
  );
}
