// src/App.tsx
import { BuilderComponent, builder } from '@builder.io/react'
import '@builder.io/react' // mantém side-effects do SDK

// Inicia o SDK do Builder com a sua chave (pegaremos da env da Vite na Vercel)
builder.init(import.meta.env.VITE_BUILDER_API_KEY)

export default function App() {
  return (
    <div>
      {/* NAV simples (opcional). Pode mudar os textos à vontade */}
      <header style={{ display: 'flex', gap: 16, padding: 16 }}>
        <a href="/">Início</a>
        <a href="/atividades">Atividades</a>
        <a href="/bem-estar">Bem-estar</a>
        <a href="/recursos">Recursos</a>
        <a href="/mentoria">Mentoria</a>
        <a href="/perfil">Perfil</a>
      </header>

      {/* O Builder decide o que mostrar com base na URL atual */}
      <BuilderComponent model="page" />
    </div>
  )
}
