
// Types related to role-based access control

import { UserRole } from "@/shared/types/shared.types";

// A permission is a fine-grained capability within the system
export type Permission = 
  // Content permissions
  | 'content:read'
  | 'content:create'
  | 'content:edit'
  | 'content:delete'
  | 'content:publish'
  // User permissions
  | 'user:read'
  | 'user:create'
  | 'user:edit'
  | 'user:delete'
  // Build permissions
  | 'build:read'
  | 'build:create'
  | 'build:edit'
  | 'build:delete'
  | 'build:approve'
  // System permissions
  | 'system:settings'
  | 'system:logs';

// Role definitions map roles to permissions
export const rolePermissions: Record<UserRole, Permission[]> = {
  'user': [
    'content:read',
    'build:read',
    'build:create'
  ],
  'moderator': [
    'content:read',
    'content:edit',
    'build:read',
    'build:edit',
    'build:approve',
    'user:read'
  ],
  'editor': [
    'content:read',
    'content:create',
    'content:edit',
    'content:publish',
    'build:read',
    'build:edit',
    'user:read'
  ],
  'admin': [
    'content:read',
    'content:create',
    'content:edit',
    'content:delete',
    'content:publish',
    'user:read',
    'user:create',
    'user:edit',
    'build:read',
    'build:create',
    'build:edit',
    'build:delete',
    'build:approve',
    'system:settings'
  ],
  'builder': [
    'content:read',
    'build:read',
    'build:create',
    'build:edit'
  ],
  'super_admin': [
    'content:read',
    'content:create',
    'content:edit',
    'content:delete',
    'content:publish',
    'user:read',
    'user:create',
    'user:edit',
    'user:delete',
    'build:read',
    'build:create',
    'build:edit',
    'build:delete',
    'build:approve',
    'system:settings',
    'system:logs'
  ]
};
