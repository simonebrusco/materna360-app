// app/cuidar/page.jsx
export default function CuidarPage() {
  return (
    <main className="pb-28">
      <header className="mb-4">
        <h1 className="title">Cuidar</h1>
        <p className="subtitle">Pausas guiadas, meditações e apoio profissional</p>
      </header>

      {/* Cards fixos de bem-estar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <a href="/cuidar/meditar" className="card hover:shadow-md transition-shadow">
          <div className="text-2xl mb-1">🧘</div>
          <div className="font-semibold">Meditar</div>
          <div className="text-sm text-slate-500">Áudios curtos de relaxamento</div>
        </a>

        <a href="/cuidar/respirar" className="card hover:shadow-md transition-shadow">
          <div className="text-2xl mb-1">🌬️</div>
          <div className="font-semibold">Respirar</div>
          <div className="text-sm text-slate-500">Micro pausas guiadas</div>
        </a>

        <a href="/cuidar/alegrar" className="card hover:shadow-md transition-shadow">
          <div className="text-2xl mb-1">🎵</div>
          <div className="font-semibold">Alegrar</div>
          <div className="text-sm text-slate-500">Músicas e frases positivas</div>
        </a>

        <a href="/cuidar/mentoria" className="card hover:shadow-md transition-shadow">
          <div className="text-2xl mb-1">💬</div>
          <div className="font-semibold">Profissionais de Apoio</div>
          <div className="text-sm text-slate-500">Pedagogia · Psicologia · Psicopedagogia</div>
        </a>
      </div>

      <section className="card">
        <h4 className="text-lg font-semibold mb-1">Tempo para Você</h4>
        <p className="text-sm text-slate-500">
          3 a 5 minutos de pausa já fazem diferença. Escolha um card e comece agora. 💛
        </p>
      </section>
    </main>
  );
}
