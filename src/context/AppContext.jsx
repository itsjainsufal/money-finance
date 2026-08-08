import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { seedData } from '../data/seed';
import {
  addFrequencyToDate,
  calculateBudgetSpend,
  convertAmount,
  currencyOptions,
  exchangeRates,
  formatCurrency,
  getAdvisorInsights,
  getCashflowHistory,
  getMonthKey,
  getMonthlySpendingByCategory,
  getNetWorthTotals,
  normalizeAmount,
  sumTransactions,
} from '../utils/finance';

const STORAGE_KEY = 'money-finance-app-state-v1';
const AppContext = createContext(null);

const createId = (prefix) => `${prefix}-${crypto.randomUUID()}`;
const monthKey = () => getMonthKey();

const cloneSeed = () => JSON.parse(JSON.stringify(seedData));

const syncHistory = (nextData) => {
  // History snapshots are stored in a USD base currency and converted only when displayed.
  const { netWorth } = getNetWorthTotals(nextData.assets, nextData.liabilities, 'USD');
  const currentMonth = monthKey();
  const history = [...nextData.netWorthHistory];
  const latest = history[history.length - 1];
  if (latest?.month === currentMonth) {
    latest.value = normalizeAmount(netWorth);
  } else {
    history.push({ month: currentMonth, value: normalizeAmount(netWorth), currency: 'USD' });
  }
  return { ...nextData, netWorthHistory: history };
};

const getInitialState = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return { theme: 'light', currency: 'USD', data: syncHistory(cloneSeed()) };
  try {
    const parsed = JSON.parse(saved);
    return {
      theme: parsed.theme || 'light',
      currency: parsed.currency || 'USD',
      data: syncHistory(parsed.data || cloneSeed()),
    };
  } catch {
    return { theme: 'light', currency: 'USD', data: syncHistory(cloneSeed()) };
  }
};

export function AppProvider({ children }) {
  const [appState, setAppState] = useState(getInitialState);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', appState.theme === 'dark');
    document.body.classList.toggle('dark', appState.theme === 'dark');
  }, [appState.theme]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  }, [appState]);

  const updateData = (updater, { syncNetWorth = false } = {}) => {
    setAppState((current) => {
      const nextData = typeof updater === 'function' ? updater(current.data) : updater;
      return {
        ...current,
        data: syncNetWorth ? syncHistory(nextData) : nextData,
      };
    });
  };

  const actions = {
    setTheme: (theme) => setAppState((current) => ({ ...current, theme })),
    toggleTheme: () =>
      setAppState((current) => ({
        ...current,
        theme: current.theme === 'dark' ? 'light' : 'dark',
      })),
    setCurrency: (currency) => setAppState((current) => ({ ...current, currency })),
    resetDemoData: () =>
      setAppState((current) => ({
        theme: current.theme,
        currency: current.currency,
        data: syncHistory(cloneSeed()),
      })),
    addBudget: (budget) =>
      updateData((data) => ({
        ...data,
        budgetCategories: [{ ...budget, id: createId('budget') }, ...data.budgetCategories],
      })),
    updateBudget: (budgetId, changes) =>
      updateData((data) => ({
        ...data,
        budgetCategories: data.budgetCategories.map((budget) =>
          budget.id === budgetId ? { ...budget, ...changes } : budget,
        ),
      })),
    deleteBudget: (budgetId) =>
      updateData((data) => ({
        ...data,
        budgetCategories: data.budgetCategories.filter((budget) => budget.id !== budgetId),
      })),
    addTransaction: (transaction) =>
      updateData((data) => ({
        ...data,
        transactions: [{ ...transaction, id: createId('tx') }, ...data.transactions],
      })),
    updateTransaction: (transactionId, changes) =>
      updateData((data) => ({
        ...data,
        transactions: data.transactions.map((transaction) =>
          transaction.id === transactionId ? { ...transaction, ...changes } : transaction,
        ),
      })),
    deleteTransaction: (transactionId) =>
      updateData((data) => ({
        ...data,
        transactions: data.transactions.filter((transaction) => transaction.id !== transactionId),
      })),
    addGoal: (goal) =>
      updateData((data) => ({
        ...data,
        goals: [{ ...goal, id: createId('goal') }, ...data.goals],
      })),
    updateGoal: (goalId, changes) =>
      updateData((data) => ({
        ...data,
        goals: data.goals.map((goal) => (goal.id === goalId ? { ...goal, ...changes } : goal)),
      })),
    deleteGoal: (goalId) =>
      updateData((data) => ({
        ...data,
        goals: data.goals.filter((goal) => goal.id !== goalId),
      })),
    addBill: (bill) =>
      updateData((data) => ({
        ...data,
        bills: [{ ...bill, id: createId('bill') }, ...data.bills],
      })),
    updateBill: (billId, changes) =>
      updateData((data) => ({
        ...data,
        bills: data.bills.map((bill) => (bill.id === billId ? { ...bill, ...changes } : bill)),
      })),
    deleteBill: (billId) =>
      updateData((data) => ({
        ...data,
        bills: data.bills.filter((bill) => bill.id !== billId),
      })),
    markBillPaid: (billId) =>
      updateData((data) => ({
        ...data,
        bills: data.bills.map((bill) =>
          bill.id === billId
            ? {
                ...bill,
                lastPaidDate: new Date().toISOString().split('T')[0],
                nextDueDate: addFrequencyToDate(bill.nextDueDate, bill.frequency),
              }
            : bill,
        ),
      })),
    addMember: (member) =>
      updateData((data) => ({
        ...data,
        familyMembers: [{ ...member, id: createId('member') }, ...data.familyMembers],
      })),
    updateMember: (memberId, changes) =>
      updateData((data) => ({
        ...data,
        familyMembers: data.familyMembers.map((member) =>
          member.id === memberId ? { ...member, ...changes } : member,
        ),
      })),
    deleteMember: (memberId) =>
      updateData(
        (data) => ({
          ...data,
          familyMembers: data.familyMembers.filter((member) => member.id !== memberId),
          transactions: data.transactions.map((transaction) =>
            transaction.memberId === memberId ? { ...transaction, memberId: null } : transaction,
          ),
          goals: data.goals.map((goal) => (goal.memberId === memberId ? { ...goal, memberId: null } : goal)),
          bills: data.bills.map((bill) => (bill.memberId === memberId ? { ...bill, memberId: null } : bill)),
          assets: data.assets.map((asset) => (asset.memberId === memberId ? { ...asset, memberId: null } : asset)),
          liabilities: data.liabilities.map((liability) =>
            liability.memberId === memberId ? { ...liability, memberId: null } : liability,
          ),
        }),
        { syncNetWorth: true },
      ),
    addNetWorthItem: (kind, item) =>
      updateData(
        (data) => ({
          ...data,
          [kind]: [{ ...item, id: createId(kind === 'assets' ? 'asset' : 'liability') }, ...data[kind]],
        }),
        { syncNetWorth: true },
      ),
    updateNetWorthItem: (kind, itemId, changes) =>
      updateData(
        (data) => ({
          ...data,
          [kind]: data[kind].map((item) => (item.id === itemId ? { ...item, ...changes } : item)),
        }),
        { syncNetWorth: true },
      ),
    deleteNetWorthItem: (kind, itemId) =>
      updateData(
        (data) => ({
          ...data,
          [kind]: data[kind].filter((item) => item.id !== itemId),
        }),
        { syncNetWorth: true },
      ),
  };

  const derived = useMemo(() => {
    const currency = appState.currency;
    const currentMonth = monthKey();
    const monthlyIncome = sumTransactions(appState.data.transactions, 'income', currency, currentMonth);
    const monthlyExpenses = sumTransactions(appState.data.transactions, 'expense', currency, currentMonth);
    const budgetsWithProgress = appState.data.budgetCategories.map((budget) => {
      const spent = calculateBudgetSpend(appState.data.transactions, budget.id, currency, currentMonth);
      const limit = convertAmount(budget.limit, budget.currency, currency);
      return {
        ...budget,
        spent,
        limit,
        progress: limit ? spent / limit : 0,
        remaining: limit - spent,
      };
    });

    const totalGoalTarget = appState.data.goals.reduce(
      (sum, goal) => sum + convertAmount(goal.targetAmount, goal.currency, currency),
      0,
    );
    const totalGoalSaved = appState.data.goals.reduce(
      (sum, goal) => sum + convertAmount(goal.currentAmount, goal.currency, currency),
      0,
    );
    const netWorthTotals = getNetWorthTotals(appState.data.assets, appState.data.liabilities, currency);

    const upcomingBills = [...appState.data.bills].sort(
      (a, b) => new Date(a.nextDueDate) - new Date(b.nextDueDate),
    );

    return {
      monthlyIncome,
      monthlyExpenses,
      monthlySavings: monthlyIncome - monthlyExpenses,
      budgetsWithProgress,
      totalGoalTarget,
      totalGoalSaved,
      netWorthTotals,
      upcomingBills,
      spendingByCategory: getMonthlySpendingByCategory(
        appState.data.transactions,
        appState.data.budgetCategories,
        currency,
        currentMonth,
      ),
      cashflowHistory: getCashflowHistory(appState.data.transactions, currency),
      advisorInsights: getAdvisorInsights(appState.data, currency),
      formattedNetWorthHistory: appState.data.netWorthHistory.map((point) => ({
        ...point,
        value: convertAmount(point.value, point.currency, currency),
        label: point.month,
      })),
    };
  }, [appState]);

  const value = {
    theme: appState.theme,
    currency: appState.currency,
    currencies: currencyOptions,
    exchangeRates,
    data: appState.data,
    derived,
    formatCurrency: (amount, currencyCode = appState.currency) => formatCurrency(amount, currencyCode),
    convertAmount: (amount, from, to = appState.currency) => convertAmount(amount, from, to),
    ...actions,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
