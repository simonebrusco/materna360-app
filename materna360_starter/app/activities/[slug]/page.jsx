import GlassCard from "@/components/GlassCard";

export default function ActivityDetail({ params }) {
  const { slug } = params;
  return (
    <main className="mx-auto max-w-md px-4 py-6 space-y-4">
      <h1 className="text-2xl font-semibold capitalize">{slug.replace(/-/g, " ")}</h1>
      <GlassCard className="p-4">
        <p className="text-brand-slate">
          (Em breve) Conteúdo dinâmico da atividade <strong>{slug}</strong> vindo do Supabase.
        </p>
      </GlassCard>
    </main>
  );
}
