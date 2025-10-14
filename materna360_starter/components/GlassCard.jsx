export default function GlassCard({ children, className = "" }) {
  return <div className={`rounded-2xl border bg-white/70 backdrop-blur shadow-sm ${className}`}>{children}</div>;
}
