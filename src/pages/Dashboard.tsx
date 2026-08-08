import { useMemo } from 'react';
import { ArrowRight, PiggyBank, Target, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { BudgetList } from '@/components/finance/BudgetList';
import { GoalGrid } from '@/components/finance/GoalGrid';
import { MetricCard } from '@/components/finance/MetricCard';
import { TransactionTable } from '@/components/finance/TransactionTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFamily } from '@/contexts/FamilyContext';
import { useBudgets } from '@/hooks/useBudgets';
import { useCurrency } from '@/hooks/useCurrency';
import { useFinancialGoals } from '@/hooks/useFinancialGoals';
import { useTransactions } from '@/hooks/useTransactions';

export default function Dashboard() {
  const { family, members, profile } = useFamily();
  const familyId = profile?.family_id ?? family?.id ?? null;
  const { formatCurrency } = useCurrency();
  const { transactions } = useTransactions(familyId);
  const { budgets } = useBudgets(familyId);
  const { goals } = useFinancialGoals(familyId);

  const summary = useMemo(() => {
    const income = transactions.filter((item) => item.type === 'income').reduce((sum, item) => sum + item.amount, 0);
    const expenses = transactions.filter((item) => item.type === 'expense').reduce((sum, item) => sum + item.amount, 0);
    const balance = income - expenses;
    const goalFunding = goals.reduce((sum, item) => sum + item.current_amount, 0);
    return { income, expenses, balance, goalFunding };
  }, [goals, transactions]);

  return (
    <AppShell
      title={`Welcome${profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}`}
      subtitle="See how your household is performing across shared cashflow, budgets, and long-term goals."
      actions={
        <Button asChild>
          <Link to="/finance">
            Open finance hub
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Net balance" value={formatCurrency(summary.balance)} hint="Household position this period" icon={Wallet} trend="up" />
        <MetricCard title="Income" value={formatCurrency(summary.income)} hint="All credited cashflow" icon={ArrowRight} trend="up" />
        <MetricCard title="Expenses" value={formatCurrency(summary.expenses)} hint="Tracked family spending" icon={PiggyBank} trend="down" />
        <MetricCard title="Goal funding" value={formatCurrency(summary.goalFunding)} hint="Progress toward goals" icon={Target} />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <TransactionTable transactions={transactions} formatCurrency={formatCurrency} />
        <Card>
          <CardHeader>
            <CardTitle>Family quick view</CardTitle>
            <CardDescription>Invite code, member count, and action shortcuts for your household.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="rounded-2xl border border-border/70 p-4">
              <p className="font-medium text-foreground">{family?.name ?? 'No family linked yet'}</p>
              <p className="mt-1">Members: {members.length}</p>
              <p className="mt-1">Invite code: {family?.invite_code ?? 'Create or join a family to unlock shared budgeting'}</p>
            </div>
            <Button asChild className="w-full" variant="outline">
              <Link to="/settings">Manage settings</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <BudgetList budgets={budgets} transactions={transactions} formatCurrency={formatCurrency} />
        <GoalGrid goals={goals} formatCurrency={formatCurrency} />
      </div>
    </AppShell>
  );
}
