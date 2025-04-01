
import { PermissionValue } from '@/auth/permissions';

// Re-export the permission value type for backward compatibility
export type AdminPermissionValue = PermissionValue;

// Admin-specific permission context
export interface AdminPermissionContext {
  scope: string;
  resource: string;
}

// Function to check permissions
export type AdminPermissionCheckFn = (permission: PermissionValue) => boolean;
