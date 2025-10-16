"use client";

import { useEffect, useMemo, useState } from "react";
import { getJSON, setJSON } from "../lib/storage";
import { toast } from "../lib/toast";

// Mensagens acolhedoras (pode ajustar à vontade)
const MESSAGES = [
  "Hoje pode ser mais leve. Um passo de cada vez 💛",
  "Respire fundo. Você está fazendo o melhor que pode.",
  "Amor também é descanso. Cuide de você um pouquinho.",
  "Rotina é treino, não corrida. Siga no seu ritmo.",
  "Pequenas alegrias contam muito. Observe uma agora.",
  "Se abrace com carinho. Você importa.",
  "Organize o essencial, o resto pode esperar."
];

// chave no storage
const KEY = "m360:messageOfDay";

function now() { return Date.now(); }
function hoursDiff(a, b) { return Math.abs(a - b) / 36e5; }

export default function MessageOfDay() {
  const [msg, setMsg] = useState(MESSAGES[0]);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "Bom dia, Mãe 💛";
    if (h < 18) return "Boa tarde, Mãe 💛";
    return "Boa noite, Mãe 💛";
  }, []);

  useEffect(() => {
    // lê estado anterior
    const saved = getJSON(KEY) || {};
    const { index = 0, updatedAt = 0 } = saved;
    const shouldRotate = hoursDiff(now(), updatedAt) >= 24;

    if (shouldRotate) {
      // rota para próxima mensagem
      const nextIndex = (index + 1) % MESSAGES.length;
      const next = { index: nextIndex, updatedAt: now() };
      setJSON(KEY, next);
      setMsg(MESSAGES[nextIndex]);

      // badge + toast só quando rotaciona
      try {
        window.dispatchEvent(
          new CustomEvent("m360:win", {
            detail: { type: "badge", name: "Organizada" }
          })
        );
      } catch {}
      toast("Mensagem do dia atualizada ✨", { icon: "📝" });
    } else {
      // mantém mensagem atual
      setMsg(MESSAGES[index]);
      // se nunca salvou antes, garante persistência sem disparar eventos
      if (!updatedAt) {
        setJSON(KEY, { index, updatedAt: now() });
      }
    }
  }, []);

  return (
    <section className="container-px mt-5">
      <div className="glass p-4">
        <div className="text-sm text-navy/70">{greeting}</div>
        <p className="mt-1 text-[17px] md:text-lg text-navy">
          {msg}
        </p>
      </div>
    </section>
  );
}
