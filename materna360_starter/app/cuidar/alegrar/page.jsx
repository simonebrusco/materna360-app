"use client";

import { useMemo, useState } from "react";
import AppBar from "../../../components/AppBar";
import GlassCard from "../../../components/GlassCard";
import { get, set, keys } from "../../../lib/storage";

const PHRASES = [
  "Hoje eu me acolho com carinho.",
  "Eu estou aprendendo e evoluindo.",
  "Sou suficiente para o meu filho e para mim.",
  "Respiro, pauso e sigo mais leve.",
  "Pequenas alegrias fazem grandes dias."
];

export default function AlegrarPage() {
  const [saved, setSaved] = useState(false);
  const phrase = useMemo(() => {
    const seed = Math.floor((Date.now() / (1000 * 60)) % PHRASES.length);
    return PHRASES[seed];
  }, []);

  function saveToGratitude() {
    const k = keys.gratitudes || "m360:gratitudes";
    const list = get(k, []);
    const next = [{ text: phrase, date: new Date().toISOString() }, ...list];
    set(k, next);
    setSaved(true);

    // badge de autocuidado
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("m360:win", {
        detail: { type: "badge", name: "Cuidar de Mim" }
      }));
    }
  }

  return (
    <main className="max-w-5xl mx-auto px-5 pb-24">
      <AppBar title="Alegrar" backHref="/cuidar" />
      <div className="container-px py-6 space-y-4">
        <GlassCard className="p-6">
          <div className="text-sm opacity-70 mb-1">Pílula positiva</div>
          <p className="text-lg leading-snug">{phrase}</p>

          <div className="mt-4">
            <button
              onClick={saveToGratitude}
              className="btn btn-primary"
              disabled={saved}
            >
              {saved ? "Salvo no Eu360 ✓" : "Salvar no Eu360"}
            </button>
          </div>
        </GlassCard>
      </div>
    </main>
  );
}
