// app/layout.jsx
import '@/styles/globals.css'; // <<--- caminho correto para o seu projeto

export const metadata = {
  title: 'Materna360',
  description: 'Seu dia, leve e organizado.',
  // NADA de themeColor aqui
};

export const viewport = {
  themeColor: '#ff005e', // fica aqui no viewport
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
