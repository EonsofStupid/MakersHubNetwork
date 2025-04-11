
import { Permission, UserRole } from '@/shared/types/auth.types';

// Define all the permissions per role
export const rolePermissions: Record<UserRole, Permission[]> = {
  user: [
    'content:read'
  ],
  maker: [
    'content:read',
    'content:write',
    'builds:read',
    'builds:write'
  ],
  editor: [
    'content:read',
    'content:write',
    'content:delete',
    'builds:read'
  ],
  moderator: [
    'content:read',
    'content:write',
    'content:delete',
    'builds:read',
    'builds:write',
    'builds:approve',
    'builds:reject',
    'chats:read',
    'chats:moderate'
  ],
  admin: [
    'users:read',
    'users:write',
    'content:read',
    'content:write',
    'content:delete',
    'builds:read',
    'builds:write',
    'builds:delete',
    'builds:approve',
    'builds:reject',
    'settings:read',
    'settings:write',
    'admin:access',
    'themes:read',
    'themes:write',
    'layouts:read', 
    'layouts:write',
    'chats:read',
    'chats:write',
    'chats:moderate'
  ],
  super_admin: [
    'users:read',
    'users:write',
    'users:delete',
    'content:read',
    'content:write',
    'content:delete',
    'builds:read',
    'builds:write',
    'builds:delete',
    'builds:approve',
    'builds:reject',
    'settings:read',
    'settings:write',
    'admin:access',
    'admin:super',
    'themes:read',
    'themes:write',
    'themes:delete',
    'layouts:read',
    'layouts:write',
    'layouts:delete',
    'chats:read',
    'chats:write',
    'chats:delete',
    'chats:moderate'
  ]
};

// Function to get permissions for a specific role or roles
export function getPermissionsForRole(role: UserRole | UserRole[]): Permission[] {
  if (Array.isArray(role)) {
    // Combine all permissions from all roles and remove duplicates
    return [...new Set(role.flatMap(r => rolePermissions[r] || []))];
  }
  
  return rolePermissions[role] || [];
}

// Function to check if a role has a specific permission
export function hasPermission(role: UserRole | UserRole[], permission: Permission): boolean {
  const permissions = getPermissionsForRole(role);
  return permissions.includes(permission);
}
