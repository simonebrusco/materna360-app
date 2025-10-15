"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  addTask,
  isLocalFallback,
  listTasks,
  removeTask,
  toggleDone,
} from "../lib/planner";
import PlannerItem from "./PlannerItem";

const TABS = [
  { label: "Casa", value: "casa" },
  { label: "Filhos", value: "filhos" },
  { label: "Eu", value: "eu" },
];

const INITIAL_TASKS = {
  casa: [],
  filhos: [],
  eu: [],
};

export default function PlannerList() {
  const [scope, setScope] = useState("casa");
  const [tasksMap, setTasksMap] = useState(INITIAL_TASKS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [offline, setOffline] = useState(isLocalFallback());

  const tasks = useMemo(() => tasksMap[scope] ?? [], [tasksMap, scope]);

  const fetchTasks = useCallback(
    async (currentScope) => {
      setLoading(true);
      setError(null);
      try {
        const data = await listTasks(currentScope);
        setTasksMap((prev) => ({ ...prev, [currentScope]: data }));
      } catch (err) {
        console.error("planner.listTasks", err);
        setError("Não foi possível carregar agora. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
        setOffline(isLocalFallback());
      }
    },
    []
  );

  useEffect(() => {
    fetchTasks(scope);
  }, [scope, fetchTasks]);

  const handleAdd = async (event) => {
    event.preventDefault();
    if (!title.trim()) return;

    setSaving(true);
    setError(null);
    try {
      const task = await addTask({
        title: title.trim(),
        scope,
        due_date: dueDate || null,
      });
      setTasksMap((prev) => ({
        ...prev,
        [scope]: [...(prev[scope] ?? []), task],
      }));
      setTitle("");
      setDueDate("");
    } catch (err) {
      console.error("planner.addTask", err);
      setError("Não conseguimos salvar agora. Confira os campos e tente novamente.");
    } finally {
      setSaving(false);
      setOffline(isLocalFallback());
    }
  };

  const handleToggle = async (taskId, nextDone) => {
    setBusyId(taskId);
    setError(null);
    try {
      const updated = await toggleDone(taskId, nextDone);
      setTasksMap((prev) => ({
        ...prev,
        [scope]: (prev[scope] ?? []).map((task) =>
          task.id === taskId ? { ...task, done: updated?.done ?? nextDone } : task
        ),
      }));
    } catch (err) {
      console.error("planner.toggleDone", err);
      setError("Não foi possível atualizar a tarefa agora.");
    } finally {
      setBusyId(null);
      setOffline(isLocalFallback());
    }
  };

  const handleRemove = async (taskId) => {
    setBusyId(taskId);
    setError(null);
    try {
      await removeTask(taskId);
      setTasksMap((prev) => ({
        ...prev,
        [scope]: (prev[scope] ?? []).filter((task) => task.id !== taskId),
      }));
    } catch (err) {
      console.error("planner.removeTask", err);
      setError("Não conseguimos remover agora. Tente novamente em instantes.");
    } finally {
      setBusyId(null);
      setOffline(isLocalFallback());
    }
  };

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => Number(a.done) - Number(b.done));
  }, [tasks]);

  return (
    <section className="w-full rounded-2xl border border-brand-secondary/60 bg-brand-white/80 p-6 shadow-glass backdrop-blur-xs">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-brand-ink">Planner da Família</h2>
          <p className="mt-1 text-sm text-brand-slate">
            Distribua as tarefas entre casa, filhos e autocuidado.
          </p>
        </div>
        {offline ? (
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-slate/20 bg-brand-slate/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-slate">
            Modo offline
          </span>
        ) : null}
      </div>

      <form
        onSubmit={handleAdd}
        className="mt-6 grid gap-3 rounded-2xl bg-brand-secondary/30 p-4 sm:grid-cols-[minmax(0,1fr)_auto_auto]"
      >
        <input
          type="text"
          placeholder="+ Anotar"
          className="w-full rounded-xl border border-transparent bg-brand-white px-4 py-3 text-base text-brand-ink placeholder-brand-slate/60 shadow-inner focus:border-brand-primary focus:outline-none"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={saving}
        />
        <input
          type="date"
          className="rounded-xl border border-transparent bg-brand-white px-4 py-3 text-sm text-brand-slate shadow-inner focus:border-brand-primary focus:outline-none"
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
          disabled={saving}
        />
        <button
          type="submit"
          className="rounded-xl bg-brand-primary px-5 py-3 text-sm font-semibold uppercase tracking-wide text-brand-white transition hover:bg-brand-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={saving}
        >
          Anotar
        </button>
      </form>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              scope === tab.value
                ? "border-brand-primary bg-brand-primary text-brand-white shadow-soft"
                : "border-brand-secondary bg-brand-white text-brand-slate hover:border-brand-primary/40 hover:text-brand-primary"
            }`}
            onClick={() => setScope(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error ? (
        <p className="mt-4 rounded-xl border border-brand-primary/30 bg-brand-primary/5 px-4 py-3 text-sm text-brand-primary">
          {error}
        </p>
      ) : null}

      <div className="mt-4">
        {loading ? (
          <div className="rounded-xl border border-brand-secondary/40 bg-brand-white/80 px-4 py-6 text-center text-brand-slate">
            Carregando tarefas...
          </div>
        ) : sortedTasks.length > 0 ? (
          <ul className="flex flex-col gap-3">
            {sortedTasks.map((task) => (
              <PlannerItem
                key={task.id}
                task={task}
                onToggle={(checked) => handleToggle(task.id, checked)}
                onRemove={() => handleRemove(task.id)}
                disabled={busyId === task.id}
              />
            ))}
          </ul>
        ) : (
          <div className="rounded-xl border border-dashed border-brand-secondary/60 bg-brand-white/60 px-6 py-10 text-center">
            <p className="text-base font-medium text-brand-slate">
              Nenhuma tarefa por aqui.
            </p>
            <p className="mt-2 text-sm text-brand-slate/70">
              Use o campo “+ Anotar” para registrar a próxima ação desse escopo.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
