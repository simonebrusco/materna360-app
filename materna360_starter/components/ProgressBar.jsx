// components/ProgressBar.jsx
export default function ProgressBar({ value = 0 }) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
      <div className="h-full bg-brand rounded-full transition-all" style={{ width: `${pct}%` }} />
    </div>
  );
}
