import { useEffect } from 'react';
import { BellRing, CheckCircle2, WalletCards } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useCurrency } from '@/hooks/useCurrency';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { CURRENCIES } from '@/lib/constants';

export default function Settings() {
  const { user } = useAuth();
  const { currency, setCurrency } = useCurrency();
  const { setTheme } = useTheme();
  const { preferences, updatePreferences, setOnboardingCompleted } = useUserPreferences(user?.id ?? null);

  useEffect(() => {
    if (!preferences) return;
    if (preferences.currency !== currency) {
      setCurrency(preferences.currency);
    }
    setTheme(preferences.theme);
  }, [currency, preferences, setCurrency, setTheme]);

  if (!preferences) {
    return (
      <AppShell title="Settings" subtitle="Syncing your preferences and notification controls.">
        <div className="text-sm text-muted-foreground">Loading preferences…</div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Settings" subtitle="Personalise theme, notifications, onboarding, and preferred reporting currency.">
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <CardHeader>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <WalletCards className="h-5 w-5" />
            </div>
            <CardTitle>Regional preferences</CardTitle>
            <CardDescription>Choose how finance data should appear across the app.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="block space-y-2 text-sm font-medium">
              Default currency
              <select
                className="flex h-11 w-full rounded-2xl border border-border bg-card px-4 text-sm"
                value={preferences.currency}
                onChange={(event) => {
                  const nextCurrency = event.target.value;
                  setCurrency(nextCurrency);
                  void updatePreferences({ currency: nextCurrency });
                }}
              >
                {CURRENCIES.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.code} — {option.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block space-y-2 text-sm font-medium">
              Theme mode
              <select
                className="flex h-11 w-full rounded-2xl border border-border bg-card px-4 text-sm"
                value={preferences.theme}
                onChange={(event) => {
                  const nextTheme = event.target.value as typeof preferences.theme;
                  setTheme(nextTheme);
                  void updatePreferences({ theme: nextTheme });
                }}
              >
                <option value="system">System</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </label>
            <div className="rounded-2xl border border-border/70 p-4 text-sm text-muted-foreground">
              Local storage is used when you are not signed into Supabase. Signed-in users persist settings to the user_preferences table.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <BellRing className="h-5 w-5" />
            </div>
            <CardTitle>Alerts & onboarding</CardTitle>
            <CardDescription>Persisted toggles for budget alerts, goal reminders, and summaries.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {([
              {
                key: 'notification_budget_alerts',
                label: 'Budget alerts',
                checked: preferences.notification_budget_alerts,
              },
              {
                key: 'notification_goal_reminders',
                label: 'Goal reminders',
                checked: preferences.notification_goal_reminders,
              },
              {
                key: 'notification_weekly_summary',
                label: 'Weekly summary',
                checked: preferences.notification_weekly_summary,
              },
            ] as const).map((item) => (
              <div key={item.key} className="flex items-center justify-between rounded-2xl border border-border/70 p-4">
                <div>
                  <p className="font-medium text-foreground">{item.label}</p>
                  <p className="text-sm text-muted-foreground">Persist this preference in the database for every signed-in session.</p>
                </div>
                <Switch
                  checked={item.checked}
                  onCheckedChange={(checked) => void updatePreferences({ [item.key]: checked })}
                />
              </div>
            ))}
            <div className="flex items-center justify-between rounded-2xl border border-border/70 p-4">
              <div>
                <p className="font-medium text-foreground">Onboarding status</p>
                <p className="text-sm text-muted-foreground">Mark the guided setup as complete once your family workspace is ready.</p>
              </div>
              {preferences.onboarding_completed ? (
                <Badge variant="success">Completed</Badge>
              ) : (
                <button
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                  onClick={() => void setOnboardingCompleted()}
                  type="button"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Complete setup
                </button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
