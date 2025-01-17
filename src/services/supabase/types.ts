import { PostgrestError } from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/types';

// Database schema types
export type Tables = Database['public']['Tables'];
export type TableName = keyof Tables;
export type Row<T extends TableName> = Tables[T]['Row'];
export type Insert<T extends TableName> = Tables[T]['Insert'];
export type Update<T extends TableName> = Tables[T]['Update'];

// Service response types
export type ServiceResponse<T> = {
  data: T | null;
  error: PostgrestError | null;
  status: number;
};

// Query options type
export type QueryOptions = {
  columns?: string;
  filter?: Record<string, any>;
};

// Subscription types
export type SubscriptionCallback<T extends TableName> = (payload: {
  new: Row<T>;
  old: Row<T> | null;
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
}) => void;

export type SubscriptionChannel = {
  unsubscribe: () => void;
};