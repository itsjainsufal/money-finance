import { useState } from 'react';
import { BillForm } from '../components/forms';
import { Modal } from '../components/Modal';
import { SectionCard } from '../components/SectionCard';
import { useAppContext } from '../context/AppContext';
import { daysUntil, formatDate, getCategoryName, getMemberName } from '../utils/finance';

export function BillsPage() {
  const { data, derived, addBill, updateBill, deleteBill, markBillPaid, formatCurrency, convertAmount, currency } = useAppContext();
  const [editingBill, setEditingBill] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-6">
      <SectionCard
        title="Recurring bills and subscriptions"
        subtitle="Stay ahead of utilities, streaming, insurance, and autopay obligations"
        action={
          <button
            type="button"
            onClick={() => {
              setEditingBill(null);
              setIsOpen(true);
            }}
            className="rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-violet-500 px-4 py-2 text-sm font-semibold text-white"
          >
            + Add bill
          </button>
        }
      >
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950/70">
            <p className="text-sm text-slate-500 dark:text-slate-400">Upcoming this week</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{derived.upcomingBills.filter((bill) => daysUntil(bill.nextDueDate) <= 7).length}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950/70">
            <p className="text-sm text-slate-500 dark:text-slate-400">Monthly recurring total</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{formatCurrency(derived.upcomingBills.reduce((sum, bill) => sum + (bill.frequency === 'monthly' ? convertAmount(bill.amount, bill.currency, currency) : 0), 0))}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950/70">
            <p className="text-sm text-slate-500 dark:text-slate-400">Autopay enabled</p>
            <p className="mt-2 text-2xl font-semibold text-emerald-500">{derived.upcomingBills.filter((bill) => bill.autopay).length}</p>
          </div>
        </div>
      </SectionCard>

      <div className="grid gap-4 xl:grid-cols-2">
        {derived.upcomingBills.map((bill) => {
          const dueInDays = daysUntil(bill.nextDueDate);
          return (
            <SectionCard
              key={bill.id}
              title={bill.name}
              subtitle={`${getCategoryName(data.budgetCategories, bill.categoryId)} • ${getMemberName(data.familyMembers, bill.memberId)}`}
              action={
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => { setEditingBill(bill); setIsOpen(true); }} className="rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:text-slate-100">Edit</button>
                  <button type="button" onClick={() => deleteBill(bill.id)} className="rounded-xl border border-rose-200 px-3 py-2 text-sm text-rose-600 dark:border-rose-900/60">Delete</button>
                </div>
              }
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-semibold text-slate-900 dark:text-white">{formatCurrency(bill.amount, bill.currency)}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{bill.frequency} • Next due {formatDate(bill.nextDueDate)}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-sm font-medium ${dueInDays <= 3 ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'}`}>
                    {dueInDays >= 0 ? `${dueInDays} days` : 'Overdue'}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-950/70">
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{bill.autopay ? 'Autopay is on' : 'Manual payment required'}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Last paid {formatDate(bill.lastPaidDate)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => markBillPaid(bill.id)}
                    className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-slate-900"
                  >
                    Mark paid
                  </button>
                </div>
              </div>
            </SectionCard>
          );
        })}
      </div>

      <Modal title={editingBill ? 'Edit bill' : 'Add bill'} open={isOpen} onClose={() => setIsOpen(false)}>
        <BillForm
          key={editingBill?.id || 'new-bill'}
          initialValues={editingBill}
          onSubmit={(payload) => {
            if (editingBill) updateBill(editingBill.id, payload);
            else addBill(payload);
            setIsOpen(false);
          }}
        />
      </Modal>
    </div>
  );
}
