"use client";

export default function DayStep({ dayData, completed = false, onComplete, offline = false }) {
  if (!dayData) return null;

  const { day, title, audio_url: audioUrl, activity, micro_action: microAction } = dayData;

  const handleComplete = () => {
    if (completed) return;
    if (typeof onComplete === "function") {
      onComplete();
    }
  };

  return (
    <article className="space-y-6 rounded-3xl border border-brand-secondary/60 bg-white p-6 shadow-soft">
      <header className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-wide text-brand-secondary">Dia {day}</p>
        <h2 className="text-2xl font-semibold text-brand-ink">{title}</h2>
      </header>

      {audioUrl ? (
        <div className="space-y-2 rounded-2xl bg-brand-secondary/10 p-4">
          <span className="text-sm font-medium text-brand-slate">Áudio do dia</span>
          <audio controls className="w-full" aria-label={`Áudio do dia ${day}`} src={audioUrl}>
            Seu navegador não suporta o player de áudio.
          </audio>
        </div>
      ) : null}

      <section className="space-y-2">
        <h3 className="text-lg font-semibold text-brand-ink">Atividade</h3>
        <p className="leading-relaxed text-brand-ink/90">{activity}</p>
      </section>

      <section className="space-y-4 rounded-2xl bg-brand-rose/10 p-4">
        <div>
          <h3 className="text-lg font-semibold text-brand-ink">Micro-ação</h3>
          <p className="mt-1 leading-relaxed text-brand-ink/90">{microAction}</p>
          {offline ? (
            <span className="mt-2 inline-flex items-center rounded-full bg-brand-secondary/20 px-3 py-1 text-xs font-medium text-brand-secondary">
              Progresso salvo no dispositivo
            </span>
          ) : null}
        </div>

        <button
          type="button"
          onClick={handleComplete}
          disabled={completed}
          aria-pressed={completed}
          className={`inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40 ${
            completed
              ? "cursor-default bg-brand-secondary/30 text-brand-secondary"
              : "bg-brand-primary text-white shadow-soft hover:brightness-110"
          } ${completed ? "" : "active:scale-[0.99]"}`}
        >
          {completed ? "Dia concluído" : "Concluir dia"}
        </button>
      </section>
    </article>
  );
}
