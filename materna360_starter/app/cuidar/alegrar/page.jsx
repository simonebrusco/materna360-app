// materna360_starter/app/cuidar/alegrar/page.jsx
"use client";

import { useMemo, useState } from "react";
import { getJSON, setJSON } from "../../../lib/storage";
import { toast } from "../../../lib/toast";

const PHRASES = [
  "Você está fazendo um trabalho incrível 💛",
  "Hoje, celebre um pequeno passo.",
  "Seu cuidado também merece prioridade.",
  "Tudo bem pedir ajuda. Você não está só.",
  "Um minuto de respiro já muda o dia.",
  "Gentileza com você mesma é força.",
];

function saveGratitude(text) {
  const key = "gratitudes";
  const arr = getJSON(key) || [];
  const item = { text, date: new Date().toISOString() };
  setJSON(key, [item, ...arr].slice(0, 50)); // limita a 50 recentes
}

export default function AlegrarPage() {
  const [index, setIndex] = useState(0);
  const phrase = useMemo(() => PHRASES[index % PHRASES.length], [index]);

  function next() {
    setIndex((i) => i + 1);
  }

  function save() {
    saveGratitude(phrase);
    try {
      window.dispatchEvent(
        new CustomEvent("m360:win", {
          detail: { type: "badge", name: "Cuidar de Mim" },
        })
      );
    } catch {}
    toast("Salvo no Eu360 (Gratidões) ✨", { icon: "💛" });
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold text-[#2f3a56]">Alegrar</h1>
      <p className="text-sm text-[#545454] mt-1">
        Pílulas positivas para aquecer o coração.
      </p>

      <div className="mt-5 rounded-2xl bg-white ring-1 ring-black/5 shadow-sm p-5">
        <p className="text-lg text-[#2f3a56]">{phrase}</p>

        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={next}
            className="rounded-xl px-4 py-2 ring-1 ring-black/10 bg-white"
          >
            Outra frase
          </button>
          <button
            onClick={save}
            className="rounded-xl px-4 py-2 text-white"
            style={{ backgroundColor: "#ff005e" }}
          >
            Salvar no Eu360
          </button>
        </div>
      </div>
    </main>
  );
}
