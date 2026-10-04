import { requireUser, requireWorkspace } from "@/lib/session";
import { LogoutButton } from "./logout-button";

const tasks = [
  { title: "Sécurité sociale", priority: "HIGH" },
  { title: "Rechercher sérieusement un logement", priority: "HIGH" },
  { title: "Exercice d’anglais", priority: "MEDIUM" },
  { title: "Contrôle de gestion", priority: "MEDIUM" }
];

export default async function DashboardPage() {
  const user = await requireUser();
  const { workspace } = await requireWorkspace();

  return (
    <main className="min-h-screen px-5 py-8 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-zinc-500">{workspace.name}</p>
            <h1 className="mt-1 text-3xl font-semibold">Cette semaine</h1>
            <p className="mt-1 text-sm text-zinc-400">Connecté en tant que {user.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="rounded-xl bg-white px-4 py-2 text-black font-medium">+ Tâche</button>
            <LogoutButton />
          </div>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {tasks.map((task) => (
            <div key={task.title} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
              <div className="flex items-center gap-3">
                <input type="checkbox" />
                <span className="font-medium">{task.title}</span>
              </div>
              <p className="mt-3 text-xs text-zinc-500">{task.priority}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
