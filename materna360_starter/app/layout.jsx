// app/layout.jsx
import "./globals.css"; // ⬅️ IMPORTANTE: garante que o CSS carregue

export const metadata = {
  title: "Materna360",
  description: "Um app feito para mães reais: que organiza, inspira e acolhe.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-dvh bg-m360">
        <div className="m360-container py-6">{children}</div>
      </body>
    </html>
  );
}
