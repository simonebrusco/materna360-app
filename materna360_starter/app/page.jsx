'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";

export default function HomePage() {
  // Estados do check-in
  const [showMoodPicker, setShowMoodPicker] = useState(false);
  const [moodTip, setMoodTip] = useState("");
  const [toast, setToast] = useState("");

  async function saveMood(moodKey) {
    const moodMessages = {
      sad:    "Tudo bem ir devagar hoje. Experimente 2 min de respiração em Cuidar. 💗",
      neutral:"Que tal algo leve de 5 min? Tenho uma ideia em Brincar. 🙂",
      ok:     "Você está estável — escolha uma pequena ação para manter o ritmo. 💪",
      happy:  "Que delícia! Registre um momento com seu filho para lembrar depois. ✨",
      super:  "Uhul! Aproveite para planejar algo especial hoje. 🎉",
    };

    try {
      await supabase.from("mood_checkins").insert({ mood: moodKey });
      setToast("Check-in salvo!");
      setMoodTip(moodMessages[moodKey] || "");
    } catch {
      setToast("Não deu para salvar agora. Tente novamente.");
    } finally {
      setTimeout(() => setToast(""), 2200);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-secondary via-white to-white text-brand-ink">
      {/* App bar */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-xs border-b border-white/60">
        <div className="mx-auto max-w-md px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo-header.png" alt="Materna360" className="h-7 w-auto" />
          </div>
          <a
            href="/eu360"
            className="text-sm rounded-full px-3 py-1 bg-white border border-brand-secondary/60 text-brand-slate hover:bg-brand-secondary/40 transition"
          >
            Eu360
          </a>
        </div>
      </div>

      {/* CONTEÚDO */}
      <div className="mx-auto max-w-md px-4 py-6 space-y-10">
        {/* CHECK-IN bem visível */}
        <section>
          <div className="rounded-2xl bg-white border-2 border-brand-primary/30 shadow-lg p-4">
            <h1 className="text-2xl font-semibold mb-3">Meu Dia</h1>

            <h3 className="font-medium">Como você está hoje?</h3>
            <p className="text-sm text-brand-slate mt-1">Registre seu humor de hoje</p>

            {!showMoodPicker && (
              <div className="mt-3">
                <button
                  onClick={() => setShowMoodPicker(true)}
                  className="rounded-xl bg-brand-primary text-white px-4 py-2 text-sm"
                >
                  Registrar
                </button>
              </div>
            )}

            {showMoodPicker && (
              <div className="mt-3 flex gap-3 text-2xl">
                {["😞","😐","🙂","😊","🤩"].map((emoji, i) => {
                  const keys = ["sad","neutral","ok","happy","super"];
                  const key = keys[i];
                  return (
                    <motion.button
                      key={key}
                      className="hover:scale-110 active:scale-95 transition-transform"
                      whileTap={{ scale: 0.9 }}
                      onClick={() => saveMood(key)}
                      aria-label={`mood-${key}`}
                      title={`mood-${key}`}
                    >
                      {emoji}
                    </motion.button>
                  );
                })}
              </div>
            )}

            {moodTip && (
              <div className="mt-3 text-sm text-brand-ink">{moodTip}</div>
            )}
          </div>
        </section>

        {/* Dica temporária de navegação */}
        <div className="text-center text-sm text-brand-slate">
          Use o menu abaixo para navegar • Agora o check-in deve aparecer ✅
        </div>
      </div>

      {/* Bottom nav */}
      <nav className="sticky bottom-4 mx-auto max-w-md">
        <div className="mx-4 rounded-2xl bg-white/90 backdrop-blur-xs border border-white/60 shadow-soft">
          <ul className="grid grid-cols-4 text-center text-sm">
            {[
              { label: "Meu Dia",  icon: "🏡", href: "/" },
              { label: "Brincar",  icon: "🎯", href: "/brincar" },
              { label: "Cuidar",   icon: "🧘", href: "/cuidar" },
              { label: "Eu360",    icon: "👤", href: "/eu360" },
            ].map((t, i) => (
              <li key={i} className="py-3 flex flex-col items-center gap-1">
                <a href={t.href} className="text-lg">{t.icon}</a>
                <span className={`text-[11px] ${i === 0 ? "font-medium" : "text-brand-slate"}`}>
                  {t.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Toast */}
      {toast && (
        <div className="fixed inset-x-0 bottom-20 mx-auto max-w-md px-4">
          <div className="rounded-xl bg-brand-primary text-white px-3 py-2 text-sm text-center shadow-soft">
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}
