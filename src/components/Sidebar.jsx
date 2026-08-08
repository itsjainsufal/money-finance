import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Dashboard', icon: '📊' },
  { to: '/budgets', label: 'Budgets', icon: '💼' },
  { to: '/transactions', label: 'Transactions', icon: '💸' },
  { to: '/goals', label: 'Goals', icon: '🎯' },
  { to: '/bills', label: 'Bills', icon: '🧾' },
  { to: '/family', label: 'Family', icon: '👨‍👩‍👧' },
  { to: '/net-worth', label: 'Net Worth', icon: '🏦' },
  { to: '/advisor', label: 'AI Advisor', icon: '✨' },
];

export function Sidebar({ mobileOpen, onClose }) {
  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-slate-950/50 transition md:hidden ${mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={onClose}
      />
      <aside
        className={`fixed left-0 top-0 z-40 flex h-full w-72 flex-col border-r border-white/10 bg-slate-950 text-slate-100 shadow-2xl transition-transform md:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="border-b border-white/10 px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-cyan-400 to-violet-500 text-2xl shadow-lg shadow-blue-500/20">
              💎
            </div>
            <div>
              <p className="text-lg font-semibold tracking-tight">MoneyFlow</p>
              <p className="text-sm text-slate-400">Family finance command center</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-2 px-4 py-6">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500/25 via-emerald-500/15 to-violet-500/25 text-white shadow-lg shadow-blue-500/10 ring-1 ring-white/10'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 px-5 py-5 text-sm text-slate-400">
          <p className="font-medium text-slate-200">Creator-ready demo</p>
          <p className="mt-1">Seeded data, rule-based insights, and multi-currency reporting are ready out of the box.</p>
        </div>
      </aside>
    </>
  );
}
