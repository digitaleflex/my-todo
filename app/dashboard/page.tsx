import { requireUser, requireWorkspace } from "@/lib/session";
import { listTasks } from "@/lib/tasks";
import { LogoutButton } from "./logout-button";
import { TaskForm } from "./task-form";
import { TaskItem } from "./task-item";

export default async function DashboardPage() {
  const user = await requireUser();
  const { workspace, membership } = await requireWorkspace();
  const tasks = await listTasks(membership.userId, workspace.id);

  return (
    <main className="min-h-screen px-5 py-8 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-zinc-500">{workspace.name}</p>
            <h1 className="mt-1 text-3xl font-semibold">Cette semaine</h1>
            <p className="mt-1 text-sm text-zinc-400">Connecté en tant que {user.email}</p>
          </div>
          <LogoutButton />
        </div>

        <div className="mt-8">
          <TaskForm />
        </div>

        {tasks.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-zinc-800 p-10 text-center">
            <p className="font-medium">Aucune tâche pour le moment</p>
            <p className="mt-2 text-sm text-zinc-400">Ajoute ta première tâche ci-dessus pour démarrer.</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {tasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
