export function StatCard({ title, value, change, accent = 'from-blue-500 to-cyan-400', icon = '📈' }) {
  return (
    <div className="rounded-3xl border border-white/60 bg-white/85 p-5 shadow-lg shadow-slate-200/60 ring-1 ring-slate-100 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-none dark:ring-slate-800">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">{value}</p>
          {change ? <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{change}</p> : null}
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} text-xl text-white shadow-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
