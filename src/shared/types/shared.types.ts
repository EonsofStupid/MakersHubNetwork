
/**
 * Role definitions
 */
export const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  SUPER_ADMIN: 'superadmin',
  MODERATOR: 'moderator',
  BUILDER: 'builder',
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

/**
 * Permission definitions
 */
export type Permission =
  | 'create_project'
  | 'edit_project'
  | 'delete_project'
  | 'submit_build'
  | 'access_admin'
  | 'manage_api_keys'
  | 'manage_users'
  | 'manage_roles'
  | 'manage_permissions'
  | 'view_analytics';

/**
 * RBAC route policies
 */
export const RBAC_POLICIES: Record<string, UserRole[]> = {
  '/admin': [ROLES.ADMIN, ROLES.SUPER_ADMIN],
  '/admin/users': [ROLES.ADMIN, ROLES.SUPER_ADMIN],
  '/admin/roles': [ROLES.SUPER_ADMIN],
  '/admin/permissions': [ROLES.SUPER_ADMIN],
  '/admin/keys': [ROLES.SUPER_ADMIN],
  '/admin/analytics': [ROLES.ADMIN, ROLES.SUPER_ADMIN],
  '/projects/create': [ROLES.BUILDER, ROLES.ADMIN, ROLES.SUPER_ADMIN],
  '/projects/edit': [ROLES.BUILDER, ROLES.ADMIN, ROLES.SUPER_ADMIN],
  '/projects/delete': [ROLES.ADMIN, ROLES.SUPER_ADMIN],
};

/**
 * Auth status types
 */
export const AUTH_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  AUTHENTICATED: 'authenticated',
  UNAUTHENTICATED: 'unauthenticated',
  ERROR: 'error',
} as const;

export type AuthStatus = (typeof AUTH_STATUS)[keyof typeof AUTH_STATUS];

/**
 * User profile type
 */
export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  last_sign_in_at?: string;
  user_metadata?: Record<string, unknown>;
}

/**
 * Log categories
 */
export const LOG_CATEGORY = {
  AUTH: 'auth',
  RBAC: 'rbac',
  API: 'api',
  UI: 'ui',
  SYSTEM: 'system',
  ADMIN: 'admin',
} as const;

export type LogCategory = (typeof LOG_CATEGORY)[keyof typeof LOG_CATEGORY];

/**
 * RBAC helper constants for permission groups
 */
export const RBAC = {
  adminOnly: [ROLES.ADMIN, ROLES.SUPER_ADMIN],
  superAdmins: [ROLES.SUPER_ADMIN],
  moderators: [ROLES.MODERATOR, ROLES.ADMIN, ROLES.SUPER_ADMIN],
  builders: [ROLES.BUILDER, ROLES.ADMIN, ROLES.SUPER_ADMIN],
  authenticated: [ROLES.USER, ROLES.MODERATOR, ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.BUILDER],
};

/**
 * Path policies for route protection
 */
export const PATH_POLICIES: Record<string, UserRole[]> = {
  '/admin': RBAC.adminOnly,
  '/admin/users': RBAC.adminOnly,
  '/admin/roles': RBAC.superAdmins,
  '/admin/settings': RBAC.adminOnly,
  '/admin/system': RBAC.superAdmins,
};

/**
 * User role enum for backward compatibility
 */
export enum UserRoleEnum {
  USER = 'user',
  ADMIN = 'admin',
  SUPERADMIN = 'superadmin',
  MODERATOR = 'moderator',
  BUILDER = 'builder',
}

/**
 * Log entry interface
 */
export interface LogEntry {
  id: string;
  timestamp: string;
  level: string;
  category: LogCategory;
  message: string;
  details?: Record<string, unknown>;
}

/**
 * Auth event types
 */
export type AuthEventType = 
  | 'AUTH_STATE_CHANGE'
  | 'AUTH_LINKING_REQUIRED'
  | 'AUTH_ERROR'
  | 'SIGNED_IN'
  | 'SIGNED_OUT';
