"use client";

import { useEffect, useMemo, useState } from "react";
import { get, set } from "../lib/storage";

const MESSAGES = [
  "Hoje pode ser mais leve. Um passo de cada vez 💛",
  "Você está fazendo o melhor que pode — e isso já é muito.",
  "Respire fundo. Seu cuidado também importa.",
  "Pequenas vitórias constroem grandes dias 🌿",
  "Organize o possível, abrace o que vier com carinho.",
];

function today() {
  const d = new Date();
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

export default function MessageOfDay() {
  const [msg, setMsg] = useState("");

  // decide a mensagem do dia 1x a cada 24h (sem opção de trocar)
  useEffect(() => {
    const lastDate = get("m360:msg:date");       // YYYY-MM-DD
    const lastIdx = parseInt(get("m360:msg:index") ?? "-1", 10);
    const t = today();

    if (lastDate === t && lastIdx >= 0) {
      setMsg(MESSAGES[lastIdx % MESSAGES.length]);
      return;
    }

    // gira para a próxima mensagem (ou aleatória caso não exista)
    const nextIdx = lastIdx >= 0 ? (lastIdx + 1) % MESSAGES.length
                                 : Math.floor(Math.random() * MESSAGES.length);

    set("m360:msg:date", t);
    set("m360:msg:index", String(nextIdx));
    setMsg(MESSAGES[nextIdx]);

    // badge “Organizada” quando a mensagem vira no dia seguinte
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("m360:win", {
          detail: { type: "badge", name: "Organizada" },
        })
      );
    }
  }, []);

  const UI = useMemo(
    () => (
      <div className="rounded-2xl bg-white/90 ring-1 ring-black/5 shadow-sm p-4 md:p-5">
        <div className="text-sm text-[#F17324] mb-1">✦ Mensagem do dia</div>
        <div className="text-base md:text-lg text-[#1A2240]">{msg}</div>
      </div>
    ),
    [msg]
  );

  return UI;
}
