"use client";

import { useId, useState, useTransition } from "react";
import type { Task } from "@/generated/prisma/client";
import { Badge, Button, Input, Select, Textarea } from "@/components/ui";
import { deleteTaskAction, toggleTaskAction, updateTaskAction } from "./actions";

const priorityLabel: Record<Task["priority"], string> = {
  LOW: "Basse",
  HIGH: "Haute",
  MEDIUM: "Moyenne",
};

const priorityOptions = [
  { value: "LOW", label: "Priorité basse" },
  { value: "MEDIUM", label: "Priorité moyenne" },
  { value: "HIGH", label: "Priorité haute" },
];

const statusOptions = [
  { value: "TODO", label: "À faire" },
  { value: "IN_PROGRESS", label: "En cours" },
  { value: "DONE", label: "Terminée" },
];

function formatDueDate(value: Date | null): string | null {
  if (!value) return null;
  return new Date(value).toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

/** Carte tâche : lecture, complétion, édition en ligne et suppression. */
export function TaskItem({ task }: { task: Task }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const formId = useId();
  const done = task.status === "DONE";
  const dueDateLabel = formatDueDate(task.dueDate);

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
    <article className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={done}
          disabled={pending}
          onChange={onToggle}
          aria-label={done ? `Rouvrir la tâche ${task.title}` : `Terminer la tâche ${task.title}`}
          className="mt-1 size-5 shrink-0 accent-white"
        />
        <div className="min-w-0 flex-1">
          <p className={`font-medium ${done ? "text-zinc-500 line-through" : ""}`}>{task.title}</p>
          {task.description && !editing && (
            <p className="mt-1 text-sm text-zinc-400">{task.description}</p>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Badge tone={task.priority === "HIGH" ? "danger" : task.priority === "MEDIUM" ? "warning" : "neutral"}>
          {priorityLabel[task.priority]}
        </Badge>
        {dueDateLabel && <Badge>{dueDateLabel}</Badge>}
        {task.status === "IN_PROGRESS" && <Badge tone="success">En cours</Badge>}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setEditing((v) => !v)}
          disabled={pending}
          aria-expanded={editing}
          aria-controls={`${formId}-form`}
        >
          {editing ? "Fermer" : "Modifier"}
        </Button>
        <Button variant="danger" size="sm" onClick={onDelete} disabled={pending}>
          Supprimer
        </Button>
      </div>

      {editing && (
        <form
          id={`${formId}-form`}
          action={onSave}
          className="mt-4 space-y-3 border-t border-zinc-800 pt-4"
        >
          <input type="hidden" name="id" value={task.id} />
          <Input name="title" label="Titre" defaultValue={task.title} required maxLength={200} disabled={pending} />
          <Textarea
            name="description"
            label="Description (optionnel)"
            defaultValue={task.description ?? ""}
            rows={2}
            maxLength={2000}
            disabled={pending}
          />
          <div className="flex flex-col gap-3 md:flex-row">
            <Select
              name="priority"
              label="Priorité"
              options={priorityOptions}
              defaultValue={task.priority}
              disabled={pending}
            />
            <Select
              name="status"
              label="Statut"
              options={statusOptions}
              defaultValue={task.status}
              disabled={pending}
            />
            <Input
              name="dueDate"
              type="date"
              label="Échéance"
              defaultValue={task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : ""}
              disabled={pending}
            />
          </div>
          <Button type="submit" disabled={pending}>
            {pending ? "Enregistrement…" : "Enregistrer"}
          </Button>
        </form>
      )}

      {error && <p role="alert" className="mt-3 text-sm text-red-400">{error}</p>}
    </article>
  );
}