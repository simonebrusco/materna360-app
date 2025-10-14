export default function DailyMessage({ text, author }) {
  return (
    <div>
      <p className="italic text-[15px] leading-relaxed text-brand-primary/90">“{text}”</p>
      {author && <p className="mt-1 text-sm text-brand-primary/80">— {author}</p>}
    </div>
  );
}
