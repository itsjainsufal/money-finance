import { Target } from 'lucide-react';
import type { FinancialGoal } from '@/types/database';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatDate } from '@/lib/constants';

interface GoalGridProps {
  goals: FinancialGoal[];
  formatCurrency: (value: number) => string;
}

export function GoalGrid({ goals, formatCurrency }: GoalGridProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Family goals</CardTitle>
        <CardDescription>Track long-term targets like education, travel, and emergency reserves.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-2">
        {goals.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">
            Add a savings goal in Supabase to see milestone tracking here.
          </div>
        ) : (
          goals.map((goal) => {
            const progress = goal.target_amount > 0 ? (goal.current_amount / goal.target_amount) * 100 : 0;
            return (
              <div key={goal.id} className="rounded-3xl border border-border/70 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{goal.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{goal.description ?? 'Structured family milestone'}</p>
                  </div>
                  <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                    <Target className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-5 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{formatCurrency(goal.current_amount)}</span>
                    <span className="text-muted-foreground">{formatCurrency(goal.target_amount)}</span>
                  </div>
                  <Progress value={progress} />
                  <p className="text-xs text-muted-foreground">
                    {goal.deadline ? `Target date: ${formatDate(goal.deadline)}` : 'No deadline set'}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
