
import { AdminPermission } from "@/admin/types/admin.types";

/**
 * Map section names to their required permissions
 * Used for both navigation and feature access control
 */
export const sectionPermissionMap: Record<string, AdminPermission> = {
  'overview': 'admin:access',
  'users': 'users:view',
  'content': 'content:view',
  'builds': 'builds:view',
  'data': 'data:view',
  'themes': 'themes:view',
  'settings': 'settings:view',
  'analytics': 'admin:access'
};

/**
 * Check if the specified permissions include admin access
 * @param permissions Array of permissions to check
 */
export function hasAdminAccess(permissions: AdminPermission[]): boolean {
  return permissions.some(p => 
    p === 'admin:access' || 
    p === 'admin:view' || 
    p === 'super_admin:all'
  );
}

/**
 * Map a permission to its display name
 * @param permission Permission to get display name for
 */
export function getPermissionDisplayName(permission: AdminPermission): string {
  const displayNames: Record<AdminPermission, string> = {
    'admin:access': 'Admin Access',
    'admin:view': 'View Admin Panel',
    'admin:edit': 'Edit Admin Settings',
    'content:view': 'View Content',
    'content:edit': 'Edit Content',
    'content:delete': 'Delete Content',
    'users:view': 'View Users',
    'users:edit': 'Edit Users',
    'users:delete': 'Delete Users',
    'builds:view': 'View Builds',
    'builds:approve': 'Approve Builds',
    'builds:reject': 'Reject Builds',
    'themes:view': 'View Themes',
    'themes:edit': 'Edit Themes',
    'themes:delete': 'Delete Themes',
    'data:view': 'View Data',
    'data:import': 'Import/Export Data',
    'settings:view': 'View Settings',
    'settings:edit': 'Edit Settings',
    'super_admin:all': 'All Permissions'
  };
  
  return displayNames[permission] || permission;
}

/**
 * Group permissions by category for the UI
 */
export function getPermissionGroups() {
  return [
    {
      name: 'Admin',
      permissions: ['admin:access', 'admin:view', 'admin:edit'] as AdminPermission[]
    },
    {
      name: 'Content',
      permissions: ['content:view', 'content:edit', 'content:delete'] as AdminPermission[]
    },
    {
      name: 'Users',
      permissions: ['users:view', 'users:edit', 'users:delete'] as AdminPermission[]
    },
    {
      name: 'Builds',
      permissions: ['builds:view', 'builds:approve', 'builds:reject'] as AdminPermission[]
    },
    {
      name: 'Themes',
      permissions: ['themes:view', 'themes:edit', 'themes:delete'] as AdminPermission[]
    },
    {
      name: 'Data',
      permissions: ['data:view', 'data:import'] as AdminPermission[]
    },
    {
      name: 'Settings',
      permissions: ['settings:view', 'settings:edit'] as AdminPermission[]
    }
  ];
}
