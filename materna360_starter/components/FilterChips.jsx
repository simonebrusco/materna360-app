'use client';

function classNames(...values) {
  return values.filter(Boolean).join(' ');
}

export default function FilterChips({
  zeroMaterial,
  quickOnly,
  onToggleZero,
  onToggleQuick,
  onClear,
  disabled = false,
}) {
  const baseClasses =
    "min-h-10 rounded-2xl border px-4 py-2 text-sm font-medium flex items-center gap-2 transition-colors";
  const inactiveClasses = "bg-white text-brand-ink border-brand-secondary/40";
  const activeClasses = "bg-brand-primary text-white border-brand-primary";
  const disabledClasses = "opacity-60 cursor-not-allowed";

  const tooltipProps = disabled ? { title: "Filtros em breve" } : {};

  const handleToggleZero = () => {
    if (disabled) return;
    onToggleZero?.();
  };

  const handleToggleQuick = () => {
    if (disabled) return;
    onToggleQuick?.();
  };

  const handleClear = () => {
    if (disabled) return;
    onClear?.();
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        role="button"
        aria-pressed={zeroMaterial}
        aria-disabled={disabled}
        onClick={handleToggleZero}
        className={classNames(
          baseClasses,
          zeroMaterial ? activeClasses : inactiveClasses,
          disabled && disabledClasses
        )}
        {...tooltipProps}
      >
        <span aria-hidden className="text-base">🎒</span>
        <span>Zero material</span>
      </button>

      <button
        type="button"
        role="button"
        aria-pressed={quickOnly}
        aria-disabled={disabled}
        onClick={handleToggleQuick}
        className={classNames(
          baseClasses,
          quickOnly ? activeClasses : inactiveClasses,
          disabled && disabledClasses
        )}
        {...tooltipProps}
      >
        <span aria-hidden className="text-base">⏱️</span>
        <span>≤ 10 min</span>
      </button>

      {(zeroMaterial || quickOnly) && !disabled && (
        <button
          type="button"
          role="button"
          aria-pressed="false"
          onClick={handleClear}
          className={classNames(baseClasses, inactiveClasses)}
        >
          Limpar
        </button>
      )}
    </div>
  );
}
