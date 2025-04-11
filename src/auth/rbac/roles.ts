
import { UserRole } from '@/shared/types';

// Define permissions
export type Permission =
  | 'content:view' | 'content:create' | 'content:edit' | 'content:delete' | 'content:publish'
  | 'users:view' | 'users:create' | 'users:edit' | 'users:delete'
  | 'admin:access' | 'admin:super' | 'admin:settings' | 'admin:logs'
  | 'themes:view' | 'themes:edit' | 'themes:create'
  | 'analytics:view';

// Define role permissions
export const rolePermissions: Record<UserRole, Permission[]> = {
  user: ['content:view'],
  admin: [
    'content:view', 'content:create', 'content:edit', 'content:delete', 'content:publish',
    'users:view', 'admin:access', 'themes:view', 'analytics:view'
  ],
  super_admin: [
    'content:view', 'content:create', 'content:edit', 'content:delete', 'content:publish',
    'users:view', 'users:create', 'users:edit', 'users:delete',
    'admin:access', 'admin:super', 'admin:settings', 'admin:logs',
    'themes:view', 'themes:edit', 'themes:create',
    'analytics:view'
  ],
  editor: ['content:view', 'content:create', 'content:edit'],
  content_manager: ['content:view', 'content:create', 'content:edit', 'content:delete', 'content:publish'],
  designer: ['content:view', 'themes:view', 'themes:edit'],
  support: ['content:view', 'users:view'],
  moderator: ['content:view', 'content:edit'],
  guest: ['content:view'],
  builder: ['content:view', 'content:create', 'content:edit', 'themes:view']
};
