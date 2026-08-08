export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Profile {
  id: string;
  unique_id: string;
  full_name: string;
  family_id: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Family {
  id: string;
  name: string;
  admin_id: string;
  invite_code: string;
  invite_expires_at: string | null;
  invite_max_uses: number | null;
  invite_uses: number;
  created_at: string;
}

export interface FamilyMember {
  id: string;
  family_id: string;
  user_id: string;
  role: 'admin' | 'member';
  joined_at: string;
}

export interface FamilyInvite {
  id: string;
  family_id: string;
  code: string;
  created_by: string;
  expires_at: string | null;
  max_uses: number | null;
  uses: number;
  status: 'active' | 'expired' | 'revoked';
  created_at: string;
}

export interface Transaction {
  id: string;
  family_id: string;
  user_id: string;
  amount: number;
  description: string;
  category: string;
  type: 'income' | 'expense';
  date: string;
  is_recurring: boolean;
  created_at: string;
  updated_at: string;
}

export interface RecurringTransaction {
  id: string;
  family_id: string;
  user_id: string;
  amount: number;
  description: string;
  category: string;
  type: 'income' | 'expense';
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  next_run_at: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Budget {
  id: string;
  family_id: string;
  category: string;
  amount: number;
  period: 'monthly' | 'yearly';
  created_at: string;
  updated_at: string;
}

export interface FinancialGoal {
  id: string;
  family_id: string;
  user_id: string;
  title: string;
  description: string | null;
  target_amount: number;
  current_amount: number;
  deadline: string | null;
  icon: string | null;
  color: string | null;
  created_at: string;
  updated_at: string;
}

export interface Savings {
  id: string;
  user_id: string;
  type: 'fd' | 'rd' | 'pf' | 'other';
  name: string;
  amount: number;
  interest_rate: number | null;
  maturity_date: string | null;
  created_at: string;
}

export interface Investment {
  id: string;
  user_id: string;
  type: 'stocks' | 'crypto' | 'gold' | 'mutual_funds' | 'other';
  name: string;
  amount_invested: number;
  current_value: number;
  created_at: string;
}

export interface Asset {
  id: string;
  user_id: string;
  type: 'property' | 'vehicle' | 'other';
  name: string;
  value: number;
  created_at: string;
}

export interface Liability {
  id: string;
  user_id: string;
  type: 'home_loan' | 'car_loan' | 'personal_loan' | 'credit_card' | 'other';
  name: string;
  amount: number;
  interest_rate: number | null;
  created_at: string;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  theme: 'light' | 'dark' | 'system';
  currency: string;
  onboarding_completed: boolean;
  notification_budget_alerts: boolean;
  notification_goal_reminders: boolean;
  notification_weekly_summary: boolean;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'budget_alert' | 'goal_reminder' | 'weekly_summary' | 'family_update';
  read_at: string | null;
  created_at: string;
}

type TableDefinition<Row, Insert = Partial<Row>, Update = Partial<Row>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      profiles: TableDefinition<Profile>;
      families: TableDefinition<Family>;
      family_members: TableDefinition<FamilyMember>;
      family_invites: TableDefinition<FamilyInvite>;
      transactions: TableDefinition<Transaction>;
      recurring_transactions: TableDefinition<RecurringTransaction>;
      budgets: TableDefinition<Budget>;
      financial_goals: TableDefinition<FinancialGoal>;
      savings: TableDefinition<Savings>;
      investments: TableDefinition<Investment>;
      assets: TableDefinition<Asset>;
      liabilities: TableDefinition<Liability>;
      user_preferences: TableDefinition<UserPreferences>;
      notifications: TableDefinition<Notification>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
