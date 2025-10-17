"use client";

export default function Section({
  title,
  subtitle,
  surface = false,
  className = "",
  children,
}) {
  return (
    <section
      className={[
        "py-4",
        surface ? "bg-[--m360-blush]/10" : "",
        className,
      ].join(" ")}
    >
      <div className="m360-container">
        {(title || subtitle) && (
          <header className="mb-3">
            {title && <h2 className="m360-h2">{title}</h2>}
            {subtitle && <p className="m360-muted text-sm">{subtitle}</p>}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
