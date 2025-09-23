// src/App.tsx
import { Routes, Route } from "react-router-dom";
import BuilderPage from "./pages/BuilderPage";

export default function App() {
  return (
    <main style={{ maxWidth: 1080, margin: "0 auto", padding: 16 }}>
      <Routes>
        <Route path="/" element={<BuilderPage />} />
        <Route path="/atividades" element={<BuilderPage />} />
        <Route path="/bem-estar" element={<BuilderPage />} />
        <Route path="/recursos" element={<BuilderPage />} />
        <Route path="/mentoria" element={<BuilderPage />} />
        <Route path="/perfil" element={<BuilderPage />} />
        <Route path="*" element={<BuilderPage />} />
      </Routes>
    </main>
  );
}
