// app/cuidar/page.jsx
"use client";

import Link from "next/link";

function Card({ href, emoji, title, subtitle }) {
  return (
    <Link
      href={href}
      className="block rounded-2xl bg-white ring-1 ring-black/5 shadow-sm hover:shadow-md transition p-5"
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl">{emoji}</div>
        <div>
          <div className="text-base font-semibold text-[#1A2240]">{title}</div>
          <div className="text-sm text-[#1A2240]/60">{subtitle}</div>
        </div>
      </div>
    </Link>
  );
}

export default function CuidarPage() {
  return (
    <main className="max-w-5xl mx-auto px-5 py-6">
      <header className="mb-4">
        <h1 className="text-2xl font-semibold">Cuidar</h1>
        <p className="text-sm text-slate-500">
          Acolhimento, respiração e pausas que cabem no seu dia.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card
          href="/cuidar/meditar"
          emoji="🧘"
          title="Meditar"
          subtitle="Áudios curtos para acalmar"
        />
        <Card
          href="/cuidar/respirar"
          emoji="🫁"
          title="Respirar"
          subtitle="Micro pausas guiadas"
        />
        <Card
          href="/cuidar/alegrar"
          emoji="🎵"
          title="Alegrar"
          subtitle="Pílulas positivas"
        />
        <Card
          href="#"
          emoji="🍲"
          title="Receitas da Semana"
          subtitle="Leves, rápidas e afetivas"
        />
        <Card
          href="#"
          emoji="🧺"
          title="Dicas de Organização"
          subtitle="Hacks práticos da rotina"
        />
        <Card
          href="#"
          emoji="💗"
          title="Tempo para Você"
          subtitle="Atividades curtas de autocuidado"
        />
      </section>

      <section className="card mt-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="font-semibold">Profissionais de Apoio</div>
            <p className="text-sm text-slate-500">
              Pedagoga parental, Psicóloga e Psicopedagoga — atendimento por WhatsApp.
            </p>
          </div>
          <Link href="/cuidar/mentoria" className="btn btn-primary">
            Abrir Mentoria
          </Link>
        </div>
      </section>
    </main>
  );
}
