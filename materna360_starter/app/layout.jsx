export const metadata = { title: "Materna360", description: "App" };

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="antialiased bg-[var(--bg)] text-[var(--text)]">
        <div className="container-px py-6">{children}</div>
        {/* Tab bar básica (placeholder) */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-card">
          <div className="container-px py-3 grid grid-cols-4 text-center text-sm">
            <a href="/meu-dia" className="text-brand">Meu Dia</a>
            <a href="/cuidar">Cuidar</a>
            <a href="/descobrir">Descobrir</a>
            <a href="/eu360">Eu360</a>
          </div>
        </nav>
      </body>
    </html>
  );
}
