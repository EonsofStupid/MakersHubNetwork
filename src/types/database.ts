import { Json } from '@/integrations/supabase/types';

// Base types for all tables
export interface BaseRecord {
  id: string;
  created_at?: string;
  updated_at?: string;
}

// Component-related types
export interface Component extends BaseRecord {
  name: string;
  category: string;
  description?: string;
  specifications?: Json;
  price?: number;
  trending?: boolean;
  value_rating?: number;
  image_url?: string;
}

// Sensor-related types
export interface Sensor extends BaseRecord {
  type: string;
  accuracy?: string;
  firmware_compatibility?: string[];
  printer_models?: string[];
  mounting_type?: string;
  dimensions?: string;
  weight?: string;
  probe_material?: string;
  connector_type?: string;
  has_self_test?: boolean;
  includes_alarm?: boolean;
  average_price?: number;
  site_rating?: number;
  average_rating?: number;
  image_url?: string;
  english_reviews_count?: number;
  summary?: string;
  pros?: string[];
  cons?: string[];
}

// Theme-related types
export type ThemeStatus = 'draft' | 'published' | 'archived';

export interface Theme extends BaseRecord {
  name: string;
  description?: string;
  status?: ThemeStatus;
  is_default?: boolean;
  created_by?: string;
  published_at?: string;
  version?: number;
  parent_theme_id?: string;
  composition_rules?: Json;
  cache_key?: string;
  cached_styles?: Json;
}

export interface ThemeToken extends BaseRecord {
  theme_id?: string;
  category: string;
  token_name: string;
  token_value: string;
  fallback_value?: string;
  description?: string;
}

export interface ThemeComponent extends BaseRecord {
  theme_id?: string;
  component_name: string;
  styles: Json;
}

export interface ThemeVariant extends BaseRecord {
  theme_id?: string;
  variant_type: string;
  styles?: Json;
}

export interface ThemeVersion extends BaseRecord {
  theme_id?: string;
  version: number;
  changes: Json;
  created_by?: string;
}

// User-related types
export type UserRole = 'admin' | 'editor' | 'viewer';

export interface UserRoleRecord extends BaseRecord {
  user_id?: string;
  role: UserRole;
}

export interface RolePermission extends BaseRecord {
  role: UserRole;
  action: string;
  subject: string;
}

// Database interface mapping
export interface Database {
  public: {
    Tables: {
      components: {
        Row: Component;
        Insert: Omit<Component, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Component, 'id'>>;
      };
      sensors: {
        Row: Sensor;
        Insert: Omit<Sensor, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Sensor, 'id'>>;
      };
      themes: {
        Row: Theme;
        Insert: Omit<Theme, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Theme, 'id'>>;
      };
      theme_tokens: {
        Row: ThemeToken;
        Insert: Omit<ThemeToken, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<ThemeToken, 'id'>>;
      };
      theme_components: {
        Row: ThemeComponent;
        Insert: Omit<ThemeComponent, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<ThemeComponent, 'id'>>;
      };
      theme_variants: {
        Row: ThemeVariant;
        Insert: Omit<ThemeVariant, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<ThemeVariant, 'id'>>;
      };
      theme_versions: {
        Row: ThemeVersion;
        Insert: Omit<ThemeVersion, 'id' | 'created_at'>;
        Update: Partial<Omit<ThemeVersion, 'id'>>;
      };
      user_roles: {
        Row: UserRoleRecord;
        Insert: Omit<UserRoleRecord, 'id' | 'created_at'>;
        Update: Partial<Omit<UserRoleRecord, 'id'>>;
      };
      role_permissions: {
        Row: RolePermission;
        Insert: Omit<RolePermission, 'id' | 'created_at'>;
        Update: Partial<Omit<RolePermission, 'id'>>;
      };
    };
  };
}

// Type helpers for service layer
export type TableName = keyof Database['public']['Tables'];
export type Row<T extends TableName> = Database['public']['Tables'][T]['Row'];
export type Insert<T extends TableName> = Database['public']['Tables'][T]['Insert'];
export type Update<T extends TableName> = Database['public']['Tables'][T]['Update'];

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