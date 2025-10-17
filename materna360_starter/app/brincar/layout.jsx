// =======================================================
// Materna360 — Layout do segmento /brincar
// Envolve a página com o AppPageShell para normalizar
// largura, padding e alinhamento — sem mexer no conteúdo.
// =======================================================

import AppPageShell from "../../components/AppPageShell.jsx";

export default function BrincarLayout({ children }) {
  return <AppPageShell>{children}</AppPageShell>;
}
