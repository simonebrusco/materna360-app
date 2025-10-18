"use client";

import { useMemo, useState } from "react";
import { setPlannerNote } from "@/lib/persistM360";
import Button from "@/components/Button";

const PROFILE_KEY = "m360:profile";
const K_NOTES = "m360:planner_notes";

function todayKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function getUserId() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    const p = raw ? JSON.parse(raw) : {};
    return p?.userId || null;
  } catch {
    return null;
  }
}
function readNotes() {
  try {
    const raw = localStorage.getItem(K_NOTES);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
function writeNotes(map) {
  localStorage.setItem(K_NOTES, JSON.stringify(map));
  try {
    window.dispatchEvent(new CustomEvent("m360:planner:changed"));
  } catch {}
}

/**
 * Botão que acrescenta uma linha no Planner do dia.
 * Props:
 *  - title (string) → será gravado como “• Atividade: {title}”
 *  - dayKey? (string yyyy-mm-dd) → default: hoje
 *  - onDone? (fn) → callback após salvar
 *  - label? (string) → rótulo do botão (default "Salvar no Planner")
 *  - className? (string) → classes extras para estilização
 */
export default function SaveToPlannerButton({
  title,
  dayKey,
  onDone,
  label = "Salvar no Planner",
  className = "",
}) {
  const [loading, setLoading] = useState(false);
  const userId = useMemo(() => getUserId(), []);
  const dk = dayKey || todayKey();

  async function handleSave() {
    if (!title) return;
    setLoading(true);
    try {
      const line = `• Atividade: ${title}`;
      const notes = readNotes();
      const prev = notes[dk] ? String(notes[dk]) : "";
      const already = prev
        .split("\n")
        .some((l) => l.trim().startsWith("• Atividade:"));
      const nextText = already
        ? prev.replace(/(^|\n)• Atividade:.*$/m, `\n${line}`).trim()
        : (prev ? prev + "\n" : "") + line;

      // salva local imediatamente
      const nextMap = { ...notes, [dk]: nextText };
      writeNotes(nextMap);

      // sincroniza remoto (fallback local automático)
      await setPlannerNote(userId, dk, nextText);

      try {
        alert("Atividade salva no Planner!");
      } catch {}
      onDone?.();
    } catch {
      try {
        alert("Não foi possível salvar agora.");
      } catch {}
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="primary"
      size="md"
      onClick={handleSave}
      disabled={loading || !title}
      aria-busy={loading ? "true" : "false"}
      className={className}
    >
      {loading ? "Salvando..." : label}
    </Button>
  );
}
