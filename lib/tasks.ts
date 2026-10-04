import { db } from "@/lib/db";
import { assertWorkspaceMember } from "@/lib/workspace";
import { dayBoundsUTC, weekDaysUTC } from "@/lib/dates";
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

export interface TodayOverview {
  overdue: Awaited<ReturnType<typeof listTasks>>;
  dueToday: Awaited<ReturnType<typeof listTasks>>;
  undated: Awaited<ReturnType<typeof listTasks>>;
  upcoming: Awaited<ReturnType<typeof listTasks>>;
  completedToday: Awaited<ReturnType<typeof listTasks>>;
  stats: { open: number; doneToday: number; progress: number };
}

/**
 * Vue "Aujourd'hui" : regroupe les tâches du workspace par échéance
 * calendaire UTC. Toute tâche ouverte reste visible (aucune perte),
 * même sans échéance ou avec une échéance future.
 */
export async function getTodayOverview(
  userId: string,
  workspaceId: string,
  now: Date = new Date()
): Promise<TodayOverview> {
  const tasks = await listTasks(userId, workspaceId);
  const { dayStart, dayEnd } = dayBoundsUTC(now);

  const overdue: typeof tasks = [];
  const dueToday: typeof tasks = [];
  const undated: typeof tasks = [];
  const upcoming: typeof tasks = [];
  const completedToday: typeof tasks = [];

  for (const task of tasks) {
    if (task.status === "DONE") {
      if (task.completedAt && task.completedAt >= dayStart) {
        completedToday.push(task);
      }
      continue;
    }
    if (!task.dueDate) {
      undated.push(task);
    } else if (task.dueDate < dayStart) {
      overdue.push(task);
    } else if (task.dueDate < dayEnd) {
      dueToday.push(task);
    } else {
      upcoming.push(task);
    }
  }

  const open = overdue.length + dueToday.length;
  const doneToday = completedToday.length;
  const progress = open + doneToday === 0 ? 0 : Math.round((doneToday / (open + doneToday)) * 100);

  return { overdue, dueToday, undated, upcoming, completedToday, stats: { open, doneToday, progress } };
}

export interface WeekDay {
  date: Date;
  tasks: Awaited<ReturnType<typeof listTasks>>;
  done: number;
  total: number;
  progress: number;
}

export interface WeekOverview {
  days: WeekDay[];
  undated: Awaited<ReturnType<typeof listTasks>>;
  weekStart: Date;
  weekEnd: Date;
}

/**
 * Vue semaine : 7 jours (lundi-dimanche UTC) avec les tâches ouvertes
 * et terminées échéant chaque jour, plus les tâches ouvertes sans date.
 * `weekOffset` : 0 = semaine courante, ±1 = précédente/suivante…
 */
export async function getWeekOverview(
  userId: string,
  workspaceId: string,
  weekOffset: number,
  now: Date = new Date()
): Promise<WeekOverview> {
  const tasks = await listTasks(userId, workspaceId);
  const days = weekDaysUTC(now, weekOffset).map((date) => ({
    date,
    tasks: [] as typeof tasks,
    done: 0,
    total: 0,
    progress: 0,
  }));
  const undated: typeof tasks = [];
  const weekStart = days[0].date;
  const weekEnd = new Date(days[6].date.getTime() + 24 * 60 * 60 * 1000);

  for (const task of tasks) {
    if (!task.dueDate) {
      if (task.status !== "DONE") undated.push(task);
      continue;
    }
    if (task.dueDate < weekStart || task.dueDate >= weekEnd) continue;
    const day = days.find(
      (d) => task.dueDate! >= d.date && task.dueDate!.getTime() < d.date.getTime() + 24 * 60 * 60 * 1000
    );
    if (day) day.tasks.push(task);
  }

  for (const day of days) {
    day.done = day.tasks.filter((t) => t.status === "DONE").length;
    day.total = day.tasks.length;
    day.progress = day.total === 0 ? 0 : Math.round((day.done / day.total) * 100);
  }

  return { days, undated, weekStart, weekEnd };
}
