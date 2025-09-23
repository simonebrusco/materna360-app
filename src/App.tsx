// src/App.tsx
import { NavLink, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Atividades from "./pages/Atividades";
import BemEstar from "./pages/BemEstar";
import Recursos from "./pages/Recursos";
import Mentoria from "./pages/Mentoria";
import Perfil from "./pages/Perfil";

export default function App() {
  const linkBase = {
    textDecoration: "none",
    padding: "8px 12px",
    borderRadius: 8,
    fontWeight: 600,
  } as const;

  const activeStyle = {
    background: "#ff6a00",
    color: "white",
  };

  return (
    <>
      {/* Topbar de navegação */}
      <header
        style={{
          borderBottom: "1px solid #eee",
          padding: "14px 16px",
          position: "sticky",
          top: 0,
          background: "#fff",
          zIndex: 10,
        }}
      >
        <nav style={{ maxWidth: 1080, margin: "0 auto" }}>
          <ul
            style={{
              display: "flex",
              gap: 12,
              listStyle: "none",
              margin: 0,
              padding: 0,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <li>
              <NavLink
                to="/"
                style={({ isActive }) => ({
                  ...linkBase,
                  color: isActive ? "white" : "#222",
                  ...(isActive ? activeStyle : {}),
                })}
                end
              >
                Início
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/atividades"
                style={({ isActive }) => ({
                  ...linkBase,
                  color: isActive ? "white" : "#222",
                  ...(isActive ? activeStyle : {}),
                })}
              >
                Atividades
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/bem-estar"
                style={({ isActive }) => ({
                  ...linkBase,
                  color: isActive ? "white" : "#222",
                  ...(isActive ? activeStyle : {}),
                })}
              >
                Bem-estar
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/recursos"
                style={({ isActive }) => ({
                  ...linkBase,
                  color: isActive ? "white" : "#222",
                  ...(isActive ? activeStyle : {}),
                })}
              >
                Recursos
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/mentoria"
                style={({ isActive }) => ({
                  ...linkBase,
                  color: isActive ? "white" : "#222",
                  ...(isActive ? activeStyle : {}),
                })}
              >
                Mentoria
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/perfil"
                style={({ isActive }) => ({
                  ...linkBase,
                  color: isActive ? "white" : "#222",
                  ...(isActive ? activeStyle : {}),
                })}
              >
                Perfil
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>

      {/* Conteúdo das rotas */}
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

      {/* Rodapé simples (opcional) */}
      <footer
        style={{
          borderTop: "1px solid #eee",
          padding: "16px",
          textAlign: "center",
          color: "#666",
          marginTop: 24,
        }}
      >
        Materna360 © {new Date().getFullYear()}
      </footer>
    </>
  );
}
