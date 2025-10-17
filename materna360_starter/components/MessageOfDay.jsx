"use client";

import { useEffect, useMemo, useState } from "react";
import GlassCard from "./GlassCard";
import { get, set, keys } from "../lib/storage";

const MESSAGES = [
  "Você está fazendo o melhor que pode — e isso é lindo.",
  "Pequenos avanços também são avanços. 💛",
  "Respire fundo. Seu ritmo é o certo para hoje.",
  "Você merece cuidado, carinho e pausas.",
  "Um momento de presença vale por mil. 🌿",
];

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export default function MessageOfDay() {
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const storageKey = keys.messageOfDay || "m360:message_of_day";
    const rec = get(storageKey, null);
    const today = todayKey();

    if (rec && rec.day === today && rec.text) {
      setMsg(rec.text);
      return;
    }

    // sorteia nova mensagem do dia
    const idx = Math.floor((Date.now() / 86400000) % MESSAGES.length); // muda a cada dia
    const text = MESSAGES[idx];

    set(storageKey, { day: today, text });
    setMsg(text);

    // badge opcional (Organizada) ao rolar nova mensagem diária
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("m360:win", { detail: { type: "badge", name: "Organizada" } })
      );
    }
  }, []);

  const subtitle = useMemo(
    () => "Uma gentileza para inspirar seu dia.",
    []
  );

  if (!msg) return null;

  return (
    <GlassCard className="p-4">
      <div className="text-sm opacity-60">{subtitle}</div>
      <div className="mt-1 text-lg">{msg}</div>
    </GlassCard>
  );
}
