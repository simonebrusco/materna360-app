import { Routes, Route } from "react-router-dom";
import BuilderPage from "./pages/BuilderPage";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<BuilderPage />} />
        <Route path="/atividades" element={<BuilderPage />} />
        <Route path="/bem-estar" element={<BuilderPage />} />
        <Route path="/recursos" element={<BuilderPage />} />
        <Route path="/mentoria" element={<BuilderPage />} />
        <Route path="/perfil" element={<BuilderPage />} />
        <Route path="*" element={<BuilderPage />} />
      </Routes>

      <footer style={{ padding: 24, textAlign: "center", color: "#777" }}>
        Materna360 © {new Date().getFullYear()}
      </footer>
    </>
  );
}
