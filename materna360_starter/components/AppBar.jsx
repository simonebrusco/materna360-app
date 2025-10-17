// materna360_starter/components/AppBar.jsx
"use client";

import Link from "next/link";

export default function AppBar({ title = "", backHref = null, right = null }){
  return (
    <div className="container-px pt-5">
      <div className="glass px-4 py-3 flex items-center justify-between">
        <div className="w-[64px]">
          {backHref ? (
            <Link href={backHref} className="btn btn-ghost px-3 py-1.5 radius-xl">
              ←
            </Link>
          ) : null}
        </div>

        <div className="text-base md:text-lg font-semibold text-[color:var(--navy)]">
          {title}
        </div>

        <div className="w-[64px] flex justify-end">
          {right}
        </div>
      </div>
    </div>
  );
}
