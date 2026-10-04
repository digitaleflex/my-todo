export default function DashboardLoading() {
  return (
    <main className="min-h-screen px-5 py-8 md:px-10">
      <div className="mx-auto max-w-6xl animate-pulse">
        <div className="h-4 w-40 rounded bg-zinc-800" />
        <div className="mt-2 h-9 w-64 rounded bg-zinc-800" />
        <div className="mt-6 h-24 rounded-2xl bg-zinc-900" />
        <div className="mt-8 h-32 rounded-2xl bg-zinc-900" />
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="h-28 rounded-2xl bg-zinc-900" />
          <div className="h-28 rounded-2xl bg-zinc-900" />
        </div>
      </div>
    </main>
  );
}
