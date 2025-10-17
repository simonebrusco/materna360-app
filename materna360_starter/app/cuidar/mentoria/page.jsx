// app/cuidar/mentoria/page.jsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

const PROS = [
  {
    id: "pedagoga-parental",
    name: "Pedagoga Parental",
    role: "Educação e comportamento infantil",
    roleKey: "pedagogia",
    bio: "Apoio prático para rotina, limites com afeto e desenvolvimento por brincadeiras.",
    wa: "https://wa.me/5599999999999",
    emoji: "👩‍🏫",
  },
  {
    id: "psicologa",
    name: "Psicóloga",
    role: "Saúde emocional da mãe",
    roleKey: "psicologia",
    bio: "Escuta acolhedora, manejo de estresse materno e fortalecimento de rede de apoio.",
    wa: "https://wa.me/5599999999999",
    emoji: "🧠",
  },
  {
    id: "psicopedagoga",
    name: "Psicopedagoga",
    role: "Aprendizagem e linguagem",
    roleKey: "psicopedagogia",
    bio: "Dificuldades de aprendizagem, estimulação lúdica e comunicação família-escola.",
    wa: "https://wa.me/5599999999999",
    emoji: "📚",
  },
];

const PACKS = [
  { id: "p1", sessions: 1,  label: "1 sessão"  },
  { id: "p3", sessions: 3,  label: "3 sessões" },
  { id: "p10", sessions: 10, label: "10 sessões" },
];

function buildWAUrl(base, proName, packSessions) {
  const txt = `Olá! Vim do Materna360 e gostaria de agendar ${packSessions} sessão(ões) com ${proName}.`;
  const params = `?text=${encodeURIComponent(txt)}`;
  return `${base}${base.includes("?") ? "&" : "?"}${params.replace("?", "")}`;
}

function ProfessionalCard({ p, selectedPack }) {
  function onClick() {
    // badge: Conectada
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("m360:win", {
          detail: { type: "badge", name: "Conectada" },
        })
      );
    }
    const url = buildWAUrl(p.wa, p.name, selectedPack);
    window.open(url, "_blank", "noopener,noreferrer");
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
      <div className="flex justify-between items-center gap-3">
        <div className="text-xs text-slate-500">Pacote: <b>{selectedPack}</b></div>
        <button onClick={onClick} className="btn btn-primary">Falar no WhatsApp</button>
      </div>
    </div>
  );
}

export default function MentoriaPage() {
  const [roleFilter, setRoleFilter] = useState("todas");
  const [pack, setPack] = useState(1);

  const roles = useMemo(() => {
    const map = new Map();
    PROS.forEach(p => map.set(p.roleKey, p.role));
    return Array.from(map.entries()); // [ [key, label], ... ]
  }, []);

  const filtered = useMemo(() => {
    if (roleFilter === "todas") return PROS;
    return PROS.filter(p => p.roleKey === roleFilter);
  }, [roleFilter]);

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

      {/* Filtros */}
      <section className="card mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <div>
            <label className="text-xs uppercase tracking-wide text-slate-500">Especialidade</label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white"
            >
              <option value="todas">Todas</option>
              {roles.map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs uppercase tracking-wide text-slate-500">Pacote</label>
            <div className="mt-1 flex gap-2">
              {PACKS.map(pk => (
                <button
                  key={pk.id}
                  onClick={() => setPack(pk.sessions)}
                  className={`px-3 py-2 rounded-xl text-sm ring-1 ring-black/10 ${
                    pack === pk.sessions ? "bg-[#ffd8e6] text-[#1A2240]" : "bg-white"
                  }`}
                >
                  {pk.label}
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs text-slate-500">
            Escolha a especialidade e o pacote. Você combina direto pelo WhatsApp.
          </div>
        </div>
      </section>

      {/* Lista de profissionais */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((p) => (
          <ProfessionalCard key={p.id} p={p} selectedPack={pack} />
        ))}
      </section>

      <section className="card mt-5">
        <h3 className="font-semibold mb-1">Como funciona?</h3>
        <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
          <li>Você clica em “Falar no WhatsApp” e combina direto com a especialista.</li>
          <li>Escolha 1, 3 ou 10 sessões. A confirmação e valores são combinados no WhatsApp.</li>
          <li>Na etapa 2: agendamento nativo e histórico de atendimentos.</li>
        </ul>
      </section>
    </main>
  );
}
