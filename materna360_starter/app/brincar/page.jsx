'use client';

import { useEffect, useMemo, useState } from "react";
import AppBar from "@/components/AppBar";
import BottomNav from "@/components/BottomNav";
import FilterChips from "@/components/FilterChips";
import ActivityCard from "@/components/ActivityCard";
import GlassCard from "@/components/GlassCard";
import { listActivities } from "@/lib/activities";

export default function BrincarPage() {
  const [zeroMaterial, setZeroMaterial] = useState(false);
  const [quickOnly, setQuickOnly] = useState(false);
  const [indoorOnly, setIndoorOnly] = useState(false);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const filters = useMemo(
    () => ({ zeroMaterial, quick: quickOnly, indoor: indoorOnly }),
    [zeroMaterial, quickOnly, indoorOnly]
  );

  useEffect(() => {
    let active = true;

    async function fetchActivities() {
      setLoading(true);
      const { data, error: fetchError } = await listActivities(filters);

      if (!active) return;

      if (fetchError) {
        setError(fetchError);
        setActivities([]);
      } else {
        setError(null);
        setActivities(data);
      }

      setLoading(false);
    }

    fetchActivities();

    return () => {
      active = false;
    };
  }, [filters]);

  const showEmptyState = !loading && !error && activities.length === 0;

  return (
    <main className="mx-auto max-w-md">
      <AppBar title="Brincar" backHref="/" />

      <div className="px-4 pb-6">
        <header className="py-4 space-y-1">
          <h1 className="text-2xl font-semibold">Brincar</h1>
          <p className="text-brand-slate">Ideias rápidas para momentos especiais em família.</p>
        </header>

        <div className="sticky top-12 z-10 -mx-4 border-b border-white/60 bg-white/90 px-4 pb-3 pt-4 backdrop-blur-xs">
          <FilterChips
            zeroMaterial={zeroMaterial}
            quickOnly={quickOnly}
            indoorOnly={indoorOnly}
            onToggleZero={() => setZeroMaterial((prev) => !prev)}
            onToggleQuick={() => setQuickOnly((prev) => !prev)}
            onToggleIndoor={() => setIndoorOnly((prev) => !prev)}
            onClear={() => {
              setZeroMaterial(false);
              setQuickOnly(false);
              setIndoorOnly(false);
            }}
          />
        </div>

        <section className="space-y-3 py-4">
          {loading && (
            <div className="space-y-3">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="h-24 rounded-2xl border border-brand-secondary/40 bg-white/60" />
              ))}
            </div>
          )}

          {!loading && error && (
            <GlassCard className="p-4 text-brand-slate">
              Não foi possível carregar as atividades agora. Tente novamente mais tarde.
            </GlassCard>
          )}

          {showEmptyState && (
            <GlassCard className="p-4 text-brand-slate">
              Não encontramos atividades com esses filtros. Ajuste os filtros para ver mais opções.
            </GlassCard>
          )}

          {!loading && !error &&
            activities.map((activity) => (
              <ActivityCard
                key={activity.id}
                title={activity.title}
                emoji={activity.emoji}
                shortDesc={activity.short_desc}
                tags={activity.tags}
                durationMin={activity.duration_min}
                zeroMaterial={activity.zero_material}
                indoor={activity.indoor}
              />
            ))}
        </section>
      </div>

      <BottomNav />
    </main>
  );
}
