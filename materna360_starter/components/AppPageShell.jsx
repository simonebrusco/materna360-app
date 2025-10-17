// =======================================================
// Materna360 — AppPageShell
// Contêiner responsivo padronizado p/ páginas de abas
// NÃO altera conteúdo interno; só centraliza e dá respiro.
// =======================================================

export default function AppPageShell({ children }) {
  return (
    <section className="mx-auto w-full max-w-screen-md px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {children}
    </section>
  );
}
