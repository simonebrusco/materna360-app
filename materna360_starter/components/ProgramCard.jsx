import Image from "next/image";
import Link from "next/link";

export default function ProgramCard({ slug, title, subtitle, coverUrl, progressPct = 0 }) {
  const progress = Number.isFinite(progressPct)
    ? Math.max(0, Math.min(100, Math.round(progressPct)))
    : 0;

  return (
    <Link
      href={`/programas/${slug}`}
      className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40"
    >
      <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-brand-secondary/60 bg-white shadow-soft transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-md">
        <div className="relative h-40 w-full overflow-hidden bg-brand-secondary/20">
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={`Capa do programa ${title}`}
              fill
              sizes="(min-width: 768px) 320px, 100vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-4xl">✨</div>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-4 p-6">
          <div>
            <h3 className="text-lg font-semibold text-brand-ink">{title}</h3>
            {subtitle ? <p className="mt-1 text-sm text-brand-slate">{subtitle}</p> : null}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-medium text-brand-slate">
              <span>Progresso</span>
              <span>{progress}%</span>
            </div>
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-brand-secondary/20">
              <div
                className="h-full rounded-full bg-brand-primary transition-all duration-500"
                style={{ width: `${progress}%` }}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
