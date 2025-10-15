export default function Loading() {
  return (
    <div className="mx-auto max-w-md px-4 py-6 space-y-4 animate-pulse">
      <div className="h-6 w-40 rounded bg-brand-secondary/60" />
      <div className="h-24 rounded-2xl bg-brand-secondary/60" />
      <div className="grid grid-cols-2 gap-3">
        <div className="h-24 rounded-2xl bg-brand-secondary/60" />
        <div className="h-24 rounded-2xl bg-brand-secondary/60" />
        <div className="h-24 rounded-2xl bg-brand-secondary/60" />
        <div className="h-24 rounded-2xl bg-brand-secondary/60" />
      </div>
    </div>
  );
}
