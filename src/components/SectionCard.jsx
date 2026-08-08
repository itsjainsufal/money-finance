export function SectionCard({ title, subtitle, action, children, className = '' }) {
  return (
    <section className={`rounded-3xl border border-white/60 bg-white/85 p-5 shadow-lg shadow-slate-200/60 ring-1 ring-slate-100 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-none dark:ring-slate-800 ${className}`}>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-950 dark:text-white">{title}</h2>
          {subtitle ? <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
