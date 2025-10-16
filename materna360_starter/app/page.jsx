"use client"; // ✅ deve ser a primeira linha do arquivo

// Corrige erro "Invalid revalidate value '[object Object]'"
export const revalidate = 0;

import { useEffect, useState } from "react";

function Card({ title, emoji, subtitle, href = "#" }) {
  return (
    <a
      href={href}
      className="block rounded-2xl p-4 bg-white shadow-sm ring-1 ring-black/5 hover:shadow-md transition-shadow min-h-[120px]"
    >
      <div className="flex items-start justify-between">
        <span className="text-2xl">{emoji}</span>
      </div>
      <h3 className="mt-3 font-semibold text-[#1A2240]">{title}</h3>
      {subtitle ? (
        <p className="mt-1 text-sm text-[#1A2240]/60">{subtitle}</p>
      ) : null}
    </a>
  );
}

export default function Home() {
  const [greet, setGreet] = useState("Olá");
  const [name, setName] = useState("Mamãe");

  useEffect(() => {
    const hour = new Date().getHours();
    setGreet(hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite");

    const stored =
      typeof window !== "undefined"
        ? localStorage.getItem("m360:userName")
        : null;
    if (stored) setName(stored);
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 space-y-6">
      <section className="mt-2">
        <h1 className="text-xl font-medium text-[#1A2240]">
          {greet}, {name}!{" "}
          <span className="text-[#1A2240]/60 text-base">
            Como posso te ajudar hoje?
          </span>
        </h1>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card
          emoji="🏠"
          title="Rotina da Casa"
          subtitle="Organize tarefas do lar"
          href="/atividades?tab=rotina"
        />
        <Card
          emoji="💕"
          title="Tempo com Meu Filho"
          subtitle="Registre momentos especiais"
          href="/atividades?tab=momentos"
        />
        <Card
          emoji="🎨"
          title="Atividade do Dia"
          subtitle="Sugestões educativas"
          href="/atividades?tab=atividade"
        />
        <Card
          emoji="🌿"
          title="Momento para Mim"
          subtitle="Pausas e autocuidado"
          href="/bem-estar"
        />
      </section>
    </div>
  );
}
