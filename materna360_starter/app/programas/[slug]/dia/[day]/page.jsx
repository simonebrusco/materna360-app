"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import AppBar from "@/components/AppBar";
import BottomNav from "@/components/BottomNav";
import DayStep from "@/components/DayStep";
import { getClientId } from "@/lib/clientId";
import { fetchProgress, markDayComplete } from "@/lib/progress";
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

export default function ProgramDayPage({ params }) {
  const { slug, day } = params;
  const dayNumber = Number.parseInt(day, 10);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const [program, setProgram] = useState(null);
  const [dayData, setDayData] = useState(null);
  const [progressDays, setProgressDays] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);
  const toastTimeoutRef = useRef(null);
  const clientIdRef = useRef(null);

  useEffect(() => {
    if (!slug || Number.isNaN(dayNumber)) return;
    let isMounted = true;

    async function loadDay() {
      setLoading(true);
      let offlineMode = false;
      let programData = null;
      let dayInfo = null;
      const clientId = getClientId();
      clientIdRef.current = clientId;

      try {
        const { data: programRow, error: programError } = await supabase
          .from("programs")
          .select("slug, title, subtitle, cover_url")
          .eq("slug", slug)
          .maybeSingle();

        if (programError) throw programError;
        programData = programRow || null;

        const { data: dayRow, error: dayError } = await supabase
          .from("program_days")
          .select("day, title, audio_url, activity, micro_action")
          .eq("program_slug", slug)
          .eq("day", dayNumber)
          .maybeSingle();

        if (dayError) throw dayError;
        dayInfo = dayRow || null;
      } catch (error) {
        if (!isSchemaError(error)) {
          console.warn("Erro ao carregar dia do programa", error);
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
          dayInfo = localProgram.days?.find((item) => item.day === dayNumber) || null;
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
      setDayData(dayInfo);
      setProgressDays(progressResult.days);
      setOffline(offlineMode);
      setLoading(false);

      if (dayInfo) {
        console.info("event: program_day_open", { slug, day: dayNumber });
      }
    }

    loadDay();

    return () => {
      isMounted = false;
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, [slug, dayNumber]);

  const showToast = useCallback((message) => {
    setToastMessage(message);
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  }, []);

  const handleComplete = useCallback(async () => {
    if (Number.isNaN(dayNumber)) return;
    const clientId = clientIdRef.current || getClientId();
    const result = await markDayComplete({
      supabase: offline ? null : supabase,
      clientId,
      slug,
      day: dayNumber,
      offline,
    });

    setProgressDays(result.days);
    setOffline(result.offline || offline);
    console.info("event: program_day_complete", {
      slug,
      day: dayNumber,
      mode: result.offline ? "offline" : "online",
    });
    showToast(`Dia ${dayNumber} concluído! 💗 Você ganhou o selo do dia.`);
  }, [dayNumber, offline, showToast, slug]);

  const isCompleted = progressDays.includes(dayNumber);

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col">
      <AppBar title="Programas 7D" backHref={`/programas/${slug}`} />
      <div className="flex-1 px-4 py-6">
        {/* CODEX:program:day:start */}
        {loading ? (
          <p className="text-sm text-brand-slate">Carregando dia...</p>
        ) : !dayData ? (
          <div className="space-y-4">
            <h1 className="text-2xl font-semibold text-brand-ink">Dia não encontrado</h1>
            <p className="text-brand-slate">
              Não conseguimos localizar este conteúdo. Volte ao programa para escolher outro dia.
            </p>
            <a
              href={`/programas/${slug}`}
              className="inline-flex items-center justify-center rounded-full bg-brand-primary px-4 py-2 text-sm font-semibold text-white shadow-soft"
            >
              Voltar ao programa
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            <header className="space-y-2">
              <h1 className="text-3xl font-semibold text-brand-ink">{program?.title || "Programa"}</h1>
              <p className="text-brand-slate">Dia {dayNumber} • {dayData.title}</p>
              {offline ? (
                <span className="inline-flex items-center rounded-full bg-brand-secondary/20 px-3 py-1 text-xs font-semibold text-brand-secondary">
                  Modo offline
                </span>
              ) : null}
            </header>

            <DayStep dayData={dayData} completed={isCompleted} onComplete={handleComplete} offline={offline} />
          </div>
        )}
        {/* CODEX:program:day:end */}
      </div>
      <BottomNav />

      {toastMessage ? (
        <div
          role="status"
          aria-live="assertive"
          className="pointer-events-none fixed bottom-24 left-1/2 z-40 w-[90%] max-w-sm -translate-x-1/2 rounded-2xl bg-brand-ink/90 px-4 py-3 text-center text-sm font-semibold text-white shadow-lg"
        >
          {toastMessage}
        </div>
      ) : null}
    </main>
  );
}
