"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../../lib/supabaseClient";
import GlassCard from "../../../components/GlassCard";
import AppBar from "../../../components/AppBar";
import { addPlannerItem } from "../../../lib/planner";
import { toast } from "../../../lib/toast";

export default function ActivityDetail({ params }) {
  const { slug } = params;
  const [item, setItem] = useState(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("activities")
        .select("title, subtitle, icon, duration_min, zero_material, indoor, age_min, age_max, safety_note")
        .eq("slug", slug)
        .maybeSingle();
      setItem(data);
    })();
  }, [slug]);

  if (!item) {
    return (
      <main className="mx-auto max-w-md">
        <AppBar title="Brincar" backHref="/brincar" />
        <div className="px-4 py-6">
          <div className="h-24 rounded-2xl bg-brand-secondary/60 animate-pulse" />
        </div>
      </main>
    );
  }

  function save() {
    addPlannerItem("filhos", item.title);
    toast("Atividade salva no Planner 💾");
    window.dispatchEvent(new CustomEvent("m360:win", { detail: { type: "badge", name: "Exploradora" } }));
  }

  return (
    <main className="mx-auto max-w-md">
      <AppBar title="Brincar" backHref="/brincar" />

      <div className="px-4 py-6 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{item.icon || "🎨"}</div>
            <h1 className="text-2xl font-semibold">{item.title}</h1>
          </div>
          <button onClick={save} className="rounded-xl bg-[#F15A2E] text-white px-3 py-1.5">Salvar</button>
        </div>

        {item.subtitle && <p className="text-brand-slate">{item.subtitle}</p>}

        <GlassCard className="p-4">
          <h3 className="font-medium">Informações rápidas</h3>
          <p className="mt-2 text-brand-slate">Duração: {item.duration_min ?? "?"} min</p>
        </GlassCard>

        {item.safety_note && (
          <GlassCard className="p-4 border border-brand-primary/30">
            <h3 className="font-medium">Segurança</h3>
            <p className="mt-1 text-brand-slate">{item.safety_note}</p>
          </GlassCard>
        )}
      </div>
    </main>
  );
}
