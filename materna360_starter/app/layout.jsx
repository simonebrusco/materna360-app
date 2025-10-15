// materna360_starter/app/layout.jsx
import '@/styles/globals.css'; // ✅ caminho correto e estável

export const metadata = {
  title: 'Materna360',
  description: 'Seu dia mais leve, organizado e com carinho.',
};

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
