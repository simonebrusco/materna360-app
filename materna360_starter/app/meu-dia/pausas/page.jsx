// materna360_starter/app/meu-dia/pausas/page.jsx
"use client";

export default function PausasPage() {
  return (
    <main className="mx-auto max-w-5xl px-5 pb-28 pt-6">
      <h1 className="text-2xl md:text-3xl font-semibold text-[var(--m360-navy)] mb-3">
        Momento para Mim
      </h1>

      <section
        className={[
          "rounded-[var(--r-lg)] bg-[var(--m360-white)]",
          "m360-card-border shadow-[var(--elev-1)] p-5 md:p-6",
          "m360-animate-in",
        ].join(" ")}
      >
        Em construção: respiração, pausa, afirmações.
      </section>
    </main>
  );
}
