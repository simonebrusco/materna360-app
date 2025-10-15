"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ActionCard({ icon = "✨", title, subtitle, highlight = false, href = "#" }) {
  const Card = (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className={`rounded-2xl border bg-white p-4 shadow-soft transition
        ${highlight ? "ring-1 ring-brand-primary/20 border-brand-secondary/70" : "border-brand-secondary/60"}`}
    >
      <div className="text-2xl">{icon}</div>
      <div className="mt-2">
        <h3 className="font-medium leading-tight">{title}</h3>
        {subtitle && <p className="text-sm text-brand-slate">{subtitle}</p>}
      </div>
    </motion.div>
  );

  return href ? (
    <Link href={href} className="block focus:outline-none focus:ring-2 focus:ring-brand-primary/30 rounded-2xl">
      {Card}
    </Link>
  ) : Card;
}
