import type { Budget, Transaction } from '@/types/database';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface BudgetListProps {
  budgets: Budget[];
  transactions: Transaction[];
  formatCurrency: (value: number) => string;
}

export function BudgetList({ budgets, transactions, formatCurrency }: BudgetListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget control tower</CardTitle>
        <CardDescription>Monitor category burn against monthly and yearly targets.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {budgets.length === 0 ? (
          <p className="text-sm text-muted-foreground">No budgets yet. Create your first limit from Settings or Supabase.</p>
        ) : (
          budgets.map((budget) => {
            const spent = transactions
              .filter((transaction) => transaction.type === 'expense' && transaction.category === budget.category)
              .reduce((total, transaction) => total + transaction.amount, 0);
            const progress = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
            return (
              <div key={budget.id} className="space-y-2 rounded-2xl border border-border/70 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">{budget.category}</p>
                    <p className="text-sm text-muted-foreground">{budget.period} allowance</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(spent)}</p>
                    <p className="text-sm text-muted-foreground">of {formatCurrency(budget.amount)}</p>
                  </div>
                </div>
                <Progress value={progress} />
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
