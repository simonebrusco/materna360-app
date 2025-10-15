'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import FilterChips from "@/components/FilterChips";
import GlassCard from "@/components/GlassCard";
import AppBar from "@/components/AppBar";
import BottomNav from "@/components/BottomNav";

export default function BrincarPage() {
  const [zeroMaterial, setZeroMaterial] = useState(false);
  const [quickOnly, setQuickOnly] = useState(false);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [missingSchema, setMissingSchema] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function loadActivities() {
      setLoading(true);
      setHasError(false);

      // CODEX:brincar:filters:start
      let query = supabase
        .from("activities")
        .select(
          "title, subtitle, icon, duration_min, zero_material, indoor, age_min, age_max, slug"
        )
        .order("title", { ascending: true });

      if (zeroMaterial) {
        query = query.eq("zero_material", true);
      }

      if (quickOnly) {
        query = query.lte("duration_min", 10);
      }

      const { data, error } = await query;

      if (error) {
        const combinedMessage = `${error.message ?? ""} ${error.details ?? ""}`.toLowerCase();
        const missingColumn =
          combinedMessage.includes("zero_material") || combinedMessage.includes("duration_min");

        if (missingColumn) {
          if (isActive) {
            setMissingSchema(true);
            if (zeroMaterial) {
              setZeroMaterial(false);
            }
            if (quickOnly) {
              setQuickOnly(false);
            }
          }

          const { data: fallbackData, error: fallbackError } = await supabase
            .from("activities")
            .select("title, subtitle, icon, indoor, age_min, age_max, slug")
            .order("title", { ascending: true });

          if (fallbackError) {
            if (isActive) {
              setHasError(true);
              setActivities([]);
            }
          } else if (isActive) {
            setActivities(fallbackData ?? []);
          }
        } else if (isActive) {
          setHasError(true);
          setActivities([]);
        }
      } else if (isActive) {
        setMissingSchema(false);
        setActivities(data ?? []);
      }
      // CODEX:brincar:filters:end

      if (isActive) {
        setLoading(false);
      }
    }

    loadActivities();

    return () => {
      isActive = false;
    };
  }, [zeroMaterial, quickOnly]);

  const handleClearFilters = () => {
    setZeroMaterial(false);
    setQuickOnly(false);
  };

  const showEmptyState = !loading && !hasError && activities.length === 0 && (zeroMaterial || quickOnly);

  return (
    <main className="mx-auto max-w-md">
      <AppBar title="Brincar" backHref="/" />

      <div className="px-4">
        <div className="py-4 space-y-1">
          <h1 className="text-2xl font-semibold">Brincar</h1>
          <p className="text-brand-slate">Ideias rápidas para momentos especiais em família.</p>
        </div>

        <div className="sticky top-12 z-10 -mx-4 border-b border-white/60 bg-white/90 px-4 pb-3 pt-4 backdrop-blur-xs">
          <FilterChips
            zeroMaterial={zeroMaterial}
            quickOnly={quickOnly}
            onToggleZero={() => setZeroMaterial((prev) => !prev)}
            onToggleQuick={() => setQuickOnly((prev) => !prev)}
            onClear={handleClearFilters}
            disabled={missingSchema}
          />
        </div>

        <div className="space-y-3 py-4">
          {loading && (
            <div className="space-y-3">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="h-20 rounded-2xl border border-brand-secondary/40 bg-white/60" />
              ))}
            </div>
          )}

          {!loading && hasError && (
            <GlassCard className="p-4 text-brand-slate">
              Não foi possível carregar as atividades agora.
            </GlassCard>
          )}

          {showEmptyState && (
            <GlassCard className="p-4 text-brand-slate">
              Nenhuma atividade com esses filtros. Tente limpar os filtros.
            </GlassCard>
          )}

          {!loading && !hasError && activities.map((activity, index) => (
            <Link key={index} href={`/brincar/${activity.slug ?? "#"}`}>
              <div className="rounded-2xl border border-brand-secondary/60 bg-white p-4 shadow-soft transition-shadow hover:shadow-md">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{activity.icon || "🎯"}</div>
                  <div className="flex-1">
                    <div className="font-medium text-brand-ink">{activity.title}</div>
                    {activity.subtitle && (
                      <div className="text-sm text-brand-slate">{activity.subtitle}</div>
                    )}
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-brand-slate">
                      {activity.zero_material && (
                        <span className="text-xs px-2 py-1 rounded-full border bg-white">Zero material</span>
                      )}
                      {typeof activity.duration_min === "number" && activity.duration_min <= 10 && (
                        <span className="text-xs px-2 py-1 rounded-full border bg-white">≤10 min</span>
                      )}
                      {(activity.age_min || activity.age_max) && (
                        <span className="text-xs px-2 py-1 rounded-full border bg-white">
                          {activity.age_min ?? "?"}–{activity.age_max ?? "?"} anos
                        </span>
                      )}
                      {activity.indoor && (
                        <span className="text-xs px-2 py-1 rounded-full border bg-white">Dentro de casa</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
