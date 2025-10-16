// materna360_starter/app/layout.jsx
import "./globals.css";
import BottomNav from "@/components/BottomNav";

export const metadata = {
  title: "Materna360",
  description: "Seu dia, do seu jeito",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      {/* Fundo global e cor de texto */}
      <body className="min-h-dvh m360-bg text-[#1A2240] antialiased">
        {/* Conteúdo da página com espaço para a nav fixa */}
        <div className="pb-28">{children}</div>
        <BottomNav />
      </body>
    </html>
  );
}
