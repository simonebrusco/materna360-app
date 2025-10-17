// materna360_starter/app/cuidar/page.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import AppBar from "../../components/AppBar.jsx";
import GlassCard from "../../components/GlassCard.jsx";
import QuickNote from "../../components/QuickNote.jsx";
import { addPlannerItem } from "../../lib/planner.js";

function Tile({ href, emoji, title, desc }) {
  return (
    <Link href={href} className="block">
      <GlassCard className="p-4 hover:shadow-lg transition-shadow">
        <div className="flex items-start gap-3">
          <div className="text-2xl leading-none">{emoji}</div>
          <div>
            <div className="font-semibold">{title}</div>
            {desc ? <p className="text-sm text-[var(--brand-navy-t60)] mt-0.5">{desc}</p> : null}
          </div>
        </div>
      </GlassCard>
    </Link>
  );
}

export default function CuidarPage() {
  // FAB “＋ Anotar” -> salva no Planner (Eu)
  const [noteOpen, setNoteOpen] = useState(false);

  function handleSaveNote(text) {
    const value = (text || "").trim();
    if (!value) {
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("m360:toast", { detail: { message: "Escreva algo para salvar ✍️" } })
        );
      }
      return;
    }

    addPlannerItem("eu", value);

    if (typeof window !== "undefined") {
      // toast + badge
      window.dispatchEvent(
        new CustomEvent("m360:toast", { detail: { message: "Anotado no Planner (Eu) 💾" } })
      );
      window.dispatchEvent(
        new CustomEvent("m360:win", { detail: { type: "badge", name: "Cuidar de Mim" } })
      );
    }

    setNoteOpen(false);
  }

  return (
    <main className="max-w-5xl mx-auto px-5 py-6">
      <AppBar title="Cuidar" />

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <Tile
          href="/cuidar/meditar"
          emoji="🧘‍♀️"
          title="Meditar"
          desc="Sessões curtas para acalmar e recentrar"
        />
        <Tile
          href="/cuidar/respirar"
          emoji="🌬️"
          title="Respirar"
          desc="Timer guiado de 60s para seguir no ritmo"
        />
        <Tile
          href="/cuidar/alegrar"
          emoji="🌈"
          title="Alegrar"
          desc="Pílulas positivas — guarde no Eu360"
        />
        <Tile
          href="/cuidar/mentoria"
          emoji="💬"
          title="Mentoria"
          desc="Fale com especialistas no WhatsApp"
        />
      </section>

      {/* Seções de conteúdo rápidas (mock) */}
      <section className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard className="p-4">
          <div className="font-semibold">Receitas da Semana</div>
          <p className="subtitle mt-1">Ideias práticas e nutritivas</p>
          <ul className="list-disc pl-5 text-sm mt-3 space-y-1">
            <li>Crepioca de banana (10 min)</li>
            <li>Penna ao molho de tomate rústico</li>
            <li>Arroz colorido (legumes picados)</li>
          </ul>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="font-semibold">Dicas de Organização</div>
          <p className="subtitle mt-1">Passos simples para a casa fluir</p>
          <ul className="list-disc pl-5 text-sm mt-3 space-y-1">
            <li>Caixa de entrada da bancada (5 min)</li>
            <li>Mini-rotina de prateleira (1 por dia)</li>
            <li>Checklist pós-jantar (3 itens)</li>
          </ul>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="font-semibold">Tempo para Você</div>
          <p className="subtitle mt-1">Micropausas que cabem no dia</p>
          <ul className="list-disc pl-5 text-sm mt-3 space-y-1">
            <li>Respirar 60s após o café</li>
            <li>Áudio de 3 min antes de dormir</li>
            <li>Alongar pescoço e ombros</li>
          </ul>
        </GlassCard>
      </section>

      {/* FAB “＋ Anotar” */}
      <button
        onClick={() => setNoteOpen(true)}
        aria-label="Adicionar anotação"
        className="fixed right-5 bottom-24 z-[60] rounded-full shadow-lg h-14 w-14 text-2xl
                   bg-[var(--brand)] text-white hover:scale-105 active:scale-95 transition grid place-items-center"
      >
        ＋
      </button>

      {/* Composer de nota */}
      {noteOpen && (
        <QuickNote
          title="Nova anotação"
          placeholder="Ex.: 10 min de respiração, alongar, beber água…"
          confirmLabel="Salvar no Planner (Eu)"
          onSave={handleSaveNote}
          onClose={() => setNoteOpen(false)}
        />
      )}
    </main>
  );
}
