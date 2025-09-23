import { NavLink, Routes, Route } from "react-router-dom";
import BuilderPage from "./pages/BuilderPage";

export default function App() {
  return (
    <>
      {/* Topbar simples só pra navegar entre as rotas */}
      <header style={{ borderBottom: "1px solid #eee", padding: "12px 16px" }}>
        <nav style={{ maxWidth: 1080, margin: "0 auto" }}>
          <ul style={{ display: "flex", gap: 16, listStyle: "none", margin: 0 }}>
            <li><NavLink to="/">Início</NavLink></li>
            <li><NavLink to="/atividades">Atividades</NavLink></li>
            <li><NavLink to="/bem-estar">Bem-estar</NavLink></li>
            <li><NavLink to="/recursos">Recursos</NavLink></li>
            <li><NavLink to="/mentoria">Mentoria</NavLink></li>
            <li><NavLink to="/perfil">Perfil</NavLink></li>
          </ul>
        </nav>
      </header>

      {/* Cada rota pede ao Builder o conteúdo pela URL atual */}
      <Routes>
        <Route path="/" element={<BuilderPage />} />
        <Route path="/atividades" element={<BuilderPage />} />
        <Route path="/bem-estar" element={<BuilderPage />} />
        <Route path="/recursos" element={<BuilderPage />} />
        <Route path="/mentoria" element={<BuilderPage />} />
        <Route path="/perfil" element={<BuilderPage />} />
        {/* fallback: qualquer caminho desconhecido */}
        <Route path="*" element={<BuilderPage />} />
      </Routes>

      <footer style={{ padding: 24, textAlign: "center", color: "#777" }}>
        Materna360 © {new Date().getFullYear()}
      </footer>
    </>
  );
}
