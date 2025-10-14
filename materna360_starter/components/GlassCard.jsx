'use client';
import { motion } from 'framer-motion';

export default function ActionCard({ icon, title, subtitle, highlight }) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`rounded-[var(--radius-2xl)] p-4 text-left border bg-white shadow-soft transition-all
        ${highlight ? "border-brand-primary/40 ring-2 ring-brand-primary/15" : "border-brand-secondary/60"}`}
    >
      <div className="text-2xl mb-2">{icon}</div>
      <div className="font-medium leading-tight">{title}</div>
      <div className="text-sm text-brand-slate">{subtitle}</div>
    </motion.button>
  );
}
