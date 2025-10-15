"use client";

export default function ActivityCard({ icon, title, desc, tags = [], duration, indoor, zero }) {
  return (
    <article
      className="
        group relative rounded-2xl border border-brand-secondary/40 bg-white/70
        backdrop-blur-xs shadow-[0_6px_24px_rgba(47,58,86,0.06)]
        hover:shadow-[0_10px_30px_rgba(47,58,86,0.10)] hover:-translate-y-0.5
        transition-all overflow-hidden
      "
    >
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="text-2xl shrink-0">{icon ?? "🎯"}</div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[17px] sm:text-[18px] font-semibold text-brand-ink/95">
              {title}
            </h3>

            {desc ? (
              <p className="mt-1 text-[13.5px] text-brand-ink/70 clamp-2">
                {desc}
              </p>
            ) : null}

            <div className="mt-3 flex flex-wrap gap-1.5">
              {duration ? (
                <span className="chip chip-soft">⏱ {duration} min</span>
              ) : null}
              {indoor ? <span className="chip">🏠 Dentro de casa</span> : null}
              {zero ? <span className="chip">🧰 Zero material</span> : null}

              {tags?.slice(0, 3).map((t, i) => (
                <span key={i} className="chip chip-outline">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
