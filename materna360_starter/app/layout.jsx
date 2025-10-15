// materna360_starter/app/layout.jsx
import '@/styles/globals.css';

export const metadata = {
  title: 'Materna360',
  description: 'Seu dia, leve e organizado.',
  // nada de themeColor aqui
};

export const viewport = {
  themeColor: '#ff005e', // cor principal
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
