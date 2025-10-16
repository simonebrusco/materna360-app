// app/cuidar/page.jsx
"use client";

import Link from "next/link";

const FIXED = [
  {
    id: "meditar",
    title: "Meditar",
    desc: "Áudios curtos para acalmar",
    href: "/cuidar/meditar",
    emoji: "🧘",
  },
  {
    id: "respirar",
    title: "Respirar",
    desc: "Micro pausas guiadas",
    href: "/cuidar/respirar",
    emoji: "🌬️",
  },
  {
    id: "alegrar",
    title: "Alegrar",
    desc: "Pílulas positivas",
    href: "/cuidar/alegrar",
    emoji: "🎵",
  },
];

const SESSOES = [
  {
    id: "receitas",
    title: "Receitas da Semana",
    desc: "Leves, rápidas e afetivas",
    href: "/cuidar/receitas", // crie depois se quiser
    emoji: "🍳",
  },
  {
    id: "organizacao",
    title: "Dicas de Organização",
    desc: "Hacks práticos da rotina",
    href: "/cuidar/organizacao", // crie depois se quiser
    emoji: "🧺",
  },
  {
    id: "tempo-voce",
    title: "Tempo para Você",
    desc: "Atividades curtas de autocuidado",
    href: "/cuidar/tempo-voce", // crie depois se quiser
    emoji: "💗",
  },
];

export default function CuidarPage() {
  return (
    <main className="max-w-5xl mx-auto px-5 py-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-semibold">Cuidar</h1>
          <p className="text-sm text-slate-500">Acolhimento, respiração e pausas que cabem no seu dia.</p>
        </div>
        <Link href="/meu-dia" className="btn bg-white border border-slate-200">← Meu Dia</Link>
      </header>

      {/* Cards fixos */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {FIXED.map((c) => (
          <Link key={c.id} href={c.href} className="card hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="text-3xl">{c.emoji}</div>
              <div>
                <div className="font-semibold">{c.title}</div>
                <div className="text-sm text-slate-600">{c.desc}</div>
              </div>
            </div>
          </Link>
        ))}
      </section>

      {/* Sessões complementares */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {SESSOES.map((c) => (
          <Link key={c.id} href={c.href} className="card hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="text-3xl">{c.emoji}</div>
              <div>
                <div className="font-semibold">{c.title}</div>
                <div className="text-sm text-slate-600">{c.desc}</div>
              </div>
            </div>
          </Link>
        ))}
      </section>

      {/* Profissionais de Apoio (Mentoria) — ✅ CARD/BOTÃO */}
      <section className="card">
        <div className="flex items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="text-3xl">🤝</div>
            <div>
              <h2 className="text-lg font-semibold">Profissionais de Apoio</h2>
              <p className="text-sm text-slate-600">
                Encontre especialista para acolhimento e orientação personalizada.
              </p>
            </div>
          </div>
          <Link href="/cuidar/mentoria" className="btn btn-primary">
            Abrir Mentoria
          </Link>
        </div>
        <div className="mt-3 text-sm text-slate-500">
          Pedagoga parental, Psicóloga e Psicopedagoga — atendimento por WhatsApp.
        </div>
      </section>
    </main>
  );
}
