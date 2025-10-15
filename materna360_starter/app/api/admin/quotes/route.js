import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const now = new Date().toISOString();
  const { data, error } = await supabaseAdmin
    .from("daily_quotes")
    .select("id, text, author, starts_at, ends_at")
    .order("starts_at", { ascending: false })
    .limit(20);
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(req) {
  const body = await req.json();
  const payload = {
    id: body.id ?? undefined,
    text: body.text,
    author: body.author || null,
    starts_at: body.starts_at,
    ends_at: body.ends_at,
  };
  const { data, error } = await supabaseAdmin
    .from("daily_quotes")
    .upsert(payload)
    .select()
    .single();
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ data });
}
