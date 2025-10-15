// app/layout.jsx
import './globals.css';

export const metadata = {
  title: 'Materna360',
  description: 'Seu dia, leve e organizado.',
  // ❌ NADA de themeColor aqui
};

export const viewport = {
  // ✅ Agora o themeColor fica aqui
  themeColor: '#ff005e',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
