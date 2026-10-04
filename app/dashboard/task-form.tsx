"use client";

import { useRef, useState, useTransition } from "react";
import { Button, Input, Select, Textarea } from "@/components/ui";
import { createTaskAction } from "./actions";

const PRIORITY_OPTIONS = [
  { value: "LOW", label: "Priorité basse" },
  { value: "MEDIUM", label: "Priorité moyenne" },
  { value: "HIGH", label: "Priorité haute" },
];

/** Formulaire d'ajout rapide d'une tâche dans le workspace courant. */
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
    <form
      ref={formRef}
      action={onSubmit}
      className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-end">
        <Input
          name="title"
          label="Tâche"
          placeholder="Nouvelle tâche…"
          required
          maxLength={200}
          disabled={pending}
          error={error ?? undefined}
        />
        <Select
          name="priority"
          label="Priorité"
          options={PRIORITY_OPTIONS}
          defaultValue="MEDIUM"
          disabled={pending}
        />
        <Input name="dueDate" type="date" label="Échéance" disabled={pending} />
        <Button type="submit" disabled={pending} className="md:mb-0">
          {pending ? "Ajout…" : "Ajouter"}
        </Button>
      </div>
      <div className="mt-3">
        <Textarea
          name="description"
          label="Description (optionnel)"
          rows={2}
          maxLength={2000}
          disabled={pending}
        />
      </div>
    </form>
  );
}