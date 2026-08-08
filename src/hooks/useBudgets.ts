import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Budget } from '@/types/database';

export function useBudgets(familyId: string | null) {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBudgets = useCallback(async () => {
    if (!familyId) {
      setBudgets([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const { data, error: queryError } = await supabase
        .from('budgets')
        .select('*')
        .eq('family_id', familyId)
        .order('created_at', { ascending: false });

      if (queryError) throw queryError;
      setBudgets(data ?? []);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'Failed to fetch budgets');
    } finally {
      setLoading(false);
    }
  }, [familyId]);

  useEffect(() => {
    void fetchBudgets();
  }, [fetchBudgets]);

  async function addBudget(budget: Omit<Budget, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error: mutationError } = await supabase
      .from('budgets')
      .insert(budget)
      .select()
      .single();

    if (mutationError) throw mutationError;
    setBudgets((previous) => [data, ...previous]);
    return data;
  }

  async function updateBudget(id: string, updates: Partial<Omit<Budget, 'id' | 'created_at' | 'updated_at'>>) {
    const { data, error: mutationError } = await supabase
      .from('budgets')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (mutationError) throw mutationError;
    setBudgets((previous) => previous.map((item) => (item.id === id ? data : item)));
    return data;
  }

  async function deleteBudget(id: string) {
    const { error: mutationError } = await supabase.from('budgets').delete().eq('id', id);
    if (mutationError) throw mutationError;
    setBudgets((previous) => previous.filter((item) => item.id !== id));
  }

  return { budgets, loading, error, addBudget, updateBudget, deleteBudget, refetch: fetchBudgets };
}
