import "../styles/globals.css";
import { Poppins, Quicksand } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-title",
});
const quick = Quicksand({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

export const metadata = {
  title: "Meu Dia • Materna360",
  description: "Seu centro diário com brincadeiras, planner e autocuidado.",
  themeColor: "#ff005e",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${poppins.variable} ${quick.variable}`}>
      <body className="font-[var(--font-body)] text-brand-ink bg-gradient-to-b from-brand-secondary via-white to-white">
        {children}
      </body>
    </html>
  );
}
