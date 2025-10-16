// materna360_starter/app/cuidar/alegrar/page.jsx
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { get, set } from "../../../lib/storage";
import { toast } from "../../../lib/toast";

const K_GRATS = "m360:gratitudes";

const PHRASES = [
  "Sou uma mãe suficiente para o que meu filho precisa hoje.",
  "Respiro fundo e sigo no meu ritmo.",
  "Pequenos passos também são progresso.",
  "Hoje escolho ser gentil comigo mesma.",
  "Eu mereço pausas, carinho e cuidado.",
];

function pick() {
  const i = Math.floor(Math.random() * PHRASES.length);
  return PHRASES[i];
}

export default function AlegrarPage() {
  const [phrase, setPhrase] = useState(() => pick());
  const canShuffle = useMemo(() => PHRASES.length > 1, []);

  function shuffle() {
    let next = pick();
    // evita repetir a mesma imediatamente
    if (PHRASES.length > 1 && next === phrase) next = pick();
    setPhrase(next);
  }

  function save() {
    const current = get(K_GRATS, []);
    const next = [{ text: phrase, date: new Date().toISOString() }, ...current].slice(0, 50);
    set(K_GRATS, next);
    toast("Salvo no Eu360 (Gratidão) ✨");
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("m360:win", { detail: { type: "badge", name: "Cuidar de Mim" } }));
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-brand-soft to-white">
      <header className="mx-auto max-w-5xl px-5 pt-6 flex items-center justify-between">
        <h1 className="text-[28px] md:text-[32px] font-semibold text-brand-navy">Alegrar</h1>
        <Link href="/cuidar" className="rounded-full bg-white px-4 py-1.5 text-sm ring-1 ring-black/5 shadow-sm">
          ← Voltar
        </Link>
      </header>

      <section className="mx-auto max-w-3xl px-5 pt-10 pb-28">
        <div className="rounded-3xl bg-white ring-1 ring-black/5 shadow-sm p-8 md:p-10 text-center">
          <div className="text-sm text-brand-navy/50 mb-2">Afeto do dia</div>
          <blockquote className="text-xl md:text-2xl leading-relaxed text-brand-navy">
            “{phrase}”
          </blockquote>

          <div className="mt-6 flex items-center justify-center gap-3">
            {canShuffle && (
              <button
                onClick={shuffle}
                className="rounded-xl px-4 py-2 text-sm ring-1 ring-black/10 bg-white"
              >
                Nova frase
              </button>
            )}
            <button
              onClick={save}
              className="rounded-xl px-4 py-2 text-sm text-white"
              style={{ backgroundColor: "#ff005e" }}
            >
              Salvar no Eu360
            </button>
          </div>

          <p className="mt-6 text-brand-navy/60">
            Ao salvar, a frase entra na sua lista de Gratidão no Eu360.
          </p>
        </div>
      </section>
    </main>
  );
}
