// app/layout.jsx
import "./globals.css";
import Toaster from "../components/Toaster";
import BottomNav from "../components/BottomNav";

export const metadata = { title: "Materna360", description: "App" };

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="antialiased bg-[var(--bg)] text-[var(--text)]">
        {/* padding-bottom para não ficar atrás do menu */}
        <div className="container-px py-6 pb-28">{children}</div>
        <BottomNav />
        <Toaster />
      </body>
    </html>
  );
}
