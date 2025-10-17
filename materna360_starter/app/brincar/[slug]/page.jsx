// materna360_starter/app/brincar/[slug]/page.jsx
"use client";

import Link from "next/link";
import { useMemo } from "react";

import AppBar from "../../../components/AppBar";
import GlassCard from "../../../components/GlassCard";

import * as Acts from "../../../lib/activities";
import { addPlannerItem } from "../../../lib/planner";
import { toast } from "../../../lib/toast";

const ACTIVITIES = Array.isArray(Acts.ACTIVITIES) ? Acts.ACTIVITIES : (Acts.activities || []);

function findBySlug(slug) {
  if (typeof Acts.getBySlug === "function") return Acts.getBySlug(slug) || null;
  return ACTIVITIES.find((a) => a.slug === slug) || null;
}

function Chip({ children }) {
  return (
    <span className="rounded-full bg-black/5 text-[13px] px-2.5 py-1">
      {children}
    </span>
  );
}

export default function ActivityDetail({ params }) {
  const { slug } = params || {};
  const item = useMemo(() => findBySlug(slug), [slug]) || {
    title: "Atividade",
    subtitle: "Detalhes em breve.",
    duration: 10,
    ages: [],
    places: [],
    steps: [],
    benefits: [],
  };

  function save() {
    addPlannerItem("filhos", item.title);
    toast("Atividade salva no Planner 💾");
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("m360:win", { detail: { type: "badge", name: "Exploradora" } }));
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-5">
      <AppBar title="Brincar" backHref="/brincar" />

      <GlassCard className="p-5 mb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold">{item.title}</h1>
            {item.subtitle && <p className="text-[var(--ink-soft)] mt-1">{item.subtitle}</p>}

            <div className="flex flex-wrap gap-2 mt-3">
              {item.duration && <Chip>{item.duration} min</Chip>}
              {!!item.ages?.length && <Chip>{item.ages.join(", ")}</Chip>}
              {!!item.places?.length && <Chip>{item.places.join(", ")}</Chip>}
            </div>
          </div>

          <div className="shrink-0 flex gap-2">
            <button onClick={save} className="rounded-xl bg-[var(--brand)] text-white px-3 py-2 text-sm">
              Salvar no Planner
            </button>
            <Link
              href="/brincar"
              className="rounded-xl bg-white ring-1 ring-black/10 px-3 py-2 text-sm"
            >
              Fechar
            </Link>
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <GlassCard className="p-5">
          <h3 className="font-medium">Passo a passo</h3>
          {Array.isArray(item.steps) && item.steps.length ? (
            <ol className="mt-2 space-y-2 list-decimal ml-5 text-[15px]">
              {item.steps.map((s, i) => <li key={i}>{s}</li>)}
            </ol>
          ) : (
            <p className="text-[var(--ink-soft)] mt-2">
              Em breve: materiais e passos para facilitar a brincadeira. 💛
            </p>
          )}
        </GlassCard>

        <GlassCard className="p-5">
          <h3 className="font-medium">Benefícios de desenvolvimento</h3>
          {Array.isArray(item.benefits) && item.benefits.length ? (
            <ul className="mt-2 space-y-2 list-disc ml-5 text-[15px]">
              {item.benefits.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
          ) : (
            <p className="text-[var(--ink-soft)] mt-2">
              Vamos destacar os ganhos motores, cognitivos e socioemocionais desta atividade.
            </p>
          )}
        </GlassCard>
      </div>
    </main>
  );
}
