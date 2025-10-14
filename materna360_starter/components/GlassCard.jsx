export default function GlassCard({ children, className = "" }) {
  return (
    <div className={`rounded-[var(--radius-2xl)] border border-white/60 bg-white/80 backdrop-blur-xs shadow-glass ${className}`}>
      {children}
    </div>
  );
}
