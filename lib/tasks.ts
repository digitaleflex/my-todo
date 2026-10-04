import { db } from "@/lib/db";
import { assertWorkspaceMember } from "@/lib/workspace";
import type { CreateTaskInput, UpdateTaskInput } from "@/lib/validators/task";

async function getTaskForUser(taskId: string, userId: string) {
  const task = await db.task.findUnique({ where: { id: taskId } });
  if (!task) {
    throw new Error("Tâche introuvable");
  }
  const membership = await assertWorkspaceMember(task.workspaceId, userId);
  if (!membership) {
    throw new Error("Accès refusé");
  }
  return task;
}

export async function listTasks(userId: string, workspaceId: string) {
  const membership = await assertWorkspaceMember(workspaceId, userId);
  if (!membership) {
    throw new Error("Accès refusé");
  }
  return db.task.findMany({
    where: { workspaceId },
    orderBy: [{ completedAt: "asc" }, { dueDate: "asc" }, { createdAt: "desc" }],
  });
}

export async function createTask(userId: string, workspaceId: string, input: CreateTaskInput) {
  const membership = await assertWorkspaceMember(workspaceId, userId);
  if (!membership) {
    throw new Error("Accès refusé");
  }
  return db.task.create({
    data: {
      workspaceId,
      title: input.title,
      description: input.description ?? null,
      dueDate: input.dueDate ?? null,
      priority: input.priority,
    },
  });
}

export async function updateTask(userId: string, input: UpdateTaskInput) {
  const task = await getTaskForUser(input.id, userId);
  const completedAt =
    input.status === "DONE" ? (task.completedAt ?? new Date()) : null;
  return db.task.update({
    where: { id: task.id },
    data: {
      title: input.title,
      description: input.description ?? null,
      dueDate: input.dueDate ?? null,
      priority: input.priority,
      status: input.status,
      completedAt,
    },
  });
}

export async function toggleTaskStatus(userId: string, taskId: string, done: boolean) {
  const task = await getTaskForUser(taskId, userId);
  return db.task.update({
    where: { id: task.id },
    data: done
      ? { status: "DONE", completedAt: new Date() }
      : { status: "TODO", completedAt: null },
  });
}

export async function deleteTask(userId: string, taskId: string) {
  const task = await getTaskForUser(taskId, userId);
  await db.task.delete({ where: { id: task.id } });
}
