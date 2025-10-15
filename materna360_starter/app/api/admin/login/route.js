import { NextResponse } from "next/server";

export async function POST(req) {
  const { password } = await req.json();
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ ok: false, error: "Senha inválida" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  // cookie httpOnly, 12 horas
  res.cookies.set("m360_admin", "1", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 12,
    path: "/",
  });
  return res;
}
