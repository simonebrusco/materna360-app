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
      <body className="min-h-screen bg-gradient-to-b from-[#FFE0EA] to-[#FFF6FA] text-[#1A2240]">
        {/* conteúdo das páginas */}
        <div className="pb-28">{children}</div>

        {/* nav fixa para TODAS as rotas */}
        <BottomNav />
      </body>
    </html>
  );
}
