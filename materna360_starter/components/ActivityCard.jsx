function formatDuration(durationMin) {
  if (typeof durationMin !== "number") return null;
  if (durationMin <= 10) return "≤10 min";
  return `${durationMin} min`;
}

function classNames(...values) {
  return values.filter(Boolean).join(" ");
}

export default function ActivityCard({
  title,
  emoji,
  shortDesc,
  tags = [],
  durationMin,
  zeroMaterial,
  indoor,
  className,
  href,
}) {
  const chips = [];

  const durationLabel = formatDuration(durationMin);
  if (durationLabel) {
    chips.push({ label: durationLabel, key: "duration", highlight: durationMin <= 10 });
  }

  if (zeroMaterial) {
    chips.push({ label: "Zero material", key: "zero" });
  }

  if (indoor) {
    chips.push({ label: "Dentro de casa", key: "indoor" });
  }

  for (const tag of tags ?? []) {
    if (typeof tag === "string" && tag.trim()) {
      chips.push({ label: tag.trim(), key: `tag-${tag}` });
    }
  }

  const cardContent = (
    <div
      className={classNames(
        "flex h-full flex-col gap-3 rounded-2xl border border-brand-secondary/60 bg-white p-4 shadow-soft transition-shadow hover:shadow-md",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="text-3xl" aria-hidden>
          {emoji || "🎯"}
        </div>
        <div className="flex-1 space-y-2">
          <h3 className="text-base font-semibold text-brand-ink">{title}</h3>
          {shortDesc && <p className="text-sm text-brand-slate">{shortDesc}</p>}
        </div>
      </div>

      {chips.length > 0 && (
        <div className="flex flex-wrap gap-2 text-xs text-brand-slate">
          {chips.map((chip) => (
            <span
              key={chip.key}
              className={classNames(
                "rounded-full border border-brand-secondary/40 bg-white px-3 py-1",
                chip.highlight && "border-brand-primary/70 bg-brand-primary/5 text-brand-primary"
              )}
            >
              {chip.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block no-underline text-inherit">
        {cardContent}
      </a>
    );
  }

  return cardContent;
}
