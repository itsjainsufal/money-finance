import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { SectionCard } from '../components/SectionCard';
import { StatCard } from '../components/StatCard';
import { useAppContext } from '../context/AppContext';
import { formatDate, getCategoryName, getMemberName } from '../utils/finance';

export function DashboardPage() {
  const { data, derived, formatCurrency, currency } = useAppContext();
  const recentTransactions = [...data.transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Net worth"
          value={formatCurrency(derived.netWorthTotals.netWorth)}
          change={`${formatCurrency(derived.netWorthTotals.totalAssets)} assets vs ${formatCurrency(derived.netWorthTotals.totalLiabilities)} liabilities`}
          icon="💎"
          accent="from-blue-600 to-cyan-400"
        />
        <StatCard
          title="Monthly income"
          value={formatCurrency(derived.monthlyIncome)}
          change="Tracked income in current month"
          icon="📥"
          accent="from-emerald-500 to-teal-400"
        />
        <StatCard
          title="Monthly expenses"
          value={formatCurrency(derived.monthlyExpenses)}
          change="Includes bills, lifestyle, and transfers"
          icon="📤"
          accent="from-violet-500 to-fuchsia-400"
        />
        <StatCard
          title="Goal funding"
          value={formatCurrency(derived.totalGoalSaved)}
          change={`${Math.round((derived.totalGoalSaved / Math.max(derived.totalGoalTarget, 1)) * 100)}% of ${formatCurrency(derived.totalGoalTarget)} target`}
          icon="🎯"
          accent="from-amber-500 to-orange-400"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <SectionCard title="Household cash flow" subtitle={`Last six months in ${currency}`}>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={derived.cashflowHistory}>
                <defs>
                  <linearGradient id="incomeFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.55} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenseFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#64748b30" />
                <XAxis dataKey="label" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip formatter={(value) => formatCurrency(value, currency)} />
                <Area type="monotone" dataKey="income" stroke="#10b981" fill="url(#incomeFill)" strokeWidth={3} />
                <Area type="monotone" dataKey="expenses" stroke="#8b5cf6" fill="url(#expenseFill)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Spending mix" subtitle="Current month by budget category">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={derived.spendingByCategory} dataKey="value" nameKey="name" innerRadius={72} outerRadius={112} paddingAngle={3}>
                  {derived.spendingByCategory.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value, currency)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {derived.spendingByCategory.map((item) => (
              <div key={item.name} className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2 dark:bg-slate-950/70">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </div>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">{formatCurrency(item.value)}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <SectionCard title="Recent transactions" subtitle="Latest household money movement">
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200/70 px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{transaction.description}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {formatDate(transaction.date)} • {transaction.type === 'income' ? 'Income' : getCategoryName(data.budgetCategories, transaction.categoryId)} • {getMemberName(data.familyMembers, transaction.memberId)}
                  </p>
                </div>
                <span className={`text-lg font-semibold ${transaction.type === 'income' ? 'text-emerald-500' : 'text-slate-900 dark:text-white'}`}>
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatCurrency(transaction.amount, transaction.currency)}
                </span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Advisor highlights" subtitle="Rule-based guidance from this month’s activity">
          <div className="space-y-3">
            {derived.advisorInsights.slice(0, 4).map((insight) => (
              <div key={insight.title} className="rounded-2xl border border-slate-200/70 px-4 py-4 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex h-2.5 w-2.5 rounded-full ${insight.tone === 'success' ? 'bg-emerald-500' : insight.tone === 'warning' ? 'bg-amber-500' : insight.tone === 'info' ? 'bg-blue-500' : 'bg-violet-500'}`} />
                  <p className="font-medium text-slate-900 dark:text-white">{insight.title}</p>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{insight.detail}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
