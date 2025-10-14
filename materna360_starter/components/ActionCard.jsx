'use client';
import { motion } from 'framer-motion';

export default function ActionCard({ icon, title, subtitle, highlight }) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`rounded-2xl p-4 text-left border shadow-sm bg-white/90 backdrop-blur transition-all ${
        highlight ? "border-orange-200 ring-2 ring-orange-100" : "border-neutral-200"
      }`}
    >
      <div className="text-2xl mb-2">{icon}</div>
      <div className="font-medium leading-tight tracking-tight">{title}</div>
      <div className="text-sm text-neutral-500">{subtitle}</div>
    </motion.button>
  );
}
