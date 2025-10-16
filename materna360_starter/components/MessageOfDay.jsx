"use client";

import { useEffect, useMemo, useState } from "react";

const MESSAGES = [
  "Respire fundo. Você está fazendo o melhor que pode.",
  "Pequenos passos também são progresso. 💛",
  "Seu cuidado importa — com você e com quem você ama.",
  "Hoje vale celebrar até as pequenas vitórias.",
  "Você não está sozinha. Um passo de cada vez.",
];

const STORAGE_KEY = "m360:messageOfDay";

function startOfDayISO(d = new Date()) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.toISOString();
}

export default function MessageOfDay() {
  const [msg, setMsg] = useState("");

  // define a mensagem 1x por dia; sem opção de trocar manualmente
  useEffect(() => {
    try {
      const today = startOfDayISO();
      const raw = localStorage.getItem(STORAGE_KEY);
      const saved = raw ? JSON.parse(raw) : null;

      if (saved?.date === today && typeof saved?.message === "string") {
        setMsg(saved.message);
        return;
      }

      // escolhe pseudo-aleatória com base no dia
      const seed = new Date().getDate() + new Date().getMonth() * 31;
      const idx = seed % MESSAGES.length;
      const message = MESSAGES[idx];

      localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, message }));
      setMsg(message);

      // badge “Organizada” (dispara só quando a mensagem é definida no dia)
      window.dispatchEvent(
        new CustomEvent("m360:win", {
          detail: { type: "badge", name: "Organizada" },
        })
      );
    } catch {
      // fallback silencioso
      setMsg(MESSAGES[0]);
    }
  }, []);

  const subtitle = useMemo(() => "Boa noite, Mãe 💛", []); // saudação simples

  return (
    <section className="rounded-2xl bg-white ring-1 ring-black/5 p-5 mb-6">
      <div className="text-sm text-slate-500">{subtitle}</div>
      <p className="mt-1 text-[15px] leading-relaxed">
        {msg || "Respire fundo. Você está fazendo o melhor que pode."}
      </p>
    </section>
  );
}
