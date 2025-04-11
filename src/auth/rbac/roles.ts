
import { Permission, UserRole } from '@/shared/types/auth.types';

// Define permissions for each role
export const rolePermissions: Record<UserRole, Permission[]> = {
  user: [
    'read:users',
  ],
  
  builder: [
    'read:users',
    'manage:builds',
    'manage:content',
  ],
  
  admin: [
    'create:users',
    'read:users',
    'update:users',
    'delete:users',
    'manage:content',
    'manage:layouts',
    'manage:settings',
    'view:admin',
    'view:analytics',
    'manage:builds',
  ],
  
  super_admin: [
    'create:users',
    'read:users',
    'update:users',
    'delete:users',
    'manage:content',
    'manage:layouts',
    'manage:settings',
    'view:admin',
    'view:analytics',
    'manage:builds',
  ],

  content_manager: [
    'read:users',
    'manage:content',
    'view:admin',
  ],
};

// Helper function to map roles to permissions
export const mapRolesToPermissions = (roles: UserRole[] = []): Permission[] => {
  const permissions: Set<Permission> = new Set();
  
  // Add permissions for each role
  roles.forEach(role => {
    if (rolePermissions[role]) {
      rolePermissions[role].forEach(permission => permissions.add(permission));
    }
  });

  return Array.from(permissions);
};
