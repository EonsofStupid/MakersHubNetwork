
import { Permission, UserRole } from '@/shared/types/auth.types';
import { rolePermissions } from '@/auth/rbac/roles';

// Re-export the role permissions from auth
export { rolePermissions };

// Define permission groups for easier management in the UI
export const PERMISSION_GROUPS = {
  USERS: [
    'users:read',
    'users:write',
    'users:delete'
  ] as Permission[],
  
  CONTENT: [
    'content:read',
    'content:write',
    'content:delete'
  ] as Permission[],
  
  BUILDS: [
    'builds:read',
    'builds:write',
    'builds:delete',
    'builds:approve',
    'builds:reject'
  ] as Permission[],
  
  SETTINGS: [
    'settings:read',
    'settings:write'
  ] as Permission[],
  
  ADMIN: [
    'admin:access',
    'admin:super'
  ] as Permission[],
  
  THEMES: [
    'themes:read',
    'themes:write',
    'themes:delete'
  ] as Permission[],
  
  LAYOUTS: [
    'layouts:read',
    'layouts:write',
    'layouts:delete'
  ] as Permission[],
  
  CHATS: [
    'chats:read',
    'chats:write',
    'chats:delete',
    'chats:moderate'
  ] as Permission[]
};

// Group descriptions for the UI
export const PERMISSION_GROUP_DESCRIPTIONS = {
  USERS: 'Manage user accounts and permissions',
  CONTENT: 'Create, edit, and delete content',
  BUILDS: 'Manage and approve user builds',
  SETTINGS: 'Configure system settings',
  ADMIN: 'Administrative access',
  THEMES: 'Manage visual themes',
  LAYOUTS: 'Configure page layouts',
  CHATS: 'Manage chat features and moderation'
};

// Role descriptions for the UI
export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  user: 'Basic user with limited permissions',
  maker: 'Can create and edit their own content',
  editor: 'Can edit and manage all content',
  moderator: 'Can moderate content and user interactions',
  admin: 'Has access to most admin features',
  super_admin: 'Has unrestricted access to all features'
};
