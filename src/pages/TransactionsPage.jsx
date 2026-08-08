import { useMemo, useState } from 'react';
import { EmptyState } from '../components/EmptyState';
import { TransactionForm } from '../components/forms';
import { Modal } from '../components/Modal';
import { SectionCard } from '../components/SectionCard';
import { useAppContext } from '../context/AppContext';
import { formatDate, getCategoryName, getMemberName, parseDateValue } from '../utils/finance';

const inputClass =
  'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100';

export function TransactionsPage() {
  const { data, addTransaction, updateTransaction, deleteTransaction, formatCurrency, currency, convertAmount } = useAppContext();
  const [filters, setFilters] = useState({ category: 'all', member: 'all', startDate: '', endDate: '' });
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const filteredTransactions = useMemo(() => {
    return [...data.transactions]
      .filter((transaction) => {
        if (filters.category !== 'all' && transaction.categoryId !== filters.category) return false;
        if (filters.member !== 'all' && (transaction.memberId || '') !== filters.member) return false;
        const transactionTime = parseDateValue(transaction.date).getTime();
        if (filters.startDate && transactionTime < parseDateValue(filters.startDate).getTime()) return false;
        if (filters.endDate && transactionTime > parseDateValue(filters.endDate).getTime()) return false;
        return true;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [data.transactions, filters]);

  const summary = useMemo(
    () =>
      filteredTransactions.reduce(
        (accumulator, transaction) => {
          const convertedAmount = convertAmount(transaction.amount, transaction.currency, currency);
          if (transaction.type === 'income') accumulator.income += convertedAmount;
          else accumulator.expenses += convertedAmount;
          return accumulator;
        },
        { income: 0, expenses: 0 },
      ),
    [convertAmount, currency, filteredTransactions],
  );

  return (
    <div className="space-y-6">
      <SectionCard
        title="Transaction ledger"
        subtitle="Filter, manage, and audit every entry"
        action={
          <button
            type="button"
            onClick={() => {
              setEditingTransaction(null);
              setIsOpen(true);
            }}
            className="rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-violet-500 px-4 py-2 text-sm font-semibold text-white"
          >
            + Add transaction
          </button>
        }
      >
        <div className="grid gap-4 lg:grid-cols-4">
          <select className={inputClass} value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
            <option value="all">All categories</option>
            <option value="income">Income</option>
            <option value="savings">Savings / Investment</option>
            {data.budgetCategories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
          <select className={inputClass} value={filters.member} onChange={(e) => setFilters({ ...filters, member: e.target.value })}>
            <option value="all">All members</option>
            <option value="">Shared</option>
            {data.familyMembers.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}
          </select>
          <input className={inputClass} type="date" value={filters.startDate} onChange={(e) => setFilters({ ...filters, startDate: e.target.value })} />
          <input className={inputClass} type="date" value={filters.endDate} onChange={(e) => setFilters({ ...filters, endDate: e.target.value })} />
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950/70">
            <p className="text-sm text-slate-500 dark:text-slate-400">Income</p>
            <p className="mt-2 text-2xl font-semibold text-emerald-500">{formatCurrency(summary.income)}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950/70">
            <p className="text-sm text-slate-500 dark:text-slate-400">Expenses</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{formatCurrency(summary.expenses)}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950/70">
            <p className="text-sm text-slate-500 dark:text-slate-400">Net</p>
            <p className={`mt-2 text-2xl font-semibold ${summary.income - summary.expenses >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {formatCurrency(summary.income - summary.expenses)}
            </p>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="All transactions" subtitle={`${filteredTransactions.length} entries matched`}>
        <div className="space-y-3">
          {filteredTransactions.length ? (
            filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="rounded-2xl border border-slate-200/70 px-4 py-4 dark:border-slate-800">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-slate-900 dark:text-white">{transaction.description}</p>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${transaction.type === 'income' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300' : 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300'}`}>
                        {transaction.type}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      {formatDate(transaction.date)} • {getCategoryName(data.budgetCategories, transaction.categoryId)} • {getMemberName(data.familyMembers, transaction.memberId)}
                    </p>
                    {transaction.notes ? <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{transaction.notes}</p> : null}
                  </div>
                  <div className="flex items-center gap-4">
                    <p className={`text-lg font-semibold ${transaction.type === 'income' ? 'text-emerald-500' : 'text-slate-900 dark:text-white'}`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount, transaction.currency)}
                    </p>
                    <button type="button" className="rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:text-slate-100" onClick={() => { setEditingTransaction(transaction); setIsOpen(true); }}>Edit</button>
                    <button type="button" className="rounded-xl border border-rose-200 px-3 py-2 text-sm text-rose-600 dark:border-rose-900/60" onClick={() => deleteTransaction(transaction.id)}>Delete</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <EmptyState title="No transactions match these filters" description="Adjust the category or date range to reveal more activity." />
          )}
        </div>
      </SectionCard>

      <Modal title={editingTransaction ? 'Edit transaction' : 'Add transaction'} open={isOpen} onClose={() => setIsOpen(false)}>
        <TransactionForm
          key={editingTransaction?.id || 'new-transaction'}
          initialValues={editingTransaction}
          onSubmit={(payload) => {
            if (editingTransaction) updateTransaction(editingTransaction.id, payload);
            else addTransaction(payload);
            setIsOpen(false);
          }}
        />
      </Modal>
    </div>
  );
}
