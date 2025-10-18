/* eslint-disable */
// lib/persistM360.js
// Persistência de Planner (notes) e Awards com fallback automático para localStorage.

import { getSupabase } from "@/lib/supaClient"; // ✅ alias estável

// ===== LocalStorage helpers =====
const K_NOTES = "m360:planner_notes";   // { "yyyy-mm-dd": "texto\n..." }
const K_AWARDS = "m360:awards_log";     // { items: [{id, ts, label, emoji}], lastTs: number }

function isBrowser(){ return typeof window !== "undefined"; }
function readLS(key, fb){
  if(!isBrowser()) return fb;
  try{ const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fb; }catch{ return fb; }
}
function writeLS(key, val){
  if(!isBrowser()) return;
  localStorage.setItem(key, JSON.stringify(val));
}

// ===== Supabase tables =====
const TB_NOTES = "planner_notes";
const TB_AWARDS = "awards_log";

// ===== Public API (Planner) =====
export async function getPlannerNotes(userId) {
  const local = readLS(K_NOTES, {});
  const supa = getSupabase();
  if (!userId || !supa) return local;

  try {
    const { data, error } = await supa
      .from(TB_NOTES)
      .select("day, notes, updated_at")
      .order("day", { ascending: true });

    if (error || !Array.isArray(data)) return local;

    const merged = { ...local };
    for (const row of data) {
      const day = row.day;
      const notes = row.notes || "";
      if (!merged[day] || String(merged[day]).trim().length === 0) {
        merged[day] = notes;
      }
    }
    writeLS(K_NOTES, merged);
    return merged;
  } catch {
    return local;
  }
}

export async function setPlannerNote(userId, dayKey, text) {
  const local = readLS(K_NOTES, {});
  local[dayKey] = String(text || "");
  writeLS(K_NOTES, local);
  safeDispatch("m360:planner:changed");

  const supa = getSupabase();
  if (!userId || !supa) return { ok: true, via: "local" };

  try {
    const { error } = await supa
      .from(TB_NOTES)
      .upsert({ user_id: userId, day: dayKey, notes: local[dayKey] }, { onConflict: "user_id,day" });
    if (error) return { ok: true, via: "local", error };
    return { ok: true, via: "supabase" };
  } catch (e) {
    return { ok: true, via: "local", error: e };
  }
}

export async function upsertPlannerNotes(userId, notesMap) {
  const local = readLS(K_NOTES, {});
  const merged = { ...local, ...(notesMap || {}) };
  writeLS(K_NOTES, merged);
  safeDispatch("m360:planner:changed");

  const supa = getSupabase();
  if (!userId || !supa) return { ok: true, via: "local" };

  try {
    const rows = Object.entries(notesMap || {}).map(([day, notes]) => ({
      user_id: userId, day, notes: String(notes || "")
    }));
    if (!rows.length) return { ok: true, via: "local" };
    const { error } = await supa.from(TB_NOTES).upsert(rows, { onConflict: "user_id,day" });
    if (error) return { ok: true, via: "local", error };
    return { ok: true, via: "supabase" };
  } catch (e) {
    return { ok: true, via: "local", error: e };
  }
}

// ===== Public API (Awards / Conquistas) =====
export async function getAwardsLog(userId) {
  const local = readLS(K_AWARDS, { items: [], lastTs: 0 });
  const supa = getSupabase();
  if (!userId || !supa) return local;

  try {
    const { data, error } = await supa
      .from(TB_AWARDS)
      .select("id, ts, label, emoji")
      .order("ts", { ascending: false })
      .limit(100);

    if (error || !Array.isArray(data)) return local;

    const existingKeys = new Set(local.items.map(i => `${i.id}-${new Date(i.ts).toISOString()}`));
    const mergedItems = [...local.items];

    for (const row of data) {
      const key = `${row.id}-${new Date(row.ts).toISOString()}`;
      if (!existingKeys.has(key)) {
        mergedItems.push({
          id: row.id,
          ts: new Date(row.ts).getTime(),
          label: row.label || `Conquista: ${row.id}`,
          emoji: row.emoji || "🏅",
        });
      }
    }

    const out = { items: mergedItems.sort((a,b)=>b.ts-a.ts).slice(0, 200), lastTs: Date.now() };
    writeLS(K_AWARDS, out);
    return out;
  } catch {
    return local;
  }
}

export async function appendAward(userId, award) {
  const s = readLS(K_AWARDS, { items: [], lastTs: 0 });
  s.items.unshift({
    id: award.id,
    ts: award.ts || Date.now(),
    label: award.label || `Conquista: ${award.id}`,
    emoji: award.emoji || "🏅",
  });
  s.items = dedupeDailyPerId(s.items).slice(0, 200);
  s.lastTs = Date.now();
  writeLS(K_AWARDS, s);
  safeDispatch("m360:awards:changed");

  const supa = getSupabase();
  if (!userId || !supa) return { ok: true, via: "local" };

  try {
    const { error } = await supa.from(TB_AWARDS).insert({
      user_id: userId,
      id: award.id,
      ts: new Date((award.ts || Date.now())),
      label: award.label || null,
      emoji: award.emoji || null,
    });
    if (error) return { ok: true, via: "local", error };
    return { ok: true, via: "supabase" };
  } catch (e) {
    return { ok: true, via: "local", error: e };
  }
}

// ===== Helpers =====
function safeDispatch(name){ try{ if(isBrowser()) window.dispatchEvent(new CustomEvent(name)); }catch{} }
function dedupeDailyPerId(arr){
  const seen = new Set(); const out=[];
  for (const it of arr){
    const k = `${it.id}-${new Date(it.ts).toDateString()}`;
    if (!seen.has(k)){ seen.add(k); out.push(it); }
  }
  return out;
}
