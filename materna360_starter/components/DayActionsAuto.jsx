"use client";

import { useMemo } from "react";
import DayActionsBlock from "@/components/DayActionsBlock";

/**
 * DayActionsAuto
 * Lê automaticamente os dados do dia atual via localStorage:
 *  - dayKey de hoje (YYYY-MM-DD)
 *  - título formatado (pt-BR)
 *  - notes em "m360:planner_notes[dayKey]"
 *  - checklist em chaves comuns (fallback progress 0%)
 *
 * Props opcionais:
 *  - activityTitle?: string
 *  - className?: string
 */
export default function DayActionsAuto({ activityTitle = "", className = "" }) {
  const { dayKey, title, notes, checklistEntry } = useMemo(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const dk = `${y}-${m}-${day}`;

    const titleFmt = new Intl.DateTimeFormat("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
    })
      .format(d)
      .replace(/^\w/u, (c) => c.toUpperCase());

    // Notes
    let notesMap = {};
    try {
      const raw = localStorage.getItem("m360:planner_notes");
      notesMap = raw ? JSON.parse(raw) : {};
    } catch {}
    const notes = String(notesMap?.[dk] || "");

    // Checklist: tenta chaves conhecidas
    let checklist = null;
    try {
      const keys = [
        `m360:checklist:${dk}`,
        "m360:checklist_today",
        "m360:checklist",
      ];
      for (const k of keys) {
        const raw = localStorage.getItem(k);
        if (raw) {
          checklist = JSON.parse(raw);
          break;
        }
      }
    } catch {}

    const items = Array.isArray(checklist?.items) ? checklist.items : [];
    const done = items.filter((i) => i?.done).length;
    const progress =
      typeof checklist?.progress === "number"
        ? Math.max(0, Math.min(100, Math.round(checklist.progress)))
        : items.length > 0
        ? Math.round((done / items.length) * 100)
        : 0;

    return {
      dayKey: dk,
      title: titleFmt,
      notes,
      checklistEntry: { items, progress },
    };
  }, []);

  return (
    <DayActionsBlock
      dayKey={dayKey}
      title={title}
      notes={notes}
      checklistEntry={checklistEntry}
      activityTitle={activityTitle}
      className={className}
    />
  );
}
