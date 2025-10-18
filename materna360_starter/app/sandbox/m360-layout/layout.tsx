// Sandbox layout exclusivo para testar o visual
import "@/styles/m360.css";

export const metadata = { title: "Sandbox M360 Layout" };

export default function SandboxM360Layout({ children }: { children: React.ReactNode }) {
  return <div className="m360-screen-bg min-h-dvh">{children}</div>;
}
