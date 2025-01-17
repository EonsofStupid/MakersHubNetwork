import { Database } from '@/integrations/supabase/types';

// Core database types
export type Tables = Database['public']['Tables'];
export type TableName = keyof Tables;

// Row-level types
export type Row<T extends TableName> = Tables[T]['Row'];
export type Insert<T extends TableName> = Tables[T]['Insert'];
export type Update<T extends TableName> = Tables[T]['Update'];

// Service response type
export interface ServiceResponse<T> {
  data: T | null;
  error: Error | null;
  status: number;
}

// Query options type
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

// Subscription callback type
export type SubscriptionCallback<T extends TableName> = (payload: {
  new: Row<T>;
  old: Row<T> | null;
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
}) => void;