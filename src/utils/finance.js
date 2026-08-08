export const exchangeRates = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  CAD: 1.37,
  JPY: 156.1,
  AUD: 1.53,
};

export const currencyOptions = [
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'GBP', symbol: '£', label: 'British Pound' },
  { code: 'CAD', symbol: 'CA$', label: 'Canadian Dollar' },
  { code: 'JPY', symbol: '¥', label: 'Japanese Yen' },
  { code: 'AUD', symbol: 'A$', label: 'Australian Dollar' },
];

export const convertAmount = (amount, fromCurrency = 'USD', toCurrency = 'USD') => {
  const fromRate = exchangeRates[fromCurrency] || 1;
  const toRate = exchangeRates[toCurrency] || 1;
  return (Number(amount) / fromRate) * toRate;
};

export const formatCurrency = (amount, currency = 'USD') =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: Math.abs(Number(amount) || 0) > 1000 ? 0 : 2,
  }).format(Number(amount) || 0);

export const parseDateValue = (value) => {
  if (value instanceof Date) return value;
  if (typeof value === 'string' && !value.includes('T')) return new Date(`${value}T00:00:00`);
  return new Date(value);
};

export const formatDate = (value, options = { month: 'short', day: 'numeric', year: 'numeric' }) =>
  new Intl.DateTimeFormat('en-US', options).format(parseDateValue(value));

export const getMonthKey = (date = new Date()) => {
  const parsed = parseDateValue(date);
  return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, '0')}`;
};

export const isSameMonth = (date, monthKey = getMonthKey()) => getMonthKey(date) === monthKey;

export const getCategoryName = (categories, categoryId) =>
  categories.find((category) => category.id === categoryId)?.name || 'Uncategorized';

export const getMemberName = (members, memberId) =>
  members.find((member) => member.id === memberId)?.name || 'Shared';

export const calculateBudgetSpend = (transactions, categoryId, targetCurrency, monthKey = getMonthKey()) =>
  transactions
    .filter(
      (transaction) =>
        transaction.type === 'expense' &&
        transaction.categoryId === categoryId &&
        isSameMonth(transaction.date, monthKey),
    )
    .reduce(
      (total, transaction) => total + convertAmount(transaction.amount, transaction.currency, targetCurrency),
      0,
    );

export const sumTransactions = (transactions, type, targetCurrency, monthKey = getMonthKey()) =>
  transactions
    .filter((transaction) => transaction.type === type && isSameMonth(transaction.date, monthKey))
    .reduce(
      (total, transaction) => total + convertAmount(transaction.amount, transaction.currency, targetCurrency),
      0,
    );

export const getNetWorthTotals = (assets, liabilities, targetCurrency) => {
  const totalAssets = assets.reduce(
    (total, asset) => total + convertAmount(asset.value, asset.currency, targetCurrency),
    0,
  );
  const totalLiabilities = liabilities.reduce(
    (total, liability) => total + convertAmount(liability.value, liability.currency, targetCurrency),
    0,
  );

  return {
    totalAssets,
    totalLiabilities,
    netWorth: totalAssets - totalLiabilities,
  };
};

export const addFrequencyToDate = (dateString, frequency) => {
  const nextDate = parseDateValue(dateString);
  if (frequency === 'weekly') nextDate.setDate(nextDate.getDate() + 7);
  if (frequency === 'monthly') nextDate.setMonth(nextDate.getMonth() + 1);
  if (frequency === 'quarterly') nextDate.setMonth(nextDate.getMonth() + 3);
  if (frequency === 'yearly') nextDate.setFullYear(nextDate.getFullYear() + 1);
  return nextDate.toISOString().split('T')[0];
};

export const daysUntil = (dateString) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const target = parseDateValue(dateString);
  target.setHours(0, 0, 0, 0);
  return Math.round((target - start) / 86400000);
};

export const normalizeAmount = (value) => Number.parseFloat(Number(value || 0).toFixed(2));

export const getMonthlySpendingByCategory = (transactions, categories, currency, monthKey = getMonthKey()) =>
  categories
    .map((category) => ({
      name: category.name,
      color: category.color,
      value: calculateBudgetSpend(transactions, category.id, currency, monthKey),
    }))
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value);

export const getCashflowHistory = (transactions, currency) => {
  const monthMap = new Map();

  transactions.forEach((transaction) => {
    const month = getMonthKey(transaction.date);
    if (!monthMap.has(month)) {
      monthMap.set(month, { month, income: 0, expenses: 0 });
    }
    const current = monthMap.get(month);
    const converted = convertAmount(transaction.amount, transaction.currency, currency);
    if (transaction.type === 'income') current.income += converted;
    if (transaction.type === 'expense') current.expenses += converted;
  });

  return [...monthMap.values()]
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-6)
    .map((entry) => ({
      ...entry,
      savings: entry.income - entry.expenses,
      label: formatDate(`${entry.month}-01`, { month: 'short' }),
    }));
};

export const getAdvisorInsights = ({ transactions, budgetCategories, goals, bills, familyMembers }, currency) => {
  const currentMonth = getMonthKey();
  const monthlyIncome = sumTransactions(transactions, 'income', currency, currentMonth);
  const monthlyExpenses = sumTransactions(transactions, 'expense', currency, currentMonth);
  const spendingByCategory = getMonthlySpendingByCategory(transactions, budgetCategories, currency, currentMonth);
  const overBudget = budgetCategories
    .map((budget) => {
      const spent = calculateBudgetSpend(transactions, budget.id, currency, currentMonth);
      const limit = convertAmount(budget.limit, budget.currency, currency);
      return { ...budget, spent, limit, ratio: limit ? spent / limit : 0 };
    })
    .filter((budget) => budget.ratio > 1);
  const dueSoon = bills.filter((bill) => daysUntil(bill.nextDueDate) <= 7);
  const familySpend = familyMembers
    .map((member) => ({
      name: member.name,
      spend: transactions
        .filter(
          (transaction) =>
            transaction.memberId === member.id &&
            transaction.type === 'expense' &&
            isSameMonth(transaction.date, currentMonth),
        )
        .reduce(
          (total, transaction) => total + convertAmount(transaction.amount, transaction.currency, currency),
          0,
        ),
    }))
    .sort((a, b) => b.spend - a.spend);

  const insights = [];

  if (overBudget.length) {
    overBudget.forEach((budget) => {
      insights.push({
        title: `${budget.name} is over budget`,
        tone: 'warning',
        detail: `You have spent ${formatCurrency(budget.spent, currency)} against a ${formatCurrency(budget.limit, currency)} target this month. Consider pausing discretionary spend in this category.`,
      });
    });
  }

  if (spendingByCategory[0]) {
    insights.push({
      title: `${spendingByCategory[0].name} is your top spend driver`,
      tone: 'info',
      detail: `${spendingByCategory[0].name} accounts for ${formatCurrency(spendingByCategory[0].value, currency)} of tracked expenses this month. Benchmark it against last month before adjusting budgets.`,
    });
  }

  if (monthlyIncome > 0) {
    const savingsRate = Math.max(((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100, 0);
    insights.push({
      title: savingsRate >= 20 ? 'Savings rate looks healthy' : 'Savings rate could be stronger',
      tone: savingsRate >= 20 ? 'success' : 'warning',
      detail: `Your household is saving ${savingsRate.toFixed(1)}% of monthly income. Aim for 20%+ by trimming low-priority spending or automating a transfer on payday.`,
    });
  }

  const urgentGoals = goals.filter((goal) => {
    const progress = goal.targetAmount > 0 ? goal.currentAmount / goal.targetAmount : 0;
    const daysLeft = daysUntil(goal.deadline);
    return daysLeft < 120 && progress < 0.7;
  });

  urgentGoals.forEach((goal) => {
    const goalProgress = (goal.currentAmount / Math.max(goal.targetAmount, 1)) * 100;
    insights.push({
      title: `${goal.name} needs a funding boost`,
      tone: 'warning',
      detail: `Deadline is ${formatDate(goal.deadline)} and progress sits at ${goalProgress.toFixed(0)}%. A small weekly contribution can keep it on track.`,
    });
  });

  if (dueSoon.length) {
    insights.push({
      title: `${dueSoon.length} recurring bill${dueSoon.length > 1 ? 's are' : ' is'} due soon`,
      tone: 'info',
      detail: dueSoon.map((bill) => `${bill.name} (${formatDate(bill.nextDueDate, { month: 'short', day: 'numeric' })})`).join(', '),
    });
  }

  if (familySpend[0]) {
    insights.push({
      title: `${familySpend[0].name} has the highest spend this month`,
      tone: 'neutral',
      detail: `Assigned household expenses for ${familySpend[0].name} total ${formatCurrency(familySpend[0].spend, currency)}. Use member views to coach shared accountability without exposing private balances.`,
    });
  }

  return insights.slice(0, 6);
};
