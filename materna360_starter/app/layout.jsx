export const metadata = {
  title: "Materna360",
  description: "Seu dia com mais leveza",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="
        min-h-screen
        text-slate-900 antialiased
        bg-[linear-gradient(180deg,#FFE1E6_0%,#FDE3E6_100%)]
      ">
        {children}
      </body>
    </html>
  );
}
