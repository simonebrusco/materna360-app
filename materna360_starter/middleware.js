import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith("/admin") || pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  const isAuthed = req.cookies.get("m360_admin")?.value === "1";
  if (!isAuthed) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
