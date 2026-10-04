import type { Metadata } from "next";
import { requireUser, requireWorkspace } from "@/lib/session";
import { formatTodayFR } from "@/lib/dates";
import { getTodayOverview } from "@/lib/tasks";
import { SiteHeader } from "@/components/site-header";
import { MobileNav } from "@/components/mobile-nav";
import { LogoutButton } from "./logout-button";
import { TaskForm } from "./task-form";
import { TaskItem } from "./task-item";
import type { Task } from "@/generated/prisma/client";

export const metadata: Metadata = {
  title: "Aujourd'hui",
};

/** Bloc de tâches : titre, compteur et liste. Masqué si vide. */
function Section({ title, accent, tasks }: { title: string; accent?: string; tasks: Task[] }) {
  if (tasks.length === 0) return null;
  return (
    <section className="mt-8">
      <h2 className="text-sm font-medium tracking-wide text-zinc-500 uppercase">
        {title} <span className={accent ?? "text-zinc-600"}>· {tasks.length}</span>
      </h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>
    </section>
  );
}

export default async function DashboardPage() {
  const user = await requireUser();
  const { workspace, membership } = await requireWorkspace();
  const overview = await getTodayOverview(membership.userId, workspace.id);
  const { stats } = overview;
  const hasTasks =
    overview.overdue.length +
      overview.dueToday.length +
      overview.undated.length +
      overview.upcoming.length +
      overview.completedToday.length >
    0;

  return (
    <>
      <SiteHeader currentPath="/dashboard">
        <LogoutButton />
      </SiteHeader>

      <main id="contenu" className="px-5 pt-6 pb-28 md:px-10 md:pb-12">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm text-zinc-500">{workspace.name}</p>
          <h1 className="mt-1 text-3xl font-semibold">Aujourd&apos;hui</h1>
          <p className="mt-1 text-sm text-zinc-400 capitalize">
            {formatTodayFR()} · {user.email}
          </p>

          <section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
            <div className="flex items-baseline justify-between gap-4">
              <p className="font-medium">
                {stats.doneToday} tâche{stats.doneToday > 1 ? "s" : ""} terminée
                {stats.doneToday > 1 ? "s" : ""} aujourd&apos;hui
              </p>
              <p className="text-sm text-zinc-400">{stats.progress} %</p>
            </div>
            <div
              className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-800"
              role="progressbar"
              aria-valuenow={stats.progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Progression du jour"
            >
              <div className="h-full rounded-full bg-white" style={{ width: `${stats.progress}%` }} />
            </div>
          </section>

          <div className="mt-8">
            <TaskForm />
          </div>

          {!hasTasks ? (
            <div className="mt-8 rounded-2xl border border-dashed border-zinc-800 p-10 text-center">
              <p className="font-medium">Journée vierge</p>
              <p className="mt-2 text-sm text-zinc-400">
                Ajoute ta première tâche ci-dessus pour démarrer.
              </p>
            </div>
          ) : (
            <>
              <Section title="En retard" accent="text-red-400" tasks={overview.overdue} />
              <Section title="Aujourd'hui" tasks={overview.dueToday} />
              <Section title="Sans échéance" tasks={overview.undated} />
              <Section title="À venir" tasks={overview.upcoming} />
              <Section title="Terminées aujourd'hui" tasks={overview.completedToday} />
            </>
          )}
        </div>
      </main>

      <MobileNav />
    </>
  );
}