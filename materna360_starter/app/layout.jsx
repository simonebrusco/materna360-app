// materna360_starter/app/layout.jsx
import "./globals.css";
import dynamic from "next/dynamic";

// Componentes client-only (evita SSR/hidratação indevida)
const ClientInit = dynamic(() => import("../components/ClientInit.jsx"), { ssr: false });
const BottomNav  = dynamic(() => import("../components/BottomNav.jsx"),  { ssr: false });

// 🔔 Host de toasts (escuta 'm360:toast' e renderiza os toasts na tela)
const ToastHost  = dynamic(() => import("../components/ToastHost.jsx"),  { ssr: false });

export const metadata = {
  title: "Materna360",
  description:
    "Bem-vinda ao seu cantinho de rotina leve, brincadeiras e autocuidado.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      {/* suppressHydrationWarning evita alertas caso algo do lado do cliente mude no load */}
      <body className="bg-[#F5F5F5] text-[#1E1E1E] antialiased" suppressHydrationWarning>
        {/* Inicialização global de listeners/telemetria/gamificação (client-only) */}
        <ClientInit />

        {/* Conteúdo das páginas (reservando espaço pro BottomNav fixo) */}
        <div className="min-h-[100dvh] pb-24">
          {children}
        </div>

        {/* Host de toasts globais — fica fixo e escuta eventos 'm360:toast' */}
        <ToastHost />

        {/* Bottom navigation fixo, único para o app inteiro (client-only) */}
        <BottomNav />

        {/* Mensagem simples para quem estiver com JS desativado */}
        <noscript>
          Habilite o JavaScript para usar o Materna360.
        </noscript>
      </body>
    </html>
  );
}
