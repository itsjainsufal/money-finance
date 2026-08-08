import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Transaction } from '@/types/database';

export function useTransactions(familyId: string | null) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    if (!familyId) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const { data, error: queryError } = await supabase
        .from('transactions')
        .select('*')
        .eq('family_id', familyId)
        .order('date', { ascending: false });

      if (queryError) throw queryError;
      setTransactions(data ?? []);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  }, [familyId]);

  useEffect(() => {
    void fetchTransactions();
  }, [fetchTransactions]);

  async function addTransaction(transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error: mutationError } = await supabase
      .from('transactions')
      .insert(transaction)
      .select()
      .single();

    if (mutationError) throw mutationError;
    setTransactions((previous) => [data, ...previous]);
    return data;
  }

  async function updateTransaction(
    id: string,
    updates: Partial<Omit<Transaction, 'id' | 'created_at' | 'updated_at'>>,
  ) {
    const { data, error: mutationError } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (mutationError) throw mutationError;
    setTransactions((previous) => previous.map((item) => (item.id === id ? data : item)));
    return data;
  }

  async function deleteTransaction(id: string) {
    const { error: mutationError } = await supabase.from('transactions').delete().eq('id', id);
    if (mutationError) throw mutationError;
    setTransactions((previous) => previous.filter((item) => item.id !== id));
  }

  return {
    transactions,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refetch: fetchTransactions,
  };
}
