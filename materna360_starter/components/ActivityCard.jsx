'use client';

import Link from 'next/link';

export default function ActivityCard({
  title,
  emoji = '🎯',
  subtitle,
  href = '#',
  tags = [],
  timeLabel = '≤10 min',
}) {
  return (
    <Link
      href={href}
      className="block rounded-2xl bg-white/90 backdrop-blur-sm shadow-[0_4px_18px_rgba(0,0,0,0.06)] ring-1 ring-black/5 hover:-translate-y-[1px] transition-transform"
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="text-2xl leading-none">{emoji}</div>
          <div className="min-w-0">
            <h3 className="text-[16px] font-semibold text-brand-ink/90 tracking-tight">
              {title}
            </h3>
            {subtitle && (
              <p className="mt-1 text-[13px] text-brand-ink/60 line-clamp-2">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {timeLabel && (
            <span className="inline-flex items-center rounded-full border border-brand-ink/10 px-2 py-0.5 text-[11px] text-brand-ink/70">
              {timeLabel}
            </span>
          )}
          {tags?.slice(0, 3).map((t) => (
            <span
              key={t}
              className="inline-flex items-center rounded-full bg-brand-ink/[0.04] px-2 py-0.5 text-[11px] text-brand-ink/65"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
