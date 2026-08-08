import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_CURRENCY } from '@/lib/constants';
import { supabase } from '@/lib/supabase';
import type { UserPreferences } from '@/types/database';

const STORAGE_KEY = 'kutumb-user-preferences';

function buildDefaultPreferences(userId: string | null): UserPreferences {
  const timestamp = new Date().toISOString();
  return {
    id: userId ?? 'local-preferences',
    user_id: userId ?? 'guest-user',
    theme: 'system',
    currency: DEFAULT_CURRENCY,
    onboarding_completed: false,
    notification_budget_alerts: true,
    notification_goal_reminders: true,
    notification_weekly_summary: true,
    created_at: timestamp,
    updated_at: timestamp,
  };
}

export function useUserPreferences(userId: string | null) {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPreferences = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!userId) {
        const storedPreferences = window.localStorage.getItem(STORAGE_KEY);
        const nextPreferences = storedPreferences
          ? (JSON.parse(storedPreferences) as UserPreferences)
          : buildDefaultPreferences(null);
        setPreferences(nextPreferences);
        return;
      }

      const { data, error: queryError } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (queryError && queryError.code !== 'PGRST116') throw queryError;
      setPreferences(data ?? buildDefaultPreferences(userId));
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'Failed to fetch preferences');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void fetchPreferences();
  }, [fetchPreferences]);

  const updatePreferences = useCallback(
    async (updates: Partial<UserPreferences>) => {
      const current = preferences ?? buildDefaultPreferences(userId);
      const nextPreferences: UserPreferences = {
        ...current,
        ...updates,
        user_id: userId ?? current.user_id,
        updated_at: new Date().toISOString(),
      };

      setPreferences(nextPreferences);

      if (!userId) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextPreferences));
        return nextPreferences;
      }

      // Omit 'id' so the database generates it on insert; on update the
      // conflict target 'user_id' will match the existing row.
      const { id: _id, ...upsertPayload } = nextPreferences;
      const { data, error: mutationError } = await supabase
        .from('user_preferences')
        .upsert(upsertPayload, { onConflict: 'user_id' })
        .select()
        .single();

      if (mutationError) throw mutationError;
      setPreferences(data);
      return data;
    },
    [preferences, userId],
  );

  const setOnboardingCompleted = useCallback(async () => {
    await updatePreferences({ onboarding_completed: true });
  }, [updatePreferences]);

  return {
    preferences,
    loading,
    error,
    updatePreferences,
    setOnboardingCompleted,
    refetch: fetchPreferences,
  };
}
