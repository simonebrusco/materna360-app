"use client";

import GlassCard from "@/components/GlassCard";
import SaveToPlannerButton from "@/components/SaveToPlannerButton";
import ShareDayButtons from "@/components/ShareDayButtons";

/**
 * DayActionsBlock
 * Seção pronta com:
 *  - CTA “Salvar no Planner” (usa SaveToPlannerButton)
 *  - Botões de compartilhamento (ShareDayButtons)
 *
 * Props:
 *  - dayKey: "yyyy-mm-dd" (obrigatório)
 *  - title: string (ex.: "Sexta, 17 de outubro") (obrigatório)
 *  - notes: string (bloco de notas do dia)
 *  - checklistEntry?: { items?: Array<{label,done}>, progress?: number }
 *  - activityTitle?: string (para salvar como “• Atividade: {activityTitle}”)
 *  - className?: string
 */
export default function DayActionsBlock({
  dayKey,
  title,
  notes = "",
  checklistEntry = { items: [], progress: 0 },
  activityTitle = "",
  className = "",
}) {
  return (
    <GlassCard className={["flex flex-col gap-6", className].join(" ")}>
      <header>
        <h3 className="text-m360-navy font-semibold">Ações do Dia</h3>
        <p className="text-m360-gray mt-1 text-sm">
          Salve sua atividade e compartilhe seu progresso.
        </p>
      </header>

      <div className="flex flex-wrap gap-3">
        <SaveToPlannerButton
          title={activityTitle || "Atividade do Dia"}
          dayKey={dayKey}
          label="Salvar no Planner"
        />
      </div>

      <div className="h-px w-full bg-black/5" />

      <ShareDayButtons
        dayKey={dayKey}
        title={title}
        notes={notes}
        checklistEntry={checklistEntry}
      />
    </GlassCard>
  );
}
