"use client";

import { useMemo } from "react";

/**
 * Botões de compartilhamento do conteúdo do dia.
 * Props:
 *  - dayKey: "yyyy-mm-dd"
 *  - title: string (ex.: "Sexta, 17 de outubro")
 *  - notes: string (bloco de notas do dia)
 *  - checklistEntry?: { items?: Array<{label:string, done?:boolean}>, progress?: number }
 */
export default function ShareDayButtons({ dayKey, title, notes, checklistEntry }) {
  const textToShare = useMemo(() => {
    const lines = [];
    lines.push(`Dia ${title} (${dayKey})`);
    const progress = (typeof checklistEntry?.progress === "number")
      ? Math.max(0, Math.min(100, Math.round(checklistEntry.progress)))
      : inferProgress(checklistEntry);
    lines.push(`Checklist: ${progress}% concluído`);
    if (Array.isArray(checklistEntry?.items) && checklistEntry.items.length) {
      lines.push("");
      lines.push("Itens do checklist:");
      for (const it of checklistEntry.items) {
        const mark = it?.done ? "✅" : "▫️";
        lines.push(`${mark} ${it.label}`);
      }
    }
    if (notes && String(notes).trim().length) {
      lines.push("");
      lines.push("Notas do dia:");
      for (const line of String(notes).trim().split("\n")) {
        lines.push(`• ${line}`);
      }
    }
    return lines.join("\n");
  }, [dayKey, title, notes, checklistEntry]);

  async function shareNative() {
    try {
      if (navigator.share) {
        await navigator.share({ title: `Meu dia — ${title}`, text: textToShare });
      } else {
        await copy();
      }
    } catch {
      // usuário cancelou ou share não disponível
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(textToShare);
      alert("Texto copiado!");
    } catch {
      alert("Não foi possível copiar.");
    }
  }

  function shareWhatsApp() {
    // usa API de URL para evitar problemas com encoding
    const url = new URL("https://wa.me/");
    url.searchParams.set("text", textToShare);
    // abre em nova aba/guia
    window.open(url.toString(), "_blank", "noopener,noreferrer");
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button onClick={shareNative} className="px-3 py-1.5 rounded-md border">
        Compartilhar
      </button>
      <button onClick={shareWhatsApp} className="px-3 py-1.5 rounded-md border">
        WhatsApp
      </button>
      <button onClick={copy} className="px-3 py-1.5 rounded-md border">
        Copiar texto
      </button>
    </div>
  );
}

function inferProgress(entry) {
  if (!entry || !Array.isArray(entry.items) || entry.items.length === 0) return 0;
  const done = entry.items.filter((i) => i?.done).length;
  return Math.round((done / entry.items.length) * 100);
}
