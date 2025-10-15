"use client";

import { useEffect, useState } from "react";
import AppBar from "@/components/AppBar";
import BottomNav from "@/components/BottomNav";
import ProgramCard from "@/components/ProgramCard";
import { getClientId } from "@/lib/clientId";
import { fetchProgress } from "@/lib/progress";
import { PROGRAMS_7D } from "@/lib/seed/programs7d";
import { supabase } from "@/lib/supabaseClient";

function isSchemaError(error) {
  if (!error) return false;
  const message = `${error.message ?? ""} ${error.details ?? ""}`.toLowerCase();
  return (
    message.includes("relation") && message.includes("does not exist") ||
    message.includes("column") && message.includes("does not exist")
  );
}

export default function ProgramsPage() {
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    let isMounted = true;

    async function loadPrograms() {
      setLoading(true);
      let offlineMode = false;
      let programList = [];
      const clientId = getClientId();

      try {
        const { data, error } = await supabase
          .from("programs")
          .select("slug, title, subtitle, cover_url")
          .order("title", { ascending: true });

        if (error) throw error;
        programList = data || [];
      } catch (error) {
        if (!isSchemaError(error)) {
          console.warn("Erro ao carregar programas 7D", error);
        }
        offlineMode = true;
        programList = PROGRAMS_7D;
      }

      const enriched = await Promise.all(
        programList.map(async (program) => {
          const result = await fetchProgress({
            supabase: offlineMode ? null : supabase,
            clientId,
            slug: program.slug,
          });
          if (result.offline) {
            offlineMode = true;
          }
          const total = program.days?.length ?? 7;
          const done = result.days.length;
          const pct = total > 0 ? (done / total) * 100 : 0;

          return {
            slug: program.slug,
            title: program.title,
            subtitle: program.subtitle,
            coverUrl: program.cover_url || program.coverUrl || "",
            progressPct: pct,
          };
        })
      );

      if (!isMounted) return;

      setCards(enriched);
      setOffline(offlineMode);
      setLoading(false);
    }

    loadPrograms();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col">
      <AppBar title="Programas 7D" backHref="/cuidar" />
      <div className="flex-1 px-4 py-6">
        {/* CODEX:programs:list:start */}
        <header className="space-y-3">
          <h1 className="text-3xl font-semibold text-brand-ink">Programas 7D</h1>
          <p className="text-brand-slate">
            Jornadas guiadas com 7 dias de áudios, atividades e micro-ações para você.
          </p>
          {offline ? (
            <span className="inline-flex items-center rounded-full bg-brand-secondary/20 px-3 py-1 text-xs font-semibold text-brand-secondary">
              Modo offline
            </span>
          ) : null}
        </header>

        <div className="mt-6 space-y-4">
          {loading ? (
            <p className="text-sm text-brand-slate">Carregando programas...</p>
          ) : cards.length > 0 ? (
            <div className="grid gap-4">
              {cards.map((program) => (
                <ProgramCard key={program.slug} {...program} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-brand-slate">Nenhum programa disponível no momento.</p>
          )}
        </div>
        {/* CODEX:programs:list:end */}
      </div>
      <BottomNav />
    </main>
  );
}
