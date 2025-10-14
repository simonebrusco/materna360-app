export default function DailyMessage({ text, author }) {
  return (
    <div>
      <p className="italic text-[15px] leading-relaxed text-orange-800">“{text}”</p>
      {author && <p className="mt-1 text-sm text-orange-700">— {author}</p>}
    </div>
  );
}
