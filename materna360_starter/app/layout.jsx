// app/layout.jsx
import "./globals.css";
import Toaster from "../components/Toaster";

export const metadata = { title: "Materna360", description: "App" };

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="antialiased bg-[var(--bg)] text-[var(--text)]">
        <div className="container-px py-6">
          {children}
        </div>

        {/* Mantemos apenas o toaster de selos; 
           o bottom bar antigo do projeto continua sendo o único */}
        <Toaster />
      </body>
    </html>
  );
}
