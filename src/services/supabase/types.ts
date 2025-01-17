import { PostgrestError } from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/types';

type PublicSchema = Database['public'];
export type Tables = PublicSchema['Tables'];

export type TableName = keyof Tables;

// Helper type to get the Row type for a specific table
export type Row<T extends TableName> = Tables[T]['Row'];

// Helper type to get the Insert type for a specific table
export type Insert<T extends TableName> = Tables[T]['Insert'];

// Helper type to get the Update type for a specific table
export type Update<T extends TableName> = Tables[T]['Update'];

// Type for service responses
export type ServiceResponse<T> = {
  data: T | null;
  error: PostgrestError | null;
  status: number;
};

// Type for subscription callbacks
export type SubscriptionCallback<T extends TableName> = (payload: {
  new: Row<T>;
  old: Row<T> | null;
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
}) => void;

// Type for query options
export type QueryOptions = {
  columns?: string;
  filter?: Record<string, any>;
};