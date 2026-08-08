import type { ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { LayoutDashboard, LogOut, PiggyBank, Settings, SunMoon, Wallet } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useCurrency } from '@/hooks/useCurrency';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AppShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  actions?: ReactNode;
}

const navigation = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/finance', label: 'Finance', icon: PiggyBank },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export function AppShell({ title, subtitle, children, actions }: AppShellProps) {
  const { signOut, user } = useAuth();
  const { currency } = useCurrency();
  const { toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b border-border/80 bg-background/90 backdrop-blur">
        <div className="section-shell flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <Link className="flex items-center gap-3" to="/dashboard">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Wallet className="h-5 w-5" />
              </div>
              <div>
                <p className="font-heading text-lg font-semibold">Kutumb Cashflow</p>
                <p className="text-sm text-muted-foreground">INR-first family finance workspace</p>
              </div>
            </Link>
          </div>
          <nav className="flex flex-wrap items-center gap-2">
            {navigation.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors',
                    isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted',
                  )
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
              {currency} • {user?.email ?? 'Signed in'}
            </div>
            <Button size="icon" variant="outline" onClick={toggleTheme}>
              <SunMoon className="h-4 w-4" />
            </Button>
            <Button variant="ghost" onClick={() => void signOut()}>
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </header>
      <main className="section-shell py-8">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold lg:text-4xl">{title}</h1>
            <p className="mt-2 max-w-3xl text-muted-foreground">{subtitle}</p>
          </div>
          {actions}
        </div>
        {children}
      </main>
    </div>
  );
}
