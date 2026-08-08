import { useMemo, useState } from 'react';
import { BudgetForm } from '../components/forms';
import { Modal } from '../components/Modal';
import { ProgressBar } from '../components/ProgressBar';
import { SectionCard } from '../components/SectionCard';
import { useAppContext } from '../context/AppContext';

export function BudgetsPage() {
  const { derived, addBudget, updateBudget, deleteBudget, formatCurrency } = useAppContext();
  const [editingBudget, setEditingBudget] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const totalBudgeted = useMemo(
    () => derived.budgetsWithProgress.reduce((sum, item) => sum + item.limit, 0),
    [derived.budgetsWithProgress],
  );
  const totalSpent = useMemo(
    () => derived.budgetsWithProgress.reduce((sum, item) => sum + item.spent, 0),
    [derived.budgetsWithProgress],
  );

  return (
    <div className="space-y-6">
      <SectionCard
        title="Budget overview"
        subtitle="Monthly caps compared with current spending"
        action={
          <button
            type="button"
            onClick={() => {
              setEditingBudget(null);
              setIsOpen(true);
            }}
            className="rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-violet-500 px-4 py-2 text-sm font-semibold text-white"
          >
            + Add budget
          </button>
        }
      >
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950/70">
            <p className="text-sm text-slate-500 dark:text-slate-400">Total budgeted</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{formatCurrency(totalBudgeted)}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950/70">
            <p className="text-sm text-slate-500 dark:text-slate-400">Spent so far</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{formatCurrency(totalSpent)}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950/70">
            <p className="text-sm text-slate-500 dark:text-slate-400">Remaining</p>
            <p className="mt-2 text-2xl font-semibold text-emerald-500">{formatCurrency(totalBudgeted - totalSpent)}</p>
          </div>
        </div>
      </SectionCard>

      <div className="grid gap-4 xl:grid-cols-2">
        {derived.budgetsWithProgress.map((budget) => (
          <SectionCard
            key={budget.id}
            title={`${budget.icon} ${budget.name}`}
            subtitle={`${formatCurrency(budget.spent)} spent of ${formatCurrency(budget.limit)}`}
            action={
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingBudget(budget);
                    setIsOpen(true);
                  }}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 dark:border-slate-700 dark:text-slate-200"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => deleteBudget(budget.id)}
                  className="rounded-xl border border-rose-200 px-3 py-2 text-sm font-medium text-rose-600 dark:border-rose-900/60"
                >
                  Delete
                </button>
              </div>
            }
          >
            <div className="space-y-4">
              <ProgressBar value={budget.progress} color={budget.color} />
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">{Math.round(budget.progress * 100)}% used</span>
                <span className={`font-semibold ${budget.remaining >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {budget.remaining >= 0 ? `${formatCurrency(budget.remaining)} left` : `${formatCurrency(Math.abs(budget.remaining))} over`}
                </span>
              </div>
            </div>
          </SectionCard>
        ))}
      </div>

      <Modal title={editingBudget ? 'Edit budget' : 'Create budget'} open={isOpen} onClose={() => setIsOpen(false)}>
        <BudgetForm
          key={editingBudget?.id || 'new-budget'}
          initialValues={editingBudget}
          onSubmit={(payload) => {
            if (editingBudget) updateBudget(editingBudget.id, payload);
            else addBudget(payload);
            setIsOpen(false);
          }}
        />
      </Modal>
    </div>
  );
}
