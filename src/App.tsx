import { BuilderComponent, builder } from '@builder.io/react'

// inicializa o Builder com a chave da Vite (variável de ambiente)
builder.init(import.meta.env.VITE_BUILDER_API_KEY)

export default function App() {
  return (
    <div className="min-h-screen">
      {/* Renderiza a página "/" criada no Builder */}
      <BuilderComponent model="page" />
    </div>
  )
}
