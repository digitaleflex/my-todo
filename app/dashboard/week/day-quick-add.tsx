"use client";

import { useRef, useState, useTransition } from "react";
import { createTaskAction } from "../actions";

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
    <form ref={formRef} action={onSubmit} className="mt-3 flex gap-2">
      <input type="hidden" name="dueDate" value={dueDate} />
      <input type="hidden" name="priority" value="MEDIUM" />
      <input
        name="title"
        placeholder="+ Tâche rapide…"
        required
        maxLength={200}
        disabled={pending}
        className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 p-2 text-sm"
      />
      <button
        disabled={pending}
        aria-label="Ajouter une tâche ce jour"
        className="rounded-xl bg-white px-3 py-2 text-sm text-black font-medium disabled:opacity-60"
      >
        +
      </button>
      {error && <p role="alert" className="sr-only">{error}</p>}
    </form>
  );
}
