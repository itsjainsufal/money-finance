import { useState } from 'react';
import { GoalForm } from '../components/forms';
import { Modal } from '../components/Modal';
import { ProgressBar } from '../components/ProgressBar';
import { SectionCard } from '../components/SectionCard';
import { useAppContext } from '../context/AppContext';
import { daysUntil, formatDate, getMemberName } from '../utils/finance';

export function GoalsPage() {
  const { data, addGoal, updateGoal, deleteGoal, formatCurrency, convertAmount, currency } = useAppContext();
  const [editingGoal, setEditingGoal] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-6">
      <SectionCard
        title="Savings goals"
        subtitle="Track progress, deadlines, and ownership across the family"
        action={
          <button
            type="button"
            onClick={() => {
              setEditingGoal(null);
              setIsOpen(true);
            }}
            className="rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-violet-500 px-4 py-2 text-sm font-semibold text-white"
          >
            + Add goal
          </button>
        }
      >
        <div className="grid gap-4 xl:grid-cols-2">
          {data.goals.map((goal) => {
            const target = convertAmount(goal.targetAmount, goal.currency, currency);
            const saved = convertAmount(goal.currentAmount, goal.currency, currency);
            const progress = saved / Math.max(target, 1);
            const deadlineDays = daysUntil(goal.deadline);
            return (
              <div key={goal.id} className="rounded-3xl border border-slate-200/70 p-5 dark:border-slate-800">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">{goal.name}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Owner: {getMemberName(data.familyMembers, goal.memberId)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => { setEditingGoal(goal); setIsOpen(true); }} className="rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:text-slate-100">Edit</button>
                    <button type="button" onClick={() => deleteGoal(goal.id)} className="rounded-xl border border-rose-200 px-3 py-2 text-sm text-rose-600 dark:border-rose-900/60">Delete</button>
                  </div>
                </div>
                <div className="mt-5 space-y-4">
                  <ProgressBar value={progress} color={goal.color} />
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-950/70">
                      <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Saved</p>
                      <p className="mt-1 font-semibold text-slate-900 dark:text-white">{formatCurrency(saved)}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-950/70">
                      <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Target</p>
                      <p className="mt-1 font-semibold text-slate-900 dark:text-white">{formatCurrency(target)}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-950/70">
                      <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Deadline</p>
                      <p className="mt-1 font-semibold text-slate-900 dark:text-white">{formatDate(goal.deadline)}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">{Math.round(progress * 100)}% funded</span>
                    <span className={`${deadlineDays < 60 ? 'text-amber-500' : 'text-emerald-500'} font-medium`}>
                      {deadlineDays >= 0 ? `${deadlineDays} days left` : 'Past deadline'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>

      <Modal title={editingGoal ? 'Edit goal' : 'Create goal'} open={isOpen} onClose={() => setIsOpen(false)}>
        <GoalForm
          key={editingGoal?.id || 'new-goal'}
          initialValues={editingGoal}
          onSubmit={(payload) => {
            if (editingGoal) updateGoal(editingGoal.id, payload);
            else addGoal(payload);
            setIsOpen(false);
          }}
        />
      </Modal>
    </div>
  );
}
