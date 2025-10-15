"use client";

export default function ProgramProgress({ total = 7, done = 0 }) {
  const safeTotal = total > 0 ? total : 1;
  const progress = Math.min(100, Math.round((done / safeTotal) * 100));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-medium text-brand-slate">
        <span>Progresso</span>
        <span>
          {done}/{total} dias
        </span>
      </div>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-brand-secondary/20">
        <div
          className="h-full rounded-full bg-brand-primary transition-all duration-500"
          style={{ width: `${progress}%` }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
