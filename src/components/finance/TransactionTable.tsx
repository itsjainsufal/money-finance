import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import type { Transaction } from '@/types/database';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/constants';

interface TransactionTableProps {
  transactions: Transaction[];
  formatCurrency: (value: number) => string;
}

export function TransactionTable({ transactions, formatCurrency }: TransactionTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent cashflow</CardTitle>
        <CardDescription>Latest family entries across income and expenses.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {transactions.length === 0 ? (
          <p className="text-sm text-muted-foreground">Once transactions start syncing, they will appear here.</p>
        ) : (
          transactions.slice(0, 6).map((transaction) => (
            <div
              key={transaction.id}
              className="flex flex-col gap-3 rounded-2xl border border-border/70 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className={transaction.type === 'income' ? 'rounded-2xl bg-success/10 p-3 text-success' : 'rounded-2xl bg-danger/10 p-3 text-danger'}
                >
                  {transaction.type === 'income' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownLeft className="h-4 w-4" />}
                </div>
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    <Badge variant="outline">{transaction.category}</Badge>
                    <Badge variant="secondary">{formatDate(transaction.date)}</Badge>
                  </div>
                </div>
              </div>
              <p className={transaction.type === 'income' ? 'font-semibold text-success' : 'font-semibold text-danger'}>
                {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
              </p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
