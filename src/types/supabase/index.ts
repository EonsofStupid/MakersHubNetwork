import { Database } from '@/integrations/supabase/types';

// Extract public schema for easier access
export type PublicSchema = Database['public'];

// Table types
export type Tables = PublicSchema['Tables'];
export type TableName = keyof Tables;

// Row types for each table
export type Row<T extends TableName> = Tables[T]['Row'];
export type Insert<T extends TableName> = Tables[T]['Insert'];
export type Update<T extends TableName> = Tables[T]['Update'];

// Specific table types
export type Theme = Row<'themes'>;
export type ThemeToken = Row<'theme_tokens'>;
export type ThemeComponent = Row<'theme_components'>;
export type UserRole = Row<'user_roles'>;

// Query response types
export interface QueryResponse<T> {
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