
import { AdminPermission } from "@/admin/types/admin.types";

/**
 * Map of admin sections to required permissions
 */
export const sectionPermissions: Record<string, AdminPermission> = {
  overview: "admin:access",
  users: "users:view",
  content: "content:view",
  builds: "builds:view",
  "data-maestro": "data:view",
  themes: "themes:view",
  settings: "settings:view",
  analytics: "admin:access"
};

/**
 * Maps a user role to a set of admin permissions
 */
export function mapRoleToPermissions(role: string): AdminPermission[] {
  switch (role) {
    case 'super_admin':
      return ['super_admin:all'] as AdminPermission[];
      
    case 'admin':
      return [
        'admin:access',
        'content:view',
        'content:manage',
        'users:view',
        'builds:view',
        'builds:approve',
        'settings:view',
        'data:view',
        'themes:view'
      ] as AdminPermission[];
      
    case 'content_manager':
      return [
        'admin:access',
        'content:view',
        'content:manage'
      ] as AdminPermission[];
      
    case 'build_moderator':
      return [
        'admin:access',
        'builds:view',
        'builds:approve'
      ] as AdminPermission[];
      
    default:
      return [] as AdminPermission[];
  }
}

/**
 * Checks if a specific permission is included in a list of permissions
 */
export function hasPermission(
  permissions: AdminPermission[],
  requiredPermission: AdminPermission
): boolean {
  // Super admin has all permissions
  if (permissions.includes('super_admin:all')) {
    return true;
  }
  
  return permissions.includes(requiredPermission);
}
