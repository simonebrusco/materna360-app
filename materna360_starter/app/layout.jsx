import '../estilos/globals.css'; // ✅ caminho correto pro seu projeto

export const metadata = {
  title: 'Materna360',
  description: 'Seu dia mais leve, organizado e com carinho.',
};

// ⚠️ themeColor tem que ir em viewport (não em metadata)
export const viewport = {
  themeColor: '#ffffff',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-dvh bg-gradient-to-b from-rose-100 to-white text-[#2F3A56]">
        {children}
      </body>
    </html>
  );
}
