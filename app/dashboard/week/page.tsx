import Link from "next/link";
import { requireWorkspace } from "@/lib/session";
import { formatDayShortFR, toDateInputValue } from "@/lib/dates";
import { getWeekOverview } from "@/lib/tasks";
import { TaskItem } from "../task-item";
import { DayQuickAdd } from "./day-quick-add";

function parseOffset(value: string | string[] | undefined): number {
  const n = typeof value === "string" ? Number.parseInt(value, 10) : Number.NaN;
  if (!Number.isInteger(n) || n < -52 || n > 52) return 0;
  return n;
}

export default async function WeekPage({
  searchParams,
}: {
  searchParams?: Promise<{ offset?: string | string[] }>;
}) {
  const params = (await searchParams) ?? {};
  const offset = parseOffset(params.offset);
  const { workspace, membership } = await requireWorkspace();
  const overview = await getWeekOverview(membership.userId, workspace.id, offset);
  const todayIndex = (new Date().getUTCDay() + 6) % 7;

  return (
    <main className="min-h-screen px-5 py-8 md:px-10">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm text-zinc-500">{workspace.name}</p>
        <div className="mt-1 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-semibold">Cette semaine</h1>
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/week?offset=-1"
              className="rounded-xl border border-zinc-700 px-4 py-2 text-sm font-medium"
            >
              ← Préc.
            </Link>
            {offset !== 0 && (
              <Link
                href="/dashboard/week"
                className="rounded-xl border border-zinc-700 px-4 py-2 text-sm font-medium"
              >
                Cette semaine
              </Link>
            )}
            <Link
              href="/dashboard/week?offset=1"
              className="rounded-xl border border-zinc-700 px-4 py-2 text-sm font-medium"
            >
              Suiv. →
            </Link>
          </div>
        </div>

        <div className="mt-4 flex gap-3 text-sm">
          <Link href="/dashboard" className="text-zinc-400 hover:text-white">
            ← Aujourd&apos;hui
          </Link>
        </div>

        <div className="mt-6 space-y-4">
          {overview.days.map((day, i) => (
            <section key={day.date.toISOString()} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="font-medium capitalize">
                  {formatDayShortFR(day.date)}
                  {offset === 0 && i === todayIndex && (
                    <span className="ml-2 rounded-full bg-white px-2 py-0.5 text-xs text-black">Auj.</span>
                  )}
                </h2>
                <p className="text-xs text-zinc-500">
                  {day.done}/{day.total} · {day.progress} %
                </p>
              </div>
              {day.total > 0 && (
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-800">
                  <div className="h-full rounded-full bg-white" style={{ width: `${day.progress}%` }} />
                </div>
              )}
              {day.tasks.length === 0 ? (
                <p className="mt-3 text-sm text-zinc-500">Rien de prévu.</p>
              ) : (
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {day.tasks.map((task) => (
                    <TaskItem key={task.id} task={task} />
                  ))}
                </div>
              )}
              <DayQuickAdd dueDate={toDateInputValue(day.date)} />
            </section>
          ))}
        </div>

        {overview.undated.length > 0 && (
          <section className="mt-4 rounded-2xl border border-dashed border-zinc-800 p-5">
            <h2 className="font-medium">Sans échéance · {overview.undated.length}</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {overview.undated.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
