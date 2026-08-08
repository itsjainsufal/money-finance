import { useMemo } from 'react';
import { BarChart3, CircleDollarSign, Landmark, TrendingUp } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { BudgetList } from '@/components/finance/BudgetList';
import { GoalGrid } from '@/components/finance/GoalGrid';
import { MetricCard } from '@/components/finance/MetricCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFamily } from '@/contexts/FamilyContext';
import { useBudgets } from '@/hooks/useBudgets';
import { useCurrency } from '@/hooks/useCurrency';
import { useFinancialGoals } from '@/hooks/useFinancialGoals';
import { useTransactions } from '@/hooks/useTransactions';

export default function Finance() {
  const { family, profile } = useFamily();
  const familyId = profile?.family_id ?? family?.id ?? null;
  const { formatCurrency } = useCurrency();
  const { transactions } = useTransactions(familyId);
  const { budgets } = useBudgets(familyId);
  const { goals } = useFinancialGoals(familyId);

  const categorySpend = useMemo(() => {
    const totals = transactions.reduce<Record<string, number>>((accumulator, transaction) => {
      if (transaction.type === 'expense') {
        accumulator[transaction.category] = (accumulator[transaction.category] ?? 0) + transaction.amount;
      }
      return accumulator;
    }, {});

    return Object.entries(totals)
      .sort(([, left], [, right]) => right - left)
      .slice(0, 5);
  }, [transactions]);

  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalExpenses = transactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.target_amount, 0);
  const totalCurrent = goals.reduce((sum, goal) => sum + goal.current_amount, 0);

  return (
    <AppShell
      title="Finance hub"
      subtitle="A deeper look at category spend, household runway, and family goal completion."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Budget assigned" value={formatCurrency(totalBudget)} hint="Across tracked categories" icon={CircleDollarSign} />
        <MetricCard title="Expense outflow" value={formatCurrency(totalExpenses)} hint="Current tracked spend" icon={Landmark} trend="down" />
        <MetricCard title="Goal target" value={formatCurrency(totalTarget)} hint="Long-term family target" icon={TrendingUp} />
        <MetricCard title="Goal progress" value={formatCurrency(totalCurrent)} hint="Current committed savings" icon={BarChart3} trend="up" />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <CardHeader>
            <CardTitle>Expense concentration</CardTitle>
            <CardDescription>Largest family expense categories from recent activity.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {categorySpend.length === 0 ? (
              <p className="text-sm text-muted-foreground">No expense data yet. Add transactions to unlock spend analysis.</p>
            ) : (
              categorySpend.map(([category, amount]) => {
                const share = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
                return (
                  <div key={category} className="space-y-2 rounded-2xl border border-border/70 p-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">{category}</span>
                      <span className="text-muted-foreground">{formatCurrency(amount)}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted">
                      <div className="h-2 rounded-full bg-primary" style={{ width: `${Math.min(share, 100)}%` }} />
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
        <BudgetList budgets={budgets} transactions={transactions} formatCurrency={formatCurrency} />
      </div>

      <div className="mt-8">
        <GoalGrid goals={goals} formatCurrency={formatCurrency} />
      </div>
    </AppShell>
  );
}
