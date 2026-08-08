import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { FinancialGoal } from '@/types/database';

export function useFinancialGoals(familyId: string | null) {
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGoals = useCallback(async () => {
    if (!familyId) {
      setGoals([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const { data, error: queryError } = await supabase
        .from('financial_goals')
        .select('*')
        .eq('family_id', familyId)
        .order('created_at', { ascending: false });

      if (queryError) throw queryError;
      setGoals(data ?? []);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'Failed to fetch goals');
    } finally {
      setLoading(false);
    }
  }, [familyId]);

  useEffect(() => {
    void fetchGoals();
  }, [fetchGoals]);

  async function addGoal(goal: Omit<FinancialGoal, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error: mutationError } = await supabase
      .from('financial_goals')
      .insert(goal)
      .select()
      .single();
    if (mutationError) throw mutationError;
    setGoals((previous) => [data, ...previous]);
    return data;
  }

  async function updateGoal(
    id: string,
    updates: Partial<Omit<FinancialGoal, 'id' | 'created_at' | 'updated_at'>>,
  ) {
    const { data, error: mutationError } = await supabase
      .from('financial_goals')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (mutationError) throw mutationError;
    setGoals((previous) => previous.map((goal) => (goal.id === id ? data : goal)));
    return data;
  }

  async function deleteGoal(id: string) {
    const { error: mutationError } = await supabase.from('financial_goals').delete().eq('id', id);
    if (mutationError) throw mutationError;
    setGoals((previous) => previous.filter((goal) => goal.id !== id));
  }

  async function fundGoal(id: string, amount: number) {
    const goal = goals.find((item) => item.id === id);
    if (!goal) throw new Error('Goal not found');
    return updateGoal(id, { current_amount: goal.current_amount + amount });
  }

  return { goals, loading, error, addGoal, updateGoal, deleteGoal, fundGoal, refetch: fetchGoals };
}
