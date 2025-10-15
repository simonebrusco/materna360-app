'use client';

function classNames(...values) {
  return values.filter(Boolean).join(' ');
}

export default function FilterChips({
  zeroMaterial,
  quickOnly,
  indoorOnly,
  onToggleZero,
  onToggleQuick,
  onToggleIndoor,
  onClear,
}) {
  const baseClasses =
    "min-h-10 rounded-2xl border px-4 py-2 text-sm font-medium flex items-center gap-2 transition-colors";
  const inactiveClasses = "bg-white text-brand-ink border-brand-secondary/40";
  const activeClasses = "bg-brand-primary text-white border-brand-primary";

  const showClear = zeroMaterial || quickOnly || indoorOnly;

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        role="switch"
        aria-pressed={zeroMaterial}
        onClick={onToggleZero}
        className={classNames(baseClasses, zeroMaterial ? activeClasses : inactiveClasses)}
      >
        <span aria-hidden className="text-base">🎒</span>
        <span>Zero material</span>
      </button>

      <button
        type="button"
        role="switch"
        aria-pressed={quickOnly}
        onClick={onToggleQuick}
        className={classNames(baseClasses, quickOnly ? activeClasses : inactiveClasses)}
      >
        <span aria-hidden className="text-base">⏱️</span>
        <span>≤ 10 min</span>
      </button>

      <button
        type="button"
        role="switch"
        aria-pressed={indoorOnly}
        onClick={onToggleIndoor}
        className={classNames(baseClasses, indoorOnly ? activeClasses : inactiveClasses)}
      >
        <span aria-hidden className="text-base">🏠</span>
        <span>Dentro de casa</span>
      </button>

      {showClear && (
        <button
          type="button"
          role="button"
          onClick={onClear}
          className={classNames(baseClasses, inactiveClasses)}
        >
          Limpar
        </button>
      )}
    </div>
  );
}
