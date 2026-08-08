import { SectionCard } from '../components/SectionCard';
import { StatCard } from '../components/StatCard';
import { useAppContext } from '../context/AppContext';

export function AdvisorPage() {
  const { derived } = useAppContext();
  const healthScore = Math.max(
    55,
    Math.min(
      96,
      Math.round(
        82 +
          (derived.monthlySavings > 0 ? 8 : -12) -
          derived.budgetsWithProgress.filter((item) => item.progress > 1).length * 5,
      ),
    ),
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Financial health score" value={`${healthScore}/100`} change="Based on savings pace, budget discipline, and upcoming obligations" icon="✨" accent="from-violet-500 to-fuchsia-400" />
        <StatCard title="Active alerts" value={String(derived.advisorInsights.filter((item) => item.tone === 'warning').length)} change="Items needing action or closer monitoring" icon="🚨" accent="from-amber-500 to-orange-400" />
        <StatCard title="Positive signals" value={String(derived.advisorInsights.filter((item) => item.tone === 'success').length)} change="Areas where the household is trending well" icon="✅" accent="from-emerald-500 to-teal-400" />
      </div>

      <SectionCard title="Household guidance" subtitle="Rule-based advice generated from budgets, transactions, bills, and goals">
        <div className="grid gap-4 xl:grid-cols-2">
          {derived.advisorInsights.map((insight) => (
            <div key={insight.title} className="rounded-3xl border border-slate-200/70 p-5 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className={`h-11 w-11 rounded-2xl ${insight.tone === 'success' ? 'bg-emerald-500/15 text-emerald-500' : insight.tone === 'warning' ? 'bg-amber-500/15 text-amber-500' : insight.tone === 'info' ? 'bg-blue-500/15 text-blue-500' : 'bg-violet-500/15 text-violet-500'} flex items-center justify-center text-xl`}>
                  {insight.tone === 'success' ? '↗' : insight.tone === 'warning' ? '!' : insight.tone === 'info' ? 'i' : '•'}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{insight.title}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{insight.tone}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-500 dark:text-slate-400">{insight.detail}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="How the advisor thinks" subtitle="No external AI API is used — insights are generated locally and persist with your data">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl bg-slate-50 p-5 dark:bg-slate-950/70">
            <p className="font-semibold text-slate-900 dark:text-white">Budget pressure</p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Flags categories running over target and ranks high-spend areas automatically.</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-5 dark:bg-slate-950/70">
            <p className="font-semibold text-slate-900 dark:text-white">Goal momentum</p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Evaluates goal progress versus deadlines to suggest when funding needs attention.</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-5 dark:bg-slate-950/70">
            <p className="font-semibold text-slate-900 dark:text-white">Bill readiness</p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Highlights upcoming recurring bills and manual-pay subscriptions before they become overdue.</p>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
