"use client";

import { useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const MOODS = [
  {
    id: "sad",
    label: "Triste",
    icon: "😞",
    tip: "Tudo bem ir devagar. Experimente 2 min em Cuidar 💗",
    actionHref: "/cuidar",
  },
  {
    id: "neutral",
    label: "Neutro",
    icon: "😐",
    tip: "Que tal 5 min de alongamento?",
    actionHref: "/cuidar",
  },
  {
    id: "ok",
    label: "Ok",
    icon: "🙂",
    tip: "Uma brincadeira curta pode animar o dia!",
  },
  {
    id: "happy",
    label: "Feliz",
    icon: "😊",
    tip: "Registre um momento com seu filho 💕",
  },
  {
    id: "wow",
    label: "Uhul!",
    icon: "🤩",
    tip: "Uhul! Salve esse momento especial ✨",
  },
];

const MESSAGE_STYLE = {
  success: "text-emerald-600",
  error: "text-red-500",
};

export default function CheckinCard() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState({ type: null, message: "" });

  const selectedMoodConfig = useMemo(
    () => MOODS.find((mood) => mood.id === selectedMood) || null,
    [selectedMood]
  );

  const handleSelectMood = async (mood) => {
    if (isSaving) return;

    setSelectedMood(mood.id);
    setStatus({ type: null, message: "" });

    try {
      setIsSaving(true);
      const { error } = await supabase
        .from("mood_checkins")
        .insert({ mood: mood.id });

      if (error) throw error;

      setStatus({ type: "success", message: "Registrado!" });
    } catch (error) {
      console.error("Erro ao salvar check-in", error);
      setStatus({
        type: "error",
        message: "Ops! Não conseguimos salvar agora. Tente novamente.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-brand-secondary/70 bg-white p-4 shadow-soft">
      <h3 className="font-medium">Como você está hoje?</h3>
      <p className="text-sm text-brand-slate mt-1">Registre seu humor de hoje</p>

      <div className="mt-3 flex items-center gap-3 text-2xl">
        {MOODS.map((mood) => {
          const isActive = selectedMood === mood.id;
          return (
            <button
              key={mood.id}
              type="button"
              title={mood.label}
              onClick={() => handleSelectMood(mood)}
              disabled={isSaving}
              className={`transition-transform ${
                isActive ? "scale-110" : "hover:scale-110"
              } ${isSaving ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {mood.icon}
            </button>
          );
        })}
      </div>

      {status.message ? (
        <p
          className={`mt-3 text-sm font-medium ${
            MESSAGE_STYLE[status.type] || "text-brand-ink"
          }`}
        >
          {status.message}
        </p>
      ) : null}

      <div className="mt-3 text-sm text-brand-ink space-y-2">
        <p>
          {selectedMoodConfig
            ? selectedMoodConfig.tip
            : "Dica: encontre um momento para se cuidar hoje 💗"}
        </p>
        {selectedMoodConfig?.actionHref ? (
          <a
            href={selectedMoodConfig.actionHref}
            className="inline-flex items-center justify-center rounded-full border border-brand-primary bg-brand-primary px-4 py-1.5 text-sm font-medium text-white shadow-soft transition hover:brightness-110"
          >
            Ir para Cuidar
          </a>
        ) : null}
      </div>
    </div>
  );
}
