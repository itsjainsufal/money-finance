import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useMemo, useState } from 'react';
import { Modal } from '../components/Modal';
import { NetWorthItemForm } from '../components/forms';
import { SectionCard } from '../components/SectionCard';
import { useAppContext } from '../context/AppContext';
import { getMemberName } from '../utils/finance';

export function NetWorthPage() {
  const {
    data,
    derived,
    addNetWorthItem,
    updateNetWorthItem,
    deleteNetWorthItem,
    formatCurrency,
  } = useAppContext();
  const [modalState, setModalState] = useState({ kind: 'assets', item: null, open: false });

  const distribution = useMemo(
    () => [
      { name: 'Assets', total: derived.netWorthTotals.totalAssets, fill: '#10b981' },
      { name: 'Liabilities', total: derived.netWorthTotals.totalLiabilities, fill: '#8b5cf6' },
    ],
    [derived.netWorthTotals.totalAssets, derived.netWorthTotals.totalLiabilities],
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <SectionCard title="Net worth history" subtitle="Monthly trend based on your tracked assets and liabilities">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={derived.formattedNetWorthHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#64748b30" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Balance sheet" subtitle="Current household position">
          <div className="space-y-4">
            {distribution.map((item) => (
              <div key={item.name} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950/70">
                <p className="text-sm text-slate-500 dark:text-slate-400">{item.name}</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{formatCurrency(item.total)}</p>
              </div>
            ))}
            <div className="rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-violet-500 p-4 text-white shadow-lg shadow-blue-500/20">
              <p className="text-sm text-white/80">Net worth</p>
              <p className="mt-2 text-3xl font-semibold">{formatCurrency(derived.netWorthTotals.netWorth)}</p>
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard
          title="Assets"
          subtitle="Cash, investments, real estate, and savings"
          action={<button type="button" onClick={() => setModalState({ kind: 'assets', item: null, open: true })} className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-slate-900">+ Add asset</button>}
        >
          <div className="space-y-3">
            {data.assets.map((asset) => (
              <div key={asset.id} className="rounded-2xl border border-slate-200/70 px-4 py-4 dark:border-slate-800">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{asset.name}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{asset.type} • {asset.institution || 'No institution'} • {getMemberName(data.familyMembers, asset.memberId)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-lg font-semibold text-emerald-500">{formatCurrency(asset.value, asset.currency)}</p>
                    <button type="button" onClick={() => setModalState({ kind: 'assets', item: asset, open: true })} className="rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:text-slate-100">Edit</button>
                    <button type="button" onClick={() => deleteNetWorthItem('assets', asset.id)} className="rounded-xl border border-rose-200 px-3 py-2 text-sm text-rose-600 dark:border-rose-900/60">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Liabilities"
          subtitle="Loans, cards, and other obligations"
          action={<button type="button" onClick={() => setModalState({ kind: 'liabilities', item: null, open: true })} className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-slate-900">+ Add liability</button>}
        >
          <div className="space-y-3">
            {data.liabilities.map((liability) => (
              <div key={liability.id} className="rounded-2xl border border-slate-200/70 px-4 py-4 dark:border-slate-800">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{liability.name}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{liability.type} • {liability.institution || 'No institution'} • {getMemberName(data.familyMembers, liability.memberId)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-lg font-semibold text-violet-500">{formatCurrency(liability.value, liability.currency)}</p>
                    <button type="button" onClick={() => setModalState({ kind: 'liabilities', item: liability, open: true })} className="rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:text-slate-100">Edit</button>
                    <button type="button" onClick={() => deleteNetWorthItem('liabilities', liability.id)} className="rounded-xl border border-rose-200 px-3 py-2 text-sm text-rose-600 dark:border-rose-900/60">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <Modal
        title={`${modalState.item ? 'Edit' : 'Add'} ${modalState.kind === 'assets' ? 'asset' : 'liability'}`}
        open={modalState.open}
        onClose={() => setModalState((current) => ({ ...current, open: false }))}
      >
        <NetWorthItemForm
          key={modalState.item?.id || `new-${modalState.kind}`}
          kind={modalState.kind}
          initialValues={modalState.item}
          onSubmit={(payload) => {
            if (modalState.item) updateNetWorthItem(modalState.kind, modalState.item.id, payload);
            else addNetWorthItem(modalState.kind, payload);
            setModalState((current) => ({ ...current, open: false }));
          }}
        />
      </Modal>
    </div>
  );
}
