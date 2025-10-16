// app/layout.jsx
import "./globals.css";

// 🔸 inicializa o listener de gamificação no cliente
import ClientInit from "../components/ClientInit.jsx";

// 🔸 bottom nav global (um único menu em todas as páginas)
import BottomNav from "../components/BottomNav.jsx";

export const metadata = {
  title: "Materna360",
  description: "Bem-vinda ao seu cantinho de rotina leve, brincadeiras e autocuidado.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="bg-[#F5F5F5] text-[#1E1E1E] antialiased">
        {/* Inicialização global do listener de badges */}
        <ClientInit />

        {/* Conteúdo das páginas (deixa espaço pro bottom nav) */}
        <div className="min-h-[100dvh] pb-24">
          {children}
        </div>

        {/* Bottom navigation fixo */}
        <BottomNav />
      </body>
    </html>
  );
}
