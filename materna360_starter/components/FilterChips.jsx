// materna360_starter/components/FilterChips.jsx
'use client';

import React from 'react';

// Helper simples para juntar classes sem precisar de 'clsx'
function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Componente de chips de filtro acessíveis.
 * Espera um state "filters" (obj) e um setFilters(fn).
 *
 * Exemplo de shape:
 *  filters = {
 *    zeroMaterial: false,
 *    under10: false,
 *    indoor: false,
 *  }
 */
const CHIP_SPEC = [
  { key: 'zeroMaterial', label: 'Zero material', icon: '🧰' },
  { key: 'under10',     label: '≤ 10 min',      icon: '⏱️' },
  { key: 'indoor',      label: 'Dentro de casa', icon: '🏠' },
];

export default function FilterChips({ filters, setFilters, className }) {
  const onToggle = (key) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className={cx('flex flex-wrap items-center gap-2', className)}>
      {CHIP_SPEC.map(({ key, label, icon }) => {
        const active = !!filters?.[key];

        return (
          <button
            key={key}
            type="button"
            // Acessibilidade: usamos "button" com aria-pressed (em vez de role="switch")
            role="button"
            aria-pressed={active}
            onClick={() => onToggle(key)}
            className={cx(
              'px-3 py-[7px] rounded-xl text-[13px] sm:text-[14px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40',
              active
                ? 'bg-brand/10 text-brand-ink/90 border border-brand/20'
                : 'bg-white/70 text-ink/70 border border-ink/10 hover:bg-white'
            )}
          >
            <span className="mr-2">{icon}</span>
            <span className="align-middle">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
