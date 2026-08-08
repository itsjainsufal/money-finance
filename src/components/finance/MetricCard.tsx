import type { LucideIcon } from 'lucide-react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string;
  hint: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
}

export function MetricCard({ title, value, hint, icon: Icon, trend = 'neutral' }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <CardTitle className="mt-2 text-3xl">{value}</CardTitle>
        </div>
        <div className="rounded-2xl bg-primary/10 p-3 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold',
            trend === 'up' && 'bg-success/10 text-success',
            trend === 'down' && 'bg-danger/10 text-danger',
            trend === 'neutral' && 'bg-muted text-muted-foreground',
          )}
        >
          {trend === 'up' ? <ArrowUpRight className="h-3.5 w-3.5" /> : null}
          {trend === 'down' ? <ArrowDownRight className="h-3.5 w-3.5" /> : null}
          {hint}
        </div>
      </CardContent>
    </Card>
  );
}
