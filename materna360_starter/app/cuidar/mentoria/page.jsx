// app/cuidar/mentoria/page.jsx
"use client";

import Link from "next/link";

const PROS = [
  {
    id: "pedagoga-parental",
    name: "Pedagoga Parental",
    role: "Educação e comportamento infantil",
    bio: "Apoio prático para rotina, limites com afeto e desenvolvimento por brincadeiras.",
    // ⬇️ troque pelo número oficial (formato: 55DDDNÚMERO sem + ou espaços)
    wa: "https://wa.me/5599999999999?text=Ol%C3%A1!%20Vim%20do%20Materna360%20e%20gostaria%20de%20agendar%20um%20atendimento.",
    emoji: "👩‍🏫",
  },
  {
    id: "psicologa",
    name: "Psicóloga",
    role: "Saúde emocional da mãe",
    bio: "Escuta acolhedora, manejo de estresse materno e fortalecimento de rede de apoio.",
    wa: "https://wa.me/5599999999999?text=Ol%C3%A1!%20Vim%20do%20Materna360%20e%20gostaria%20de%20agendar%20um%20atendimento.",
    emoji: "🧠",
  },
  {
    id: "psicopedagoga",
    name: "Psicopedagoga",
    role: "Aprendizagem e linguagem",
    bio: "Dificuldades de aprendizagem, estimulação lúdica e comunicação família-escola.",
    wa: "https://wa.me/5599999999999?text=Ol%C3%A1!%20Vim%20do%20Materna360%20e%20gostaria%20de%20agendar%20um%20atendimento.",
    emoji: "📚",
  },
];

function ProfessionalCard({ p }) {
  function onClick() {
    // badge: Conectada
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("m360:win", {
          detail: { type: "badge", name: "Conectada" },
        })
      );
    }
    window.open(p.wa, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <div className="text-3xl">{p.emoji}</div>
        <div>
          <div className="text-base font-semibold">{p.name}</div>
          <div className="text-sm text-slate-500">{p.role}</div>
        </div>
      </div>
      <p className="text-sm text-slate-600">{p.bio}</p>
      <div className="flex justify-end">
        <button onClick={onClick} className="btn btn-primary">Falar no WhatsApp</button>
      </div>
    </div>
  );
}

export default function MentoriaPage() {
  return (
    <main className="max-w-5xl mx-auto px-5 py-6">
      <header className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-semibold">Mentoria Materna360</h1>
          <p className="text-sm text-slate-500">
            Especialistas prontos para acolher e orientar você 💛
          </p>
        </div>
        <Link href="/cuidar" className="btn bg-white border border-slate-200">← Voltar</Link>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PROS.map((p) => <ProfessionalCard key={p.id} p={p} />)}
      </section>

      <section className="card mt-5">
        <h3 className="font-semibold mb-1">Como funciona?</h3>
        <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
          <li>Você clica em “Falar no WhatsApp” e combina direto com a especialista.</li>
          <li>Na etapa 2: agendamento nativo e histórico de atendimentos.</li>
        </ul>
      </section>
    </main>
  );
}
