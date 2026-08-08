const today = new Date();
const formatDate = (date) => date.toISOString().split('T')[0];
const shiftDate = (days) => {
  const next = new Date(today);
  next.setDate(next.getDate() + days);
  return formatDate(next);
};

export const seedData = {
  familyMembers: [
    { id: 'member-1', name: 'Alex Rivera', role: 'Parent', color: 'from-blue-500 to-cyan-400' },
    { id: 'member-2', name: 'Jordan Rivera', role: 'Parent', color: 'from-emerald-500 to-teal-400' },
    { id: 'member-3', name: 'Mia Rivera', role: 'Teen', color: 'from-violet-500 to-fuchsia-400' },
  ],
  budgetCategories: [
    { id: 'budget-1', name: 'Housing', icon: '🏠', color: '#3b82f6', limit: 2800, currency: 'USD' },
    { id: 'budget-2', name: 'Groceries', icon: '🛒', color: '#10b981', limit: 950, currency: 'USD' },
    { id: 'budget-3', name: 'Dining', icon: '🍽️', color: '#8b5cf6', limit: 420, currency: 'USD' },
    { id: 'budget-4', name: 'Transport', icon: '🚗', color: '#06b6d4', limit: 520, currency: 'USD' },
    { id: 'budget-5', name: 'Wellness', icon: '💪', color: '#f59e0b', limit: 260, currency: 'USD' },
    { id: 'budget-6', name: 'Entertainment', icon: '🎬', color: '#ec4899', limit: 320, currency: 'USD' },
  ],
  transactions: [
    { id: 'tx-1', description: 'Primary paycheck', amount: 6200, currency: 'USD', type: 'income', categoryId: 'income', date: shiftDate(-16), memberId: 'member-1', notes: 'Monthly salary deposit' },
    { id: 'tx-2', description: 'Consulting retainer', amount: 1800, currency: 'USD', type: 'income', categoryId: 'income', date: shiftDate(-12), memberId: 'member-2', notes: 'Freelance design client' },
    { id: 'tx-3', description: 'Mortgage payment', amount: 2350, currency: 'USD', type: 'expense', categoryId: 'budget-1', date: shiftDate(-10), memberId: 'member-1', notes: 'Auto-pay from family account' },
    { id: 'tx-4', description: 'FreshMart groceries', amount: 186.35, currency: 'USD', type: 'expense', categoryId: 'budget-2', date: shiftDate(-8), memberId: 'member-2', notes: 'Weekly grocery run' },
    { id: 'tx-5', description: 'Sushi dinner', amount: 94.8, currency: 'USD', type: 'expense', categoryId: 'budget-3', date: shiftDate(-7), memberId: 'member-1', notes: 'Date night' },
    { id: 'tx-6', description: 'Fuel refill', amount: 68.4, currency: 'USD', type: 'expense', categoryId: 'budget-4', date: shiftDate(-6), memberId: 'member-2', notes: 'SUV gas top-up' },
    { id: 'tx-7', description: 'Gym membership', amount: 58, currency: 'USD', type: 'expense', categoryId: 'budget-5', date: shiftDate(-5), memberId: 'member-1', notes: 'Family fitness plan' },
    { id: 'tx-8', description: 'Cinema tickets', amount: 47.5, currency: 'USD', type: 'expense', categoryId: 'budget-6', date: shiftDate(-4), memberId: 'member-3', notes: 'Weekend movie' },
    { id: 'tx-9', description: 'Online tutoring', amount: 140, currency: 'USD', type: 'expense', categoryId: 'budget-6', date: shiftDate(-3), memberId: 'member-3', notes: 'Math coaching subscription' },
    { id: 'tx-10', description: 'Global ETF contribution', amount: 900, currency: 'USD', type: 'expense', categoryId: 'savings', date: shiftDate(-2), memberId: 'member-2', notes: 'Retirement investment transfer' },
    { id: 'tx-11', description: 'Bonus payout', amount: 950, currency: 'EUR', type: 'income', categoryId: 'income', date: shiftDate(-1), memberId: 'member-1', notes: 'Project completion bonus' },
    { id: 'tx-12', description: 'Farmer market haul', amount: 82.6, currency: 'CAD', type: 'expense', categoryId: 'budget-2', date: shiftDate(0), memberId: 'member-2', notes: 'Organic produce and snacks' },
  ],
  goals: [
    { id: 'goal-1', name: 'Japan family trip', targetAmount: 8500, currentAmount: 4725, currency: 'USD', deadline: shiftDate(180), memberId: 'member-1', color: '#8b5cf6' },
    { id: 'goal-2', name: 'Emergency buffer', targetAmount: 15000, currentAmount: 11100, currency: 'USD', deadline: shiftDate(240), memberId: 'member-2', color: '#10b981' },
    { id: 'goal-3', name: 'Mia college laptop', targetAmount: 1800, currentAmount: 940, currency: 'USD', deadline: shiftDate(75), memberId: 'member-3', color: '#3b82f6' },
  ],
  bills: [
    { id: 'bill-1', name: 'Fiber internet', amount: 89, currency: 'USD', frequency: 'monthly', nextDueDate: shiftDate(4), memberId: 'member-1', categoryId: 'budget-1', autopay: true, lastPaidDate: shiftDate(-26) },
    { id: 'bill-2', name: 'Streaming bundle', amount: 31.99, currency: 'USD', frequency: 'monthly', nextDueDate: shiftDate(7), memberId: 'member-3', categoryId: 'budget-6', autopay: false, lastPaidDate: shiftDate(-23) },
    { id: 'bill-3', name: 'Car insurance', amount: 162, currency: 'USD', frequency: 'monthly', nextDueDate: shiftDate(12), memberId: 'member-2', categoryId: 'budget-4', autopay: true, lastPaidDate: shiftDate(-18) },
    { id: 'bill-4', name: 'Water service', amount: 54.25, currency: 'USD', frequency: 'monthly', nextDueDate: shiftDate(10), memberId: 'member-1', categoryId: 'budget-1', autopay: false, lastPaidDate: shiftDate(-20) },
  ],
  assets: [
    { id: 'asset-1', name: 'Family home equity', type: 'Real Estate', value: 285000, currency: 'USD', memberId: 'member-1', institution: 'Maple Bank' },
    { id: 'asset-2', name: 'Joint high-yield savings', type: 'Cash', value: 22350, currency: 'USD', memberId: 'member-2', institution: 'Aurora Savings' },
    { id: 'asset-3', name: 'Retirement portfolio', type: 'Investments', value: 91400, currency: 'USD', memberId: 'member-2', institution: 'NorthPeak Wealth' },
    { id: 'asset-4', name: 'Travel fund', type: 'Cash', value: 4200, currency: 'USD', memberId: 'member-1', institution: 'Family Vault' },
    { id: 'asset-5', name: 'Mia savings account', type: 'Cash', value: 2600, currency: 'USD', memberId: 'member-3', institution: 'Starter Bank' },
  ],
  liabilities: [
    { id: 'liability-1', name: 'Mortgage balance', type: 'Mortgage', value: 178500, currency: 'USD', memberId: 'member-1', institution: 'Maple Bank' },
    { id: 'liability-2', name: 'SUV loan', type: 'Auto Loan', value: 11800, currency: 'USD', memberId: 'member-2', institution: 'Drive Credit' },
    { id: 'liability-3', name: 'Rewards card', type: 'Credit Card', value: 1860, currency: 'USD', memberId: 'member-1', institution: 'Cobalt Card' },
  ],
  netWorthHistory: [
    { month: '2026-03', value: 194500, currency: 'USD' },
    { month: '2026-04', value: 198100, currency: 'USD' },
    { month: '2026-05', value: 201900, currency: 'USD' },
    { month: '2026-06', value: 205600, currency: 'USD' },
    { month: '2026-07', value: 209450, currency: 'USD' },
  ],
};
