// =======================================================
// Materna360 — Root layout com AppShell e BottomNav
// Mantém ClientInit, ToastHost e aplica o Tailwind global
// Agora usa container Tailwind + max-w-screen-md (padrão)
// =======================================================

import "../styles/globals.css";
import "../styles/m360.css"; // tokens + fundo Soft Luxury
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
      {/* Fundo global Soft Luxury + tokens carregados via m360.css */}
      <body className="m360-screen-bg min-h-dvh text-[--m360-navy] antialiased" suppressHydrationWarning>
        <ClientInit />
        {/* conteúdo principal + respiro para o BottomNav */}
        <div className="min-h-[100dvh] pb-24">
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
