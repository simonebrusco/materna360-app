import { NavLink, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Atividades from "./pages/Atividades";
import BemEstar from "./pages/BemEstar";
import Recursos from "./pages/Recursos";
import Mentoria from "./pages/Mentoria";
import Perfil from "./pages/Perfil";

export default function App() {
  return (
    <>
      {/* Topbar simples só pra navegar entre as rotas */}
      <header style={{ borderBottom: "1px solid #eee" }}>
        <nav style={{ maxWidth: 1080, margin: "0 auto", padding: "12px 16px" }}>
          <ul style={{ display: "flex", gap: 16, listStyle: "none", margin: 0 }}>
            <li><NavLink to="/" end>Início</NavLink></li>
            <li><NavLink to="/atividades">Atividades</NavLink></li>
            <li><NavLink to="/bem-estar">Bem-estar</NavLink></li>
            <li><NavLink to="/recursos">Recursos</NavLink></li>
            <li><NavLink to="/mentoria">Mentoria</NavLink></li>
            <li><NavLink to="/perfil">Perfil</NavLink></li>
          </ul>
        </nav>
      </header>

      <main style={{ maxWidth: 1080, margin: "0 auto", padding: 16 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/atividades" element={<Atividades />} />
          <Route path="/bem-estar" element={<BemEstar />} />
          <Route path="/recursos" element={<Recursos />} />
          <Route path="/mentoria" element={<Mentoria />} />
          <Route path="/perfil" element={<Perfil />} />
          {/* fallback: qualquer caminho desconhecido volta pra Home */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
    </>
  );
}
