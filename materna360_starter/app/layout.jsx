// materna360_starter/app/layout.jsx
import '@/styles/globals.css';

export const metadata = {
  title: 'Materna360',
  description: 'Seu dia, leve e organizado.',
  // NÃO coloque themeColor aqui
};

export const viewport = {
  // theme-color global fica aqui
  themeColor: '#ff005e',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
