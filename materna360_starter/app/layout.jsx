// materna360_starter/app/layout.jsx
// =======================================================
// Materna360 — Root layout com AppShell e BottomNav
// Aplica o fundo Soft Luxury global (m360-screen-bg) e tokens
// Mantém ClientInit, ToastHost e compatibilidade com App Router
// =======================================================

import "../styles/globals.css";
import dynamic from "next/dynamic";

const ClientInit = dynamic(() => import("../components/ClientInit.jsx"), { ssr: false });
const BottomNav  = dynamic(() => import("../components/BottomNav.jsx"),  { ssr: false });
const ToastHost  = dynamic(() => import("../components/ToastHost.jsx"),  { ssr: false });

export const metadata = {
  title: "Materna360",
  description: "Bem-vinda ao seu cantinho de rotina leve, brincadeiras e autocuidado.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      {/* 🔴 troca principal: aplicar m360-screen-bg no body */}
      <body
        className={[
          "min-h-dvh",
          "m360-screen-bg",                 // <<< fundo Soft Luxury global
          "text-[var(--m360-navy)]",
          "antialiased",
        ].join(" ")}
        suppressHydrationWarning
      >
        <ClientInit />

        {/* conteúdo principal + respiro para o BottomNav */}
        <div className="min-h-[100dvh] pb-24">
          {/* container responsivo padrão do projeto */}
          <main className="container mx-auto max-w-screen-md px-4 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>

        <BottomNav />
        <ToastHost />
      </body>
    </html>
  );
}
