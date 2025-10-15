"use client";

const formatDueDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
  })
    .format(date)
    .replace(".", "")
    .toLowerCase();
};

const scopeTone = {
  casa: "border-brand-secondary bg-brand-secondary/30",
  filhos: "border-brand-primary/30 bg-brand-primary/5",
  eu: "border-brand-ink/10 bg-brand-ink/5",
};

export default function PlannerItem({ task, onToggle, onRemove, disabled }) {
  const due = formatDueDate(task.due_date);
  const accent = scopeTone[task.scope] || "border-brand-secondary/50 bg-white";

  return (
    <li
      className={`group flex w-full items-start justify-between gap-4 rounded-xl border ${accent} px-4 py-3 shadow-soft transition hover:shadow-lg`}
    >
      <label className="flex flex-1 cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          className="mt-1 h-5 w-5 shrink-0 rounded border-brand-slate text-brand-primary focus:ring-brand-primary"
          checked={Boolean(task.done)}
          onChange={(event) => onToggle?.(event.target.checked)}
          disabled={disabled}
        />
        <span className="flex flex-1 flex-col">
          <span
            className={`text-base font-medium text-brand-ink ${
              task.done ? "line-through opacity-60" : ""
            }`}
          >
            {task.title}
          </span>
          {due ? (
            <span className="text-sm font-medium uppercase tracking-wide text-brand-slate/70">
              até {due}
            </span>
          ) : null}
        </span>
      </label>
      <button
        type="button"
        onClick={() => onRemove?.()}
        disabled={disabled}
        className="rounded-lg border border-transparent px-3 py-1 text-sm font-medium text-brand-slate transition hover:border-brand-primary/40 hover:bg-brand-primary/10 hover:text-brand-primary disabled:cursor-not-allowed disabled:opacity-50"
      >
        Excluir
      </button>
    </li>
  );
}
