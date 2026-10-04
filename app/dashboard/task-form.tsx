"use client";

import { useRef, useState, useTransition } from "react";
import { createTaskAction } from "./actions";

export function TaskForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
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
    <form ref={formRef} action={onSubmit} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
      <div className="flex flex-col gap-3 md:flex-row">
        <input
          name="title"
          placeholder="Nouvelle tâche…"
          required
          maxLength={200}
          disabled={pending}
          className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 p-3"
        />
        <select name="priority" defaultValue="MEDIUM" disabled={pending} className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">
          <option value="LOW">Basse</option>
          <option value="MEDIUM">Moyenne</option>
          <option value="HIGH">Haute</option>
        </select>
        <input name="dueDate" type="date" disabled={pending} className="rounded-xl border border-zinc-800 bg-zinc-900 p-3" />
        <button disabled={pending} className="rounded-xl bg-white px-5 py-3 text-black font-medium disabled:opacity-60">
          {pending ? "Ajout…" : "+ Ajouter"}
        </button>
      </div>
      <input
        name="description"
        placeholder="Description (optionnel)"
        maxLength={2000}
        disabled={pending}
        className="mt-3 w-full rounded-xl border border-zinc-800 bg-zinc-900 p-3"
      />
      {error && <p role="alert" className="mt-3 text-sm text-red-400">{error}</p>}
    </form>
  );
}
