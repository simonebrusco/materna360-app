export default function Goal({ label, done }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-full border ${done ? "bg-rose-50 border-rose-200" : "bg-neutral-50 border-neutral-200"}`}>
      <span className="text-rose-500">{done ? "❤️" : "🤍"}</span>
      <span className="text-sm">{label}</span>
    </div>
  );
}
