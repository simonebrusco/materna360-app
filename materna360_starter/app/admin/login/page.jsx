'use client';
import { useState } from "react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) window.location.href = "/admin";
    else setError("Senha incorreta.");
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-b from-brand-secondary via-white to-white">
      <form onSubmit={onSubmit} className="w-[360px] bg-white rounded-2xl p-6 border border-brand-secondary/60 shadow-soft">
        <h1 className="text-xl font-semibold mb-4">Admin • Materna360</h1>
        <label className="text-sm text-brand-slate">Senha</label>
        <input
          type="password"
          className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 border-brand-secondary/70 focus:ring-brand-primary/30"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />
        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        <button className="mt-4 w-full rounded-xl bg-brand-primary text-white py-2 font-medium">Entrar</button>
      </form>
    </div>
  );
}
