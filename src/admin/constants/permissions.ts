
import { Permission } from '@/shared/types/user';

export type AdminPermissionValue = 
  | 'admin:access'
  | 'admin:users:read'
  | 'admin:users:write'
  | 'admin:themes:read'
  | 'admin:themes:write'
  | 'admin:layouts:read'
  | 'admin:layouts:write'
  | 'admin:content:read'
  | 'admin:content:write'
  | 'admin:system:read'
  | 'admin:system:write';

// Admin permission constants
export const ADMIN_PERMISSIONS = {
  ACCESS: 'admin:access' as AdminPermissionValue,
  USERS_READ: 'admin:users:read' as AdminPermissionValue,
  USERS_WRITE: 'admin:users:write' as AdminPermissionValue,
  THEMES_READ: 'admin:themes:read' as AdminPermissionValue,
  THEMES_WRITE: 'admin:themes:write' as AdminPermissionValue,
  LAYOUTS_READ: 'admin:layouts:read' as AdminPermissionValue,
  LAYOUTS_WRITE: 'admin:layouts:write' as AdminPermissionValue,
  CONTENT_READ: 'admin:content:read' as AdminPermissionValue,
  CONTENT_WRITE: 'admin:content:write' as AdminPermissionValue,
  SYSTEM_READ: 'admin:system:read' as AdminPermissionValue,
  SYSTEM_WRITE: 'admin:system:write' as AdminPermissionValue,
};
