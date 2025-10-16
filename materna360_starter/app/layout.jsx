// ... seus imports existentes
import dynamic from "next/dynamic";
const ClientInit = dynamic(() => import("../components/ClientInit.jsx"), { ssr: false });
const BottomNav  = dynamic(() => import("../components/BottomNav.jsx"),  { ssr: false });
const ToastHost  = dynamic(() => import("../components/ToastHost.jsx"),  { ssr: false });

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="bg-[#F5F5F5] text-[#1E1E1E] antialiased" suppressHydrationWarning>
        <ClientInit />
        <div className="min-h-[100dvh] pb-24">{children}</div>
        <BottomNav />
        <ToastHost /> {/* ⬅️ host de toast */}
        <noscript>Habilite o JavaScript para usar o Materna360.</noscript>
      </body>
    </html>
  );
}
