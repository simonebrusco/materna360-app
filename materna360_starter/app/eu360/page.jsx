import PlannerTabs from "@/components/PlannerTabs";

export const metadata = { title: "Eu360 • Materna360" };

export default function Eu360Page() {
  return (
    <main className="mx-auto max-w-md px-4 py-6 space-y-6">
      <h1 className="text-2xl font-semibold">Eu360</h1>
      <p className="text-brand-slate">Preferências e seu Planner diário por abas.</p>

      <section className="space-y-3">
        <h2 className="font-medium">Planner da Família</h2>
        <PlannerTabs />
      </section>
    </main>
  );
}
