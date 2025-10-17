// materna360_starter/lib/hooks/useChecklistProgress.js
"use client";

import { useEffect, useMemo, useState } from "react";
import { get, set, keys } from "../storage.js";

// helpers de data
export function todayStr(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
export function tid(dateStr = todayStr()) {
  // se seu storage.js tiver prefixo nas keys, usamos; caso não, caímos no literal
  const prefix = keys?.checklist_log_prefix || "m360:checklist_log";
  return `${prefix}:${dateStr}`;
}

// chave “defs” tolerante (usa keys do storage.js se existir)
const K_DEFS = keys?.checklist_defs ?? "m360:checklist_defs";

/**
 * Lê defs e log do dia; calcula progresso (%).
 * Escuta o evento 'm360:checklist:changed' e o evento 'storage' para revalidar.
 */
export default function useChecklistProgress() {
  const [stamp, setStamp] = useState(0);

  // leituras do storage (sempre tolerantes)
  const defs = get(K_DEFS, []);
  const done = get(tid(), []);

  const total = Array.isArray(defs) ? defs.length : 0;
  const count = Array.isArray(done) ? done.length : 0;

  const percent = useMemo(() => {
    return total ? Math.round((count / total) * 100) : 0;
  }, [total, count, stamp]); // stamp força revalidação quando eventos disparam

  // função pública para forçar refresh quando você quiser
  function refresh() {
    setStamp((s) => s + 1);
  }

  // escuta eventos para atualizar automaticamente em outras partes do app
  useEffect(() => {
    function onChange() {
      setStamp((s) => s + 1);
    }
    // disparado manualmente após toggle em qualquer página
    window.addEventListener("m360:checklist:changed", onChange);
    // disparado quando outra aba mudar localStorage
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("m360:checklist:changed", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  // helpers para marcar/desmarcar itens de hoje
  function toggleToday(id) {
    const current = new Set(get(tid(), []));
    if (current.has(id)) current.delete(id);
    else current.add(id);
    set(tid(), Array.from(current));
    // avisa o resto do app
    window.dispatchEvent(new CustomEvent("m360:checklist:changed"));
    // opcional: gamificação “Organizada” quando atingir 100%
    const newTotal = Array.isArray(defs) ? defs.length : 0;
    const newCount = current.size;
    if (newTotal && Math.round((newCount / newTotal) * 100) === 100) {
      window.dispatchEvent(
        new CustomEvent("m360:win", {
          detail: { type: "badge", name: "Organizada" },
        })
      );
    }
  }

  return {
    defs,       // array de definições (itens)
    done,       // array de ids concluídos hoje
    total,      // número total de itens
    count,      // número concluído hoje
    percent,    // 0..100
    refresh,    // força recalcular
    toggleToday // helper para marcar/desmarcar
  };
}
