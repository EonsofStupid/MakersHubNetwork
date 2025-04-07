
import { z } from 'zod';

// Define UserRole enum
export const UserRoleEnum = z.enum([
  'admin',
  'super_admin',
  'editor',
  'viewer',
  'user',
  'maker',
  'builder',
  'moderator',
  'service'
]);

export type UserRole = z.infer<typeof UserRoleEnum>;

// Define Auth Status enum
export const AuthStatusEnum = z.enum([
  'idle',
  'loading',
  'authenticated',
  'unauthenticated',
  'error',
]);

export type AuthStatus = z.infer<typeof AuthStatusEnum>;

// Define Auth Event types
export const AuthEventTypeEnum = z.enum([
  'SIGNED_IN',
  'SIGNED_OUT',
  'USER_UPDATED',
  'SESSION_REFRESHED',
  'PASSWORD_RECOVERY',
  'TOKEN_REFRESHED',
  'USER_DELETED',
  'AUTH_SIGNED_IN',
  'AUTH_SIGNED_OUT'
]);

export type AuthEventType = z.infer<typeof AuthEventTypeEnum>;

export interface AuthEvent {
  type: AuthEventType;
  payload?: Record<string, unknown>;
}

export type AuthEventListener = (event: AuthEvent) => void;

export const ADMIN_ROLES: UserRole[] = ['admin', 'super_admin'];

export function hasRequiredRole(userRoles: UserRole[], requiredRole: UserRole): boolean {
  // Allow admin roles to access any role's permissions
  if (userRoles.some(role => ADMIN_ROLES.includes(role))) {
    return true;
  }
  
  // Check if the user has the specific required role
  return userRoles.includes(requiredRole);
}
