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
                  color: isActive ?

