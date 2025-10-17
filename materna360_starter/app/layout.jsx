// =======================================================
// Materna360 — Root layout (importa Tailwind/globals)
// =======================================================

import "../styles/globals.css";

export const metadata = {
  title: "Materna360",
  description: "Acolhimento, rotina e desenvolvimento infantil",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-dvh bg-white text-[--m360-navy]">
        {children}
      </body>
    </html>
  );
}
