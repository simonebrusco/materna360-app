// materna360_starter/components/GlassCard.jsx
export default function GlassCard({ className = "", children }){
  return (
    <div className={`glass p-5 md:p-6 ${className}`}>{children}</div>
  );
}
