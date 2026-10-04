"use client";

import { useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui";
import { createTaskAction } from "../actions";

/** Ajout rapide d'une tâche sur un jour précis de la semaine. */
export function DayQuickAdd({ dueDate }: { dueDate: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function onSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await createTaskAction(formData);
      if ("error" in result) {
        setError(result.error);
      } else {
        formRef.current?.reset();
      }
    });
  }

  return (
    <form ref={formRef} action={onSubmit} className="mt-4 flex items-end gap-2">
      <input type="hidden" name="dueDate" value={dueDate} />
      <input type="hidden" name="priority" value="MEDIUM" />
      <div className="min-w-0 flex-1">
        <label htmlFor={`quickadd-${dueDate}`} className="sr-only">
          Nouvelle tâche pour le {dueDate}
        </label>
        <input
          id={`quickadd-${dueDate}`}
          name="title"
          placeholder="+ Tâche rapide…"
          required
          maxLength={200}
          disabled={pending}
          aria-describedby={error ? `quickadd-${dueDate}-error` : undefined}
          aria-invalid={error ? true : undefined}
          className="w-full rounded-xl border border-zinc-800 bg-zinc-900 p-2.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 disabled:opacity-60"
        />
      </div>
      <Button type="submit" size="sm" disabled={pending} aria-label="Ajouter cette tâche">
        {pending ? "…" : "Ajouter"}
      </Button>
      {error && (
        <p
          id={`quickadd-${dueDate}-error`}
          role="alert"
          className="w-full text-sm text-red-400"
        >
          {error}
        </p>
      )}
    </form>
  );
}