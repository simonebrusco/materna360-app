import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("goals")
    .select("id, label, sort")
    .order("sort", { ascending: true });
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(req) {
  const items = await req.json(); // array de metas
  const { data, error } = await supabaseAdmin
    .from("goals")
    .upsert(items.map(g => ({
      id: g.id ?? undefined,
      label: g.label,
      sort: g.sort ?? 0
    })))
    .select();
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ data });
}
