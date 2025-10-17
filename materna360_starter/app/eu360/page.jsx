 // topo do arquivo
 import AppBar from "../../components/AppBar";
 import GlassCard from "../../components/GlassCard";
 import { get, set, keys } from "../../lib/storage";
+import MoodCheckin from "../../components/MoodCheckin";

 // ... dentro do JSX, depois do banner:
   <section className="mt-4 rounded-2xl p-5 bg-[var(--brand)]/10 ring-1 ring-[var(--brand)]/15">
     <h1 className="text-xl font-semibold text-[var(--brand-navy)]">
       Você é importante 💛 — siga no seu ritmo.
     </h1>
     <p className="mt-1 text-sm subtitle">
       Um espaço para celebrar conquistas, cuidar do humor e agradecer o dia.
     </p>
+    <div className="mt-3">
+      <MoodCheckin />
+    </div>
   </section>
