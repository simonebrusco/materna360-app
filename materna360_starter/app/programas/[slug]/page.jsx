"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import AppBar from "@/components/AppBar";
import BottomNav from "@/components/BottomNav";
import ProgramProgress from "@/components/ProgramProgress";
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

export default function ProgramDetailPage({ params }) {
  const { slug } = params;
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const [program, setProgram] = useState(null);
  const [days, setDays] = useState([]);
  const [progressDays, setProgressDays] = useState([]);

  useEffect(() => {
    if (!slug) return;
    let isMounted = true;

    async function loadProgram() {
      setLoading(true);
      let offlineMode = false;
      let programData = null;
      let programDays = [];
      const clientId = getClientId();

      try {
        const { data, error } = await supabase
          .from("programs")
          .select("slug, title, subtitle, cover_url")
          .eq("slug", slug)
          .maybeSingle();

        if (error) throw error;
        programData = data || null;

        const { data: daysData, error: daysError } = await supabase
          .from("program_days")
          .select("day, title, audio_url, activity, micro_action")
          .eq("program_slug", slug)
          .order("day", { ascending: true });

        if (daysError) throw daysError;
        programDays = daysData || [];
      } catch (error) {
        if (!isSchemaError(error)) {
          console.warn("Erro ao carregar detalhes do programa", error);
        }
        offlineMode = true;
        const localProgram = PROGRAMS_7D.find((item) => item.slug === slug);
        if (localProgram) {
          programData = {
            slug: localProgram.slug,
            title: localProgram.title,
            subtitle: localProgram.subtitle,
            cover_url: localProgram.cover_url,
          };
          programDays = localProgram.days || [];
        }
      }

      const progressResult = await fetchProgress({
        supabase: offlineMode ? null : supabase,
        clientId,
        slug,
      });

      if (progressResult.offline) {
        offlineMode = true;
      }

      if (!isMounted) return;

      setProgram(programData);
      setDays(programDays);
      setProgressDays(progressResult.days);
      setOffline(offlineMode);
      setLoading(false);
    }

    loadProgram();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const totalDays = days.length || 7;

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col">
      <AppBar title="Programas 7D" backHref="/programas" />
      <div className="flex-1 px-4 py-6">
        {/* CODEX:program:detail:start */}
        {loading ? (
          <p className="text-sm text-brand-slate">Carregando programa...</p>
        ) : !program ? (
          <div className="space-y-4">
            <h1 className="text-2xl font-semibold text-brand-ink">Programa não encontrado</h1>
            <p className="text-brand-slate">
              Não encontramos esta jornada. Volte para a lista para explorar outras opções.
            </p>
            <Link
              href="/programas"
              className="inline-flex items-center justify-center rounded-full bg-brand-primary px-4 py-2 text-sm font-semibold text-white shadow-soft"
            >
              Ver todos os programas
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <section className="space-y-4">
              <div className="relative h-48 w-full overflow-hidden rounded-3xl bg-brand-secondary/20">
                {program.cover_url ? (
                  <Image
                    src={program.cover_url}
                    alt={`Capa do programa ${program.title}`}
                    fill
                    sizes="(min-width: 768px) 320px, 100vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-4xl">✨</div>
                )}
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl font-semibold text-brand-ink">{program.title}</h1>
                {program.subtitle ? (
                  <p className="text-brand-slate">{program.subtitle}</p>
                ) : null}
                {offline ? (
                  <span className="inline-flex items-center rounded-full bg-brand-secondary/20 px-3 py-1 text-xs font-semibold text-brand-secondary">
                    Modo offline
                  </span>
                ) : null}
              </div>

              <ProgramProgress total={totalDays} done={progressDays.length} />
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-brand-ink">Dias do programa</h2>
              <div className="space-y-3">
                {days.map((day) => {
                  const isDone = progressDays.includes(day.day);
                  return (
                    <Link
                      key={day.day}
                      href={`/programas/${slug}/dia/${day.day}`}
                      className={`flex items-center justify-between rounded-2xl border p-4 shadow-soft transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40 ${
                        isDone
                          ? "border-brand-primary/50 bg-brand-primary/5"
                          : "border-brand-secondary/60 bg-white"
                      }`}
                    >
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-brand-secondary">Dia {day.day}</p>
                        <p className="text-base font-semibold text-brand-ink">{day.title}</p>
                      </div>
                      <span className={`text-2xl ${isDone ? "text-brand-primary" : "text-brand-secondary"}`} aria-hidden="true">
                        {isDone ? "💗" : "›"}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>
          </div>
        )}
        {/* CODEX:program:detail:end */}
      </div>
      <BottomNav />
    </main>
  );
}
