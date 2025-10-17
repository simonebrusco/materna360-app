// =======================================================
// Materna360 — Root layout com AppShell e BottomNav
// Mantém ClientInit, ToastHost e aplica o Tailwind global
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
      <body className="min-h-dvh bg-[--m360-white] text-[--m360-navy] antialiased" suppressHydrationWarning>
        <ClientInit />
        {/* conteúdo principal + respiro para o BottomNav */}
        <div className="min-h-[100dvh] pb-24">
          {children}
        </div>
        <BottomNav />
        <ToastHost />
      </body>
    </html>
  );
}
