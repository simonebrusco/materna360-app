// materna360_starter/app/activities/[slug]/page.jsx
"use client";

import { useEffect, useState } from "react";

// ⚠️ IMPORTS RELATIVOS (sem alias @)
import { supabase } from "../../../lib/supabaseClient";
import GlassCard from "../../../components/GlassCard";
import AppBar from "../../../components/AppBar";

export default function ActivityDetail({ params }) {
  const { slug } = params;
  const [item, setItem] = useState(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("activities")
        .select(
          "title, subtitle, icon, duration_min, zero_material, indoor, age_min, age_max, safety_note"
        )
        .eq("slug", slug)
        .maybeSingle();

      setItem(data);
    })();
  }, [slug]);

  if (!item) {
    return (
      <main className="mx-auto max-w-md">
        <AppBar title="Brincar" backHref="/brincar" />
        <div className="container-px py-6">
          <div className="h-24 glass animate-pulse" />
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-md">
      <AppBar title="Brincar" backHref="/brincar" />

      <div className="container-px py-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{item.icon || "🎨"}</div>
          <h1 className="text-2xl font-semibold">{item.title}</h1>
        </div>
        {item.subtitle && <p className="subtitle">{item.subtitle}</p>}

        <GlassCard className="p-4">
          <h3 className="font-medium">Informações rápidas</h3>
          <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
            {item.zero_material && (
              <span className="chip">0 materiais</span>
            )}
            {item.duration_min && (
              <span className="chip">{item.duration_min} min</span>
            )}
            {(item.age_min || item.age_max) && (
              <span className="chip">
                {item.age_min ?? "?"}–{item.age_max ?? "?"} anos
              </span>
            )}
            {item.indoor && <span className="chip">dentro de casa</span>}
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <h3 className="font-medium">Passo a passo</h3>
          <p className="mt-2 subtitle">
            (Em breve) objetivo, materiais e passos da atividade.
          </p>
        </GlassCard>

        {item.safety_note && (
          <GlassCard className="p-4" >
            <h3 className="font-medium">Segurança</h3>
            <p className="mt-1 subtitle">{item.safety_note}</p>
          </GlassCard>
        )}
      </div>
    </main>
  );
}
