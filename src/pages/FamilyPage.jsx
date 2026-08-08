import { useMemo, useState } from 'react';
import { EmptyState } from '../components/EmptyState';
import { MemberForm } from '../components/forms';
import { Modal } from '../components/Modal';
import { SectionCard } from '../components/SectionCard';
import { useAppContext } from '../context/AppContext';
import {
  convertAmount,
  formatDate,
  formatCurrency as formatWithCode,
  getNetWorthTotals,
  isSameMonth,
} from '../utils/finance';

export function FamilyPage() {
  const { data, currency, formatCurrency, addMember, updateMember, deleteMember } = useAppContext();
  const [editingMember, setEditingMember] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const memberCards = useMemo(
    () =>
      data.familyMembers.map((member) => {
        const memberTransactions = data.transactions.filter((transaction) => transaction.memberId === member.id);
        const monthlySpend = memberTransactions
          .filter((transaction) => transaction.type === 'expense' && isSameMonth(transaction.date))
          .reduce((sum, transaction) => sum + convertAmount(transaction.amount, transaction.currency, currency), 0);
        const memberAssets = data.assets.filter((asset) => asset.memberId === member.id);
        const memberLiabilities = data.liabilities.filter((liability) => liability.memberId === member.id);
        const netWorth = getNetWorthTotals(memberAssets, memberLiabilities, currency).netWorth;

        return {
          member,
          monthlySpend,
          netWorth,
          transactionCount: memberTransactions.length,
          latestTransactions: memberTransactions.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3),
        };
      }),
    [currency, data.assets, data.familyMembers, data.liabilities, data.transactions],
  );

  return (
    <div className="space-y-6">
      <SectionCard
        title="Family money hub"
        subtitle="Each member can contribute to shared budgeting while keeping private balances segmented"
        action={
          <button
            type="button"
            onClick={() => {
              setEditingMember(null);
              setIsOpen(true);
            }}
            className="rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-violet-500 px-4 py-2 text-sm font-semibold text-white"
          >
            + Add member
          </button>
        }
      >
        <div className="grid gap-4 xl:grid-cols-3">
          {memberCards.map(({ member, monthlySpend, netWorth, transactionCount, latestTransactions }) => (
            <div key={member.id} className="rounded-3xl border border-slate-200/70 p-5 dark:border-slate-800">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${member.color} text-lg font-semibold text-white`}>
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">{member.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{member.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => { setEditingMember(member); setIsOpen(true); }} className="rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:text-slate-100">Edit</button>
                  <button type="button" onClick={() => deleteMember(member.id)} className="rounded-xl border border-rose-200 px-3 py-2 text-sm text-rose-600 dark:border-rose-900/60">Delete</button>
                </div>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-950/70">
                  <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Private net worth</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">{formatCurrency(netWorth)}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-950/70">
                  <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Spend this month</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">{formatCurrency(monthlySpend)}</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">{transactionCount} tracked transactions assigned.</p>
              <div className="mt-4 space-y-2">
                {latestTransactions.length ? latestTransactions.map((transaction) => (
                  <div key={transaction.id} className="rounded-2xl bg-slate-50 px-3 py-2 text-sm dark:bg-slate-950/70">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium text-slate-900 dark:text-white">{transaction.description}</span>
                      <span className={transaction.type === 'income' ? 'text-emerald-500' : 'text-slate-900 dark:text-white'}>
                        {transaction.type === 'income' ? '+' : '-'}{formatWithCode(transaction.amount, transaction.currency)}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{formatDate(transaction.date)}</p>
                  </div>
                )) : <EmptyState title="No assigned activity yet" description="Assign transactions, bills, or assets to this member for richer family insights." />}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <Modal title={editingMember ? 'Edit family member' : 'Add family member'} open={isOpen} onClose={() => setIsOpen(false)}>
        <MemberForm
          key={editingMember?.id || 'new-member'}
          initialValues={editingMember}
          onSubmit={(payload) => {
            if (editingMember) updateMember(editingMember.id, payload);
            else addMember(payload);
            setIsOpen(false);
          }}
        />
      </Modal>
    </div>
  );
}
