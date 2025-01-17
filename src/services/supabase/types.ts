import type { Database } from '@/integrations/supabase/types';
import type { PostgrestError } from '@supabase/supabase-js';

export type Tables = Database['public']['Tables'];
export type TableName = keyof Tables;

export type Row<T extends TableName> = Tables[T]['Row'];
export type Insert<T extends TableName> = Tables[T]['Insert'];
export type Update<T extends TableName> = Tables[T]['Update'];

export interface ServiceResponse<T> {
  data: T | null;
  error: PostgrestError | Error | null;
  status: number;
}

export interface QueryOptions {
  columns?: string;
  filter?: Record<string, any>;
  orderBy?: {
    column: string;
    ascending?: boolean;
  };
  limit?: number;
  offset?: number;
}

export type SubscriptionCallback<T extends TableName> = (payload: {
  new: Row<T>;
  old: Row<T> | null;
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
}) => void;