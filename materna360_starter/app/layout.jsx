export const metadata = {
  title: "Materna360",
  description: "Seu hub diário de conexão entre mãe e filhos",
  themeColor: "#ffffff",
};

import "../styles/globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
