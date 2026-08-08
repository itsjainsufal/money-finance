import { useEffect, useMemo, useState } from 'react';
import { useAppContext } from '../context/AppContext';

const inputClass =
  'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100';

const memberGradientOptions = [
  { value: 'from-blue-500 to-cyan-400', label: 'Ocean blue' },
  { value: 'from-emerald-500 to-teal-400', label: 'Emerald teal' },
  { value: 'from-violet-500 to-fuchsia-400', label: 'Violet bloom' },
  { value: 'from-amber-500 to-orange-400', label: 'Sunrise gold' },
  { value: 'from-rose-500 to-pink-400', label: 'Rose glow' },
];

const Field = ({ label, children }) => (
  <label className="space-y-2">
    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
    {children}
  </label>
);

const ModalForm = ({ onSubmit, children, submitLabel }) => (
  <form
    className="space-y-4"
    onSubmit={(event) => {
      event.preventDefault();
      onSubmit();
    }}
  >
    {children}
    <div className="flex justify-end pt-2">
      <button
        type="submit"
        className="rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20"
      >
        {submitLabel}
      </button>
    </div>
  </form>
);

export function TransactionForm({ initialValues, onSubmit }) {
  const { data, currencies } = useAppContext();
  const [form, setForm] = useState(
    initialValues || {
      description: '',
      amount: '',
      currency: 'USD',
      type: 'expense',
      categoryId: data.budgetCategories[0]?.id || '',
      date: new Date().toISOString().split('T')[0],
      memberId: data.familyMembers[0]?.id || '',
      notes: '',
    },
  );

  const categoryOptions = useMemo(
    () =>
      form.type === 'income'
        ? [{ id: 'income', name: 'Income' }]
        : [{ id: 'savings', name: 'Savings / Investment' }, ...data.budgetCategories],
    [data.budgetCategories, form.type],
  );

  useEffect(() => {
    if (!categoryOptions.some((item) => item.id === form.categoryId)) {
      setForm((current) => ({ ...current, categoryId: categoryOptions[0]?.id || '' }));
    }
  }, [categoryOptions, form.categoryId]);

  return (
    <ModalForm onSubmit={() => onSubmit({ ...form, amount: Number(form.amount) })} submitLabel={initialValues ? 'Save changes' : 'Add transaction'}>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Description">
          <input className={inputClass} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        </Field>
        <Field label="Amount">
          <input className={inputClass} type="number" min="0" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
        </Field>
        <Field label="Currency">
          <select className={inputClass} value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}>
            {currencies.map((item) => <option key={item.code}>{item.code}</option>)}
          </select>
        </Field>
        <Field label="Type">
          <select className={inputClass} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </Field>
        <Field label="Category">
          <select className={inputClass} value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
            {categoryOptions.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
        </Field>
        <Field label="Date">
          <input className={inputClass} type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
        </Field>
        <Field label="Family member">
          <select className={inputClass} value={form.memberId || ''} onChange={(e) => setForm({ ...form, memberId: e.target.value || null })}>
            <option value="">Shared</option>
            {data.familyMembers.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}
          </select>
        </Field>
        <Field label="Notes">
          <input className={inputClass} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </Field>
      </div>
    </ModalForm>
  );
}

export function BudgetForm({ initialValues, onSubmit }) {
  const { currencies } = useAppContext();
  const [form, setForm] = useState(
    initialValues || {
      name: '',
      icon: '💼',
      color: '#3b82f6',
      limit: '',
      currency: 'USD',
    },
  );

  return (
    <ModalForm onSubmit={() => onSubmit({ ...form, limit: Number(form.limit) })} submitLabel={initialValues ? 'Save budget' : 'Create budget'}>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Category name">
          <input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </Field>
        <Field label="Monthly limit">
          <input className={inputClass} type="number" min="0" step="0.01" value={form.limit} onChange={(e) => setForm({ ...form, limit: e.target.value })} required />
        </Field>
        <Field label="Currency">
          <select className={inputClass} value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}>
            {currencies.map((item) => <option key={item.code}>{item.code}</option>)}
          </select>
        </Field>
        <Field label="Icon">
          <input className={inputClass} maxLength="2" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} required />
        </Field>
        <Field label="Accent color">
          <input className={`${inputClass} h-12`} type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
        </Field>
      </div>
    </ModalForm>
  );
}

export function GoalForm({ initialValues, onSubmit }) {
  const { data, currencies } = useAppContext();
  const [form, setForm] = useState(
    initialValues || {
      name: '',
      targetAmount: '',
      currentAmount: '',
      currency: 'USD',
      deadline: new Date().toISOString().split('T')[0],
      memberId: data.familyMembers[0]?.id || '',
      color: '#8b5cf6',
    },
  );

  return (
    <ModalForm
      onSubmit={() =>
        onSubmit({
          ...form,
          targetAmount: Number(form.targetAmount),
          currentAmount: Number(form.currentAmount),
        })
      }
      submitLabel={initialValues ? 'Save goal' : 'Create goal'}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Goal name">
          <input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </Field>
        <Field label="Owner">
          <select className={inputClass} value={form.memberId || ''} onChange={(e) => setForm({ ...form, memberId: e.target.value || null })}>
            <option value="">Shared</option>
            {data.familyMembers.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}
          </select>
        </Field>
        <Field label="Target amount">
          <input className={inputClass} type="number" min="0" step="0.01" value={form.targetAmount} onChange={(e) => setForm({ ...form, targetAmount: e.target.value })} required />
        </Field>
        <Field label="Current saved">
          <input className={inputClass} type="number" min="0" step="0.01" value={form.currentAmount} onChange={(e) => setForm({ ...form, currentAmount: e.target.value })} required />
        </Field>
        <Field label="Currency">
          <select className={inputClass} value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}>
            {currencies.map((item) => <option key={item.code}>{item.code}</option>)}
          </select>
        </Field>
        <Field label="Deadline">
          <input className={inputClass} type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} required />
        </Field>
        <Field label="Accent color">
          <input className={`${inputClass} h-12`} type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
        </Field>
      </div>
    </ModalForm>
  );
}

export function BillForm({ initialValues, onSubmit }) {
  const { data, currencies } = useAppContext();
  const [form, setForm] = useState(
    initialValues || {
      name: '',
      amount: '',
      currency: 'USD',
      frequency: 'monthly',
      nextDueDate: new Date().toISOString().split('T')[0],
      memberId: data.familyMembers[0]?.id || '',
      categoryId: data.budgetCategories[0]?.id || '',
      autopay: false,
      lastPaidDate: new Date().toISOString().split('T')[0],
    },
  );

  return (
    <ModalForm onSubmit={() => onSubmit({ ...form, amount: Number(form.amount) })} submitLabel={initialValues ? 'Save bill' : 'Add bill'}>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Bill name">
          <input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </Field>
        <Field label="Amount">
          <input className={inputClass} type="number" min="0" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
        </Field>
        <Field label="Currency">
          <select className={inputClass} value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}>
            {currencies.map((item) => <option key={item.code}>{item.code}</option>)}
          </select>
        </Field>
        <Field label="Frequency">
          <select className={inputClass} value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })}>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
        </Field>
        <Field label="Next due date">
          <input className={inputClass} type="date" value={form.nextDueDate} onChange={(e) => setForm({ ...form, nextDueDate: e.target.value })} required />
        </Field>
        <Field label="Owner">
          <select className={inputClass} value={form.memberId || ''} onChange={(e) => setForm({ ...form, memberId: e.target.value || null })}>
            <option value="">Shared</option>
            {data.familyMembers.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}
          </select>
        </Field>
        <Field label="Budget category">
          <select className={inputClass} value={form.categoryId || ''} onChange={(e) => setForm({ ...form, categoryId: e.target.value || null })}>
            {data.budgetCategories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
        </Field>
        <Field label="Last paid date">
          <input className={inputClass} type="date" value={form.lastPaidDate} onChange={(e) => setForm({ ...form, lastPaidDate: e.target.value })} required />
        </Field>
        <Field label="Autopay enabled">
          <select className={inputClass} value={String(form.autopay)} onChange={(e) => setForm({ ...form, autopay: e.target.value === 'true' })}>
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </Field>
      </div>
    </ModalForm>
  );
}

export function MemberForm({ initialValues, onSubmit }) {
  const [form, setForm] = useState(
    initialValues || {
      name: '',
      role: 'Family Member',
      color: 'from-blue-500 to-cyan-400',
    },
  );

  return (
    <ModalForm onSubmit={() => onSubmit(form)} submitLabel={initialValues ? 'Save member' : 'Add member'}>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Name">
          <input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </Field>
        <Field label="Role">
          <input className={inputClass} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required />
        </Field>
        <Field label="Profile theme">
          <select className={inputClass} value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })}>
            {memberGradientOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </Field>
      </div>
    </ModalForm>
  );
}

export function NetWorthItemForm({ kind, initialValues, onSubmit }) {
  const { data, currencies } = useAppContext();
  const [form, setForm] = useState(
    initialValues || {
      name: '',
      type: kind === 'assets' ? 'Cash' : 'Credit Card',
      value: '',
      currency: 'USD',
      memberId: data.familyMembers[0]?.id || '',
      institution: '',
    },
  );

  return (
    <ModalForm onSubmit={() => onSubmit({ ...form, value: Number(form.value) })} submitLabel={initialValues ? 'Save item' : `Add ${kind === 'assets' ? 'asset' : 'liability'}`}>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Name">
          <input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </Field>
        <Field label="Type">
          <input className={inputClass} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} required />
        </Field>
        <Field label="Value">
          <input className={inputClass} type="number" min="0" step="0.01" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} required />
        </Field>
        <Field label="Currency">
          <select className={inputClass} value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}>
            {currencies.map((item) => <option key={item.code}>{item.code}</option>)}
          </select>
        </Field>
        <Field label="Owner">
          <select className={inputClass} value={form.memberId || ''} onChange={(e) => setForm({ ...form, memberId: e.target.value || null })}>
            <option value="">Shared</option>
            {data.familyMembers.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}
          </select>
        </Field>
        <Field label="Institution">
          <input className={inputClass} value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} />
        </Field>
      </div>
    </ModalForm>
  );
}
