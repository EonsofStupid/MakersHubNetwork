
// String literal types
export type AuthStatus = 'AUTHENTICATED' | 'LOADING' | 'UNAUTHENTICATED';
export type BuildStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'IN_REVIEW';
export type ContentStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type PartStatus = 'ACTIVE' | 'DISCONTINUED' | 'DRAFT';
export type ThemeStatus = 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
export type UserRole = 'ADMIN' | 'USER' | 'MODERATOR' | 'SUPERADMIN';
export type ThemeContext = 'SITE' | 'ADMIN' | 'APP';
export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal' | 'success' | 'critical' | 'silent';
export type LogCategory = 'AUTH' | 'UI' | 'API' | 'STORE' | 'THEME' | 'ADMIN' | 'SYSTEM';

// Log details interface
export interface LogDetails {
  [key: string]: unknown;
}

// Base entity interface
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface AuditableEntity extends BaseEntity {
  created_by: string;
}

// Build interfaces
export interface Build extends BaseEntity {
  id: string;
  title: string;
  description: string;
  status: BuildStatus;
  submitted_by: string;
  complexity_score: number;
  parts_count: number;
  mods_count: number;
  images?: string[];
  processed_at?: string;
}

// Date range type for filtering
export interface DateRange {
  from: Date | null;
  to: Date | null;
}
