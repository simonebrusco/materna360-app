"use client";

import { useState } from "react";
import Link from "next/link";

const PHRASES = [
  "Hoje eu me permito desacelerar.",
  "Sou gentil comigo mesma.",
  "Pequenos passos, grandes mudanças.",
  "Eu estou aprendendo e tudo bem.",
  "Eu me acolho com carinho.",
];

const G_KEY = "m360:gratitudes";

function pick() {
  const i = (new Date().getMinutes() + new Date().getSeconds()) % PHRASES.length;
  return PHRASES[i];
}

export default function AlegrarPage() {
  const [text, setText] = useState(pick());
  const [toast, setToast] = useState("");

  function save() {
    try {
      const raw = localStorage.getItem(G_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      const item = { text, date: new Date().toISOString() };
      localStorage.setItem(G_KEY, JSON.stringify([item, ...arr].slice(0, 50)));
      // badge opcional — também conta como autocuidado
      window.dispatchEvent(new CustomEvent("m360:win", { detail: { type: "badge", name: "Cuidar de Mim" } }));
      setToast("Salvo no Eu360 💛");
      setTimeout(() => setToast(""), 2000);
    } catch {
      /* noop */
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-5 py-6">
      <header className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-semibold">Alegrar</h1>
          <p className="text-sm text-slate-500">Pílulas positivas</p>
        </div>
        <Link href="/cuidar" className="rounded-xl bg-white ring-1 ring-black/5 px-3 py-1.5">← Cuidar</Link>
      </header>

      <section className="rounded-2xl bg-white ring-1 ring-black/5 p-5 text-center">
        <p className="text-lg leading-relaxed">{text}</p>
        <div className="mt-4 flex gap-3 justify-center">
          <button onClick={() => setText(pick())} className="rounded-xl bg-white ring-1 ring-black/5 px-3 py-1.5">
            Outra
          </button>
          <button onClick={save} className="rounded-xl bg-[#ff005e] text-white px-3 py-1.5">
            Salvar no Eu360
          </button>
        </div>
      </section>

      {toast && (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-24 z-50 rounded-xl bg-black/80 text-white px-4 py-2 text-sm">
          {toast}
        </div>
      )}
    </main>
  );
}
