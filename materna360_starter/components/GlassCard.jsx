export default function GlassCard({ className = "", children }) {
  return (
    <div
      className={[
        "bg-[var(--m360-white)]",
        "rounded-[var(--r-lg)]",
        "shadow-[var(--elev-1)] hover:shadow-[var(--elev-2)]",
        "transition-all duration-300 ease-[var(--ease-soft)]",
        "p-4 sm:p-6",
        "m360-animate-in",
        "m360-card-border",
        "focus:outline-none focus-visible:m360-focus",
        className,
      ].join(" ")}
      tabIndex={0}
      role="group"
    >
      {children}
    </div>
  );
}
