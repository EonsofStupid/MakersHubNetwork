
import { z } from 'zod';

// Define the user role enum as the source of truth
export const UserRoleEnum = z.enum([
  'super_admin', 
  'admin', 
  'maker', 
  'builder', 
  'user', 
  'moderator', 
  'editor'
]);

// Derive TypeScript type from Zod schema
export type UserRole = z.infer<typeof UserRoleEnum>;

// Create a checker for admin-level roles
export function isAdminRole(role: UserRole): boolean {
  return role === 'admin' || role === 'super_admin';
}

// Create a checker for specific role permissions
export function hasRequiredRole(userRoles: UserRole[], requiredRoles: UserRole[]): boolean {
  return userRoles.some(role => 
    requiredRoles.includes(role) || role === 'super_admin'
  );
}

// Export admin roles constant for easy access
export const ADMIN_ROLES: UserRole[] = ['admin', 'super_admin'];
