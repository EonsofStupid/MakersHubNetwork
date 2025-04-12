import { Session } from '@supabase/supabase-js';

// Auth types
export type UserRole = 'user' | 'moderator' | 'admin' | 'superadmin' | 'builder';

export interface User {
  id: string;
  email: string;
  user_metadata?: {
    name?: string;
    avatar_url?: string;
    [key: string]: any;
  };
  app_metadata?: {
    roles?: string[];
    provider?: string;
    [key: string]: any;
  };
  [key: string]: any; // For other potential fields from auth providers
}

export interface UserProfile {
  id: string;
  user_id: string;
  display_name?: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  website?: string;
  roles?: UserRole[];
  [key: string]: any; // For future profile fields
}

export interface AuthStatus {
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthEvent {
  type: AuthEventType;
  timestamp: string;
  data?: {
    user?: User;
    profile?: UserProfile;
    session?: Session;
    [key: string]: any;
  };
}

export type AuthEventType = 
  | 'SIGNED_IN'
  | 'SIGNED_OUT'
  | 'USER_UPDATED'
  | 'PROFILE_FETCHED'
  | 'PROFILE_UPDATED'
  | 'SESSION_REFRESHED'
  | 'AUTH_ERROR'
  | 'AUTH_STATE_CHANGE';

// Application types
export interface AppConfig {
  features: {
    [key: string]: boolean;
  };
  theme: ThemeConfig;
  version: string;
  apiVersion: string;
}

export interface ThemeConfig {
  primary: string;
  mode: 'dark' | 'light' | 'system';
}

// Other shared types
export interface PaginationParams {
  page: number;
  perPage: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    pageCount: number;
  };
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  meta?: {
    [key: string]: any;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

// Events
export interface BaseEvent<T = any> {
  type: string;
  payload?: T;
  timestamp: string;
  source: string;
}
