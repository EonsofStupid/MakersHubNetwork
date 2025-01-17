import { Database } from './database.types';

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

// Theme-related types
export type ThemeStatus = 'draft' | 'published' | 'archived';

export interface Theme extends Row<'themes'> {
  name: string;
  description?: string;
  status: ThemeStatus;
  is_default: boolean;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  published_at?: string;
  version: number;
}

export interface ThemeToken extends Row<'theme_tokens'> {
  theme_id: string;
  category: string;
  token_name: string;
  token_value: string;
  fallback_value?: string;
  description?: string;
}

export interface ThemeComponent extends Row<'theme_components'> {
  theme_id: string;
  component_name: string;
  styles: Record<string, any>;
}

// Subscription callback type
export type SubscriptionCallback<T extends TableName> = (payload: {
  new: Row<T>;
  old: Row<T> | null;
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
}) => void;