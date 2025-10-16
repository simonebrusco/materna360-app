"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import GlassCard from "@/components/GlassCard";
import AppBar from "@/components/AppBar";

export default function ActivityDetail({ params }) {
  const { slug } = params;
  const [item, setItem] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const { data, error } = await supabase
          .from("activities")
          .select(
            "title, subtitle, icon, duration_min, zero_material, indoor, age_min, age_max, safety_note"
          )
          .eq("slug", slug)
          .maybeSingle();

        if (!mounted) return;

        if (error) {
          setErr(error.message || "Erro ao carregar atividade.");
        } else {
          setItem(data);
        }
      } catch (e) {
        if (mounted) setErr("Falha ao carregar atividade.");
      }
    })();

    return () => {
      mounted = false;
    };
  }, [slug]);

  return (
    <main className="mx-auto max-w-md">
      <AppBar title="Brincar" backHref="/brincar" />

      <div className="px-4 py-6 space-y-4">
        {/* Estado de erro */}
        {err && (
          <GlassCard className="p-4 border border-red-300">
            <p className="text-sm text-red-700">{err}</p>
          </GlassCard>
        )}

        {/* Skeleton enquanto carrega */}
        {!item && !err && (
          <>
            <div className="h-6 w-40 rounded bg-brand-secondary/50 animate-pulse" />
            <div className="h-24 rounded-2xl bg-brand-secondary/60 animate-pulse" />
            <div className="h-24 rounded-2xl bg-brand-secondary/60 animate-pulse" />
          </>
        )}

        {/* Conteúdo */}
        {item && (
          <>
            <div className="flex items-center gap-3">
              <div className="text-3xl">{item.icon || "🎨"}</div>
              <h1 className="text-2xl font-semibold">{item.title}</h1>
            </div>

            {item.subtitle && (
              <p className="text-brand-slate">{item.subtitle}</p>
            )}

            <GlassCard className="p-4">
              <h3 className="font-medium">Informações rápidas</h3>
              <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                {item.zero_material && (
                  <span className="px-2 py-0.5 rounded-full bg-brand-secondary/60">
                    0 materiais
                  </span>
                )}
                {item.duration_min && (
                  <span className="px-2 py-0.5 rounded-full bg-brand-secondary/60">
                    {item.duration_min} min
                  </span>
                )}
                {(item.age_min || item.age_max) && (
                  <span className="px-2 py-0.5 rounded-full bg-brand-secondary/60">
                    {item.age_min ?? "?"}–{item.age_max ?? "?"} anos
                  </span>
                )}
                {item.indoor && (
                  <span className="px-2 py-0.5 rounded-full bg-brand-secondary/60">
                    dentro de casa
                  </span>
                )}
              </div>
            </GlassCard>

            <GlassCard className="p-4">
              <h3 className="font-medium">Passo a passo</h3>
              <p className="mt-2 text-brand-slate">
                (Em breve) objetivo, materiais e passos da atividade.
              </p>
            </GlassCard>

            {item.safety_note && (
              <GlassCard className="p-4 border border-brand-primary/30">
                <h3 className="font-medium">Segurança</h3>
                <p className="mt-1 text-brand-slate">{item.safety_note}</p>
              </GlassCard>
            )}
          </>
        )}
      </div>
    </main>
  );
}
