"use client";

import { useState, useTransition } from "react";
import type { Task } from "@/generated/prisma/client";
import { deleteTaskAction, toggleTaskAction, updateTaskAction } from "./actions";

const priorityLabel: Record<Task["priority"], string> = {
  LOW: "Basse",
  HIGH: "Haute",
  MEDIUM: "Moyenne",
};

function formatDueDate(value: Date | null): string | null {
  if (!value) return null;
  return new Date(value).toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function TaskItem({ task }: { task: Task }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const done = task.status === "DONE";

  function run(action: () => Promise<{ ok: true } | { error: string }>) {
    setError(null);
    startTransition(async () => {
      const result = await action();
      if ("error" in result) {
        setError(result.error);
      } else {
        setEditing(false);
      }
    });
  }

  function onToggle() {
    run(() => toggleTaskAction(task.id, !done));
  }

  function onDelete() {
    if (!window.confirm(`Supprimer « ${task.title} » ?`)) return;
    run(() => deleteTaskAction(task.id));
  }

  function onSave(formData: FormData) {
    run(() => updateTaskAction(formData));
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={done}
          disabled={pending}
          onChange={onToggle}
          aria-label={done ? "Rouvrir la tâche" : "Terminer la tâche"}
        />
        <span className={`flex-1 font-medium ${done ? "text-zinc-500 line-through" : ""}`}>
          {task.title}
        </span>
        <button
          onClick={() => setEditing((v) => !v)}
          disabled={pending}
          className="text-sm text-zinc-400 hover:text-white disabled:opacity-60"
        >
          {editing ? "Fermer" : "Modifier"}
        </button>
        <button
          onClick={onDelete}
          disabled={pending}
          className="text-sm text-zinc-400 hover:text-red-400 disabled:opacity-60"
        >
          Supprimer
        </button>
      </div>

      {task.description && !editing && (
        <p className="mt-2 text-sm text-zinc-400">{task.description}</p>
      )}
      <p className="mt-3 text-xs text-zinc-500">
        {priorityLabel[task.priority]}
        {formatDueDate(task.dueDate) ? ` · ${formatDueDate(task.dueDate)}` : ""}
        {task.status === "IN_PROGRESS" ? " · En cours" : ""}
      </p>

      {editing && (
        <form action={onSave} className="mt-4 space-y-3 border-t border-zinc-800 pt-4">
          <input type="hidden" name="id" value={task.id} />
          <input
            name="title"
            defaultValue={task.title}
            required
            maxLength={200}
            disabled={pending}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 p-3"
          />
          <textarea
            name="description"
            defaultValue={task.description ?? ""}
            maxLength={2000}
            rows={2}
            disabled={pending}
            placeholder="Description (optionnel)"
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 p-3"
          />
          <div className="flex flex-col gap-3 md:flex-row">
            <select name="priority" defaultValue={task.priority} disabled={pending} className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">
              <option value="LOW">Basse</option>
              <option value="MEDIUM">Moyenne</option>
              <option value="HIGH">Haute</option>
            </select>
            <select name="status" defaultValue={task.status} disabled={pending} className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">
              <option value="TODO">À faire</option>
              <option value="IN_PROGRESS">En cours</option>
              <option value="DONE">Terminée</option>
            </select>
            <input
              name="dueDate"
              type="date"
              defaultValue={task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : ""}
              disabled={pending}
              className="rounded-xl border border-zinc-800 bg-zinc-900 p-3"
            />
            <button disabled={pending} className="rounded-xl bg-white px-5 py-3 text-black font-medium disabled:opacity-60">
              {pending ? "Enregistrement…" : "Enregistrer"}
            </button>
          </div>
        </form>
      )}

      {error && <p role="alert" className="mt-3 text-sm text-red-400">{error}</p>}
    </div>
  );
}
