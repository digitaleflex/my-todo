"use server";

import { revalidatePath } from "next/cache";
import { AccessDeniedError } from "@/lib/errors";
import { requireWorkspace } from "@/lib/session";
import {
  createTaskSchema,
  taskIdSchema,
  updateTaskSchema,
} from "@/lib/validators/task";
import { createTask, deleteTask, toggleTaskStatus, updateTask } from "@/lib/tasks";

type ActionResult = { ok: true } | { error: string };

const INVALID_INPUT = "Données invalides.";

/**
 * Traduit une exception en message affichable.
 * `AccessDeniedError` a déjà un message volontairement générique ; toute autre
 * exception est masquée pour ne jamais exposer détail SQL, nom de colonne ou
 * identifiant interne au client. Le journal serveur reste la source de vérité.
 */
function toError(error: unknown): ActionResult {
  if (error instanceof AccessDeniedError) {
    return { error: error.message };
  }
  console.error("[task-action] échec", error instanceof Error ? error.message : "erreur inconnue");
  return { error: "Opération impossible, réessaie." };
}

export async function createTaskAction(formData: FormData): Promise<ActionResult> {
  const { workspace, membership } = await requireWorkspace();
  const parsed = createTaskSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    dueDate: formData.get("dueDate"),
    priority: formData.get("priority"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? INVALID_INPUT };
  }
  try {
    await createTask(membership.userId, workspace.id, parsed.data);
  } catch (error) {
    return toError(error);
  }
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/week");
  return { ok: true };
}

export async function updateTaskAction(formData: FormData): Promise<ActionResult> {
  // L'appartenance est revérifiée dans la couche données via la tâche.
  const { membership } = await requireWorkspace();
  const parsed = updateTaskSchema.safeParse({
    id: formData.get("id"),
    title: formData.get("title"),
    description: formData.get("description"),
    dueDate: formData.get("dueDate"),
    priority: formData.get("priority"),
    status: formData.get("status"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? INVALID_INPUT };
  }
  try {
    await updateTask(membership.userId, parsed.data);
  } catch (error) {
    return toError(error);
  }
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/week");
  return { ok: true };
}

export async function toggleTaskAction(taskId: string, done: boolean): Promise<ActionResult> {
  const { membership } = await requireWorkspace();
  const parsed = taskIdSchema.safeParse({ id: taskId });
  if (!parsed.success) {
    return { error: INVALID_INPUT };
  }
  try {
    await toggleTaskStatus(membership.userId, parsed.data.id, done);
  } catch (error) {
    return toError(error);
  }
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/week");
  return { ok: true };
}

export async function deleteTaskAction(taskId: string): Promise<ActionResult> {
  const { membership } = await requireWorkspace();
  const parsed = taskIdSchema.safeParse({ id: taskId });
  if (!parsed.success) {
    return { error: INVALID_INPUT };
  }
  try {
    await deleteTask(membership.userId, parsed.data.id);
  } catch (error) {
    return toError(error);
  }
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/week");
  return { ok: true };
}
