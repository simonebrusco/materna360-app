import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("activities")
    .select("id, title, subtitle, icon, highlight, sort")
    .order("sort", { ascending: true });
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(req) {
  const items = await req.json(); // array de atividades
  const { data, error } = await supabaseAdmin
    .from("activities")
    .upsert(items.map(a => ({
      id: a.id ?? undefined,
      title: a.title,
      subtitle: a.subtitle ?? null,
      icon: a.icon ?? "✨",
      highlight: !!a.highlight,
      sort: a.sort ?? 0
    })))
    .select();
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ data });
}
