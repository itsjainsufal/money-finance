import { useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const titles = {
  '/': { title: 'Dashboard', subtitle: 'Your household money pulse in one place.' },
  '/budgets': { title: 'Budget Manager', subtitle: 'Keep every spending category aligned with the plan.' },
  '/transactions': { title: 'Transactions', subtitle: 'Track cash in, cash out, and who spent what.' },
  '/goals': { title: 'Financial Goals', subtitle: 'See every saving milestone and deadline at a glance.' },
  '/bills': { title: 'Recurring Bills', subtitle: 'Never miss subscriptions, utilities, or household bills.' },
  '/family': { title: 'Family Members', subtitle: 'Shared budgeting with private net worth visibility.' },
  '/net-worth': { title: 'Net Worth Tracker', subtitle: 'Monitor assets, liabilities, and long-term momentum.' },
  '/advisor': { title: 'AI Spending Advisor', subtitle: 'Actionable coaching powered by your household patterns.' },
};

export function Header({ onOpenSidebar }) {
  const { pathname } = useLocation();
  const { currencies, currency, setCurrency, theme, toggleTheme, resetDemoData } = useAppContext();
  const header = titles[pathname] || titles['/'];

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/70">
      <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={onOpenSidebar}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm md:hidden dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              ☰
            </button>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">{header.title}</h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{header.subtitle}</p>
            </div>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <select
              value={currency}
              onChange={(event) => setCurrency(event.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-blue-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              {currencies.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.code}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
            </button>
            <button
              type="button"
              onClick={resetDemoData}
              className="rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-violet-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5"
            >
              Reset Demo
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <select
            value={currency}
            onChange={(event) => setCurrency(event.target.value)}
            className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            {currencies.map((item) => (
              <option key={item.code} value={item.code}>
                {item.code}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </header>
  );
}
