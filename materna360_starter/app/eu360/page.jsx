import PlannerTabs from "@/components/PlannerTabs";
import AppBar from "@/components/AppBar";
import BottomNav from "@/components/BottomNav";

export default function Eu360Page() {
  return (
    <main className="mx-auto max-w-md">
      <AppBar title="Eu360" backHref="/" />

      <div className="px-4 py-6 space-y-6">
        <h1 className="text-2xl font-semibold">Eu360</h1>
        <p className="text-brand-slate">Preferências e seu Planner diário por abas.</p>

        <section className="space-y-3">
          <h2 className="font-medium">Planner da Família</h2>
          <PlannerTabs />
        </section>
      </div>

      <BottomNav />
    </main>
  );
}
