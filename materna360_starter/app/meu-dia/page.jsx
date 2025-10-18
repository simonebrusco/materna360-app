@@
 export default function MeuDiaPage() {
   const { percent } = useChecklistProgress();
@@
-  return (
-    <main className="min-h-screen">
-      {/* Topbar */}
-      <header className="mx-auto max-w-5xl px-5 pt-6 flex items-center justify-between">
+  return (
+    <main className="min-h-screen">
+      {/* Topbar (Glass + sticky) */}
+      <header
+        className={[
+          "sticky top-0 z-30",
+          "m360-glass",                 // bg-white/80 + blur + sombra suave
+          "border-b border-black/5",   // linha sutil
+        ].join(" ")}
+      >
+        <div className="mx-auto max-w-5xl px-5 py-3 flex items-center justify-between">
           <div className="text-sm md:text-base font-medium text-[color:var(--m360-navy)]/70">
             Materna<strong className="text-[var(--m360-primary)]">360</strong>
           </div>
           <Link
             href="/eu360"
             className={[
               "rounded-[999px] bg-[var(--m360-white)]",
               "px-4 py-1.5 text-sm md:text-base",
               "m360-card-border shadow-[var(--elev-1)] hover:shadow-[var(--elev-2)]",
               "transition-all duration-300 ease-[var(--ease-soft)]",
             ].join(" ")}
           >
             Eu360
           </Link>
-      </header>
+        </div>
+      </header>
 
-      {/* Saudação */}
-      <section className="mx-auto max-w-5xl px-5 pt-8">
+      {/* Saudação + ritmo vertical global da página */}
+      <section className="mx-auto max-w-5xl px-5 pt-8 space-y-8">
         <h1 className="text-[28px] md:text-[36px] font-bold text-[var(--m360-navy)]">
           {greeting}, <span className="text-[var(--m360-navy)]">{displayName}</span> 👋
         </h1>
         <p className="mt-2 text-[color:var(--m360-navy)]/60 text-lg md:text-xl">
           Atalhos do dia
         </p>
       </section>
 
       <DailyMessage />
 
-      {/* 👀 Visão rápida da semana (notas + progresso) */}
-      <section className="mx-auto max-w-5xl px-5 mt-2">
+      {/* 👀 Visão rápida da semana (notas + progresso) */}
+      <section className="mx-auto max-w-5xl px-5 mt-2 space-y-8">
         <PlannerNotesPeek />
       </section>
 
       {/* Planner semanal (componente anterior, mantido) */}
-      <section className="mx-auto max-w-5xl px-5 pt-4">
+      <section className="mx-auto max-w-5xl px-5 pt-4 space-y-8">
         <PlannerWeekly />
       </section>
 
       {/* 🗓️ Planner semanal com notas + resumo do dia selecionado */}
-      <section className="mx-auto max-w-5xl px-5 mt-4">
+      <section className="mx-auto max-w-5xl px-5 mt-4 space-y-4">
         <h2 className="text-lg font-semibold mb-2 text-[var(--m360-navy)]">
           Planner
         </h2>
         <PlannerWeeklyNotes />
       </section>
 
       {/* Grid de Atalhos */}
-      <section className="mx-auto max-w-5xl px-5 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
+      <section className="mx-auto max-w-5xl px-5 pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
         <Card emoji="📅" title="Planner da Família" subtitle="Organize suas tarefas" href="/meu-dia/planner" />
         <Card emoji="✅" title="Checklist do Dia" subtitle={`${percent}% concluído hoje`} href="/meu-dia/checklist" />
         <Card emoji="🎨" title="Atividade do Dia" subtitle="Brincadeira educativa" href="/brincar" />
         <Card emoji="🌿" title="Momento para Mim" subtitle="Pausa e autocuidado" href="/cuidar" />
       </section>
 
       {/* Humor do dia (teaser) */}
-      <section className="mx-auto max-w-5xl px-5 pt-6 pb-28">
+      <section className="mx-auto max-w-5xl px-5 pt-6 pb-28">
         <div className="rounded-[var(--r-lg)] bg-[var(--m360-white)] m360-card-border shadow-[var(--elev-1)] p-5 md:p-6 m360-animate-in">
           <h2 className="text-xl md:text-2xl font-semibold text-[var(--m360-navy)]">
             Como você está hoje?
           </h2>
           <p className="mt-1 text-[color:var(--m360-navy)]/60 text-sm">
             Registre seu humor no Eu360
           </p>
