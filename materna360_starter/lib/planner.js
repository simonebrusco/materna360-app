import { supabase } from "./supabaseClient";

const TABLE_NAME = "planner_tasks";
const STORAGE_PREFIX = "m360:planner:";
const SCOPES = ["casa", "filhos", "eu"];

let schemaAvailable = true;

const isClient = () => typeof window !== "undefined";

const isSchemaError = (error) => {
  if (!error) return false;
  const message = (error.message || "").toLowerCase();
  const code = (error.code || "").toUpperCase();

  return (
    code === "42P01" ||
    code === "42703" ||
    message.includes("relation") ||
    message.includes("table") ||
    message.includes("column")
  );
};

const getStorageKey = (scope) => `${STORAGE_PREFIX}${scope}`;

const readLocalTasks = (scope) => {
  if (!isClient()) return [];
  const raw = window.localStorage.getItem(getStorageKey(scope));
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn("planner.localStorage.parse", error);
    return [];
  }
};

const writeLocalTasks = (scope, tasks) => {
  if (!isClient()) return;
  window.localStorage.setItem(getStorageKey(scope), JSON.stringify(tasks));
};

const getLocalTaskById = (id) => {
  if (!isClient()) return null;
  for (const scope of SCOPES) {
    const task = readLocalTasks(scope).find((item) => item.id === id);
    if (task) return { task, scope };
  }
  return null;
};

const generateId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

export const isLocalFallback = () => !schemaAvailable;

const applySchemaError = (error) => {
  if (isSchemaError(error)) {
    schemaAvailable = false;
    return true;
  }
  return false;
};

export const listTasks = async (scope) => {
  if (!schemaAvailable) {
    return readLocalTasks(scope);
  }

  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("id, title, scope, due_date, done")
      .eq("scope", scope)
      .order("created_at", { ascending: true });

    if (error) {
      if (applySchemaError(error)) {
        return readLocalTasks(scope);
      }
      throw error;
    }

    return data ?? [];
  } catch (error) {
    if (applySchemaError(error)) {
      return readLocalTasks(scope);
    }
    throw error;
  }
};

export const addTask = async ({ title, scope, due_date }) => {
  const sanitizedScope = SCOPES.includes(scope) ? scope : "casa";
  const payload = {
    title,
    scope: sanitizedScope,
    due_date: due_date || null,
    done: false,
  };

  if (!schemaAvailable) {
    const task = { ...payload, id: generateId() };
    const existing = readLocalTasks(sanitizedScope);
    writeLocalTasks(sanitizedScope, [...existing, task]);
    return task;
  }

  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert(payload)
      .select("id, title, scope, due_date, done")
      .single();

    if (error) {
      if (applySchemaError(error)) {
        const task = { ...payload, id: generateId() };
        const existing = readLocalTasks(sanitizedScope);
        writeLocalTasks(sanitizedScope, [...existing, task]);
        return task;
      }
      throw error;
    }

    return data;
  } catch (error) {
    if (applySchemaError(error)) {
      const task = { ...payload, id: generateId() };
      const existing = readLocalTasks(sanitizedScope);
      writeLocalTasks(sanitizedScope, [...existing, task]);
      return task;
    }
    throw error;
  }
};

export const toggleDone = async (id, done) => {
  if (!schemaAvailable) {
    const info = getLocalTaskById(id);
    if (!info) return null;
    const { scope, task } = info;
    const next = readLocalTasks(scope).map((item) =>
      item.id === id ? { ...item, done } : item
    );
    writeLocalTasks(scope, next);
    return { ...task, done };
  }

  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update({ done })
      .eq("id", id)
      .select("id, title, scope, due_date, done")
      .single();

    if (error) {
      if (applySchemaError(error)) {
        const info = getLocalTaskById(id);
        if (!info) return null;
        const { scope, task } = info;
        const next = readLocalTasks(scope).map((item) =>
          item.id === id ? { ...item, done } : item
        );
        writeLocalTasks(scope, next);
        return { ...task, done };
      }
      throw error;
    }

    return data;
  } catch (error) {
    if (applySchemaError(error)) {
      const info = getLocalTaskById(id);
      if (!info) return null;
      const { scope, task } = info;
      const next = readLocalTasks(scope).map((item) =>
        item.id === id ? { ...item, done } : item
      );
      writeLocalTasks(scope, next);
      return { ...task, done };
    }
    throw error;
  }
};

export const removeTask = async (id) => {
  if (!schemaAvailable) {
    const info = getLocalTaskById(id);
    if (!info) return false;
    const { scope } = info;
    const next = readLocalTasks(scope).filter((item) => item.id !== id);
    writeLocalTasks(scope, next);
    return true;
  }

  try {
    const { error } = await supabase.from(TABLE_NAME).delete().eq("id", id);
    if (error) {
      if (applySchemaError(error)) {
        const info = getLocalTaskById(id);
        if (!info) return false;
        const { scope } = info;
        const next = readLocalTasks(scope).filter((item) => item.id !== id);
        writeLocalTasks(scope, next);
        return true;
      }
      throw error;
    }
    return true;
  } catch (error) {
    if (applySchemaError(error)) {
      const info = getLocalTaskById(id);
      if (!info) return false;
      const { scope } = info;
      const next = readLocalTasks(scope).filter((item) => item.id !== id);
      writeLocalTasks(scope, next);
      return true;
    }
    throw error;
  }
};

const summarize = (tasks) => {
  const byScope = SCOPES.reduce((acc, scope) => {
    acc[scope] = [];
    return acc;
  }, {});

  tasks.forEach((task) => {
    if (byScope[task.scope]) {
      byScope[task.scope].push(task);
    }
  });

  const lines = ["Planner da Família — Resumo da Semana", ""];

  SCOPES.forEach((scope) => {
    const scopeTasks = byScope[scope];
    const done = scopeTasks.filter((task) => task.done);
    const pending = scopeTasks.filter((task) => !task.done);

    const title =
      scope === "casa" ? "Casa" : scope === "filhos" ? "Filhos" : "Eu";

    lines.push(`${title}`);
    lines.push(`  • Concluídas: ${done.length}`);
    lines.push(`  • Pendentes: ${pending.length}`);

    if (pending.length > 0) {
      lines.push("  • Acompanhar:");
      pending.forEach((task) => {
        const due = task.due_date ? ` (até ${task.due_date})` : "";
        lines.push(`      - ${task.title}${due}`);
      });
    }

    lines.push("");
  });

  return lines.join("\n").trim();
};

export const getWeeklySummary = async () => {
  if (!schemaAvailable) {
    const tasks = SCOPES.flatMap((scope) => readLocalTasks(scope));
    return summarize(tasks);
  }

  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("id, title, scope, due_date, done");

    if (error) {
      if (applySchemaError(error)) {
        const tasks = SCOPES.flatMap((scope) => readLocalTasks(scope));
        return summarize(tasks);
      }
      throw error;
    }

    return summarize(data ?? []);
  } catch (error) {
    if (applySchemaError(error)) {
      const tasks = SCOPES.flatMap((scope) => readLocalTasks(scope));
      return summarize(tasks);
    }
    throw error;
  }
};
