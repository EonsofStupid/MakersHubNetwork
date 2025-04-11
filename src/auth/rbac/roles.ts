
import { Permission, UserRole } from '@/shared/types/user';

// Define role permissions
export const rolePermissions: Record<UserRole, Permission[]> = {
  user: ['user:profile:read', 'user:profile:write'],
  admin: [
    'admin:access',
    'admin:users:read',
    'admin:users:write',
    'admin:content:read',
    'admin:content:write',
  ],
  superadmin: [
    'admin:access',
    'admin:users:read',
    'admin:users:write',
    'admin:themes:read',
    'admin:themes:write',
    'admin:layouts:read',
    'admin:layouts:write',
    'admin:content:read',
    'admin:content:write',
    'admin:system:read',
    'admin:system:write',
  ],
  moderator: ['admin:access', 'admin:content:read'],
  builder: ['admin:access', 'admin:themes:read', 'admin:themes:write', 'admin:layouts:read', 'admin:layouts:write'],
};

// Map roles to their permissions
export function mapRolesToPermissions(roles: UserRole[]): Permission[] {
  const permissions: Permission[] = [];
  
  roles.forEach(role => {
    if (rolePermissions[role]) {
      permissions.push(...rolePermissions[role]);
    }
  });
  
  return [...new Set(permissions)]; // Remove duplicates
}
