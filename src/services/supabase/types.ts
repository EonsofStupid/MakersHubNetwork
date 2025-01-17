import { PostgrestError } from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/types';

export type Tables = Database['public']['Tables'];
export type TableName = keyof Tables;
export type Row<T extends TableName> = Tables[T]['Row'];
export type Insert<T extends TableName> = Tables[T]['Insert'];
export type Update<T extends TableName> = Tables[T]['Update'];

export type ServiceResponse<T> = {
  data: T | null;
  error: PostgrestError | null;
  status: number;
};

export type SubscriptionCallback<T> = (payload: {
  new: T;
  old: T | null;
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
}) => void;