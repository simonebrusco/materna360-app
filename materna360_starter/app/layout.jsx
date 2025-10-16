// materna360_starter/app/layout.jsx
import "./globals.css"; // <- ESSENCIAL para o Tailwind carregar
import dynamic from "next/dynamic";

// Metadados básicos
export const metadata = {
  title: "Materna360",
  description:
    "Bem-vinda ao seu cantinho de rotina leve, brincadeiras e autocuidado.",
};

// Carrega componentes client-only sem SSR para evitar hidratação quebrada
const ClientInit = dynamic(() => import("../components/ClientInit.jsx"), { ssr: false });
const BottomNav  = dynamic(() => import("../components/BottomNav.jsx"),  { ssr: false });
const ToastHost  = dynamic(() => import("../components/ToastHost.jsx"),  { ssr: false });

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body
        className="min-h-screen antialiased bg-[var(--brand-white)] text-[var(--brand-navy)]"
        suppressHydrationWarning
      >
        {/* Inicialização global (badges, listeners, etc) */}
        <ClientInit />

        {/* Conteúdo (reserva espaço pro BottomNav fixo) */}
        <div className="min-h-[100dvh] pb-24">
          {children}
        </div>

        {/* Navegação fixa + host de toasts */}
        <BottomNav />
        <ToastHost />

        <noscript>Habilite o JavaScript para usar o Materna360.</noscript>
      </body>
    </html>
  );
}
